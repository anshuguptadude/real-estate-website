# Comprehensive Live Website Audit Report: Royal Agra Estate (Safari Browser)

**Target Website**: [https://royalagraestate.in](https://royalagraestate.in)  
**Audit Environment**: Safari Browser on macOS (Version 27.0.1, WebKit Engine; Desktop 1440px & Mobile Viewports 390px)  
**Audit Perspectives**: Prospective Luxury Property Buyer & Prospective Luxury Property Seller/Developer in Agra  
**Audit Mode**: Read-Only Analysis & Verification (Zero Source Code Modified)  
**Date**: October 30, 2026  
**Audited By**: Multi-Agent Specialized Audit Team (Buyer Specialist, Seller Specialist, Technical & WebKit Health Specialist, Orchestrator)

---

## Executive Summary

Royal Agra Estate positions itself as *"The Premier Luxury Realty Portal in Agra"*, offering high-net-worth individuals (HNIs), NRIs, and business executives access to verified luxury villas, kothis, and ADA-approved plots in Agra's prestigious corridors (Dayalbagh, Fatehabad Road, Shamshabad Road, Civil Lines).

While the portal features an elegant aesthetic palette—deep emerald (`#0F382C`), champagne gold (`#C5A869`), and serif typography (`Playfair Display`, `Cinzel`)—this live audit identified **critical runtime crash bugs, severe security and privacy breaches at the network layer, high-friction workflow traps in Safari, and inventory/branding disconnects**:

1. **P0 Fatal Live Homepage Crash**: An unhandled `TypeError: undefined is not an object (evaluating 'n.pricePerSqFt.toLocaleString')` in `PropertyCard.tsx:124` triggers React's `ErrorBoundary`, rendering a persistent crash screen to public visitors whenever a record missing `pricePerSqFt` is served.
2. **P0 Public Credentials Exposure**: The backend endpoint `GET /api/accounts.php` has zero authentication and returns all user accounts, phone numbers, security questions/answers, and **plaintext passwords** (including CEO and Admin master accounts) to the public internet with wildcard CORS (`Access-Control-Allow-Origin: *`).
3. **P0 Severe Location Privacy & PII Leak**: While the frontend masks addresses in the DOM, `GET /api/properties.php` transmits raw, unmasked property records over the network. Any public visitor can read exact house/plot numbers, owner names, personal phone numbers, and private Google Maps pin URLs. Furthermore, client `localStorage` mirrors this unmasked data.
4. **P0 Seller Agency Contact Pre-fill Defect**: Accessing `/sell-property-in-agra` without being logged in pre-fills the agency's phone (`+91 91490 79913`) and email (`shrey@royalagraestate.in`) into the seller's contact fields, causing listings to be submitted with company info instead of the seller's details.
5. **P0 Arbitrary Upload & Unauthenticated Deletion**: `/api/upload.php` accepts files without authentication or extension whitelisting, while `/api/properties.php` and `/api/accounts.php` permit unauthenticated `DELETE` requests.
6. **P1 Safari WebKit Drag-and-Drop Navigation Trap**: Dragging photos onto the listing dropzone navigates the browser tab away to the image file due to missing `preventDefault()`, discarding all filled form data.
7. **P1 Buyer Search & Inventory Disconnect**: Promoted luxury corridors (Fatehabad Road, Dayalbagh, Civil Lines) return 0 properties, and clicking "Download E-Brochure (PDF)" downloads a plain `.txt` file.
8. **P1 Asset Bloat & WebKit Font Quirk**: The JavaScript bundle is 3.62 MB, with 74.3% (2.68 MB) comprised of 25 embedded base64 images inside `mockData.ts`. `Plus Jakarta Sans` font is unloaded in Safari due to unquoted font family syntax in compiled CSS.

---

## 1. Audit Methodology & Scope

The audit was conducted across three parallel investigative tracks using macOS Safari (WebKit runtime) and automated protocol testing:
- **Track A (Buyer Journey)**: Homepage discovery, search filtering, property specifications, location masking verification, brochure downloads, and WhatsApp concierge inquiry.
- **Track B (Seller Journey)**: Listing entry points, step-by-step form workflow, field validations, photo upload and compression, address confidentiality communication, and post-submission lifecycle.
- **Track C (Technical Health & Safari WebKit)**: Console runtime exceptions, network request auditing (including `/api/` endpoints and Cloud Firestore), WebKit CSS rendering, responsive layouts, data layer privacy, and asset payload profiling.

---

## 2. Critical & Functional Errors (Issue Identification)

### Issue 1: Fatal Runtime Crash in Safari (Homepage & Catalog)
* **Severity**: **P0 (Critical Blocker)**
* **Category**: Functional Interaction Bug / Console Runtime Exception
* **Location**: `src/components/PropertyCard.tsx:124`
* **Evidence & Reproduction**:
  1. Open Safari on macOS and navigate to `https://royalagraestate.in/`.
  2. The page unmounts and displays `ErrorBoundary.tsx`:
     > *"We encountered a temporary loading issue. Please refresh or reset the cache to load the latest luxury listings in Agra."*
  3. Extracted verbatim console error from React Fiber tree:
     ```
     TypeError: undefined is not an object (evaluating 'n.pricePerSqFt.toLocaleString')
         at d0 (https://royalagraestate.in/assets/index-CLK2__KY.js:452:34230)
     ```
  4. Root Cause: In `PropertyCard.tsx`:
     ```tsx
     ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
     ```
     When `/api/properties.php` returns any listing where `pricePerSqFt` is missing, `null`, or `undefined` (such as draft/health ping `prop-user-1793326448671`), calling `.toLocaleString()` throws an unhandled exception.

---

### Issue 2: Unauthenticated Plaintext Credentials Dump
* **Severity**: **P0 (Critical Security Breach)**
* **Category**: Network Request Failure & Security Vulnerability
* **Location**: `https://royalagraestate.in/api/accounts.php`
* **Evidence & Reproduction**:
  1. Execute terminal command:
     ```bash
     curl -s https://royalagraestate.in/api/accounts.php
     ```
  2. The endpoint responds with `HTTP 200 OK` and `Access-Control-Allow-Origin: *`, dumping all user accounts in plaintext:
     - **CEO Master Account**: `email: "shrey123@gmail.com"`, `name: "Shrey Gupta"`, `phone: "+91 9149079913"`, `role: "ceo"`, `password: "RoyalAgra@CEO2025"`.
     - **Admin Account**: `email: "abhi9557138449@gmail.com"`, `name: "Abhishek Singh Jadon"`, `phone: "+91 9557138449"`, `role: "admin"`, `password: "Abhi@Agra2025"`.
     - **Registered Users**: Exposes all registered client phone numbers, plaintext passwords, security questions, and answers.
  3. In `src/services/firebaseService.ts:287`, these credentials are automatically downloaded and cached into the visitor's `localStorage.royal_agra_accounts_backup`.

---

### Issue 3: Complete Location Privacy Leak at Data Layer
* **Severity**: **P0 (Critical Compliance & Privacy Violation)**
* **Category**: Privacy Masking Breakdown
* **Location**: `https://royalagraestate.in/api/properties.php` & `src/services/firebaseService.ts:432`
* **Evidence & Reproduction**:
  1. Royal Agra Estate Invariant #3 mandates that public users must never see exact house/plot numbers or GPS coordinates.
  2. Inspect the raw network response:
     ```bash
     curl -s https://royalagraestate.in/api/properties.php
     ```
  3. Verbatim unmasked data transmitted over the wire:
     - Property 1: `title: "88, Harish Nagar"`, `fullAddress: "88,Harish Nagar , Sikandra Bodla Road , AGRA"`, `ownerName: "Sonia Gupta"`, `ownerContact: "9761320551"`, `ownerEmail: "shreygupta2398@gmail.com"`, `locationLink: "https://maps.app.goo.gl/n6FwADXpmUk1Xvam7"`.
     - Property 3: `fullAddress: "Radha Kunj Colony Plot No 29,30,31, Near Amal Garden Marriage Home"`, `ownerName: "Akash Upadhyay"`, `ownerContact: "9997292372"`.
     - Property 4: `fullAddress: "H No 18 Ganesh Vihar Colony near kargil petrol pump"`.
     - Property 5: `fullAddress: "H No 48 Shanti Residency Colony Near Prachi Police"`.
  4. The client utility `getMaskedProperty()` in `security.ts` masks data in the React DOM, but the full unmasked payload has already arrived on the client's machine and is persisted in `localStorage.royal_agra_properties_v2`.

---

### Issue 4: Seller Agency Contact Auto-Fill Defect
* **Severity**: **P0 (Critical Data Integrity Defect)**
* **Category**: Functional Interaction Bug
* **Location**: `src/components/PostPropertyScreen.tsx:61–63`
* **Evidence & Reproduction**:
  1. Open Safari and navigate to `https://royalagraestate.in/sell-property-in-agra`.
  2. Advance to Step 4: Legal Verification & Contact.
  3. Observe that `#post-owner-phone` contains `"+91 91490 79913"` and `#post-owner-email` contains `"shrey@royalagraestate.in"`.
  4. Code implementation:
     ```typescript
     const [ownerName, setOwnerName] = useState(user?.name || '');
     const [ownerPhone, setOwnerPhone] = useState(user?.phone || '+91 91490 79913');
     const [ownerEmail, setOwnerEmail] = useState(user?.email || 'shrey@royalagraestate.in');
     ```
  5. Any unauthenticated seller who does not manually delete and overwrite these values submits listings under agency contact details, completely losing the seller lead.

---

### Issue 5: Arbitrary File Upload & Unauthenticated Deletion
* **Severity**: **P0 (Critical Backend Security Vulnerability)**
* **Category**: Network & Server Security
* **Location**: `dist/api/upload.php` & `dist/api/properties.php`
* **Evidence**:
  1. In `dist/api/upload.php`:
     ```php
     $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) ?: 'jpg';
     $safe_name = 'prop_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
     move_uploaded_file($file['tmp_name'], $upload_dir . '/' . $safe_name);
     ```
     No authentication, no MIME/extension whitelist, allowing arbitrary uploads to public web directories on PHP 8.3.
  2. In `dist/api/properties.php` and `dist/api/accounts.php`, `DELETE` operations execute directly with no admin token verification:
     ```bash
     DELETE https://royalagraestate.in/api/properties.php?id=<property_id>
     DELETE https://royalagraestate.in/api/accounts.php?email=<email>
     ```

---

### Issue 6: Safari WebKit Drag-and-Drop Photo Upload Trap
* **Severity**: **P1 (High Friction / Data Loss)**
* **Category**: Visual & Functional Interaction Bug
* **Location**: `src/components/PostPropertyScreen.tsx:1078–1090`
* **Evidence & Reproduction**:
  1. In Safari on macOS, start listing a property and navigate to Step 3.
  2. Drag an image file from Finder/Desktop onto `#upload-property-photos-dropzone`.
  3. Because the container lacks `onDragOver` and `onDrop` handlers calling `e.preventDefault()`, Safari executes its default behavior: **it unloads the web page and navigates directly to the image file, destroying all filled form data without warning**.

---

### Issue 7: Multi-Step Validation Bypass in Seller Flow
* **Severity**: **P1 (Data Integrity / UX Defect)**
* **Category**: Functional Interaction Bug
* **Location**: `src/components/PostPropertyScreen.tsx:690–698`
* **Evidence & Reproduction**:
  1. Open `/sell-property-in-agra`.
  2. Leave `#post-project-title` and `#post-confidential-address` completely blank.
  3. Click "CONTINUE TO SPECIFICATIONS": the form immediately transitions to Step 2 without any validation warning.
  4. Cause: Step navigation buttons are `<button type="button" onClick={() => setStep(2)}>`, bypassing HTML5 validation. Previous step inputs are unmounted from the DOM, so their `required` attributes are never checked on submit.
  5. On Step 4, clicking submit triggers native browser tooltips only for Step 4 fields, with zero custom visual error highlights or scroll-to-error behavior.

---

### Issue 8: Authentication Gating Inconsistency on Seller Journey
* **Severity**: **P1 (Navigation Inconsistency)**
* **Category**: Routing & Navigation
* **Location**: `src/App.tsx:588–596` vs `src/utils/seoRoutes.ts`
* **Evidence**:
  - Clicking "POST PROPERTY" in the desktop header or "Sell/Rent" in navigation immediately displays a blocking Login Modal (`"Please log in or create an account to post a property listing in Agra"`).
  - Navigating directly to `https://royalagraestate.in/sell-property-in-agra` allows unauthenticated access directly to the listing form.
  - Furthermore, if an unauthenticated user submits via `/sell-property-in-agra`, clicking "View in My Dashboard" prompts account creation, but the newly registered user ID does not match the unauthenticated submission's `ownerId` (`'RAE-OWNER-01'`), permanently orphaning the property.

---

### Issue 9: Promoted Corridors Inventory Disconnect (Empty States)
* **Severity**: **P1 (Buyer UX / Brand Perception)**
* **Category**: Content & Search Friction
* **Location**: Homepage Hero & Footer SEO Landing Pages
* **Evidence**:
  - The hero section advertises *"ADA approved plots on Fatehabad Road, luxury villas in Dayalbagh"*.
  - Querying `/plots-in-fatehabad-road-agra` returns **0 results**: *"Showing 0 luxury properties in Agra with verified clear titles. No matching luxury properties found."*
  - Querying `/commercial-property-in-agra` returns **0 results**.
  - All 6 active listings in the catalog are located in Sikandra, Bichpuri, and Shastripuram.
  - Property #1 has `propertyType: "House"`, which fails exact equality matching against `"Independent House / Kothi"`, rendering search results empty for houses.

---

### Issue 10: E-Brochure Button Generates Plaintext `.txt` File
* **Severity**: **P1 (Luxury Brand Integrity)**
* **Category**: Functional Interaction Defect
* **Location**: `src/components/ProjectsScreen.tsx:80–84`
* **Evidence**:
  - On the Projects screen, each project displays a primary CTA: *"Download E-Brochure (PDF)"*.
  - Clicking this button executes:
    ```typescript
    const blob = new Blob([brochureContent], { type: 'text/plain;charset=utf-8' });
    link.download = `${proj.name.replace(/[^a-zA-Z0-9]/g, '_')}_Brochure.txt`;
    ```
  - An HNI buyer receives an unformatted `.txt` file containing ASCII borders instead of an architectural PDF brochure.
  - Individual property cards and `PropertyDetailModal` contain no brochure download option.

---

### Issue 11: Massive Asset Bloat (2.68 MB Base64 Images in JS Bundle)
* **Severity**: **P1 (Performance Bottleneck)**
* **Category**: Asset Optimization & Core Web Vitals
* **Location**: `src/data/mockData.ts` & Vite Production Bundle
* **Evidence**:
  - Total size of `index-CLK2__KY.js` is **3.62 MB** (2.33 MB gzipped).
  - Profiling reveals **25 raw base64 image strings** embedded directly inside `mockData.ts`, consuming **2,812,007 bytes (2.68 MB, or 74.3% of the entire JavaScript bundle)**.
  - Because `mockData.ts` is imported into `App.tsx`, Safari must download, parse, and compile 2.68 MB of static images before the page can hydrate, degrading mobile LCP.

---

### Issue 12: Safari WebKit CSS & Font Rendering Glitches
* **Severity**: **P2 (Visual Polish & Responsive Bug)**
* **Category**: Safari / WebKit Compatibility
* **Evidence**:
  1. **Plus Jakarta Sans Unloaded in Safari**:
     - In `index-BVU_Qezi.css`:
       `body{font-family:Plus Jakarta Sans,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}`
     - In WebKit, multi-word font family names without quotes fail parsing. Evaluating `document.fonts.check('16px "Plus Jakarta Sans"')` in Safari returns `false`.
  2. **Mobile Safari Input Auto-Zoom**:
     - Form inputs use `text-xs` (12px) and `text-sm` (14px). On iOS Safari, focusing inputs < 16px triggers an automatic viewport zoom-in, causing layout jitter.
  3. **Viewport Height Clipping**:
     - Modals use `max-h-[92vh]`, which causes action buttons to be obscured by Safari's dynamic bottom URL bar. It should use `max-h-[92dvh]`.
  4. **Founder Profile Placeholder**:
     - On `/about`, Co-Founder Abhishek Singh Jadon's card shows an empty grey box with literal text **"Photo"**.

---

## 3. User Journey Walkthrough & UX Evaluation

### 3.1 Prospective Luxury Buyer Journey
* **First Impression (Hero Section)**: Strong aesthetic appeal, but entering promoted localities (Fatehabad Road, Dayalbagh) immediately reveals empty search results.
* **Property Discovery & Filtering**: Filter chips for property types are fragile; Property #1 is missed due to string mismatch (`House` vs `Independent House / Kothi`).
* **Property Detail Exploration**: Specifications and price calculator are informative. However, images cannot be opened in a fullscreen lightbox/zoom view, and all active listings contain identical copy-pasted highlight bullet points (even vacant plots display *"Multi-car covered garage & 24/7 power backup"*).
* **Location Privacy**: The DOM successfully hides the house number from the address field, but the title itself leaks it (`"88, Harish Nagar"`). Furthermore, the map button claims *"Open Exact Google Maps Pin ↗"*, but opens central Agra coordinates.
* **Inquiry & WhatsApp Concierge**: The "Inquire / Contact" card modal works well, sending a structured WhatsApp message to `+91 91490 79913`. However, the "Book Site Tour" modal inside the property detail view lacks a direct WhatsApp trigger.

### 3.2 Prospective Luxury Seller Journey
* **Entry Points**: 100% of the homepage is buyer-focused. There is no "Sell With Us" section or valuation tool. Clicking "POST PROPERTY" in the header blocks with a Login modal, while external links bypass it.
* **Listing Creation**: The multi-step wizard is comprehensive (supporting Vastu facing, unit conversions, and landmark presets). However, leaving fields blank on Steps 1–3 allows bypassing required validations.
* **Photo Upload**: Client-side canvas compression ensures payloads stay under 500 KB, but dragging photos onto the dropzone crashes the session in Safari.
* **Submission Experience**: The form submits cleanly to SQLite (`status: 'Pending Approval'`), but the confirmation modal fails to state a turnaround SLA (e.g. 24–48 hours) and lacks a direct WhatsApp concierge button.

---

## 4. Prioritized Actionable Recommendations

### Priority 0 — Critical Security, Privacy & Fatal Crash Fixes (Immediate)

| # | Recommendation | Target File(s) | Implementation Action |
|---|----------------|----------------|-----------------------|
| 1 | **Fix `pricePerSqFt` Crash** | `src/components/PropertyCard.tsx:124`, `App.tsx` | Use optional chaining and nullish coalescing: `(property.pricePerSqFt ?? Math.round((property.price || 0) / Math.max(1, property.superAreaSqFt || 1))).toLocaleString('en-IN')`. Ensure `normalizeProperty()` always provides a fallback numeric value. |
| 2 | **Secure `/api/accounts.php`** | `dist/api/accounts.php`, `src/services/firebaseService.ts` | Eliminate public `SELECT *` dump. Require admin session token for account management. Hash all stored passwords using `password_hash($pwd, PASSWORD_BCRYPT)`. Stop syncing plaintext accounts to client `localStorage`. |
| 3 | **Enforce Server-Side Location Privacy** | `dist/api/properties.php` | Mask property records on the server before transmitting JSON. Strip `fullAddress`, `plotNumber`, `ownerContact`, `ownerEmail`, and `locationLink` for unauthenticated requests. |
| 4 | **Fix Seller Agency Contact Auto-Fill** | `src/components/PostPropertyScreen.tsx:61–63` | Default `ownerPhone` and `ownerEmail` to `''` when `user` is null. Require explicit contact entry from unauthenticated sellers. |
| 5 | **Harden File Upload & API Deletions** | `dist/api/upload.php`, `dist/api/properties.php` | Enforce extension whitelisting (`jpg, jpeg, png, webp`), verify MIME types, and require admin authentication for file uploads and `DELETE` queries. |

---

### Priority 1 — UX Friction, Validation & Brand Integrity (High Priority)

| # | Recommendation | Target File(s) | Implementation Action |
|---|----------------|----------------|-----------------------|
| 6 | **Add Safari Drag-and-Drop Prevention** | `src/components/PostPropertyScreen.tsx` | Add `onDragOver={(e) => e.preventDefault()}` and `onDrop={handleDropFiles}` to prevent Safari from navigating away. |
| 7 | **Enforce Step-by-Step Validation** | `src/components/PostPropertyScreen.tsx` | Validate required fields in JavaScript before allowing `setStep(nextStep)`. Display visual red borders and clear error messages. |
| 8 | **Harmonize Seller Authentication Flow** | `src/App.tsx`, `PostPropertyScreen.tsx` | Permit unauthenticated sellers to fill the form, but prompt account creation on Step 4. Link the generated reference ID to the new account ID upon registration. |
| 9 | **Resolve Inventory Disconnects** | Catalog Database, `PropertiesScreen.tsx` | On empty locality queries, display intelligent suggestions (e.g. *"Viewing properties within 5 km"*). Normalize property type filter matching (`"House"` should match `"Independent House / Kothi"`). Sanitize listing titles to remove house numbers (e.g. rename `"88, Harish Nagar"` to `"3 BHK Independent Residence in Sikandra"`). |
| 10 | **Replace Plaintext Brochure with PDF** | `src/components/ProjectsScreen.tsx` | Generate high-quality architectural PDFs using `jsPDF` or provide pre-rendered PDF downloads. Add a brochure download button to `PropertyDetailModal`. |
| 11 | **Externalize Base64 Images from JS Bundle** | `src/data/mockData.ts`, `vite.config.ts` | Move the 25 base64 images out of `mockData.ts` into external static files in `/public/images/`. This will reduce the JS bundle size from 3.62 MB to < 950 KB, accelerating mobile Safari load times by ~70%. |

---

### Priority 2 — Safari WebKit Polish & Luxury Enhancements (Medium Priority)

| # | Recommendation | Target File(s) | Implementation Action |
|---|----------------|----------------|-----------------------|
| 12 | **Fix Quoted Font Family & iOS Auto-Zoom** | CSS / Tailwind config, `PostPropertyScreen.tsx` | Enclose multi-word fonts in quotes (`"Plus Jakarta Sans"`). Set mobile input font-size to `text-base` (16px) on viewports < 640px to prevent iOS Safari auto-zoom. |
| 13 | **Use Dynamic Viewport Units (`100dvh`)** | Modals, Drawer components | Replace `vh` with `dvh` on mobile overlay containers to prevent buttons from hiding behind Safari's dynamic navigation bar. |
| 14 | **Add Image Lightbox & Zoom Viewer** | `src/components/PropertyDetailModal.tsx` | Add a fullscreen image lightbox with swipe/zoom gestures for affluent buyers inspecting architectural finishes. |
| 15 | **Post-Submission Concierge & Turnaround SLA** | `src/components/PostPropertyScreen.tsx` | Specify an explicit review SLA (e.g. *"Reviewed & published within 24–48 hours"*). Add a one-click WhatsApp button pre-filled with the submission reference ID. |
| 16 | **Add Seller Homepage Presence & Valuation** | `src/components/HeroSection.tsx`, `App.tsx` | Add a "List Your Luxury Estate" CTA block on the homepage, along with a transparent brokerage policy and an Agra property valuation estimator. |

---

## 5. Verification Commands & Evidence Index

All findings in this report can be independently verified using the following commands:

1. **Verify Live Homepage Crash in Safari**:
   ```bash
   osascript -e 'tell application "Safari" to tell front document to return do JavaScript "document.body.innerText.includes(\"temporary loading issue\")"'
   # Returns: true
   ```
2. **Verify Public Credentials Dump**:
   ```bash
   curl -s https://royalagraestate.in/api/accounts.php | grep -o '"password":"[^"]*"'
   # Returns full list of plaintext passwords
   ```
3. **Verify Data Layer Address & Phone Leak**:
   ```bash
   curl -s https://royalagraestate.in/api/properties.php | grep -o '"fullAddress":"[^"]*"'
   # Returns unmasked house numbers and street addresses
   ```
4. **Verify JavaScript Bundle Weight & Base64 Ratio**:
   ```bash
   curl -s https://royalagraestate.in/assets/index-CLK2__KY.js | wc -c
   # Returns ~3,616,691 bytes (3.62 MB)
   ```
5. **Verify TypeScript Compilation Status**:
   ```bash
   npx tsc --noEmit
   # Compiles with 0 TypeScript errors on unmodified repository code
   ```
