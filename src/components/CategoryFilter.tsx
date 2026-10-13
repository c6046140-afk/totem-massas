import React from 'react';
import { ProductCategory } from '../types/restaurant';
import { CATEGORIES_CONFIG } from '../data/menuData';
import { Sparkles, UtensilsCrossed, Pizza, Soup, Cake, Wine } from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5" />;
      case 'Pizza': return <Pizza className="w-5 h-5" />;
      case 'Soup': return <Soup className="w-5 h-5" />;
      case 'Cake': return <Cake className="w-5 h-5" />;
      case 'Wine': return <Wine className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-max px-2 py-1">
        {CATEGORIES_CONFIG.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as ProductCategory)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 select-none cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-102 ring-2 ring-amber-400/30'
                  : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/60'
              }`}
            >
              <span className={isActive ? 'text-amber-100' : 'text-amber-400'}>
                {getIcon(cat.icon)}
              </span>
              <span className="font-semibold tracking-wide">{cat.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-amber-700/60 text-amber-100' : 'bg-stone-700/50 text-stone-400'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
