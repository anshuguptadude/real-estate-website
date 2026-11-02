# Royal Agra Estate — Comprehensive Live Website Audit Report: Buyer Journey & Safari Evaluation

**Target URL**: [https://royalagraestate.in](https://royalagraestate.in)  
**Audit Perspective**: Affluent Prospective Luxury Property Buyer in Agra (HNI, NRI, Executive)  
**Testing Environment**: Safari Browser on macOS (Version 27.0.1, WebKit engine, Viewport testing 390px to 1440px)  
**Date of Audit**: October 30, 2026  
**Auditor**: Teamwork Explorer (Buyer Journey, UX & Security Audit)

---

## 1. Executive Summary

Royal Agra Estate positions itself as *"The Premier Luxury Realty Portal in Agra"*, catering to high-net-worth individuals (HNIs), non-resident Indians (NRIs), doctors, industrialists, and discerning investors seeking ultra-luxury villas, ADA-approved freehold plots, and heritage kothis in prime Agra localities (Dayalbagh, Fatehabad Road, Shamshabad Road, Civil Lines).

While the visual aesthetic features sophisticated emerald (`#0F382C`) and champage-gold (`#C5A869`) paletting with serif typography (`Playfair Display`, `Cinzel`), the live website presents **critical security vulnerabilities, fatal runtime crash bugs, severe address privacy leaks, and significant user journey disconnects** that immediately undermine confidence for affluent buyers.

### Key Audit Findings at a Glance:
1. **P0 Fatal Crash Bug (Unhandled TypeError)**: A runtime crash (`undefined is not an object (evaluating 'n.pricePerSqFt.toLocaleString')`) in `PropertyCard.tsx:124` triggers React's `ErrorBoundary` and renders a full-page crash screen whenever any listing with missing `pricePerSqFt` is served.
2. **P0 Severe Location Privacy & PII Leak**: The backend endpoint `https://royalagraestate.in/api/properties.php` sends raw unmasked data across the public internet. Any visitor inspecting network traffic or browser `localStorage` can see exact street addresses, plot numbers, direct seller names, personal mobile numbers, and private Google Maps pin URLs.
3. **P0 Critical Master Credential Exposure**: The API endpoint `https://royalagraestate.in/api/accounts.php` is completely unauthenticated and exposes plaintext passwords of CEO (`shrey123@gmail.com`) and Admin (`abhi9557138449@gmail.com`), along with registered users' passwords, security questions, and phone numbers.
4. **P1 Search & Locality Inventory Disconnect**: Prime luxury corridors promoted prominently on the homepage hero banner (Fatehabad Road, Dayalbagh, Civil Lines) return **zero matching properties**, while the actual 5-6 active listings are concentrated in Sikandra, Bichpuri, and Shastripuram.
5. **P1 Luxury Branding Dilution**: The "Featured Luxury Estates" carousel displays an ₹11,000/month rental flat, and listings carry raw, unprofessional titles such as *"88, Harish Nagar"* (revealing the house number) and *"Kargil Petrol Pump"*. Furthermore, Co-Founder Abhishek Singh Jadon's profile on the About page displays an empty placeholder box reading *"PHOTO"*.
6. **P1 Deceptive E-Brochure Download**: Clicking *"Download E-Brochure (PDF)"* on developer projects downloads a plain `.txt` text file (`_Brochure.txt`) with ASCII dividers rather than an architectural PDF.
7. **P2 Concierge & WhatsApp Flow**: While WhatsApp links to `+91 91490 79913` function properly on property cards and the contact screen, the `PropertyDetailModal` lacks any direct one-click WhatsApp button.

---

## 2. Buyer Persona & Context

To evaluate the site authentically, the audit adopted the mental model of **Vikram Singhania**, an affluent industrialist/NRI looking to acquire a ₹2.5 Cr – ₹6.0 Cr signature villa or a freehold residential plot along the Fatehabad Road or Dayalbagh corridors in Agra:
* **Expectations**: Absolute discretion, flawless responsiveness in Safari on Mac/iPhone, authentic architectural specifications, verified legal title credentials, seamless WhatsApp concierge access, and strict location confidentiality before a scheduled site visit.
* **Sensitivity**: Extremely sensitive to data security, unprofessional listing titles, fake/test data, broken filters, and copy-pasted marketing claims.

---

## 3. Detailed Audit Findings

### 3.1. Homepage Exploration & Luxury Branding

#### Observations:
* **Visual Styling & Typography**: The header, hero background, and brand colors (`#0F382C`, `#FAF8F5`, `#C5A869`) convey an upscale luxury tone. Serif headings in `Playfair Display` evoke heritage luxury fitting for Agra.
* **Hero Value Proposition Disconnect**:
  * The Hero section proclaims: *"Discover Agra’s Most Exclusive Residences — ADA approved plots on Fatehabad Road, luxury villas in Dayalbagh"*.
  * The search dropdowns prominently list *Fatehabad Road, Dayalbagh, Tajganj (Taj Corridor), Civil Lines, Kamla Nagar, Shamshabad Road*.
  * However, executing any search for *Fatehabad Road, Dayalbagh, or Civil Lines* yields **"Showing 0 luxury properties in Agra with verified clear titles. No matching luxury properties found."**
* **Featured Properties Dilution**:
  * Instead of curated ₹3 Cr – ₹10 Cr luxury estates, the 6 featured cards display:
    1. `88, Harish Nagar` (House in Sikandra, ₹1.05 Cr) — Title displays the plot/house number "88".
    2. `Shri Giriraj ji Dham Colony` (House in Bichpuri, ₹40.00 Lacs) — Typo in snippet: *"Bichpuri, Agra, Agra."*
    3. `Near Industrial Area Shastripuram` (Plot in Shastripuram, ₹97.50 Lacs) — Unbranded generic descriptive phrase.
    4. `Kargil Petrol Pump` (Villa in Shastripuram, ₹1.85 Cr) — Luxury villa titled after a local petrol pump.
    5. `Shastripuram` (Villa in Shastripuram, ₹1.75 Cr) — Duplicate generic locality title.
    6. `Shastripuram` (Rental flat, ₹11,000/mo) — A budget rental flat featured alongside multi-crore estates.
* **Why Agra's Elite Section**:
  * Pillar 2 reads: *"5–6 Years of Market Discretion & Advisory"*. The phrasing *"5–6 Years"* appears colloquial and hesitant compared to industry-standard phrasing such as *"Over Half a Decade of Market Discretion"*.

---

### 3.2. Property Search & Filtering Audit

#### Observations:
* **Search Functionality**:
  * Entering keywords like *"Dayalbagh"*, *"Fatehabad"*, or *"Civil Lines"* returns 0 results.
  * Entering *"Villa"* correctly filters down to the 2 villas in Shastripuram.
* **Property Type Buttons Mismatch**:
  * On the Properties Screen (`?screen=properties`), Property Types are rendered as a sidebar list of 17 options:
    `'All', 'Luxury Villa', 'Penthouse', 'Heritage Haveli', 'Apartment / Flat', 'Builder Floor', 'Independent House / Kothi', 'Duplex Villa', 'Farmhouse / Estate', 'Residential Plot / Land', 'Commercial Showroom', 'Commercial Office Space', 'Commercial Plot / Land', 'Warehouse / Industrial Land', 'Studio Apartment', 'Gated Township Plot', 'Other (Custom Type)'`.
  * **Critical Type Mismatch**: In the database, Property #1 (`88, Harish Nagar`) has `propertyType: "House"`. Because the filter button checks exact string equality against `"Independent House / Kothi"`, clicking `"Independent House / Kothi"` **fails to match Property #1**.
* **SEO Landing Routes Inventory Audit**:
  * Evaluating the 7 SEO landing routes linked in the footer:
    | SEO Route | Filter Applied | Live Property Count | Identified Issues |
    |---|---|---|---|
    | `/plots-in-fatehabad-road-agra` | `listingType: 'Plots'`, `locality: 'Fatehabad Road'` | **0 (Empty)** | Promoted in footer and ads, but yields 0 results |
    | `/commercial-property-in-agra` | `listingType: 'Commercial'` | **0 (Empty)** | Zero commercial properties in catalog |
    | `/ada-approved-plots-in-agra` | `listingType: 'Plots'`, `searchQuery: 'ADA'` | **1** | Only 1 plot in Shastripuram |
    | `/buy-house-in-agra` | `listingType: 'Buy'`, `propertyType: 'Independent House / Kothi'` | **1** | Misses Property #1 due to "House" string mismatch |
    | `/luxury-villas-in-agra` | `listingType: 'Buy'`, `propertyType: 'Luxury Villa'` | **2** | Both in Shastripuram; titled "Kargil Petrol Pump" |
    | `/flats-for-rent-in-agra` | `listingType: 'Rent'` | **1** | Displays independent house for ₹11k/mo |
    | `/sell-property-in-agra` | Screen: `sell-rent` | N/A | Post property form |

---

### 3.3. Property Details View, Gallery, Specs, Brochure & Maps

#### Observations:
* **Media Gallery & Lightbox**:
  * Displays a 16:9 main image with thumbnail strip below.
  * Clicking thumbnails successfully changes the active index.
  * **Missing Feature**: Clicking the active image does **not** open a fullscreen lightbox, zoom modal, or high-resolution gallery viewer. Affluent buyers cannot inspect finishes, floor plans, or structural details.
* **Specifications Grid**:
  * Accurately displays Configuration (BHK), Bathrooms, Super Area (Sq.Ft and converted Sq.Yards), Facing/Orientation, Construction/Possession, and Furnishing status.
  * Price Guide includes *"Calculate Mortgage EMI"* which opens the `EmiCalculatorModal`.
* **Amenities & Highlights**:
  * On Property #1 (`88, Harish Nagar`), `amenities` is an empty array (`[]`). The modal renders an empty *"LUXURY AMENITIES"* section with no badges.
  * **Template Duplication**: All active listings have the exact same 4 highlights copy-pasted:
    1. *"[Furnishing] with bespoke craftsmanship"*
    2. *"100% Vastu Compliant Orientation"*
    3. *"High-Speed Connectivity to Expressway & Taj Corridor"*
    4. *"Multi-car covered garage & 24/7 power backup"*  
    Even an empty residential plot in Shastripuram displays *"Multi-car covered garage & 24/7 power backup"*.
* **Brochure Download**:
  * **PropertyDetailModal**: There is **no brochure download option** for individual properties.
  * **ProjectsScreen**: Projects feature a button labeled *"Download E-Brochure (PDF)"*. When clicked, `ProjectsScreen.tsx:80-84` creates a `text/plain` Blob and downloads a `.txt` text file (`_Brochure.txt`). Affluent buyers expecting an architectural PDF receive a plaintext file with ASCII borders.
* **Map Component & False Claim**:
  * `MapComponent.tsx` displays an embedded Google Map centered at coordinates (`lat: 27.1767, lng: 78.0081`).
  * For masked public properties, the coordinates are intentionally set to central Agra for privacy.
  * **UX Conflict**: The button overlaid on the map explicitly claims: **"Open Exact Google Maps Pin ↗"**. Clicking this opens Google Maps at `27.1767, 78.0081` (central Rawatpara/Agra Fort), misleading buyers into thinking this generic location is the seller's exact pin.

---

### 3.4. Location Privacy & Address Masking Audit (CRITICAL FINDINGS)

#### 1. Public DOM Masking (Frontend Behavior):
* The frontend utility `getMaskedProperty()` in `src/utils/security.ts` sanitizes the property before rendering:
  * Masks `address` and `location` to `formatAgraLocality()` (e.g. *"Sikandra, Agra"*, *"Shastripuram, Agra"*).
  * Deletes `fullAddress`, `plotNumber`, `buildingName`, `ownerContact`, and `locationLink`.
  * Replaces `agent` with Royal Agra Estate Senior Advisory Desk (`+91 91490 79913`).
* **Title Leaks**: However, property titles submitted by sellers remain unmasked. Property #1 is publicly titled **"88, Harish Nagar"**, directly exposing the house/plot number ("88") to all users.

#### 2. Network API Payload Exposure (CRITICAL BACKEND LEAK):
* While the frontend masks data in React state, the backend endpoint **`https://royalagraestate.in/api/properties.php` sends the FULL RAW UNMASKED JSON** to anyone who visits the site.
* **Evidence from Live API Response**:
  ```json
  {
    "id": "prop-user-1791755457589",
    "title": "88, Harish Nagar",
    "fullAddress": "88,Harish Nagar , Sikandra Bodla Road , AGRA",
    "ownerName": "Sonia Gupta",
    "ownerContact": "9761320551",
    "ownerEmail": "shreygupta2398@gmail.com",
    "locationLink": "https://maps.app.goo.gl/n6FwADXpmUk1Xvam7"
  }
  ```
  ```json
  {
    "id": "prop-user-1792319503252",
    "fullAddress": "Radha Kunj Colony Plot No 29,30,31, Near Amal Garden Marriage Home",
    "ownerName": "Akash Upadhyay",
    "ownerContact": "9997292372",
    "ownerEmail": "au135413@gmail.com",
    "locationLink": "https://maps.app.goo.gl/jjcXWzDGzBEtg5de6?g_st=ic"
  }
  ```
* **Impact**: Any competitor, prospective buyer, or unauthorized party opening Safari Developer Tools (or issuing `curl`) can harvest all seller names, private mobile numbers, personal emails, exact plot numbers, and private Google Maps pin locations.

#### 3. Client Storage Leak:
* In `src/services/firebaseService.ts:432`, `fetchFirestoreProperties()` saves the unmasked API response directly into client `localStorage` under `royal_agra_properties_v2`.
* Any script running in the browser can extract private seller phone numbers and exact addresses from `localStorage`.

#### 4. Critical Master Accounts & Password Exposure:
* `https://royalagraestate.in/api/accounts.php` has no authentication check. Calling this endpoint returns:
  * CEO Account: `shrey123@gmail.com` with plaintext password `RoyalAgra@CEO2025` and full admin permissions.
  * Admin Account: `abhi9557138449@gmail.com` with plaintext password `Abhi@Agra2025`.
  * Registered users: `jadontrading78@gmail.com` (`Jadon@1122`), `anupmagupta1975@gmail.com` (`12345678`), security questions, and security answers.
* These credentials are also mirrored into `localStorage.royal_agra_accounts_backup` on every public visitor's browser.

---

### 3.5. Inquiry Submission & WhatsApp Concierge Integration

#### Observations:
* **"Book Site Tour" (PropertyDetailModal)**:
  * Form requires Full Name, 10-digit Phone, Preferred Date, and optional Chauffeur checkbox.
  * Form validates client name (min 2 characters) and phone (min 10 digits).
  * Submits lead to `saveFirestoreLead()`, which persists to `localStorage.royal_agra_leads_v1` and sends a POST request to `/api/leads.php`.
  * **Gap**: Does not provide a direct WhatsApp trigger upon booking.
* **"Inquire / Contact" Button (PropertyCard)**:
  * Clicking "Inquire / Contact" on any property card opens `LeadInquiryModal`.
  * Validates Name (min 2 chars), Phone (min 10 digits), and Email (regex format).
  * Automatically formats a structured WhatsApp message:
    ```
    🏰 *Royal Agra Estate — Property Inquiry*
    👤 *Client:* Vikram Singhania
    📱 *Mobile:* 9876543210
    📧 *Email:* vikram@singhania.com
    📍 *Property:* Kargil Petrol Pump (ID: #prop-user-1792320738640)
    Hello Royal Agra Estate, I would like more details on this property.
    ```
  * Redirects to `https://wa.me/919149079913?text=...`.
  * Phone number `+91 91490 79913` is verified and correct.
* **Contact Screen WhatsApp Concierge**:
  * Direct button links to:
    `https://wa.me/919149079913?text=Hello%20Royal%20Agra%20Estate,%20I%20would%20like%20to%20inquire%20about%20luxury%20properties.`
  * Pre-filled text and phone number are correct.

---

### 3.6. Fatal Runtime Crash & UX Friction in Safari

#### 1. Fatal Runtime Crash Bug (TypeError):
* **Error**: `TypeError: undefined is not an object (evaluating 'n.pricePerSqFt.toLocaleString')`
* **File & Line**: `src/components/PropertyCard.tsx:124`
* **Trigger**: Whenever `/api/properties.php` contains an entry where `pricePerSqFt` is missing, `null`, or `undefined` (such as a health ping or partial draft submission like `prop-user-1793326448671`), calling `.toLocaleString('en-IN')` throws an unhandled exception.
* **Result**: React's top-level `ErrorBoundary` catches the error and unmounts the entire website, displaying the message:
  *"We encountered a temporary loading issue. Please refresh or reset the cache to load the latest luxury listings in Agra."*
* **Reproduction**:
  1. Open Safari on macOS.
  2. Navigate to `https://royalagraestate.in/?screen=properties`.
  3. If any item in the database has `pricePerSqFt: undefined`, the page crashes immediately on render.

#### 2. Projects Screen Empty State:
* When visiting `https://royalagraestate.in/?screen=projects`, the page displays:
  *"No Active Projects Listed. All previous projects have been removed or archived."*
* **Cause**: If any admin or test session deleted a project, `royal_agra_deleted_project_ids_v1` in `localStorage` marks projects deleted, causing `App.tsx:291` to wipe all projects from view.

#### 3. Founder Card Placeholder on About Screen:
* On `https://royalagraestate.in/?screen=about`:
  * Shrey Gupta has a professional headshot image (`/team/shrey-gupta.jpg`).
  * Co-Founder Abhishek Singh Jadon has a grey generic icon box with the literal text: **"Photo"**.
  * For an HNI buyer evaluating founder credentials, this unfinished visual detracts from brand legitimacy.

#### 4. Safari Mobile Layout (390px Viewport):
* The mobile hamburger menu functions cleanly and toggles the mobile drawer.
* Sticky CTA buttons at the bottom of modals have adequate tap targets (> 44px).
* Quick Specs and Price Guide format neatly without horizontal overflow.

---

## 4. Prioritized Actionable Recommendations

### Priority 0 — Critical Security & Fatal Crashes (Immediate Action)
1. **Fix `pricePerSqFt` Crash in `PropertyCard.tsx` and `PropertyDetailModal.tsx`**:
   * Add optional chaining and nullish coalescing:
     ```tsx
     ₹{(property.pricePerSqFt ?? Math.round((property.price || 0) / Math.max(1, property.superAreaSqFt || 1))).toLocaleString('en-IN')}/sq.ft
     ```
   * Sanitize in `normalizeProperty()` in `App.tsx` so `pricePerSqFt` always defaults to a valid number.
2. **Implement Server-Side Address Masking in `/api/properties.php`**:
   * Never send raw `fullAddress`, `plotNumber`, `ownerContact`, `ownerEmail`, or `locationLink` to unauthenticated public requests.
   * Apply `getMaskedProperty()` server-side in PHP/backend so sensitive PII never traverses the network to public clients.
3. **Lock Down `/api/accounts.php` and Protect Passwords**:
   * Add strict session/token authentication to `/api/accounts.php`.
   * Hash all passwords with `bcrypt`/`argon2`. Plaintext passwords must never be stored or returned via API.
   * Do not fetch all accounts into public client `localStorage`.

---

### Priority 1 — Luxury Brand Integrity & Inventory Alignment
4. **Sanitize Listing Titles**:
   * Prevent house numbers from leaking into public titles (e.g. automatically re-title `"88, Harish Nagar"` to `"Modern 3 BHK Residence in Harish Nagar, Sikandra"`).
   * Re-title commercial landmark titles (e.g. rename `"Kargil Petrol Pump"` to `"Executive 5 BHK Villa in Shastripuram"`).
   * Separate budget rental listings (e.g. ₹11,000/mo) from the *"Featured Luxury Estates"* section on the homepage.
5. **Fix Property Type Filter Normalization**:
   * In `PropertiesScreen.tsx`, ensure properties with `propertyType: "House"` match when a buyer selects `"Independent House / Kothi"`.
6. **Replace `.txt` Brochure with Professional PDF**:
   * In `ProjectsScreen.tsx`, replace the `.txt` Blob generator with authentic branded PDF brochures containing floor plans, specifications, and RERA disclosures.
7. **Complete Co-Founder Abhishek's Headshot**:
   * Replace the grey placeholder box and "Photo" text on the About page with an authentic professional executive portrait.

---

### Priority 2 — UX Enhancements & Concierge Optimization
8. **Add Media Gallery Lightbox Zoom**:
   * In `PropertyDetailModal.tsx`, enable clicking any image to open an expanded fullscreen lightbox view with zoom and swipe navigation.
9. **Add Direct WhatsApp Button to Property Details Modal**:
   * Add a floating or sticky *"Chat with Senior Concierge on WhatsApp"* button linking directly to `wa.me/919149079913` with property title and ID pre-filled.
10. **Correct Map Component Button Label**:
    * Change the button text from *"Open Exact Google Maps Pin ↗"* to *"Explore Locality on Google Maps ↗"* when viewing masked public properties to maintain transparency.
11. **Deduplicate Listing Highlights**:
    * Customize property highlights based on actual typology (e.g. plots should highlight zoning, road width, and boundary walls; villas should highlight suites, private lawns, and finishings).

---

## 5. Independent Verification Steps

1. **Verify Crash Resolution**:
   Open Safari on macOS and navigate to `https://royalagraestate.in/?screen=properties`. Verify that all property cards render smoothly without triggering `ErrorBoundary`.
2. **Verify Network Privacy**:
   Open Safari Web Inspector -> Network Tab -> filter by `properties.php`. Inspect the JSON response and confirm that `ownerContact`, `ownerEmail`, `plotNumber`, and `fullAddress` are absent for public unauthenticated sessions.
3. **Verify Accounts Endpoint Security**:
   Execute `curl -sI https://royalagraestate.in/api/accounts.php`. Confirm that the server returns `401 Unauthorized` or `403 Forbidden` for unauthenticated requests.
4. **Verify Filters & Search**:
   In Safari, filter by "Luxury Villa" and "Independent House / Kothi". Verify that relevant properties render and card count updates accurately.
5. **Verify WhatsApp Links**:
   Click "Inquire / Contact" on any property card. Verify that the WhatsApp dialogue opens with recipient `+91 91490 79913` and the correct pre-filled property reference text.

---
*Report compiled and verified by Teamwork Explorer (Buyer Journey & Security Auditor).*
