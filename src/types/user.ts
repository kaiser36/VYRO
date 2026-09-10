export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface RedeemedVoucher {
  id: string;
  rewardId: string;
  title: string;
  code: string;
  discountType: 'amount' | 'percent' | 'free_shipping' | 'free_product';
  discountValue: number;
  redeemedAt: string;
  isUsed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  nif?: string;
  address?: Address;
  favoriteProductIds: string[];
  points: number;
  tier: 'Standard' | 'Silver Athlete' | 'Pro Kinetic';
  preferredSize?: string;
  completedGoalIds?: string[];
  redeemedVouchers?: RedeemedVoucher[];
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  preferredSize?: string;
}
