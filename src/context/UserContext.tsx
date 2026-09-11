import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RegisterData, RedeemedVoucher } from '../types/user';
import { LoyaltyReward } from '../types/store';

interface UserContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  favoritesCount: number;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  updateProfile: (data: Partial<User>) => void;
  addPoints: (pointsToAdd: number) => void;
  claimGoal: (goalId: string, pointsReward: number) => { success: boolean; message: string };
  redeemReward: (reward: LoyaltyReward) => { success: boolean; voucher?: RedeemedVoucher; error?: string };
  useVoucher: (voucherCode: string) => void;
  loginAsDemo: () => void;
  users: User[];
  updateUserPoints: (userId: string, newPoints: number) => void;
  assignCouponToUser: (
    userId: string,
    voucher: {
      code: string;
      title: string;
      discountType: 'amount' | 'percent' | 'free_shipping' | 'free_product';
      discountValue: number;
    }
  ) => void;
}

const STORAGE_KEYS = {
  USERS: 'vyro_users_data_v1',
  CURRENT_USER_ID: 'vyro_active_user_id_v1',
};

const INITIAL_DEMO_USERS: User[] = [
  {
    id: 'user-demo-1',
    name: 'Tiago Pereira',
    email: 'tiago@vyro.pt',
    phone: '912 345 678',
    nif: '254896321',
    address: {
      street: 'Avenida da Liberdade 120, 3º Dto',
      city: 'Lisboa',
      postalCode: '1250-142',
      country: 'Portugal',
    },
    favoriteProductIds: ['vyro-ultralight-crew', 'vyro-trail-cushion-pro'],
    points: 420,
    tier: 'Silver Athlete',
    preferredSize: '39-42',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_USERS;
    } catch {
      return INITIAL_DEMO_USERS;
    }
  });

  const [activeUserId, setActiveUserId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || null;
    } catch {
      return null;
    }
  });

  const currentUser = users.find((u) => u.id === activeUserId) || null;
  const isAuthenticated = !!currentUser;
  const favoritesCount = currentUser ? currentUser.favoriteProductIds.length : 0;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (activeUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, activeUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [activeUserId]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    
    // In demo / client-side storage, check against registered users
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!existing) {
      // Auto-create or reject? Let's check password or allow clean login
      if (cleanEmail === 'tiago@vyro.pt' || password.length >= 4) {
        // If it's a new email and password valid, register automatically or ask to register
        return { success: false, error: 'Utilizador não encontrado. Por favor cria uma nova conta.' };
      }
      return { success: false, error: 'Credenciais inválidas.' };
    }

    if (password.length < 3) {
      return { success: false, error: 'Palavra-passe muito curta (mínimo 4 caracteres).' };
    }

    setActiveUserId(existing.id);
    return { success: true };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail || !data.name.trim()) {
      return { success: false, error: 'Nome e email são obrigatórios.' };
    }

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Já existe uma conta associada a este email.' };
    }

    if (data.password.length < 4) {
      return { success: false, error: 'A palavra-passe deve ter pelo menos 4 caracteres.' };
    }

    let welcomeVouchers: RedeemedVoucher[] = [];
    try {
      const savedStore = localStorage.getItem('vyro_store_settings_v1');
      if (savedStore) {
        const parsedStore = JSON.parse(savedStore);
        const auto = parsedStore.automaticCoupons;
        if (auto?.welcomeCouponEnabled && auto?.welcomeCouponCode) {
          const matched = (parsedStore.loyaltySettings?.rewards || []).find(
            (r: any) => r.couponCode?.toUpperCase() === auto.welcomeCouponCode.toUpperCase()
          );
          welcomeVouchers.push({
            id: 'vch-welcome-' + Date.now().toString(36),
            rewardId: matched?.id || 'auto-welcome',
            title: matched?.title || 'Cupão de Boas-Vindas',
            code: auto.welcomeCouponCode.toUpperCase(),
            discountType: matched?.discountType || 'percent',
            discountValue: matched?.discountValue ?? 10,
            redeemedAt: new Date().toISOString(),
            isUsed: false,
          });
        }
      }
    } catch {
      // ignore
    }

    const newUser: User = {
      id: 'usr-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone?.trim() || '',
      favoriteProductIds: [],
      points: 100, // Welcome bonus of 100 points!
      tier: 'Standard',
      preferredSize: data.preferredSize || '39-42',
      createdAt: new Date().toISOString(),
      redeemedVouchers: welcomeVouchers,
    };

    setUsers((prev) => [...prev, newUser]);
    setActiveUserId(newUser.id);
    return { success: true };
  };

  const assignCouponToUser = (
    userId: string,
    voucher: {
      code: string;
      title: string;
      discountType: 'amount' | 'percent' | 'free_shipping' | 'free_product';
      discountValue: number;
    }
  ) => {
    const newVoucher: RedeemedVoucher = {
      id: 'vch-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      rewardId: 'admin-assigned',
      title: voucher.title,
      code: voucher.code.toUpperCase(),
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      redeemedAt: new Date().toISOString(),
      isUsed: false,
    };

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const exists = (u.redeemedVouchers || []).some(
          (v) => v.code === newVoucher.code && !v.isUsed
        );
        if (exists) return u;
        return {
          ...u,
          redeemedVouchers: [newVoucher, ...(u.redeemedVouchers || [])],
        };
      })
    );
  };

  const logout = () => {
    setActiveUserId(null);
  };

  const toggleFavorite = (productId: string) => {
    if (!currentUser) return;

    const isFav = currentUser.favoriteProductIds.includes(productId);
    const updatedIds = isFav
      ? currentUser.favoriteProductIds.filter((id) => id !== productId)
      : [...currentUser.favoriteProductIds, productId];

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, favoriteProductIds: updatedIds } : u))
    );
  };

  const isFavorite = (productId: string): boolean => {
    if (!currentUser) return false;
    return currentUser.favoriteProductIds.includes(productId);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u))
    );
  };

  const addPoints = (pointsToAdd: number) => {
    if (!currentUser) return;
    const newTotal = (currentUser.points || 0) + pointsToAdd;
    let newTier: User['tier'] = currentUser.tier;

    if (newTotal >= 1000) {
      newTier = 'Pro Kinetic';
    } else if (newTotal >= 400) {
      newTier = 'Silver Athlete';
    } else {
      newTier = 'Standard';
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, points: newTotal, tier: newTier } : u
      )
    );
  };

  const updateUserPoints = (userId: string, newPoints: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const validPoints = Math.max(0, newPoints);
        let newTier: User['tier'] = u.tier;
        if (validPoints >= 1000) {
          newTier = 'Pro Kinetic';
        } else if (validPoints >= 400) {
          newTier = 'Silver Athlete';
        } else {
          newTier = 'Standard';
        }
        return {
          ...u,
          points: validPoints,
          tier: newTier,
        };
      })
    );
  };

  const claimGoal = (goalId: string, pointsReward: number): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Inicia sessão para reivindicar os teus pontos.' };
    const completed = currentUser.completedGoalIds || [];
    if (completed.includes(goalId)) {
      return { success: false, message: 'Esta meta já foi alcançada e recompensada.' };
    }

    const newCompleted = [...completed, goalId];
    const newTotal = (currentUser.points || 0) + pointsReward;
    let newTier: User['tier'] = currentUser.tier;
    if (newTotal >= 1000) newTier = 'Pro Kinetic';
    else if (newTotal >= 400) newTier = 'Silver Athlete';
    else newTier = 'Standard';

    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, points: newTotal, tier: newTier, completedGoalIds: newCompleted }
          : u
      )
    );

    return { success: true, message: `Parabéns! +${pointsReward} Pontos creditados na tua conta!` };
  };

  const redeemReward = (
    reward: LoyaltyReward
  ): { success: boolean; voucher?: RedeemedVoucher; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'Inicia sessão para resgatar ofertas do clube.' };
    }

    const currentPts = currentUser.points || 0;
    if (currentPts < reward.pointsCost) {
      return {
        success: false,
        error: `Pontos insuficientes. Tens ${currentPts} pts e precisas de ${reward.pointsCost} pts.`,
      };
    }

    const newPts = currentPts - reward.pointsCost;
    let newTier: User['tier'] = currentUser.tier;
    if (newPts >= 1000) newTier = 'Pro Kinetic';
    else if (newPts >= 400) newTier = 'Silver Athlete';
    else newTier = 'Standard';

    const voucherCode =
      reward.couponCode || `VYRO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newVoucher: RedeemedVoucher = {
      id: 'vouch-' + Date.now().toString(36),
      rewardId: reward.id,
      title: reward.title,
      code: voucherCode,
      discountType: reward.discountType || 'amount',
      discountValue: reward.discountValue || 5,
      redeemedAt: new Date().toISOString(),
      isUsed: false,
    };

    const currentVouchers = currentUser.redeemedVouchers || [];

    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              points: newPts,
              tier: newTier,
              redeemedVouchers: [newVoucher, ...currentVouchers],
            }
          : u
      )
    );

    return { success: true, voucher: newVoucher };
  };

  const useVoucher = (voucherCode: string) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        const vouchers = (u.redeemedVouchers || []).map((v) =>
          v.code.toUpperCase() === voucherCode.toUpperCase() ? { ...v, isUsed: true } : v
        );
        return { ...u, redeemedVouchers: vouchers };
      })
    );
  };

  const loginAsDemo = () => {
    const demo = users.find((u) => u.email === 'tiago@vyro.pt') || INITIAL_DEMO_USERS[0];
    setActiveUserId(demo.id);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        favoritesCount,
        login,
        register,
        logout,
        toggleFavorite,
        isFavorite,
        updateProfile,
        addPoints,
        claimGoal,
        redeemReward,
        useVoucher,
        loginAsDemo,
        users,
        updateUserPoints,
        assignCouponToUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
