import React from 'react';
import { Shield, Zap, Wind, Activity, ArrowUpRight } from 'lucide-react';

export const TechSection: React.FC = () => {
  return (
    <section id="technology" className="py-24 bg-neutral-900 text-white relative overflow-hidden">
      {/* Subtle glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Biomimética & Engenharia Têxtil</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl text-white font-normal tracking-tight">
            Nascida Para o Movimento Contínuo.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-4 font-sans leading-relaxed">
            Combinamos fios de alta precisão molecular com tecelagem tridimensional para criar meias que atuam como uma segunda pele inteligente.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-neutral-800/60 border border-neutral-700/60 hover:border-cyan-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-white font-normal mb-2">ZeroBlister™ Toe</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Costura ultrafina selada termicamente na biqueira que erradica pontos de fricção e elimina bolhas mesmo sob 42km de asfalto.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-neutral-800/60 border border-neutral-700/60 hover:border-cyan-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-white font-normal mb-2">AirFlow 3D Mesh</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Canais microperfurados no peito do pé que expulsam o calor acumulado e aceleram a evaporação da transpiração em 2.4x.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-neutral-800/60 border border-neutral-700/60 hover:border-cyan-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-white font-normal mb-2">Gradual 20mmHg</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Compressão calibrada milimetricamente para otimizar o fluxo sanguíneo venoso, atrasar o ácido láctico e acelerar o recovery.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-3xl bg-neutral-800/60 border border-neutral-700/60 hover:border-cyan-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-white font-normal mb-2">Silver Q-Skin®</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Micropartículas de prata fundidas no filamento da poliamida que neutralizam o odor e impedem a proliferação bacteriana permanentemente.
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 pt-12 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-serif text-4xl sm:text-5xl text-cyan-400 font-normal">0%</div>
            <div className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Fricção e Bolhas</div>
          </div>
          <div>
            <div className="font-serif text-4xl sm:text-5xl text-white font-normal">2.4x</div>
            <div className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Secagem Rápida</div>
          </div>
          <div>
            <div className="font-serif text-4xl sm:text-5xl text-cyan-400 font-normal">360°</div>
            <div className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Apoio Plantar</div>
          </div>
          <div>
            <div className="font-serif text-4xl sm:text-5xl text-white font-normal">100%</div>
            <div className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Move • Live • Repeat</div>
          </div>
        </div>
      </div>
    </section>
  );
};
