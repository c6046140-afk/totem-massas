import React, { useState } from 'react';
import { Product, CartItem, ExtraOption } from '../types/restaurant';
import { X, Plus, Minus, Check, MessageSquare, Flame, Sparkles } from 'lucide-react';

interface CustomizeModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [cookingPoint, setCookingPoint] = useState(
    product.cookingPoints ? product.cookingPoints[0] : undefined
  );
  const [cheeseOption, setCheeseOption] = useState(
    product.cheeseOptions ? product.cheeseOptions[0] : undefined
  );
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [notes, setNotes] = useState('');

  // Toggle extras
  const handleToggleExtra = (extra: ExtraOption) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  // Calculate unit price and total
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const cheesePrice = cheeseOption?.includes('+R$ 4') ? 4.0 : cheeseOption?.includes('+R$ 5') ? 5.0 : cheeseOption?.includes('+R$ 6') ? 6.0 : 0;
  const unitPrice = product.price + extrasTotal + cheesePrice;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    const cartItemId = `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const item: CartItem = {
      cartItemId,
      product,
      quantity,
      cookingPoint,
      cheeseOption,
      selectedExtras,
      notes: notes.trim() || undefined,
      unitPrice,
      itemTotal: totalPrice,
    };
    onAddToCart(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-black/80 text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-48 bg-stone-950 overflow-hidden shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white backdrop-blur-md border border-stone-700/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-xs font-serif italic text-amber-400">
              {product.italianName}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Scrollable body with customizer options */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-stone-800/80">
          {/* Description */}
          <p className="text-sm text-stone-300 leading-relaxed">
            {product.description}
          </p>

          {/* Cooking Point (Massas) */}
          {product.hasCookingPoint && product.cookingPoints && (
            <div className="pt-5">
              <label className="flex items-center gap-2 text-sm font-bold text-amber-200 mb-3">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Ponto de Cozimento da Massa</span>
                <span className="text-xs text-stone-400 font-normal">(Obrigatório)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {product.cookingPoints.map((point) => (
                  <button
                    key={point}
                    type="button"
                    onClick={() => setCookingPoint(point)}
                    className={`py-3 px-3 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                      cookingPoint === point
                        ? 'bg-amber-600/30 border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {point}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cheese Option */}
          {product.hasCheeseOption && product.cheeseOptions && (
            <div className="pt-5">
              <label className="flex items-center gap-2 text-sm font-bold text-amber-200 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Escolha o Queijo Ralado</span>
              </label>
              <div className="space-y-2">
                {product.cheeseOptions.map((opt) => (
                  <label
                    key={opt}
                    onClick={() => setCheeseOption(opt)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                      cheeseOption === opt
                        ? 'bg-amber-600/20 border-amber-500 text-amber-200'
                        : 'bg-stone-800/40 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        cheeseOption === opt ? 'border-amber-400 bg-amber-500 text-stone-950' : 'border-stone-500'
                      }`}>
                        {cheeseOption === opt && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span>{opt}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Extras / Adicionais */}
          {product.availableExtras && product.availableExtras.length > 0 && (
            <div className="pt-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-amber-200 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-500" />
                  <span>Adicionais Especiais</span>
                </label>
                <span className="text-xs text-stone-400">Opcional</span>
              </div>
              <div className="space-y-2">
                {product.availableExtras.map((extra) => {
                  const isChecked = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <div
                      key={extra.id}
                      onClick={() => handleToggleExtra(extra)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-amber-600/20 border-amber-500 text-amber-200'
                          : 'bg-stone-800/40 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-amber-600 border-amber-500 text-white'
                              : 'border-stone-600 bg-stone-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="font-medium">{extra.name}</span>
                      </div>
                      <span className="font-bold text-amber-400">
                        {extra.price === 0 ? 'Grátis' : `+ R$ ${extra.price.toFixed(2).replace('.', ',')}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kitchen Notes / Observações */}
          <div className="pt-5">
            <label className="flex items-center gap-2 text-sm font-bold text-stone-300 mb-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Observações para a Cozinha</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: sem pimenta, molho bem quente, talheres adicionais..."
              rows={2}
              maxLength={120}
              className="w-full bg-stone-950/80 border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add to Cart button */}
        <div className="p-4 sm:p-6 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:hover:bg-stone-800 text-stone-200 transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-base text-amber-100">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-amber-900/40 active:scale-98 transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Adicionar ao Pedido</span>
            <span className="font-black text-amber-100">
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
