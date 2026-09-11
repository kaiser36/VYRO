import React from 'react';
import { ArrowRight, Layers, Sliders, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CategorySpotlightSectionProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenAdmin?: () => void;
}

export const CategorySpotlightSection: React.FC<CategorySpotlightSectionProps> = ({
  onSelectCategory,
  onOpenAdmin,
}) => {
  const { storeSettings, categories, products, isAdmin } = useStore();
  const banner = storeSettings.categoryBanner;

  if (!banner || !banner.enabled) {
    return null;
  }

  // Find targeted category
  const targetCategory = categories.find((c) => c.id === banner.categoryId) || categories[0];
  const catCount = targetCategory ? products.filter((p) => p.categoryId === targetCategory.id).length : 0;

  const handleCtaClick = () => {
    if (targetCategory) {
      onSelectCategory(targetCategory.id);
    }
  };

  const title = banner.title?.trim() || targetCategory?.name || 'Linha Técnica em Destaque';
  const subtitle = banner.subtitle?.trim() || targetCategory?.description || 'Meias desenvolvidas para atletas exigentes que não abrem mão de máximo desempenho e conforto biomecânico.';
  const badge = banner.badge?.trim() || 'Categoria em Foco';
  const buttonText = banner.buttonText?.trim() || `Ver Meias de ${targetCategory?.name || 'Categoria'}`;
  const imageUrl = banner.imageUrl || 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=1200&auto=format&fit=crop&q=80';

  return (
    <section className="relative py-10 sm:py-14 px-6 max-w-7xl mx-auto">
      <div className="relative bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white rounded-3xl sm:rounded-[36px] overflow-hidden border border-neutral-800 shadow-2xl">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Column: Content (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 z-10 flex flex-col justify-center">
            {/* Top Badge & Category Tag */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 text-[11px] font-bold tracking-wider uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </span>

              {targetCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-neutral-300 text-[11px] font-medium tracking-wide">
                  <Layers className="w-3 h-3 text-neutral-400" />
                  <span>{targetCategory.name} • {catCount} modelos</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal tracking-tight leading-tight mb-4">
              {title}
            </h3>

            {/* Subtitle */}
            <p className="text-neutral-300 text-sm sm:text-base font-sans leading-relaxed max-w-xl mb-8">
              {subtitle}
            </p>

            {/* Key Quality Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 pt-2 border-t border-neutral-800/80">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Zero Fricção</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Suporte Plantar 360°</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Produzido em Portugal</span>
              </div>
            </div>

            {/* Actions: CTA and Admin Button */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleCtaClick}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2.5 shadow-lg shadow-cyan-500/20 hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {isAdmin && onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                  title="Personalizar categoria, imagem e textos no Painel de Gestão"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Configurar na Gestão</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Visual Showcase Image (5 cols) */}
          <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-full min-h-[340px] overflow-hidden group">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-neutral-950/80" />

            {/* Floating Info Tag */}
            <div className="absolute bottom-6 right-6 z-10">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Coleção {targetCategory?.name || 'Técnica'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
