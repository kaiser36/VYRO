import React, { useState } from 'react';
import { X, Star, ShoppingBag, Shield, Truck, RefreshCw, Check } from 'lucide-react';
import { Product, ProductColor } from '../types/store';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { name: 'Padrão', hex: '#00f2fe' });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '39-42');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleAdd = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-rise">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-neutral-100 text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="md:w-1/2 bg-neutral-100 p-6 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-inner">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3.5 py-1 text-xs font-bold rounded-full bg-black text-white">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-neutral-200/80 text-center text-[11px] text-[#6F6F6F]">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-cyan-600" />
              <span>Envio 24/48h</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield className="w-4 h-4 text-cyan-600" />
              <span>Garantia 2 Anos</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="w-4 h-4 text-cyan-600" />
              <span>30 Dias Devolução</span>
            </div>
          </div>
        </div>

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
              {product.categoryName}
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-black mt-1 font-normal">
              {product.name}
            </h2>

            <p className="text-xs text-[#6F6F6F] mt-1 font-sans">{product.tagline}</p>

            {/* Price & Rating */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-black font-sans">
                  €{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    €{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-amber-900">{product.rating.toFixed(1)}</span>
                <span className="text-[10px] text-amber-700">({product.reviewCount} avaliações)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-600 mt-5 leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Colors */}
            <div className="mt-6">
              <label className="text-xs font-semibold text-neutral-800 uppercase tracking-wide">
                Cor: <span className="font-normal text-[#6F6F6F]">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-3 mt-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                      selectedColor.name === c.name
                        ? 'border-black bg-neutral-50 shadow-sm font-semibold'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-neutral-800 uppercase tracking-wide">
                  Tamanho:
                </label>
                <span className="text-[11px] text-cyan-600 underline cursor-pointer">
                  Guia de Tamanhos
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedSize === s
                        ? 'bg-black text-white border-black shadow-md'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Features bullet points */}
            <div className="mt-6 pt-5 border-t border-neutral-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Tecnologia & Benefícios:
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-600">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              {product.materials && (
                <p className="text-[11px] text-neutral-400 mt-2">
                  <strong className="text-neutral-600">Composição:</strong> {product.materials}
                </p>
              )}
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="mt-8 pt-4 border-t border-neutral-200 flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-neutral-300 rounded-full px-3 py-1.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-neutral-500 hover:text-black font-bold px-2"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-neutral-500 hover:text-black font-bold px-2"
              >
                +
              </button>
            </div>

            {/* Submit button */}
            <button
              onClick={handleAdd}
              disabled={addedSuccess}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg cursor-pointer ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black text-white hover:bg-neutral-900 hover:scale-[1.02]'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Adicionado com Sucesso!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar ao Carrinho • €{(product.price * quantity).toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
