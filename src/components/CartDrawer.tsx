import React from 'react';
import { CartItem, DiningOption } from '../types/restaurant';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  UtensilsCrossed, 
  ShoppingBag, 
  ArrowRight,
  User,
  Phone,
  Hash
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  diningOption: DiningOption;
  onSetDiningOption: (option: DiningOption) => void;
  customerName: string;
  onSetCustomerName: (name: string) => void;
  customerPhone: string;
  onSetCustomerPhone: (phone: string) => void;
  tableNumber: string;
  onSetTableNumber: (table: string) => void;
  onProceedToPayment: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  diningOption,
  onSetDiningOption,
  customerName,
  onSetCustomerName,
  customerPhone,
  onSetCustomerPhone,
  tableNumber,
  onSetTableNumber,
  onProceedToPayment,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const total = subtotal; // No service fee at self-service kiosk

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
            <div>
              <h2 className="text-xl font-bold font-serif text-amber-100 flex items-center gap-2">
                <span>Comanda do Pedido</span>
              </h2>
              <p className="text-xs text-stone-400">
                {items.length === 0 ? 'Nenhum item selecionado' : `${items.length} ${items.length === 1 ? 'item' : 'itens'} no carrinho`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-stone-800/80 flex items-center justify-center text-stone-500 mb-4">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-stone-200">Seu pedido está vazio</h3>
              <p className="text-xs text-stone-400 mt-2 max-w-xs">
                Toque nos pratos do cardápio para adicionar massas frescas, pizzas napolitanas ou bebidas artesanais.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Explorar Cardápio
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Dining Option Toggle (Comer aqui vs Viagem) */}
              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                  Como deseja saborear?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onSetDiningOption('dine-in')}
                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      diningOption === 'dine-in'
                        ? 'bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-900/30'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Comer no Local</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSetDiningOption('takeaway')}
                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      diningOption === 'takeaway'
                        ? 'bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-900/30'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Para Levar</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                  Itens Selecionados
                </label>
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800/80 flex gap-3 relative group"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-sm font-bold text-stone-100 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="text-stone-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Customization pills */}
                      <div className="text-[11px] text-stone-400 space-y-0.5 mt-1">
                        {item.cookingPoint && (
                          <div className="text-amber-300 font-medium">
                            • Ponto: {item.cookingPoint}
                          </div>
                        )}
                        {item.cheeseOption && (
                          <div>• Queijo: {item.cheeseOption}</div>
                        )}
                        {item.selectedExtras.length > 0 && (
                          <div className="text-stone-300">
                            • Extras: {item.selectedExtras.map(e => e.name).join(', ')}
                          </div>
                        )}
                        {item.notes && (
                          <div className="italic text-stone-500 truncate">
                            • Obs: "{item.notes}"
                          </div>
                        )}
                      </div>

                      {/* Pricing and Qty Controls */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-900">
                        <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center hover:bg-stone-800 text-stone-400 hover:text-stone-200 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-amber-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-amber-400">
                          R$ {item.itemTotal.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Details Form */}
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Identificação do Cliente
                </label>
                
                <div>
                  <label className="block text-xs text-stone-400 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Seu Primeiro Nome (Obrigatório para a Senha)</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => onSetCustomerName(e.target.value)}
                    placeholder="Ex: Carlos, Ana, Roberto..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1 flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-stone-400" />
                      <span>Nº da Mesa (Opcional)</span>
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => onSetTableNumber(e.target.value)}
                      placeholder="Ex: 05 ou Balcão"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>Celular (Opcional)</span>
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => onSetCustomerPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 bg-stone-950 border-t border-stone-800 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-200">
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Taxa de Atendimento do Totem</span>
                  <span className="font-bold">Grátis (0%)</span>
                </div>
                <div className="flex justify-between text-base font-black text-amber-200 pt-2 border-t border-stone-800">
                  <span>Total a Pagar</span>
                  <span className="text-xl text-amber-400">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onProceedToPayment}
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-xl shadow-red-900/40 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Avançar para Pagamento</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
