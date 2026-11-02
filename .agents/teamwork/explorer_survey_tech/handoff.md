# Handoff Report — Technical & Safari Health Explorer

**Agent**: `explorer_survey_tech`  
**Milestone**: M0 Scope Survey / Technical Health Audit  
**Handoff Type**: Hard (Task Complete)  

---

## 1. Observation

1. **Fatal Live Homepage Crash in Safari**:
   - Visiting `https://royalagraestate.in/` renders `ErrorBoundary` fallback: *"We encountered a temporary loading issue. Please refresh or reset the cache to load the latest luxury listings in Agra."*
   - Verbatim error extracted from React fiber node in live Safari 27.0.1:
     ```
     TypeError: undefined is not an object (evaluating 'n.pricePerSqFt.toLocaleString')
         at d0 (https://royalagraestate.in/assets/index-CLK2__KY.js:452:34230)
     ```
   - In `src/components/PropertyCard.tsx:124`:
     ```tsx
     ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
     ```
   - In live database response from `https://royalagraestate.in/api/properties.php`:
     ```json
     {"id":"prop-user-1793326448671","title":null,"locality":"Agra","price":0,"pricePerSqFt":null,"status":"Active"}
     ```

2. **Unauthenticated Public Credentials Dump**:
   - Request: `curl -s https://royalagraestate.in/api/accounts.php`
   - Response preview:
     ```json
     [{"id":"RAE-1195","name":"Abhishek","phone":"8595064338","email":"jadontrading78@gmail.com","password":"Jadon@1122","securityQuestion":"What city were you born in?","securityAnswer":"agra","role":"owner"...},
     {"id":"admin-ceo-01","email":"shrey123@gmail.com","name":"Shrey Gupta","phone":"+91 9149079913","role":"ceo","password":"RoyalAgra@CEO2025","permissions":["FULL_ADDRESS_ACCESS","AUTO_APPROVE"...]},
     {"id":"admin-abhishek-02","email":"abhi9557138449@gmail.com","name":"Abhishek Singh Jadon","phone":"+91 9557138449","role":"admin","password":"Abhi@Agra2025"...}]
     ```
   - Response header: `access-control-allow-origin: *`

3. **Data Layer Location Privacy Leak**:
   - Request: `curl -s https://royalagraestate.in/api/properties.php`
   - Verbatim payload fields returned without authentication:
     - `fullAddress: "88,Harish Nagar , Sikandra Bodla Road , AGRA"` (Property 1)
     - `fullAddress: "Radha Kunj Colony Plot No 29,30,31, Near Amal Garden Marriage Home"` (Property 3)
     - `fullAddress: "H No 18 Ganesh Vihar Colony near kargil petrol pump"` (Property 4)
     - `fullAddress: "H No 48 Shanti Residency Colony Near Prachi Police"` (Property 5)
     - `ownerEmail: "shreygupta2398@gmail.com"`, `ownerName: "Sonia Gupta"`

4. **Arbitrary File Upload without Whitelist**:
   - In `dist/api/upload.php:21-25`:
     ```php
     $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) ?: 'jpg';
     $safe_name = 'prop_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
     $target = $upload_dir . '/' . $safe_name;
     move_uploaded_file($file['tmp_name'], $target);
     ```
   - No extension whitelist and no authentication check.

5. **JavaScript Bundle Weight & Base64 Bloat**:
   - Total uncompressed size of `index-CLK2__KY.js`: 3,616,691 bytes (3.62 MB).
   - Analysis of base64 strings in bundle: 25 occurrences, totaling 2,812,007 bytes (2.68 MB, 74.3% of the entire JavaScript bundle).
   - Source: `src/data/mockData.ts` contains raw base64 JPEGs imported directly into `App.tsx` and 8 other components.

6. **Safari Font Unloaded**:
   - In `dist/assets/index-BVU_Qezi.css:1`:
     `body{font-family:Plus Jakarta Sans,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}`
   - `document.fonts.check('16px "Plus Jakarta Sans"')` in Safari returns `false`.

7. **Direct URL Routing Crash / 404 Behavior**:
   - Visiting `https://royalagraestate.in/about` or `https://royalagraestate.in/contact` in Safari renders the homepage because they are missing from `SEO_ROUTES` in `src/utils/seoRoutes.ts`.
   - Visiting `https://royalagraestate.in/projects` defaults to the homepage and immediately hits the `pricePerSqFt` crash.

---

## 2. Logic Chain

1. **From Observation 1**: A property record exists in the SQLite database (`prop-user-1793326448671`) where `pricePerSqFt` is `null`. When `PropertyCard.tsx` renders this property, it calls `.toLocaleString()` directly on `null`. In JavaScriptCore, `null.toLocaleString()` throws `TypeError: undefined is not an object (evaluating 'n.pricePerSqFt.toLocaleString')`. This bubbles to `ErrorBoundary.tsx`, which mounts the fallback UI. Because the homepage loads all active properties on load, the homepage is rendered completely unusable.
2. **From Observation 2**: In `dist/api/accounts.php`, lines 28-36 query `SELECT data_json FROM accounts` and output all rows whenever `$_GET['email']` and `$_GET['phone']` are omitted. There is no session check, API token check, or authentication header verification. Combined with `access-control-allow-origin: *`, any malicious origin can fetch all account credentials via CSRF/CORS.
3. **From Observation 3**: Although `src/utils/security.ts:getMaskedProperty` strips `fullAddress`, `plotNumber`, and `buildingName` on the client, `dist/api/properties.php` executes `SELECT data_json FROM properties` and outputs it directly. Consequently, address masking is not enforced at the data layer, violating project privacy invariants.
4. **From Observation 4**: In `dist/api/upload.php`, `$ext` is derived straight from `$file['name']` without checking against an allowed list of image extensions (`jpg`, `jpeg`, `png`, `webp`). Because files are saved to `dist/uploads/` on a server running PHP 8.3, this constitutes an unrestricted file upload vulnerability.
5. **From Observation 5**: `src/data/mockData.ts` embeds 25 base64 image strings. Because `mockData.ts` is imported statically into `App.tsx`, Vite bundles all 2.68 MB of image data into the initial JavaScript chunk, creating an oversized 3.62 MB bundle that impedes mobile Safari performance.
6. **From Observation 6**: CSS specifications require font names with whitespace to be enclosed in quotes. Tailwind v4's compiled output emitted `font-family:Plus Jakarta Sans...` unquoted. Safari's CSS parser skips the unquoted multi-word identifier and falls back to `-apple-system`.

---

## 3. Caveats

- **Hostinger Database Mutations**: The audit was strictly read-only. We did not delete or modify record `prop-user-1793326448671` on the live database, nor did we execute test exploit uploads against `/api/upload.php`.
- **Firebase Hosting vs Hostinger**: The repository contains `firebase.json` and `deploy:firebase` scripts, but live DNS points to Hostinger (`mum-edge` / `hcdn`). Any deployment procedures must account for whether the target is Hostinger FTP/Git or Firebase Hosting.

---

## 4. Conclusion

The live site https://royalagraestate.in has critical P0 issues requiring immediate intervention:
1. **Live Crash**: The homepage is completely down due to an uncaught `TypeError` in `PropertyCard.tsx:124` triggered by a malformed property record in the database.
2. **Security Vulnerability**: User and admin accounts (with cleartext passwords) are exposed at `/api/accounts.php`, unmasked addresses leak at `/api/properties.php`, and `/api/upload.php` allows unauthenticated uploads.
3. **Performance Bottleneck**: The JS bundle is heavily bloated (3.62 MB) due to 2.68 MB of embedded base64 images in `mockData.ts`.
4. **WebKit Quirks**: `Plus Jakarta Sans` is unloaded due to unquoted CSS, and mobile modal heights overflow due to `92vh` instead of `92dvh`.

---

## 5. Verification Method

To independently verify these findings:

1. **Verify Live Homepage Crash**:
   ```bash
   osascript -e '
   tell application "Safari"
       open location "https://royalagraestate.in/"
       delay 3
       do JavaScript "document.body.innerText.includes(\"temporary loading issue\")" in current tab of window 1
   end tell'
   # Returns: true (demonstrating the crash screen is active)
   ```

2. **Verify Public Credentials Dump**:
   ```bash
   curl -s https://royalagraestate.in/api/accounts.php | grep -E "(RoyalAgra@CEO2025|Abhi@Agra2025)"
   # Returns the full JSON array containing CEO and Admin cleartext passwords.
   ```

3. **Verify Data Layer Address Leak**:
   ```bash
   curl -s https://royalagraestate.in/api/properties.php | grep -o '"fullAddress":"[^"]*"'
   # Returns exact unmasked street addresses.
   ```

4. **Verify Bundle Size and Base64 Ratio**:
   ```bash
   curl -s https://royalagraestate.in/assets/index-CLK2__KY.js | wc -c
   # Returns ~3,616,691 bytes.
   ```

5. **Verify Project Compilation & Lint**:
   ```bash
   npx tsc --noEmit
   ```
