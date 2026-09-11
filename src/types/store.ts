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

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  enabled: boolean;
  discountType?: 'amount' | 'percent' | 'free_shipping' | 'free_product';
  discountValue?: number;
  couponCode?: string;
  minOrderValue?: number;
  tierRequired?: 'All' | 'Silver Athlete' | 'Pro Kinetic';
}

export interface LoyaltyGoal {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  type: 'first_order' | 'min_spend' | 'order_count' | 'complete_profile' | 'favorites_count' | 'newsletter' | 'custom';
  targetValue?: number;
  enabled: boolean;
  icon?: 'shopping-bag' | 'user-check' | 'heart' | 'mail' | 'award' | 'zap' | 'sparkles';
}

export interface LoyaltySettings {
  pointsPerEuro: number;
  welcomeBonus: number;
  silverTierThreshold: number;
  proTierThreshold: number;
  rewards: LoyaltyReward[];
  goals: LoyaltyGoal[];
}

export interface CategoryBannerSettings {
  enabled: boolean;
  categoryId: string;
  title: string;
  subtitle: string;
  badge?: string;
  buttonText: string;
  imageUrl: string;
}

export interface AutomaticCouponSettings {
  welcomeCouponEnabled: boolean;
  welcomeCouponCode?: string;
  firstOrderCouponEnabled: boolean;
  firstOrderCouponCode?: string;
}

export interface BrevoSettings {
  apiKey: string;
  senderEmail: string;
  senderName: string;
  enabled: boolean;
}

export interface EasypaySettings {
  accountId: string;
  apiKey: string;
  environment: 'test' | 'prod';
  enabled: boolean;
  methods: {
    mbway: boolean;
    multibanco: boolean;
    card: boolean;
  };
  autoCapture?: boolean;
}

export interface StoreSettings {
  freeShippingThreshold: number;
  shippingCost: number;
  shippingEstimate: string;
  availableBadges: string[];
  availableSizes: string[];
  availableColors: ProductColor[];
  guaranteeBadges: GuaranteeBadge[];
  loyaltySettings: LoyaltySettings;
  categoryBanner?: CategoryBannerSettings;
  automaticCoupons?: AutomaticCouponSettings;
  brevoSettings?: BrevoSettings;
  easypaySettings?: EasypaySettings;
}

export interface OrderItem {
  productId?: string;
  productName: string;
  size: string;
  colorName: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | 'Pendente'
  | 'Pago'
  | 'Em Preparação'
  | 'Enviado - aguarda tracking'
  | 'Enviado - com tracking'
  | 'Concluído'
  | 'Cancelado';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerCity: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'mbway' | 'multibanco' | 'card';
  status: OrderStatus;
  trackingNumber?: string;
  trackingCarrier?: string;
  trackingUrl?: string;
  easypayPaymentId?: string;
  easypayStatus?: 'pending' | 'authorized' | 'paid' | 'failed';
  mbwayPhone?: string;
  multibancoEntity?: string;
  multibancoReference?: string;
  multibancoExpiration?: string;
  paymentUrl?: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  size?: string;
  color?: string;
  verifiedAthlete?: boolean;
  createdAt: string;
  likes?: number;
  status?: 'pending' | 'approved' | 'rejected';
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
  stock?: number;
  isFeatured?: boolean;
  createdAt: string;
  reviews?: ProductReview[];
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
