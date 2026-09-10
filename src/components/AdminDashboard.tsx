import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  FolderPlus,
  Package,
  Layers,
  LogOut,
  CheckCircle,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductColor } from '../types/store';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_SOCKS_IMAGES = [
  'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1576672843344-f01907a9d40c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const {
    products,
    categories,
    logoutAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    resetStoreData,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'add-product' | 'list-products' | 'categories' | 'stats'>('add-product');
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
  const [prodImageUrl, setProdImageUrl] = useState(PRESET_SOCKS_IMAGES[0]);

  // New Category Form State
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    const selectedCatObj = categories.find((c) => c.id === prodCategory) || categories[0];

    const colors: ProductColor[] = [
      { name: 'Cyan Kinetic', hex: '#00f2fe' },
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Stealth Black', hex: '#111827' },
    ];

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
      colors,
      images: [prodImageUrl],
      badge: prodBadge || undefined,
      inStock: true,
    });

    showNotification(`Meia "${prodName}" adicionada com sucesso ao catálogo!`);
    // Reset form
    setProdName('');
    setProdTagline('');
    setProdPrice('');
    setProdOriginalPrice('');
    setProdDescription('');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    const slug = catSlug.trim() || catName.toLowerCase().replace(/\s+/g, '-');
    addCategory({
      name: catName,
      slug,
      description: catDescription || 'Meias desportivas e técnicas para alta exigência.',
    });

    showNotification(`Categoria "${catName}" criada com sucesso!`);
    setCatName('');
    setCatSlug('');
    setCatDescription('');
  };

  const toggleSize = (size: string) => {
    if (prodSizes.includes(size)) {
      setProdSizes(prodSizes.filter((s) => s !== size));
    } else {
      setProdSizes([...prodSizes, size]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-rise">
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-black font-bold text-xs">
              V
            </div>
            <div>
              <h2 className="font-serif text-2xl font-normal tracking-wide text-white">
                VYRO<sup className="text-xs text-cyan-400 font-sans">®</sup> Painel de Administração
              </h2>
              <p className="text-[11px] text-neutral-400 font-sans -mt-1">
                Gestão de Produtos, Categorias e Catálogo em Tempo Real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da Sessão</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('add-product')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'add-product'
                ? 'border-cyan-600 text-cyan-700 bg-white shadow-sm'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Plus className="w-4 h-4 text-cyan-600" />
            <span>Adicionar Meia (Produto)</span>
          </button>

          <button
            onClick={() => setActiveTab('list-products')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'list-products'
                ? 'border-cyan-600 text-cyan-700 bg-white shadow-sm'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Gerir Meias ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'categories'
                ? 'border-cyan-600 text-cyan-700 bg-white shadow-sm'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Categorias ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'stats'
                ? 'border-cyan-600 text-cyan-700 bg-white shadow-sm'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Métricas & Restaurar</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {notification && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-fade-rise">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white">
          {/* TAB 1: ADD PRODUCT */}
          {activeTab === 'add-product' && (
            <form onSubmit={handleCreateProduct} className="max-w-3xl space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-black">Cadastrar Novo Modelo de Meia</h3>
                <p className="text-xs text-[#6F6F6F] mt-1 font-sans">
                  Preenche os dados para publicar uma nova meia técnica imediatamente na loja.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-neutral-800 block mb-1">
                    Nome da Meia *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: VYRO Aero Carbon Pro"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-800 block mb-1">
                    Subtítulo / Slogan
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Máxima compressão para ciclismo de estrada"
                    value={prodTagline}
                    onChange={(e) => setProdTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-800 block mb-1">
                    Categoria *
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 bg-white focus:outline-none focus:border-black"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-800 block mb-1">
                    Badge de Destaque
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: BESTSELLER, NOVO, ED. LIMITADA"
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-800 block mb-1">
                    Preço de Venda (€) *
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    placeholder="Ex: 19.90"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-800 block mb-1">
                    Preço Original / Antes (€) (Opcional)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    placeholder="Ex: 24.90"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="text-xs font-bold uppercase text-neutral-800 block mb-1.5">
                  Tamanhos Disponíveis
                </label>
                <div className="flex gap-3">
                  {['35-38', '39-42', '43-46'].map((sz) => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        prodSizes.includes(sz)
                          ? 'bg-black text-white border-black shadow-sm'
                          : 'bg-neutral-50 text-neutral-600 border-neutral-300'
                      }`}
                    >
                      {sz} {prodSizes.includes(sz) ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <label className="text-xs font-bold uppercase text-neutral-800 block mb-1">
                  URL da Imagem da Meia
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={prodImageUrl}
                    onChange={(e) => setProdImageUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div className="mt-2">
                  <span className="text-[11px] text-neutral-500 font-medium">Ou escolha uma foto modelo com 1 clique:</span>
                  <div className="flex gap-2 mt-1.5 overflow-x-auto pb-1">
                    {PRESET_SOCKS_IMAGES.map((img, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setProdImageUrl(img)}
                        className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 ${
                          prodImageUrl === img ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-neutral-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description & Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-neutral-800 block mb-1">
                    Descrição Detalhada
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Descreve o desempenho, respirabilidade e sensação da meia..."
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-800 block mb-1">
                    Tecnologias / Especificações (1 por linha)
                  </label>
                  <textarea
                    rows={4}
                    value={prodFeatures}
                    onChange={(e) => setProdFeatures(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 hover:scale-[1.02] transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Publicar Meia no Catálogo</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: LIST PRODUCTS */}
          {activeTab === 'list-products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-serif text-2xl text-black">Catálogo Ativo de Produtos</h3>
                  <p className="text-xs text-[#6F6F6F]">
                    Edita preços, disponibilidade de stock ou elimina produtos.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('add-product')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Produto</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-neutral-200 rounded-2xl">
                <table className="w-full text-left text-xs text-neutral-600">
                  <thead className="bg-neutral-100 text-neutral-800 font-bold uppercase text-[10px] tracking-wider border-b border-neutral-200">
                    <tr>
                      <th className="p-3.5">Produto</th>
                      <th className="p-3.5">Categoria</th>
                      <th className="p-3.5">Preço</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg bg-neutral-200 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-black">{p.name}</div>
                            <div className="text-[10px] text-neutral-400">{p.tagline}</div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 font-medium text-[10px]">
                            {p.categoryName}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-black">
                          €{p.price.toFixed(2)}
                          {p.originalPrice && (
                            <span className="text-[10px] text-neutral-400 line-through ml-1.5">
                              €{p.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => {
                              updateProduct(p.id, { inStock: !p.inStock });
                              showNotification(`Estado de stock de "${p.name}" atualizado.`);
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              p.inStock
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {p.inStock ? 'Em Stock ✓' : 'Esgotado ✕'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Tem a certeza que deseja eliminar "${p.name}"?`)) {
                                deleteProduct(p.id);
                                showNotification(`Produto "${p.name}" eliminado.`);
                              }
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
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
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Form to create new category */}
              <div className="md:col-span-1 bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                <h3 className="font-serif text-2xl text-black mb-1">Criar Nova Categoria</h3>
                <p className="text-xs text-[#6F6F6F] mb-4">
                  Adiciona novas linhas desportivas à loja VYRO.
                </p>

                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-neutral-800 block mb-1">
                      Nome da Categoria *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Triathlon & Água"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-neutral-800 block mb-1">
                      Slug URL
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: triathlon-aqua"
                      value={catSlug}
                      onChange={(e) => setCatSlug(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-neutral-800 block mb-1">
                      Descrição da Categoria
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Breve descrição da utilidade biomecânica..."
                      value={catDescription}
                      onChange={(e) => setCatDescription(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl border-neutral-300 focus:outline-none focus:border-black bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-black text-white font-medium text-xs hover:bg-neutral-800 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Criar Categoria</span>
                  </button>
                </form>
              </div>

              {/* List of existing categories */}
              <div className="md:col-span-2 space-y-3">
                <h3 className="font-serif text-2xl text-black">Categorias Existentes</h3>
                <div className="grid grid-cols-1 gap-3">
                  {categories.map((c) => {
                    const count = products.filter((p) => p.categoryId === c.id).length;
                    return (
                      <div
                        key={c.id}
                        className="p-4 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-black">{c.name}</span>
                            <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-semibold">
                              {count} {count === 1 ? 'produto' : 'produtos'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">{c.description}</p>
                          <span className="text-[10px] text-cyan-600 font-mono">slug: #{c.slug}</span>
                        </div>

                        {categories.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Eliminar a categoria "${c.name}"?`)) {
                                deleteCategory(c.id);
                                showNotification(`Categoria "${c.name}" eliminada.`);
                              }
                            }}
                            className="p-2 text-neutral-400 hover:text-red-600 transition-colors rounded-lg hover:bg-neutral-100"
                            title="Eliminar Categoria"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: METRICS & RESET */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-cyan-950">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Total Produtos</span>
                  <div className="font-serif text-4xl mt-2 font-normal">{products.length}</div>
                  <p className="text-[11px] text-cyan-700 mt-1">Meias ativas no catálogo</p>
                </div>

                <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">Categorias Ativas</span>
                  <div className="font-serif text-4xl mt-2 font-normal">{categories.length}</div>
                  <p className="text-[11px] text-blue-700 mt-1">Linhas de treino e performance</p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-900">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Garantia VYRO</span>
                  <div className="font-serif text-4xl mt-2 font-normal">100%</div>
                  <p className="text-[11px] text-neutral-500 mt-1">Engenharia anti-bolhas & conforto</p>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/60 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-amber-900">Restaurar Dados de Demonstração</h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Restaura a lista original de meias e categorias pré-configuradas da marca VYRO.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Tem a certeza de que deseja restaurar as meias e categorias originais?')) {
                      resetStoreData();
                      showNotification('Dados de demonstração restaurados com sucesso!');
                    }
                  }}
                  className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restaurar Catálogo Padrão</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
