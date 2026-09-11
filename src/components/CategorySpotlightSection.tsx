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
    <section className="relative w-full overflow-hidden bg-neutral-950 text-white border-y border-neutral-800/80 my-0">
      {/* Full-bleed Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-center lg:object-[center_right] transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Gradient Overlays to guarantee readability and seamless hero atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/90 lg:bg-gradient-to-r lg:from-neutral-950 lg:via-neutral-950/85 lg:to-neutral-950/30" />
        <div className="absolute inset-0 bg-neutral-950/30 backdrop-blur-[0.5px]" />
        
        {/* Ambient cyan glow */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Hero Content Container spanning max-w-7xl but centered within the 100% full-width banner */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-20 sm:py-24 lg:py-32 flex flex-col justify-center min-h-[520px] lg:min-h-[580px]">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{badge}</span>
            </span>

            {targetCategory && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-neutral-200 text-xs font-medium tracking-wide">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>{targetCategory.name} • {catCount} {catCount === 1 ? 'modelo' : 'modelos disponíveis'}</span>
              </span>
            )}
          </div>

          {/* Headline */}
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-[1.15] mb-5">
            {title}
          </h2>

          {/* Subtitle / Description */}
          <p className="text-neutral-200 text-base sm:text-lg font-sans leading-relaxed max-w-2xl mb-8 drop-shadow-sm">
            {subtitle}
          </p>

          {/* Quality Feature Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 pt-4 border-t border-white/10 max-w-xl">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Zero Bolhas Garantido</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Suporte Biomecânico 360°</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>100% Feito em Portugal</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleCtaClick}
              className="px-8 py-4 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-3 shadow-xl shadow-cyan-400/25 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {isAdmin && onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-5 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-neutral-200 hover:text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
                title="Personalizar categoria, imagem e textos no Painel de Gestão"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Configurar na Gestão</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom-Right Category Badge on Desktop */}
      <div className="hidden lg:flex absolute bottom-8 right-12 z-10 items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-2xl">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>Coleção Oficial VYRO® • {targetCategory?.name || 'Técnica'}</span>
      </div>
    </section>
  );
};
