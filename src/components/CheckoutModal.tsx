import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Building2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { addOrder } = useStore();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'mbway' | 'multibanco' | 'card'>('mbway');
  const [formData, setFormData] = useState({
    name: 'Tiago Silva',
    email: 'tiago.silva@exemplo.pt',
    phone: '912 345 678',
    address: 'Avenida da Liberdade 120, 3º Dto',
    city: 'Lisboa',
    postalCode: '1250-142',
  });
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = addOrder({
      customerName: formData.name,
      customerEmail: formData.email,
      customerCity: formData.city,
      items: items.map((it) => ({
        productName: it.product.name,
        size: it.selectedSize,
        colorName: it.selectedColor.name,
        quantity: it.quantity,
        price: it.product.price,
      })),
      totalAmount: total,
      paymentMethod,
      status: 'Pago',
    });
    setOrderNumber(newOrder.id);
    setStep('success');
    clearCart();
  };

  const handleClose = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-rise">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-600" />
            <h3 className="font-serif text-2xl text-black font-normal">
              {step === 'form' ? 'Checkout Seguro' : 'Encomenda Confirmada'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order quick recap */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 text-xs">
                <div className="flex justify-between font-semibold text-black mb-2">
                  <span>Resumo do Pedido ({items.length} itens)</span>
                  <span className="text-cyan-600 text-sm">Total: €{total.toFixed(2)}</span>
                </div>
                <div className="text-[#6F6F6F] space-y-1">
                  {items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>
                        {it.quantity}x {it.product.name} ({it.selectedSize})
                      </span>
                      <span>€{(it.product.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-3">
                  1. Dados de Envio
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-500 font-medium block mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-500 font-medium block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-500 font-medium block mb-1">
                      Telemóvel
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-500 font-medium block mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-3 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-neutral-500 font-medium block mb-1">
                      Morada de Entrega
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-3">
                  2. Método de Pagamento
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mbway')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'mbway'
                        ? 'border-cyan-500 bg-cyan-50/50 shadow-sm font-semibold'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-cyan-600 mb-1" />
                    <span className="text-xs font-bold">MB WAY</span>
                    <span className="text-[10px] text-neutral-500">Imediato</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('multibanco')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'multibanco'
                        ? 'border-cyan-500 bg-cyan-50/50 shadow-sm font-semibold'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="text-xs font-bold">Multibanco</span>
                    <span className="text-[10px] text-neutral-500">Ref. Automática</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-cyan-500 bg-cyan-50/50 shadow-sm font-semibold'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-neutral-800 mb-1" />
                    <span className="text-xs font-bold">Cartão</span>
                    <span className="text-[10px] text-neutral-500">Visa / Mastercard</span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-black text-white font-medium text-sm hover:scale-[1.01] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirmar Encomenda • €{total.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </form>
          ) : (
            <div className="py-8 text-center flex flex-col items-center justify-center animate-fade-rise">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
                Pagamento Autorizado
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-black mt-1">
                Obrigado pelo teu pedido!
              </h3>
              <p className="text-xs text-neutral-500 mt-2 max-w-md">
                A tua encomenda de meias técnicas VYRO foi registada com sucesso. Enviámos a confirmação e os detalhes de rastreio para <strong>{formData.email}</strong>.
              </p>

              {/* Reference box */}
              <div className="mt-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 w-full max-w-sm text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Referência do Pedido:</span>
                  <strong className="text-black">{orderNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Método de Envio:</span>
                  <span className="text-black font-medium">Correio Expresso 24h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Estimativa de Entrega:</span>
                  <span className="text-emerald-600 font-bold">1 a 2 dias úteis</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="mt-8 px-8 py-3 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Voltar à Loja
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
