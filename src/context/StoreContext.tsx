import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, GuaranteeBadge, Order, Product, ProductColor, StoreSettings } from '../types/store';
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
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
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
      return saved ? { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_STORE_SETTINGS;
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
