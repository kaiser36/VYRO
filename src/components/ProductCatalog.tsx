import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Plus, Sparkles, Filter, X } from 'lucide-react';
import { Product } from '../types/store';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

interface ProductCatalogProps {
  onQuickView: (product: Product) => void;
  onOpenAdmin: () => void;
  onRequireAuth?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onQuickView, onOpenAdmin, onRequireAuth }) => {
  const { products, categories, isAdmin } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // default featured
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

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
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-600 text-white hover:bg-cyan-700 transition-all font-medium text-xs shadow-lg hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Produto</span>
          </button>
        )}
      </div>

      {/* Filter and Search Section */}
      <div className="space-y-4 mb-10">
        {/* Category Pills (Dedicated full-width row with wrap) */}
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

        {/* Search, Sort & Results Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100">
          <div className="text-xs text-neutral-500 font-medium flex items-center gap-2">
            <span>
              A exibir <strong className="text-black font-bold">{filteredProducts.length}</strong> de{' '}
              <strong className="text-black font-bold">{products.length}</strong> modelos
            </span>
            {(selectedCategory !== 'all' || searchQuery.trim() !== '') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-[11px] text-cyan-600 hover:underline font-bold ml-1 cursor-pointer flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Limpar filtros</span>
              </button>
            )}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Pesquisar meia ou tecnologia..."
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

            <div className="relative flex items-center shrink-0">
              <SlidersHorizontal className="absolute left-3.5 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-9 pr-6 py-2 rounded-full text-xs border border-neutral-200 bg-white font-medium text-neutral-700 focus:outline-none focus:border-black cursor-pointer appearance-none shadow-2xs"
              >
                <option value="featured">Destaques</option>
                <option value="price-asc">Preço: Baixo p/ Alto</option>
                <option value="price-desc">Preço: Alto p/ Baixo</option>
                <option value="rating">Melhor Avaliadas</option>
              </select>
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
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-300 p-8">
          <Filter className="w-10 h-10 text-neutral-400 mb-3" />
          <h3 className="font-serif text-2xl text-black">Nenhum produto encontrado</h3>
          <p className="text-neutral-500 text-xs mt-1 max-w-sm">
            Não encontramos meias correspondentes à sua pesquisa. Tente selecionar outra categoria ou limpar a busca.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-5 px-6 py-2 rounded-full text-xs bg-black text-white font-medium hover:bg-neutral-800 transition-colors"
          >
            Ver Todas as Meias
          </button>
        </div>
      )}
    </section>
  );
};
