import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { TechSection } from './components/TechSection';
import { Footer } from './components/Footer';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AdminPortalPage } from './components/AdminPortalPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Product } from './types/store';

type ViewMode = 'store' | 'product-detail' | 'admin';

const MainAppContent: React.FC = () => {
  const { setIsCartOpen } = useCart();
  const [currentView, setCurrentView] = useState<ViewMode>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

  const handleBackToStore = () => {
    setCurrentView('store');
  };

  const handleNavigate = (sectionId: string) => {
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
    } else if (sectionId === 'categories') {
      const catEl = document.getElementById('catalog');
      if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
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

      {/* VIEW 2: DEDICATED PRODUCT DETAIL PAGE (NO MODAL) */}
      {currentView === 'product-detail' && selectedProduct && (
        <>
          <Navbar
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAdmin={handleOpenAdmin}
            onNavigate={handleNavigate}
          />
          <ProductDetailPage
            product={selectedProduct}
            onBack={handleBackToStore}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
          <Footer />
        </>
      )}

      {/* VIEW 3: MAIN STOREFRONT */}
      {currentView === 'store' && (
        <>
          <Navbar
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAdmin={handleOpenAdmin}
            onNavigate={handleNavigate}
          />
          <HeroSection onExploreClick={scrollToCatalog} />
          <ProductCatalog
            onQuickView={handleOpenProductDetail}
            onOpenAdmin={handleOpenAdmin}
          />
          <TechSection />
          <Footer />
        </>
      )}

      {/* Global Slide-Over Cart Drawer & Checkout */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <MainAppContent />
      </CartProvider>
    </StoreProvider>
  );
}

export default App;
