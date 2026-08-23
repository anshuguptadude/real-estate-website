import React, { useState, useEffect } from 'react';
import { ActiveScreen, Property, FilterState, PropertyType, ListingType, UserProfile } from './types';
import { PROPERTIES_DATA } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedProperties } from './components/FeaturedProperties';
import { NeighborhoodExplorer } from './components/NeighborhoodExplorer';
import { WhyRoyalAgra } from './components/WhyRoyalAgra';
import { PropertiesScreen } from './components/PropertiesScreen';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ProjectsScreen } from './components/ProjectsScreen';
import { PostPropertyScreen } from './components/PostPropertyScreen';
import { AboutScreen } from './components/AboutScreen';
import { ContactScreen } from './components/ContactScreen';
import { ScreenNavigator } from './components/ScreenNavigator';
import { LoginModal } from './components/LoginModal';
import { EditPropertyModal } from './components/EditPropertyModal';
import { UserDashboardScreen } from './components/UserDashboardScreen';
import { EmiCalculatorModal } from './components/EmiCalculatorModal';
import { CompareModal } from './components/CompareModal';
import { SavedPropertiesDrawer } from './components/SavedPropertiesDrawer';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation & Screen state
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // User Authentication State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('royal_agra_user_profile_v2');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    // Default initial simulated user (or null) - start with pre-configured partner account for immediate access
    return {
      id: 'RAE-OWNER-01',
      name: 'Shrey Gupta',
      phone: '+91 91490 79913',
      email: 'shrey@royalagraestate.com',
      role: 'owner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      memberSince: '2023',
      city: 'Agra',
      preferredLocality: 'Fatehabad Road, Agra'
    };
  });

  // Global Properties State (with persistence & user additions/edits)
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const stored = localStorage.getItem('royal_agra_properties_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    // Seed initial properties with owner listing tags for user's properties
    return PROPERTIES_DATA.map((p, idx) => ({
      ...p,
      status: p.status || (idx === 3 ? 'Sold' : 'Active'),
      isUserListing: idx === 0 || idx === 2, // First and third properties belong to Shrey Gupta
      ownerId: (idx === 0 || idx === 2) ? 'RAE-OWNER-01' : undefined,
      ownerName: (idx === 0 || idx === 2) ? 'Shrey Gupta' : p.agent?.name || 'Managing Partner'
    }));
  });

  // Sync user state to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('royal_agra_user_profile_v2', JSON.stringify(user));
      } else {
        localStorage.removeItem('royal_agra_user_profile_v2');
      }
    } catch {
      // ignore
    }
  }, [user]);

  // Sync properties state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('royal_agra_properties_v2', JSON.stringify(properties));
    } catch {
      // ignore
    }
  }, [properties]);

  // Deep linking: parse query param '?property=id' and open detail modal on load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const propId = params.get('property');
      if (propId) {
        const found = properties.find(p => p.id === propId);
        if (found) {
          setSelectedProperty(found);
        }
      }
    } catch {
      // ignore
    }
  }, [properties]);

  // Search & Filter state
  const initialFilterState: FilterState = {
    searchQuery: '',
    listingType: 'Buy',
    locality: '',
    propertyType: 'All',
    priceRange: [0, 200000000],
    bhk: '',
    possession: 'all',
    furnishing: 'all',
    facing: 'all',
    sortBy: 'featured'
  };

  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

  // Saved / Favorite properties state
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('royal_agra_saved_v2');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-2'];
    } catch {
      return ['prop-1', 'prop-2'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('royal_agra_saved_v2', JSON.stringify(savedPropertyIds));
    } catch {
      // ignore
    }
  }, [savedPropertyIds]);

  // Compare properties state (max 3)
  const [compareList, setCompareList] = useState<Property[]>([]);

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState<string | undefined>(undefined);
  const [pendingPostRedirect, setPendingPostRedirect] = useState(false);
  const [pendingDashboardRedirect, setPendingDashboardRedirect] = useState(false);

  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [emiModalOpen, setEmiModalOpen] = useState(false);
  const [emiInitialPrice, setEmiInitialPrice] = useState(28500000);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);

  // Scroll to top on screen change
  const navigateTo = (screen: ActiveScreen) => {
    if (screen === 'sell-rent' && !user) {
      handleInitiatePostProperty();
      return;
    }
    if (screen === 'dashboard' && !user) {
      setLoginPromptMessage('Please log in or create an account to view your dashboard.');
      setPendingDashboardRedirect(true);
      setLoginModalOpen(true);
      return;
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Protected Post Property trigger
  const handleInitiatePostProperty = () => {
    if (!user) {
      setLoginPromptMessage('Please log in or create an account to post a property listing in Agra.');
      setPendingPostRedirect(true);
      setLoginModalOpen(true);
    } else {
      setActiveScreen('sell-rent');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setLoginModalOpen(false);
    setLoginPromptMessage(undefined);

    if (pendingPostRedirect) {
      setPendingPostRedirect(false);
      setActiveScreen('sell-rent');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pendingDashboardRedirect) {
      setPendingDashboardRedirect(false);
      setActiveScreen('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    setUser(null);
    if (activeScreen === 'dashboard' || activeScreen === 'sell-rent') {
      setActiveScreen('home');
    }
  };

  // Property Management Handlers
  const handlePropertyCreated = (newProp: Property) => {
    setProperties(prev => [newProp, ...prev]);
  };

  const handleSavePropertyEdit = (updatedProperty: Property) => {
    setProperties(prev => prev.map(p => (p.id === updatedProperty.id ? updatedProperty : p)));
    if (selectedProperty && selectedProperty.id === updatedProperty.id) {
      setSelectedProperty(updatedProperty);
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    setSavedPropertyIds(prev => prev.filter(id => id !== propertyId));
    setCompareList(prev => prev.filter(p => p.id !== propertyId));
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(null);
    }
  };

  const handleTogglePropertyStatus = (propertyId: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const current = p.status || 'Active';
        const nextStatus = current === 'Active' 
          ? (p.listingType === 'Rent' ? 'Rented' : 'Sold')
          : 'Active';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const handleHeroSearch = (newFilters: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilters }));
    navigateTo('properties');
  };

  const handleSelectLocality = (localityName: string) => {
    setFilterState(prev => ({ ...prev, locality: localityName }));
    navigateTo('properties');
  };

  const handleToggleSave = (id: string) => {
    setSavedPropertyIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (prop: Property) => {
    setCompareList(prev => {
      if (prev.some(p => p.id === prop.id)) {
        return prev.filter(p => p.id !== prop.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 properties at a time.');
        return prev;
      }
      return [...prev, prop];
    });
  };

  const handleOpenEmiCalculator = (price: number) => {
    setEmiInitialPrice(price);
    setEmiModalOpen(true);
  };

  const handleBookVisit = (prop: Property) => {
    setSelectedProperty(prop);
  };

  const savedProperties = properties.filter(p => savedPropertyIds.includes(p.id));

  // Properties belonging to current user
  const userProperties = properties.filter(p => 
    p.isUserListing || (user && p.ownerId === user.id) || (user && user.role === 'owner' && (p.isUserListing || p.id === 'prop-1' || p.id === 'prop-3'))
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1A2E26] selection:bg-[#0F382C] selection:text-white">
      
      {/* 1. Header & Navigation */}
      <Navbar
        activeScreen={activeScreen}
        onNavigate={navigateTo}
        onOpenLogin={() => {
          setLoginPromptMessage(undefined);
          setLoginModalOpen(true);
        }}
        onOpenPostProperty={handleInitiatePostProperty}
        user={user}
        onLogout={handleLogout}
        savedCount={savedPropertyIds.length}
        onOpenSaved={() => setSavedDrawerOpen(true)}
      />

      {/* 2. Main Content Screens */}
      <main className="flex-1">
        
        {/* SCREEN: Home / Hero Showcase */}
        {activeScreen === 'home' && (
          <div>
            <HeroSection
              onSearch={handleHeroSearch}
              onSelectLocality={handleSelectLocality}
              onExploreProjects={() => navigateTo('projects')}
            />

            <FeaturedProperties
              properties={properties}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onToggleSave={handleToggleSave}
              savedIds={savedPropertyIds}
              onBookVisit={handleBookVisit}
              onExploreAll={() => navigateTo('properties')}
              onToggleCompare={handleToggleCompare}
              compareList={compareList}
            />

            <NeighborhoodExplorer
              onSelectLocality={handleSelectLocality}
            />

            <WhyRoyalAgra
              onContactAdvisory={() => navigateTo('contact')}
            />
          </div>
        )}

        {/* SCREEN: Properties Explorer */}
        {activeScreen === 'properties' && (
          <PropertiesScreen
            properties={properties}
            filterState={filterState}
            onUpdateFilters={(patch) => setFilterState(prev => ({ ...prev, ...patch }))}
            onResetFilters={() => setFilterState(initialFilterState)}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
            onToggleSave={handleToggleSave}
            savedIds={savedPropertyIds}
            onBookVisit={handleBookVisit}
            onToggleCompare={handleToggleCompare}
            compareList={compareList}
            onOpenCompareModal={() => setCompareModalOpen(true)}
          />
        )}

        {/* SCREEN: User Dashboard */}
        {activeScreen === 'dashboard' && (
          <UserDashboardScreen
            user={user}
            userProperties={userProperties}
            savedProperties={savedProperties}
            onUpdateProfile={(updated) => setUser(updated)}
            onEditProperty={(prop) => setEditingProperty(prop)}
            onDeleteProperty={handleDeleteProperty}
            onTogglePropertyStatus={handleTogglePropertyStatus}
            onViewProperty={(prop) => setSelectedProperty(prop)}
            onNavigatePostProperty={handleInitiatePostProperty}
            onNavigateProperties={() => navigateTo('properties')}
            onLogout={handleLogout}
          />
        )}

        {/* SCREEN: Sell / Rent / Post Property */}
        {activeScreen === 'sell-rent' && (
          <PostPropertyScreen
            user={user}
            onSuccessNavigate={() => navigateTo('home')}
            onPropertyCreated={handlePropertyCreated}
            onNavigateDashboard={() => navigateTo('dashboard')}
          />
        )}

        {/* SCREEN: New Projects */}
        {activeScreen === 'projects' && (
          <ProjectsScreen
            onContactProject={() => {
              navigateTo('contact');
            }}
          />
        )}

        {/* SCREEN: About & Heritage */}
        {activeScreen === 'about' && (
          <AboutScreen />
        )}

        {/* SCREEN: Contact */}
        {activeScreen === 'contact' && (
          <ContactScreen />
        )}

      </main>

      {/* 3. Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenPostProperty={handleInitiatePostProperty}
      />

      {/* 4. Floating Screen Navigator */}
      <ScreenNavigator
        activeScreen={activeScreen}
        onNavigate={navigateTo}
        hasSelectedProperty={Boolean(selectedProperty)}
        onOpenSampleDetail={() => setSelectedProperty(properties[0])}
      />

      {/* 5. Modals & Drawers */}
      
      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onBookVisit={handleBookVisit}
        onOpenEmiCalc={(price) => handleOpenEmiCalculator(price)}
        onToggleSave={handleToggleSave}
        isSaved={selectedProperty ? savedPropertyIds.includes(selectedProperty.id) : false}
      />

      {/* Unified Login & Sign Up Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => {
          setLoginModalOpen(false);
          setLoginPromptMessage(undefined);
          setPendingPostRedirect(false);
          setPendingDashboardRedirect(false);
        }}
        onLoginSuccess={handleLoginSuccess}
        promptMessage={loginPromptMessage}
        initialRole={pendingPostRedirect ? 'owner' : 'buyer'}
      />

      {/* Edit Property Modal */}
      <EditPropertyModal
        property={editingProperty}
        isOpen={Boolean(editingProperty)}
        onClose={() => setEditingProperty(null)}
        onSave={handleSavePropertyEdit}
      />

      {/* Mortgage EMI Calculator Modal */}
      <EmiCalculatorModal
        isOpen={emiModalOpen}
        onClose={() => setEmiModalOpen(false)}
        initialPrice={emiInitialPrice}
      />

      {/* Compare Matrix Modal */}
      <CompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        compareList={compareList}
        onRemoveFromCompare={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
        onSelectProperty={(prop) => {
          setSelectedProperty(prop);
          setCompareModalOpen(false);
        }}
      />

      {/* Saved Favorites Drawer */}
      <SavedPropertiesDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        savedProperties={savedProperties}
        onRemove={handleToggleSave}
        onSelectProperty={(prop) => {
          setSelectedProperty(prop);
          setSavedDrawerOpen(false);
        }}
      />

    </div>
  );
}
