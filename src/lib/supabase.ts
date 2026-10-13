import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Order, OrderStatus } from '../types/restaurant';

const STORAGE_KEY_SUPABASE_URL = 'nonna_mia_supabase_url';
const STORAGE_KEY_SUPABASE_KEY = 'nonna_mia_supabase_anon_key';
const LOCAL_STORAGE_ORDERS = 'nonna_mia_orders_cache';
const LOCAL_STORAGE_ORDER_SEQ = 'nonna_mia_order_seq';

// Get current configured keys (from localStorage or environment variables)
export function getStoredSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  const localUrl = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEY_SUPABASE_KEY) || '';

  return {
    url: localUrl || envUrl,
    anonKey: localKey || envKey,
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  if (url.trim()) {
    localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_SUPABASE_URL);
  }

  if (anonKey.trim()) {
    localStorage.setItem(STORAGE_KEY_SUPABASE_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_SUPABASE_KEY);
  }

  // Reset client cache
  cachedClient = null;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { url, anonKey } = getStoredSupabaseCredentials();

  if (!url || !anonKey || url === 'https://seu-projeto.supabase.co' || anonKey === 'sua-chave-anonima-supabase') {
    return null;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
      },
    });
    return cachedClient;
  } catch (err) {
    console.warn('Falha ao inicializar cliente Supabase:', err);
    return null;
  }
}

// Check connection to Supabase
export async function testSupabaseConnection(customUrl?: string, customKey?: string): Promise<{
  success: boolean;
  message: string;
  hasTable: boolean;
}> {
  const url = customUrl !== undefined ? customUrl : getStoredSupabaseCredentials().url;
  const key = customKey !== undefined ? customKey : getStoredSupabaseCredentials().anonKey;

  if (!url || !key) {
    return {
      success: false,
      message: 'URL e Anon Key não fornecidos.',
      hasTable: false,
    };
  }

  try {
    const testClient = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await testClient.from('orders').select('id').limit(1);

    if (error) {
      if (error.code === '42P01' || error.message.toLowerCase().includes('does not exist')) {
        return {
          success: true,
          message: 'Conectado ao Supabase com sucesso! A tabela "orders" ainda não foi criada. Use o script SQL fornecido abaixo.',
          hasTable: false,
        };
      }
      return {
        success: false,
        message: `Erro do Supabase: ${error.message}`,
        hasTable: false,
      };
    }

    return {
      success: true,
      message: 'Conexão ativa! Tabela "orders" localizada e sincronizada perfeitamente.',
      hasTable: true,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erro de rede/conexão: ${err.message || 'Falha ao conectar'}`,
      hasTable: false,
    };
  }
}

// Generate sequential order number (e.g. #101, #102, #103)
export function generateNextOrderNumber(): string {
  try {
    const currentSeq = parseInt(localStorage.getItem(LOCAL_STORAGE_ORDER_SEQ) || '100', 10);
    const nextSeq = currentSeq >= 999 ? 101 : currentSeq + 1;
    localStorage.setItem(LOCAL_STORAGE_ORDER_SEQ, nextSeq.toString());
    return `#${nextSeq}`;
  } catch {
    const fallbackSeq = Math.floor(100 + Math.random() * 900);
    return `#${fallbackSeq}`;
  }
}

// Get all orders (from Supabase if connected, else fallback to localStorage)
export async function fetchAllOrders(): Promise<Order[]> {
  const client = getSupabaseClient();
  const localOrders = getLocalOrders();

  if (!client) {
    return localOrders;
  }

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Erro ao buscar pedidos no Supabase, usando armazenamento local:', error.message);
      return localOrders;
    }

    if (data && Array.isArray(data)) {
      const parsedOrders: Order[] = data.map((row: any) => ({
        id: row.id,
        orderNumber: row.order_number || `#${row.id.slice(0, 4)}`,
        customerName: row.customer_name || 'Cliente',
        customerPhone: row.customer_phone || undefined,
        diningOption: row.dining_option || 'dine-in',
        tableNumber: row.table_number || undefined,
        items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
        subtotal: Number(row.subtotal) || 0,
        discount: Number(row.discount) || 0,
        total: Number(row.total) || 0,
        paymentMethod: row.payment_method || 'pix',
        paymentStatus: row.payment_status || 'paid',
        status: (row.status as OrderStatus) || 'received',
        estimatedTimeMinutes: Number(row.estimated_time_minutes) || 18,
        createdAt: row.created_at || new Date().toISOString(),
        syncedToSupabase: true,
      }));

      // Merge and save locally as backup
      saveLocalOrders(parsedOrders);
      return parsedOrders;
    }

    return localOrders;
  } catch (err) {
    console.error('Falha na requisição ao Supabase:', err);
    return localOrders;
  }
}

// Save order to Supabase and local cache
export async function saveOrder(order: Order): Promise<{ order: Order; synced: boolean; error?: string }> {
  // Always persist locally first for instant feedback & zero delay at the kiosk
  const localList = getLocalOrders();
  const updatedLocal = [order, ...localList.filter(o => o.id !== order.id)];
  saveLocalOrders(updatedLocal);

  const client = getSupabaseClient();
  if (!client) {
    return { order: { ...order, syncedToSupabase: false }, synced: false };
  }

  try {
    const payload = {
      order_number: order.orderNumber,
      customer_name: order.customerName,
      customer_phone: order.customerPhone || null,
      dining_option: order.diningOption,
      table_number: order.tableNumber || null,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      status: order.status,
      estimated_time_minutes: order.estimatedTimeMinutes,
      created_at: order.createdAt,
    };

    const { data, error } = await client.from('orders').insert([payload]).select().single();

    if (error) {
      console.warn('Erro ao gravar pedido no Supabase:', error.message);
      return { order: { ...order, syncedToSupabase: false }, synced: false, error: error.message };
    }

    const savedOrder: Order = {
      ...order,
      id: data?.id || order.id,
      syncedToSupabase: true,
    };

    // Update with real Supabase ID if returned
    const refreshedLocal = updatedLocal.map(o => o.id === order.id ? savedOrder : o);
    saveLocalOrders(refreshedLocal);

    return { order: savedOrder, synced: true };
  } catch (err: any) {
    console.warn('Erro de rede ao salvar pedido no Supabase:', err);
    return { order: { ...order, syncedToSupabase: false }, synced: false, error: err.message };
  }
}

// Update order status (used by kitchen KDS display)
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
  const localOrders = getLocalOrders();
  const updated = localOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
  saveLocalOrders(updated);

  const client = getSupabaseClient();
  if (!client) return true;

  try {
    const { error } = await client
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.warn('Erro ao atualizar status no Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Falha de rede ao atualizar status:', err);
    return false;
  }
}

// Local storage helpers
function getLocalOrders(): Order[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_ORDERS);
    if (!data) return getInitialDemoOrders();
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : getInitialDemoOrders();
  } catch {
    return getInitialDemoOrders();
  }
}

function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error('Falha ao gravar orders no localStorage', err);
  }
}

// Provide a few demo orders for the kitchen screen on first load so it's not totally empty
function getInitialDemoOrders(): Order[] {
  const now = Date.now();
  return [
    {
      id: 'demo-1',
      orderNumber: '#102',
      customerName: 'Marco Bellini',
      diningOption: 'dine-in',
      tableNumber: 'Mesa 04',
      items: [
        {
          cartItemId: 'item-demo-1',
          product: {
            id: 'pasta-carbonara',
            name: 'Spaghetti à Carbonara Tradicional',
            italianName: 'Spaghetti alla Carbonara Tradizionale',
            description: '',
            price: 68.0,
            category: 'massas',
            imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
          },
          quantity: 1,
          cookingPoint: 'Al dente (Recomendado)',
          cheeseOption: 'Grana Padano Ralado na hora',
          selectedExtras: [{ id: 'ext-guanciale', name: 'Porção Extra de Guanciale Crocante', price: 12.0 }],
          notes: 'Bem quente e com bastante pimenta do reino',
          unitPrice: 80.0,
          itemTotal: 80.0,
        },
        {
          cartItemId: 'item-demo-2',
          product: {
            id: 'bev-aperol',
            name: 'Aperol Spritz Autêntico',
            italianName: 'Aperol Spritz Veneziano',
            description: '',
            price: 36.0,
            category: 'bebidas',
            imageUrl: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
          },
          quantity: 1,
          selectedExtras: [],
          unitPrice: 36.0,
          itemTotal: 36.0,
        }
      ],
      subtotal: 116.0,
      discount: 0,
      total: 116.0,
      paymentMethod: 'pix',
      paymentStatus: 'paid',
      status: 'preparing',
      estimatedTimeMinutes: 15,
      createdAt: new Date(now - 12 * 60000).toISOString(),
      syncedToSupabase: false,
    },
    {
      id: 'demo-2',
      orderNumber: '#101',
      customerName: 'Giulia Rossi',
      diningOption: 'takeaway',
      items: [
        {
          cartItemId: 'item-demo-3',
          product: {
            id: 'pizza-margherita',
            name: 'Pizza Margherita Verace D.O.P',
            italianName: 'Pizza Margherita Verace Napoletana',
            description: '',
            price: 58.0,
            category: 'pizzas',
            imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
          },
          quantity: 1,
          selectedExtras: [],
          notes: 'Cortada em 6 fatias para viagem',
          unitPrice: 58.0,
          itemTotal: 58.0,
        },
        {
          cartItemId: 'item-demo-4',
          product: {
            id: 'dolce-tiramisu',
            name: 'Tiramisù Clássico da Nonna',
            italianName: 'Tiramisù Tradizionale al Mascarpone',
            description: '',
            price: 32.0,
            category: 'sobremesas',
            imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
          },
          quantity: 1,
          selectedExtras: [],
          unitPrice: 32.0,
          itemTotal: 32.0,
        }
      ],
      subtotal: 90.0,
      discount: 0,
      total: 90.0,
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
      status: 'ready',
      estimatedTimeMinutes: 5,
      createdAt: new Date(now - 22 * 60000).toISOString(),
      syncedToSupabase: false,
    }
  ];
}
// SQL Script generator for Supabase with complete RLS and Storage policies
export function getSupabaseSqlSchema(): string {
  return `-- ====================================================================
-- NONNA MIA CUCINA ITALIANA: SCHEMA SUPABASE COMPLETO COM POLÍTICAS
-- Execute este script no SQL Editor do seu projeto Supabase
-- ====================================================================

-- 1. TABELA PRINCIPAL DE PEDIDOS (ORDERS)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null,
  customer_name text not null,
  customer_phone text,
  dining_option text not null default 'dine-in',
  table_number text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10,2) not null,
  discount numeric(10,2) default 0.00,
  total numeric(10,2) not null,
  payment_method text not null,
  payment_status text not null default 'paid',
  status text not null default 'received',
  estimated_time_minutes integer default 20,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices para consultas de alta performance
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_order_number on public.orders (order_number);

-- Ativação do Supabase Realtime para sincronização da cozinha
alter publication supabase_realtime add table public.orders;

-- --------------------------------------------------------------------
-- 2. POLÍTICAS DE ARMAZENAMENTO E SEGURANÇA NO BANCO DE DADOS (RLS)
-- --------------------------------------------------------------------
alter table public.orders enable row level security;

-- Política de Leitura (SELECT)
drop policy if exists "Permitir leitura dos pedidos pelo Totem" on public.orders;
create policy "Permitir leitura dos pedidos pelo Totem" 
  on public.orders for select 
  to anon, authenticated 
  using (true);

-- Política de Inserção (INSERT)
drop policy if exists "Permitir criar pedidos no Totem" on public.orders;
create policy "Permitir criar pedidos no Totem" 
  on public.orders for insert 
  to anon, authenticated 
  with check (true);

-- Política de Atualização de Status (UPDATE)
drop policy if exists "Permitir atualizar status do pedido" on public.orders;
create policy "Permitir atualizar status do pedido" 
  on public.orders for update 
  to anon, authenticated 
  using (true)
  with check (true);

-- --------------------------------------------------------------------
-- 3. POLÍTICAS DE ARMAZENAMENTO DE ARQUIVOS (SUPABASE STORAGE)
-- Bucket público para fotos de pratos, cardápio e comprovantes
-- --------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'restaurant-assets', 
  'restaurant-assets', 
  true, 
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set public = true;

-- 3.1 Política de Leitura Pública dos Arquivos (SELECT)
drop policy if exists "Imagens do restaurante são públicas" on storage.objects;
create policy "Imagens do restaurante são públicas"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'restaurant-assets');

-- 3.2 Política de Upload de Arquivos (INSERT)
drop policy if exists "Permitir upload de imagens no bucket" on storage.objects;
create policy "Permitir upload de imagens no bucket"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'restaurant-assets');

-- 3.3 Política de Atualização de Arquivos (UPDATE)
drop policy if exists "Permitir atualizar imagens no bucket" on storage.objects;
create policy "Permitir atualizar imagens no bucket"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'restaurant-assets');

-- 3.4 Política de Remoção de Arquivos (DELETE)
drop policy if exists "Permitir deletar imagens no bucket" on storage.objects;
create policy "Permitir deletar imagens no bucket"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'restaurant-assets');
`;
}
