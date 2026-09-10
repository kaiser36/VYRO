import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Sparkles, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onSuccess,
}) => {
  const { login, register, loginAsDemo } = useUser();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredSize, setPreferredSize] = useState('39-42');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setSuccessMessage('Sessão iniciada com sucesso!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } else {
      setError(res.error || 'Erro ao iniciar sessão.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await register({
      name,
      email,
      password,
      phone,
      preferredSize,
    });
    setLoading(false);

    if (res.success) {
      setSuccessMessage('Conta criada! +100 Pontos VYRO creditados!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        if (onSuccess) onSuccess();
      }, 900);
    } else {
      setError(res.error || 'Erro ao criar conta.');
    }
  };

  const handleDemoClick = () => {
    loginAsDemo();
    setSuccessMessage('Sessão iniciada como Tiago Pereira (Demo)!');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
      if (onSuccess) onSuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-rise">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with decorative badge */}
        <div className="relative px-6 pt-6 pb-4 bg-neutral-900 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              VYRO Athletes Club
            </span>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Benefícios Exclusivos
            </span>
          </div>

          <h3 className="font-serif text-2xl font-normal text-white">
            {tab === 'login' ? 'Bem-vindo de volta' : 'Junta-te à VYRO'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {tab === 'login'
              ? 'Acede aos teus favoritos, histórico de compras e pontos.'
              : 'Ganha 100 pontos imediatos, acesso a edições limitadas e checkout expresso.'}
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-neutral-800/90 p-1 rounded-xl mt-4">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Iniciar Sessão
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Criar Conta (+100 Pts)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teu.email@exemplo.pt"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Palavra-passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'A verificar...' : 'Entrar na Conta'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-neutral-100 text-center">
                <button
                  type="button"
                  onClick={handleDemoClick}
                  className="w-full py-2 px-3 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-cyan-50 hover:text-cyan-800 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-neutral-200/80 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Entrar com Conta de Teste (Tiago Pereira)</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tiago Silva"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tiago@exemplo.pt"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Telemóvel
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="912 345 678"
                      className="w-full pl-8 pr-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Tamanho Meias
                  </label>
                  <select
                    value={preferredSize}
                    onChange={(e) => setPreferredSize(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="35-38">35-38</option>
                    <option value="39-42">39-42 (Padrão)</option>
                    <option value="43-46">43-46</option>
                    <option value="47-50">47-50</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Palavra-passe (mín. 4 carateres)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-cyan-50/70 border border-cyan-200/70 rounded-xl flex items-center gap-2 text-[11px] text-cyan-900">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                <span>Recebe logo <strong>100 Pontos VYRO</strong> no teu primeiro acesso!</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-neutral-900 to-black hover:from-black hover:to-neutral-950 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'A criar conta...' : 'Criar Conta & Ganhar 100 Pts'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
