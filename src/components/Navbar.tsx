import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, ShieldCheck, User as UserIcon, Menu, X, Heart, ChevronDown, Check, Layers } from 'lucide-react';
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
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenAdmin,
  onNavigate,
  onOpenProfile,
  onOpenAuth,
  onOpenFavorites,
  selectedCategory,
  onSelectCategory,
}) => {
  const { totalItems } = useCart();
  const { isAdmin, categories, products } = useStore();
  const { currentUser, isAuthenticated, favoritesCount } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close categories dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesDropdownOpen(false);
      }
    };

    if (isCategoriesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoriesDropdownOpen]);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
    setIsCategoriesDropdownOpen(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    } else {
      onNavigate('catalog');
    }
    setIsCategoriesDropdownOpen(false);
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
          {/* Categorias Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer py-1 ${
                isCategoriesDropdownOpen || (selectedCategory && selectedCategory !== 'all')
                  ? 'text-cyan-600 font-semibold'
                  : 'text-[#6F6F6F] hover:text-[#000000]'
              }`}
              aria-expanded={isCategoriesDropdownOpen}
            >
              <span>Categorias</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isCategoriesDropdownOpen ? 'rotate-180 text-cyan-600' : 'text-neutral-400'
                }`}
              />
            </button>

            {isCategoriesDropdownOpen && (
              <div className="absolute top-full left-0 mt-2.5 w-64 bg-white/95 backdrop-blur-xl border border-neutral-200/90 rounded-2xl shadow-xl shadow-black/10 p-2 z-50 animate-fade-rise">
                <div className="px-3 py-2 border-b border-neutral-100 flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <span>Filtrar por Categoria</span>
                  <Layers className="w-3.5 h-3.5 text-cyan-600" />
                </div>

                <div className="py-1 space-y-0.5 max-h-72 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('all')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                      selectedCategory === 'all' || !selectedCategory
                        ? 'bg-neutral-100 font-bold text-black'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {(selectedCategory === 'all' || !selectedCategory) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                      )}
                      Todas as Meias
                    </span>
                    <span className="text-[10px] text-neutral-500 font-semibold px-2 py-0.5 rounded-md bg-neutral-100">
                      {products.length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const count = products.filter((p) => p.categoryId === cat.id).length;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-50 font-bold text-cyan-950 border border-cyan-100/60'
                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate pr-2">
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />}
                          <span className="truncate">{cat.name}</span>
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                            isSelected ? 'bg-cyan-100 text-cyan-700' : 'bg-neutral-100 text-neutral-400'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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

        {/* Actions (User, Favorites, Cart, CTA) */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* User Account / Login Icon Button */}
          <button
            onClick={handleUserClick}
            aria-label={isAuthenticated ? 'Aceder ao meu perfil' : 'Entrar / Criar Conta'}
            title={isAuthenticated ? `Conta: ${currentUser?.name}` : 'Entrar / Criar Conta'}
            className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors text-black cursor-pointer"
          >
            <UserIcon
              className={`w-5 h-5 transition-colors ${
                isAuthenticated ? 'text-cyan-600' : 'text-neutral-700 hover:text-black'
              }`}
            />
            {isAuthenticated && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full ring-2 ring-white" />
            )}
          </button>

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

          {/* CTA button: "Ver Meias" */}
          <button
            onClick={() => handleNavClick('catalog')}
            className="hidden lg:inline-flex items-center rounded-full px-5 py-2 text-xs bg-[#000000] text-white hover:scale-[1.03] transition-all duration-300 font-medium shadow-xs hover:shadow active:scale-95 cursor-pointer"
          >
            <span>Ver Meias</span>
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
          {/* Mobile Categorias Accordion */}
          <div className="border-b border-neutral-100 py-1">
            <button
              type="button"
              onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
              className="w-full flex items-center justify-between font-medium text-[#6F6F6F] py-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className={selectedCategory && selectedCategory !== 'all' ? 'text-black font-semibold' : ''}>
                  Categorias
                </span>
                {selectedCategory && selectedCategory !== 'all' && (
                  <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded-full">
                    Ativo
                  </span>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                  mobileCategoriesOpen ? 'rotate-180 text-black' : ''
                }`}
              />
            </button>

            {mobileCategoriesOpen && (
              <div className="pl-2 pr-1 py-1.5 space-y-1 bg-neutral-50/80 rounded-xl my-1 border border-neutral-100">
                <button
                  type="button"
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left text-xs py-2 px-3 rounded-lg flex items-center justify-between cursor-pointer ${
                    selectedCategory === 'all' || !selectedCategory
                      ? 'font-bold text-black bg-white shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {(selectedCategory === 'all' || !selectedCategory) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                    )}
                    Todas as Meias
                  </span>
                  <span className="text-[10px] text-neutral-400">{products.length}</span>
                </button>

                {categories.map((cat) => {
                  const count = products.filter((p) => p.categoryId === cat.id).length;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left text-xs py-2 px-3 rounded-lg flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'font-bold text-cyan-900 bg-cyan-50 border border-cyan-100'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isSelected && <Check className="w-3 h-3 text-cyan-600 shrink-0" />}
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
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
