import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  GuaranteeBadge,
  Order,
  Product,
  ProductColor,
  StoreSettings,
  LoyaltyReward,
  LoyaltyGoal,
  LoyaltySettings,
} from '../types/store';
import { INITIAL_CATEGORIES, INITIAL_ORDERS, INITIAL_PRODUCTS } from '../data/initialData';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  freeShippingThreshold: 40.0,
  shippingCost: 3.90,
  shippingEstimate: 'Envio Expresso 24/48h',
  availableBadges: [
    'BESTSELLER',
    'NOVO',
    'AERO TECH',
    'ED. LIMITADA',
    'RECOVERY PRO',
    'PROMOÇÃO',
    'POPULAR',
    'PACK ESSENCIAL',
  ],
  availableSizes: ['35-38', '39-42', '43-46', '47-50'],
  availableColors: [
    { name: 'Cyan Kinetic (Assinatura)', hex: '#00f2fe' },
    { name: 'Deep Electric Blue', hex: '#0077b6' },
    { name: 'Onyx Black', hex: '#111827' },
    { name: 'Pure White', hex: '#ffffff' },
    { name: 'Mountain Slate', hex: '#334155' },
    { name: 'Heather Grey', hex: '#71717a' },
  ],
  guaranteeBadges: [
    {
      id: 'gb-shipping',
      title: 'Envio Expresso 24/48h',
      subtitle: 'Grátis acima de €40',
      icon: 'truck',
      enabled: true,
    },
    {
      id: 'gb-zeroblister',
      title: 'Garantia Zero Bolhas',
      subtitle: '100% Satisfação biomecânica',
      icon: 'shield',
      enabled: true,
    },
    {
      id: 'gb-returns',
      title: 'Devoluções Simples',
      subtitle: '30 dias sem custos',
      icon: 'refresh',
      enabled: true,
    },
  ],
  loyaltySettings: {
    pointsPerEuro: 10,
    welcomeBonus: 100,
    silverTierThreshold: 400,
    proTierThreshold: 1000,
    rewards: [
      {
        id: 'rew-free-shipping',
        title: 'Envio Grátis Imediato',
        pointsCost: 250,
        description: 'Portes grátis em qualquer encomenda, sem valor mínimo.',
        enabled: true,
        discountType: 'free_shipping',
        discountValue: 0,
        couponCode: 'ENVIOZERO',
        minOrderValue: 0,
        tierRequired: 'All',
      },
      {
        id: 'rew-5eur-voucher',
        title: 'Vale de 5€ Desconto',
        pointsCost: 500,
        description: 'Desconto direto no carrinho em qualquer modelo de meias.',
        enabled: true,
        discountType: 'amount',
        discountValue: 5,
        couponCode: 'VYRO5OFF',
        minOrderValue: 20,
        tierRequired: 'All',
      },
      {
        id: 'rew-10eur-silver',
        title: 'Voucher 10€ Silver Athlete',
        pointsCost: 800,
        description: '10€ de desconto imediato em compras superiores a 35€.',
        enabled: true,
        discountType: 'amount',
        discountValue: 10,
        couponCode: 'SILVER10',
        minOrderValue: 35,
        tierRequired: 'Silver Athlete',
      },
      {
        id: 'rew-pro-20percent',
        title: 'Desconto 20% Pro Kinetic',
        pointsCost: 1200,
        description: 'Desconto exclusivo de 20% em todo o carrinho para atletas Pro.',
        enabled: true,
        discountType: 'percent',
        discountValue: 20,
        couponCode: 'PRO20KINETIC',
        minOrderValue: 40,
        tierRequired: 'Pro Kinetic',
      },
      {
        id: 'rew-free-socks',
        title: 'Par de Meias Grátis',
        pointsCost: 1500,
        description: 'Um par de meias VYRO da tua escolha incluído na encomenda.',
        enabled: true,
        discountType: 'free_product',
        discountValue: 19.90,
        couponCode: 'MEIAGRATIS',
        minOrderValue: 25,
        tierRequired: 'All',
      },
    ],
    goals: [
      {
        id: 'goal-first-order',
        title: 'Primeira Corrida / Encomenda',
        description: 'Realiza a tua 1ª encomenda de meias VYRO na loja online.',
        pointsReward: 150,
        type: 'first_order',
        targetValue: 1,
        enabled: true,
        icon: 'shopping-bag',
      },
      {
        id: 'goal-complete-profile',
        title: 'Perfil de Atleta Completo',
        description: 'Configura o teu tamanho de meias habitual e morada de entrega.',
        pointsReward: 50,
        type: 'complete_profile',
        enabled: true,
        icon: 'user-check',
      },
      {
        id: 'goal-favorites-3',
        title: 'Atleta Inspirado',
        description: 'Guarda pelo menos 3 modelos na tua lista de favoritos.',
        pointsReward: 30,
        type: 'favorites_count',
        targetValue: 3,
        enabled: true,
        icon: 'heart',
      },
      {
        id: 'goal-big-order',
        title: 'Treino de Longa Distância (>50€)',
        description: 'Faz uma encomenda de valor igual ou superior a 50€.',
        pointsReward: 200,
        type: 'min_spend',
        targetValue: 50,
        enabled: true,
        icon: 'zap',
      },
      {
        id: 'goal-newsletter',
        title: 'Comunidade & Clube VYRO',
        description: 'Subscreve as novidades técnicas da comunidade VYRO.',
        pointsReward: 40,
        type: 'newsletter',
        enabled: true,
        icon: 'mail',
      },
      {
        id: 'goal-triathlon-pack',
        title: 'Pack Triatleta (3 Encomendas)',
        description: 'Atinge um total de 3 encomendas completadas na loja.',
        pointsReward: 300,
        type: 'order_count',
        targetValue: 3,
        enabled: true,
        icon: 'award',
      },
    ],
  },
};

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  storeSettings: StoreSettings;
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  toggleFeaturedProduct: (id: string) => void;
  deleteProduct: (id: string) => void;
  addCategory: (categoryData: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, categoryData: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;
  updateGuaranteeBadge: (id: string, badgeData: Partial<GuaranteeBadge>) => void;
  addGuaranteeBadge: (badgeData: Omit<GuaranteeBadge, 'id'>) => void;
  deleteGuaranteeBadge: (id: string) => void;
  addStoreBadge: (badge: string) => void;
  deleteStoreBadge: (badge: string) => void;
  addStoreSize: (size: string) => void;
  deleteStoreSize: (size: string) => void;
  addStoreColor: (color: ProductColor) => void;
  deleteStoreColor: (colorName: string) => void;
  updateLoyaltySettings: (newSettings: Partial<LoyaltySettings>) => void;
  addLoyaltyReward: (rewardData: Omit<LoyaltyReward, 'id'>) => void;
  updateLoyaltyReward: (id: string, rewardData: Partial<LoyaltyReward>) => void;
  deleteLoyaltyReward: (id: string) => void;
  addLoyaltyGoal: (goalData: Omit<LoyaltyGoal, 'id'>) => void;
  updateLoyaltyGoal: (id: string, goalData: Partial<LoyaltyGoal>) => void;
  deleteLoyaltyGoal: (id: string) => void;
  resetStoreData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'vyro_store_products_v1',
  CATEGORIES: 'vyro_store_categories_v1',
  ORDERS: 'vyro_store_orders_v1',
  SETTINGS: 'vyro_store_settings_v1',
  ADMIN_AUTH: 'vyro_admin_auth_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const hasFeatured = parsed.some((p) => p.isFeatured === true);
        if (!hasFeatured && parsed.length > 0) {
          return parsed.map((p, idx) => ({
            ...p,
            isFeatured: idx < 3,
          }));
        }
        return parsed;
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STORE_SETTINGS,
          ...parsed,
          loyaltySettings: {
            ...DEFAULT_STORE_SETTINGS.loyaltySettings,
            ...(parsed.loyaltySettings || {}),
            rewards:
              parsed.loyaltySettings?.rewards && parsed.loyaltySettings.rewards.length > 0
                ? parsed.loyaltySettings.rewards
                : DEFAULT_STORE_SETTINGS.loyaltySettings.rewards,
            goals:
              parsed.loyaltySettings?.goals && parsed.loyaltySettings.goals.length > 0
                ? parsed.loyaltySettings.goals
                : DEFAULT_STORE_SETTINGS.loyaltySettings.goals,
          },
        };
      }
      return DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, String(isAdmin));
  }, [isAdmin]);

  const loginAdmin = (password: string): boolean => {
    if (password === 'admin' || password === 'admin123' || password === 'vyro2026') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: 'vyro-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 1,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...productData } : prod))
    );
  };

  const toggleFeaturedProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, isFeatured: !prod.isFeatured } : prod))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>): Category => {
    const newCat: Category = {
      ...categoryData,
      id: 'cat-' + Date.now().toString(36),
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...categoryData } : cat))
    );
    if (categoryData.name) {
      setProducts((prev) =>
        prev.map((prod) =>
          prod.categoryId === id ? { ...prod, categoryName: categoryData.name! } : prod
        )
      );
    }
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: 'VYRO-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const updateGuaranteeBadge = (id: string, badgeData: Partial<GuaranteeBadge>) => {
    setStoreSettings((prev) => ({
      ...prev,
      guaranteeBadges: prev.guaranteeBadges.map((gb) =>
        gb.id === id ? { ...gb, ...badgeData } : gb
      ),
    }));
  };

  const addGuaranteeBadge = (badgeData: Omit<GuaranteeBadge, 'id'>) => {
    const newBadge: GuaranteeBadge = {
      ...badgeData,
      id: 'gb-' + Date.now().toString(36),
    };
    setStoreSettings((prev) => ({
      ...prev,
      guaranteeBadges: [...prev.guaranteeBadges, newBadge],
    }));
  };

  const deleteGuaranteeBadge = (id: string) => {
    setStoreSettings((prev) => ({
      ...prev,
      guaranteeBadges: prev.guaranteeBadges.filter((gb) => gb.id !== id),
    }));
  };

  const addStoreBadge = (badge: string) => {
    const clean = badge.trim().toUpperCase();
    if (!clean) return;
    setStoreSettings((prev) => ({
      ...prev,
      availableBadges: prev.availableBadges.includes(clean)
        ? prev.availableBadges
        : [...prev.availableBadges, clean],
    }));
  };

  const deleteStoreBadge = (badge: string) => {
    setStoreSettings((prev) => ({
      ...prev,
      availableBadges: prev.availableBadges.filter((b) => b !== badge),
    }));
  };

  const addStoreSize = (size: string) => {
    const clean = size.trim();
    if (!clean) return;
    setStoreSettings((prev) => ({
      ...prev,
      availableSizes: prev.availableSizes.includes(clean)
        ? prev.availableSizes
        : [...prev.availableSizes, clean],
    }));
  };

  const deleteStoreSize = (size: string) => {
    setStoreSettings((prev) => ({
      ...prev,
      availableSizes: prev.availableSizes.filter((s) => s !== size),
    }));
  };

  const addStoreColor = (color: ProductColor) => {
    if (!color.name.trim() || !color.hex.trim()) return;
    setStoreSettings((prev) => ({
      ...prev,
      availableColors: [
        ...prev.availableColors.filter((c) => c.name.toLowerCase() !== color.name.toLowerCase()),
        color,
      ],
    }));
  };

  const deleteStoreColor = (colorName: string) => {
    setStoreSettings((prev) => ({
      ...prev,
      availableColors: prev.availableColors.filter((c) => c.name !== colorName),
    }));
  };

  const updateLoyaltySettings = (newSettings: Partial<LoyaltySettings>) => {
    setStoreSettings((prev) => ({
      ...prev,
      loyaltySettings: {
        ...prev.loyaltySettings,
        ...newSettings,
      },
    }));
  };

  const addLoyaltyReward = (rewardData: Omit<LoyaltyReward, 'id'>) => {
    const newRew: LoyaltyReward = {
      ...rewardData,
      id: 'rew-' + Date.now().toString(36),
    };
    setStoreSettings((prev) => ({
      ...prev,
      loyaltySettings: {
        ...prev.loyaltySettings,
        rewards: [...(prev.loyaltySettings?.rewards || []), newRew],
      },
    }));
  };

  const updateLoyaltyReward = (id: string, rewardData: Partial<LoyaltyReward>) => {
    setStoreSettings((prev) => ({
      ...prev,
      loyaltySettings: {
        ...prev.loyaltySettings,
        rewards: (prev.loyaltySettings?.rewards || []).map((r) =>
          r.id === id ? { ...r, ...rewardData } : r
        ),
      },
    }));
  };

  const deleteLoyaltyReward = (id: string) => {
    setStoreSettings((prev) => ({
      ...prev,
      loyaltySettings: {
        ...prev.loyaltySettings,
        rewards: (prev.loyaltySettings?.rewards || []).filter((r) => r.id !== id),
      },
    }));
  };

  const addLoyaltyGoal = (goalData: Omit<LoyaltyGoal, 'id'>) => {
    const newGoal: LoyaltyGoal = {
      ...goalData,
      id: 'goal-' + Date.now().toString(36),
    };
    setStoreSettings((prev) => ({
      ...prev,
      loyaltySettings: {
        ...prev.loyaltySettings,
        goals: [...(prev.loyaltySettings?.goals || []), newGoal],
      },
    }));
  };

  const updateLoyaltyGoal = (id: string, goalData: Partial<LoyaltyGoal>) => {
    setStoreSettings((prev) => ({
      ...prev,
      loyaltySettings: {
        ...prev.loyaltySettings,
        goals: (prev.loyaltySettings?.goals || []).map((g) =>
          g.id === id ? { ...g, ...goalData } : g
        ),
      },
    }));
  };

  const deleteLoyaltyGoal = (id: string) => {
    setStoreSettings((prev) => ({
      ...prev,
      loyaltySettings: {
        ...prev.loyaltySettings,
        goals: (prev.loyaltySettings?.goals || []).filter((g) => g.id !== id),
      },
    }));
  };

  const resetStoreData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setStoreSettings(DEFAULT_STORE_SETTINGS);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        storeSettings,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        toggleFeaturedProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addOrder,
        updateStoreSettings,
        updateGuaranteeBadge,
        addGuaranteeBadge,
        deleteGuaranteeBadge,
        addStoreBadge,
        deleteStoreBadge,
        addStoreSize,
        deleteStoreSize,
        addStoreColor,
        deleteStoreColor,
        updateLoyaltySettings,
        addLoyaltyReward,
        updateLoyaltyReward,
        deleteLoyaltyReward,
        addLoyaltyGoal,
        updateLoyaltyGoal,
        deleteLoyaltyGoal,
        resetStoreData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
