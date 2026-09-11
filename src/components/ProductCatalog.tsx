import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Plus, Sparkles, Filter, X } from 'lucide-react';
import { Product } from '../types/store';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

interface ProductCatalogProps {
  onQuickView: (product: Product) => void;
  onOpenAdmin: () => void;
  onRequireAuth?: () => void;
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onQuickView,
  onOpenAdmin,
  onRequireAuth,
  selectedCategory: propCategory,
  onSelectCategory: propOnSelectCategory,
}) => {
  const { products, categories, storeSettings, isAdmin } = useStore();
  const [internalCategory, setInternalCategory] = useState<string>('all');
  const selectedCategory = propCategory !== undefined ? propCategory : internalCategory;
  const setSelectedCategory = propOnSelectCategory || setInternalCategory;
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // List of all sizes sorted by size range
  const allAvailableSizes = useMemo(() => {
    const sizeSet = new Set<string>(storeSettings?.availableSizes || []);
    products.forEach((p) => {
      p.sizes?.forEach((s) => sizeSet.add(s));
    });
    return Array.from(sizeSet).sort((a, b) => {
      const numA = parseInt(a.split('-')[0]) || 0;
      const numB = parseInt(b.split('-')[0]) || 0;
      return numA - numB;
    });
  }, [storeSettings?.availableSizes, products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
        const matchesSize = selectedSize === 'all' || (p.sizes && p.sizes.includes(selectedSize));
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSize && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // default featured
      });
  }, [products, selectedCategory, selectedSize, searchQuery, sortBy]);

  const handleClearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSearchQuery('');
  };

  return (
    <section id="catalog" className="relative py-20 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-neutral-100 pb-8">
        <div>
          <div className="text-cyan-600 font-semibold text-xs uppercase tracking-widest mb-2">
            <span>Coleção de Alta Performance</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-black font-normal tracking-tight">
            Engenharia Para os Teus Pés.
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base max-w-xl mt-3 font-sans">
            Cada par de meias VYRO é concebido para eliminar bolhas, otimizar a circulação e garantir máximo fluxo dinâmico do primeiro ao último quilómetro.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-600 text-white hover:bg-cyan-700 transition-all font-medium text-xs shadow-lg hover:scale-105 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Produto</span>
          </button>
        )}
      </div>

      {/* Filter and Search Section */}
      <div className="space-y-4 mb-10">
        {/* Category Pills */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
              }`}
            >
              Todas ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-black text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Size Dropdown, Sort & Results Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-neutral-100">
          <div className="text-xs text-neutral-500 font-medium flex items-center gap-2 flex-wrap">
            <span>
              A exibir <strong className="text-black font-bold">{filteredProducts.length}</strong> de{' '}
              <strong className="text-black font-bold">{products.length}</strong> modelos
            </span>

            {/* Active filter chips */}
            {(selectedCategory !== 'all' || selectedSize !== 'all' || searchQuery.trim() !== '') && (
              <div className="flex items-center gap-1.5 flex-wrap ml-1">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-medium border border-neutral-200">
                    <span>{categories.find((c) => c.id === selectedCategory)?.name || 'Categoria'}</span>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="hover:text-black cursor-pointer ml-0.5"
                      title="Remover filtro de categoria"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSize !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 text-[11px] font-medium border border-cyan-200">
                    <span>Tam: {selectedSize}</span>
                    <button
                      onClick={() => setSelectedSize('all')}
                      className="hover:text-cyan-950 cursor-pointer ml-0.5"
                      title="Remover filtro de tamanho"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClearAllFilters}
                  className="text-[11px] text-cyan-600 hover:underline font-bold ml-1 cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Limpar tudo</span>
                </button>
              </div>
            )}
          </div>

          {/* Controls: Search, Size Selector Box, Sort Dropdown */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Pesquisar meias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 rounded-full text-xs border border-neutral-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Caixa de Tamanho (Dropdown que abres e escolhes o tamanho) */}
            <div className="relative flex items-center shrink-0">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className={`pl-4 pr-8 py-2 rounded-full text-xs border font-medium focus:outline-none focus:border-black cursor-pointer shadow-2xs appearance-none transition-all ${
                  selectedSize !== 'all'
                    ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-bold'
                    : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <option value="all">Tamanho: Todos</option>
                {allAvailableSizes.map((size) => {
                  const count = products.filter(
                    (p) =>
                      (selectedCategory === 'all' || p.categoryId === selectedCategory) &&
                      p.sizes?.includes(size)
                  ).length;
                  return (
                    <option key={size} value={size}>
                      Tamanho {size} ({count})
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-3 pointer-events-none text-neutral-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center shrink-0">
              <SlidersHorizontal className="absolute left-3.5 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-9 pr-8 py-2 rounded-full text-xs border border-neutral-200 bg-white font-medium text-neutral-700 focus:outline-none focus:border-black cursor-pointer appearance-none shadow-2xs"
              >
                <option value="featured">Destaques</option>
                <option value="price-asc">Preço: Baixo p/ Alto</option>
                <option value="price-desc">Preço: Alto p/ Baixo</option>
                <option value="rating">Melhor Avaliadas</option>
              </select>
              <div className="absolute right-3 pointer-events-none text-neutral-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onRequireAuth={onRequireAuth}
              initialSize={selectedSize !== 'all' ? selectedSize : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-300 p-8">
          <Filter className="w-10 h-10 text-neutral-400 mb-3" />
          <h3 className="font-serif text-2xl text-black">Nenhum modelo encontrado</h3>
          <p className="text-neutral-500 text-xs mt-1 max-w-sm">
            Não encontramos meias com os filtros selecionados (categoria, tamanho ou pesquisa). Tente ajustar ou limpar os filtros.
          </p>
          <button
            onClick={handleClearAllFilters}
            className="mt-5 px-6 py-2 rounded-full text-xs bg-black text-white font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Ver Todas as Meias
          </button>
        </div>
      )}
    </section>
  );
};
