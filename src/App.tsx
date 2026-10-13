import React, { useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  CartItem, 
  ProductCategory, 
  DiningOption, 
  PaymentMethod, 
  Order, 
  OrderStatus 
} from './types/restaurant';
import { MENU_PRODUCTS } from './data/menuData';
import { 
  fetchAllOrders, 
  saveOrder, 
  updateOrderStatus, 
  generateNextOrderNumber, 
  testSupabaseConnection, 
  getStoredSupabaseCredentials 
} from './lib/supabase';
import { Navbar } from './components/Navbar';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { CustomizeModal } from './components/CustomizeModal';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { KitchenDisplay } from './components/KitchenDisplay';
import { OrderBoardModal } from './components/OrderBoardModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { 
  Search, 
  Sparkles, 
  ShoppingBag, 
  UtensilsCrossed, 
  ChevronRight, 
  Flame, 
  Heart,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function App() {
  // Navigation View: 'kiosk' (autoatendimento), 'kitchen' (KDS), 'board' (telão)
  const [currentView, setCurrentView] = useState<'kiosk' | 'kitchen' | 'board'>('kiosk');

  // Products & Filtering
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForCustomize, setSelectedProductForCustomize] = useState<Product | null>(null);

  // Customer & Dining Info
  const [diningOption, setDiningOption] = useState<DiningOption>('dine-in');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  // Payment & Order Confirmation State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Orders in Kitchen / KDS
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Temporary feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Test Supabase connection on load & fetch initial orders
  useEffect(() => {
    const checkConn = async () => {
      const creds = getStoredSupabaseCredentials();
      if (creds.url && creds.anonKey) {
        const res = await testSupabaseConnection();
        setIsSupabaseConnected(res.success);
      } else {
        setIsSupabaseConnected(false);
      }
    };
    checkConn();
    refreshOrdersList();
  }, []);

  const refreshOrdersList = async () => {
    const list = await fetchAllOrders();
    setOrders(list);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return MENU_PRODUCTS.filter((product) => {
      const matchesCategory = 
        activeCategory === 'todos' || product.category === activeCategory;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.italianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Cart Totals
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);

  // Add Item to Cart
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    setSelectedProductForCustomize(null);
    showToast(`Adicionado: ${item.quantity}x ${item.product.name}`);
  };

  // Update Item Quantity in Cart
  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const itemTotal = item.unitPrice * newQty;
          return { ...item, quantity: newQty, itemTotal };
        }
        return item;
      })
    );
  };

  // Remove Item from Cart
  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // Proceed to Payment
  const handleProceedToPayment = () => {
    if (cart.length === 0) return;
    if (!customerName.trim()) {
      showToast('Por favor, digite seu nome para identificação do pedido');
      return;
    }
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  // Payment Success Handler: Generate Order Number & Save to Supabase
  const handlePaymentSuccess = async (method: PaymentMethod) => {
    const orderNumber = generateNextOrderNumber();
    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      orderNumber,
      customerName: customerName.trim() || 'Cliente',
      customerPhone: customerPhone.trim() || undefined,
      diningOption,
      tableNumber: tableNumber.trim() || undefined,
      items: [...cart],
      subtotal: cartTotal,
      discount: 0,
      total: cartTotal,
      paymentMethod: method,
      paymentStatus: 'paid',
      status: 'received',
      estimatedTimeMinutes: 18,
      createdAt: new Date().toISOString(),
    };

    // Save to Supabase / Local Storage
    const { order: savedOrder } = await saveOrder(newOrder);

    // Update state
    setCompletedOrder(savedOrder);
    setIsPaymentOpen(false);
    setCart([]);
    refreshOrdersList();
  };

  // Reset Totem for Next Customer
  const handleResetForNextCustomer = () => {
    setCompletedOrder(null);
    setCart([]);
    setCustomerName('');
    setTableNumber('');
    setCustomerPhone('');
    setCurrentView('kiosk');
  };

  // Update Status in Kitchen (KDS)
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    refreshOrdersList();
  };

  // Speech Announcement for Ticket Number
  const handleCallOrderNumber = (orderNumber: string, name: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = `Atenção! Pedido número ${orderNumber.replace('#', '')}, de ${name}. Seu pedido está pronto para retirada no balcão!`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Speech fallback
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white pb-24 md:pb-10">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-amber-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-amber-400 text-xs sm:text-sm font-bold animate-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* VIEW 1: KIOSK AUTOATENDIMENTO (Modo Cliente) */}
      {currentView === 'kiosk' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-8">
          
          {/* Hero Welcome Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/70 border border-stone-800 shadow-2xl p-6 sm:p-10">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
                alt="Ambiente Trattoria Italiana"
                className="w-full h-full object-cover mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Totem de Autoatendimento 100% Autônomo</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-black text-amber-100 tracking-tight leading-none">
                Benvenuti a <span className="text-amber-400">Nonna Mia</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
                Faça seu pedido diretamente na tela sem precisar de atendente. Escolha seus pratos italianos favoritos, pague no Pix ou Cartão e retire quando sua senha for chamada.
              </p>

              {/* Quick Feature Badges */}
              <div className="flex flex-wrap gap-3 pt-2 text-xs text-stone-400">
                <span className="flex items-center gap-1.5 bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-800">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                  <span>Massas Frescas e Pizzas Napoletanas</span>
                </span>
                <span className="flex items-center gap-1.5 bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-800">
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                  <span>Preparo Imediato</span>
                </span>
                <span className="flex items-center gap-1.5 bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pagamento Seguro Integrado</span>
                </span>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">
                  Cardápio Autêntico
                </h2>
                <p className="text-xs text-stone-400">
                  Selecione uma categoria ou busque pelo nome do prato
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar spaghetti, pizza, burrata..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <CategoryFilter
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </div>

          {/* Product Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-stone-400">
                {filteredProducts.length} opções disponíveis
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-stone-950 rounded-3xl border border-stone-800">
                <p className="text-base font-bold text-stone-300">
                  Nenhum prato encontrado para "{searchQuery}"
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Tente limpar a busca ou selecionar outra categoria.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('todos'); }}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Ver Todo o Cardápio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProductForCustomize(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* VIEW 2: KITCHEN DISPLAY (KDS) */}
      {currentView === 'kitchen' && (
        <KitchenDisplay
          orders={orders}
          onUpdateStatus={handleUpdateStatus}
          onRefreshOrders={refreshOrdersList}
          isSupabaseConnected={isSupabaseConnected}
          onCallOrderNumber={handleCallOrderNumber}
        />
      )}

      {/* VIEW 3: ORDER BOARD (TELÃO DE SENHAS) */}
      {currentView === 'board' && (
        <OrderBoardModal
          orders={orders}
          onBackToKiosk={() => setCurrentView('kiosk')}
          onCallOrder={handleCallOrderNumber}
        />
      )}

      {/* STICKY BOTTOM BAR FOR KIOSK (Mobile & Tablet) */}
      {currentView === 'kiosk' && cartItemCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 p-4 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 md:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white p-4 rounded-2xl font-bold flex items-center justify-between shadow-xl shadow-red-900/40 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-stone-950 text-xs font-black flex items-center justify-center">
                {cartItemCount}
              </span>
              <span className="text-sm">Ver Comanda do Pedido</span>
            </div>
            <div className="flex items-center gap-1 text-base font-black text-amber-100">
              <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* CUSTOMIZATION MODAL */}
      {selectedProductForCustomize && (
        <CustomizeModal
          product={selectedProductForCustomize}
          onClose={() => setSelectedProductForCustomize(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        diningOption={diningOption}
        onSetDiningOption={setDiningOption}
        customerName={customerName}
        onSetCustomerName={setCustomerName}
        customerPhone={customerPhone}
        onSetCustomerPhone={setCustomerPhone}
        tableNumber={tableNumber}
        onSetTableNumber={setTableNumber}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* PAYMENT MODAL */}
      {isPaymentOpen && (
        <PaymentModal
          total={cartTotal}
          customerName={customerName}
          onClose={() => setIsPaymentOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* ORDER CONFIRMATION MODAL WITH GENERATED ORDER NUMBER */}
      {completedOrder && (
        <OrderConfirmationModal
          order={completedOrder}
          onCloseAndNewOrder={handleResetForNextCustomer}
          onGoToKitchenBoard={() => {
            setCompletedOrder(null);
            setCurrentView('board');
          }}
        />
      )}

      {/* SUPABASE CONFIG MODAL */}
      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigUpdated={async () => {
          const res = await testSupabaseConnection();
          setIsSupabaseConnected(res.success);
          refreshOrdersList();
        }}
      />
    </div>
  );
}
