import React from 'react';
import { Product } from '../types/restaurant';
import { Plus, Clock, Leaf, Award } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(product)}
      className="group bg-stone-900 rounded-3xl border border-stone-800/80 hover:border-amber-600/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/20 hover:-translate-y-1 cursor-pointer select-none"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-4/3 overflow-hidden bg-stone-950">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/20" />

          {/* Tags */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.tags?.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-900/90 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-md"
              >
                <Award className="w-3 h-3 text-amber-400" />
                {tag}
              </span>
            ))}
            {product.isVegetarian && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shadow-md">
                <Leaf className="w-3 h-3 text-emerald-400" />
                Veggie
              </span>
            )}
          </div>

          {/* Prep time */}
          {product.prepTimeMinutes && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-medium bg-black/70 backdrop-blur-md text-stone-300 px-2.5 py-1 rounded-full border border-stone-700/50">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{product.prepTimeMinutes} min</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Italian authentic title */}
          <span className="text-xs font-serif italic text-amber-500 block mb-1">
            {product.italianName}
          </span>
          <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-200 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer with Price & Quick Action */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-stone-800/60 mt-auto">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Preço
          </span>
          <span className="text-xl font-black text-amber-400 tracking-tight">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Pedir</span>
        </button>
      </div>
    </div>
  );
};
