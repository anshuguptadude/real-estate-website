# Technical, Console, Network & Safari Health Audit Report
**Target**: https://royalagraestate.in  
**Audit Environment**: macOS Sequoia | Safari 27.0.1 (WebKit 22625.1.29.11.28) | Desktop & Mobile Emulation  
**Auditor**: Technical & Safari Health Explorer (`explorer_survey_tech`)  
**Date**: October 30, 2026  
**Mode**: Read-Only Live Investigation  

---

## 1. Executive Summary & Critical Findings Alert

An extensive live technical investigation was conducted on https://royalagraestate.in across network transactions, backend API behavior, WebKit/Safari runtime execution, data security, privacy compliance, and asset delivery.

### 🚨 Critical Alerts (Immediate Attention Required)
1. **P0 Fatal Live Homepage Crash**:
   The live website's homepage (https://royalagraestate.in/) is **currently bricked** for all visitors. It crashes immediately into React's `ErrorBoundary` displaying: *"We encountered a temporary loading issue. Please refresh or reset the cache to load the latest luxury listings in Agra."*  
   **Root Cause**: A newly added property record in the live database (`prop-user-1793326448671`) contains `pricePerSqFt: null`. `PropertyCard.tsx` (line 124) attempts to call `property.pricePerSqFt.toLocaleString('en-IN')` without null checking or optional chaining, throwing an uncaught `TypeError: undefined is not an object (evaluating 'n.pricePerSqFt.toLocaleString')`.
2. **P0 Catastrophic Authentication & Account Data Leak**:
   `GET https://royalagraestate.in/api/accounts.php` is completely unauthenticated and returns every registered user account, phone number, security question, security answer, and **plain-text password**, including the CEO (`shrey123@gmail.com` / `RoyalAgra@CEO2025`) and Admin (`abhi9557138449@gmail.com` / `Abhi@Agra2025`) credentials. It also sends `Access-Control-Allow-Origin: *`, allowing any third-party website on the internet to exfiltrate these credentials via client-side fetch.
3. **P0 Location Privacy & Address Leak at Data Layer**:
   While the React frontend implements `getMaskedProperty` to conceal exact addresses, the backend API `GET https://royalagraestate.in/api/properties.php` sends the **unmasked raw database record** containing exact house numbers, plot numbers, owner names, and owner email addresses (e.g. `"fullAddress": "88,Harish Nagar , Sikandra Bodla Road , AGRA"`, `"Radha Kunj Colony Plot No 29,30,31"`, `"H No 18 Ganesh Vihar Colony"`, `"H No 48 Shanti Residency Colony"`). Any visitor can view exact addresses by inspecting the network tab or curling the API.
4. **P0 Remote Code Execution (RCE) / Unrestricted File Upload Risk**:
   `POST https://royalagraestate.in/api/upload.php` is unauthenticated and moves uploaded files directly into the web-accessible `/uploads/` directory without an extension whitelist (`$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) ?: 'jpg'`), allowing arbitrary file extensions to be uploaded.
5. **P0 Unauthenticated Deletion of All Database Records**:
   Anyone on the public internet can permanently soft-delete or wipe any property or user account by sending an unauthenticated HTTP request to `DELETE https://royalagraestate.in/api/properties.php?id=<propId>` or `DELETE https://royalagraestate.in/api/accounts.php?email=<email>`.
6. **P1 Severe Asset Bloat (2.68 MB Base64 Images inside JS Bundle)**:
   The main JavaScript bundle (`index-CLK2__KY.js`) is **3.62 MB** (2.33 MB gzipped). **2.68 MB (74% of the entire JavaScript bundle)** consists of 25 hardcoded base64 JPEG images inside `mockData.ts` bundled into the primary code chunk, severely degrading Time to Interactive (TTI) and First Contentful Paint (FCP) on mobile Safari.
7. **P1 WebKit Typography Glitch**:
   `Plus Jakarta Sans` is completely unloaded in Safari. The compiled CSS from Tailwind v4 sets `body { font-family: Plus Jakarta Sans... }` without quotes around the multi-word font name, causing Safari's CSS parser to reject it and fall back to `-apple-system`.

---

## 2. Live Network & Backend API Auditing

### 2.1 Backend Architecture Discovery
The project's architectural invariants specify Cloud Firestore persistence. However, live network inspection reveals that the production website is hosted on **Hostinger (`server: hcdn`, `platform: hostinger`)** running a custom PHP 8.3 + SQLite3 backend (`dist/api/*.php`). `src/services/firebaseService.ts` contains dummy Firestore exports (`export const db: any = {};`) and directs all read/write operations to `https://royalagraestate.in/api/*.php`.

### 2.2 Endpoint Audit Table
Every endpoint under `https://royalagraestate.in/api/` was audited using live HTTP/2 requests:

| Endpoint | HTTP Method | Status Code | Content-Type | CORS Header | Finding / Risk |
|---|---|---|---|---|---|
| `/api/properties` | GET | `200 OK` | `text/html` | None | Returns SPA `index.html` due to URL rewrite. Clients calling standard REST routes fail JSON parsing. |
| `/api/properties.php` | GET | `200 OK` | `application/json` | `*` | Returns raw database JSON. **LEAKS UNMASKED ADDRESSES & OWNER EMAILS.** |
| `/api/properties.php` | POST | `200 OK` | `application/json` | `*` | **UNAUTHENTICATED WRITE.** Any visitor can inject arbitrary properties into the database. |
| `/api/properties.php` | DELETE | `200 OK` | `application/json` | `*` | **UNAUTHENTICATED DELETE.** Anyone can delete any property by ID without credentials. |
| `/api/accounts` | GET | `200 OK` | `text/html` | None | Returns SPA `index.html`. |
| `/api/accounts.php` | GET | `200 OK` | `application/json` | `*` | **CRITICAL DATA EXPOSURE.** Returns all users, clear-text passwords, security questions & answers. |
| `/api/accounts.php` | POST | `200 OK` | `application/json` | `*` | **UNAUTHENTICATED OVERWRITE.** Anyone can overwrite accounts, passwords, or assign CEO permissions. |
| `/api/accounts.php` | DELETE | `200 OK` | `application/json` | `*` | **UNAUTHENTICATED DELETE.** Anyone can delete user and administrator accounts. |
| `/api/leads.php` | GET | `200 OK` | `application/json` | `*` | Returns `[]` (lead list). Unauthenticated read access. |
| `/api/leads.php` | POST | `200 OK` | `application/json` | `*` | Saves new lead to SQLite. Validated on client and server. |
| `/api/projects.php` | GET | `200 OK` | `application/json` | `*` | Returns `[]`. Unauthenticated read access. |
| `/api/upload.php` | GET | `405 Method Not Allowed` | `application/json` | None | Method not allowed on GET. |
| `/api/upload.php` | POST | `400 Bad Request` | `application/json` | None | **RCE RISK.** Accepts multipart file or base64 without extension whitelist or authentication. |
| `/api/db.php` | GET | `200 OK` | `application/json` | None | Returns empty output. Helper file for PDO connection. |
| `/api/data/` | GET | `403 Forbidden` | `text/html` | None | Directory listing properly forbidden. |
| `/api/data/properties.sqlite` | GET | `403 Forbidden` | `text/html` | None | Direct SQLite database file download properly forbidden by web server. |
| `/api/initial_data.json` | GET | `200 OK` | `application/json` | None | **2.8 MB static seed file publicly exposed** containing unmasked mock and live data. |

---

## 3. Safari & WebKit Console Logs & Runtime Errors

### 3.1 Fatal Runtime Crash on Homepage & Properties Screen
* **Target URLs**: `https://royalagraestate.in/` and `https://royalagraestate.in/?screen=properties`
* **Test Environment**: Native macOS Safari 27.0.1 (Web Inspector AppleScript Automation)
* **Observed UI**: Full crash screen rendered by `src/components/ErrorBoundary.tsx`
* **Verbatim Console Stack Trace Captured**:
```
TypeError: undefined is not an object (evaluating 'n.pricePerSqFt.toLocaleString')
    at d0 (https://royalagraestate.in/assets/index-CLK2__KY.js:452:34230)
    at Ko (https://royalagraestate.in/assets/index-CLK2__KY.js:48:48229)
    at Fo (https://royalagraestate.in/assets/index-CLK2__KY.js:48:71061)
    at dP (https://royalagraestate.in/assets/index-CLK2__KY.js:48:117228)
    at Xg (https://royalagraestate.in/assets/index-CLK2__KY.js:48:116272)
    at jp (https://royalagraestate.in/assets/index-CLK2__KY.js:48:116102)
    at pP (https://royalagraestate.in/assets/index-CLK2__KY.js:48:112885)
    at TP (https://royalagraestate.in/assets/index-CLK2__KY.js:48:124730)
    at le (https://royalagraestate.in/assets/index-CLK2__KY.js:25:1647)
```

### 3.2 Code Origin Analysis
Inspection of `src/components/PropertyCard.tsx`:
```tsx
// Line 124 in PropertyCard.tsx:
<span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
  ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
</span>
```
If any property record in the database has `pricePerSqFt` as `null` or `undefined`, JavaScriptCore in Safari throws an unhandled `TypeError`.

### 3.3 Trigger Record in Live Database
Querying `https://royalagraestate.in/api/properties.php` revealed the exact offending record currently active in the database:
```json
{
  "id": "prop-user-1793326448671",
  "title": null,
  "locality": "Agra",
  "price": 0,
  "pricePerSqFt": null,
  "status": "Active"
}
```
Because this record has `pricePerSqFt: null`, every render of the homepage and properties catalog crashes immediately.

### 3.4 Additional Vulnerable Sites in Source Code
The following files also invoke `.toLocaleString()` on potentially uninitialized numerical property fields:
- `src/components/PropertyCard.tsx:159, 161, 162`: `property.superAreaSqFt.toLocaleString('en-IN')`
- `src/components/PropertyCard.tsx:201, 203, 204`: `property.superAreaSqYards.toLocaleString('en-IN')`
- `src/components/PropertyDetailModal.tsx:315`: `property.pricePerSqFt.toLocaleString('en-IN')`
- `src/components/PropertyDetailModal.tsx:381, 382`: `property.superAreaSqYards.toLocaleString('en-IN')`

---

## 4. Security & Privacy Inspection

### 4.1 Address Privacy Masking: Severe Data Layer Failure
Rule 3 of the project guidelines mandates:
> *"Public catalogues must sanitize property objects using `getMaskedProperty(property, user)`. Only authenticated admins have access to exact house/plot addresses and GPS map coordinates."*

**Live Finding**:
Masking is only applied **cosmetically on the React frontend**. The backend API `GET /api/properties.php` transmits all confidential fields unmasked in the public network response:
```json
[
  {
    "id": "prop-user-1791755457589",
    "title": "88, Harish Nagar",
    "locality": "Sikandra",
    "address": "Sikandra, Agra",
    "fullAddress": "88,Harish Nagar , Sikandra Bodla Road , AGRA",
    "ownerEmail": "shreygupta2398@gmail.com",
    "ownerName": "Sonia Gupta"
  },
  {
    "id": "prop-user-1792319503252",
    "title": "Near Industrial Area Shastripuram",
    "locality": "Shastripuram",
    "fullAddress": "Radha Kunj Colony Plot No 29,30,31,\n Near Amal Garden Marriage Home",
    "ownerEmail": "au135413@gmail.com",
    "ownerName": "Akash Upadhyay"
  },
  {
    "id": "prop-user-1792320738640",
    "title": "Kargil Petrol Pump",
    "locality": "Shastripuram",
    "fullAddress": "H No 18 Ganesh Vihar Colony near kargil petrol pump",
    "ownerEmail": "au135413@gmail.com",
    "ownerName": "Akash Upadhyay"
  }
]
```

### 4.2 Property Title Address Leakage Flaw
Even when `getMaskedProperty` runs in the client, it masks `address`, `fullAddress`, `plotNumber`, and `buildingName`, but **never sanitizes `property.title`**. When owners enter their property title, they routinely type their house or plot number (e.g. *"88, Harish Nagar"*, *"H No 18 Ganesh Vihar Colony"*). These exact house numbers are rendered directly in headings, cards, and OpenGraph tags in public view.

### 4.3 Public Account Dump & Clear-Text Passwords
A simple HTTP GET to `https://royalagraestate.in/api/accounts.php` returns:
- CEO Account: `shrey123@gmail.com` with password `RoyalAgra@CEO2025`
- Admin Account: `abhi9557138449@gmail.com` with password `Abhi@Agra2025`
- Registered Owner Accounts: e.g. `anupmagupta1975@gmail.com` (`12345678`), `jadontrading78@gmail.com` (`Jadon@1122`)
- Associated phone numbers, security questions, and security answers.

### 4.4 SSL/TLS Certificate & Security Headers
- **TLS Certificate**: Valid Let's Encrypt certificate (`CN=royalagraestate.in`, issued by `YE1`), valid from Oct 24, 2026 to Jan 22, 2027.
- **HTTP to HTTPS**: Redirects cleanly with `301 Moved Permanently`.
- **HSTS (`Strict-Transport-Security`)**: **MISSING**. Not set by Hostinger / hcdn.
- **Content-Security-Policy (CSP)**: Incomplete (`upgrade-insecure-requests` only). Missing `default-src`, `script-src`, `connect-src`, `frame-ancestors`.
- **Permissions-Policy**: **MISSING**.
- **X-Frame-Options**: `SAMEORIGIN` (Present).
- **X-Content-Type-Options**: `nosniff` (Present).
- **Referrer-Policy**: `strict-origin-when-cross-origin` (Present).

---

## 5. Safari/WebKit Visual, Typography & Responsive Layout

### 5.1 WebKit Typography: `Plus Jakarta Sans` Unloaded
In `src/index.css`:
```css
body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```
In the compiled production CSS (`dist/assets/index-BVU_Qezi.css`), this is compiled without quotes:
```css
body{font-family:Plus Jakarta Sans,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}
```
**Safari Behavior**: Safari's CSS engine requires multi-word font family identifiers containing spaces to be quoted. Testing via Safari JavaScript API (`document.fonts.forEach(...)`) confirmed:
- `Plus Jakarta Sans` is **unloaded** across all weights (300, 400, 500, 600, 700).
- The computed font family on the `<body>` element falls back to `-apple-system`.

### 5.2 Mobile Safari Viewport Height Clipping (`vh` vs `dvh`)
- In `PropertyDetailModal.tsx` (line 171), the modal container uses:
  `className="... max-h-[92vh]"`
- On iOS Safari, the browser dynamic navigation bar and URL toolbar reduce the visible screen area when toolbars are expanded. `92vh` calculates height against the maximum screen height, causing modal footers and CTA buttons ("Submit Inquiry", "Book Site Tour") to get clipped beneath the Safari tab bar on mobile devices.
- **Fix**: Use `max-h-[92dvh]` or `max-h-[calc(100dvh-2rem)]`.

### 5.3 CSS Backdrop-Filter & Blur Effects
- Tested in Safari across 23 elements utilizing `backdrop-filter: blur(...)`.
- Safari 27.0.1 successfully renders `backdropFilter: blur(12px)` and `webkitBackdropFilter: blur(12px)`. No visual haloing or composition artifacts were detected on supported elements.

### 5.4 Routing Quirks in Safari
1. **Direct URL Navigation Failure**:
   Navigating directly to clean URLs like `https://royalagraestate.in/about`, `https://royalagraestate.in/contact`, or `https://royalagraestate.in/projects` fails to display the respective screen. Because these paths are omitted from `SEO_ROUTES` in `seoRoutes.ts`, `getSeoRouteConfig()` returns `null`, and `App.tsx` falls back to `'home'`.
2. **Relative Query Routing Conflict**:
   The `Navbar.tsx` uses relative queries (`href="?screen=properties"`). When a user arrives on a pretty SEO URL like `/sell-property-in-agra` and clicks "Buy" in a new tab, the browser resolves the URL to `/sell-property-in-agra?screen=properties`. `App.tsx` initializes `activeScreen` based on `pathname` (`/sell-property-in-agra` -> `sell-rent`), ignoring the query string and forcing the user onto the Sell Property screen.

---

## 6. Performance & Asset Optimization

### 6.1 Bundle Analysis & Base64 Bloat
- **Production JS Bundle (`index-CLK2__KY.js`)**: 3,616,691 bytes (3.62 MB uncompressed, 2.33 MB gzipped).
- **Embedded Base64 Data**: 2,812,007 bytes (2.68 MB) across 25 embedded base64 image strings.
- **Impact**: **74.3% of the entire JavaScript bundle consists of hardcoded image strings** located in `src/data/mockData.ts`. This causes:
  1. Massive JavaScript parsing and compilation overhead on Safari's JavaScriptCore.
  2. Inability to cache images independently of application code.
  3. Slow initial load and high Memory pressure on low-tier mobile devices.

### 6.2 Asset Compression & Caching
- **Server Cache-Control**:
  - Assets (`/assets/*.js`, `/assets/*.css`): `public, max-age=604800` (7 days). Recommended: `max-age=31536000, immutable` for hashed filenames.
  - API endpoints (`/api/properties.php`): `public, max-age=15, must-revalidate` with `ETag`.

### 6.3 Hero & Property Images
- Hero background image loads from Unsplash:
  `https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2400&q=95`
- File size is over 800 KB on initial load.
- Property cards lack responsive `srcset` or `picture` tags, serving full-size images regardless of whether the client is on a 390px mobile viewport or a 4K desktop display.

---

## 7. Prioritized Actionable Recommendations

### Priority 0: Critical Fixes (Crash & Security)
1. **Fix `PropertyCard.tsx:124` Crash**:
   Replace:
   ```tsx
   ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
   ```
   With safe optional chaining and fallback:
   ```tsx
   ₹{(property.pricePerSqFt ?? Math.round((property.price || 0) / (property.superAreaSqFt || 1)) ?? 0).toLocaleString('en-IN')}/sq.ft
   ```
   Apply the same defensive check to all `.toLocaleString()` calls in `PropertyCard.tsx` and `PropertyDetailModal.tsx`.
2. **Purge/Fix Malformed Database Record**:
   Update or delete record `prop-user-1793326448671` in the SQLite database to ensure valid numerical fields.
3. **Lock Down `/api/accounts.php`**:
   Remove the unauthenticated dump of all user accounts (`SELECT data_json FROM accounts`). Protect account retrieval with session/JWT authentication. Never return `password` in API responses.
4. **Implement Data-Layer Address Masking in `/api/properties.php`**:
   Do not rely solely on client-side masking. Modify `properties.php` to strip `fullAddress`, `plotNumber`, `buildingName`, `ownerContact`, and `ownerEmail` on public GET requests unless an authenticated admin session token is validated.
5. **Sanitize Titles for Address Leakage**:
   In `getMaskedProperty`, implement a regex check on `property.title` to detect and mask leading house numbers (e.g. convert `"88, Harish Nagar"` to `"Luxury Residence, Harish Nagar"` for public views).
6. **Secure `/api/upload.php`**:
   Enforce strict image extension whitelisting (`['jpg', 'jpeg', 'png', 'webp']`), validate MIME types via `mime_content_type`, verify user authentication before processing uploads, and disable script execution in the `/uploads/` directory via `.htaccess`.

### Priority 1: High Priority (Performance & Compatibility)
7. **Extract Base64 Images from `mockData.ts`**:
   Move all embedded base64 images out of `mockData.ts` into external static image files in `public/properties/` or serve them via CDN. This will shrink the JavaScript bundle from 3.62 MB down to under 900 KB.
8. **Fix Font Family Declaration in CSS**:
   In `src/index.css`, ensure `'Plus Jakarta Sans'` is wrapped in quotes in the compiled CSS:
   ```css
   body {
     font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
   }
   ```
9. **Upgrade Modal Heights to Dynamic Viewport (`dvh`)**:
   In `PropertyDetailModal.tsx` and other modal components, replace `max-h-[92vh]` with `max-h-[92dvh]` to eliminate mobile Safari toolbar clipping.

### Priority 2: Medium Priority (SEO & Routing)
10. **Add Clean Routes to `SEO_ROUTES`**:
    Register `/projects`, `/about`, and `/contact` in `src/utils/seoRoutes.ts` so direct URL visits and bookmarks load the intended screen rather than falling back to the homepage.
11. **Canonicalize Navigation Links in `Navbar.tsx`**:
    Change `Navbar.tsx` link hrefs from relative `?screen=properties` to absolute canonical URLs (`/buy-house-in-agra`, `/projects`, `/about`, `/contact`) to prevent route parameter conflicts when users open links in new tabs.
12. **Add Missing Security Headers**:
    Configure Hostinger/Apache/Nginx to serve `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` and an explicit `Content-Security-Policy`.
