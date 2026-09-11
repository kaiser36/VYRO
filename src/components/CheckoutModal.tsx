import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  ArrowRight,
  Sparkles,
  User,
  Ticket,
  Tag,
  Check,
  Copy,
  CheckCheck,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useUser } from '../context/UserContext';
import { createEasypayPayment, EasypayPaymentResult } from '../services/easypayService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOrders?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onViewOrders }) => {
  const { items, total, clearCart } = useCart();
  const { addOrder, storeSettings, orders } = useStore();
  const { currentUser, isAuthenticated, useVoucher, assignCouponToUser } = useUser();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'mbway' | 'multibanco' | 'card'>('mbway');
  const [mbwayPhoneInput, setMbwayPhoneInput] = useState('');
  const [easypayResult, setEasypayResult] = useState<EasypayPaymentResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [earnedFirstOrderCoupon, setEarnedFirstOrderCoupon] = useState<string | null>(null);

  // Coupon & Voucher state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: 'amount' | 'percent' | 'free_shipping' | 'free_product';
    discountValue: number;
    title: string;
  } | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [orderNumber, setOrderNumber] = useState('');

  // Sync with logged-in user profile if available
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address?.street || '',
        city: currentUser.address?.city || '',
        postalCode: currentUser.address?.postalCode || '',
      });
      if (currentUser.phone) {
        setMbwayPhoneInput(currentUser.phone);
      }
    } else {
      setFormData({
        name: 'Tiago Silva',
        email: 'tiago.silva@exemplo.pt',
        phone: '912 345 678',
        address: 'Avenida da Liberdade 120, 3º Dto',
        city: 'Lisboa',
        postalCode: '1250-142',
      });
      setMbwayPhoneInput('912 345 678');
    }
  }, [currentUser, isOpen]);

  const handleCopyText = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2500);
  };

  if (!isOpen) return null;

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'amount') {
      discountAmount = Math.min(total, appliedCoupon.discountValue);
    } else if (appliedCoupon.discountType === 'percent') {
      discountAmount = (total * appliedCoupon.discountValue) / 100;
    } else if (appliedCoupon.discountType === 'free_shipping') {
      discountAmount = 0; // Handled as shipping waiver
    }
  }

  const finalTotal = Math.max(0, total - discountAmount);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    setCouponError(null);
    setCouponMessage(null);

    if (!code) return;

    // Check user redeemed vouchers first
    const userVoucher = (currentUser?.redeemedVouchers || []).find(
      (v) => v.code.toUpperCase() === code && !v.isUsed
    );

    if (userVoucher) {
      setAppliedCoupon({
        code: userVoucher.code,
        discountType: userVoucher.discountType,
        discountValue: userVoucher.discountValue,
        title: userVoucher.title,
      });
      setCouponMessage(`Cupão ${userVoucher.code} aplicado com sucesso!`);
      setCouponCodeInput('');
      return;
    }

    // Check store loyalty rewards with coupon codes
    const rewardMatch = (storeSettings.loyaltySettings?.rewards || []).find(
      (r) => r.couponCode?.toUpperCase() === code && r.enabled
    );

    if (rewardMatch) {
      if (rewardMatch.minOrderValue && total < rewardMatch.minOrderValue) {
        setCouponError(`Este cupão exige uma encomenda mínima de €${rewardMatch.minOrderValue.toFixed(2)}.`);
        return;
      }

      setAppliedCoupon({
        code: rewardMatch.couponCode || code,
        discountType: rewardMatch.discountType || 'amount',
        discountValue: rewardMatch.discountValue || 5,
        title: rewardMatch.title,
      });
      setCouponMessage(`Oferta "${rewardMatch.title}" aplicada!`);
      setCouponCodeInput('');
      return;
    }

    setCouponError('Código de cupão inválido ou já utilizado.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    const customerEmail = currentUser ? currentUser.email : formData.email;
    const phoneForPayment = paymentMethod === 'mbway' ? (mbwayPhoneInput || formData.phone) : formData.phone;

    // Call Easypay Service (live API if configured or simulation)
    const epPayment = await createEasypayPayment(
      storeSettings.easypaySettings,
      {
        amount: finalTotal,
        method: paymentMethod,
        customerName: formData.name,
        customerEmail: customerEmail,
        customerPhone: phoneForPayment,
        orderId: `VYRO-${Date.now().toString().slice(-6)}`,
      }
    );

    setEasypayResult(epPayment);

    // If Multibanco, order status is 'Pendente' until payment receipt; otherwise 'Pago'
    const initialStatus = paymentMethod === 'multibanco' ? 'Pendente' : 'Pago';

    const newOrder = addOrder({
      customerName: formData.name,
      customerEmail: customerEmail,
      customerCity: formData.city,
      items: items.map((it) => ({
        productId: it.product.id,
        productName: it.product.name,
        size: it.selectedSize,
        colorName: it.selectedColor.name,
        quantity: it.quantity,
        price: it.product.price,
      })),
      totalAmount: finalTotal,
      paymentMethod,
      status: initialStatus,
      easypayPaymentId: epPayment.paymentId,
      easypayStatus: epPayment.status,
      mbwayPhone: paymentMethod === 'mbway' ? phoneForPayment : undefined,
      multibancoEntity: epPayment.multibancoEntity,
      multibancoReference: epPayment.multibancoReference,
      multibancoExpiration: epPayment.multibancoExpiration,
      paymentUrl: epPayment.paymentUrl,
    });

    const userPreviousOrders = orders.filter(
      (o) => o.customerEmail.toLowerCase() === customerEmail.toLowerCase()
    );
    const isFirstOrder = userPreviousOrders.length === 0;

    if (isAuthenticated && currentUser) {
      if (appliedCoupon) {
        useVoucher(appliedCoupon.code);
      }

      // Check if automatic first-order coupon is enabled
      if (
        isFirstOrder &&
        storeSettings.automaticCoupons?.firstOrderCouponEnabled &&
        storeSettings.automaticCoupons?.firstOrderCouponCode
      ) {
        const firstCode = storeSettings.automaticCoupons.firstOrderCouponCode;
        const matchedReward = (storeSettings.loyaltySettings?.rewards || []).find(
          (r) => r.couponCode?.toUpperCase() === firstCode.toUpperCase()
        );
        assignCouponToUser(currentUser.id, {
          code: firstCode.toUpperCase(),
          title: matchedReward?.title || 'Cupão de Agradecimento (1ª Compra)',
          discountType: matchedReward?.discountType || 'percent',
          discountValue: matchedReward?.discountValue ?? 10,
        });
        setEarnedFirstOrderCoupon(firstCode);
      }
    }

    setOrderNumber(newOrder.id);
    setIsProcessingPayment(false);
    setStep('success');
    clearCart();
  };

  const handleClose = () => {
    setStep('form');
    setEasypayResult(null);
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
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logged in badge */}
              {isAuthenticated ? (
                <div className="p-3 bg-cyan-50 border border-cyan-200/80 rounded-2xl flex items-center justify-between text-xs text-cyan-950">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-700" />
                    <span>Sessão iniciada como <strong>{currentUser?.name}</strong></span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs text-neutral-600 flex items-center justify-between">
                  <span>A finalizar compra como visitante.</span>
                </div>
              )}

              {/* Order quick recap */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 text-xs">
                <div className="flex justify-between font-semibold text-black mb-2">
                  <span>Resumo do Pedido ({items.length} itens)</span>
                  <div className="text-right">
                    {discountAmount > 0 ? (
                      <div>
                        <span className="text-neutral-400 line-through text-xs mr-2">€{total.toFixed(2)}</span>
                        <span className="text-emerald-700 text-sm font-bold">€{finalTotal.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-cyan-600 text-sm">Total: €{total.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className="text-[#6F6F6F] space-y-1">
                  {items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>
                        {it.quantity}x {it.product.name} ({it.selectedSize} - {it.selectedColor.name})
                      </span>
                      <span>€{(it.product.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-neutral-200/60">
                      <span>Desconto ({appliedCoupon?.code}):</span>
                      <span>-€{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Details */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-3">
                  1. Dados de Envio
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-neutral-600 mb-1 font-medium">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1 font-medium">Telemóvel</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1 font-medium">Cidade</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-600 mb-1 font-medium">Morada Completa</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1 font-medium">Código Postal</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Cupões & Ofertas do Clube */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 text-xs">
                <div className="flex items-center gap-2 mb-2 font-bold text-black uppercase tracking-wider text-[11px]">
                  <Tag className="w-3.5 h-3.5 text-purple-600" />
                  <span>Cupão de Desconto / Oferta do Clube</span>
                </div>

                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cupão Ativo: <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-200">{appliedCoupon.code}</code></span>
                      </div>
                      <span className="text-[11px] text-emerald-700 block mt-0.5">
                        {appliedCoupon.title} • -€{discountAmount.toFixed(2)} de desconto
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-[11px] font-bold text-neutral-500 hover:text-rose-600 underline cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Insere o código (ex: VYRO5OFF)"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-xl font-mono text-xs uppercase focus:outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
                      >
                        Aplicar
                      </button>
                    </div>

                    {/* Quick select from user redeemed vouchers */}
                    {isAuthenticated && (currentUser?.redeemedVouchers || []).filter((v) => !v.isUsed).length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-200/60">
                        <span className="text-[10px] text-neutral-500 block mb-1 font-medium">Os teus cupões disponíveis:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(currentUser?.redeemedVouchers || [])
                            .filter((v) => !v.isUsed)
                            .map((v) => (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => handleApplyCoupon(v.code)}
                                className="px-2 py-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Ticket className="w-3 h-3 text-purple-600" />
                                <span>{v.code} ({v.title})</span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {couponMessage && (
                      <p className="mt-1.5 text-xs text-emerald-700 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> {couponMessage}
                      </p>
                    )}
                    {couponError && (
                      <p className="mt-1.5 text-xs text-rose-600 font-medium">
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
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
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'mbway'
                        ? 'border-black bg-neutral-50 ring-1 ring-black shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-cyan-600 mb-2" />
                    <span className="text-xs font-bold text-black block">MB WAY</span>
                    <span className="text-[10px] text-neutral-500">Notificação telemóvel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('multibanco')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'multibanco'
                        ? 'border-black bg-neutral-50 ring-1 ring-black shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-neutral-800 mb-2" />
                    <span className="text-xs font-bold text-black block">Multibanco</span>
                    <span className="text-[10px] text-neutral-500">Entidade e Referência</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-black bg-neutral-50 ring-1 ring-black shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-neutral-800 mb-2" />
                    <span className="text-xs font-bold text-black block">Cartão</span>
                    <span className="text-[10px] text-neutral-500">Visa / Mastercard</span>
                  </button>
                </div>

                {/* Sub-options based on method */}
                {paymentMethod === 'mbway' && (
                  <div className="mt-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 animate-fade-rise space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-neutral-800">
                        Nº de Telemóvel associado ao MB WAY
                      </label>
                      <span className="text-[10px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200 font-semibold">
                        Notificação push imediata
                      </span>
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="ex: 912 345 678"
                      value={mbwayPhoneInput}
                      onChange={(e) => setMbwayPhoneInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono focus:outline-none focus:border-cyan-600"
                    />
                    <p className="text-[10px] text-neutral-500 leading-tight">
                      Irás receber uma notificação na tua aplicação MB WAY para aprovar o pagamento de €{finalTotal.toFixed(2)} em 4 minutos.
                    </p>
                  </div>
                )}

                {paymentMethod === 'multibanco' && (
                  <div className="mt-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 animate-fade-rise text-xs text-neutral-600 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                      <Building2 className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Referência de Pagamento Multibanco</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 leading-tight">
                      Após confirmares, serão gerados os dados oficiais (Entidade, Referência e Montante) para pagamento em qualquer caixa Multibanco ou através do teu Homebanking.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="mt-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 animate-fade-rise text-xs text-neutral-600 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                      <CreditCard className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Cartão Bancário com 3D Secure</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 leading-tight">
                      Transação segura processada pela infraestrutura certificada Easypay.
                    </p>
                  </div>
                )}

                {/* Easypay Trust Badge */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 px-1">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Pagamentos encriptados e auditados</span>
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    Processado por <strong className="text-black font-semibold">easypay</strong>
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-4 rounded-full bg-black text-white font-medium text-sm hover:scale-[1.01] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>A comunicar com Easypay...</span>
                  </>
                ) : (
                  <>
                    <span>
                      Confirmar Encomenda • €{finalTotal.toFixed(2)}
                      {discountAmount > 0 && ` (Desconto -€${discountAmount.toFixed(2)})`}
                    </span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="py-6 text-center flex flex-col items-center justify-center animate-fade-rise">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                paymentMethod === 'multibanco' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className={`text-xs font-bold uppercase tracking-wider ${
                paymentMethod === 'multibanco' ? 'text-amber-600' : 'text-cyan-600'
              }`}>
                {paymentMethod === 'multibanco' ? 'Aguarda Pagamento Multibanco' : 'Pagamento Autorizado'}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-black mt-1">
                {paymentMethod === 'multibanco' ? 'Encomenda Registada!' : 'Obrigado pelo teu pedido!'}
              </h3>
              <p className="text-xs text-neutral-500 mt-2 max-w-md">
                A tua encomenda de meias técnicas VYRO foi registada com sucesso. Enviámos os detalhes para <strong>{formData.email}</strong>.
              </p>

              {/* Multibanco Voucher Slip */}
              {paymentMethod === 'multibanco' && easypayResult && (
                <div className="mt-6 w-full max-w-sm rounded-2xl border-2 border-neutral-800 bg-white overflow-hidden shadow-lg animate-fade-rise text-left">
                  <div className="bg-neutral-900 text-white px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-xs uppercase tracking-wider">Dados de Pagamento Multibanco</span>
                    </div>
                    <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono">
                      easypay
                    </span>
                  </div>

                  <div className="p-4 space-y-3 divide-y divide-neutral-100 text-xs">
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-neutral-500 font-medium">Entidade:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-black">
                          {easypayResult.multibancoEntity || '21234'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(easypayResult.multibancoEntity || '21234', 'entity')}
                          className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                          title="Copiar Entidade"
                        >
                          {copiedField === 'entity' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-neutral-500 font-medium">Referência:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-black tracking-wider">
                          {easypayResult.multibancoReference || '123 456 789'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(easypayResult.multibancoReference?.replace(/\s/g, '') || '123456789', 'ref')}
                          className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                          title="Copiar Referência"
                        >
                          {copiedField === 'ref' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-neutral-500 font-medium">Montante:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-emerald-600">
                          €{finalTotal.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(finalTotal.toFixed(2), 'amount')}
                          className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                          title="Copiar Montante"
                        >
                          {copiedField === 'amount' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[11px]">
                      <span className="text-neutral-500">Validade:</span>
                      <span className="text-amber-700 font-medium">
                        {easypayResult.multibancoExpiration
                          ? new Date(easypayResult.multibancoExpiration).toLocaleDateString('pt-PT')
                          : '3 dias úteis'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-neutral-50 px-4 py-2 border-t border-neutral-200 text-[10px] text-neutral-500 leading-tight">
                    Homebanking / Caixa Multibanco &gt; Pagamentos &gt; Compras e Serviços.
                  </div>
                </div>
              )}

              {/* MB WAY prompt */}
              {paymentMethod === 'mbway' && (
                <div className="mt-5 p-4 rounded-2xl bg-cyan-50 border border-cyan-200 w-full max-w-sm text-left text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-cyan-900">
                    <Smartphone className="w-4 h-4 text-cyan-600" />
                    <span>Confirma na tua app MB WAY</span>
                  </div>
                  <p className="text-[11px] text-cyan-800 leading-relaxed">
                    Enviámos o pedido de autorização de <strong>€{finalTotal.toFixed(2)}</strong> para o telemóvel <strong>{mbwayPhoneInput || formData.phone}</strong>. Abre a aplicação e aprova a compra.
                  </p>
                </div>
              )}

              {/* Order summary box */}
              <div className="mt-5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 w-full max-w-sm text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Referência do Pedido:</span>
                  <strong className="text-black">{orderNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Método de Pagamento:</span>
                  <span className="text-black font-medium capitalize">
                    {paymentMethod === 'mbway' ? 'MB WAY' : paymentMethod === 'multibanco' ? 'Multibanco' : 'Cartão de Crédito'}
                  </span>
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

              {earnedFirstOrderCoupon && (
                <div className="mt-4 p-4 rounded-2xl bg-purple-50 border border-purple-200/90 text-left text-xs max-w-sm w-full space-y-1 animate-fade-rise">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <Ticket className="w-4 h-4 text-purple-600" />
                    <span>Recompensa de 1ª Compra Atribuída!</span>
                  </div>
                  <p className="text-[11px] text-purple-700 leading-relaxed">
                    Recebeste o cupão <strong className="font-mono bg-white px-2 py-0.5 rounded border border-purple-200 text-purple-900 font-bold">{earnedFirstOrderCoupon}</strong>. Já se encontra guardado na tua conta para a próxima encomenda!
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 mt-7">
                {onViewOrders && (
                  <button
                    onClick={() => {
                      handleClose();
                      onViewOrders();
                    }}
                    className="px-6 py-3 rounded-full bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-700 transition-colors cursor-pointer"
                  >
                    Ver no Meu Perfil
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="px-6 py-3 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Continuar a Comprar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
