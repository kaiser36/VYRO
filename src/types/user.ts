export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
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
