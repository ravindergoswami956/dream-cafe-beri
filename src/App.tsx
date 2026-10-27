import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ThreeShowcaseSection } from './components/ThreeShowcaseSection';
import { FeaturedDishes } from './components/FeaturedDishes';
import { MenuSection } from './components/MenuSection';
import { CombosSection } from './components/CombosSection';
import { AboutSection } from './components/AboutSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { ItemModal } from './components/ItemModal';
import { AmbientParticles } from './components/AmbientParticles';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LeftSideAdminButton } from './components/LeftSideAdminButton';
import { ALL_MENU_ITEMS } from './data/menuData';
import type { MenuItem } from './data/menuData';
import { getMenuItems, getOwnerSession, logoutOwner } from './lib/supabase';
import type { OwnerSession } from './lib/supabase';

export function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(ALL_MENU_ITEMS);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [ownerSession, setOwnerSession] = useState<OwnerSession | null>(() => getOwnerSession());
  const [isOwnerLoginOpen, setIsOwnerLoginOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer');

  const refreshMenu = async () => {
    const items = await getMenuItems();
    setMenuItems(items);
  };

  useEffect(() => {
    const checkAdminRoute = () => {
      const isPathAdmin = typeof window !== 'undefined' && window.location.pathname === '/admin';
      const isHashAdmin = typeof window !== 'undefined' && window.location.hash === '#admin';
      const isParamAdmin = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('admin') !== null;

      if (isPathAdmin || isHashAdmin || isParamAdmin) {
        const activeSession = getOwnerSession();
        if (activeSession) {
          setViewMode('admin');
        } else {
          setViewMode('customer');
          setIsOwnerLoginOpen(true);
        }
      } else {
        setViewMode('customer');
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    // Load dynamic menu items
    refreshMenu();

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, []);

  const handleAuthenticated = (session: OwnerSession) => {
    setOwnerSession(session);
    setViewMode('admin');
    if (typeof window !== 'undefined') {
      window.history.pushState({ page: 'admin' }, '', '/admin');
    }
  };

  const handleLogout = () => {
    logoutOwner();
    setOwnerSession(null);
    setViewMode('customer');
    if (typeof window !== 'undefined') {
      window.history.pushState({ page: 'home' }, '', '/');
    }
  };

  const handleViewLiveSite = () => {
    setViewMode('customer');
    refreshMenu();
    if (typeof window !== 'undefined') {
      window.history.pushState({ page: 'home' }, '', '/');
    }
  };

  // If in admin view mode and owner is authenticated, render the Admin Dashboard
  if (viewMode === 'admin' && ownerSession) {
    return (
      <AdminDashboard
        session={ownerSession}
        onLogout={handleLogout}
        onViewLiveSite={handleViewLiveSite}
      />
    );
  }

  // Public Customer View (Browse without logging in)
  return (
    <div className="relative min-h-screen bg-[#0B0A09] text-[#FDF8F3] overflow-x-hidden selection:bg-orange-600 selection:text-white">
      {/* 3D Ambient Golden Embers Background */}
      <AmbientParticles />

      {/* Navigation Bar */}
      <Navbar
        isOwnerLoggedIn={Boolean(ownerSession)}
        onOpenDashboard={() => setViewMode('admin')}
        onOpenOwnerLogin={() => setIsOwnerLoginOpen(true)}
      />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Cinematic 3D Hero Section */}
        <Hero />

        {/* 360° Real-time 3D Food Studio */}
        <ThreeShowcaseSection />

        {/* Featured Masterpieces */}
        <FeaturedDishes onSelectItem={(item) => setSelectedItem(item)} />

        {/* Full Interactive Menu with Search & Category Filters */}
        <MenuSection items={menuItems} onSelectItem={(item) => setSelectedItem(item)} />

        {/* Party Combos & Custom Upgrades */}
        <CombosSection />

        {/* Brand Story & Cafe Introduction */}
        <AboutSection />

        {/* Location, Opening Information & Contact */}
        <LocationSection />
      </main>

      {/* Premium Footer with discrete Staff Login */}
      <Footer
        isOwnerLoggedIn={Boolean(ownerSession)}
        onOpenDashboard={() => setViewMode('admin')}
        onOpenOwnerLogin={() => setIsOwnerLoginOpen(true)}
      />

      {/* Floating Left-Side Admin Access Button */}
      <LeftSideAdminButton
        isOwnerLoggedIn={Boolean(ownerSession)}
        onOpenDashboard={() => setViewMode('admin')}
        onOpenOwnerLogin={() => setIsOwnerLoginOpen(true)}
      />

      {/* Dish Inspection Modal */}
      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Discrete Owner Login Modal */}
      <OwnerLoginModal
        isOpen={isOwnerLoginOpen}
        onClose={() => setIsOwnerLoginOpen(false)}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
}

export default App;
