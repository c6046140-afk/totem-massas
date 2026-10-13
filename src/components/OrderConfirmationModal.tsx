import React from 'react';
import { Order } from '../types/restaurant';
import { 
  CheckCircle2, 
  Printer, 
  Tv, 
  Clock, 
  UtensilsCrossed, 
  ShoppingBag, 
  Database,
  ArrowRight,
  Sparkles,
  QrCode
} from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order;
  onCloseAndNewOrder: () => void;
  onGoToKitchenBoard: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onCloseAndNewOrder,
  onGoToKitchenBoard,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedTime = new Date(order.createdAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      {/* SCREEN MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div 
          className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-stone-100 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Banner */}
          <div className="p-6 bg-gradient-to-br from-emerald-900/50 via-stone-900 to-amber-950/40 border-b border-stone-800 text-center relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-950">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block">
              Pagamento Aprovado com Sucesso!
            </span>
            <h2 className="text-2xl font-serif font-black text-white mt-1">
              Pedido Confirmado!
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              Guarde seu número para retirar seu pedido no balcão quando for chamado.
            </p>
          </div>

          {/* Highlighted Order Number & Ticket Senha */}
          <div className="p-6 bg-stone-950 text-center border-b border-stone-800/80">
            <div className="inline-block bg-gradient-to-r from-amber-500/20 via-red-500/20 to-amber-500/20 border-2 border-amber-500/40 px-8 py-5 rounded-3xl shadow-xl shadow-amber-950/30">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
                SEU NÚMERO DE PEDIDO É
              </span>
              <div className="text-5xl sm:text-6xl font-black text-amber-300 font-mono tracking-tighter">
                {order.orderNumber}
              </div>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs font-semibold text-stone-300">
                <span>Cliente: <strong className="text-white">{order.customerName}</strong></span>
                <span>•</span>
                <span>{order.diningOption === 'dine-in' ? 'Comer no Local' : 'Para Levar'}</span>
                {order.tableNumber && <span>• Mesa {order.tableNumber}</span>}
              </div>
            </div>

            {/* Estimated time */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium text-amber-200/90">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Tempo estimado de preparo: <strong>{order.estimatedTimeMinutes} minutos</strong></span>
            </div>

            {/* Supabase status */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {order.syncedToSupabase 
                  ? 'Pedido registrado no banco de dados Supabase em tempo real'
                  : 'Pedido registrado localmente no sistema (armazenamento ativo)'}
              </span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="p-5 max-h-48 overflow-y-auto space-y-2 border-b border-stone-800 text-xs">
            <span className="font-bold text-stone-400 uppercase tracking-wider block mb-2">
              Resumo dos Pratos:
            </span>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-stone-300">
                <span>
                  <strong className="text-amber-400">{item.quantity}x</strong> {item.product.name}
                  {item.cookingPoint && <span className="text-stone-400 text-[10px]"> ({item.cookingPoint})</span>}
                </span>
                <span className="font-bold text-stone-200">
                  R$ {item.itemTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-stone-800 text-sm font-bold text-amber-300">
              <span>Total Pago</span>
              <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-5 bg-stone-950 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-bold uppercase tracking-wider border border-stone-700 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Imprimir Cupom</span>
              </button>

              <button
                type="button"
                onClick={onGoToKitchenBoard}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-bold uppercase tracking-wider border border-stone-700 transition-colors cursor-pointer"
              >
                <Tv className="w-4 h-4 text-amber-400" />
                <span>Ver no Telão</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onCloseAndNewOrder}
              className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Concluir & Novo Pedido no Totem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* HIDDEN PRINTABLE THERMAL RECEIPT FOR 80mm PRINTERS */}
      <div id="printable-receipt" className="hidden print:block text-black bg-white p-4 font-mono text-xs">
        <div className="text-center pb-2 border-b border-black">
          <div className="text-lg font-black tracking-wider">NONNA MIA</div>
          <div className="text-[10px]">CUCINA ITALIANA AUTÊNTICA</div>
          <div className="text-[10px]">TOTEM DE AUTOATENDIMENTO</div>
          <div className="text-[9px]">CNPJ: 12.345.678/0001-90</div>
        </div>

        <div className="my-3 text-center p-2 border-2 border-black">
          <div className="text-xs uppercase font-bold">SENHA DE RETIRADA</div>
          <div className="text-3xl font-black">{order.orderNumber}</div>
        </div>

        <div className="text-[11px] mb-2">
          <div><strong>CLIENTE:</strong> {order.customerName}</div>
          <div><strong>TIPO:</strong> {order.diningOption === 'dine-in' ? 'CONSUMO NO LOCAL' : 'PARA VIAGEM'}</div>
          {order.tableNumber && <div><strong>MESA:</strong> {order.tableNumber}</div>}
          <div><strong>DATA/HORA:</strong> {formattedTime}</div>
          <div><strong>PAGAMENTO:</strong> {order.paymentMethod.toUpperCase()} (APROVADO)</div>
        </div>

        <div className="border-t border-b border-dashed border-black py-2 my-2 space-y-1">
          {order.items.map((it, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{it.quantity}x {it.product.name}</span>
              <span>R$ {it.itemTotal.toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
        </div>

        <div className="text-sm font-bold flex justify-between py-1">
          <span>VALOR TOTAL:</span>
          <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
        </div>

        <div className="text-center pt-3 border-t border-black text-[9px]">
          <div>ACOMPANHE O PAINEL DE SENHAS NA TV DO SALÃO</div>
          <div>BUON APPETITO! GRAZIE MILLE!</div>
        </div>
      </div>
    </>
  );
};
