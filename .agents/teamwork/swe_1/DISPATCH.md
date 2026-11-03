## 2026-11-03T23:22:08Z

This is a single self-contained fix; keep it small and focused. Revise the primary Meta ad copy for Royal Agra Estate to cover the whole of Agra across all prime residential and expansion corridors, eliminating the previous restriction that singled out only two locations (Sikandra & Shastripuram), and update the marketing documentation accordingly.

Integrity mode: development

Reference Material:
- Brand Website: https://royalagraestate.in
- Meta Business Suite Ad Account: 1409561680502838, Asset ID: 1494761333710019
- Previous Primary Text: "Sikandra & Shastripuram ke prime residential enclaves mein verified independent kothis aur plots. 30-year registry check, genuine rates, aur direct connect. Aaj hi visit plan karein."
- Strategy & Guidelines Document: `docs/marketing_strategy.md`

## Requirements

### R1. Agra-Wide Primary Ad Text Formulations
Rewrite the primary Meta ad text so that any buyer or seller across Agra feels it is made for them, replacing the 2-location constraint with two production-ready copy formulations:
1. **All-Encompassing Citywide Copy**: An Agra-wide text focusing on verified independent kothis, luxury floors, and plots across all of Agra (e.g., using all-inclusive phrasing like "Poore Agra mein...", "Agra ke har prime corridor mein...").
2. **Multi-Corridor Listing Copy**: A comprehensive micro-market copy explicitly highlighting Agra's key prime areas and expansion corridors (including Dayalbagh, Kamla Nagar, Fatehabad Road, Sikandra, Shastripuram, Shamshabad Road, etc.).
Both versions must preserve core brand trust anchors: 30-year statutory registry/legal title checks, genuine direct rates, 100% address privacy, and direct connect to the concierge desk (+91 91490 79913).

### R2. Marketing Documentation & Copy Guidelines Update
Update `docs/marketing_strategy.md` and active ad copy guidelines to incorporate both new Agra-wide primary ad text versions, updating any corresponding headline variations, creative suite descriptions (such as Section 4.7), and hooks so that no ad copy single-focuses solely on Sikandra and Shastripuram without representing the whole city.

## Acceptance Criteria

### Ad Copy Coverage & Content
- [ ] Primary ad text is revised into two distinct options: one all-encompassing Agra-wide formulation and one multi-corridor formulation explicitly covering Agra's prime corridors (Dayalbagh, Kamla Nagar, Fatehabad Road, Sikandra, Shastripuram, Shamshabad Road).
- [ ] Neither new formulation limits exclusive focus to just Sikandra and Shastripuram.
- [ ] Both formulations maintain key trust anchors: verified independent kothis and plots, 30-year registry checks, genuine rates, direct connect, and address privacy.
- [ ] Accompanying headline and hook suggestions are provided for both formulations in conversational Hinglish suitable for Meta Ads (Feed, Reels, Stories).

### Documentation Updates
- [ ] `docs/marketing_strategy.md` is updated with the new Agra-wide primary text copy, headlines, and hooks.
- [ ] All references in creative guidelines that singled out only Sikandra & Shastripuram for mid-tier residential copy are updated to reflect whole-city coverage.


## 2026-11-03T23:23:17Z

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
- [ ] Structured data markup (JSON-LD schema for RealEstateAgent / WebSite) is embedded and validates against schema.org specifications.
- [ ] `robots.txt` and `sitemap.xml` exist in `public/`, specify valid URLs for https://royalagraestate.in, and allow appropriate crawler indexing.
- [ ] `npm run build` (and TypeScript check `npx tsc --noEmit`) passes with zero errors.

### Browser Verification
- [ ] Actionable inspection steps and test query results are provided for verifying Google Search listings and site behavior in Safari.
