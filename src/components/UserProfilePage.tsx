import React, { useState } from 'react';
import {
  User,
  Heart,
  Package,
  MapPin,
  Award,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  ShoppingBag,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Gift,
  Save,
  Trash2,
  Target,
  Ticket,
  Copy,
  Check,
  Zap,
  Mail,
  UserCheck,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { Product, LoyaltyGoal } from '../types/store';

interface UserProfilePageProps {
  onBackToStore: () => void;
  onOpenProductDetail: (product: Product) => void;
  initialTab?: 'overview' | 'orders' | 'favorites' | 'profile' | 'rewards' | 'coupons';
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  onBackToStore,
  onOpenProductDetail,
  initialTab = 'overview',
}) => {
  const { currentUser, logout, updateProfile, toggleFavorite, claimGoal, redeemReward } = useUser();
  const { products, orders, storeSettings } = useStore();
  const { addItem, setIsCartOpen } = useCart();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'favorites' | 'profile' | 'rewards' | 'coupons'>(initialTab);
  const [copiedVoucherCode, setCopiedVoucherCode] = useState<string | null>(null);
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);

  // Form states for profile editing
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [nif, setNif] = useState(currentUser?.nif || '');
  const [street, setStreet] = useState(currentUser?.address?.street || '');
  const [city, setCity] = useState(currentUser?.address?.city || '');
  const [postalCode, setPostalCode] = useState(currentUser?.address?.postalCode || '');
  const [preferredSize, setPreferredSize] = useState(currentUser?.preferredSize || '39-42');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-neutral-200 text-center">
          <User className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold text-black mb-2">Sessão não iniciada</h2>
          <p className="text-xs text-neutral-500 mb-6">Inicia sessão para consultar as tuas compras e favoritos.</p>
          <button
            onClick={onBackToStore}
            className="w-full py-3 bg-black text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Voltar à Loja
          </button>
        </div>
      </div>
    );
  }

  // Filter orders made by this user (by email or customer name)
  const userOrders = orders.filter(
    (o) => o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase()
  );

  // Get favorite products
  const favoriteProducts = products.filter((p) =>
    currentUser.favoriteProductIds.includes(p.id)
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      nif,
      preferredSize,
      address: {
        street,
        city,
        postalCode,
        country: 'Portugal',
      },
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleAddToCartFromFavorites = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const size = currentUser.preferredSize || product.sizes[0] || '39-42';
    const color = product.colors[0] || { name: 'Padrão', hex: '#000000' };
    addItem(product, size, color, 1);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Top Banner & Navigation Header */}
      <div className="bg-neutral-900 text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToStore}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Loja</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-serif text-white font-semibold">
                      {currentUser.name}
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {currentUser.tier}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{currentUser.email}</p>
                </div>
              </div>
            </div>

            {/* Actions: Points badge & Logout */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-neutral-300">Saldo:</span>
                <span className="font-bold text-cyan-400">{currentUser.points || 0} pts</span>
              </div>

              <button
                onClick={() => {
                  logout();
                  onBackToStore();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
                title="Terminar Sessão"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-neutral-800 text-xs no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Encomendas ({userOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Favoritos ({favoriteProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Morada & Dados</span>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'rewards'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Clube VYRO</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'coupons'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Os Meus Cupões ({((currentUser.redeemedVouchers as any[]) || []).filter((v) => !v.isUsed).length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick KPI stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium">Encomendas Realizadas</p>
                  <p className="text-2xl font-serif font-bold text-black">{userOrders.length}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium">Artigos Favoritos</p>
                  <p className="text-2xl font-serif font-bold text-black">{favoriteProducts.length}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium">Pontos VYRO</p>
                  <p className="text-2xl font-serif font-bold text-black">{currentUser.points || 0}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium">Nível de Atleta</p>
                  <p className="text-base font-serif font-bold text-black truncate">{currentUser.tier}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders teaser */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-semibold text-black">Últimas Encomendas</h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 flex items-center gap-1"
                >
                  <span>Ver todas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {userOrders.length === 0 ? (
                <div className="py-8 text-center text-neutral-400 text-xs">
                  Ainda não realizaste compras. Explora o nosso catálogo de meias de alta performance!
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.slice(0, 2).map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-black">{order.id}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('pt-PT')} • {order.items.length} {order.items.length === 1 ? 'artigo' : 'artigos'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="font-serif font-bold text-black text-sm">
                          €{order.totalAmount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Favorite teaser preview */}
            {favoriteProducts.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl font-semibold text-black">Os Teus Favoritos</h2>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 flex items-center gap-1"
                  >
                    <span>Ver todos ({favoriteProducts.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {favoriteProducts.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onOpenProductDetail(p)}
                      className="group cursor-pointer rounded-2xl border border-neutral-200/80 p-2.5 hover:shadow-md transition-all"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-2">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="text-xs font-serif text-black font-medium line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-xs font-bold text-neutral-900 mt-0.5">
                        €{p.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-black">Histórico de Encomendas</h2>
                <p className="text-xs text-neutral-500">Consulta todas as tuas compras e o estado de envio.</p>
              </div>
            </div>

            {userOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-medium text-black">Nenhuma encomenda encontrada</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Quando finalizares a tua primeira compra, poderás acompanhar aqui todo o processo de preparação e envio.
                </p>
                <button
                  onClick={onBackToStore}
                  className="mt-6 px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs"
                  >
                    {/* Order header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-black">{order.id}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-cyan-600" />
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          Data: {new Date(order.createdAt).toLocaleDateString('pt-PT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-neutral-400 block">Total da Encomenda</span>
                        <span className="font-serif text-xl font-bold text-black">
                          €{order.totalAmount.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">
                          Método: {order.paymentMethod.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="pt-4 divide-y divide-neutral-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                              <ShoppingBag className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-black">{item.productName}</p>
                              <p className="text-[11px] text-neutral-500">
                                Tam: {item.size} • Cor: {item.colorName} • Qtd: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right font-medium text-neutral-900">
                            €{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping note */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-cyan-600" />
                        Envio Expresso 24/48h CTT Expresso
                      </span>
                      <span>Destino: {order.customerCity}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-black">Os Teus Artigos Favoritos</h2>
              <p className="text-xs text-neutral-500">Guarda os teus modelos preferidos para encomendares quando quiseres.</p>
            </div>

            {favoriteProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200">
                <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-medium text-black">Ainda não tens favoritos</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Clica no ícone de coração em qualquer meia do catálogo para a adicionares à tua lista de desejos.
                </p>
                <button
                  onClick={onBackToStore}
                  className="mt-6 px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors"
                >
                  Ver Catálogo de Meias
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onOpenProductDetail(product)}
                    className="group bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        title="Remover dos favoritos"
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-rose-500 shadow-sm transition-colors"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-600">
                          {product.categoryName}
                        </span>
                        <h3 className="font-serif text-lg font-medium text-black mt-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                          {product.tagline}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <span className="font-serif font-bold text-base text-black">
                          €{product.price.toFixed(2)}
                        </span>

                        <button
                          onClick={(e) => handleAddToCartFromFavorites(e, product)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Adicionar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE & ADDRESS */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
            <h2 className="font-serif text-2xl font-semibold text-black mb-1">Dados Pessoais & Morada</h2>
            <p className="text-xs text-neutral-500 mb-6">
              Estes dados serão utilizados para preencher automaticamente o checkout das tuas encomendas.
            </p>

            {savedNotice && (
              <div className="mb-6 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dados atualizados com sucesso!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Email (Conta)</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3 py-2.5 text-xs bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Telemóvel</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="912 345 678"
                    className="w-full px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">NIF (Para Fatura)</label>
                  <input
                    type="text"
                    value={nif}
                    onChange={(e) => setNif(e.target.value)}
                    placeholder="254 896 321"
                    className="w-full px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Morada de Entrega</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Rua, Avenida, Número, Andar"
                  className="w-full px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lisboa / Porto..."
                    className="w-full px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Código Postal</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="1200-000"
                    className="w-full px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Tamanho de Meias Habitual
                </label>
                <select
                  value={preferredSize}
                  onChange={(e) => setPreferredSize(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="35-38">35-38</option>
                  <option value="39-42">39-42 (Padrão)</option>
                  <option value="43-46">43-46</option>
                  <option value="47-50">47-50</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: REWARDS & VYRO CLUB */}
        {activeTab === 'rewards' && (
          <div className="space-y-8">
            {/* Notification alert for goal claimed or reward redeemed */}
            {rewardNotice && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-sm animate-fade-rise text-xs font-semibold">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{rewardNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRewardNotice(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Club Hero Card */}
            <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-black text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-neutral-800 shadow-xl">
              <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      VYRO Kinetic Club
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold mt-3 mb-1">
                      O Teu Estatuto de Atleta
                    </h2>
                    <p className="text-xs text-neutral-400 max-w-lg">
                      Acumula pontos em cada treino ou compra ({storeSettings.loyaltySettings?.pointsPerEuro || 10} pts por cada 1€), cumpre metas de atleta e desbloqueia cupões e meias de edições limitadas.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-5 sm:self-start">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">Saldo Atual</span>
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-cyan-400">
                        {currentUser.points || 0}
                      </span>
                      <span className="text-xs text-neutral-400 ml-1">pts</span>
                    </div>

                    <div className="h-10 w-px bg-white/10" />

                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">Nível Atual</span>
                      <span className="font-semibold text-white text-sm block">{currentUser.tier}</span>
                      <span className="text-[10px] text-emerald-400">Ativo</span>
                    </div>
                  </div>
                </div>

                {/* Tier Progress Bar */}
                <div className="mt-6 pt-6 border-t border-neutral-800/80">
                  {(() => {
                    const silverLimit = storeSettings.loyaltySettings?.silverTierThreshold || 400;
                    const proLimit = storeSettings.loyaltySettings?.proTierThreshold || 1000;
                    const currentPts = currentUser.points || 0;

                    let nextTierName = 'Silver Athlete';
                    let targetPts = silverLimit;
                    let percent = Math.min(100, Math.round((currentPts / silverLimit) * 100));

                    if (currentPts >= proLimit) {
                      nextTierName = 'Pro Kinetic Máximo';
                      targetPts = proLimit;
                      percent = 100;
                    } else if (currentPts >= silverLimit) {
                      nextTierName = 'Pro Kinetic';
                      targetPts = proLimit;
                      percent = Math.min(100, Math.round(((currentPts - silverLimit) / (proLimit - silverLimit)) * 100));
                    }

                    return (
                      <div>
                        <div className="flex justify-between items-center text-xs text-neutral-400 mb-2 font-medium">
                          <span>Progresso para <strong>{nextTierName}</strong></span>
                          <span>
                            {currentPts >= proLimit
                              ? 'Estatuto de topo alcançado!'
                              : `${currentPts} / ${targetPts} pts (faltam ${Math.max(0, targetPts - currentPts)} pts)`}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* SECTION 1: METAS & DESAFIOS (Ganha Pontos) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold uppercase tracking-wider">
                    <Target className="w-4 h-4" />
                    <span>Desafios & Metas</span>
                  </div>
                  <h3 className="font-serif text-2xl text-black font-semibold mt-0.5">
                    Metas para Acumular Pontos
                  </h3>
                </div>
                <span className="text-xs text-neutral-500">
                  {(currentUser.completedGoalIds || []).length} de {(storeSettings.loyaltySettings?.goals || []).filter((g) => g.enabled).length} concluídas
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(storeSettings.loyaltySettings?.goals || [])
                  .filter((g) => g.enabled)
                  .map((goal) => {
                    const isClaimed = (currentUser.completedGoalIds || []).includes(goal.id);
                    let isReady = false;
                    let progressText = '';

                    switch (goal.type) {
                      case 'first_order':
                        isReady = userOrders.length >= 1;
                        progressText = `${Math.min(userOrders.length, 1)} / 1 encomenda`;
                        break;
                      case 'order_count':
                        const targetOrders = goal.targetValue || 3;
                        isReady = userOrders.length >= targetOrders;
                        progressText = `${userOrders.length} / ${targetOrders} encomendas`;
                        break;
                      case 'min_spend':
                        const targetSpend = goal.targetValue || 50;
                        const maxSpend = userOrders.reduce((m, o) => Math.max(m, o.totalAmount), 0);
                        isReady = maxSpend >= targetSpend;
                        progressText = `Compra máx: €${maxSpend.toFixed(2)} / €${targetSpend.toFixed(2)}`;
                        break;
                      case 'complete_profile':
                        isReady = !!(currentUser.preferredSize && currentUser.address?.city && currentUser.phone);
                        progressText = isReady ? 'Perfil 100% Completo' : 'Falta morada ou tamanho';
                        break;
                      case 'favorites_count':
                        const targetFavs = goal.targetValue || 3;
                        isReady = currentUser.favoriteProductIds.length >= targetFavs;
                        progressText = `${currentUser.favoriteProductIds.length} / ${targetFavs} guardados`;
                        break;
                      case 'newsletter':
                        isReady = true;
                        progressText = 'Disponível para subscrição';
                        break;
                      default:
                        isReady = true;
                        progressText = 'Desafio de Atleta';
                    }

                    return (
                      <div
                        key={goal.id}
                        className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
                          isClaimed
                            ? 'bg-neutral-50/80 border-neutral-200 opacity-80'
                            : isReady
                            ? 'bg-gradient-to-b from-cyan-50/70 to-white border-cyan-300 shadow-md ring-1 ring-cyan-200'
                            : 'bg-white border-neutral-200/90 shadow-2xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="w-10 h-10 rounded-2xl bg-cyan-100/60 border border-cyan-200 text-cyan-800 flex items-center justify-center">
                              {goal.icon === 'zap' && <Zap className="w-5 h-5 text-amber-500" />}
                              {goal.icon === 'heart' && <Heart className="w-5 h-5 text-rose-500" />}
                              {goal.icon === 'shopping-bag' && <ShoppingBag className="w-5 h-5 text-cyan-600" />}
                              {goal.icon === 'user-check' && <UserCheck className="w-5 h-5 text-blue-600" />}
                              {goal.icon === 'award' && <Award className="w-5 h-5 text-amber-600" />}
                              {goal.icon === 'mail' && <Mail className="w-5 h-5 text-cyan-600" />}
                              {(!goal.icon || goal.icon === 'sparkles') && <Sparkles className="w-5 h-5 text-cyan-600" />}
                            </div>

                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                              +{goal.pointsReward} Pts
                            </span>
                          </div>

                          <h4 className="font-serif text-base font-semibold text-black mb-1">
                            {goal.title}
                          </h4>
                          <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                            {goal.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-neutral-100">
                          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-2">
                            <span>Estado:</span>
                            <span className="font-semibold text-neutral-700">{progressText}</span>
                          </div>

                          {isClaimed ? (
                            <div className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200">
                              <Check className="w-4 h-4" />
                              <span>Concluído & Recompensado</span>
                            </div>
                          ) : isReady ? (
                            <button
                              type="button"
                              onClick={() => {
                                const res = claimGoal(goal.id, goal.pointsReward);
                                setRewardNotice(res.message);
                              }}
                              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Reivindicar +{goal.pointsReward} Pontos</span>
                            </button>
                          ) : (
                            <div className="w-full py-2 bg-neutral-100 text-neutral-500 rounded-xl text-xs font-medium text-center">
                              Meta em Progresso
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* SECTION 2: OFERTAS & CUPÕES RESGATÁVEIS */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
                  <Gift className="w-4 h-4" />
                  <span>Recompensas do Clube</span>
                </div>
                <h3 className="font-serif text-2xl text-black font-semibold mt-0.5">
                  Ofertas & Cupões Resgatáveis com Pontos
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(storeSettings.loyaltySettings?.rewards || [])
                  .filter((r) => r.enabled)
                  .map((reward) => {
                    const currentPts = currentUser.points || 0;
                    const hasEnough = currentPts >= reward.pointsCost;

                    return (
                      <div
                        key={reward.id}
                        className="bg-white p-5 rounded-3xl border border-neutral-200/90 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-900 border border-cyan-200">
                              {reward.pointsCost} Pontos
                            </span>

                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                              {reward.tierRequired === 'Pro Kinetic'
                                ? 'Exclusivo Pro'
                                : reward.tierRequired === 'Silver Athlete'
                                ? 'Silver+'
                                : 'Todos os Níveis'}
                            </span>
                          </div>

                          <h4 className="font-serif text-lg font-semibold text-black mt-2">
                            {reward.title}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-1">{reward.description}</p>

                          <div className="mt-4 p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-neutral-400 block uppercase font-bold">Vantagem</span>
                              <span className="font-semibold text-neutral-800">
                                {reward.discountType === 'percent' && `${reward.discountValue}% de Desconto`}
                                {reward.discountType === 'amount' && `-${reward.discountValue}€ Diretos`}
                                {reward.discountType === 'free_shipping' && 'Portes de Envio Grátis'}
                                {reward.discountType === 'free_product' && 'Par de Meias Grátis'}
                              </span>
                            </div>

                            <span className="text-[10px] font-mono text-neutral-400">
                              {reward.minOrderValue ? `Mín. ${reward.minOrderValue}€` : 'Sem mín.'}
                            </span>
                          </div>
                        </div>

                        <button
                          disabled={!hasEnough}
                          onClick={() => {
                            const res = redeemReward(reward);
                            if (res.success && res.voucher) {
                              setRewardNotice(
                                `Sucesso! Resgataste "${reward.title}". Código: ${res.voucher.code} disponível na tua carteira!`
                              );
                            } else if (res.error) {
                              setRewardNotice(res.error);
                            }
                          }}
                          className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            hasEnough
                              ? 'bg-black text-white hover:bg-neutral-800 shadow-sm'
                              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                          <span>
                            {hasEnough
                              ? 'Resgatar Oferta'
                              : `Faltam ${reward.pointsCost - currentPts} pts`}
                          </span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* SECTION 3: OS MEUS CUPÕES E OFERTAS ATIVAS */}
            {(currentUser.redeemedVouchers || []).length > 0 && (
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
                      <Ticket className="w-4 h-4" />
                      <span>Carteira de Benefícios</span>
                    </div>
                    <h3 className="font-serif text-2xl text-black font-semibold mt-0.5">
                      Os Teus Cupões & Ofertas Desbloqueadas
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {(currentUser.redeemedVouchers || []).filter((v) => !v.isUsed).length} cupões disponíveis
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(currentUser.redeemedVouchers || []).map((voucher) => (
                    <div
                      key={voucher.id}
                      className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                        voucher.isUsed
                          ? 'bg-neutral-50 border-neutral-200 opacity-60'
                          : 'bg-white border-purple-200 shadow-sm ring-1 ring-purple-100'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                          {voucher.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="px-2.5 py-1 rounded-lg bg-neutral-100 font-mono font-bold text-sm text-black border border-neutral-200 tracking-wider">
                            {voucher.code}
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(voucher.code);
                              setCopiedVoucherCode(voucher.code);
                              setTimeout(() => setCopiedVoucherCode(null), 2000);
                            }}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer transition-colors"
                            title="Copiar Código"
                          >
                            {copiedVoucherCode === voucher.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          Resgatado em {new Date(voucher.redeemedAt).toLocaleDateString('pt-PT')}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        {voucher.isUsed ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-200 text-neutral-600">
                            Já Utilizado
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(voucher.code);
                              onBackToStore();
                              setIsCartOpen(true);
                            }}
                            className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            Usar no Carrinho
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: OS MEUS CUPÕES */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-white mb-3">
                    <Ticket className="w-3.5 h-3.5" /> Os Teus Descontos Exclusivos
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold">Cupões & Vouchers</h2>
                  <p className="text-white/80 text-sm mt-1 max-w-xl">
                    Aqui encontras os cupões atribuídos à tua conta — como o cupão de boas-vindas, recompensa de primeira compra e ofertas exclusivas enviadas pela equipa VYRO.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shrink-0 min-w-[140px]">
                  <p className="text-xs uppercase tracking-wider text-white/80 font-medium">Disponíveis</p>
                  <p className="text-3xl font-black mt-0.5">
                    {((currentUser.redeemedVouchers as any[]) || []).filter((v) => !v.isUsed).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Cupões Ativos */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold text-black flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Cupões Disponíveis para Usar
              </h3>

              {((currentUser.redeemedVouchers as any[]) || []).filter((v) => !v.isUsed).length === 0 ? (
                <div className="bg-white rounded-3xl p-10 border border-neutral-200 text-center">
                  <Ticket className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="font-serif font-bold text-lg text-black">Não tens cupões ativos de momento</p>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1">
                    Novos cupões atribuídos ao teu registo ou compras aparecerão aqui automaticamente. Podes também desbloquear cupões no separador <strong>Clube VYRO</strong> com os teus pontos!
                  </p>
                  <button
                    onClick={onBackToStore}
                    className="mt-5 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Explorar Meias VYRO
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {((currentUser.redeemedVouchers as any[]) || [])
                    .filter((v) => !v.isUsed)
                    .map((voucher) => (
                      <div
                        key={voucher.id}
                        className="bg-white rounded-2xl border-2 border-amber-200/80 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between"
                      >
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-100 rounded-full blur-xl opacity-60 pointer-events-none" />
                        
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                              {voucher.discountType === 'percent'
                                ? `-${voucher.discountValue}% DE DESCONTO`
                                : `-${voucher.discountValue.toFixed(2)}€ DE DESCONTO`}
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              Atribuído em {new Date(voucher.redeemedAt).toLocaleDateString('pt-PT')}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-neutral-900 mb-1">{voucher.title}</h4>
                          <p className="text-xs text-neutral-500 mb-4">
                            Aplica este código no checkout para usufruir do desconto imediato.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-dashed border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <code className="px-3 py-1.5 rounded-xl bg-neutral-900 font-mono font-bold text-sm text-amber-300 tracking-wider">
                              {voucher.code}
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(voucher.code);
                                setCopiedVoucherCode(voucher.code);
                                setTimeout(() => setCopiedVoucherCode(null), 2000);
                              }}
                              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer transition-colors"
                              title="Copiar Código"
                            >
                              {copiedVoucherCode === voucher.code ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(voucher.code);
                              onBackToStore();
                              setIsCartOpen(true);
                            }}
                            className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Usar no Carrinho</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Histórico de Cupões Usados */}
            {((currentUser.redeemedVouchers as any[]) || []).filter((v) => v.isUsed).length > 0 && (
              <div className="pt-4 border-t border-neutral-200">
                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3">
                  Histórico de Cupões Utilizados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-70">
                  {((currentUser.redeemedVouchers as any[]) || [])
                    .filter((v) => v.isUsed)
                    .map((voucher) => (
                      <div
                        key={voucher.id}
                        className="bg-neutral-100 rounded-xl p-3.5 border border-neutral-200 flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-xs font-bold text-neutral-700">{voucher.title}</p>
                          <code className="text-xs font-mono text-neutral-500">{voucher.code}</code>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-200 text-neutral-600">
                          Utilizado
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
