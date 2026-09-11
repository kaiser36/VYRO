import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Star, Check, Heart } from 'lucide-react';
import { Product, ProductColor } from '../types/store';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onRequireAuth?: () => void;
  initialSize?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onRequireAuth, initialSize }) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite, isAuthenticated } = useUser();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { name: 'Padrão', hex: '#00f2fe' });
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (initialSize && product.sizes.includes(initialSize)) {
      return initialSize;
    }
    return product.sizes[0] || '39-42';
  });

  useEffect(() => {
    if (initialSize && product.sizes.includes(initialSize)) {
      setSelectedSize(initialSize);
    }
  }, [initialSize, product.sizes]);

  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFav = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, selectedSize, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated && onRequireAuth) {
      onRequireAuth();
      return;
    }
    toggleFavorite(product.id);
  };

  const isOutOfStock = !product.inStock || (product.stock !== undefined && product.stock <= 0);

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:border-black/20 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Box */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${
            isOutOfStock ? 'opacity-60 grayscale-30' : ''
          }`}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full bg-rose-600 text-white shadow-sm">
              ESGOTADO
            </span>
          ) : (
            product.stock !== undefined && product.stock <= 5 && (
              <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-amber-500 text-white shadow-sm">
                Últimas {product.stock} un.
              </span>
            )
          )}
          {product.badge && (
            <span className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full bg-black/80 backdrop-blur-md text-white shadow-sm">
              {product.badge}
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-cyan-500 text-white shadow-sm">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Remover dos favoritos" : "Guardar nos favoritos"}
          title={isFav ? "Remover dos favoritos" : "Guardar nos favoritos"}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
            isFav
              ? 'bg-white text-rose-500 shadow-md scale-105'
              : 'bg-white/80 backdrop-blur-sm text-neutral-600 hover:text-rose-500 hover:bg-white hover:scale-110 shadow-xs'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFav ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex items-center gap-2 bg-white/95 text-black px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-all hover:bg-white hover:scale-105"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Detalhes</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-[#6F6F6F] mb-1">
          <span className="uppercase tracking-wider font-medium text-[11px] text-cyan-600">
            {product.categoryName}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-black">{product.rating.toFixed(1)}</span>
            <span className="text-[11px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl sm:text-2xl text-black font-normal leading-snug group-hover:text-cyan-700 transition-colors">
          {product.name}
        </h3>

        {/* Tagline */}
        <p className="text-xs text-[#6F6F6F] line-clamp-1 mt-1 font-sans">
          {product.tagline}
        </p>

        {/* Colors Swatch */}
        <div className="flex items-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
          <span className="text-[11px] text-neutral-400 font-medium">Cores:</span>
          <div className="flex items-center gap-1.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c)}
                title={c.name}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColor.name === c.name
                    ? 'ring-2 ring-offset-1 ring-black scale-110'
                    : 'border-neutral-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Sizes Chips */}
        <div className="flex items-center gap-1.5 mt-3" onClick={(e) => e.stopPropagation()}>
          <span className="text-[11px] text-neutral-400 font-medium">Tam:</span>
          <div className="flex items-center gap-1">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border transition-colors ${
                  selectedSize === s
                    ? 'bg-black text-white border-black'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-black font-sans">
              €{product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                €{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              isOutOfStock
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-neutral-900 text-white hover:bg-black hover:scale-105 cursor-pointer'
            }`}
          >
            {isOutOfStock ? (
              <span>Esgotado</span>
            ) : addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Adicionado!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Comprar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
