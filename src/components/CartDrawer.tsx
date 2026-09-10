import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    total,
    freeShippingThreshold,
  } = useCart();

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="font-serif text-2xl text-black font-normal">O Teu Carrinho</h2>
              <span className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-100 text-xs">
            <div className="flex items-center justify-between font-medium mb-1.5">
              <span className="flex items-center gap-1.5 text-neutral-700">
                <Truck className="w-3.5 h-3.5 text-cyan-600" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Faltam <strong className="text-black">€{remainingForFreeShipping.toFixed(2)}</strong> para <strong>Envio Grátis</strong>
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold">Parabéns! Tens Envio Grátis 🎉</span>
                )}
              </span>
              <span className="text-[10px] text-neutral-400 font-bold">{freeShippingProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-black">O carrinho está vazio</h3>
                <p className="text-neutral-500 text-xs mt-2 max-w-xs">
                  Explora a nossa coleção de meias de performance e equipa-te com tecnologia de ponta.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Explorar Coleção
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 rounded-2xl border border-neutral-100 hover:border-neutral-200 bg-neutral-50/50 transition-all"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl bg-white border border-neutral-200 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-base text-black font-normal leading-tight line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                          title="Remover"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Attributes */}
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-[#6F6F6F]">
                        <span>Tam: <strong className="text-black">{item.selectedSize}</strong></span>
                        <span className="flex items-center gap-1">
                          Cor:
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20 inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-200 bg-white rounded-full px-2 py-0.5 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-neutral-500 hover:text-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-neutral-500 hover:text-black"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-black">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-neutral-50/70 space-y-4">
              <div className="space-y-2 text-xs text-[#6F6F6F]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Portes de Envio</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase">Grátis</span>
                    ) : (
                      <span className="font-semibold text-black">€{shipping.toFixed(2)}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-black pt-2 border-t border-neutral-200">
                  <span>Total (IVA incl.)</span>
                  <span className="text-xl font-serif">€{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-black text-white font-medium text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl cursor-pointer"
              >
                <span>Finalizar Encomenda</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                <span>Pagamento 100% Seguro • MB WAY, Cartão & Multibanco</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
