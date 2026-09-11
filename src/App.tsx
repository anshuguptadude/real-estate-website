import React, { useState, useEffect, useRef } from 'react';
import { ActiveScreen, Property, Project, FilterState, PropertyType, ListingType, UserProfile } from './types';
import { isAdmin, getMaskedProperty, LeadSubmission } from './utils/security';
import { 
  subscribeFirestoreProperties,
  saveFirestoreProperty, 
  deleteFirestoreProperty, 
  subscribeFirestoreProjects,
  saveFirestoreProject, 
  deleteFirestoreProject, 
  subscribeFirestoreLeads,
  saveFirestoreLead,
  deleteFirestoreLead,
  saveFirestoreAccount,
  getDeletedPropertyIds,
  markPropertyAsDeletedLocally,
  clearDeletedPropertyIdsLocally,
  getPropertiesCache,
  setPropertiesCache,
  mergeWithUserListings
} from './services/firebaseService';
import { PROPERTIES_DATA } from './data/mockData';
import { LeadInquiryModal } from './components/LeadInquiryModal';
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
  const hasOpenedModalInApp = useRef(false);

  // User Authentication State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('royal_agra_user_profile_v2');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return null;
  });

  // Global Properties State (persisted locally and synced with Firebase Firestore)
  const [properties, setProperties] = useState<Property[]>(() => {
    const cached = getPropertiesCache();
    if (cached && cached.length > 0) {
      return cached.filter(p => !p.isDeleted);
    }
    return PROPERTIES_DATA;
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

  // Auto-migrate any local browser accounts to Cloud Firestore so they are accessible across all browsers/devices
  useEffect(() => {
    const migrateLocalAccountsToCloud = async () => {
      try {
        const stored = localStorage.getItem('royal_agra_accounts_v1');
        if (stored) {
          const accounts = JSON.parse(stored);
          if (Array.isArray(accounts)) {
            for (const acc of accounts) {
              await saveFirestoreAccount(acc);
            }
          }
        }
      } catch (err) {
        console.warn('Auto-sync local accounts error:', err);
      }
    };
    migrateLocalAccountsToCloud();
  }, []);

  // Subscribe to real-time Firestore updates for properties, projects, and leads across all devices globally
  useEffect(() => {
    const unsubscribeProps = subscribeFirestoreProperties(fetched => {
      if (fetched && fetched.length > 0) {
        const active = fetched.filter(p => !p.isDeleted);
        setProperties(active);
        setPropertiesCache(active);
      }
    });

    const unsubscribeProjects = subscribeFirestoreProjects(fetched => {
      if (fetched && fetched.length > 0) setProjectsList(fetched);
    });

    const unsubscribeLeads = subscribeFirestoreLeads(fetched => {
      if (fetched && fetched.length > 0) setLeads(fetched);
    });

    return () => {
      unsubscribeProps();
      unsubscribeProjects();
      unsubscribeLeads();
    };
  }, []);

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
      return stored ? JSON.parse(stored) : ['prop-harish-nagar-89'];
    } catch {
      return ['prop-harish-nagar-89'];
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

  // Leads State
  const [leads, setLeads] = useState<LeadSubmission[]>(() => {
    try {
      const stored = localStorage.getItem('royal_agra_leads_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('royal_agra_leads_v1', JSON.stringify(leads));
    } catch {
      // ignore
    }
  }, [leads]);

  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadModalProperty, setLeadModalProperty] = useState<Property | null>(null);

  const handleOpenLeadModal = (prop: Property | null = null) => {
    setLeadModalProperty(prop);
    setLeadModalOpen(true);
  };

  const handleLeadSubmitted = async (newLead: LeadSubmission) => {
    setLeads(prev => [newLead, ...prev]);
    await saveFirestoreLead(newLead);
  };

  const handleDeleteLead = async (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    await deleteFirestoreLead(leadId);
  };

  // Projects State (fetched directly from Firebase Firestore via real-time onSnapshot)
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  const handleAddProject = async (newProj: Project) => {
    await saveFirestoreProject(newProj);
  };

  const handleEditProject = async (updatedProj: Project) => {
    await saveFirestoreProject(updatedProj);
  };

  const handleDeleteProject = async (projId: string) => {
    await deleteFirestoreProject(projId);
  };

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
  const navigateTo = (screen: ActiveScreen, propertyId: string | null = null, addToHistory: boolean = true) => {
    if (screen === 'dashboard' && !user) {
      setLoginPromptMessage('Please log in or create an account to view your dashboard.');
      setPendingDashboardRedirect(true);
      setLoginModalOpen(true);
      return;
    }

    // Avoid pushing duplicate states into browser history
    const currentParams = new URLSearchParams(window.location.search);
    const currentScreen = currentParams.get('screen') || 'home';
    const currentProperty = currentParams.get('property');
    if (addToHistory && screen === currentScreen && propertyId === currentProperty) {
      return;
    }

    setActiveScreen(screen);
    
    if (propertyId) {
      const found = properties.find(p => p.id === propertyId);
      if (found) {
        setSelectedProperty(found);
        if (addToHistory) {
          hasOpenedModalInApp.current = true;
        }
      }
    } else {
      setSelectedProperty(null);
    }
    
    // Manage browser history
    if (addToHistory) {
      const url = new URL(window.location.href);
      url.searchParams.set('screen', screen);
      if (propertyId) {
        url.searchParams.set('property', propertyId);
      } else {
        url.searchParams.delete('property');
      }
      window.history.pushState({ screen, propertyId }, '', url.pathname + url.search);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClosePropertyDetail = () => {
    if (hasOpenedModalInApp.current) {
      hasOpenedModalInApp.current = false;
      window.history.back();
    } else {
      navigateTo(activeScreen, null);
    }
  };

  // Handle browser back button and initial load
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        const { screen, propertyId } = event.state;
        if (!propertyId) {
          hasOpenedModalInApp.current = false;
        }
        navigateTo(screen, propertyId, false);
      } else {
        // Handle case where state is null (initial load or browser default)
        const params = new URLSearchParams(window.location.search);
        const screen = (params.get('screen') as ActiveScreen) || 'home';
        const propertyId = params.get('property');
        hasOpenedModalInApp.current = false;
        navigateTo(screen, propertyId, false);
      }
    };

    // Initialize state on load
    const params = new URLSearchParams(window.location.search);
    const screen = (params.get('screen') as ActiveScreen) || 'home';
    const propertyId = params.get('property');
    
    // Set initial state without adding to history (it's already the current state)
    setActiveScreen(screen);
    
    // Replace current state with correct state object so popstate works for the first entry
    window.history.replaceState({ screen, propertyId }, '', window.location.pathname + window.location.search);

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const propertyId = params.get('property');
    if (propertyId && properties.length > 0) {
      const found = properties.find(p => p.id === propertyId);
      if (found) setSelectedProperty(found);
    }
  }, [properties]);

  // Protected Post Property trigger - directly navigates to Sell/Rent
  const handleInitiatePostProperty = () => {
    navigateTo('sell-rent');
  };

  const handleLoginSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setLoginModalOpen(false);
    setLoginPromptMessage(undefined);

    if (pendingPostRedirect) {
      setPendingPostRedirect(false);
      navigateTo('sell-rent');
    } else if (pendingDashboardRedirect) {
      setPendingDashboardRedirect(false);
      navigateTo('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    if (activeScreen === 'dashboard' || activeScreen === 'sell-rent') {
      navigateTo('home');
    }
  };

  // Property Management Handlers
  const handlePropertyCreated = async (newProp: Property): Promise<boolean> => {
    const isUserAdmin = isAdmin(user);
    const propToSave: Property = {
      ...newProp,
      isDeleted: false,
      status: isUserAdmin ? 'published' : (newProp.status || 'Pending Approval'),
      isApproved: isUserAdmin ? true : (newProp.isApproved ?? false),
      isUserListing: true
    };
    setProperties(prev => {
      const exists = prev.some(p => p.id === propToSave.id);
      const updated = exists ? prev.map(p => p.id === propToSave.id ? propToSave : p) : [propToSave, ...prev];
      setPropertiesCache(updated);
      return updated;
    });
    try {
      const success = await saveFirestoreProperty(propToSave);
      return success;
    } catch (e) {
      console.warn("Remote Firestore write error (saved locally):", e);
      return true;
    }
  };

  const handleSavePropertyEdit = async (updatedProperty: Property) => {
    const cleanUpdated: Property = {
      ...updatedProperty,
      isDeleted: false
    };
    setProperties(prev => {
      const nextList = prev.map(p => p.id === cleanUpdated.id ? cleanUpdated : p);
      setPropertiesCache(nextList);
      return nextList;
    });
    if (selectedProperty && selectedProperty.id === cleanUpdated.id) {
      setSelectedProperty(cleanUpdated);
    }
    await saveFirestoreProperty(cleanUpdated);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    // 1. Mark in persistent storage so page reloads or seed arrays never bring it back
    markPropertyAsDeletedLocally(propertyId);

    // 2. Remove immediately from local state and update local cache
    setProperties(prev => {
      const nextList = prev.filter(p => p.id !== propertyId);
      setPropertiesCache(nextList);
      return nextList;
    });

    // 3. Remove from favorites, compare list, and active modal
    setSavedPropertyIds(prev => prev.filter(id => id !== propertyId));
    setCompareList(prev => prev.filter(p => p.id !== propertyId));
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(null);
    }

    // 4. Trigger persistent soft-delete & hard-delete in Firestore
    await deleteFirestoreProperty(propertyId);
  };

  const handlePurgeDemoProperties = async () => {
    const demoIds = ['prop-1', 'prop-2', 'prop-3', 'prop-4', 'prop-5', 'prop-6', 'prop-7', 'prop-8'];
    demoIds.forEach(id => markPropertyAsDeletedLocally(id));

    setProperties(prev => {
      const nextList = prev.filter(p => !demoIds.includes(p.id));
      setPropertiesCache(nextList);
      return nextList;
    });

    for (const id of demoIds) {
      await deleteFirestoreProperty(id);
    }
  };

  const handleRestoreDefaultProperties = async () => {
    clearDeletedPropertyIdsLocally();
    const seeded = (PROPERTIES_DATA as Property[]).map((p, idx) => ({
      ...p,
      status: p.status || (idx === 3 ? 'Sold' : 'published'),
      isApproved: true,
      isDeleted: false,
      isUserListing: idx === 0 || idx === 2,
      ownerId: (idx === 0 || idx === 2) ? 'RAE-OWNER-01' : 'RAE-PARTNER-02',
      ownerName: (idx === 0 || idx === 2) ? 'Shrey Gupta' : p.agent?.name || 'Managing Partner'
    }));
    setProperties(seeded);
    setPropertiesCache(seeded);
    for (const prop of seeded) {
      await saveFirestoreProperty(prop);
    }
  };

  const handleTogglePropertyStatus = async (propertyId: string) => {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return;
    const current = prop.status || 'Active';
    const nextStatus = current === 'Active' 
      ? (prop.listingType === 'Rent' ? 'Rented' : 'Sold')
      : 'Active';
    const updated: Property = { ...prop, status: nextStatus, isApproved: true };
    setProperties(prev => {
      const nextList = prev.map(p => p.id === propertyId ? updated : p);
      setPropertiesCache(nextList);
      return nextList;
    });
    await saveFirestoreProperty(updated);
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
    if (!user) {
      setLoginPromptMessage('Please log in or create an account to save properties to your favorites.');
      setLoginModalOpen(true);
      return;
    }
    setSavedPropertyIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleInquireContact = async (property: Property) => {
    const newLead: LeadSubmission = {
      id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: property.id,
      propertyTitle: property.title,
      buyerName: user?.name || 'Prospective Buyer',
      phone: user?.phone || '+91 9149079913',
      email: user?.email || 'buyer@royalagraestate.in',
      preferredTime: 'Direct WhatsApp Inquire / Contact',
      timestamp: new Date().toLocaleString()
    };
    setLeads(prev => [newLead, ...prev]);
    await saveFirestoreLead(newLead);
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
    handleOpenLeadModal(prop);
  };

  const handleApproveProperty = async (propertyId: string) => {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return;
    const updated: Property = { 
      ...prop, 
      status: 'published',
      isApproved: true,
      verificationStatus: 'Verified'
    };
    // 1. Immediately update React state and persistent cache
    setProperties(prev => {
      const nextList = prev.map(p => p.id === propertyId ? updated : p);
      setPropertiesCache(nextList);
      return nextList;
    });
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(updated);
    }
    // 2. Persist to Firestore database
    await saveFirestoreProperty(updated);
  };

  const handleRejectProperty = async (propertyId: string) => {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return;
    const updated: Property = { 
      ...prop, 
      status: 'rejected',
      isApproved: false
    };
    setProperties(prev => {
      const nextList = prev.map(p => p.id === propertyId ? updated : p);
      setPropertiesCache(nextList);
      return nextList;
    });
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(updated);
    }
    await saveFirestoreProperty(updated);
  };

  const publicProperties = properties.filter(p => {
    if (!p || p.isDeleted) return false;

    // Admin can see all non-deleted properties
    if (isAdmin(user)) return true;

    // For public visitors on browse/buy/rent pages:
    // Only show published / approved / active listings
    const isApprovedOrPublished = p.isApproved === true || p.status === 'published' || p.status === 'Active' || p.status === 'Sold' || p.status === 'Rented';
    const isPendingOrRejected = p.status === 'Pending Approval' || p.status === 'pending_verification' || p.status === 'rejected' || p.isApproved === false;

    return isApprovedOrPublished && !isPendingOrRejected;
  });
  const displayedProperties = publicProperties.map(p => getMaskedProperty(p, user));
  const savedProperties = displayedProperties.filter(p => savedPropertyIds.includes(p.id));

  // Properties belonging to current user or all properties if admin
  const userProperties = isAdmin(user)
    ? properties.filter(p => !p.isDeleted)
    : properties.filter(p => {
        if (!p || p.isDeleted || !user) return false;
        const uId = user.id?.trim();
        const uEmail = user.email?.trim().toLowerCase();
        const uPhone = user.phone ? user.phone.replace(/[^0-9]/g, '') : '';
        const uName = user.name?.trim().toLowerCase();

        const pOwnerId = p.ownerId?.trim();
        const pUserId = p.userId?.trim();
        const pPostedById = p.postedBy?.id?.trim();
        const pEmail = p.ownerEmail?.trim().toLowerCase();
        const pPostedByEmail = p.postedBy?.email?.trim().toLowerCase();
        const pPhone = p.ownerContact ? p.ownerContact.replace(/[^0-9]/g, '') : '';
        const pOwnerName = p.ownerName?.trim().toLowerCase();
        const pPostedByName = p.postedBy?.name?.trim().toLowerCase();

        const matchId = Boolean(uId && (pOwnerId === uId || pUserId === uId || pPostedById === uId));
        const matchEmail = Boolean(
          (uEmail && pEmail && pEmail === uEmail) || 
          (uEmail && pPostedByEmail && pPostedByEmail === uEmail)
        );
        const matchPhone = Boolean(
          uPhone && pPhone && 
          (pPhone === uPhone || pPhone.endsWith(uPhone) || uPhone.endsWith(pPhone))
        );
        const matchName = Boolean(
          uName && pOwnerName && uName === pOwnerName && uName.length > 2
        ) || Boolean(
          uName && pPostedByName && uName === pPostedByName && uName.length > 2
        );

        return matchId || matchEmail || matchPhone || matchName;
      });

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
              properties={displayedProperties}
              onSelectProperty={(prop) => navigateTo(activeScreen, prop.id)}
              onToggleSave={handleToggleSave}
              savedIds={savedPropertyIds}
              onBookVisit={handleBookVisit}
              onExploreAll={() => navigateTo('properties')}
              onToggleCompare={handleToggleCompare}
              compareList={compareList}
              onInquireContact={handleInquireContact}
              isAdminUser={isAdmin(user)}
              onDeleteProperty={handleDeleteProperty}
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
            properties={displayedProperties}
            filterState={filterState}
            onUpdateFilters={(patch) => setFilterState(prev => ({ ...prev, ...patch }))}
            onResetFilters={() => setFilterState(initialFilterState)}
            onSelectProperty={(prop) => navigateTo(activeScreen, prop.id)}
            onToggleSave={handleToggleSave}
            savedIds={savedPropertyIds}
            onBookVisit={handleBookVisit}
            onToggleCompare={handleToggleCompare}
            compareList={compareList}
            onOpenCompareModal={() => setCompareModalOpen(true)}
            onInquireContact={handleInquireContact}
            isAdminUser={isAdmin(user)}
            onDeleteProperty={handleDeleteProperty}
          />
        )}

        {/* SCREEN: User Dashboard */}
        {activeScreen === 'dashboard' && (
          <UserDashboardScreen
            user={user}
            userProperties={userProperties}
            savedProperties={savedProperties}
            leads={leads}
            allProperties={properties}
            onUpdateProfile={async (updated) => {
              setUser(updated);
              await saveFirestoreAccount(updated);
            }}
            onEditProperty={(prop) => setEditingProperty(prop)}
            onDeleteProperty={handleDeleteProperty}
            onTogglePropertyStatus={handleTogglePropertyStatus}
            onApproveProperty={handleApproveProperty}
            onRejectProperty={handleRejectProperty}
            onViewProperty={(prop) => navigateTo('properties', prop.id)}
            onNavigatePostProperty={handleInitiatePostProperty}
            onNavigateProperties={() => navigateTo('properties')}
            onLogout={handleLogout}
            onDeleteLead={handleDeleteLead}
            onPurgeDemoProperties={handlePurgeDemoProperties}
            onRestoreDefaultProperties={handleRestoreDefaultProperties}
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
            projects={projectsList}
            isAdminUser={isAdmin(user)}
            onContactProject={() => {
              navigateTo('contact');
            }}
            onAddProject={handleAddProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
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

      {/* 4. Modals & Drawers */}
      
      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => navigateTo(activeScreen, null)}
        onBookVisit={handleBookVisit}
        onOpenEmiCalc={(price) => handleOpenEmiCalculator(price)}
        onToggleSave={handleToggleSave}
        isSaved={selectedProperty ? savedPropertyIds.includes(selectedProperty.id) : false}
        user={user}
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
          navigateTo(activeScreen, prop.id);
          setCompareModalOpen(false);
        }}
      />

      {/* Lead Generation & Tour Booking Modal */}
      <LeadInquiryModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        property={leadModalProperty}
        onLeadSubmitted={handleLeadSubmitted}
      />
      <SavedPropertiesDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        savedProperties={savedProperties}
        onRemove={handleToggleSave}
        onSelectProperty={(prop) => {
          navigateTo(activeScreen, prop.id);
          setSavedDrawerOpen(false);
        }}
      />

    </div>
  );
}
