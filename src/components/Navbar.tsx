import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, User as UserIcon, Menu, X, Sparkles, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useUser } from '../context/UserContext';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onOpenFavorites: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenAdmin,
  onNavigate,
  onOpenProfile,
  onOpenAuth,
  onOpenFavorites,
}) => {
  const { totalItems } = useCart();
  const { isAdmin } = useStore();
  const { currentUser, isAuthenticated, favoritesCount } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      onOpenProfile();
    } else {
      onOpenAuth();
    }
  };

  return (
    <header className="relative z-20 w-full bg-white/80 backdrop-blur-md border-b border-black/[0.04] sticky top-0 transition-all duration-300">
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-5 max-w-7xl mx-auto">
        {/* Logo */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo Mark */}
          <div className="relative h-11 w-11 sm:h-13 sm:w-13 rounded-2xl bg-white border border-neutral-200/80 shadow-xs p-1 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src="/logo.jpg"
              alt="VYRO Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="text-xl sm:text-2xl tracking-tight font-serif text-[#000000] flex items-baseline leading-none">
              VYRO<sup className="text-xs font-sans font-bold ml-0.5 text-cyan-600">®</sup>
            </div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#6F6F6F] font-semibold mt-1">
              Liberdade em Movimento
            </span>
          </div>
        </div>

        {/* Desktop Menu items */}
        <nav className="hidden md:flex items-center space-x-7">
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

        {/* Actions (Favorites, User, Admin, Cart, CTA) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Favorites Button with badge */}
          <button
            onClick={onOpenFavorites}
            aria-label="Ver Favoritos"
            title="Lista de Favoritos"
            className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors text-black cursor-pointer"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                favoritesCount > 0 ? 'text-rose-500 fill-rose-500/20' : 'text-neutral-700 hover:text-black'
              }`}
            />
            {favoritesCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* User Account / Login Button */}
          <button
            onClick={handleUserClick}
            title={isAuthenticated ? 'Aceder ao meu perfil' : 'Entrar / Criar Conta'}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              isAuthenticated
                ? 'bg-neutral-900 text-white border-black hover:bg-neutral-800 shadow-xs'
                : 'border-neutral-200/90 text-neutral-700 hover:text-black hover:border-black/40 bg-neutral-50/50'
            }`}
          >
            <UserIcon className={`w-3.5 h-3.5 ${isAuthenticated ? 'text-cyan-400' : 'text-neutral-500'}`} />
            <span className="hidden sm:inline max-w-[90px] truncate">
              {isAuthenticated ? currentUser?.name.split(' ')[0] : 'Entrar'}
            </span>
          </button>

          {/* Cart Icon with badge */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir Carrinho"
            className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors text-black cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-[#000000]" />
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            )}
          </button>

          {/* Admin Management Button */}
          <button
            onClick={onOpenAdmin}
            title={isAdmin ? 'Painel Admin Activo' : 'Área de Administração'}
            className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              isAdmin
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-xs'
                : 'border-black/10 text-[#6F6F6F] hover:text-[#000000] hover:border-black/30'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isAdmin ? 'text-cyan-600' : 'text-neutral-400'}`} />
            <span className="text-[11px]">{isAdmin ? 'Admin' : 'Gestão'}</span>
          </button>

          {/* CTA button: "Ver Meias" */}
          <button
            onClick={() => handleNavClick('catalog')}
            className="hidden lg:inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs bg-[#000000] text-white hover:scale-[1.03] transition-all duration-300 font-medium shadow-xs hover:shadow active:scale-95 cursor-pointer"
          >
            <span>Ver Meias</span>
            <Sparkles className="w-3 h-3 text-cyan-400" />
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
        <div className="md:hidden px-6 py-6 bg-white border-b border-neutral-200 flex flex-col space-y-3 animate-fade-rise">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleUserClick();
              }}
              className="flex items-center gap-2 text-xs font-semibold text-black"
            >
              <UserIcon className="w-4 h-4 text-cyan-600" />
              <span>{isAuthenticated ? `Minha Conta (${currentUser?.name})` : 'Entrar no VYRO Club'}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFavorites();
              }}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600"
            >
              <Heart className="w-4 h-4 fill-rose-600" />
              <span>Favoritos ({favoritesCount})</span>
            </button>
          </div>

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
            className="text-left font-medium text-cyan-700 py-2 flex items-center gap-2 text-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isAdmin ? 'Painel Admin (Ativo)' : 'Área de Gestão / Admin'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
