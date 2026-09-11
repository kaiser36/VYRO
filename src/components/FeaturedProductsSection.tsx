import React from 'react';
import { Star, ArrowRight, Sliders, Sparkles } from 'lucide-react';
import { Product } from '../types/store';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

interface FeaturedProductsSectionProps {
  onQuickView: (product: Product) => void;
  onRequireAuth?: () => void;
  onOpenAdmin?: () => void;
  onExploreAll?: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onQuickView,
  onRequireAuth,
  onOpenAdmin,
  onExploreAll,
}) => {
  const { products, isAdmin } = useStore();

  // Get products marked as featured, fallback to first 3 if none flagged
  const featuredProducts = React.useMemo(() => {
    const explicitlyFeatured = products.filter((p) => p.isFeatured);
    if (explicitlyFeatured.length > 0) return explicitlyFeatured;
    return products.slice(0, 3);
  }, [products]);

  if (featuredProducts.length === 0) {
    return null;
  }

  const handleScrollToCatalog = () => {
    if (onExploreAll) {
      onExploreAll();
    } else {
      const el = document.getElementById('catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-16 sm:py-20 px-6 max-w-7xl mx-auto border-b border-neutral-100">
      {/* Background Accent Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-cyan-500/5 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[11px] font-bold tracking-wider uppercase mb-3 shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Seleção em Destaque</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-black font-normal tracking-tight">
            Meias em Destaque
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base max-w-xl mt-2 font-sans">
            Os modelos preferidos pelos atletas e maratonistas. Engenharia ergonómica com fricção zero e retorno elástico imediato.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isAdmin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold transition-all shadow-xs hover:shadow cursor-pointer"
              title="Escolher quais as meias em destaque no painel de administração"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-600" />
              <span>Gerir Destaques na Gestão</span>
            </button>
          )}

          <button
            onClick={handleScrollToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:text-cyan-600 transition-colors cursor-pointer group"
          >
            <span>Ver Toda a Coleção</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Featured Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${
        featuredProducts.length === 2
          ? 'lg:grid-cols-2 max-w-3xl mx-auto'
          : featuredProducts.length === 3
          ? 'lg:grid-cols-3'
          : 'lg:grid-cols-3 xl:grid-cols-4'
      } gap-6 sm:gap-8`}>
        {featuredProducts.map((product) => (
          <div key={product.id} className="relative">
            {/* Featured Floating Tag */}
            <div className="absolute top-2 right-2 z-20 pointer-events-none">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                <Star className="w-3 h-3 fill-amber-950" />
                Destaque
              </span>
            </div>

            <ProductCard
              product={product}
              onQuickView={onQuickView}
              onRequireAuth={onRequireAuth}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
