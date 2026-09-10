import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
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
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GuaranteeBadge, ProductColor } from '../types/store';

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
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
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
  } = useStore();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isAdmin]);

  // Login form state
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Dashboard active tab
  const [activeTab, setActiveTab] = useState<
    'add-product' | 'list-products' | 'categories' | 'settings' | 'stats'
  >('add-product');
  const [notification, setNotification] = useState<string | null>(null);

  // New Product Form State
  const [prodName, setProdName] = useState('');
  const [prodTagline, setProdTagline] = useState('');
  const [prodCategory, setProdCategory] = useState(categories[0]?.id || '');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodFeatures, setProdFeatures] = useState('Costura plana Seamless\nMalha de fluxo de ar 3D\nCompressão plantar 360°');
  const [prodMaterials, setProdMaterials] = useState('70% Poliamida Q-Skin, 20% CoolMax, 10% Elastano');
  const [prodBadge, setProdBadge] = useState('NOVO');
  const [prodSizes, setProdSizes] = useState<string[]>(['35-38', '39-42', '43-46']);
  const [prodColors, setProdColors] = useState<ProductColor[]>([]);
  const [prodImageUrl, setProdImageUrl] = useState(PRESET_SOCKS_IMAGES[0]);

  // Initialize selected product colors from available colors
  useEffect(() => {
    if (prodColors.length === 0 && storeSettings.availableColors.length > 0) {
      setProdColors(storeSettings.availableColors.slice(0, 3));
    }
  }, [storeSettings.availableColors]);

  // Category Form & Edit State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');

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
    catalogSortBy !== 'newest';

  const resetCatalogFilters = () => {
    setCatalogSearch('');
    setCatalogCategoryFilter('all');
    setCatalogStockFilter('all');
    setCatalogBadgeFilter('all');
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

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    const selectedCatObj = categories.find((c) => c.id === prodCategory) || categories[0];

    addProduct({
      name: prodName,
      tagline: prodTagline || 'Alta performance e conforto biomecânico',
      price: parseFloat(prodPrice),
      originalPrice: prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined,
      categoryId: selectedCatObj.id,
      categoryName: selectedCatObj.name,
      description: prodDescription || 'Meia técnica desenhada para máxima respirabilidade e apoio plantar nas condições mais exigentes.',
      features: prodFeatures.split('\n').filter((f) => f.trim().length > 0),
      materials: prodMaterials,
      sizes: prodSizes.length > 0 ? prodSizes : ['39-42'],
      colors: prodColors.length > 0 ? prodColors : storeSettings.availableColors.slice(0, 3),
      images: [prodImageUrl],
      badge: prodBadge || undefined,
      inStock: true,
    });

    showNotification(`Meia "${prodName}" adicionada com sucesso ao catálogo!`);
    setProdName('');
    setProdTagline('');
    setProdPrice('');
    setProdOriginalPrice('');
    setProdDescription('');
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
            onClick={() => setActiveTab('add-product')}
            className={`flex items-center gap-2 py-2.5 px-5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'add-product'
                ? 'bg-black text-white shadow-md'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Adicionar Nova Meia</span>
          </button>

          <button
            onClick={() => setActiveTab('list-products')}
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
            <span>Gerir Categorias ({categories.length})</span>
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
          {/* TAB 1: ADD PRODUCT */}
          {activeTab === 'add-product' && (
            <div className="max-w-4xl">
              <div className="border-b border-neutral-100 pb-6 mb-8">
                <h2 className="font-serif text-3xl sm:text-4xl text-black">
                  Carregar Novo Produto (Meia Técnica)
                </h2>
                <p className="text-xs text-[#6F6F6F] mt-1.5 font-sans">
                  Preencha os dados da meia utilizando as cores, tamanhos e badges configurados.
                </p>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-6">
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
                      className="w-full px-4 py-3 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
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
                      className="w-full px-4 py-3 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black cursor-pointer"
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
                          onClick={() => setProdBadge(b)}
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
                      className="w-full px-4 py-3 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
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
                      className="w-full px-4 py-3 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                    />
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

                {/* Image URL & Preset Selection */}
                <div className="pt-2">
                  <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider block mb-1.5">
                    URL da Imagem da Meia
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={prodImageUrl}
                    onChange={(e) => setProdImageUrl(e.target.value)}
                    className="w-full px-4 py-3 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                  />
                  <div className="mt-3">
                    <span className="text-[11px] text-neutral-500 font-semibold">
                      Ou escolha uma fotografia modelo com 1 clique:
                    </span>
                    <div className="flex gap-3 mt-2 overflow-x-auto pb-2">
                      {PRESET_SOCKS_IMAGES.map((img, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setProdImageUrl(img)}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                            prodImageUrl === img
                              ? 'border-cyan-500 ring-4 ring-cyan-100 shadow-md scale-105'
                              : 'border-neutral-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
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

                <div className="pt-6 border-t border-neutral-200 flex justify-end gap-3">
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 hover:scale-[1.02] transition-all shadow-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-cyan-400" />
                    <span>Publicar Meia no Catálogo</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: LIST PRODUCTS WITH ADVANCED FILTERS */}
          {activeTab === 'list-products' && (
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
                    onClick={() => setActiveTab('add-product')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-cyan-400" />
                    <span>Novo Modelo</span>
                  </button>
                </div>
              </div>

              {/* QUICK CATEGORY PILLS BAR */}
              <div className="flex flex-wrap items-center gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => setCatalogCategoryFilter('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    catalogCategoryFilter === 'all'
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Todas ({products.length})
                </button>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.categoryId === cat.id).length;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCatalogCategoryFilter(cat.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        catalogCategoryFilter === cat.id
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
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                          <td className="p-4 flex items-center gap-3.5">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-black">{p.name}</div>
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
                            <button
                              onClick={() => {
                                updateProduct(p.id, { inStock: !p.inStock });
                                showNotification(`Estado de stock de "${p.name}" alterado.`);
                              }}
                              className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors shadow-xs ${
                                p.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                            >
                              {p.inStock ? 'Em Stock ✓' : 'Esgotado ✕'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <button
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CATEGORIES (GERIR, CRIAR, EDITAR E APAGAR) */}
          {activeTab === 'categories' && (
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
