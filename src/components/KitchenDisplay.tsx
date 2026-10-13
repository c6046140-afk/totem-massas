import React, { useState } from 'react';
import { Order, OrderStatus } from '../types/restaurant';
import { 
  ChefHat, 
  Clock, 
  Flame, 
  BellRing, 
  CheckCircle, 
  RefreshCw, 
  Search, 
  UtensilsCrossed, 
  ShoppingBag,
  Database,
  Volume2
} from 'lucide-react';

interface KitchenDisplayProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onRefreshOrders: () => void;
  isSupabaseConnected: boolean;
  onCallOrderNumber?: (orderNumber: string, customerName: string) => void;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({
  orders,
  onUpdateStatus,
  onRefreshOrders,
  isSupabaseConnected,
  onCallOrderNumber,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'dine-in' | 'takeaway'>('all');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || o.diningOption === filterType;
    return matchesSearch && matchesType;
  });

  const receivedOrders = filteredOrders.filter(o => o.status === 'received');
  const preparingOrders = filteredOrders.filter(o => o.status === 'preparing');
  const readyOrders = filteredOrders.filter(o => o.status === 'ready');
  const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered').slice(0, 8);

  const calculateMinutesAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    return Math.max(0, diff);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900 p-5 rounded-3xl border border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-500">
              Kitchen Display System (KDS)
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mt-0.5 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-amber-500" />
            <span>Gestão de Pedidos da Cozinha</span>
          </h1>
          <p className="text-xs text-stone-400">
            Acompanhamento em tempo real dos pedidos recebidos pelo Totem de Autoatendimento
          </p>
        </div>

        {/* Search, Filter & Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar comanda ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 w-48 sm:w-60"
            />
          </div>

          <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === 'all' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Todos ({filteredOrders.length})
            </button>
            <button
              onClick={() => setFilterType('dine-in')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === 'dine-in' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Mesa
            </button>
            <button
              onClick={() => setFilterType('takeaway')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === 'takeaway' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Viagem
            </button>
          </div>

          <button
            onClick={onRefreshOrders}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
            title="Atualizar lista de pedidos"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </div>

      {/* 4-Column Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* COLUMN 1: RECEBIDOS */}
        <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-4 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <h3 className="font-bold text-sm text-stone-200">1. Novos Pedidos</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold border border-blue-800">
              {receivedOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {receivedOrders.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                Nenhum novo pedido na fila
              </div>
            ) : (
              receivedOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  minutesAgo={calculateMinutesAgo(order.createdAt)}
                  nextStatus="preparing"
                  nextLabel="Iniciar Preparo"
                  onAdvance={() => onUpdateStatus(order.id, 'preparing')}
                />
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: EM PREPARO */}
        <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-4 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <h3 className="font-bold text-sm text-stone-200">2. Em Preparo</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold border border-amber-800">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {preparingOrders.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                Nenhum prato sendo preparado no momento
              </div>
            ) : (
              preparingOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  minutesAgo={calculateMinutesAgo(order.createdAt)}
                  nextStatus="ready"
                  nextLabel="Pronto p/ Retirada"
                  highlightBorder="border-amber-500/50"
                  onAdvance={() => {
                    onUpdateStatus(order.id, 'ready');
                    if (onCallOrderNumber) {
                      onCallOrderNumber(order.orderNumber, order.customerName);
                    }
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: PRONTO PARA RETIRADA */}
        <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-4 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-emerald-400 animate-bounce" />
              <h3 className="font-bold text-sm text-stone-200">3. Prontos p/ Chamar</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {readyOrders.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                Nenhum pedido aguardando retirada
              </div>
            ) : (
              readyOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  minutesAgo={calculateMinutesAgo(order.createdAt)}
                  nextStatus="delivered"
                  nextLabel="Marcar Entregue"
                  highlightBorder="border-emerald-500/60 ring-2 ring-emerald-500/20"
                  onAdvance={() => onUpdateStatus(order.id, 'delivered')}
                  onCall={() => {
                    if (onCallOrderNumber) {
                      onCallOrderNumber(order.orderNumber, order.customerName);
                    }
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* COLUMN 4: ENTREGUES */}
        <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-4 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-stone-400" />
              <h3 className="font-bold text-sm text-stone-200">4. Entregues</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 font-bold">
              {deliveredOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {deliveredOrders.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                Histórico vazio
              </div>
            ) : (
              deliveredOrders.map(order => (
                <div
                  key={order.id}
                  className="p-3 bg-stone-950/60 rounded-2xl border border-stone-800/60 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-stone-300 text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {order.customerName}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1 truncate">
                    {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Sub-component: Individual Order Ticket in KDS
interface OrderCardProps {
  order: Order;
  minutesAgo: number;
  nextStatus: OrderStatus;
  nextLabel: string;
  highlightBorder?: string;
  onAdvance: () => void;
  onCall?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  minutesAgo,
  nextLabel,
  highlightBorder = 'border-stone-800',
  onAdvance,
  onCall,
}) => {
  return (
    <div className={`p-4 bg-stone-950 rounded-2xl border ${highlightBorder} shadow-lg space-y-3`}>
      {/* Header: Order #, Time, Customer */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black font-mono text-amber-300">
              {order.orderNumber}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              order.diningOption === 'dine-in'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-stone-800 text-stone-300'
            }`}>
              {order.diningOption === 'dine-in' ? (
                <>
                  <UtensilsCrossed className="w-3 h-3" />
                  <span>{order.tableNumber || 'Mesa'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3" />
                  <span>Viagem</span>
                </>
              )}
            </span>
          </div>
          <div className="text-xs font-semibold text-stone-200 mt-0.5">
            {order.customerName}
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-400">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{minutesAgo} min atrás</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase block mt-0.5">
            {order.paymentMethod.toUpperCase()} • PAGO
          </span>
        </div>
      </div>

      {/* Items Breakdown */}
      <div className="space-y-2 border-t border-b border-stone-850 py-2.5 my-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="text-xs text-stone-200">
            <div className="flex items-start justify-between">
              <span className="font-bold">
                <span className="text-amber-400 font-black">{item.quantity}x</span> {item.product.name}
              </span>
            </div>

            {/* Customizations */}
            <div className="pl-4 text-[11px] text-stone-400 space-y-0.5 mt-0.5">
              {item.cookingPoint && (
                <div className="text-amber-300 font-medium">• {item.cookingPoint}</div>
              )}
              {item.cheeseOption && (
                <div>• {item.cheeseOption}</div>
              )}
              {item.selectedExtras.length > 0 && (
                <div className="text-stone-300 font-medium">
                  • Extras: {item.selectedExtras.map(e => e.name).join(', ')}
                </div>
              )}
              {item.notes && (
                <div className="text-red-300 font-bold italic bg-red-950/40 px-2 py-0.5 rounded border border-red-900/50 mt-1">
                  OBS: {item.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        {onCall && (
          <button
            type="button"
            onClick={onCall}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 transition-colors cursor-pointer"
            title="Chamar senha com áudio no salão"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onAdvance}
          className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 cursor-pointer text-center"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
};
