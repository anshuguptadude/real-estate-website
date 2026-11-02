# Progress — Technical & Safari Health Explorer

- Last visited: 2026-10-30T02:18:45Z
- Status: IN_PROGRESS (Investigation Complete, Preparing Report & Handoff)
- Milestone: M0 Scope Survey / Technical Health Audit

## Tasks
- [x] Initial dispatch & project setup
- [x] 1. SSL/TLS Certificate & Security Headers Audit (HSTS, CSP, X-Frame-Options, CORS, etc.)
  - Let's Encrypt certificate valid through Jan 22, 2027.
  - HSTS missing! Permissions-Policy missing! CSP is minimal (`upgrade-insecure-requests`).
  - Wildcard CORS (`Access-Control-Allow-Origin: *`) on all PHP API endpoints.
- [x] 2. Live Network & Backend API Audit (endpoints under /api/, Firestore, 4xx/5xx errors, CDN)
  - `/api/properties` returns HTML (SPA fallback), while `/api/properties.php` executes PHP 8.3 on Hostinger.
  - P0 Critical: `/api/accounts.php` returns all user & admin accounts with plain-text passwords and security questions/answers without any authentication!
  - P0 Critical: `/api/upload.php` has unrestricted file upload without extension whitelisting (RCE risk).
  - P0 Critical: Anyone can DELETE any property or account via unauthenticated `DELETE /api/properties.php?id=...` and `DELETE /api/accounts.php?email=...`.
  - Architecture divergence: Frontend migrated to Hostinger SQLite backend, leaving dummy Firestore exports.
- [x] 3. Safari & WebKit Console & Runtime Error Monitoring (exceptions, hydration, warnings)
  - P0 Fatal Live Crash: Homepage currently crashed in `ErrorBoundary` with `TypeError: undefined is not an object (evaluating 'n.pricePerSqFt.toLocaleString')` in `PropertyCard.tsx:124`.
  - Caused by live database record `prop-user-1793326448671` lacking `pricePerSqFt`.
- [x] 4. Safari Visual & Responsive WebKit Checks (100dvh, backdrop-filter, flexbox/overflow, sticky nav)
  - `Plus Jakarta Sans` font is unloaded due to unquoted font family name in compiled Tailwind CSS (`body { font-family: Plus Jakarta Sans... }`).
  - Mobile Safari modal viewport clipping with `max-h-[92vh]` vs `dvh`.
  - Relative query routing (`?screen=properties`) broken when landing on clean SEO paths.
- [x] 5. Privacy & Data Layer Leak Assessment (masked vs unmasked payload verification in network traffic)
  - Verified: Massive data leak at data layer! `/api/properties.php` sends unmasked `fullAddress`, exact house numbers, and owner contacts.
  - UI title masking flaw: User-entered titles like "88, Harish Nagar" display raw house numbers in public view.
- [x] 6. Performance & Asset Optimization (LCP, bundle sizes, WebP/AVIF formats, fonts)
  - JS bundle is 3.62 MB uncompressed (2.33 MB gzipped); 2.68 MB (74%) consists of 25 hardcoded base64 images inside `mockData.ts` bundled into the main chunk.
- [ ] 7. Synthesis, report.md, handoff.md, and parent notification
