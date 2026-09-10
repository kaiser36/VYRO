export interface ProductColor {
  name: string;
  hex: string;
}

export interface GuaranteeBadge {
  id: string;
  title: string;
  subtitle: string;
  icon: 'truck' | 'shield' | 'refresh' | 'check' | 'zap' | 'sparkles';
  enabled: boolean;
}

export interface StoreSettings {
  freeShippingThreshold: number;
  shippingCost: number;
  shippingEstimate: string;
  availableBadges: string[];
  availableSizes: string[];
  availableColors: ProductColor[];
  guaranteeBadges: GuaranteeBadge[];
}

export interface OrderItem {
  productName: string;
  size: string;
  colorName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerCity: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'mbway' | 'multibanco' | 'card';
  status: 'Pago' | 'Em Preparação' | 'Enviado';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  categoryName: string;
  description: string;
  features: string[];
  materials: string;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  badge?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  count?: number;
}

export interface CartItem {
  id: string; // unique key combining product.id + size + color
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}
