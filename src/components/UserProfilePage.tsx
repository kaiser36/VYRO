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
  Building2,
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
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);
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

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'Pendente':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
          icon: <Clock className="w-3 h-3 text-amber-700" />,
          label: '⏱ Pendente (Aguard. Pagamento)',
        };
      case 'Pago':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
          label: '✓ Pago',
        };
      case 'Em Preparação':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <Clock className="w-3 h-3 text-amber-600" />,
          label: '⏳ Em Preparação',
        };
      case 'Enviado - aguarda tracking':
        return {
          bg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          icon: <Truck className="w-3 h-3 text-indigo-600" />,
          label: '🚚 Enviado - aguarda tracking',
        };
      case 'Enviado - com tracking':
        return {
          bg: 'bg-cyan-100 text-cyan-900 border-cyan-300 font-bold shadow-2xs',
          icon: <Truck className="w-3 h-3 text-cyan-700" />,
          label: '📦 Enviado - com tracking',
        };
      case 'Concluído':
        return {
          bg: 'bg-neutral-800 text-white border-neutral-700',
          icon: <CheckCircle2 className="w-3 h-3 text-cyan-400" />,
          label: '🏁 Concluído',
        };
      case 'Cancelado':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: <CheckCircle2 className="w-3 h-3 text-rose-600" />,
          label: '❌ Cancelado',
        };
      default:
        return {
          bg: 'bg-neutral-100 text-neutral-800 border-neutral-200',
          icon: <CheckCircle2 className="w-3 h-3 text-neutral-600" />,
          label: status,
        };
    }
  };

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

            {/* Actions: Coupons badge & Logout */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs">
                <Ticket className="w-4 h-4 text-cyan-400" />
                <span className="text-neutral-300">Cupões:</span>
                <span className="font-bold text-cyan-400">
                  {((currentUser.redeemedVouchers as any[]) || []).filter((v) => !v.isUsed).length}
                </span>
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

              <div 
                onClick={() => setActiveTab('coupons')}
                className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4 cursor-pointer hover:border-purple-300 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium">Cupões Disponíveis</p>
                  <p className="text-2xl font-serif font-bold text-black">
                    {((currentUser.redeemedVouchers as any[]) || []).filter((v) => !v.isUsed).length}
                  </p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('orders')}
                className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4 cursor-pointer hover:border-emerald-300 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium">Conta de Cliente</p>
                  <p className="text-base font-serif font-bold text-emerald-700">Ativa & Verificada</p>
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
                          {(() => {
                            const badge = getOrderStatusBadge(order.status);
                            return (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border ${badge.bg}`}>
                                {badge.icon}
                                <span>{order.status}</span>
                              </span>
                            );
                          })()}
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
                          {(() => {
                            const badge = getOrderStatusBadge(order.status);
                            return (
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${badge.bg}`}>
                                {badge.icon}
                                <span>{order.status}</span>
                              </span>
                            );
                          })()}
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

                    {/* Tracking Box if trackingNumber is present */}
                    {order.trackingNumber && (
                      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-blue-500/10 border border-cyan-300/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full">
                                {order.trackingCarrier || 'CTT Expresso'}
                              </span>
                              <span className="text-xs text-neutral-500">Código de Envio:</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono font-bold text-black text-sm">{order.trackingNumber}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(order.trackingNumber || '');
                                  setCopiedTrackingId(order.id);
                                  setTimeout(() => setCopiedTrackingId(null), 2000);
                                }}
                                className="text-[11px] text-cyan-700 hover:text-cyan-900 font-semibold underline cursor-pointer"
                              >
                                {copiedTrackingId === order.id ? '✓ Copiado!' : 'Copiar'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {order.trackingUrl && (
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs shrink-0 cursor-pointer"
                          >
                            <span>Acompanhar Entrega</span>
                            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Multibanco Payment slip if order is pending */}
                    {order.multibancoReference && order.status === 'Pendente' && (
                      <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                                Pagamento Multibanco
                              </span>
                              <span className="text-xs text-amber-800">Aguardando Pagamento</span>
                            </div>
                            <div className="mt-1 font-mono text-xs flex flex-wrap gap-x-4 gap-y-1">
                              <span>Entidade: <strong>{order.multibancoEntity || '21234'}</strong></span>
                              <span>Referência: <strong>{order.multibancoReference}</strong></span>
                              <span>Montante: <strong>€{order.totalAmount.toFixed(2)}</strong></span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `Entidade: ${order.multibancoEntity || '21234'}\nReferência: ${order.multibancoReference}\nMontante: €${order.totalAmount.toFixed(2)}`
                            );
                            setCopiedTrackingId(`mb_${order.id}`);
                            setTimeout(() => setCopiedTrackingId(null), 2000);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-semibold text-xs transition-colors shrink-0 cursor-pointer"
                        >
                          {copiedTrackingId === `mb_${order.id}` ? '✓ Copiado!' : 'Copiar Dados'}
                        </button>
                      </div>
                    )}

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
                    Novos cupões atribuídos ao teu registo, primeira compra ou campanhas promocionais aparecerão aqui automaticamente.
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
