import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  FolderPlus,
  Package,
  Layers,
  LogOut,
  CheckCircle,
  Lock,
  KeyRound,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Pencil,
  Check,
  X,
  Sliders,
  Palette,
  Truck,
  Shield,
  Tag,
  Zap,
  TrendingUp,
  DollarSign,
  CreditCard,
  ShoppingBag,
  BarChart3,
  MapPin,
  Calendar,
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Gift,
  Award,
  Users,
  Target,
  Coins,
  Ticket,
  Trophy,
  Heart,
  Mail,
  UserCheck,
  Star,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  CheckCheck,
  Send,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useUser } from '../context/UserContext';
import { GuaranteeBadge, ProductColor, LoyaltyGoal, LoyaltyReward, Product } from '../types/store';

interface AdminPortalPageProps {
  onBackToStore: () => void;
}

const PRESET_SOCKS_IMAGES = [
  'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1576672843344-f01907a9d40c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
];

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ onBackToStore }) => {
  const {
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
    updateStoreSettings,
    updateCategoryBanner,
    updateAutomaticCoupons,
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
  } = useStore();

  const { users, updateUserPoints, assignCouponToUser } = useUser();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isAdmin]);

  // Login form state
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Dashboard active tab (Adicionar Nova Meia tab removed, starts on list-products)
  const [activeTab, setActiveTab] = useState<
    'list-products' | 'categories' | 'settings' | 'loyalty' | 'stats'
  >('list-products');
  const [notification, setNotification] = useState<string | null>(null);

  // Catalog View Mode ('list' | 'create' | 'edit')
  const [catalogMode, setCatalogMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Unified Product Form State (for both create and edit)
  const [prodName, setProdName] = useState('');
  const [prodTagline, setProdTagline] = useState('');
  const [prodCategory, setProdCategory] = useState(categories[0]?.id || '');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodStock, setProdStock] = useState('50');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodDescription, setProdDescription] = useState('');
  const [prodFeatures, setProdFeatures] = useState('Costura plana Seamless\nMalha de fluxo de ar 3D\nCompressão plantar 360°');
  const [prodMaterials, setProdMaterials] = useState('70% Poliamida Q-Skin, 20% CoolMax, 10% Elastano');
  const [prodBadge, setProdBadge] = useState('NOVO');
  const [prodSizes, setProdSizes] = useState<string[]>(['35-38', '39-42', '43-46']);
  const [prodColors, setProdColors] = useState<ProductColor[]>([]);
  const [prodImages, setProdImages] = useState<string[]>([PRESET_SOCKS_IMAGES[0]]);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [prodIsFeatured, setProdIsFeatured] = useState(false);

  // Initialize selected product colors from available colors
  useEffect(() => {
    if (prodColors.length === 0 && storeSettings.availableColors.length > 0) {
      setProdColors(storeSettings.availableColors.slice(0, 3));
    }
  }, [storeSettings.availableColors]);

  const handleAddImageUrl = () => {
    const trimmed = newImageUrlInput.trim();
    if (!trimmed) return;
    setProdImages((prev) => [...prev, trimmed]);
    setNewImageUrlInput('');
  };

  const handleFileUploadMultiple = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const resultStr = reader.result;
          setProdImages((prev) => [...prev, resultStr]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setProdImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSetCoverImage = (index: number) => {
    setProdImages((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, idx) => idx !== index);
      return [selected, ...rest];
    });
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    setProdImages((prev) => {
      const newImages = [...prev];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newImages.length) return prev;
      const temp = newImages[index];
      newImages[index] = newImages[targetIndex];
      newImages[targetIndex] = temp;
      return newImages;
    });
  };

  const handleAddPresetImage = (url: string) => {
    setProdImages((prev) => [...prev, url]);
  };

  const handleStartCreateProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdTagline('');
    setProdCategory(categories[0]?.id || '');
    setProdPrice('');
    setProdOriginalPrice('');
    setProdStock('50');
    setProdInStock(true);
    setProdDescription('Meia técnica desenhada para máxima respirabilidade e apoio plantar nas condições mais exigentes.');
    setProdFeatures('Costura plana Seamless\nMalha de fluxo de ar 3D\nCompressão plantar 360°');
    setProdMaterials('70% Poliamida Q-Skin, 20% CoolMax, 10% Elastano');
    setProdBadge('NOVO');
    setProdSizes(storeSettings.availableSizes.slice(0, 3));
    setProdColors(storeSettings.availableColors.slice(0, 3));
    setProdImages([PRESET_SOCKS_IMAGES[0]]);
    setNewImageUrlInput('');
    setProdIsFeatured(false);
    setCatalogMode('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdTagline(p.tagline || '');
    setProdCategory(p.categoryId);
    setProdPrice(p.price.toString());
    setProdOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    const currentStock = p.stock !== undefined ? p.stock : (p.inStock ? 30 : 0);
    setProdStock(currentStock.toString());
    setProdInStock(p.inStock && currentStock > 0);
    setProdDescription(p.description || '');
    setProdFeatures((p.features || []).join('\n'));
    setProdMaterials(p.materials || '');
    setProdBadge(p.badge || '');
    setProdSizes(p.sizes || ['39-42']);
    setProdColors(p.colors || []);
    setProdImages(p.images && p.images.length > 0 ? [...p.images] : [PRESET_SOCKS_IMAGES[0]]);
    setNewImageUrlInput('');
    setProdIsFeatured(!!p.isFeatured);
    setCatalogMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelProductForm = () => {
    setCatalogMode('list');
    setEditingProduct(null);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice) return;

    const selectedCatObj = categories.find((c) => c.id === prodCategory) || categories[0];
    const stockQty = Math.max(0, parseInt(prodStock || '0', 10));
    const isInStock = stockQty > 0 && prodInStock;
    const validImages = prodImages.filter((img) => img.trim().length > 0);
    const finalImages = validImages.length > 0 ? validImages : [PRESET_SOCKS_IMAGES[0]];

    if (catalogMode === 'edit' && editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName.trim(),
        tagline: prodTagline.trim() || 'Alta performance e conforto biomecânico',
        price: parseFloat(prodPrice),
        originalPrice: prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined,
        stock: stockQty,
        inStock: isInStock,
        categoryId: selectedCatObj.id,
        categoryName: selectedCatObj.name,
        description: prodDescription.trim(),
        features: prodFeatures.split('\n').filter((f) => f.trim().length > 0),
        materials: prodMaterials.trim() || undefined,
        sizes: prodSizes.length > 0 ? prodSizes : ['39-42'],
        colors: prodColors.length > 0 ? prodColors : storeSettings.availableColors.slice(0, 3),
        images: finalImages,
        badge: prodBadge.trim() || undefined,
        isFeatured: prodIsFeatured,
      });
      showNotification(`Meia "${prodName}" atualizada com sucesso!`);
    } else {
      addProduct({
        name: prodName.trim(),
        tagline: prodTagline.trim() || 'Alta performance e conforto biomecânico',
        price: parseFloat(prodPrice),
        originalPrice: prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined,
        stock: stockQty,
        inStock: isInStock,
        categoryId: selectedCatObj.id,
        categoryName: selectedCatObj.name,
        description: prodDescription.trim() || 'Meia técnica desenhada para máxima respirabilidade e apoio plantar nas condições mais exigentes.',
        features: prodFeatures.split('\n').filter((f) => f.trim().length > 0),
        materials: prodMaterials,
        sizes: prodSizes.length > 0 ? prodSizes : ['39-42'],
        colors: prodColors.length > 0 ? prodColors : storeSettings.availableColors.slice(0, 3),
        images: finalImages,
        badge: prodBadge || undefined,
        isFeatured: prodIsFeatured,
      });
      showNotification(`Meia "${prodName}" adicionada com sucesso ao catálogo!`);
    }

    setCatalogMode('list');
    setEditingProduct(null);
  };

  // Category Form & Edit State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');

  // Categories Sub-Tab State ('banner' | 'manage')
  const [categoriesSubTab, setCategoriesSubTab] = useState<'banner' | 'manage'>('banner');

  // Category Banner Form State
  const [bannerEnabled, setBannerEnabled] = useState(storeSettings.categoryBanner?.enabled ?? true);
  const [bannerCategoryId, setBannerCategoryId] = useState(storeSettings.categoryBanner?.categoryId || categories[0]?.id || '');
  const [bannerTitle, setBannerTitle] = useState(storeSettings.categoryBanner?.title || '');
  const [bannerSubtitle, setBannerSubtitle] = useState(storeSettings.categoryBanner?.subtitle || '');
  const [bannerBadge, setBannerBadge] = useState(storeSettings.categoryBanner?.badge || 'Linha em Destaque');
  const [bannerButtonText, setBannerButtonText] = useState(storeSettings.categoryBanner?.buttonText || 'Explorar Coleção');
  const [bannerImageUrl, setBannerImageUrl] = useState(
    storeSettings.categoryBanner?.imageUrl ||
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=1200&auto=format&fit=crop&q=80'
  );

  useEffect(() => {
    if (storeSettings.categoryBanner) {
      setBannerEnabled(storeSettings.categoryBanner.enabled);
      setBannerCategoryId(storeSettings.categoryBanner.categoryId || categories[0]?.id || '');
      setBannerTitle(storeSettings.categoryBanner.title || '');
      setBannerSubtitle(storeSettings.categoryBanner.subtitle || '');
      setBannerBadge(storeSettings.categoryBanner.badge || 'Linha em Destaque');
      setBannerButtonText(storeSettings.categoryBanner.buttonText || 'Explorar Coleção');
      setBannerImageUrl(
        storeSettings.categoryBanner.imageUrl ||
          'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=1200&auto=format&fit=crop&q=80'
      );
    }
  }, [storeSettings.categoryBanner]);

  // Store Settings Form State
  const [newBadgeInput, setNewBadgeInput] = useState('');
  const [newSizeInput, setNewSizeInput] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#00f2fe');

  const [shippingThresholdInput, setShippingThresholdInput] = useState(
    storeSettings.freeShippingThreshold.toString()
  );
  const [shippingCostInput, setShippingCostInput] = useState(
    storeSettings.shippingCost.toString()
  );
  const [shippingEstimateInput, setShippingEstimateInput] = useState(
    storeSettings.shippingEstimate
  );

  // New Guarantee Badge form state
  const [newGbTitle, setNewGbTitle] = useState('');
  const [newGbSubtitle, setNewGbSubtitle] = useState('');

  // Loyalty & Points Sub-navigation & Settings State
  const [loyaltySubTab, setLoyaltySubTab] = useState<'goals' | 'offers' | 'members' | 'rules'>('goals');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  const [pointsPerEuroInput, setPointsPerEuroInput] = useState(
    (storeSettings.loyaltySettings?.pointsPerEuro || 10).toString()
  );
  const [welcomeBonusInput, setWelcomeBonusInput] = useState(
    (storeSettings.loyaltySettings?.welcomeBonus || 100).toString()
  );
  const [silverTierInput, setSilverTierInput] = useState(
    (storeSettings.loyaltySettings?.silverTierThreshold || 400).toString()
  );
  const [proTierInput, setProTierInput] = useState(
    (storeSettings.loyaltySettings?.proTierThreshold || 1000).toString()
  );

  // New Goal Form State
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalPoints, setNewGoalPoints] = useState('100');
  const [newGoalType, setNewGoalType] = useState<LoyaltyGoal['type']>('first_order');
  const [newGoalTargetValue, setNewGoalTargetValue] = useState('1');
  const [newGoalIcon, setNewGoalIcon] = useState<NonNullable<LoyaltyGoal['icon']>>('shopping-bag');

  // New Reward / Offer Form State
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardPoints, setNewRewardPoints] = useState('500');
  const [newRewardDesc, setNewRewardDesc] = useState('');
  const [newRewardDiscountType, setNewRewardDiscountType] = useState<'amount' | 'percent' | 'free_shipping' | 'free_product'>('amount');
  const [newRewardDiscountValue, setNewRewardDiscountValue] = useState('5');
  const [newRewardCouponCode, setNewRewardCouponCode] = useState('VYRO10');
  const [newRewardMinOrder, setNewRewardMinOrder] = useState('0');
  const [newRewardTier, setNewRewardTier] = useState<'All' | 'Silver Athlete' | 'Pro Kinetic'>('All');
  const [copiedCouponId, setCopiedCouponId] = useState<string | null>(null);

  const handleCopyCouponCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCouponId(id);
    showNotification(`Código "${code}" copiado para a área de transferência!`);
    setTimeout(() => setCopiedCouponId(null), 2500);
  };

  const handleGenerateRandomCoupon = () => {
    const prefixes = ['VYRO', 'PRO', 'PERF', 'RUN', 'SPECIAL'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 80 + 10);
    setNewRewardCouponCode(`${prefix}${number}`);
  };

  // Coupon Sub-Tabs and Targeting State
  const [couponSubTab, setCouponSubTab] = useState<'manage' | 'auto' | 'send'>('manage');
  const [welcomeCouponEnabled, setWelcomeCouponEnabled] = useState<boolean>(
    storeSettings.automaticCoupons?.welcomeCouponEnabled ?? true
  );
  const [welcomeCouponCode, setWelcomeCouponCode] = useState<string>(
    storeSettings.automaticCoupons?.welcomeCouponCode || 'BEMVINDO10'
  );
  const [firstOrderCouponEnabled, setFirstOrderCouponEnabled] = useState<boolean>(
    storeSettings.automaticCoupons?.firstOrderCouponEnabled ?? true
  );
  const [firstOrderCouponCode, setFirstOrderCouponCode] = useState<string>(
    storeSettings.automaticCoupons?.firstOrderCouponCode || 'OBRIGADO10'
  );

  const [targetUserId, setTargetUserId] = useState<string>('');
  const [targetCouponCode, setTargetCouponCode] = useState<string>('');

  // User Points Adjustment State
  const [adjustingUserId, setAdjustingUserId] = useState<string | null>(null);
  const [manualPointsAmount, setManualPointsAmount] = useState<number>(100);
  const [pointAdjustmentReason, setPointAdjustmentReason] = useState<string>('Ajuste Administrativo');
  const [newGbIcon, setNewGbIcon] = useState<'truck' | 'shield' | 'refresh' | 'check' | 'zap' | 'sparkles'>('truck');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Catalog List Filters State
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('all');
  const [catalogStockFilter, setCatalogStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [catalogBadgeFilter, setCatalogBadgeFilter] = useState('all');
  const [catalogFeaturedFilter, setCatalogFeaturedFilter] = useState<'all' | 'featured' | 'not-featured'>('all');
  const [catalogSortBy, setCatalogSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('newest');

  // Filtered Catalog Products
  const filteredProducts = products
    .filter((p) => {
      // Search query
      if (catalogSearch.trim()) {
        const q = catalogSearch.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchTagline = p.tagline?.toLowerCase().includes(q);
        const matchBadge = p.badge ? p.badge.toLowerCase().includes(q) : false;
        const matchCat = p.categoryName.toLowerCase().includes(q);
        const matchMaterials = p.materials?.toLowerCase().includes(q);
        if (!matchName && !matchTagline && !matchBadge && !matchCat && !matchMaterials) {
          return false;
        }
      }
      // Category filter
      if (catalogCategoryFilter !== 'all' && p.categoryId !== catalogCategoryFilter) {
        return false;
      }
      // Stock filter
      if (catalogStockFilter === 'in-stock' && !p.inStock) {
        return false;
      }
      if (catalogStockFilter === 'out-of-stock' && p.inStock) {
        return false;
      }
      // Featured filter
      if (catalogFeaturedFilter === 'featured' && !p.isFeatured) {
        return false;
      }
      if (catalogFeaturedFilter === 'not-featured' && p.isFeatured) {
        return false;
      }
      // Badge filter
      if (catalogBadgeFilter !== 'all') {
        if (catalogBadgeFilter === 'has-badge') {
          if (!p.badge) return false;
        } else if (catalogBadgeFilter === 'no-badge') {
          if (p.badge) return false;
        } else if (p.badge !== catalogBadgeFilter) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (catalogSortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const hasActiveCatalogFilters =
    catalogSearch.trim() !== '' ||
    catalogCategoryFilter !== 'all' ||
    catalogStockFilter !== 'all' ||
    catalogBadgeFilter !== 'all' ||
    catalogFeaturedFilter !== 'all' ||
    catalogSortBy !== 'newest';

  const resetCatalogFilters = () => {
    setCatalogSearch('');
    setCatalogCategoryFilter('all');
    setCatalogStockFilter('all');
    setCatalogBadgeFilter('all');
    setCatalogFeaturedFilter('all');
    setCatalogSortBy('newest');
  };

  // Sales Metrics Computations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPairsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0),
    0
  );
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // Product sales aggregation
  const productSalesMap: {
    [productName: string]: { count: number; revenue: number; image?: string; category?: string };
  } = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const name = item.productName || 'Meia VYRO';
      if (!productSalesMap[name]) {
        const matchedProd = products.find(
          (p) => p.name.toLowerCase() === name.toLowerCase()
        );
        productSalesMap[name] = {
          count: 0,
          revenue: 0,
          image: matchedProd?.images?.[0] || PRESET_SOCKS_IMAGES[0],
          category: matchedProd?.categoryName || 'Performance',
        };
      }
      productSalesMap[name].count += item.quantity;
      productSalesMap[name].revenue += item.quantity * item.price;
    });
  });

  const topSellingProducts = Object.entries(productSalesMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);

  const maxProductSold = topSellingProducts.length > 0 ? topSellingProducts[0].count : 1;

  const paymentStats = {
    mbway: orders.filter((o) => o.paymentMethod === 'mbway').length,
    multibanco: orders.filter((o) => o.paymentMethod === 'multibanco').length,
    card: orders.filter((o) => o.paymentMethod === 'card').length,
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(password);
    if (ok) {
      setLoginError(false);
      setPassword('');
      showNotification('Sessão de Administrador iniciada com sucesso!');
    } else {
      setLoginError(true);
    }
  };

  const handleStartEditCategory = (cat: { id: string; name: string; slug: string; description: string }) => {
    setEditingCategoryId(cat.id);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDescription(cat.description);
    const formEl = document.getElementById('category-form');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setCatName('');
    setCatSlug('');
    setCatDescription('');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const slug = catSlug.trim() || catName.toLowerCase().replace(/\s+/g, '-');
    if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        name: catName.trim(),
        slug,
        description: catDescription.trim() || 'Meias desportivas e técnicas para alta exigência.',
      });
      showNotification(`Categoria "${catName}" atualizada com sucesso!`);
      handleCancelEditCategory();
    } else {
      addCategory({
        name: catName.trim(),
        slug,
        description: catDescription.trim() || 'Meias desportivas e técnicas para alta exigência.',
      });
      showNotification(`Categoria "${catName}" criada com sucesso!`);
      setCatName('');
      setCatSlug('');
      setCatDescription('');
    }
  };

  const BANNER_PRESET_IMAGES = [
    {
      label: 'Running / Estrada',
      url: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=1200&auto=format&fit=crop&q=80',
    },
    {
      label: 'Ciclismo Aero',
      url: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=1200&auto=format&fit=crop&q=80',
    },
    {
      label: 'Trail / Montanha',
      url: 'https://images.unsplash.com/photo-1576672843344-f01907a9d40c?w=1200&auto=format&fit=crop&q=80',
    },
    {
      label: 'Compressão / Recovery',
      url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&auto=format&fit=crop&q=80',
    },
    {
      label: 'Estúdio / Daily Active',
      url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&auto=format&fit=crop&q=80',
    },
    {
      label: 'Velocidade / Pista',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem é demasiado grande. Por favor escolha um ficheiro até 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBannerImageUrl(reader.result);
          showNotification('Imagem carregada com sucesso para o banner!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectCategoryForBanner = (catId: string) => {
    setBannerCategoryId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      setBannerTitle(cat.name + ' de Alta Performance');
      setBannerSubtitle(cat.description);
      setBannerButtonText('Ver Meias de ' + cat.name);
      setBannerBadge('Linha em Destaque');
    }
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateCategoryBanner({
      enabled: bannerEnabled,
      categoryId: bannerCategoryId,
      title: bannerTitle,
      subtitle: bannerSubtitle,
      badge: bannerBadge,
      buttonText: bannerButtonText,
      imageUrl: bannerImageUrl,
    });
    showNotification('Banner de Categoria em Destaque guardado com sucesso!');
  };

  const toggleSize = (size: string) => {
    if (prodSizes.includes(size)) {
      setProdSizes(prodSizes.filter((s) => s !== size));
    } else {
      setProdSizes([...prodSizes, size]);
    }
  };

  const toggleProductColor = (color: ProductColor) => {
    const exists = prodColors.some((c) => c.name === color.name);
    if (exists) {
      if (prodColors.length > 1) {
        setProdColors(prodColors.filter((c) => c.name !== color.name));
      }
    } else {
      setProdColors([...prodColors, color]);
    }
  };

  // IF NOT AUTHENTICATED: Full-Page Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col justify-between py-12 px-6 animate-fade-rise">
        <div className="max-w-md w-full mx-auto">
          {/* Back to store button */}
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black mb-8 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm hover:border-black transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Loja VYRO</span>
          </button>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/80 p-8 sm:p-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg mb-5">
              <Lock className="w-6 h-6" />
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-black font-normal">
              Portal Administrativo
            </h1>
            <p className="text-xs text-[#6F6F6F] mt-2 font-sans leading-relaxed">
              Autentique-se para gerir o catálogo de meias de performance, criar categorias e controlar inventário.
            </p>

            <form onSubmit={handleLoginSubmit} className="mt-8 space-y-5">
              <div>
                <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-2">
                  Palavra-passe de Acesso
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    required
                    placeholder="Insira a password..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError(false);
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs border transition-all ${
                      loginError
                        ? 'border-red-500 focus:ring-red-400 ring-2'
                        : 'border-neutral-300 focus:border-black'
                    } focus:outline-none`}
                  />
                </div>
                {loginError && (
                  <p className="text-[11px] text-red-500 mt-2 flex items-center gap-1.5 font-medium">
                    <ShieldAlert className="w-3.5 h-3.5" /> Palavra-passe incorreta. Experimente "admin" ou "vyro2026".
                  </p>
                )}
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3.5 text-xs text-cyan-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Dica de Acesso:</strong> Senha padrão disponível: <code className="bg-white px-1.5 py-0.5 rounded border border-cyan-300 font-mono text-[11px]">admin</code> ou <code className="bg-white px-1.5 py-0.5 rounded border border-cyan-300 font-mono text-[11px]">vyro2026</code>.
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-black text-white font-medium text-xs hover:bg-neutral-800 hover:scale-[1.01] active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Entrar no Sistema de Gestão
              </button>
            </form>
          </div>
        </div>

        <div className="text-center text-xs text-neutral-400 mt-8">
          VYRO® Gestão • Liberdade em Movimento
        </div>
      </div>
    );
  }

  // Helper for rendering guarantee badge icon
  const renderBadgeIcon = (icon: GuaranteeBadge['icon']) => {
    switch (icon) {
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

  const getBadgeIconColors = (icon: GuaranteeBadge['icon']) => {
    switch (icon) {
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

  // IF AUTHENTICATED: Full-Page Dedicated Admin Dashboard
  return (
    <div className="min-h-screen bg-neutral-100 text-black flex flex-col animate-fade-rise">
      {/* Top Header Bar */}
      <header className="bg-neutral-900 text-white border-b border-neutral-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-neutral-200 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar à Loja</span>
            </button>

            <div className="h-6 w-px bg-neutral-700 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-xs overflow-hidden">
                <img src="/logo.jpg" alt="VYRO" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white flex items-baseline">
                  VYRO<sup className="text-xs text-cyan-400 font-sans ml-0.5">®</sup> Gestão
                </h1>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block -mt-1">
                  Painel Central de Administração
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-3 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sessão Ativa
            </span>

            <button
              onClick={() => {
                logoutAdmin();
                onBackToStore();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Terminar Sessão</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 flex flex-col">
        {/* Tab Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-2 rounded-2xl border border-neutral-200 shadow-sm">
          <button
            onClick={() => {
              setActiveTab('list-products');
              setCatalogMode('list');
            }}
            className={`flex items-center gap-2 py-2.5 px-5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'list-products'
                ? 'bg-black text-white shadow-md'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <Package className="w-4 h-4 text-cyan-400" />
            <span>Catálogo Ativo ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 py-2.5 px-5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-black text-white shadow-md'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <FolderPlus className="w-4 h-4 text-cyan-400" />
            <span>Categorias & Banner ({categories.length})</span>
          </button>

          {/* NEW TAB: STORE SETTINGS & SOCK OPTIONS */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-2.5 px-5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-black text-white shadow-md'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Opções do Detalhe & Loja</span>
          </button>

          {/* TAB: CUPÕES DE DESCONTO */}
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`flex items-center gap-2 py-2.5 px-5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'loyalty'
                ? 'bg-black text-white shadow-md'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <Ticket className="w-4 h-4 text-cyan-400" />
            <span>Cupões de Desconto ({(storeSettings.loyaltySettings?.rewards || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 py-2.5 px-5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-black text-white shadow-md'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Métricas & Vendas</span>
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {notification && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 px-5 py-3 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2.5 shadow-sm animate-fade-rise">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Page Content Cards */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-10 flex-1">
          {/* TAB: LIST PRODUCTS / CREATE OR EDIT SOCKS (IN-PAGE FULL VIEW) */}
          {activeTab === 'list-products' && (
            <div>
              {catalogMode !== 'list' ? (
                /* IN-PAGE CREATE OR EDIT SOCK FORM (NOT A MODAL) */
                <div className="max-w-4xl space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
                    <button
                      type="button"
                      onClick={handleCancelProductForm}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar ao Catálogo</span>
                    </button>

                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-50 text-cyan-900 border border-cyan-200">
                      {catalogMode === 'edit' ? 'Modo de Edição de Meia' : 'Novo Modelo Técnico'}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-serif text-3xl sm:text-4xl text-black">
                      {catalogMode === 'edit'
                        ? `Editar Meia: ${editingProduct?.name || prodName}`
                        : 'Carregar Novo Produto (Meia Técnica)'}
                    </h2>
                    <p className="text-xs text-[#6F6F6F] mt-1.5 font-sans">
                      {catalogMode === 'edit'
                        ? 'Atualize os dados técnicos, quantidade de stock, preços e imagens deste modelo.'
                        : 'Preencha os dados da meia técnica utilizando as cores, tamanhos, stock e badges configurados.'}
                    </p>
                  </div>

                  <form onSubmit={handleSaveProductForm} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                          Nome da Meia *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: VYRO Aero Carbon Pro"
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          className="w-full px-4 py-3 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                          Subtítulo / Tagline
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Máxima compressão para ciclismo de estrada"
                          value={prodTagline}
                          onChange={(e) => setProdTagline(e.target.value)}
                          className="w-full px-4 py-3 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                          Categoria *
                        </label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          className="w-full px-4 py-3 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black cursor-pointer font-medium"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                          Badge de Destaque
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {storeSettings.availableBadges.map((b) => (
                            <button
                              type="button"
                              key={b}
                              onClick={() => setProdBadge(prodBadge === b ? '' : b)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                prodBadge === b
                                  ? 'bg-black text-white shadow-sm'
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Ou escreva uma badge personalizada..."
                          value={prodBadge}
                          onChange={(e) => setProdBadge(e.target.value)}
                          className="w-full px-3 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                          Preço de Venda (€) *
                        </label>
                        <input
                          type="number"
                          step="0.10"
                          required
                          placeholder="Ex: 19.90"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          className="w-full px-4 py-3 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                          Preço Original / Antes (€) (Opcional)
                        </label>
                        <input
                          type="number"
                          step="0.10"
                          placeholder="Ex: 24.90"
                          value={prodOriginalPrice}
                          onChange={(e) => setProdOriginalPrice(e.target.value)}
                          className="w-full px-4 py-3 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black font-mono"
                        />
                      </div>

                      {/* CAMPO DE STOCK NUMÉRICO */}
                      <div className="sm:col-span-2 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                          Unidades em Stock *
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            required
                            placeholder="Ex: 50"
                            value={prodStock}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProdStock(val);
                              setProdInStock(parseInt(val, 10) > 0);
                            }}
                            className="w-full sm:w-48 px-4 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black font-mono font-bold text-base"
                          />
                          <div
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                              parseInt(prodStock || '0', 10) > 0 && prodInStock
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-rose-100 text-rose-900 border-rose-300'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-current" />
                            <span>
                              {parseInt(prodStock || '0', 10) > 0 && prodInStock
                                ? `${prodStock} unidades (Em Stock ✓)`
                                : '0 unidades (Esgotado ✕)'}
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-1.5">
                          {parseInt(prodStock || '0', 10) === 0
                            ? '⚠️ Com 0 unidades em stock, o produto é automaticamente exibido como Esgotado aos clientes na loja.'
                            : 'Define a quantidade real de stock físico disponível para este modelo de meia.'}
                        </p>
                      </div>
                    </div>

                    {/* Sizes Selection from Configured Sizes */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider">
                          Tamanhos Disponíveis
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveTab('settings')}
                          className="text-[11px] text-cyan-600 hover:underline cursor-pointer"
                        >
                          + Configurar Tamanhos da Loja
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {storeSettings.availableSizes.map((sz) => (
                          <button
                            type="button"
                            key={sz}
                            onClick={() => toggleSize(sz)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              prodSizes.includes(sz)
                                ? 'bg-black text-white border-black shadow-sm'
                                : 'bg-neutral-50 text-neutral-600 border-neutral-300 hover:border-neutral-400'
                            }`}
                          >
                            {sz} {prodSizes.includes(sz) ? '✓' : ''}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colors Selection from Configured Colors */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider">
                          Cores Deste Modelo (Selecione as opções ativas)
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveTab('settings')}
                          className="text-[11px] text-cyan-600 hover:underline cursor-pointer"
                        >
                          + Gerir Paleta de Cores da Loja
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {storeSettings.availableColors.map((col) => {
                          const isSelected = prodColors.some((c) => c.name === col.name);
                          return (
                            <button
                              type="button"
                              key={col.name}
                              onClick={() => toggleProductColor(col)}
                              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-black bg-neutral-50 ring-2 ring-black/20 font-bold'
                                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                              }`}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/20"
                                style={{ backgroundColor: col.hex }}
                              />
                              <span>{col.name}</span>
                              {isSelected && <span className="text-black font-bold">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Multi-Image Manager (Upload from PC + Add by URL + Presets) */}
                    <div className="pt-2 bg-neutral-50/80 p-5 rounded-2xl border border-neutral-200 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200">
                        <div>
                          <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-cyan-600" />
                            <span>Fotografias da Meia ({prodImages.length})</span>
                          </label>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            Carregue fotos do computador ou adicione por link URL. A primeira fotografia é a capa principal da loja.
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-neutral-200 self-start sm:self-auto shadow-2xs">
                          Múltiplas Fotos Permitidas
                        </span>
                      </div>

                      {/* Top input actions: 2 Options (Upload from PC & Add by URL) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Option 1: Upload from Computer */}
                        <div className="bg-white p-4 rounded-xl border border-dashed border-neutral-300 hover:border-cyan-500 transition-colors flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 mb-1.5">
                              <Upload className="w-3.5 h-3.5 text-cyan-600" />
                              <span>Opção 1: Carregar do Computador</span>
                            </span>
                            <p className="text-[11px] text-neutral-500 mb-3">
                              Selecione uma ou várias fotografias guardadas no seu PC:
                            </p>
                          </div>
                          <label className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-50 hover:bg-cyan-50/60 border border-neutral-200 hover:border-cyan-300 transition-all cursor-pointer group">
                            <Upload className="w-6 h-6 text-neutral-400 group-hover:text-cyan-600 group-hover:-translate-y-0.5 transition-all mb-1" />
                            <span className="text-xs font-bold text-neutral-800 group-hover:text-cyan-900">
                              Escolher Ficheiros do PC
                            </span>
                            <span className="text-[10px] text-neutral-400 mt-0.5">
                              PNG, JPG, WEBP (seleção múltipla)
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileUploadMultiple}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Option 2: Add by URL */}
                        <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 mb-1.5">
                              <ExternalLink className="w-3.5 h-3.5 text-cyan-600" />
                              <span>Opção 2: Adicionar por Link / URL</span>
                            </span>
                            <p className="text-[11px] text-neutral-500 mb-3">
                              Cole o link direto da fotografia na web:
                            </p>
                          </div>
                          <div className="space-y-2">
                            <input
                              type="url"
                              placeholder="https://exemplo.com/foto-meia.jpg"
                              value={newImageUrlInput}
                              onChange={(e) => setNewImageUrlInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddImageUrl();
                                }
                              }}
                              className="w-full px-3.5 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                            />
                            <button
                              type="button"
                              onClick={handleAddImageUrl}
                              className="w-full py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Adicionar Fotografia por URL</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Presets Carousel */}
                      <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
                        <span className="text-[11px] text-neutral-500 font-semibold block mb-2">
                          Ou adicione uma fotografia de demonstração VYRO com 1 clique:
                        </span>
                        <div className="flex gap-2.5 overflow-x-auto pb-1">
                          {PRESET_SOCKS_IMAGES.map((preset, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => handleAddPresetImage(preset)}
                              className="relative w-14 h-14 rounded-lg overflow-hidden border border-neutral-200 hover:border-cyan-500 transition-all cursor-pointer shrink-0 hover:scale-105 group"
                              title="Adicionar esta fotografia à meia"
                            >
                              <img src={preset} alt={`preset ${idx + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Plus className="w-4 h-4 text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Gallery / Image List */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs font-bold uppercase text-neutral-800 tracking-wider">
                            Galeria de Fotos da Meia ({prodImages.length})
                          </span>
                          {prodImages.length > 0 && (
                            <span className="text-[11px] text-cyan-700 font-semibold">
                              ★ Foto #1 é a foto de capa principal
                            </span>
                          )}
                        </div>

                        {prodImages.length === 0 ? (
                          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-neutral-300">
                            <ImageIcon className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-neutral-700">Nenhuma fotografia associada a esta meia</p>
                            <p className="text-[11px] text-neutral-400 mt-0.5">Carregue ficheiros do seu computador ou adicione via URL acima.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {prodImages.map((img, idx) => {
                              const isCover = idx === 0;
                              return (
                                <div
                                  key={idx}
                                  className={`group relative bg-white rounded-xl border overflow-hidden transition-all shadow-2xs ${
                                    isCover
                                      ? 'border-cyan-500 ring-2 ring-cyan-400/40 shadow-sm'
                                      : 'border-neutral-200 hover:border-neutral-300'
                                  }`}
                                >
                                  {/* Thumbnail */}
                                  <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
                                    <img src={img} alt={`foto ${idx + 1}`} className="w-full h-full object-cover" />

                                    {/* Cover Badge */}
                                    {isCover && (
                                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-cyan-300 text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                                        <Star className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400" />
                                        Capa Principal
                                      </span>
                                    )}

                                    {/* Action Buttons overlay */}
                                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                                        title="Eliminar esta foto"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Card Footer Controls */}
                                  <div className="p-2 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                                    <span className="font-mono text-neutral-400 font-bold">#{idx + 1}</span>

                                    <div className="flex items-center gap-1">
                                      {/* Reorder Left */}
                                      {idx > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => handleMoveImage(idx, 'left')}
                                          className="p-1 rounded hover:bg-neutral-200 text-neutral-600 hover:text-black cursor-pointer"
                                          title="Mover foto para trás"
                                        >
                                          <ArrowLeft className="w-3 h-3" />
                                        </button>
                                      )}

                                      {/* Set as Cover */}
                                      {!isCover && (
                                        <button
                                          type="button"
                                          onClick={() => handleSetCoverImage(idx)}
                                          className="px-1.5 py-0.5 rounded bg-white hover:bg-cyan-50 text-cyan-700 border border-cyan-200 font-semibold text-[9px] cursor-pointer"
                                          title="Definir como foto de capa"
                                        >
                                          Tornar Capa
                                        </button>
                                      )}

                                      {/* Reorder Right */}
                                      {idx < prodImages.length - 1 && (
                                        <button
                                          type="button"
                                          onClick={() => handleMoveImage(idx, 'right')}
                                          className="p-1 rounded hover:bg-neutral-200 text-neutral-600 hover:text-black cursor-pointer"
                                          title="Mover foto para a frente"
                                        >
                                          <ArrowRight className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description & Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                      <div>
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                          Descrição Completa
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Descreva a tecnologia, biomecânica e respirabilidade da meia..."
                          value={prodDescription}
                          onChange={(e) => setProdDescription(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                          Especificações Técnicas (1 por linha)
                        </label>
                        <textarea
                          rows={4}
                          value={prodFeatures}
                          onChange={(e) => setProdFeatures(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Featured in Home Section Toggle */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-amber-950">
                            Destacar na Página Inicial (Bloco pós-Hero)
                          </div>
                          <div className="text-[11px] text-amber-800/80">
                            Esta meia aparecerá em destaque no bloco exclusivo logo a seguir ao Hero.
                          </div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={prodIsFeatured}
                          onChange={(e) => setProdIsFeatured(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>

                    <div className="pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleCancelProductForm}
                        className="px-6 py-3 rounded-full border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-semibold text-xs transition-all cursor-pointer"
                      >
                        Cancelar e Voltar
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3.5 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 hover:scale-[1.02] transition-all shadow-xl flex items-center gap-2 cursor-pointer"
                      >
                        {catalogMode === 'edit' ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Guardar Alterações da Meia</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 text-cyan-400" />
                            <span>Publicar Meia no Catálogo</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* NORMAL LIST VIEW */
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1">
                        <Package className="w-4 h-4" />
                        <span>Gestão de Inventário & Catálogo</span>
                      </div>
                      <h2 className="font-serif text-3xl sm:text-4xl text-black">
                        Catálogo Ativo de Meias
                      </h2>
                      <p className="text-xs text-[#6F6F6F] mt-1">
                        Filtre por categoria, disponibilidade de stock, badges de destaque ou pesquise em tempo real.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {hasActiveCatalogFilters && (
                        <button
                          onClick={resetCatalogFilters}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Limpar Filtros</span>
                        </button>
                      )}
                      <button
                        onClick={handleStartCreateProduct}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4 text-cyan-400" />
                        <span>Novo Modelo</span>
                      </button>
                    </div>
                  </div>

              {/* FEATURED SOCKS SPOTLIGHT MANAGEMENT BANNER */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/90 rounded-3xl p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                      <Star className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-neutral-900 flex items-center gap-2">
                        <span>Meias em Destaque na Página Inicial</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          {products.filter((p) => p.isFeatured).length} selecionada(s)
                        </span>
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Estes modelos são exibidos no bloco exclusivo logo a seguir ao Hero. Ative ou desative qualquer modelo com 1 clique.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCatalogFeaturedFilter(catalogFeaturedFilter === 'featured' ? 'all' : 'featured')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                      catalogFeaturedFilter === 'featured'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-white border border-amber-300 text-amber-950 hover:bg-amber-50'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{catalogFeaturedFilter === 'featured' ? 'A ver apenas Destaques' : 'Filtrar por Destaques'}</span>
                  </button>
                </div>

                {/* Quick Avatar Strip of Currently Featured Socks */}
                <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-amber-200/50">
                  {products.filter((p) => p.isFeatured).length === 0 ? (
                    <div className="text-xs text-amber-800 italic py-1">
                      Nenhuma meia marcada como destaque no momento. Clique no botão "Destacar" na tabela abaixo para escolher quais devem aparecer no bloco principal.
                    </div>
                  ) : (
                    products
                      .filter((p) => p.isFeatured)
                      .map((featProd) => (
                        <div
                          key={featProd.id}
                          className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-2xl bg-white border border-amber-300 shadow-xs hover:shadow transition-all"
                        >
                          <img
                            src={featProd.images[0]}
                            alt={featProd.name}
                            className="w-7 h-7 rounded-lg object-cover"
                          />
                          <div className="text-xs font-bold text-neutral-800 max-w-[140px] truncate">
                            {featProd.name}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              toggleFeaturedProduct(featProd.id);
                              showNotification(`"${featProd.name}" removida dos destaques.`);
                            }}
                            className="text-neutral-400 hover:text-red-500 p-0.5 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remover dos destaques"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* QUICK CATEGORY PILLS BAR */}
              <div className="flex flex-wrap items-center gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setCatalogCategoryFilter('all');
                    setCatalogFeaturedFilter('all');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    catalogCategoryFilter === 'all' && catalogFeaturedFilter === 'all'
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Todas ({products.length})
                </button>

                <button
                  type="button"
                  onClick={() => setCatalogFeaturedFilter(catalogFeaturedFilter === 'featured' ? 'all' : 'featured')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                    catalogFeaturedFilter === 'featured'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Destaques ({products.filter((p) => p.isFeatured).length})</span>
                </button>

                {categories.map((cat) => {
                  const count = products.filter((p) => p.categoryId === cat.id).length;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => {
                        setCatalogCategoryFilter(cat.id);
                        setCatalogFeaturedFilter('all');
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        catalogCategoryFilter === cat.id && catalogFeaturedFilter === 'all'
                          ? 'bg-black text-white shadow-sm'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* FILTER CONTROLS CARD */}
              <div className="bg-neutral-50 border border-neutral-200/90 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Search Bar (6 cols) */}
                  <div className="sm:col-span-6 relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Pesquisar por modelo, tecnologia, categoria..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="w-full pl-10 pr-9 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black"
                    />
                    {catalogSearch && (
                      <button
                        type="button"
                        onClick={() => setCatalogSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Stock Filter (3 cols) */}
                  <div className="sm:col-span-3">
                    <select
                      value={catalogStockFilter}
                      onChange={(e) =>
                        setCatalogStockFilter(e.target.value as 'all' | 'in-stock' | 'out-of-stock')
                      }
                      className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black cursor-pointer font-medium"
                    >
                      <option value="all">Todos os Stocks ({products.length})</option>
                      <option value="in-stock">
                        Em Stock ({products.filter((p) => p.inStock).length})
                      </option>
                      <option value="out-of-stock">
                        Esgotados ({products.filter((p) => !p.inStock).length})
                      </option>
                    </select>
                  </div>

                  {/* Sort Order (3 cols) */}
                  <div className="sm:col-span-3">
                    <div className="relative">
                      <select
                        value={catalogSortBy}
                        onChange={(e) =>
                          setCatalogSortBy(
                            e.target.value as 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
                          )
                        }
                        className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black cursor-pointer font-medium"
                      >
                        <option value="newest">Mais Recentes</option>
                        <option value="price-asc">Preço: Menor p/ Maior</option>
                        <option value="price-desc">Preço: Maior p/ Menor</option>
                        <option value="name-asc">Nome: A a Z</option>
                        <option value="name-desc">Nome: Z a A</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sub-row: Category Selector & Badge Selector */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-200/60">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Category Dropdown */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">
                        Categoria:
                      </span>
                      <select
                        value={catalogCategoryFilter}
                        onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs border rounded-lg border-neutral-300 bg-white focus:outline-none focus:border-black cursor-pointer font-medium"
                      >
                        <option value="all">Todas as Categorias</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({products.filter((p) => p.categoryId === cat.id).length})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Badge Dropdown */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">
                        Badge:
                      </span>
                      <select
                        value={catalogBadgeFilter}
                        onChange={(e) => setCatalogBadgeFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs border rounded-lg border-neutral-300 bg-white focus:outline-none focus:border-black cursor-pointer font-medium"
                      >
                        <option value="all">Todas as Badges</option>
                        <option value="has-badge">Com Qualquer Badge</option>
                        <option value="no-badge">Sem Badge</option>
                        {storeSettings.availableBadges.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Filter Results Counter */}
                  <div className="text-xs text-neutral-500 font-medium">
                    A exibir <strong className="text-black font-bold">{filteredProducts.length}</strong> de{' '}
                    <strong className="text-black font-bold">{products.length}</strong> modelos
                  </div>
                </div>

                {/* Active Filter Chips */}
                {hasActiveCatalogFilters && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200/60">
                    <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider mr-1">
                      Filtros Ativos:
                    </span>

                    {catalogSearch && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-900 text-[11px] font-medium">
                        <span>Pesquisa: "{catalogSearch}"</span>
                        <button
                          type="button"
                          onClick={() => setCatalogSearch('')}
                          className="hover:text-black cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {catalogCategoryFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-900 text-[11px] font-medium">
                        <span>
                          Categoria:{' '}
                          {categories.find((c) => c.id === catalogCategoryFilter)?.name || 'Selecionada'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCatalogCategoryFilter('all')}
                          className="hover:text-black cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {catalogStockFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-900 text-[11px] font-medium">
                        <span>
                          Stock: {catalogStockFilter === 'in-stock' ? 'Em Stock' : 'Esgotados'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCatalogStockFilter('all')}
                          className="hover:text-black cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {catalogBadgeFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-900 text-[11px] font-medium">
                        <span>
                          Badge:{' '}
                          {catalogBadgeFilter === 'has-badge'
                            ? 'Com Badge'
                            : catalogBadgeFilter === 'no-badge'
                            ? 'Sem Badge'
                            : catalogBadgeFilter}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCatalogBadgeFilter('all')}
                          className="hover:text-black cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={resetCatalogFilters}
                      className="text-[11px] text-cyan-700 hover:underline font-bold ml-1 cursor-pointer"
                    >
                      Limpar todos
                    </button>
                  </div>
                )}
              </div>

              {/* PRODUCTS TABLE OR EMPTY STATE */}
              {filteredProducts.length === 0 ? (
                <div className="bg-neutral-50 rounded-3xl p-10 border border-neutral-200 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-200/80 flex items-center justify-center text-neutral-500 mb-4">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-black">Nenhuma Meia Encontrada</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                    Não existem modelos de meias que correspondam aos filtros e termos de pesquisa aplicados.
                  </p>
                  <button
                    onClick={resetCatalogFilters}
                    className="mt-5 px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Limpar Filtros e Ver Todas ({products.length})</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto border border-neutral-200 rounded-2xl shadow-xs bg-white">
                  <table className="w-full text-left text-xs text-neutral-600">
                    <thead className="bg-neutral-50 text-neutral-800 font-bold uppercase text-[10px] tracking-wider border-b border-neutral-200">
                      <tr>
                        <th className="p-4">Produto</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4">Badge</th>
                        <th className="p-4">Preço</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-center">Destaque na Home</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                          <td className="p-4 flex items-center gap-3.5">
                            <div 
                              onClick={() => handleStartEditProduct(p)}
                              className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200 cursor-pointer group"
                              title="Clique para editar esta meia"
                            >
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Pencil className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div>
                              <div 
                                onClick={() => handleStartEditProduct(p)}
                                className="font-bold text-sm text-black hover:text-cyan-600 cursor-pointer transition-colors flex items-center gap-1.5 group"
                                title="Clique para editar esta meia"
                              >
                                <span>{p.name}</span>
                                <Pencil className="w-3 h-3 text-neutral-300 group-hover:text-cyan-600 transition-colors" />
                              </div>
                              <div className="text-[11px] text-neutral-400">{p.tagline}</div>
                              {p.sizes && p.sizes.length > 0 && (
                                <div className="text-[10px] text-neutral-400 mt-0.5">
                                  Tamanhos: {p.sizes.join(', ')}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 font-semibold text-[11px] border border-cyan-200/60">
                              {p.categoryName}
                            </span>
                          </td>
                          <td className="p-4">
                            {p.badge ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-bold tracking-wider uppercase">
                                {p.badge}
                              </span>
                            ) : (
                              <span className="text-neutral-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="p-4 font-bold text-sm text-black font-sans">
                            €{p.price.toFixed(2)}
                            {p.originalPrice && (
                              <span className="text-xs text-neutral-400 line-through ml-2 font-normal">
                                €{p.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-2xs border ${
                                  p.inStock && (p.stock === undefined || p.stock > 0)
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : 'bg-rose-100 text-rose-900 border-rose-300'
                                }`}
                              >
                                {p.stock !== undefined ? `${p.stock} un.` : (p.inStock ? 'Em Stock' : 'Esgotado')}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newInStock = !p.inStock;
                                  const currentStock = p.stock !== undefined ? p.stock : 30;
                                  updateProduct(p.id, {
                                    inStock: newInStock,
                                    stock: newInStock ? (currentStock > 0 ? currentStock : 25) : 0,
                                  });
                                  showNotification(`Stock de "${p.name}" alterado.`);
                                }}
                                className="text-[10px] text-neutral-500 hover:text-black underline cursor-pointer"
                                title="Alternar estado de stock"
                              >
                                {p.inStock && (p.stock === undefined || p.stock > 0) ? 'Esgotar' : 'Repor'}
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                toggleFeaturedProduct(p.id);
                                showNotification(
                                  p.isFeatured
                                    ? `"${p.name}" removida do bloco de destaques da página principal.`
                                    : `"${p.name}" colocada no bloco de meias em destaque!`
                                );
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-xs ${
                                p.isFeatured
                                  ? 'bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200'
                                  : 'bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200 hover:text-black'
                              }`}
                              title={p.isFeatured ? 'Remover do bloco em destaque' : 'Colocar no bloco em destaque'}
                            >
                              <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-amber-500 text-amber-500' : 'text-neutral-400'}`} />
                              <span>{p.isFeatured ? 'Em Destaque ★' : 'Destacar'}</span>
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleStartEditProduct(p)}
                                className="px-3 py-1.5 text-cyan-900 bg-cyan-50 hover:bg-cyan-100 transition-colors rounded-xl flex items-center gap-1.5 font-bold text-xs cursor-pointer border border-cyan-200/80 shadow-2xs hover:shadow-xs"
                                title="Editar Meia"
                              >
                                <Pencil className="w-3.5 h-3.5 text-cyan-600" />
                                <span>Editar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Tem a certeza que deseja eliminar "${p.name}"?`)) {
                                    deleteProduct(p.id);
                                    showNotification(`Produto "${p.name}" eliminado.`);
                                  }
                                }}
                                className="p-2 text-neutral-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50 cursor-pointer"
                                title="Eliminar Meia"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

          {/* TAB 3: CATEGORIES & BANNER */}
          {activeTab === 'categories' && (
            <div className="space-y-8">
              {/* Categories Sub-Tabs Navigation */}
              <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 pb-4">
                <button
                  type="button"
                  onClick={() => setCategoriesSubTab('banner')}
                  className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    categoriesSubTab === 'banner'
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Banner de Destaque da Categoria (Acima do Catálogo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategoriesSubTab('manage')}
                  className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    categoriesSubTab === 'manage'
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
                  }`}
                >
                  <FolderPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Gerir Categorias da Loja ({categories.length})</span>
                </button>
              </div>

              {/* SUB-TAB 1: BANNER DESTAQUE CATEGORIA */}
              {categoriesSubTab === 'banner' && (
                <div className="space-y-8">
                  {/* Header */}
                  <div className="border-b border-neutral-100 pb-4">
                    <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Bloco Promocional de Categoria</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl text-black">
                      Banner de Destaque da Categoria
                    </h2>
                    <p className="text-xs text-[#6F6F6F] mt-1 max-w-2xl">
                      Este bloco aparece na página inicial <strong>imediatamente acima de "Engenharia Para os Teus Pés"</strong>. Permite destacar uma modalidade/categoria específica, alterar os textos, carregar uma imagem exclusiva e direcionar o utilizador com 1 clique para as meias dessa categoria.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Form (7 cols) */}
                    <form onSubmit={handleSaveBanner} className="lg:col-span-7 space-y-6 bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200">
                      {/* Enable/Disable Toggle */}
                      <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs font-bold text-black flex items-center gap-2">
                            <span>Exibir Bloco de Destaque na Página Inicial</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${bannerEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'}`}>
                              {bannerEnabled ? 'Ativo' : 'Oculto'}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            Se desativado, o bloco fica temporariamente oculto no site sem perder as configurações guardadas.
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={bannerEnabled}
                            onChange={(e) => setBannerEnabled(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                      </div>

                      {/* Category Selection */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block">
                            Categoria a Destacar *
                          </label>
                          <span className="text-[11px] text-cyan-700 font-semibold">
                            Ao clicar no botão, filtra por esta categoria
                          </span>
                        </div>
                        <select
                          value={bannerCategoryId}
                          onChange={(e) => handleSelectCategoryForBanner(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black font-semibold text-neutral-800 cursor-pointer"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({products.filter((p) => p.categoryId === c.id).length} modelos disponíveis)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Title & Badge */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        <div className="sm:col-span-8">
                          <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1">
                            Título Principal do Bloco *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Running & Maratona de Alta Performance"
                            value={bannerTitle}
                            onChange={(e) => setBannerTitle(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1">
                            Etiqueta / Badge
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Linha em Destaque"
                            value={bannerBadge}
                            onChange={(e) => setBannerBadge(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      {/* Subtitle / Description */}
                      <div>
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1">
                          Descrição / Texto Explicativo da Categoria *
                        </label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Explica a tecnologia, amortecimento e benefícios desta categoria de meias..."
                          value={bannerSubtitle}
                          onChange={(e) => setBannerSubtitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black leading-relaxed"
                        />
                      </div>

                      {/* Button Text */}
                      <div>
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1">
                          Texto do Botão de Ação (CTA) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Ver Meias de Running"
                          value={bannerButtonText}
                          onChange={(e) => setBannerButtonText(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black font-medium"
                        />
                      </div>

                      {/* Image Upload & Presets Section */}
                      <div className="space-y-3 pt-2 border-t border-neutral-200">
                        <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block">
                          Imagem da Categoria
                        </label>

                        {/* URL input and upload button */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            placeholder="URL da imagem (https://...)"
                            value={bannerImageUrl}
                            onChange={(e) => setBannerImageUrl(e.target.value)}
                            className="flex-1 px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black"
                          />

                          <label className="px-4 py-2.5 rounded-xl bg-white border border-neutral-300 hover:border-black text-neutral-800 hover:text-black text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0">
                            <Upload className="w-3.5 h-3.5 text-cyan-600" />
                            <span>Carregar do Computador</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBannerFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Presets Gallery */}
                        <div>
                          <span className="text-[11px] text-neutral-500 font-semibold block mb-2">
                            Ou escolhe uma imagem desportiva recomendada:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {BANNER_PRESET_IMAGES.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setBannerImageUrl(preset.url)}
                                className={`flex items-center gap-2 p-1.5 rounded-xl border text-left text-[11px] font-medium transition-all cursor-pointer ${
                                  bannerImageUrl === preset.url
                                    ? 'border-cyan-500 bg-cyan-50/50 text-black ring-2 ring-cyan-200'
                                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                                }`}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.label}
                                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                                />
                                <span className="truncate">{preset.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="pt-4 border-t border-neutral-200 flex justify-end">
                        <button
                          type="submit"
                          className="px-8 py-3.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
                        >
                          <Check className="w-4 h-4 text-cyan-400" />
                          <span>Guardar Alterações do Banner</span>
                        </button>
                      </div>
                    </form>

                    {/* Live Preview (5 cols) */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
                        <span>Pré-visualização em Tempo Real</span>
                        <span className="text-[11px] text-cyan-700 font-normal">Ao vivo</span>
                      </div>

                      <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-7 border border-neutral-800 shadow-xl space-y-4 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider border border-cyan-400/30">
                            {bannerBadge || 'Categoria em Foco'}
                          </span>
                          <span className="text-[10px] text-neutral-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                            {categories.find((c) => c.id === bannerCategoryId)?.name || 'Categoria'}
                          </span>
                        </div>

                        <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 relative shadow-inner">
                          <img
                            src={bannerImageUrl}
                            alt="Pré-visualização"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />
                          <div className="absolute bottom-2.5 right-2.5 text-[10px] bg-black/80 backdrop-blur-xs px-2 py-0.5 rounded-md text-cyan-300 border border-white/10">
                            Banner Hero (Largura Total)
                          </div>
                        </div>

                        <h4 className="font-serif text-2xl text-white font-normal leading-tight">
                          {bannerTitle || 'Título da Categoria'}
                        </h4>

                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {bannerSubtitle || 'Descrição explicativa da categoria...'}
                        </p>

                        <button
                          type="button"
                          className="w-full py-3 rounded-full bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-400/20"
                        >
                          <span>{bannerButtonText || 'Explorar Coleção'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: GERIR CATEGORIAS */}
              {categoriesSubTab === 'manage' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Form to create or edit category (5 cols) */}
                  <div
                    id="category-form"
                    className={`lg:col-span-5 p-6 sm:p-8 rounded-3xl border transition-all ${
                      editingCategoryId
                        ? 'bg-cyan-50/40 border-cyan-300 ring-2 ring-cyan-100 shadow-md'
                        : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {editingCategoryId ? (
                      <Pencil className="w-5 h-5 text-cyan-600" />
                    ) : (
                      <FolderPlus className="w-5 h-5 text-cyan-600" />
                    )}
                    <h3 className="font-serif text-2xl text-black">
                      {editingCategoryId ? 'Editar Categoria' : 'Criar Nova Categoria'}
                    </h3>
                  </div>
                  {editingCategoryId && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-600 text-white shadow-sm">
                      Em Edição
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#6F6F6F] mb-6">
                  {editingCategoryId
                    ? 'Altera os dados da categoria selecionada. Todas as meias associadas serão atualizadas.'
                    : 'Adiciona novas linhas desportivas e filtros para organizar a loja VYRO.'}
                </p>

                <form onSubmit={handleSaveCategory} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1">
                      Nome da Categoria *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Triathlon & Água"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1">
                      Slug URL
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: triathlon-agua"
                      value={catSlug}
                      onChange={(e) => setCatSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black bg-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1">
                      Descrição da Linha
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Breve descrição dos benefícios biomecânicos desta categoria..."
                      value={catDescription}
                      onChange={(e) => setCatDescription(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 hover:scale-[1.01] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {editingCategoryId ? (
                        <>
                          <Check className="w-4 h-4 text-cyan-400" />
                          <span>Guardar Alterações</span>
                        </>
                      ) : (
                        <>
                          <FolderPlus className="w-4 h-4 text-cyan-400" />
                          <span>Criar Categoria</span>
                        </>
                      )}
                    </button>

                    {editingCategoryId && (
                      <button
                        type="button"
                        onClick={handleCancelEditCategory}
                        className="py-3.5 px-5 rounded-full border border-neutral-300 hover:border-black text-neutral-700 hover:text-black font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer bg-white"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List of existing categories (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-black">Categorias Existentes</h3>
                    <p className="text-xs text-[#6F6F6F] mt-0.5">
                      Clica em <strong>Editar</strong> para modificar ou no ícone do lixo para remover.
                    </p>
                  </div>
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full font-bold">
                    {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {categories.map((c) => {
                    const count = products.filter((p) => p.categoryId === c.id).length;
                    const isBeingEdited = editingCategoryId === c.id;

                    return (
                      <div
                        key={c.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                          isBeingEdited
                            ? 'border-cyan-500 ring-2 ring-cyan-200 bg-cyan-50/20'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-bold text-base text-black">{c.name}</span>
                            <span className="text-[11px] bg-cyan-50 text-cyan-800 border border-cyan-200 px-2.5 py-0.5 rounded-full font-semibold">
                              {count} {count === 1 ? 'modelo' : 'modelos'}
                            </span>
                            {isBeingEdited && (
                              <span className="text-[10px] bg-cyan-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                                A Editar
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                            {c.description}
                          </p>
                          <span className="text-[10px] text-cyan-600 font-mono block mt-1">
                            slug: #{c.slug}
                          </span>
                        </div>

                        {/* Actions: Edit and Delete */}
                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                          <button
                            type="button"
                            onClick={() => handleStartEditCategory(c)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isBeingEdited
                                ? 'bg-cyan-600 text-white shadow-sm'
                                : 'bg-neutral-100 hover:bg-black hover:text-white text-neutral-700'
                            }`}
                            title="Editar Categoria"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>

                          {categories.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  confirm(
                                    `Tem a certeza de que deseja eliminar a categoria "${c.name}"?`
                                  )
                                ) {
                                  deleteCategory(c.id);
                                  if (editingCategoryId === c.id) {
                                    handleCancelEditCategory();
                                  }
                                  showNotification(`Categoria "${c.name}" eliminada.`);
                                }
                              }}
                              className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl border border-transparent hover:border-red-200 cursor-pointer"
                              title="Eliminar Categoria"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

          {/* TAB 4: STORE SETTINGS & SOCK DETAIL OPTIONS (NOVA ÁREA) */}
          {activeTab === 'settings' && (
            <div className="space-y-12 max-w-5xl">
              <div className="border-b border-neutral-100 pb-6">
                <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold uppercase tracking-widest mb-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>Configurações Globais da Loja</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-black">
                  Opções do Detalhe da Meia, Envio & Atributos
                </h2>
                <p className="text-xs text-[#6F6F6F] mt-1.5 max-w-2xl leading-relaxed">
                  Configura os 3 selos de garantia e envio que aparecem na página da meia (como na foto), as badges de destaque dos produtos, tamanhos disponíveis e a paleta de cores da marca.
                </p>
              </div>

              {/* SEÇÃO 1: OPÇÕES DO DETALHE DA MEIA (SELOS DA FOTO) */}
              <div className="bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-200">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-serif text-2xl text-black flex items-center gap-2">
                      <Shield className="w-5 h-5 text-cyan-600" />
                      <span>Selos de Garantia & Envio (Detalhe da Meia)</span>
                    </h3>
                    <p className="text-xs text-[#6F6F6F] mt-1">
                      Ativa, desativa ou personaliza os selos exibidos abaixo da foto no detalhe da meia.
                    </p>
                  </div>
                </div>

                {/* LIVE PREVIEW BANNER (EXATAMENTE COMO NA FOTO) */}
                <div className="mb-8">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                    Pré-visualização em Tempo Real (Página da Meia):
                  </span>
                  <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {storeSettings.guaranteeBadges
                        .filter((gb) => gb.enabled)
                        .map((gb) => (
                          <div key={gb.id} className="flex items-center gap-3.5">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${getBadgeIconColors(
                                gb.icon
                              )}`}
                            >
                              {renderBadgeIcon(gb.icon)}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-black">{gb.title}</div>
                              <div className="text-xs text-[#6F6F6F]">{gb.subtitle}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* EDIT BADGES LIST */}
                <div className="space-y-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                    Editar e Ativar/Desativar Selos:
                  </span>
                  <div className="grid grid-cols-1 gap-4">
                    {storeSettings.guaranteeBadges.map((gb) => (
                      <div
                        key={gb.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          gb.enabled
                            ? 'bg-white border-neutral-200 shadow-sm'
                            : 'bg-neutral-100/70 border-neutral-200 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Toggle active */}
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                updateGuaranteeBadge(gb.id, { enabled: !gb.enabled });
                                showNotification(
                                  `Selo "${gb.title}" ${!gb.enabled ? 'ativado' : 'desativado'}.`
                                );
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                                gb.enabled
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-neutral-300 text-neutral-700'
                              }`}
                            >
                              {gb.enabled ? 'Ativo ✓' : 'Desativado ✕'}
                            </button>
                            <span className="text-xs font-semibold text-neutral-500">
                              {gb.enabled ? 'Exibido no detalhe' : 'Oculto na loja'}
                            </span>
                          </div>

                          {/* Inputs */}
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                                Título
                              </label>
                              <input
                                type="text"
                                value={gb.title}
                                onChange={(e) =>
                                  updateGuaranteeBadge(gb.id, { title: e.target.value })
                                }
                                className="w-full px-3 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black bg-white"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                                Subtítulo
                              </label>
                              <input
                                type="text"
                                value={gb.subtitle}
                                onChange={(e) =>
                                  updateGuaranteeBadge(gb.id, { subtitle: e.target.value })
                                }
                                className="w-full px-3 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black bg-white"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                                Ícone
                              </label>
                              <select
                                value={gb.icon}
                                onChange={(e) =>
                                  updateGuaranteeBadge(gb.id, {
                                    icon: e.target.value as GuaranteeBadge['icon'],
                                  })
                                }
                                className="w-full px-3 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black bg-white cursor-pointer"
                              >
                                <option value="truck">🚚 Envio (Camioneta)</option>
                                <option value="shield">🛡️ Garantia (Escudo)</option>
                                <option value="refresh">🔄 Devolução (Ciclo)</option>
                                <option value="zap">⚡ Velocidade / Tech (Raio)</option>
                                <option value="sparkles">✨ Qualidade (Brilho)</option>
                                <option value="check">✓ Verificado (Check)</option>
                              </select>
                            </div>
                          </div>

                          {/* Delete */}
                          {storeSettings.guaranteeBadges.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remover o selo "${gb.title}"?`)) {
                                  deleteGuaranteeBadge(gb.id);
                                  showNotification(`Selo removido.`);
                                }
                              }}
                              className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                              title="Remover Selo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ADD NEW GUARANTEE BADGE FORM */}
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 block mb-3">
                    + Adicionar Novo Selo de Detalhe:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="Título (ex: Feito em Portugal)"
                      value={newGbTitle}
                      onChange={(e) => setNewGbTitle(e.target.value)}
                      className="px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      placeholder="Subtítulo (ex: Qualidade certificada)"
                      value={newGbSubtitle}
                      onChange={(e) => setNewGbSubtitle(e.target.value)}
                      className="px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black"
                    />
                    <select
                      value={newGbIcon}
                      onChange={(e) =>
                        setNewGbIcon(e.target.value as GuaranteeBadge['icon'])
                      }
                      className="px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="truck">🚚 Envio (Camioneta)</option>
                      <option value="shield">🛡️ Garantia (Escudo)</option>
                      <option value="refresh">🔄 Devolução (Ciclo)</option>
                      <option value="zap">⚡ Velocidade / Tech (Raio)</option>
                      <option value="sparkles">✨ Qualidade (Brilho)</option>
                      <option value="check">✓ Verificado (Check)</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newGbTitle.trim()) return;
                        addGuaranteeBadge({
                          title: newGbTitle.trim(),
                          subtitle: newGbSubtitle.trim() || 'Qualidade garantida',
                          icon: newGbIcon,
                          enabled: true,
                        });
                        showNotification(`Novo selo "${newGbTitle}" adicionado!`);
                        setNewGbTitle('');
                        setNewGbSubtitle('');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Adicionar Selo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 2: BADGES DE DESTAQUE */}
              <div className="bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <Tag className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-serif text-2xl text-black">
                    Badges de Destaque (Etiquetas dos Produtos)
                  </h3>
                </div>
                <p className="text-xs text-[#6F6F6F] mb-6">
                  Configura as etiquetas que aparecem sobre as fotografias das meias no catálogo (ex: BESTSELLER, NOVO, AERO TECH).
                </p>

                {/* Chips */}
                <div className="flex flex-wrap gap-2.5 mb-6">
                  {storeSettings.availableBadges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider shadow-sm"
                    >
                      <span>{badge}</span>
                      <button
                        type="button"
                        onClick={() => {
                          deleteStoreBadge(badge);
                          showNotification(`Badge "${badge}" removida.`);
                        }}
                        className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Badge Form */}
                <div className="flex gap-3 max-w-md">
                  <input
                    type="text"
                    placeholder="Nome da badge (ex: EDIÇÃO MARATONA)"
                    value={newBadgeInput}
                    onChange={(e) => setNewBadgeInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newBadgeInput.trim()) return;
                      addStoreBadge(newBadgeInput);
                      showNotification(`Badge "${newBadgeInput.toUpperCase()}" adicionada.`);
                      setNewBadgeInput('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Adicionar Badge</span>
                  </button>
                </div>
              </div>

              {/* SEÇÃO 3: CORES DA MARCA */}
              <div className="bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <Palette className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-serif text-2xl text-black">
                    Paleta de Cores da Marca VYRO
                  </h3>
                </div>
                <p className="text-xs text-[#6F6F6F] mb-6">
                  Adiciona novas cores que ficam disponíveis para seleção nos modelos de meias da loja.
                </p>

                {/* Colors List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {storeSettings.availableColors.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-6 h-6 rounded-full border border-black/20 shadow-inner shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div>
                          <div className="font-bold text-xs text-black">{c.name}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">{c.hex}</div>
                        </div>
                      </div>

                      {storeSettings.availableColors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            deleteStoreColor(c.name);
                            showNotification(`Cor "${c.name}" removida.`);
                          }}
                          className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                          title="Eliminar cor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Color Form */}
                <div className="flex flex-wrap items-center gap-3 max-w-lg bg-white p-4 rounded-2xl border border-neutral-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0.5 bg-transparent"
                    />
                    <input
                      type="text"
                      placeholder="#00f2fe"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-24 px-2.5 py-2 text-xs border rounded-lg border-neutral-300 font-mono uppercase"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Nome da cor (ex: Verde Neon Pro)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border rounded-lg border-neutral-300 focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newColorName.trim()) return;
                      addStoreColor({ name: newColorName.trim(), hex: newColorHex });
                      showNotification(`Cor "${newColorName}" adicionada à paleta!`);
                      setNewColorName('');
                    }}
                    className="px-4 py-2 rounded-lg bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3 h-3 text-cyan-400" />
                    <span>Adicionar Cor</span>
                  </button>
                </div>
              </div>

              {/* SEÇÃO 4: TAMANHOS DISPONÍVEIS */}
              <div className="bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-200">
                <h3 className="font-serif text-2xl text-black mb-1.5">
                  Tamanhos Disponíveis para as Meias
                </h3>
                <p className="text-xs text-[#6F6F6F] mb-6">
                  Configura a grelha de tamanhos apresentada aos clientes para seleção no catálogo.
                </p>

                {/* Sizes chips */}
                <div className="flex flex-wrap gap-2.5 mb-6">
                  {storeSettings.availableSizes.map((sz) => (
                    <span
                      key={sz}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-black shadow-sm"
                    >
                      <span>{sz}</span>
                      {storeSettings.availableSizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            deleteStoreSize(sz);
                            showNotification(`Tamanho "${sz}" removido.`);
                          }}
                          className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {/* Add Size Form */}
                <div className="flex gap-3 max-w-sm">
                  <input
                    type="text"
                    placeholder="Novo tamanho (ex: 31-34 ou Único)"
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newSizeInput.trim()) return;
                      addStoreSize(newSizeInput);
                      showNotification(`Tamanho "${newSizeInput}" adicionado.`);
                      setNewSizeInput('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>

              {/* SEÇÃO 5: CONFIGURAÇÕES DE ENVIO E PORTES */}
              <div className="bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <Truck className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-serif text-2xl text-black">
                    Configurações de Envio e Portes Grátis
                  </h3>
                </div>
                <p className="text-xs text-[#6F6F6F] mb-6">
                  Define o valor mínimo de compra para ativar o envio gratuito e o custo de transporte normal.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl">
                  <div>
                    <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                      Valor P/ Envio Grátis (€)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={shippingThresholdInput}
                      onChange={(e) => setShippingThresholdInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                      Custo Normal de Portes (€)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      value={shippingCostInput}
                      onChange={(e) => setShippingCostInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                      Estimativa de Envio
                    </label>
                    <input
                      type="text"
                      value={shippingEstimateInput}
                      onChange={(e) => setShippingEstimateInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      updateStoreSettings({
                        freeShippingThreshold: parseFloat(shippingThresholdInput) || 40.0,
                        shippingCost: parseFloat(shippingCostInput) || 3.90,
                        shippingEstimate: shippingEstimateInput || 'Envio Expresso 24/48h',
                      });
                      showNotification('Configurações de envio e portes atualizadas com sucesso!');
                    }}
                    className="px-6 py-3 rounded-full bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>Guardar Configurações de Envio</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GESTÃO DE CUPÕES DE DESCONTO */}
          {activeTab === 'loyalty' && (
            <div className="space-y-8 max-w-5xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1">
                    <Ticket className="w-4 h-4" />
                    <span>Campanhas & Códigos Promocionais</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-black">
                    Gestão de Cupões de Desconto
                  </h2>
                  <p className="text-xs text-[#6F6F6F] mt-1 font-sans max-w-2xl">
                    Cria e gere cupões promocionais para os teus clientes utilizarem no checkout. Define descontos em percentagem (%), descontos fixos em euros (€) ou portes de envio grátis.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold">
                    <Ticket className="w-3.5 h-3.5 text-purple-600" />
                    <span>{(storeSettings.loyaltySettings?.rewards || []).length} Cupões Configurados</span>
                  </span>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-500 block">Total de Cupões</span>
                    <span className="text-2xl font-serif font-bold text-black">
                      {(storeSettings.loyaltySettings?.rewards || []).length}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-500 block">Cupões Ativos</span>
                    <span className="text-2xl font-serif font-bold text-emerald-700">
                      {(storeSettings.loyaltySettings?.rewards || []).filter((r) => r.enabled).length}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-500 block">Cupões Pausados</span>
                    <span className="text-2xl font-serif font-bold text-neutral-500">
                      {(storeSettings.loyaltySettings?.rewards || []).filter((r) => !r.enabled).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-Tabs: 1. Todos os Cupões & Criar | 2. Envio Automático | 3. Enviar a Cliente */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-neutral-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setCouponSubTab('manage')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    couponSubTab === 'manage'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-700 hover:text-black hover:bg-neutral-200/60'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Todos os Cupões & Criar ({(storeSettings.loyaltySettings?.rewards || []).length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCouponSubTab('auto')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    couponSubTab === 'auto'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-700 hover:text-black hover:bg-neutral-200/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Envio Automático (Novos Membros & 1ª Compra)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCouponSubTab('send')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    couponSubTab === 'send'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-700 hover:text-black hover:bg-neutral-200/60'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 text-purple-400" />
                  <span>Enviar a Cliente Específico ({users.length})</span>
                </button>
              </div>

              {/* SUBTAB 1: MANAGE & CREATE COUPONS */}
              {couponSubTab === 'manage' && (
                <div className="space-y-8">
              <div className="bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-black text-cyan-400 flex items-center justify-center font-bold text-sm">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-black font-semibold">
                        Criar Novo Cupão de Desconto
                      </h3>
                      <p className="text-xs text-[#6F6F6F]">
                        Preenche os dados do cupão que queres disponibilizar aos teus clientes.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateRandomCoupon}
                    className="text-xs text-cyan-700 hover:text-cyan-800 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Gerar Código Aleatório</span>
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const code = newRewardCouponCode.trim().toUpperCase();
                    if (!code) {
                      showNotification('Por favor, insere um código para o cupão.');
                      return;
                    }

                    // Check duplicate code
                    const isDuplicate = (storeSettings.loyaltySettings?.rewards || []).some(
                      (r) => r.couponCode?.toUpperCase() === code
                    );
                    if (isDuplicate) {
                      showNotification(`O código "${code}" já existe. Escolhe outro.`);
                      return;
                    }

                    const val = parseFloat(newRewardDiscountValue) || 0;
                    const minOrder = parseFloat(newRewardMinOrder) || 0;

                    addLoyaltyReward({
                      title: newRewardTitle.trim() || `Cupão ${code}`,
                      description:
                        newRewardDesc.trim() ||
                        (newRewardDiscountType === 'percent'
                          ? `Desconto de ${val}% em toda a encomenda.`
                          : newRewardDiscountType === 'amount'
                          ? `Desconto imediato de ${val}€ no carrinho.`
                          : 'Portes de envio gratuitos na encomenda.'),
                      couponCode: code,
                      discountType: newRewardDiscountType,
                      discountValue: newRewardDiscountType === 'free_shipping' ? 0 : val,
                      minOrderValue: minOrder,
                      enabled: true,
                      pointsCost: 0,
                      tierRequired: 'All',
                    });

                    showNotification(`Cupão "${code}" criado com sucesso!`);
                    setNewRewardTitle('');
                    setNewRewardDesc('');
                    setNewRewardDiscountValue('10');
                    setNewRewardMinOrder('0');
                    setNewRewardCouponCode('VYRO' + Math.floor(Math.random() * 80 + 10));
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
                    {/* Código do Cupão */}
                    <div className="lg:col-span-4">
                      <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
                        Código do Cupão *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Ex: VERAO20"
                          value={newRewardCouponCode}
                          onChange={(e) => setNewRewardCouponCode(e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border rounded-xl bg-white border-neutral-300 focus:outline-none focus:border-black text-purple-700"
                        />
                        <Ticket className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                      </div>
                      <span className="text-[10px] text-neutral-500 mt-1 block">
                        O código que o cliente digita no checkout
                      </span>
                    </div>

                    {/* Nome da Campanha */}
                    <div className="lg:col-span-5">
                      <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
                        Nome / Título da Promoção *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: 20% Desconto de Verão"
                        value={newRewardTitle}
                        onChange={(e) => setNewRewardTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white border-neutral-300 focus:outline-none focus:border-black"
                      />
                      <span className="text-[10px] text-neutral-500 mt-1 block">
                        Exibido ao cliente quando o cupão é aplicado
                      </span>
                    </div>

                    {/* Tipo de Desconto */}
                    <div className="lg:col-span-3">
                      <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
                        Tipo de Benefício *
                      </label>
                      <select
                        value={newRewardDiscountType}
                        onChange={(e) => setNewRewardDiscountType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white border-neutral-300 focus:outline-none focus:border-black font-semibold cursor-pointer"
                      >
                        <option value="percent">Percentagem (%)</option>
                        <option value="amount">Valor Fixo em Euros (€)</option>
                        <option value="free_shipping">Portes de Envio Grátis</option>
                      </select>
                      <span className="text-[10px] text-neutral-500 mt-1 block">
                        Modalidade do desconto
                      </span>
                    </div>

                    {/* Valor do Desconto */}
                    <div className="lg:col-span-3">
                      <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
                        {newRewardDiscountType === 'percent'
                          ? 'Valor do Desconto (%) *'
                          : newRewardDiscountType === 'amount'
                          ? 'Valor do Desconto (€) *'
                          : 'Valor do Desconto'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step={newRewardDiscountType === 'percent' ? '1' : '0.50'}
                          disabled={newRewardDiscountType === 'free_shipping'}
                          placeholder={newRewardDiscountType === 'percent' ? '15' : '5.00'}
                          value={newRewardDiscountType === 'free_shipping' ? '0' : newRewardDiscountValue}
                          onChange={(e) => setNewRewardDiscountValue(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white border-neutral-300 focus:outline-none focus:border-black disabled:bg-neutral-100 disabled:text-neutral-400"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                          {newRewardDiscountType === 'percent' ? '%' : newRewardDiscountType === 'amount' ? '€' : 'Grátis'}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500 mt-1 block">
                        {newRewardDiscountType === 'free_shipping'
                          ? 'Isenta portes automaticamente'
                          : 'Quantia deduzida no total'}
                      </span>
                    </div>

                    {/* Encomenda Mínima */}
                    <div className="lg:col-span-3">
                      <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
                        Encomenda Mínima (€)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          value={newRewardMinOrder}
                          onChange={(e) => setNewRewardMinOrder(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white border-neutral-300 focus:outline-none focus:border-black"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                          €
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500 mt-1 block">
                        0 = sem valor mínimo exigido
                      </span>
                    </div>

                    {/* Descrição Opcional */}
                    <div className="lg:col-span-6">
                      <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
                        Descrição / Condições (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Válido em compras superiores a 30€. Não acumulável."
                        value={newRewardDesc}
                        onChange={(e) => setNewRewardDesc(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white border-neutral-300 focus:outline-none focus:border-black"
                      />
                      <span className="text-[10px] text-neutral-500 mt-1 block">
                        Informação adicional sobre a campanha
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-7 py-3 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
                    >
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Criar Cupão de Desconto</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Lista de Cupões Ativos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-black">
                      Cupões de Desconto da Loja ({(storeSettings.loyaltySettings?.rewards || []).length})
                    </h3>
                    <p className="text-xs text-[#6F6F6F]">
                      Estes cupões estão disponíveis para utilização direta no checkout da loja.
                    </p>
                  </div>
                </div>

                {(storeSettings.loyaltySettings?.rewards || []).length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-neutral-200 text-center space-y-3">
                    <Ticket className="w-10 h-10 text-neutral-300 mx-auto" />
                    <h4 className="font-serif text-lg text-black font-semibold">Nenhum cupão criado ainda</h4>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      Usa o formulário acima para criar o teu primeiro código promocional (ex: 10% de boas-vindas).
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(storeSettings.loyaltySettings?.rewards || []).map((coupon) => {
                      const isCopied = copiedCouponId === coupon.id;
                      return (
                        <div
                          key={coupon.id}
                          className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                            coupon.enabled
                              ? 'bg-white border-neutral-200 shadow-sm hover:border-neutral-300'
                              : 'bg-neutral-50 border-neutral-200/60 opacity-60'
                          }`}
                        >
                          <div>
                            {/* Top header: Code badge + Copy button */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-sm tracking-wider px-3 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200/80">
                                  {coupon.couponCode || 'VYRO-CUPAO'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyCouponCode(coupon.id, coupon.couponCode || '')}
                                  className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                                  title="Copiar código do cupão"
                                >
                                  {isCopied ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>

                              {/* Discount Value Badge */}
                              <span
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                  coupon.discountType === 'percent'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : coupon.discountType === 'free_shipping'
                                    ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {coupon.discountType === 'percent' && `-${coupon.discountValue}%`}
                                {coupon.discountType === 'amount' && `-€${(coupon.discountValue || 0).toFixed(2)}`}
                                {coupon.discountType === 'free_shipping' && 'Portes Grátis'}
                              </span>
                            </div>

                            {/* Coupon Title */}
                            <h4 className="font-serif text-base font-semibold text-black leading-snug">
                              {coupon.title}
                            </h4>

                            {/* Description */}
                            {coupon.description && (
                              <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                                {coupon.description}
                              </p>
                            )}

                            {/* Min order requirement */}
                            <div className="mt-3.5 pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 flex items-center justify-between">
                              <span>Condição:</span>
                              <strong className="text-neutral-700 font-semibold">
                                {coupon.minOrderValue && coupon.minOrderValue > 0
                                  ? `Mínimo de €${coupon.minOrderValue.toFixed(2)}`
                                  : 'Sem valor mínimo'}
                              </strong>
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                updateLoyaltyReward(coupon.id, { enabled: !coupon.enabled });
                                showNotification(
                                  `Cupão "${coupon.couponCode}" ${!coupon.enabled ? 'ativado' : 'pausado'} com sucesso!`
                                );
                              }}
                              className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                                coupon.enabled
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-neutral-100 text-neutral-500 border-neutral-300'
                              }`}
                            >
                              {coupon.enabled ? 'Ativo' : 'Pausado'}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  confirm(
                                    `Tens a certeza de que queres eliminar o cupão "${coupon.couponCode}"?`
                                  )
                                ) {
                                  deleteLoyaltyReward(coupon.id);
                                  showNotification(`Cupão "${coupon.couponCode}" eliminado.`);
                                }
                              }}
                              className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Eliminar Cupão"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUBTAB 2: AUTOMATIC COUPONS (WELCOME & FIRST ORDER) */}
          {couponSubTab === 'auto' && (
            <div className="space-y-6">
              <div className="bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200">
                <div className="flex items-center gap-2.5 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="font-serif text-xl text-black font-semibold">
                    Regras de Atribuição Automática de Cupões
                  </h3>
                </div>
                <p className="text-xs text-[#6F6F6F] mb-8 max-w-2xl leading-relaxed">
                  Ativa a entrega automática de cupões para novos registos e para clientes que finalizam a sua 1ª compra. Os cupões ficam automaticamente guardados na carteira do utilizador e aparecem prontos a usar no checkout.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 1. Welcome Coupon */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-serif text-base text-black font-semibold">
                            Cupão de Boas-Vindas
                          </h4>
                          <span className="text-[11px] text-neutral-500">
                            Atribuído ao criar conta
                          </span>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={welcomeCouponEnabled}
                          onChange={(e) => setWelcomeCouponEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Quando um novo utilizador cria conta na loja, este cupão é automaticamente associado à sua conta para incentivar a 1ª compra.
                    </p>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-neutral-700 tracking-wider block mb-1.5">
                        Cupão a Atribuir:
                      </label>
                      <select
                        disabled={!welcomeCouponEnabled}
                        value={welcomeCouponCode}
                        onChange={(e) => setWelcomeCouponCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black disabled:bg-neutral-100 disabled:text-neutral-400 cursor-pointer"
                      >
                        {(storeSettings.loyaltySettings?.rewards || []).map((r) => (
                          <option key={r.id} value={r.couponCode}>
                            {r.couponCode} — {r.title} ({r.discountType === 'percent' ? `-${r.discountValue}%` : r.discountType === 'free_shipping' ? 'Portes Grátis' : `-€${r.discountValue}`})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 2. First Order Completed Coupon */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-serif text-base text-black font-semibold">
                            Cupão de 1ª Compra Concluída
                          </h4>
                          <span className="text-[11px] text-neutral-500">
                            Atribuído após 1º pedido
                          </span>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={firstOrderCouponEnabled}
                          onChange={(e) => setFirstOrderCouponEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Assim que o cliente conclui a sua 1ª compra com sucesso, este cupão é creditado na conta dele para a próxima encomenda.
                    </p>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-neutral-700 tracking-wider block mb-1.5">
                        Cupão a Atribuir:
                      </label>
                      <select
                        disabled={!firstOrderCouponEnabled}
                        value={firstOrderCouponCode}
                        onChange={(e) => setFirstOrderCouponCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black disabled:bg-neutral-100 disabled:text-neutral-400 cursor-pointer"
                      >
                        {(storeSettings.loyaltySettings?.rewards || []).map((r) => (
                          <option key={r.id} value={r.couponCode}>
                            {r.couponCode} — {r.title} ({r.discountType === 'percent' ? `-${r.discountValue}%` : r.discountType === 'free_shipping' ? 'Portes Grátis' : `-€${r.discountValue}`})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-200/80 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      updateAutomaticCoupons({
                        welcomeCouponEnabled,
                        welcomeCouponCode,
                        firstOrderCouponEnabled,
                        firstOrderCouponCode,
                      });
                      showNotification('Regras de envio automático de cupões guardadas com sucesso!');
                    }}
                    className="px-7 py-3 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
                  >
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>Guardar Regras Automáticas</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: SEND COUPON TO SPECIFIC CLIENT */}
          {couponSubTab === 'send' && (
            <div className="space-y-8">
              {/* Send Form Card */}
              <div className="bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-black font-semibold">
                      Enviar Cupão para um Cliente Específico
                    </h3>
                    <p className="text-xs text-[#6F6F6F]">
                      Escolhe o cliente e o cupão pretendido. O cupão será imediatamente creditado na carteira de cupões da conta do cliente.
                    </p>
                  </div>
                </div>

                {users.length === 0 ? (
                  <div className="bg-white p-6 rounded-2xl border border-neutral-200 text-center text-xs text-neutral-500">
                    Ainda não existem clientes registados na loja.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
                    {/* Client Selector */}
                    <div className="lg:col-span-6">
                      <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
                        Selecionar Cliente *
                      </label>
                      <select
                        value={targetUserId || (users[0]?.id || '')}
                        onChange={(e) => setTargetUserId(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black cursor-pointer"
                      >
                        {users.map((u) => {
                          const activeVouchers = (u.redeemedVouchers || []).filter((v) => !v.isUsed).length;
                          return (
                            <option key={u.id} value={u.id}>
                              {u.name} — {u.email} ({activeVouchers} {activeVouchers === 1 ? 'cupão ativo' : 'cupões ativos'})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Coupon Selector */}
                    <div className="lg:col-span-6">
                      <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
                        Selecionar Cupão da Loja *
                      </label>
                      <select
                        value={targetCouponCode || (storeSettings.loyaltySettings?.rewards?.[0]?.couponCode || '')}
                        onChange={(e) => setTargetCouponCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black cursor-pointer"
                      >
                        {(storeSettings.loyaltySettings?.rewards || []).map((r) => (
                          <option key={r.id} value={r.couponCode}>
                            {r.couponCode} — {r.title} ({r.discountType === 'percent' ? `-${r.discountValue}%` : r.discountType === 'free_shipping' ? 'Portes Grátis' : `-€${r.discountValue}`})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Action Button */}
                    <div className="lg:col-span-12 flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const uId = targetUserId || users[0]?.id;
                          const cCode = targetCouponCode || storeSettings.loyaltySettings?.rewards?.[0]?.couponCode;
                          if (!uId || !cCode) {
                            showNotification('Seleciona o cliente e o cupão a atribuir.');
                            return;
                          }

                          const targetUser = users.find((u) => u.id === uId);
                          const matchedReward = (storeSettings.loyaltySettings?.rewards || []).find(
                            (r) => r.couponCode?.toUpperCase() === cCode.toUpperCase()
                          );

                          if (!targetUser || !matchedReward) {
                            showNotification('Dados inválidos para atribuição.');
                            return;
                          }

                          assignCouponToUser(uId, {
                            code: matchedReward.couponCode || cCode,
                            title: matchedReward.title,
                            discountType: matchedReward.discountType || 'percent',
                            discountValue: matchedReward.discountValue ?? 10,
                          });

                          showNotification(
                            `Cupão "${matchedReward.couponCode}" atribuído com sucesso a ${targetUser.name} (${targetUser.email})!`
                          );
                        }}
                        className="px-7 py-3 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
                      >
                        <Send className="w-4 h-4 text-cyan-400" />
                        <span>Atribuir Cupão a este Cliente</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Clients and their assigned vouchers list */}
              <div className="space-y-4">
                <h4 className="font-serif text-xl text-black font-semibold">
                  Clientes Registados & Cupões Atribuídos ({users.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.map((u) => {
                    const activeVouchers = (u.redeemedVouchers || []).filter((v) => !v.isUsed);
                    const usedVouchers = (u.redeemedVouchers || []).filter((v) => v.isUsed);

                    return (
                      <div
                        key={u.id}
                        className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm text-black">{u.name}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {new Date(u.createdAt).toLocaleDateString('pt-PT')}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-500 block mb-3">{u.email}</span>

                          {/* Vouchers list for this user */}
                          <div className="space-y-2">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                              Cupões na Conta ({activeVouchers.length} ativos):
                            </span>

                            {activeVouchers.length === 0 ? (
                              <span className="text-xs text-neutral-400 italic block">
                                Nenhum cupão ativo no momento.
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {activeVouchers.map((v) => (
                                  <span
                                    key={v.id}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 font-mono text-xs font-bold"
                                  >
                                    <Ticket className="w-3 h-3 text-purple-600" />
                                    <span>{v.code}</span>
                                    <span className="text-[10px] text-purple-600 font-sans font-normal">
                                      ({v.discountType === 'percent' ? `-${v.discountValue}%` : `-€${v.discountValue}`})
                                    </span>
                                  </span>
                                ))}
                              </div>
                            )}

                            {usedVouchers.length > 0 && (
                              <div className="pt-2 text-[10px] text-neutral-400">
                                <span>Já utilizou {usedVouchers.length} {usedVouchers.length === 1 ? 'cupão' : 'cupões'}: </span>
                                <span className="font-mono line-through">
                                  {usedVouchers.map((v) => v.code).join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick Add Button */}
                        <div className="pt-3 border-t border-neutral-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setTargetUserId(u.id);
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }}
                            className="text-xs text-cyan-700 hover:text-cyan-800 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Selecionar para atribuir novo cupão</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

          {/* TAB 5: SALES METRICS & E-COMMERCE INTELLIGENCE */}
          {activeTab === 'stats' && (
            <div className="space-y-10 max-w-5xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Painel Financeiro & Vendas</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-black">
                    Métricas de Vendas VYRO
                  </h2>
                  <p className="text-xs text-[#6F6F6F] mt-1 font-sans">
                    Monitorização em tempo real de receita comercial, volume de encomendas e modelos de meias com maior tração.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-semibold">
                    <Package className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{products.length} Modelos Ativos</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold">
                    <Layers className="w-3.5 h-3.5 text-neutral-600" />
                    <span>{categories.length} Categorias</span>
                  </span>
                </div>
              </div>

              {/* 4 PRIMARY SALES KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 1: Faturação Total */}
                <div className="p-6 rounded-3xl bg-neutral-900 text-white relative overflow-hidden shadow-lg border border-neutral-800">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Faturação Total
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl text-white font-normal">
                    €{totalRevenue.toFixed(2)}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +28.4%
                    </span>
                    <span className="text-neutral-400 text-[11px]">vs mês anterior</span>
                  </div>
                </div>

                {/* Card 2: Encomendas Concluídas */}
                <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Encomendas
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl text-black font-normal">
                    {totalOrdersCount}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-medium">100% Pagamentos validados</span>
                  </div>
                </div>

                {/* Card 3: Pares de Meias Vendidos */}
                <div className="p-6 rounded-3xl bg-cyan-50/60 border border-cyan-200 shadow-sm text-cyan-950">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">
                      Pares Vendidos
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center border border-cyan-300/60">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-normal text-cyan-950">
                    {totalPairsSold} <span className="text-lg font-sans font-medium text-cyan-800">pares</span>
                  </div>
                  <div className="mt-3 text-[11px] text-cyan-800 font-medium">
                    Média de {(totalPairsSold / (totalOrdersCount || 1)).toFixed(1)} pares por pedido
                  </div>
                </div>

                {/* Card 4: Ticket Médio */}
                <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 shadow-sm text-emerald-950">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      Ticket Médio
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300/60">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-normal text-emerald-950">
                    €{avgOrderValue.toFixed(2)}
                  </div>
                  <div className="mt-3 text-[11px] text-emerald-800 font-medium">
                    Portes grátis a partir de €{storeSettings.freeShippingThreshold.toFixed(0)}
                  </div>
                </div>
              </div>

              {/* SALES ANALYSIS GRID: TOP PRODUCTS & PAYMENT METHODS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Ranking das Meias Mais Vendidas */}
                <div className="lg:col-span-7 bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-200">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-cyan-600" />
                      <h3 className="font-serif text-2xl text-black">
                        Meias Mais Vendidas (Ranking)
                      </h3>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-medium">Por pares vendidos</span>
                  </div>

                  {topSellingProducts.length === 0 ? (
                    <p className="text-xs text-neutral-500 py-6 text-center">Nenhuma venda registada até ao momento.</p>
                  ) : (
                    <div className="space-y-4">
                      {topSellingProducts.slice(0, 5).map((item, idx) => {
                        const percentOfMax = Math.round((item.count / maxProductSold) * 100);
                        return (
                          <div
                            key={item.name}
                            className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                  #{idx + 1}
                                </div>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 object-cover rounded-xl border border-neutral-200 shrink-0"
                                />
                                <div>
                                  <h4 className="font-bold text-xs text-black">{item.name}</h4>
                                  <span className="text-[10px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                                    {item.category}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-bold text-xs text-black block">
                                  {item.count} {item.count === 1 ? 'par' : 'pares'}
                                </span>
                                <span className="text-[11px] text-neutral-500 font-mono">
                                  €{item.revenue.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${percentOfMax}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Métodos de Pagamento & Resumo Operacional */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {/* Payment Breakdown Card */}
                  <div className="bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-200 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-cyan-600" />
                      <h3 className="font-serif text-2xl text-black">
                        Métodos de Pagamento
                      </h3>
                    </div>
                    <p className="text-xs text-[#6F6F6F] mb-6">
                      Preferência de pagamento dos clientes nas encomendas concluídas.
                    </p>

                    <div className="space-y-4">
                      {/* MB WAY */}
                      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 font-bold text-xs text-black">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                            <span>MB WAY</span>
                          </div>
                          <div className="text-xs font-bold text-neutral-800">
                            {paymentStats.mbway} ({totalOrdersCount > 0 ? Math.round((paymentStats.mbway / totalOrdersCount) * 100) : 0}%)
                          </div>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full rounded-full"
                            style={{
                              width: `${totalOrdersCount > 0 ? (paymentStats.mbway / totalOrdersCount) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Multibanco */}
                      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 font-bold text-xs text-black">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                            <span>Referência Multibanco</span>
                          </div>
                          <div className="text-xs font-bold text-neutral-800">
                            {paymentStats.multibanco} ({totalOrdersCount > 0 ? Math.round((paymentStats.multibanco / totalOrdersCount) * 100) : 0}%)
                          </div>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{
                              width: `${totalOrdersCount > 0 ? (paymentStats.multibanco / totalOrdersCount) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Cartão de Crédito */}
                      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 font-bold text-xs text-black">
                            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                            <span>Cartão de Débito / Crédito</span>
                          </div>
                          <div className="text-xs font-bold text-neutral-800">
                            {paymentStats.card} ({totalOrdersCount > 0 ? Math.round((paymentStats.card / totalOrdersCount) * 100) : 0}%)
                          </div>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-neutral-800 h-full rounded-full"
                            style={{
                              width: `${totalOrdersCount > 0 ? (paymentStats.card / totalOrdersCount) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operação de Expedição */}
                  <div className="bg-cyan-50/70 rounded-3xl p-6 border border-cyan-200/80">
                    <div className="flex items-center gap-2 mb-3 text-cyan-900 font-bold text-xs uppercase tracking-wider">
                      <Truck className="w-4 h-4 text-cyan-600" />
                      <span>Política de Envios Ativa</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-cyan-200/60">
                        <span className="text-[10px] text-neutral-400 font-semibold block">Envio Grátis</span>
                        <span className="font-bold text-black text-sm">A partir de €{storeSettings.freeShippingThreshold.toFixed(2)}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-cyan-200/60">
                        <span className="text-[10px] text-neutral-400 font-semibold block">Portes Padrão</span>
                        <span className="font-bold text-black text-sm">€{storeSettings.shippingCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT ORDERS TABLE */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-black" />
                    <h3 className="font-serif text-2xl text-black">
                      Registo de Encomendas Recentes ({orders.length})
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">
                    Histórico de compras e detalhes de expedição
                  </span>
                </div>

                <div className="overflow-x-auto border border-neutral-200 rounded-3xl bg-white shadow-sm">
                  <table className="w-full text-left text-xs text-neutral-600">
                    <thead className="bg-neutral-50 text-neutral-800 font-bold uppercase text-[10px] tracking-wider border-b border-neutral-200">
                      <tr>
                        <th className="p-4">Encomenda</th>
                        <th className="p-4">Cliente / Destino</th>
                        <th className="p-4">Meias Encomendadas</th>
                        <th className="p-4">Método</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Data</th>
                        <th className="p-4 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="p-4 font-mono font-bold text-black text-xs">
                            {order.id}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-black">{order.customerName}</div>
                            <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-cyan-600" />
                              <span>{order.customerCity}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              {order.items.map((item, iIdx) => (
                                <div key={iIdx} className="flex items-center gap-1.5 text-[11px]">
                                  <span className="font-semibold text-black">{item.quantity}x</span>
                                  <span className="text-neutral-700 truncate max-w-[160px]">{item.productName}</span>
                                  <span className="text-neutral-400 text-[10px]">({item.size})</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="uppercase font-semibold text-[10px] px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700">
                              {order.paymentMethod === 'mbway'
                                ? 'MB WAY'
                                : order.paymentMethod === 'multibanco'
                                ? 'Multibanco'
                                : 'Cartão'}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-sm text-black">
                            €{order.totalAmount.toFixed(2)}
                          </td>
                          <td className="p-4 text-neutral-500 text-[11px]">
                            {new Date(order.createdAt).toLocaleDateString('pt-PT', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="p-4 text-right">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{order.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
