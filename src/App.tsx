import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { CartProvider, useCart } from './context/CartContext';
import { UserProvider, useUser } from './context/UserContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { TechSection } from './components/TechSection';
import { Footer } from './components/Footer';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AdminPortalPage } from './components/AdminPortalPage';
import { UserProfilePage } from './components/UserProfilePage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { Product } from './types/store';

type ViewMode = 'store' | 'product-detail' | 'admin' | 'profile';

const MainAppContent: React.FC = () => {
  const { setIsCartOpen } = useCart();
  const { isAuthenticated } = useUser();
  const [currentView, setCurrentView] = useState<ViewMode>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // User Auth & Profile Modal states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [profileTab, setProfileTab] = useState<'overview' | 'orders' | 'favorites' | 'profile' | 'rewards'>('overview');

  // Navigate to dedicated product detail page (no modal)
  const handleOpenProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to dedicated admin portal page (no modal)
  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to user profile page
  const handleOpenProfile = (tab: 'overview' | 'orders' | 'favorites' | 'profile' | 'rewards' = 'overview') => {
    setProfileTab(tab);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFavorites = () => {
    if (isAuthenticated) {
      handleOpenProfile('favorites');
    } else {
      setAuthTab('login');
      setIsAuthOpen(true);
    }
  };

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const handleBackToStore = () => {
    setCurrentView('store');
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        const catalogElement = document.getElementById('catalog');
        if (catalogElement) {
          catalogElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const catalogElement = document.getElementById('catalog');
      if (catalogElement) {
        catalogElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'categories' || sectionId === 'catalog') {
      scrollToCatalog();
      return;
    }

    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (sectionId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToCatalog = () => {
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        const catalogElement = document.getElementById('catalog');
        if (catalogElement) {
          catalogElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-cyan-400 selection:text-black">
      {/* VIEW 1: DEDICATED ADMIN PORTAL PAGE (NO MODAL) */}
      {currentView === 'admin' && (
        <AdminPortalPage onBackToStore={handleBackToStore} />
      )}

      {/* VIEW 2: DEDICATED USER PROFILE & ATHLETE CLUB PAGE (NO MODAL) */}
      {currentView === 'profile' && (
        <UserProfilePage
          onBackToStore={handleBackToStore}
          onOpenProductDetail={handleOpenProductDetail}
          initialTab={profileTab}
        />
      )}

      {/* VIEW 3: DEDICATED PRODUCT DETAIL PAGE (NO MODAL) */}
      {currentView === 'product-detail' && selectedProduct && (
        <>
          <Navbar
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAdmin={handleOpenAdmin}
            onNavigate={handleNavigate}
            onOpenProfile={() => handleOpenProfile('overview')}
            onOpenAuth={() => handleOpenAuth('login')}
            onOpenFavorites={handleOpenFavorites}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
          <ProductDetailPage
            product={selectedProduct}
            onBack={handleBackToStore}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onRequireAuth={() => handleOpenAuth('login')}
          />
          <Footer onOpenAdmin={handleOpenAdmin} onSelectCategory={handleSelectCategory} />
        </>
      )}

      {/* VIEW 4: MAIN STOREFRONT */}
      {currentView === 'store' && (
        <>
          <Navbar
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAdmin={handleOpenAdmin}
            onNavigate={handleNavigate}
            onOpenProfile={() => handleOpenProfile('overview')}
            onOpenAuth={() => handleOpenAuth('login')}
            onOpenFavorites={handleOpenFavorites}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
          <HeroSection onExploreClick={scrollToCatalog} />
          <ProductCatalog
            onQuickView={handleOpenProductDetail}
            onOpenAdmin={handleOpenAdmin}
            onRequireAuth={() => handleOpenAuth('login')}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <TechSection />
          <Footer onOpenAdmin={handleOpenAdmin} onSelectCategory={handleSelectCategory} />
        </>
      )}

      {/* Global Slide-Over Cart Drawer & Checkout */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onViewOrders={() => handleOpenProfile('orders')}
      />

      {/* Global Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
        onSuccess={() => {
          // Keep on store or current view, session is active!
        }}
      />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <UserProvider>
        <CartProvider>
          <MainAppContent />
        </CartProvider>
      </UserProvider>
    </StoreProvider>
  );
}

export default App;
