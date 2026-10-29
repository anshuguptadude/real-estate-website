import React, { useState, useEffect, useRef } from 'react';
import { ActiveScreen, Property, FilterState, PropertyType, ListingType, UserProfile, Project, UserDashboardTab } from './types';
import { PROPERTIES_DATA, PROJECTS_DATA, INITIAL_LEADS } from './data/mockData';
import { isAdmin, isCEO, canViewFullAddress, getMaskedProperty, formatAgraLocality, LeadSubmission, canEditProperty, canDeleteProperty } from './utils/security';
import { 
  saveFirestoreAccount, 
  saveFirestoreProperty, 
  deleteFirestoreProperty, 
  saveFirestoreLead, 
  deleteFirestoreLead,
  saveFirestoreProject,
  deleteFirestoreProject,
  subscribeFirestoreProperties,
  subscribeFirestoreProjects,
  subscribeFirestoreLeads,
  getLocalDeletedPropertyIds,
  markPropertyDeletedLocally,
  getLocalDeletedProjectIds,
  markProjectDeletedLocally,
  clearDeletedProjectsTombstones,
  safeStorageSet
} from './services/firebaseService';
import { LeadInquiryModal } from './components/LeadInquiryModal';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedProperties } from './components/FeaturedProperties';
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
import { getSeoRouteConfig, applySeoMetadata, SeoRouteConfig } from './utils/seoRoutes';

const INITIAL_FILTER_STATE: FilterState = {
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

export default function App() {
  // SEO Route Configuration & Dynamic Metadata
  const [currentSeoConfig, setCurrentSeoConfig] = useState<SeoRouteConfig | null>(() => {
    return getSeoRouteConfig(window.location.pathname);
  });

  // Navigation & Screen state
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(() => {
    const seo = getSeoRouteConfig(window.location.pathname);
    if (seo) return seo.screen;
    const params = new URLSearchParams(window.location.search);
    const scr = params.get('screen');
    return scr ? (scr as ActiveScreen) : 'home';
  });

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

  // Normalize properties helper to guarantee privacy and consistency
  const normalizeProperty = (p: any, idx?: number): Property => {
    const primaryAgraLocality = formatAgraLocality(p.primaryAgraLocality || p.locality || p.location);
    const loc = primaryAgraLocality.replace(', Agra', '').trim();
    const fullAddress = p.fullAddress || (p.address && p.address !== primaryAgraLocality ? p.address : undefined);
    const defaultDates = ['09 Oct 2024', '07 Oct 2024', '04 Oct 2024', '28 Sep 2024', '22 Sep 2024', '15 Sep 2024'];
    const postedDate = p.postedDate || (idx !== undefined ? defaultDates[idx % defaultDates.length] : '09 Oct 2024');
    return {
      ...p,
      locality: loc,
      primaryAgraLocality,
      location: primaryAgraLocality,
      address: primaryAgraLocality,
      fullAddress: fullAddress || `${primaryAgraLocality}, Uttar Pradesh`,
      buildingName: p.buildingName || undefined,
      plotNumber: p.plotNumber || undefined,
      mapUrl: p.mapUrl || p.locationLink || p.googleMapsPinUrl || (p.coordinates ? `https://www.google.com/maps?q=${p.coordinates.lat},${p.coordinates.lng}` : undefined),
      locationLink: p.locationLink || p.mapUrl || p.googleMapsPinUrl || (p.coordinates ? `https://www.google.com/maps?q=${p.coordinates.lat},${p.coordinates.lng}` : undefined),
      googleMapsPinUrl: p.googleMapsPinUrl || p.mapUrl || p.locationLink || (p.coordinates ? `https://www.google.com/maps?q=${p.coordinates.lat},${p.coordinates.lng}` : undefined),
      landmarks: p.landmarks || [],
      status: p.status || (idx === 3 ? 'Sold' : 'Active'),
      postedDate: postedDate,
      createdAt: p.createdAt || new Date().toISOString()
    };
  };

  // Global Properties State (with persistence & user additions/edits)
  const [properties, setProperties] = useState<Property[]>(() => {
    const deletedIds = getLocalDeletedPropertyIds();
    try {
      const stored = localStorage.getItem('royal_agra_properties_v2');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          const filtered = parsed.filter(p => !deletedIds.has(p.id) && !p.isDeleted && p.status !== 'deleted');
          // Only use stored cache if it contains full images (> 200 chars), else prefer default PROPERTIES_DATA
          const hasFullImages = filtered.some(p => typeof p.coverImage === 'string' && p.coverImage.length > 200);
          if (filtered.length >= 5 && hasFullImages) {
            return filtered.map((p, idx) => normalizeProperty(p, idx));
          }
        }
      }
    } catch {
      // ignore
    }
    // Always fall back to PROPERTIES_DATA (which contains all 5 live posted properties with high-res images)
    return PROPERTIES_DATA
      .filter(p => !deletedIds.has(p.id))
      .map((p, idx) => normalizeProperty({
        ...p,
        status: p.status || (idx === 3 ? 'Sold' : 'Active'),
        isUserListing: true,
        ownerName: p.agent?.name || 'Managing Partner'
      }, idx));
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

  // Sync properties state to localStorage with quota safety (zero QuotaExceededError in mobile Safari)
  useEffect(() => {
    safeStorageSet('royal_agra_properties_v2', properties);
  }, [properties]);

  // Real-time Properties Synchronization with Hostinger Backend
  useEffect(() => {
    const unsubscribe = subscribeFirestoreProperties((firestoreProperties) => {
      const deletedIds = getLocalDeletedPropertyIds();
      if (Array.isArray(firestoreProperties) && firestoreProperties.length > 0) {
        const active = firestoreProperties.filter(p => !deletedIds.has(p.id) && !p.isDeleted && p.status !== 'deleted');
        if (active.length > 0) {
          const normalized = active.map((p, idx) => normalizeProperty(p, idx));
          setProperties(normalized);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Search & Filter state
  const initialFilterState: FilterState = INITIAL_FILTER_STATE;

  const [filterState, setFilterState] = useState<FilterState>(() => {
    const seo = getSeoRouteConfig(window.location.pathname);
    if (seo && seo.filterOverrides) {
      return {
        ...INITIAL_FILTER_STATE,
        ...seo.filterOverrides
      };
    }
    return INITIAL_FILTER_STATE;
  });

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

  // Leads State
  const [leads, setLeads] = useState<LeadSubmission[]>(() => {
    try {
      const stored = localStorage.getItem('royal_agra_leads_v1');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('royal_agra_leads_v1', JSON.stringify(leads));
    } catch {
      // ignore
    }
  }, [leads]);

  // Real-time Leads Synchronization with Cloud Firestore (Restricted strictly to CEO and Admins)
  useEffect(() => {
    if (!user || (!isAdmin(user) && !isCEO(user))) return;
    const unsubscribe = subscribeFirestoreLeads((firestoreLeads) => {
      if (Array.isArray(firestoreLeads)) {
        setLeads(firestoreLeads);
      }
    });
    return () => unsubscribe();
  }, [user]);

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

  // Projects State
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    const deletedProjectIds = getLocalDeletedProjectIds();
    try {
      const stored = localStorage.getItem('royal_agra_projects_v2');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(p => !deletedProjectIds.has(p.id));
          if (filtered.length > 0 || deletedProjectIds.size > 0 || parsed.length === 0) {
            return filtered.map(p => ({
              ...p,
              locality: formatAgraLocality(p.locality),
              unitConfigurations: Array.isArray(p.unitConfigurations) ? p.unitConfigurations : (p as any).typologies || ['Bespoke Residences'],
              highlights: Array.isArray(p.highlights) ? p.highlights : (p as any).features || ['Prime Agra Location', 'Clear Title Documentation', 'UP RERA Approved'],
              coverImage: p.coverImage || (p as any).image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'
            }));
          }
        }
      }
    } catch {}

    // If projects were explicitly deleted and none remain, do not restore defaults
    if (deletedProjectIds.size > 0) {
      return [];
    }

    return PROJECTS_DATA
      .filter(p => !deletedProjectIds.has(p.id))
      .map(p => ({
        ...p,
        locality: formatAgraLocality(p.locality),
        unitConfigurations: Array.isArray(p.unitConfigurations) ? p.unitConfigurations : ['Bespoke Residences'],
        highlights: Array.isArray(p.highlights) ? p.highlights : ['Prime Agra Location', 'Clear Title Documentation', 'UP RERA Approved']
      }));
  });

  useEffect(() => {
    try {
      localStorage.setItem('royal_agra_projects_v2', JSON.stringify(projectsList));
    } catch {}
  }, [projectsList]);

  // Real-time Projects Synchronization with Cloud Firestore
  useEffect(() => {
    const unsubscribe = subscribeFirestoreProjects((firestoreProjects) => {
      const deletedProjectIds = getLocalDeletedProjectIds();
      if (Array.isArray(firestoreProjects)) {
        if (firestoreProjects.length > 0) {
          const active = firestoreProjects.filter(p => !deletedProjectIds.has(p.id) && !(p as any).isDeleted);
          const normalized = active.map(p => ({
            ...p,
            locality: formatAgraLocality(p.locality),
            unitConfigurations: Array.isArray(p.unitConfigurations) ? p.unitConfigurations : (p as any).typologies || ['Bespoke Residences'],
            highlights: Array.isArray(p.highlights) ? p.highlights : (p as any).features || ['Prime Agra Location', 'Clear Title Documentation', 'UP RERA Approved'],
            coverImage: p.coverImage || (p as any).image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'
          }));
          setProjectsList(normalized);
        } else if (deletedProjectIds.size > 0) {
          setProjectsList([]);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddProject = async (newProj: Project) => {
    setProjectsList(prev => [newProj, ...prev]);
    await saveFirestoreProject(newProj);
  };

  const handleEditProject = async (updatedProj: Project) => {
    setProjectsList(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
    await saveFirestoreProject(updatedProj);
  };

  const handleDeleteProject = async (projId: string) => {
    markProjectDeletedLocally(projId);
    setProjectsList(prev => prev.filter(p => p.id !== projId));
    await deleteFirestoreProject(projId);
  };

  const handleRestoreDefaultProjects = async () => {
    clearDeletedProjectsTombstones();
    const restored = PROJECTS_DATA.map(p => ({
      ...p,
      locality: formatAgraLocality(p.locality),
      unitConfigurations: Array.isArray(p.unitConfigurations) ? p.unitConfigurations : ['Bespoke Residences'],
      highlights: Array.isArray(p.highlights) ? p.highlights : ['Prime Agra Location', 'Clear Title Documentation', 'UP RERA Approved']
    }));
    setProjectsList(restored);
    try {
      localStorage.setItem('royal_agra_projects_v2', JSON.stringify(restored));
    } catch {}
    for (const proj of restored) {
      await saveFirestoreProject(proj);
    }
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

  const [dashboardInitialTab, setDashboardInitialTab] = useState<UserDashboardTab>('listings');

  // Scroll to top on screen change
  const navigateTo = (
    screen: ActiveScreen, 
    propertyId: string | null = null, 
    targetTabOrAddToHistory?: UserDashboardTab | boolean | null,
    maybeAddToHistory: boolean = true
  ) => {
    let targetTab: UserDashboardTab | undefined;
    let addToHistory = true;
    if (typeof targetTabOrAddToHistory === 'boolean') {
      addToHistory = targetTabOrAddToHistory;
    } else if (typeof targetTabOrAddToHistory === 'string') {
      targetTab = targetTabOrAddToHistory;
      addToHistory = maybeAddToHistory;
    }
    if (targetTab) {
      setDashboardInitialTab(targetTab);
    }

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

    // Reset SEO state when navigating away to another screen
    if (currentSeoConfig) {
      setCurrentSeoConfig(null);
      applySeoMetadata(null);
    }

    // Avoid pushing duplicate states into browser history
    const currentParams = new URLSearchParams(window.location.search);
    const currentScreen = currentParams.get('screen') || 'home';
    const currentProperty = currentParams.get('property');
    if (addToHistory && screen === currentScreen && propertyId === currentProperty && window.location.pathname === '/') {
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
      url.pathname = '/';
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

  // Helper: Safely normalize screen aliases and prevent blank screens
  const normalizeScreenName = (s: string | null): ActiveScreen => {
    if (!s) return 'home';
    const clean = s.trim().toLowerCase();
    if (['sell-rent', 'sell', 'rent', 'post-property', 'post', 'postproperty', 'post_property'].includes(clean)) {
      return 'sell-rent';
    }
    if (['properties', 'property', 'buy', 'listings', 'search'].includes(clean)) {
      return 'properties';
    }
    if (clean === 'projects' || clean === 'project') return 'projects';
    if (clean === 'about' || clean === 'contact' || clean === 'dashboard' || clean === 'home') {
      return clean as ActiveScreen;
    }
    return 'home';
  };

  // Intercept clicks on internal SEO links (<a href="/plots-in-fatehabad-road-agra">)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('?')) {
        return;
      }

      const seo = getSeoRouteConfig(href);
      if (seo) {
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
          e.preventDefault();
          setCurrentSeoConfig(seo);
          applySeoMetadata(seo);
          setActiveScreen(seo.screen);
          if (seo.filterOverrides) {
            setFilterState({
              ...INITIAL_FILTER_STATE,
              ...seo.filterOverrides
            });
          }
          setSelectedProperty(null);
          window.history.pushState({ screen: seo.screen }, '', seo.path);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Handle browser back button and initial load
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const seo = getSeoRouteConfig(window.location.pathname);
      if (seo) {
        setCurrentSeoConfig(seo);
        applySeoMetadata(seo);
        setActiveScreen(seo.screen);
        if (seo.filterOverrides) {
          setFilterState({
            ...INITIAL_FILTER_STATE,
            ...seo.filterOverrides
          });
        }
        setSelectedProperty(null);
        hasOpenedModalInApp.current = false;
        return;
      }

      setCurrentSeoConfig(null);
      applySeoMetadata(null);

      if (event.state) {
        const { screen, propertyId } = event.state;
        if (!propertyId) {
          hasOpenedModalInApp.current = false;
        }
        navigateTo(normalizeScreenName(screen), propertyId, false);
      } else {
        // Handle case where state is null (initial load or browser default)
        const params = new URLSearchParams(window.location.search);
        const screen = normalizeScreenName(params.get('screen'));
        const propertyId = params.get('property');
        hasOpenedModalInApp.current = false;
        navigateTo(screen, propertyId, false);
      }
    };

    // Initialize state on load
    const seo = getSeoRouteConfig(window.location.pathname);
    if (seo) {
      setCurrentSeoConfig(seo);
      applySeoMetadata(seo);
      setActiveScreen(seo.screen);
      if (seo.filterOverrides) {
        setFilterState({
          ...INITIAL_FILTER_STATE,
          ...seo.filterOverrides
        });
      }
    } else {
      applySeoMetadata(null);
    }

    const params = new URLSearchParams(window.location.search);
    const screen = seo ? seo.screen : normalizeScreenName(params.get('screen'));
    const propertyId = params.get('property');
    
    // Set initial state without adding to history (it's already the current state)
    setActiveScreen(screen);
    if (propertyId) {
      const found = properties.find(p => p.id === propertyId);
      if (found) setSelectedProperty(found);
    }
    
    // Replace current state with correct state object so popstate works for the first entry
    window.history.replaceState({ screen, propertyId }, '', window.location.pathname + window.location.search);

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [properties, user]); 

  // Protected Post Property trigger
  const handleInitiatePostProperty = () => {
    if (!user) {
      setLoginPromptMessage('Please log in or create an account to post a property listing in Agra.');
      setPendingPostRedirect(true);
      setLoginModalOpen(true);
    } else {
      navigateTo('sell-rent');
    }
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
  const handlePropertyCreated = async (newProp: Property) => {
    const normalized = normalizeProperty(newProp);
    setProperties(prev => [normalized, ...prev]);
    await saveFirestoreProperty(normalized);
  };

  const handleSavePropertyEdit = async (updatedProperty: Property) => {
    const normalized = normalizeProperty(updatedProperty);
    setProperties(prev => prev.map(p => (p.id === normalized.id ? normalized : p)));
    if (selectedProperty && selectedProperty.id === normalized.id) {
      setSelectedProperty(normalized);
    }
    await saveFirestoreProperty(normalized);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    const targetProp = properties.find(p => p.id === propertyId);
    if (targetProp && !canDeleteProperty(user, targetProp)) {
      alert("Unauthorized: You can only delete properties that you personally posted.");
      return;
    }

    // 1. Immediately record in persistent local tombstones
    markPropertyDeletedLocally(propertyId);

    // 2. Remove immediately from React state and localStorage
    setProperties(prev => {
      const updated = prev.filter(p => p.id !== propertyId);
      try {
        localStorage.setItem('royal_agra_properties_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setSavedPropertyIds(prev => prev.filter(id => id !== propertyId));
    setCompareList(prev => prev.filter(p => p.id !== propertyId));
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(null);
    }

    // 3. Delete from Cloud Firestore and record permanent cloud tombstone
    await deleteFirestoreProperty(propertyId);
  };

  const handleApproveProperty = async (propertyId: string) => {
    let approvedProp: Property | null = null;
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        approvedProp = {
          ...p,
          status: 'Active',
          verified: true,
          verificationStatus: 'Verified',
          isApproved: true
        };
        return approvedProp;
      }
      return p;
    }));
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(prev => prev ? {
        ...prev,
        status: 'Active',
        verified: true,
        verificationStatus: 'Verified',
        isApproved: true
      } : null);
    }
    if (approvedProp) {
      await saveFirestoreProperty(approvedProp);
    }
  };

  const handleTogglePropertyStatus = async (propertyId: string) => {
    let toggledProp: Property | null = null;
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const current = p.status || 'Active';
        const nextStatus = current === 'Active' 
          ? (p.listingType === 'Rent' ? 'Rented' : 'Sold')
          : 'Active';
        toggledProp = { ...p, status: nextStatus };
        return toggledProp;
      }
      return p;
    }));
    if (selectedProperty && selectedProperty.id === propertyId && toggledProp) {
      setSelectedProperty(toggledProp);
    }
    if (toggledProp) {
      await saveFirestoreProperty(toggledProp);
    }
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

  const handleInquireContact = (property: Property) => {
    setLeadModalProperty(property);
    setLeadModalOpen(true);
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

  // Public / non-admin users only see approved active, sold, or rented properties, strictly masked.
  // Properties pending admin approval must never appear on public screens.
  const displayedProperties = properties
    .filter(p => {
      if (p.isDeleted || p.status === 'deleted' || p.status === 'rejected') return false;
      if (isAdmin(user)) return true;
      if (p.status === 'Pending Approval' || p.status === 'pending_verification' || p.isApproved === false) {
        return false;
      }
      return (p.status === 'Active' || p.status === 'published' || p.status === 'Sold' || p.status === 'Rented');
    })
    .map(p => getMaskedProperty(p, user));

  const savedProperties = displayedProperties.filter(p => savedPropertyIds.includes(p.id));

  // Properties belonging to current user or all properties if admin or CEO
  const userProperties = (isAdmin(user) || isCEO(user))
    ? properties
    : properties.filter(p => {
        if (!user) return false;
        const userEmail = user.email?.toLowerCase().trim();
        const ownerEmail = p.ownerEmail?.toLowerCase().trim();
        const userId = user.id?.trim();
        const ownerId = p.ownerId?.trim();
        return Boolean((userId && ownerId && userId === ownerId) || (userEmail && ownerEmail && userEmail === ownerEmail));
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
              onApproveProperty={handleApproveProperty}
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
            onResetFilters={() => {
              if (currentSeoConfig) {
                setCurrentSeoConfig(null);
                applySeoMetadata(null);
                const url = new URL(window.location.href);
                url.pathname = '/';
                url.searchParams.set('screen', 'properties');
                window.history.pushState({ screen: 'properties' }, '', url.pathname + url.search);
              }
              setFilterState(INITIAL_FILTER_STATE);
            }}
            seoHeader={currentSeoConfig ? {
              title: currentSeoConfig.badgeTitle,
              subtitle: currentSeoConfig.badgeSubtitle,
              onClear: () => {
                setCurrentSeoConfig(null);
                applySeoMetadata(null);
                setFilterState(INITIAL_FILTER_STATE);
                const url = new URL(window.location.href);
                url.pathname = '/';
                url.searchParams.set('screen', 'properties');
                window.history.pushState({ screen: 'properties' }, '', url.pathname + url.search);
              }
            } : undefined}
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
            onApproveProperty={handleApproveProperty}
          />
        )}

        {/* SCREEN: User Dashboard */}
        {activeScreen === 'dashboard' && (
          <UserDashboardScreen
            key={`${dashboardInitialTab}-${user?.id || 'guest'}`}
            initialTab={dashboardInitialTab}
            user={user}
            userProperties={userProperties}
            savedProperties={savedProperties}
            leads={leads}
            allProperties={properties}
            onUpdateProfile={async (updated) => {
              setUser(updated);
              await saveFirestoreAccount(updated);
            }}
            onEditProperty={(prop) => {
              if (!canEditProperty(user, prop)) {
                alert("Unauthorized: You can only edit properties that you personally posted.");
                return;
              }
              setEditingProperty(prop);
            }}
            onDeleteProperty={handleDeleteProperty}
            onTogglePropertyStatus={handleTogglePropertyStatus}
            onViewProperty={(prop) => navigateTo('properties', prop.id)}
            onNavigatePostProperty={handleInitiatePostProperty}
            onNavigateProperties={() => navigateTo('properties')}
            onLogout={handleLogout}
            onDeleteLead={handleDeleteLead}
            onApproveProperty={handleApproveProperty}
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
            onRestoreDefaults={handleRestoreDefaultProjects}
          />
        )}

        {/* SCREEN: About & Heritage */}
        {activeScreen === 'about' && (
          <AboutScreen />
        )}

        {/* SCREEN: Contact */}
        {activeScreen === 'contact' && (
          <ContactScreen user={user} />
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
        property={selectedProperty ? (canViewFullAddress(selectedProperty, user) ? selectedProperty : getMaskedProperty(selectedProperty, user)) : null}
        onClose={() => navigateTo(activeScreen, null)}
        onBookVisit={handleBookVisit}
        onOpenEmiCalc={(price) => handleOpenEmiCalculator(price)}
        onToggleSave={handleToggleSave}
        isSaved={selectedProperty ? savedPropertyIds.includes(selectedProperty.id) : false}
        isAdminUser={canViewFullAddress(selectedProperty, user)}
        onApproveProperty={handleApproveProperty}
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
        user={user}
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
        compareList={compareList.map(p => getMaskedProperty(p, user))}
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
        property={leadModalProperty ? getMaskedProperty(leadModalProperty, user) : null}
        onLeadSubmitted={handleLeadSubmitted}
        user={user}
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

      {/* Global Floating Comparison Indicator / Trigger */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 bg-[#0F382C] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-[#E4D5B7]/40 transition-all">
          <span className="text-xs font-semibold text-[#E4D5B7]">
            Comparing ({compareList.length}/3)
          </span>
          <button
            type="button"
            id="floating-compare-btn"
            onClick={() => setCompareModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#C5A869] hover:bg-[#d6ba7b] text-[#0F382C] text-xs font-bold rounded-full transition-all shadow-sm"
          >
            Compare Now
          </button>
          <button
            type="button"
            onClick={() => setCompareList([])}
            className="text-gray-300 hover:text-white text-xs px-1"
            title="Clear Comparison"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
