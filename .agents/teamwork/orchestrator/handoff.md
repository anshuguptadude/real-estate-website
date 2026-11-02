# Orchestrator Handoff Report: Royal Agra Estate Live Safari Audit

**Auditor**: Project Orchestrator (`teamwork_orchestrator`)  
**Parent / Caller Conversation ID**: `10d32645-5a85-43f7-a3b7-47a26800dc05`  
**Date**: October 30, 2026  
**Handoff Type**: Hard Handoff (Audit Complete & Gate Passed)  
**Primary Deliverable**: `file:///Users/shrey/.gemini/antigravity/worktrees/Final website /property_address_privacy_settings/.agents/teamwork/orchestrator/LIVE_WEBSITE_AUDIT_REPORT.md`

---

## 1. Milestone State
| Milestone | Description | Status | Gate Verdict |
|---|---|---|---|
| M0: Scope Survey | 3-way parallel survey (Buyer, Seller, Technical) | DONE | PASS |
| M1: Technical & Console Audit | WebKit console exceptions, /api/ & SQLite endpoints, network leaks | DONE | PASS |
| M2: Buyer & Seller Journey UX | Search, filters, forms, privacy masking, Safari quirks | DONE | PASS |
| M3: Synthesis & Verification | Master report synthesis, Reviewer approval, Forensic clean audit | DONE | PASS |

---

## 2. Key Observations & Verified Findings

### Observation 1: P0 Fatal Live Homepage Crash in Safari
- In `src/components/PropertyCard.tsx:124`, `property.pricePerSqFt.toLocaleString('en-IN')` throws an unhandled `TypeError: undefined is not an object (evaluating 'n.pricePerSqFt.toLocaleString')` whenever any listing lacking `pricePerSqFt` is served.
- Live database contains record `prop-user-1793326448671` with `pricePerSqFt: null`, causing the entire live homepage to unmount into `ErrorBoundary.tsx`.

### Observation 2: P0 Unauthenticated Master Credentials Dump
- `GET https://royalagraestate.in/api/accounts.php` has zero authentication and returns `HTTP 200` with `Access-Control-Allow-Origin: *`.
- Dumps plaintext passwords for all users, including CEO (`shrey123@gmail.com`: `RoyalAgra@CEO2025`) and Admin (`abhi9557138449@gmail.com`: `Abhi@Agra2025`).
- The frontend caches these plaintext accounts into visitors' `localStorage.royal_agra_accounts_backup`.

### Observation 3: P0 Location Privacy Leak at Data Layer
- While client-side React code masks addresses in the DOM, `GET https://royalagraestate.in/api/properties.php` sends raw unmasked records across the public internet.
- Anyone can read exact house numbers ("88, Harish Nagar", "Radha Kunj Colony Plot No 29,30,31"), owner names, personal phone numbers, and private Google Maps links. Data is cached into client `localStorage.royal_agra_properties_v2`.

### Observation 4: P0 Seller Agency Contact Pre-fill Defect
- In `src/components/PostPropertyScreen.tsx:61–63`, unauthenticated sellers visiting `/sell-property-in-agra` have their phone and email pre-filled with the agency's contact info (`+91 91490 79913` and `shrey@royalagraestate.in`), causing listings to be attributed to the agency rather than the actual owner.

### Observation 5: P0 Backend Vulnerabilities
- `/api/upload.php` accepts uploads without authentication or file extension whitelisting.
- `/api/properties.php` and `/api/accounts.php` accept unauthenticated `DELETE` requests.

### Observation 6: P1 Safari WebKit & UX Issues
- Photo dropzone in `PostPropertyScreen.tsx` lacks `e.preventDefault()`, causing Safari to navigate away if an image is dragged onto it, losing all form data.
- "Download E-Brochure (PDF)" on Projects screen downloads a plain `.txt` file.
- JS bundle is 3.62 MB, with 74.3% (2.68 MB) comprised of 25 base64 images inside `mockData.ts`.
- `Plus Jakarta Sans` font is unloaded in Safari due to unquoted font family declaration in compiled CSS.
- Promoted luxury corridors (Fatehabad Road, Dayalbagh, Civil Lines) return 0 search results.

---

## 3. Logic Chain
1. A single missing field (`pricePerSqFt`) in a database record bubbles up to `PropertyCard.tsx`, crashing the entire site because there is no fallback calculation or nullish coalescing.
2. The architectural decision to mask addresses client-side fails because backend PHP endpoints transmit full database rows without server-side filtering.
3. The lack of backend session management on Hostinger PHP endpoints exposes all credentials, allows unauthorized deletions, and creates arbitrary upload risks.
4. The UX gaps in Safari (drag-and-drop trap, unquoted fonts, `.txt` brochures, empty search states) erode buyer and seller trust in a luxury brand.

---

## 4. Caveats
- Strictly read-only audit: Zero website source code files were modified (`git status` 100% clean).
- Database records were inspected via read-only requests. No test records were deleted from the live server.
- All testing was conducted against Safari 27.0.1 on macOS and live production endpoints at `https://royalagraestate.in`.

---

## 5. Conclusion & Verification
- Reviewer 1 Verdict: **APPROVE** (`reviewer_1/review.md`)
- Forensic Auditor Verdict: **CLEAN** (`auditor_1/audit.md`)
- Compilation check: `npx tsc --noEmit` compiles cleanly with 0 errors.
- Deliverable: Master report available at `.agents/teamwork/orchestrator/LIVE_WEBSITE_AUDIT_REPORT.md`.
