import React from 'react';
import { Order } from '../types/restaurant';
import { BellRing, Flame, Sparkles, Volume2, ArrowLeft } from 'lucide-react';

interface OrderBoardModalProps {
  orders: Order[];
  onBackToKiosk: () => void;
  onCallOrder: (orderNumber: string, customerName: string) => void;
}

export const OrderBoardModal: React.FC<OrderBoardModalProps> = ({
  orders,
  onBackToKiosk,
  onCallOrder,
}) => {
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col p-4 sm:p-8 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToKiosk}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Totem</span>
          </button>

          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-500 block">
              Monitor do Salão • Chamada de Senhas
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-amber-100">
              NONNA MIA CUCINA
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-4 py-2 rounded-2xl">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
            Painel Ao Vivo
          </span>
        </div>
      </div>

      {/* Main Grid: Left = Ready (Huge), Right = Preparing */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* READY ORDERS (8 COLS) */}
        <div className="lg:col-span-7 bg-gradient-to-b from-emerald-950/30 to-stone-900/60 rounded-3xl border-2 border-emerald-500/40 p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-900/60 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <BellRing className="w-7 h-7 animate-bounce" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-emerald-300">
                  PRONTO PARA RETIRADA
                </h2>
                <p className="text-xs text-stone-400">
                  Dirija-se ao balcão com seu comprovante ou número
                </p>
              </div>
            </div>
            <span className="text-lg font-black text-emerald-400 bg-emerald-950 px-4 py-1.5 rounded-full border border-emerald-800">
              {readyOrders.length}
            </span>
          </div>

          <div className="flex-1">
            {readyOrders.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center text-stone-500">
                <Sparkles className="w-12 h-12 stroke-[1] mb-2 opacity-40" />
                <p className="text-base font-semibold">Nenhum pedido aguardando no balcão no momento</p>
                <p className="text-xs text-stone-600">Os pratos prontos aparecerão aqui automaticamente</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {readyOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => onCallOrder(order.orderNumber, order.customerName)}
                    className="p-5 rounded-2xl bg-stone-900/90 border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/40 hover:scale-102 transition-transform cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs uppercase font-bold text-emerald-400 tracking-widest block">
                          SENHA
                        </span>
                        <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight">
                          {order.orderNumber}
                        </div>
                      </div>
                      <button 
                        title="Chamar com voz"
                        className="p-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 hover:bg-emerald-900"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-semibold text-stone-300">
                      <span className="text-emerald-200">{order.customerName}</span>
                      <span className="text-stone-400">
                        {order.diningOption === 'dine-in' ? (order.tableNumber || 'No Local') : 'Viagem'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PREPARING ORDERS (5 COLS) */}
        <div className="lg:col-span-5 bg-stone-900/60 rounded-3xl border border-stone-800 p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
                <Flame className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-amber-200">
                  EM PREPARAÇÃO
                </h2>
                <p className="text-xs text-stone-400">
                  Nossos chefs estão cozinhando seu pedido
                </p>
              </div>
            </div>
            <span className="text-sm font-black text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-800">
              {preparingOrders.length}
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {preparingOrders.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center text-stone-500">
                <p className="text-sm font-semibold">Cozinha livre</p>
              </div>
            ) : (
              preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono font-black text-amber-400">
                      {order.orderNumber}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-stone-200 block">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        Previsão: ~{order.estimatedTimeMinutes} min
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-stone-400 px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800">
                    {order.diningOption === 'dine-in' ? 'Mesa' : 'Viagem'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
