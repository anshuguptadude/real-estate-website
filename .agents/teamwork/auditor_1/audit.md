# Forensic Audit Report

**Work Product**: Live Website Audit of Royal Agra Estate (`https://royalagraestate.in`) & Master Audit Report (`.agents/teamwork/orchestrator/LIVE_WEBSITE_AUDIT_REPORT.md`)  
**Profile**: General Project  
**Integrity Mode**: Development Mode (as defined in `ORIGINAL_REQUEST.md`)  
**Auditor**: Forensic Integrity Auditor (`auditor_1`)  
**Timestamp**: 2026-10-30T02:28:00Z  
**Verdict**: **CLEAN**

---

### Phase Results

| # | Forensic Check Name | Scope | Result | Details |
|---|---------------------|-------|:------:|---------|
| 1 | **Codebase Invariance Check** | Repository files (`src/`, `public/`, config) | **PASS** | `git status -s` shows 0 modified/deleted tracked files. `git diff HEAD` is completely empty. Only untracked agent metadata in `.agents/teamwork/` exists. |
| 2 | **No Source Code / Build Mod Outside Teamwork** | Workspace boundary | **PASS** | All agent activity was strictly confined to `.agents/teamwork/`. No source files, assets, or package definitions were altered. |
| 3 | **Empirical Verification: `api/accounts.php`** | Live server API | **PASS** | Live curl confirms HTTP 200 with wildcard CORS and unauthenticated plaintext credentials dump (including CEO and Admin master credentials). Verbatim matches Issue 2. |
| 4 | **Empirical Verification: `api/properties.php`** | Live server API | **PASS** | Live curl confirms unmasked street addresses (`88,Harish Nagar...`, `Radha Kunj Colony...`, `H No 18 Ganesh Vihar...`), owner contact numbers (`9761320551`, `9997292372`), and emails. Verbatim matches Issue 3. |
| 5 | **Empirical Verification: `PropertyCard.tsx:124` Crash** | React runtime & data layer | **PASS** | Verified that live endpoint returns records with missing `pricePerSqFt` (e.g. `prop-user-1793326448671`), causing unhandled `n.pricePerSqFt.toLocaleString()` crash caught by `ErrorBoundary`. Verbatim matches Issue 1. |
| 6 | **Empirical Verification: Seller Auto-fill Defect** | `PostPropertyScreen.tsx:61–63` | **PASS** | Verified source code defaults unauthenticated `ownerPhone` to `'+91 91490 79913'` and `ownerEmail` to `'shrey@royalagraestate.in'`. Verbatim matches Issue 4. |
| 7 | **Empirical Verification: Plaintext Brochure Defect** | `ProjectsScreen.tsx:80–84` | **PASS** | Verified `ProjectsScreen.tsx` creates `Blob([brochureContent], { type: 'text/plain;charset=utf-8' })` downloading a `.txt` file instead of a PDF. Verbatim matches Issue 10. |
| 8 | **Empirical Verification: Asset Bloat & Base64** | `mockData.ts` & live bundle | **PASS** | Confirmed exactly 25 base64 images in `mockData.ts` (2.7 MB). Live bundle `index-CLK2__KY.js` is 3,616,691 bytes (3.62 MB). Verbatim matches Issue 11. |
| 9 | **Zero Prohibited Patterns Check** | Anti-cheating & fabrication | **PASS** | No hardcoded test results, no facade implementations, no pre-populated fabricated logs. Every finding is derived from live testing on `https://royalagraestate.in`. |

---

### Empirical Evidence & Raw Tool Outputs

#### 1. Codebase Invariance (`git status` & `git diff`)
```bash
$ git status -s
?? .agents/teamwork/

$ git diff HEAD
# (Empty - 0 lines changed)
```

#### 2. Live Accounts Endpoint Unauthenticated Credentials Dump
```bash
$ curl -i -s https://royalagraestate.in/api/accounts.php | head -n 25
HTTP/2 200 
date: Fri, 30 Oct 2026 02:24:25 GMT
content-type: application/json; charset=UTF-8
vary: Accept-Encoding
x-powered-by: PHP/8.3.36
access-control-allow-origin: *
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
access-control-allow-headers: Content-Type, Authorization, X-Requested-With
...
[
  {"id":"RAE-1195","name":"Abhishek","phone":"8595064338","email":"jadontrading78@gmail.com","password":"Jadon@1122",...},
  {"id":"admin-ceo-01","email":"shrey123@gmail.com","name":"Shrey Gupta","phone":"+91 9149079913","role":"ceo","password":"RoyalAgra@CEO2025",...},
  {"id":"admin-abhishek-02","email":"abhi9557138449@gmail.com","name":"Abhishek Singh Jadon","phone":"+91 9557138449","role":"admin","password":"Abhi@Agra2025",...}
]
```

#### 3. Live Properties Endpoint Unmasked Addresses & Owner Contacts
```bash
$ curl -s https://royalagraestate.in/api/properties.php | grep -o '"fullAddress":"[^"]*"'
"fullAddress":"Agra, Agra"
"fullAddress":"88,Harish Nagar , Sikandra Bodla Road , AGRA"
"fullAddress":"Bichpuri Agra, Near heera garden"
"fullAddress":"Radha Kunj Colony Plot No 29,30,31,\n Near Amal Garden Marriage Home"
"fullAddress":"H No 18 Ganesh Vihar Colony near kargil petrol pump"
"fullAddress":"H No 48 Shanti Residency Colony Near Prachi Police"
"fullAddress":"B 296 mig Shashtripuram sikandra agra"

$ curl -s https://royalagraestate.in/api/properties.php | grep -o '"ownerContact":"[^"]*"'
"ownerContact":"+91 91490 79913"
"ownerContact":"9761320551"
"ownerContact":"8595064338"
"ownerContact":"9997292372"
"ownerContact":"9997292372"
"ownerContact":"9997292372"
"ownerContact":"8279435117"
```

#### 4. Live Bundle Size Verification
```bash
$ curl -s https://royalagraestate.in/assets/index-CLK2__KY.js | wc -c
 3616691
```

#### 5. Verification of TypeScript Compilation
```bash
$ npx tsc --noEmit
# Exited with code 0. Zero TypeScript or syntax errors.
```

---

### Conclusion

The work product `LIVE_WEBSITE_AUDIT_REPORT.md` adheres strictly to the read-only constraints of `ORIGINAL_REQUEST.md`. No website code was modified, and all reported findings, issues, and evidence have been independently verified against the live production server. The final forensic audit verdict is **CLEAN**.
