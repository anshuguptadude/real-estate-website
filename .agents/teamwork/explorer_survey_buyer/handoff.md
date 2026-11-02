# Handoff Report — Buyer Journey Explorer Audit

**Target Website**: [https://royalagraestate.in](https://royalagraestate.in)  
**Agent Folder**: `.agents/teamwork/explorer_survey_buyer/`  
**Primary Deliverable**: `.agents/teamwork/explorer_survey_buyer/report.md`  
**Auditor**: Buyer Journey Explorer (M0 Survey Milestone)  
**Date**: October 30, 2026  

---

## 1. Observation

1. **Fatal Runtime Crash in Safari**:
   * Command executed in Safari WebKit session:
     ```bash
     osascript -e 'tell application "Safari" to tell front document to return do JavaScript "..."'
     ```
   * Verbatim exception caught in React Fiber tree:
     ```
     {"message":"undefined is not an object (evaluating 'n.pricePerSqFt.toLocaleString')","stack":"d0@https://royalagraestate.in/assets/index-CLK2__KY.js:452:34230\nKo@https://royalagraestate.in/assets/index-CLK2__KY.js:48:48229..."}
     ```
   * Source Code Location: `src/components/PropertyCard.tsx:124`:
     ```tsx
     <span className="text-[11px] bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-gray-200 border border-white/10 font-mono">
       ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
     </span>
     ```
   * Cause: Property entry `id: "prop-user-1793326448671"` in `https://royalagraestate.in/api/properties.php` contained `{"ping": true, "id": "prop-user-1793326448671", "updatedAt": "2026-10-30 02:14:08"}` where `pricePerSqFt` was `undefined`. When rendered, calling `.toLocaleString()` threw an unhandled exception, causing `ErrorBoundary.tsx:63-161` to unmount the entire page and show the crash screen: *"We encountered a temporary loading issue. Please refresh or reset the cache to load the latest luxury listings in Agra."*

2. **Severe Unauthenticated PII & Address Leaks in Network API**:
   * Command executed:
     ```bash
     curl -s https://royalagraestate.in/api/properties.php
     ```
   * Verbatim returned JSON payload fields:
     * Prop 1: `title: "88, Harish Nagar"`, `fullAddress: "88,Harish Nagar , Sikandra Bodla Road , AGRA"`, `ownerContact: "9761320551"`, `ownerEmail: "shreygupta2398@gmail.com"`, `ownerName: "Sonia Gupta"`, `locationLink: "https://maps.app.goo.gl/n6FwADXpmUk1Xvam7"`.
     * Prop 3: `title: "Near Industrial Area Shastripuram"`, `fullAddress: "Radha Kunj Colony Plot No 29,30,31, Near Amal Garden Marriage Home"`, `ownerContact: "9997292372"`, `ownerEmail: "au135413@gmail.com"`, `ownerName: "Akash Upadhyay"`, `locationLink: "https://maps.app.goo.gl/jjcXWzDGzBEtg5de6?g_st=ic"`.
     * Prop 4: `title: "Kargil Petrol Pump"`, `fullAddress: "H No 18 Ganesh Vihar Colony near kargil petrol pump"`, `ownerContact: "9997292372"`.

3. **Master Admin & Registered User Credential Exposure**:
   * Command executed:
     ```bash
     curl -s https://royalagraestate.in/api/accounts.php
     ```
   * Verbatim returned data:
     * CEO Account: `email: "shrey123@gmail.com"`, `name: "Shrey Gupta"`, `phone: "+91 9149079913"`, `role: "ceo"`, `password: "RoyalAgra@CEO2025"`.
     * Admin Account: `email: "abhi9557138449@gmail.com"`, `name: "Abhishek Singh Jadon"`, `phone: "+91 9557138449"`, `role: "admin"`, `password: "Abhi@Agra2025"`.
     * Client accounts: `password: "Jadon@1122"`, `password: "ashuvarshney@gmail.com"`, `password: "12345678"`, with security questions and security answers.
   * Browser Storage: `firebaseService.ts:287` caches these accounts into client `localStorage.royal_agra_accounts_backup` on public page load.

4. **Inventory & Locality Search Disconnect**:
   * Hero dropdowns and SEO routes promise: *Fatehabad Road, Dayalbagh, Civil Lines, Tajganj, Shamshabad Road*.
   * Actual live inventory: 6 valid properties located exclusively in Sikandra, Bichpuri, and Shastripuram.
   * Querying `/plots-in-fatehabad-road-agra` in Safari returns:
     ```
     "Showing 0 luxury properties in Agra with verified clear titles. No matching luxury properties found."
     ```
   * Querying `/commercial-property-in-agra` returns 0 results.
   * Filtering by "Independent House / Kothi" returns 0 or 1 result because Property #1 has `propertyType: "House"`, failing exact equality checks in `PropertiesScreen.tsx:117`.

5. **Brochure Download Generates Plaintext `.txt`**:
   * In `src/components/ProjectsScreen.tsx:80-84`:
     ```tsx
     const blob = new Blob([brochureContent], { type: 'text/plain;charset=utf-8' });
     link.download = `${proj.name.replace(/[^a-zA-Z0-9]/g, '_')}_Brochure.txt`;
     ```
   * Button in `ProjectsScreen.tsx:374` promises *"Download E-Brochure (PDF)"*, but downloads a `.txt` text file.
   * `src/components/PropertyDetailModal.tsx` contains no brochure download button whatsoever.

6. **Concierge & WhatsApp Integration**:
   * "Inquire / Contact" on PropertyCard opens `LeadInquiryModal.tsx`, which submits lead to `/api/leads.php` and redirects to:
     ```
     https://wa.me/919149079913?text=...
     ```
   * Phone number `+91 91490 79913` is verified and pre-fills the property title and ID.
   * In `PropertyDetailModal.tsx:116-147`, "Book Site Tour" saves lead to database, but has no direct WhatsApp button or redirect.

---

## 2. Logic Chain

1. **Step 1 (Crash Bug)**: Observation 1 shows `PropertyCard.tsx:124` directly invokes `property.pricePerSqFt.toLocaleString('en-IN')` without null-checking. Observation 2 shows `/api/properties.php` permits partial or ping objects missing `pricePerSqFt`. When fetched into `properties` state, `normalizeProperty()` in `App.tsx:86-109` fails to supply a default number for `pricePerSqFt`. Therefore, rendering the card causes a fatal TypeError that crashes the React tree into `ErrorBoundary`.
2. **Step 2 (Privacy Leak)**: Invariant #3 and `security.ts` define client-side masking via `getMaskedProperty()`. However, Observation 2 confirms that `/api/properties.php` delivers raw unmasked database rows over the wire before client code ever runs. Observation 3 confirms `fetchFirestoreProperties()` saves the unmasked payload to browser `localStorage`. Therefore, public visitors have instant direct access to confidential seller phone numbers, emails, and exact plot coordinates.
3. **Step 3 (Authentication Breach)**: Observation 3 shows `/api/accounts.php` has no HTTP Authorization or session check, returning all administrator credentials in plaintext. Therefore, anyone on the internet can extract CEO and Admin passwords and assume master control over the CRM and listings.
4. **Step 4 (Buyer UX Friction)**: Observation 4 shows an inventory mismatch between promoted luxury localities (Fatehabad Road, Dayalbagh) and actual catalog listings. Observation 5 shows the "PDF Brochure" button downloads a `.txt` file, while the property modal lacks an image lightbox and direct WhatsApp trigger. Therefore, an affluent prospective buyer encounters broken expectations, unverified claims, and unprofessional interactions.

---

## 3. Caveats

* **Read-Only Investigation**: In compliance with team integrity rules, no website code or server endpoints were modified.
* **Server-Side PHP Code**: The PHP backend files (e.g. `/api/properties.php`, `/api/accounts.php`) are hosted on Hostinger NVMe SSD; their internal PHP scripts were analyzed via HTTP responses and corresponding client API calls in `src/services/firebaseService.ts`.
* **Testing Tooling**: Testing was performed using Safari on macOS via `osascript`, WebKit DOM evaluation, and network probing.

---

## 4. Conclusion

The live website `https://royalagraestate.in` possesses strong aesthetic foundations and responsive layouts, but is currently compromised by **three critical vulnerabilities**:
1. An unhandled TypeError in `PropertyCard.tsx:124` crashing the live site whenever incomplete data enters `/api/properties.php`.
2. A critical backend privacy leak in `/api/properties.php` exposing seller phone numbers, full addresses, and GPS pins.
3. An unauthenticated `/api/accounts.php` endpoint exposing master CEO and Admin plaintext passwords.

In addition, the buyer journey suffers from inventory disconnects on prime SEO landing pages, copy-pasted listing highlights, an unformatted `.txt` brochure generator, and the lack of an image zoom lightbox. Addressing the P0 and P1 recommendations detailed in `report.md` will elevate the platform to institutional luxury real estate standards.

---

## 5. Verification Method

1. **Verify Crash Reproduction**:
   ```bash
   osascript -e 'tell application "Safari" to tell front document to return do JavaScript "document.body.innerText.includes(\"temporary loading issue\")"'
   ```
2. **Verify API PII Exposure**:
   ```bash
   python3 -c "
   import urllib.request, json
   req = urllib.request.Request('https://royalagraestate.in/api/properties.php', headers={'User-Agent': 'Mozilla/5.0'})
   with urllib.request.urlopen(req) as resp:
       data = json.loads(resp.read().decode('utf-8'))
       print([p.get('ownerContact') for p in data if p.get('ownerContact')])
   "
   ```
3. **Verify Accounts Endpoint Security**:
   ```bash
   curl -sI https://royalagraestate.in/api/accounts.php
   ```
   (Should return `401 Unauthorized` instead of `200 OK` with JSON).
4. **Inspect Comprehensive Audit Report**:
   Read full report at:
   `/Users/shrey/.gemini/antigravity/worktrees/Final website /property_address_privacy_settings/.agents/teamwork/explorer_survey_buyer/report.md`

---
*End of Handoff Report.*
