import { ActiveScreen, FilterState, ListingType, PropertyType, Property } from '../types';

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
  '/plots-in-dayalbagh-agra': {
    path: '/plots-in-dayalbagh-agra',
    title: 'Plots in Dayalbagh Agra | Freehold Residential Land | Royal Agra Estate',
    description: 'Verified residential plots for sale in Dayalbagh, Agra. Close to Dayalbagh Educational Institute, clear ownership titles, gated colonies, immediate registry.',
    keywords: [
      'plots in dayalbagh agra',
      'dayalbagh agra property',
      'residential land dayalbagh',
      'freehold plots dayalbagh',
      'buy plot dayalbagh agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/plots-in-dayalbagh-agra',
    screen: 'properties',
    badgeTitle: 'Plots & Land in Dayalbagh, Agra',
    badgeSubtitle: "Verified residential plots in Dayalbagh's serene, educational, and high-demand residential sector.",
    filterOverrides: {
      listingType: 'Plots',
      locality: 'Dayalbagh'
    }
  },
  '/property-in-sikandra-agra': {
    path: '/property-in-sikandra-agra',
    title: 'Property in Sikandra Agra | Houses, Plots & Commercial Land | Royal Agra Estate',
    description: 'Explore verified houses, plots, and commercial properties in Sikandra, Agra. Strategic location near NH-19 Delhi-Agra Highway with clear registry papers.',
    keywords: [
      'property in sikandra agra',
      'plots in sikandra agra',
      'house for sale in sikandra agra',
      'sikandra real estate',
      'commercial property sikandra'
    ],
    canonicalUrl: 'https://royalagraestate.in/property-in-sikandra-agra',
    screen: 'properties',
    badgeTitle: 'Property in Sikandra, Agra',
    badgeSubtitle: 'Residential and commercial listings across Sikandra and Delhi-Agra Highway corridor.',
    filterOverrides: {
      locality: 'Sikandra'
    }
  },
  '/plots-in-shastripuram-agra': {
    path: '/plots-in-shastripuram-agra',
    title: 'Plots in Shastri Puram Agra | Verified Residential & Commercial Plots | Royal Agra Estate',
    description: 'Find verified residential plots and houses in Shastri Puram, Agra. Wide sector roads, clear titles, close to transport hubs and Sanjay Place.',
    keywords: [
      'plots in shastripuram agra',
      'shastri puram property',
      'house in shastripuram agra',
      'plots in agra',
      'freehold land shastripuram'
    ],
    canonicalUrl: 'https://royalagraestate.in/plots-in-shastripuram-agra',
    screen: 'properties',
    badgeTitle: 'Plots in Shastri Puram, Agra',
    badgeSubtitle: 'Prime residential and commercial plots in well-planned Shastri Puram sectors.',
    filterOverrides: {
      listingType: 'Plots',
      locality: 'Shastri Puram'
    }
  },
  '/plots-in-shamshabad-road-agra': {
    path: '/plots-in-shamshabad-road-agra',
    title: 'Plots in Shamshabad Road Agra | High-Growth Plotted Land | Royal Agra Estate',
    description: 'Investment-ready residential and commercial plots on Shamshabad Road, Agra. Rapidly developing corridor connecting to Ring Road and Lucknow Expressway.',
    keywords: [
      'plots in shamshabad road agra',
      'shamshabad road property agra',
      'land for sale shamshabad road',
      'investment plots agra',
      'residential land agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/plots-in-shamshabad-road-agra',
    screen: 'properties',
    badgeTitle: 'Plots on Shamshabad Road, Agra',
    badgeSubtitle: 'High-appreciation residential plots and investment land on Shamshabad Road growth corridor.',
    filterOverrides: {
      listingType: 'Plots',
      locality: 'Shamshabad Road'
    }
  },
  '/agricultural-land-in-agra': {
    path: '/agricultural-land-in-agra',
    title: 'Agricultural Land in Agra | Farmland & Highway Land for Sale | Royal Agra Estate',
    description: 'Verified agricultural land, farmhouses, and bulk acreage for sale in Agra. Clear Section 143 conversion potential along Agra-Lucknow and Yamuna Expressway.',
    keywords: [
      'agricultural land in agra',
      'farmland in agra',
      'land for sale in agra',
      'highway land agra',
      'farm house in agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/agricultural-land-in-agra',
    screen: 'properties',
    badgeTitle: 'Agricultural Land & Farmland in Agra',
    badgeSubtitle: 'Clear-title farmland, agro-investment parcels, and highway frontage land across Agra district.',
    filterOverrides: {
      listingType: 'Plots',
      searchQuery: 'Land'
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
 * Screen-level SEO configurations for standard catalogue screens
 */
export const SCREEN_SEO_CONFIGS: Partial<Record<ActiveScreen, {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
}>> = {
  properties: {
    title: 'Verified Properties for Sale & Rent in Agra | Royal Agra Estate',
    description: 'Explore verified plots, luxury villas, independent kothis, and commercial spaces across Agra. 100% legal title verification and direct concierge assistance.',
    keywords: [
      'property in agra',
      'buy house in agra',
      'plots in agra',
      'luxury villas agra',
      'flats for rent in agra',
      'real estate agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/?screen=properties'
  },
  projects: {
    title: 'Featured Real Estate Projects & Townships in Agra | Royal Agra Estate',
    description: 'Discover exclusive gated communities, integrated townships, and luxury residential projects along Fatehabad Road and Dayalbagh, Agra.',
    keywords: [
      'real estate projects in agra',
      'gated community agra',
      'townships in agra',
      'new housing projects agra',
      'luxury townships agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/?screen=projects'
  },
  about: {
    title: 'About Us | Royal Agra Estate - Agra\'s Premier Real Estate Advisory',
    description: 'Learn about Royal Agra Estate, Agra\'s leading verified luxury real estate consultancy. Transparent legal verification, no hidden brokerage, and end-to-end guidance.',
    keywords: [
      'about royal agra estate',
      'real estate consultant agra',
      'property dealer agra',
      'best real estate agent in agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/?screen=about'
  },
  contact: {
    title: 'Contact Concierge | Royal Agra Estate - Agra Property Advisory',
    description: 'Connect directly with Royal Agra Estate concierge at +91 91490 79913 or contact@royalagraestate.in for verified properties, site visits, and property sales in Agra.',
    keywords: [
      'contact royal agra estate',
      'property advisory contact agra',
      'real estate phone number agra',
      'fatehabad road real estate office'
    ],
    canonicalUrl: 'https://royalagraestate.in/?screen=contact'
  },
  'sell-rent': {
    title: 'Sell or Rent Property in Agra | Free Listing | Royal Agra Estate',
    description: 'Post your Agra property listing for free. Connect with genuine, verified buyers for plots, houses, and commercial land in Agra.',
    keywords: [
      'sell property in agra',
      'post property free agra',
      'list house in agra',
      'property dealer in agra'
    ],
    canonicalUrl: 'https://royalagraestate.in/?screen=sell-rent'
  }
};

/**
 * Builds property-specific dynamic SEO metadata
 */
export function getPropertySeoConfig(property: Property) {
  const formattedPrice = typeof property.price === 'number'
    ? '₹' + property.price.toLocaleString('en-IN')
    : property.price;
  const bhkStr = property.bedrooms ? `${property.bedrooms} BHK ` : '';
  const title = `${property.title} | ${property.locality}, Agra | Royal Agra Estate`;
  const description = `${property.title} in ${property.locality}, Agra. ${formattedPrice} - ${bhkStr}${property.propertyType}. 100% legally verified listing on Royal Agra Estate.`;
  const canonicalUrl = `https://royalagraestate.in/?screen=properties&property=${property.id}`;
  const imageUrl = (typeof property.coverImage === 'string' && property.coverImage.startsWith('http'))
    ? property.coverImage
    : 'https://royalagraestate.in/properties/harish_nagar_1.jpg';

  return {
    title,
    description,
    canonicalUrl,
    imageUrl,
    keywords: [
      property.title.toLowerCase(),
      `property in ${property.locality.toLowerCase()} agra`,
      `${property.propertyType.toLowerCase()} in agra`,
      'verified property agra'
    ]
  };
}

export interface ApplySeoOptions {
  seoConfig?: SeoRouteConfig | null;
  screen?: ActiveScreen | null;
  property?: Property | null;
  searchQuery?: string | null;
}

/**
 * Updates browser DOM <head> tags for SEO dynamically across routes, screens, and properties
 */
export function applySeoMetadata(target: SeoRouteConfig | ApplySeoOptions | null) {
  if (typeof document === 'undefined') return;

  const defaultTitle = 'Royal Agra Estate | Luxury Real Estate & Verified Properties in Agra';
  const defaultDesc = 'Discover verified luxury villas, ADA approved plots on Fatehabad Road, independent kothis, and commercial property across Agra with 100% legal title verification.';
  const defaultKeywords = 'buy house in agra, plots in fatehabad road agra, ada approved plots in agra, luxury villa in agra, flats for rent in agra, real estate agra, property in agra, plots in dayalbagh, plots in shastripuram agra';
  const defaultCanonical = 'https://royalagraestate.in/';
  const defaultImage = 'https://royalagraestate.in/properties/harish_nagar_1.jpg';

  let title = defaultTitle;
  let description = defaultDesc;
  let keywords = defaultKeywords;
  let canonical = defaultCanonical;
  let imageUrl = defaultImage;

  if (target) {
    if ('badgeTitle' in target) {
      // It's a SeoRouteConfig
      title = target.title;
      description = target.description;
      keywords = target.keywords.join(', ');
      canonical = target.canonicalUrl;
    } else {
      // It's an ApplySeoOptions
      if (target.property) {
        const propConfig = getPropertySeoConfig(target.property);
        title = propConfig.title;
        description = propConfig.description;
        keywords = propConfig.keywords.join(', ');
        canonical = propConfig.canonicalUrl;
        imageUrl = propConfig.imageUrl;
      } else if (target.seoConfig) {
        title = target.seoConfig.title;
        description = target.seoConfig.description;
        keywords = target.seoConfig.keywords.join(', ');
        canonical = target.seoConfig.canonicalUrl;
      } else if (target.screen && SCREEN_SEO_CONFIGS[target.screen]) {
        const scrConfig = SCREEN_SEO_CONFIGS[target.screen]!;
        title = scrConfig.title;
        description = scrConfig.description;
        keywords = scrConfig.keywords.join(', ');
        canonical = scrConfig.canonicalUrl;
      }

      if (target.searchQuery && target.screen === 'properties' && !target.property) {
        title = `Search: ${target.searchQuery} | Properties in Agra | Royal Agra Estate`;
        description = `Verified properties matching "${target.searchQuery}" in Agra. Clear legal titles and direct builder/owner listings on Royal Agra Estate.`;
        canonical = `https://royalagraestate.in/?screen=properties&search=${encodeURIComponent(target.searchQuery)}`;
      }
    }
  }

  // Document Title
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

  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', imageUrl);

  // Twitter tags
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', title);

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', description);

  const twUrl = document.querySelector('meta[name="twitter:url"]');
  if (twUrl) twUrl.setAttribute('content', canonical);

  const twImg = document.querySelector('meta[name="twitter:image"]');
  if (twImg) twImg.setAttribute('content', imageUrl);
}
