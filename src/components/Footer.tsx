import React from 'react';
import { ArrowUp, Mail, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { isAdmin, categories } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="about" className="bg-white border-t border-neutral-200 text-black pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-100">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white border border-neutral-200/80 p-1 flex items-center justify-center shadow-xs overflow-hidden">
                <img src="/logo.jpg" alt="VYRO Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-serif text-3xl text-black font-normal leading-none">
                  VYRO<sup className="text-xs font-sans text-cyan-600 font-bold ml-0.5">®</sup>
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-[#6F6F6F] font-semibold block mt-1">
                  Liberdade em Movimento
                </span>
              </div>
            </div>

            <p className="text-xs text-[#6F6F6F] leading-relaxed pr-2">
              Meias de alta performance desenhadas e produzidas em Portugal. Zero atrito, máximo suporte e retorno elástico duradouro.
            </p>

            <div className="flex items-center space-x-3 text-neutral-400">
              <a href="#" aria-label="Instagram" className="p-2 rounded-full border border-neutral-200 hover:text-black hover:border-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" aria-label="Strava Club" className="p-2 rounded-full border border-neutral-200 hover:text-black hover:border-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.926 15.54h4.172"/>
                </svg>
              </a>
              <a href="#" aria-label="X / Twitter" className="p-2 rounded-full border border-neutral-200 hover:text-black hover:border-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Categorias Dinâmicas */}
          <div>
            <h4 className="font-serif text-lg text-black mb-4">Categorias</h4>
            <ul className="space-y-2.5 text-xs text-[#6F6F6F]">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a href="#catalog" className="hover:text-black transition-colors">
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Suporte & Tecnologia */}
          <div>
            <h4 className="font-serif text-lg text-black mb-4">Apoio & Tech</h4>
            <ul className="space-y-2.5 text-xs text-[#6F6F6F]">
              <li><a href="#technology" className="hover:text-black transition-colors">Tecnologia ZeroBlister™</a></li>
              <li><a href="#technology" className="hover:text-black transition-colors">Guia de Tamanhos</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Envios & Devoluções (30 Dias)</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Condições Gerais de Venda</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Política de Privacidade</a></li>
              {onOpenAdmin && (
                <li className="pt-2">
                  <button
                    onClick={onOpenAdmin}
                    className="text-neutral-400 hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{isAdmin ? 'Painel de Gestão (Ativo)' : 'Área de Gestão'}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="font-serif text-lg text-black mb-4">Comunidade VYRO</h4>
            <p className="text-xs text-[#6F6F6F] leading-relaxed mb-3">
              Recebe 10% de desconto na primeira encomenda e acesso prioritário a lançamentos e edições limitadas.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Obrigado pela subscrição!'); }} className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  placeholder="O teu email..."
                  className="w-full pl-10 pr-3 py-2.5 text-xs border rounded-full border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
              >
                Subscrever
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6F6F6F]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} VYRO®. Todos os direitos reservados.</span>
            <span className="text-cyan-600 font-semibold">• Move • Live • Repeat</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <span className="text-[11px] text-neutral-400">Pagamentos Seguros: MB WAY, Multibanco, Cartão</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full border border-neutral-200 hover:border-black hover:text-black transition-colors cursor-pointer"
              title="Voltar ao Topo"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
