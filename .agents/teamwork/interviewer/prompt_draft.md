This is a single self-contained fix; keep it small and focused. Provide comprehensive SEO analysis, Google search query guide, and keyword strategy for royalagraestate.in, explaining how users can find the site on Google, current SEO status, target keywords for the Agra real estate market, and how to inspect/test search results using Safari browser, and implement required on-page SEO code updates across the codebase.

Integrity mode: development

Reference Material:
- Brand Website: https://royalagraestate.in
- Market: Agra, Uttar Pradesh Real Estate Portal

## Requirements

### R1. Google Search Query & Discoverability Guide
Deliver an SEO guide documenting exact search queries and keywords that lead users to royalagraestate.in (brand-specific searches, navigational queries, and localized real estate terms), explaining how Google Search indexes the site and how users can discover it.

### R2. Real Estate Keyword Strategy & Analysis
Provide a structured keyword strategy for the Agra real estate market, categorizing high-priority target search terms across property types (plots, kothis/villas, agricultural land, commercial properties) and key Agra localities (e.g., Sikandra, Shastripuram, Dayalbagh, Fatehabad Road, Shamshabad Road).

### R3. On-Page SEO Codebase Implementation
Implement on-page SEO improvements within the codebase to strengthen search engine discoverability:
- Update HTML meta tags (title, description, canonical link, Open Graph, and Twitter tags) for search engine crawlers.
- Ensure production `robots.txt` and `sitemap.xml` are properly configured with valid site URLs and directives.
- Add structured data (JSON-LD schema for RealEstateAgent / WebSite) representing Royal Agra Estate.

### R4. Safari Browser Verification & Search Testing
Document verification procedures and conduct test queries to confirm Google search presence, site indexation, and ranking visibility on desktop and mobile Safari.

## Acceptance Criteria

### SEO Analysis & Search Query Guide
- [ ] A dedicated guide is produced documenting the exact Google queries that retrieve royalagraestate.in (brand queries, site: search queries, and local keyword combinations).
- [ ] Analysis identifies current Google indexation status and explains how search engines rank and surface the website.
- [ ] Prioritized list of target keywords for Agra real estate is provided, organized by search intent and property category.

### Codebase SEO Implementation
- [ ] `index.html` (and relevant document headers/templates) contains optimized meta title, meta description, canonical URL, and Open Graph tags tailored for royalagraestate.in.
- [ ] Structured data markup (JSON-LD) for RealEstateAgent / WebSite schema is embedded and validates against schema.org specifications.
- [ ] `robots.txt` and `sitemap.xml` exist in `public/`, specify valid URLs for https://royalagraestate.in, and allow appropriate crawler indexing.
- [ ] `npm run build` (and TypeScript check `npx tsc --noEmit`) passes with zero errors.

### Browser Verification
- [ ] Actionable inspection steps and test query results are provided for verifying Google Search listings and site behavior in Safari.
