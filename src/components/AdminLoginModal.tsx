import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(password);
    if (ok) {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-rise">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="font-serif text-3xl text-black font-normal">
          Acesso Administrativo
        </h3>
        <p className="text-xs text-[#6F6F6F] mt-1 font-sans">
          Inicia sessão para gerir o catálogo de meias VYRO, criar categorias e atualizar inventário.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-800 uppercase tracking-wide block mb-1.5">
              Palavra-passe de Acesso
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                placeholder="Insira a password de admin..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs border transition-all ${
                  error
                    ? 'border-red-500 focus:ring-red-400 ring-2'
                    : 'border-neutral-300 focus:border-black'
                } focus:outline-none`}
              />
            </div>
            {error && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" /> Palavra-passe incorreta. Tente "admin" ou "vyro2026".
              </p>
            )}
          </div>

          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 text-[11px] text-cyan-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <strong>Dica de Demonstração:</strong> Acesso predefinido disponível com a senha <code className="bg-white px-1.5 py-0.5 rounded border font-mono">admin</code> ou <code className="bg-white px-1.5 py-0.5 rounded border font-mono">vyro2026</code>.
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-black text-white font-medium text-xs hover:bg-neutral-800 hover:scale-[1.01] active:scale-95 transition-all shadow-md cursor-pointer"
          >
            Entrar no Painel de Controlo
          </button>
        </form>
      </div>
    </div>
  );
};
