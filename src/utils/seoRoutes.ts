import { ActiveScreen, FilterState, ListingType, PropertyType } from '../types';

export interface SeoRouteConfig {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  screen: ActiveScreen;
  badgeTitle: string;
  badgeSubtitle: string;
  filterOverrides?: Partial<FilterState>;
}

export const SEO_ROUTES: Record<string, SeoRouteConfig> = {
  '/plots-in-fatehabad-road-agra': {
    path: '/plots-in-fatehabad-road-agra',
    title: 'Plots in Fatehabad Road Agra | Verified ADA Approved Land | Royal Agra Estate',
    description: 'Find verified residential and commercial plots for sale in Fatehabad Road, Agra. Clear titles, direct builder contact, ADA approved plots near Taj Expressway.',
    keywords: [
      'plots in fatehabad road agra',
      'plots in agra',
      'residential plots fatehabad road',
      'ada approved plots agra',
      'land for sale in agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/plots-in-fatehabad-road-agra',
    screen: 'properties',
    badgeTitle: 'Plots in Fatehabad Road, Agra',
    badgeSubtitle: "Curated verified residential and commercial plots along Agra's prime Taj growth corridor.",
    filterOverrides: {
      listingType: 'Plots',
      locality: 'Fatehabad Road',
      searchQuery: ''
    }
  },
  '/ada-approved-plots-in-agra': {
    path: '/ada-approved-plots-in-agra',
    title: 'ADA Approved Plots in Agra | 100% Verified Freehold Land | Royal Agra Estate',
    description: 'Explore 100% ADA approved plots in Agra across Fatehabad Road, Dayalbagh, and Shastri Puram. Bank loan approved, registry ready with transparent legal paperwork.',
    keywords: [
      'ada approved plots in agra',
      'ada approved land agra',
      'freehold plots in agra',
      'verified plots in agra',
      'bank loan approved plots agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/ada-approved-plots-in-agra',
    screen: 'properties',
    badgeTitle: 'ADA Approved Plots in Agra',
    badgeSubtitle: 'Verified freehold plots with Agra Development Authority approvals and bank loan clearances.',
    filterOverrides: {
      listingType: 'Plots',
      searchQuery: 'ADA'
    }
  },
  '/buy-house-in-agra': {
    path: '/buy-house-in-agra',
    title: 'House for Sale in Agra | Buy Independent Houses & Kothis | Royal Agra Estate',
    description: 'Browse independent houses, luxury kothis, and duplex villas for sale in Agra. Ready to move, gated society houses in Dayalbagh, Kamla Nagar, and Shastri Puram.',
    keywords: [
      'buy house in agra',
      'house for sale in agra',
      'independent house in agra',
      'kothi for sale in agra',
      'ready to move house agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/buy-house-in-agra',
    screen: 'properties',
    badgeTitle: 'Independent Houses for Sale in Agra',
    badgeSubtitle: 'Explore ready-to-move independent houses, duplex homes, and luxury kothis in prime Agra localities.',
    filterOverrides: {
      listingType: 'Buy',
      propertyType: 'Independent House / Kothi'
    }
  },
  '/luxury-villas-in-agra': {
    path: '/luxury-villas-in-agra',
    title: 'Luxury Villas in Agra | Gated Township & Designer Homes | Royal Agra Estate',
    description: 'Exclusive luxury villas for sale in Agra with private gardens, clubhouses, and premium amenities. Handpicked luxury properties in Taj Nagari and Fatehabad Road.',
    keywords: [
      'luxury villa in agra',
      'villas for sale in agra',
      'gated community villa agra',
      'luxury homes agra',
      'duplex villa in agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/luxury-villas-in-agra',
    screen: 'properties',
    badgeTitle: 'Luxury Villas & Estates in Agra',
    badgeSubtitle: "Premier designer villas and luxury homes with bespoke architecture in Agra's finest neighborhoods.",
    filterOverrides: {
      listingType: 'Buy',
      propertyType: 'Luxury Villa',
      sortBy: 'price-desc'
    }
  },
  '/flats-for-rent-in-agra': {
    path: '/flats-for-rent-in-agra',
    title: 'Flats for Rent in Agra | 1, 2, 3 BHK Rental Apartments | Royal Agra Estate',
    description: 'Find verified flats for rent in Agra. Fully furnished and semi-furnished 1 BHK, 2 BHK, and 3 BHK rental apartments in Dayalbagh, Sanjay Place, and Kamla Nagar.',
    keywords: [
      'flats for rent in agra',
      'flat on rent in agra',
      '2 bhk flat on rent in agra',
      'house for rent in agra',
      'furnished flat agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/flats-for-rent-in-agra',
    screen: 'properties',
    badgeTitle: 'Flats & Houses for Rent in Agra',
    badgeSubtitle: 'Verified rental homes, furnished apartments, and family residences across top Agra neighborhoods.',
    filterOverrides: {
      listingType: 'Rent'
    }
  },
  '/commercial-property-in-agra': {
    path: '/commercial-property-in-agra',
    title: 'Commercial Property in Agra | Shops, Showrooms & Offices | Royal Agra Estate',
    description: 'High-ROI commercial properties for sale and lease in Agra. Retail shops, office spaces in Sanjay Place, and commercial land along major highways.',
    keywords: [
      'commercial property in agra',
      'shops for sale in agra',
      'office space in agra',
      'commercial showroom agra',
      'commercial land agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/commercial-property-in-agra',
    screen: 'properties',
    badgeTitle: 'Commercial Properties in Agra',
    badgeSubtitle: "High-yield retail showrooms, office spaces, and commercial plots in Agra's business hubs.",
    filterOverrides: {
      listingType: 'Commercial'
    }
  },
  '/sell-property-in-agra': {
    path: '/sell-property-in-agra',
    title: 'Sell Property in Agra | Free Property Listing | Royal Agra Estate',
    description: 'Post your property for free in Agra. Connect with verified genuine buyers for plots, flats, houses, and commercial land with zero hassle.',
    keywords: [
      'sell property in agra',
      'post property free agra',
      'property dealer in agra',
      'real estate agent in agra',
      'free property listing agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/sell-property-in-agra',
    screen: 'sell-rent',
    badgeTitle: 'Post & Sell Property in Agra',
    badgeSubtitle: 'List your property in 60 seconds. Reach thousands of verified Agra buyers and investors directly.',
    filterOverrides: {}
  }
};

/**
 * Normalizes URL path and returns matching SEO route configuration if found
 */
export function getSeoRouteConfig(pathname: string): SeoRouteConfig | null {
  if (!pathname) return null;
  const cleanPath = pathname.replace(/\/+$/, '').toLowerCase();
  return SEO_ROUTES[cleanPath] || null;
}

/**
 * Updates browser DOM <head> tags for SEO dynamically
 */
export function applySeoMetadata(config: SeoRouteConfig | null) {
  if (typeof document === 'undefined') return;

  const defaultTitle = 'Royal Agra Estate | Luxury Real Estate & Verified Properties in Agra';
  const defaultDesc = 'Discover luxury villas, independent houses, ADA approved residential plots, and apartments for sale & rent across Agra. 100% verified legal paperwork.';
  const defaultKeywords = 'real estate agra, property in agra, buy house agra, plots in agra, luxury villa agra';
  const defaultCanonical = 'https://royalagraestate.in/';

  const title = config ? config.title : defaultTitle;
  const description = config ? config.description : defaultDesc;
  const keywords = config ? config.keywords.join(', ') : defaultKeywords;
  const canonical = config ? config.canonicalUrl : defaultCanonical;

  // Title
  document.title = title;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // Meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute('content', keywords);

  // Canonical Link
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonical);

  // OpenGraph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', canonical);
}
