import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Shield,
  Truck,
  RefreshCw,
  Check,
  ChevronRight,
  Share2,
  Sparkles,
  Zap,
  Heart,
} from 'lucide-react';
import { Product, ProductColor } from '../types/store';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useUser } from '../context/UserContext';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onRequireAuth?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onSelectProduct,
  onRequireAuth,
}) => {
  const { addItem } = useCart();
  const { products, storeSettings } = useStore();
  const { isFavorite, toggleFavorite, isAuthenticated } = useUser();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Padrão', hex: '#00f2fe' }
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[0] || '39-42'
  );
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isOutOfStock = !product.inStock || (product.stock !== undefined && product.stock <= 0);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    setSelectedColor(product.colors[0] || { name: 'Padrão', hex: '#00f2fe' });
    setSelectedSize(product.sizes[0] || '39-42');
    setQuantity(1);
  }, [product]);

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 1800);
  };

  // Related products from the same category or others
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-black py-8 animate-fade-rise">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Navigation Breadcrumbs & Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-xs text-[#6F6F6F]">
            <button
              onClick={onBack}
              className="hover:text-black font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Início / Catálogo</span>
            </button>
            <ChevronRight className="w-3 h-3 text-neutral-300" />
            <span className="text-cyan-600 font-medium">{product.categoryName}</span>
            <ChevronRight className="w-3 h-3 text-neutral-300" />
            <span className="text-black font-semibold truncate max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-black hover:border-black transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Catálogo</span>
          </button>
        </div>

        {/* Main Product Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Image Showcase & Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/3.5] sm:aspect-[4/3] w-full rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-sm">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
              {product.badge && (
                <span className="absolute top-6 left-6 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-black/90 backdrop-blur-md text-white shadow-md">
                  {product.badge}
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="absolute top-6 right-6 px-3.5 py-1 text-xs font-bold rounded-full bg-cyan-500 text-white shadow-md">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% DESCONTO
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-cyan-500 ring-4 ring-cyan-100 shadow-md'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Service & Guarantee Badges (Configured by Admin) */}
            {storeSettings.guaranteeBadges.filter((gb) => gb.enabled).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                {storeSettings.guaranteeBadges
                  .filter((gb) => gb.enabled)
                  .map((gb) => {
                    const renderIcon = () => {
                      switch (gb.icon) {
                        case 'shield':
                          return <Shield className="w-5 h-5" />;
                        case 'refresh':
                          return <RefreshCw className="w-5 h-5" />;
                        case 'zap':
                          return <Zap className="w-5 h-5" />;
                        case 'check':
                          return <Check className="w-5 h-5" />;
                        case 'sparkles':
                          return <Sparkles className="w-5 h-5" />;
                        case 'truck':
                        default:
                          return <Truck className="w-5 h-5" />;
                      }
                    };

                    const getIconColors = () => {
                      switch (gb.icon) {
                        case 'shield':
                          return 'bg-blue-100 text-blue-700';
                        case 'refresh':
                          return 'bg-emerald-100 text-emerald-700';
                        case 'zap':
                          return 'bg-amber-100 text-amber-700';
                        case 'sparkles':
                          return 'bg-purple-100 text-purple-700';
                        case 'check':
                          return 'bg-teal-100 text-teal-700';
                        case 'truck':
                        default:
                          return 'bg-cyan-100 text-cyan-700';
                      }
                    };

                    return (
                      <div key={gb.id} className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconColors()}`}
                        >
                          {renderIcon()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-black">{gb.title}</div>
                          <div className="text-[11px] text-[#6F6F6F]">{gb.subtitle}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Right Column: Details & Purchase Options (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-widest text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200/60">
                  {product.categoryName}
                </span>

                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-950">{product.rating.toFixed(1)}</span>
                  <span className="text-[11px] text-amber-800">({product.reviewCount} avaliações)</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="font-serif text-4xl sm:text-5xl text-black font-normal tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-[#6F6F6F] mt-2 font-sans font-medium">
                  {product.tagline}
                </p>
              </div>

              {/* Price & Stock Status */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-bold text-black font-sans">
                  €{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-neutral-400 line-through">
                    €{product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-neutral-400 font-medium">IVA incluído</span>

                {isOutOfStock ? (
                  <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    Esgotado
                  </span>
                ) : product.stock !== undefined && product.stock <= 5 ? (
                  <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Últimas {product.stock} unidades!
                  </span>
                ) : (
                  <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Em Stock {product.stock !== undefined ? `(${product.stock} un.)` : ''}
                  </span>
                )}
              </div>

              {/* Long Description */}
              <p className="text-sm text-neutral-600 leading-relaxed font-sans border-t border-neutral-100 pt-4">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="border-t border-neutral-100 pt-4">
                <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-2.5">
                  Cor: <span className="font-medium text-neutral-500">{selectedColor.name}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs transition-all cursor-pointer ${
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

              {/* Size Selector */}
              <div className="border-t border-neutral-100 pt-4">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider">
                    Tamanho Disponível:
                  </label>
                  <span className="text-[11px] text-cyan-600 underline font-medium cursor-pointer">
                    Guia de Tamanhos Biomecânico
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-3 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-black text-white border-black shadow-md scale-[1.02]'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Features & Tech List */}
              <div className="border-t border-neutral-100 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">
                  Especificações Técnicas:
                </h3>
                <ul className="space-y-2 text-xs text-neutral-600">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-cyan-600 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                {product.materials && (
                  <p className="text-[11px] text-neutral-500 mt-3 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
                    <strong className="text-black">Composição Têxtil:</strong> {product.materials}
                  </p>
                )}
              </div>
            </div>

            {/* Purchase CTA Bar */}
            <div className="mt-8 pt-6 border-t border-neutral-200 flex items-center gap-4">
              {/* Quantity */}
              <div className={`flex items-center border border-neutral-300 rounded-full px-4 py-2 bg-neutral-50 ${isOutOfStock ? 'opacity-40 pointer-events-none' : ''}`}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="text-neutral-500 hover:text-black font-bold px-2 py-1 text-sm cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock}
                  className="text-neutral-500 hover:text-black font-bold px-2 py-1 text-sm cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addedSuccess}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-full text-sm font-semibold transition-all duration-300 shadow-xl ${
                  isOutOfStock
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                    : addedSuccess
                    ? 'bg-emerald-600 text-white scale-[1.01] cursor-pointer'
                    : 'bg-black text-white hover:bg-neutral-900 hover:scale-[1.02] cursor-pointer'
                }`}
              >
                {isOutOfStock ? (
                  <span>Produto Esgotado</span>
                ) : addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Adicionado ao Carrinho!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-cyan-400" />
                    <span>Adicionar ao Carrinho • €{(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>

              {/* Wishlist Heart Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated && onRequireAuth) {
                    onRequireAuth();
                    return;
                  }
                  toggleFavorite(product.id);
                }}
                title={isFavorite(product.id) ? "Remover dos favoritos" : "Guardar nos favoritos"}
                className={`p-4 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                  isFavorite(product.id)
                    ? 'border-rose-300 bg-rose-50 text-rose-500 shadow-xs'
                    : 'border-neutral-200 text-neutral-600 hover:text-rose-500 hover:border-neutral-400'
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-transform active:scale-125 ${
                    isFavorite(product.id) ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-cyan-600 font-bold">
                  Continua a Explorar
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-black mt-1">
                  Outras Meias da Coleção
                </h3>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-semibold text-neutral-600 hover:text-black underline cursor-pointer"
              >
                Ver Todas as Meias
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(selected) => onSelectProduct(selected)}
                  onRequireAuth={onRequireAuth}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
