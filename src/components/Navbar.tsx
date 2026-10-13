import React from 'react';
import { 
  Utensils, 
  ChefHat, 
  Tv, 
  Database, 
  ShoppingCart,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface NavbarProps {
  currentView: 'kiosk' | 'kitchen' | 'board';
  onSelectView: (view: 'kiosk' | 'kitchen' | 'board') => void;
  cartItemCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  isSupabaseConnected: boolean;
  onOpenSupabaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  cartItemCount,
  cartTotal,
  onOpenCart,
  isSupabaseConnected,
  onOpenSupabaseModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 shadow-xl">
      {/* Italian Flag subtle tricolor strip */}
      <div className="h-1.5 w-full grid grid-cols-3">
        <div className="bg-emerald-600" />
        <div className="bg-stone-200" />
        <div className="bg-red-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Italian Restaurant Name */}
          <div 
            onClick={() => onSelectView('kiosk')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-red-700 flex items-center justify-center text-white shadow-lg shadow-amber-900/30 ring-2 ring-amber-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors">
                  NONNA MIA
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-widest uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Autoatendimento
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans tracking-tight">
                Cucina Italiana • Peça e Pague Sem Fila
              </p>
            </div>
          </div>

          {/* Navigation Views (Kiosk / Kitchen / Board) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-950/80 p-1.5 rounded-2xl border border-stone-800">
            <button
              onClick={() => onSelectView('kiosk')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'kiosk'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-700/30'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Totem de Pedidos</span>
            </button>

            <button
              onClick={() => onSelectView('kitchen')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'kitchen'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-700/30'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Cozinha (KDS)</span>
            </button>

            <button
              onClick={() => onSelectView('board')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'board'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-700/30'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Telão de Senhas</span>
            </button>
          </nav>

          {/* Actions: Supabase Status & Cart Button */}
          <div className="flex items-center gap-3">
            {/* Supabase Connection Indicator */}
            <button
              onClick={onOpenSupabaseModal}
              title="Configurações do Banco de Dados Supabase"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                isSupabaseConnected
                  ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300 hover:bg-emerald-950/70'
                  : 'bg-stone-800/80 border-stone-700 text-amber-300 hover:bg-stone-800'
              }`}
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isSupabaseConnected ? 'Supabase Conectado' : 'Banco Supabase'}
              </span>
              {isSupabaseConnected ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            {/* Mobile View Selector Button */}
            <div className="flex md:hidden gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
              <button
                onClick={() => onSelectView('kiosk')}
                className={`p-2 rounded-lg ${currentView === 'kiosk' ? 'bg-amber-600 text-white' : 'text-stone-400'}`}
                title="Totem"
              >
                <Utensils className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectView('kitchen')}
                className={`p-2 rounded-lg ${currentView === 'kitchen' ? 'bg-amber-600 text-white' : 'text-stone-400'}`}
                title="Cozinha"
              >
                <ChefHat className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectView('board')}
                className={`p-2 rounded-lg ${currentView === 'board' ? 'bg-amber-600 text-white' : 'text-stone-400'}`}
                title="Painel de Senhas"
              >
                <Tv className="w-4 h-4" />
              </button>
            </div>

            {/* Kiosk Cart Button */}
            {currentView === 'kiosk' && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-red-900/30 transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                <div className="text-left hidden sm:block">
                  <div className="text-xs uppercase tracking-wider text-amber-200 font-bold leading-none">
                    Meu Pedido
                  </div>
                  <div className="text-sm font-bold leading-tight">
                    R$ {cartTotal.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                {cartItemCount > 0 && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-stone-950 text-xs font-black shadow-md animate-bounce">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
