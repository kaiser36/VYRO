import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, User, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenAdmin, onNavigate }) => {
  const { totalItems } = useCart();
  const { isAdmin } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative z-20 w-full bg-white/80 backdrop-blur-md border-b border-black/[0.04] sticky top-0 transition-all duration-300">
      <div className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
        {/* Logo */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          {/* Logo Mark */}
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white border border-neutral-200/80 shadow-xs p-1 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src="/logo.jpg"
              alt="VYRO Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="text-2xl sm:text-3xl tracking-tight font-serif text-[#000000] flex items-baseline leading-none">
              VYRO<sup className="text-xs font-sans font-bold ml-0.5 text-cyan-600">®</sup>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#6F6F6F] font-semibold mt-1">
              Liberdade em Movimento
            </span>
          </div>
        </div>

        {/* Desktop Menu items */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleNavClick('hero')}
            className="text-sm font-medium text-[#000000] transition-colors hover:text-cyan-600 cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('catalog')}
            className="text-sm font-medium text-[#6F6F6F] transition-colors hover:text-[#000000] cursor-pointer"
          >
            Coleção Meias
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className="text-sm font-medium text-[#6F6F6F] transition-colors hover:text-[#000000] cursor-pointer"
          >
            Categorias
          </button>
          <button
            onClick={() => handleNavClick('technology')}
            className="text-sm font-medium text-[#6F6F6F] transition-colors hover:text-[#000000] cursor-pointer"
          >
            Studio & Tech
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="text-sm font-medium text-[#6F6F6F] transition-colors hover:text-[#000000] cursor-pointer"
          >
            Sobre
          </button>
        </nav>

        {/* Actions (Admin, Cart, CTA) */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Admin Management Button */}
          <button
            onClick={onOpenAdmin}
            title={isAdmin ? 'Painel Admin Activo' : 'Área de Administração'}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              isAdmin
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-sm'
                : 'border-black/10 text-[#6F6F6F] hover:text-[#000000] hover:border-black/30'
            }`}
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                <span className="hidden sm:inline">Admin (On)</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gestão</span>
              </>
            )}
          </button>

          {/* Cart Icon with badge */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir Carrinho"
            className="relative p-2.5 rounded-full hover:bg-neutral-100 transition-colors text-black cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-[#000000]" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                {totalItems}
              </span>
            )}
          </button>

          {/* CTA button: "Begin Journey" */}
          <button
            onClick={() => handleNavClick('catalog')}
            className="hidden sm:inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm bg-[#000000] text-white hover:scale-[1.03] transition-all duration-300 font-medium shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            <span>Begin Journey</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-black cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 py-6 bg-white border-b border-neutral-200 flex flex-col space-y-4 animate-fade-rise">
          <button
            onClick={() => handleNavClick('hero')}
            className="text-left font-medium text-black py-2 border-b border-neutral-100"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('catalog')}
            className="text-left font-medium text-[#6F6F6F] py-2 border-b border-neutral-100"
          >
            Coleção Meias
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className="text-left font-medium text-[#6F6F6F] py-2 border-b border-neutral-100"
          >
            Categorias
          </button>
          <button
            onClick={() => handleNavClick('technology')}
            className="text-left font-medium text-[#6F6F6F] py-2 border-b border-neutral-100"
          >
            Studio & Tecnologia
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="text-left font-medium text-[#6F6F6F] py-2 border-b border-neutral-100"
          >
            Sobre a VYRO
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="text-left font-medium text-cyan-700 py-2 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {isAdmin ? 'Painel de Administração (Ativo)' : 'Área de Login Admin'}
          </button>
          <button
            onClick={() => handleNavClick('catalog')}
            className="w-full rounded-full py-3 text-sm bg-black text-white text-center font-medium mt-2"
          >
            Begin Journey — Ver Meias
          </button>
        </div>
      )}
    </header>
  );
};
