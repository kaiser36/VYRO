import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt autoplay immediately
    video.play().catch(() => {
      // Browsers allow muted autoplay
    });
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between">
      {/* Background video layer (z-0) */}
      <div
        className="absolute w-full h-full pointer-events-none z-0 overflow-hidden"
        style={{
          top: '260px',
          inset: 'auto 0 0 0',
        }}
      >
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          poster="/hero-poster.jpg"
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
          onPlaying={() => setIsVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-90'
          }`}
        />
        {/* Gradient overlays: seamless blending with page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-transparent to-[#FFFFFF] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF]/75 via-transparent to-[#FFFFFF]/50" />
      </div>

      {/* Hero Content Section (z-10) */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-7xl mx-auto"
        style={{
          paddingTop: 'calc(8rem - 75px)',
          paddingBottom: '10rem',
        }}
      >
        {/* Sub-badge indicating brand identity */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 bg-white/70 backdrop-blur-md mb-8 animate-fade-rise shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-[#6F6F6F] font-semibold">
            VYRO® • MEIAS DE ALTA PERFORMANCE BIOMECÂNICA
          </span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 ml-1" />
        </div>

        {/* Headline: LIBERDADE EM MOVIMENTO • MOVE • LIVE • REPEAT */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl font-normal font-serif text-[#000000] tracking-tight animate-fade-rise"
          style={{
            lineHeight: 1.08,
            letterSpacing: '-1.5px',
          }}
        >
          Liberdade em Movimento <span className="text-cyan-500 font-sans mx-1 sm:mx-1.5 inline-block">•</span>{' '}
          <span className="italic text-[#6F6F6F]">Move</span> <span className="text-cyan-500 font-sans mx-1 sm:mx-1.5 inline-block">•</span>{' '}
          <span className="italic text-[#6F6F6F]">Live</span> <span className="text-cyan-500 font-sans mx-1 sm:mx-1.5 inline-block">•</span>{' '}
          <span className="italic text-[#6F6F6F]">Repeat</span>
        </h1>

        {/* Short, punchy single-line subtitle */}
        <p className="text-sm sm:text-base max-w-xl mt-5 text-[#555555] font-sans font-medium animate-fade-rise-delay">
          Meias técnicas com suporte biomecânico e garantia Zero Bolhas.
        </p>

        {/* Hero CTA Button: Sleek & Clean */}
        <button
          onClick={onExploreClick}
          className="rounded-full px-10 py-4 text-sm mt-8 bg-black text-white font-sans hover:scale-[1.03] transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-[0.98] animate-fade-rise-delay-2 cursor-pointer flex items-center gap-2.5 group"
        >
          <span>Ver Coleção de Meias</span>
          <ArrowDown className="w-4 h-4 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 text-[#6F6F6F]/60 animate-bounce">
          <span className="text-xs tracking-widest uppercase font-medium">Explorar Meias</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
};
