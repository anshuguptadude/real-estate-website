# Comprehensive Live Audit Report: Seller Journey & Listing Flow
**Target Website**: [https://royalagraestate.in](https://royalagraestate.in)  
**Perspective**: Affluent Luxury Property Seller & Real Estate Developer in Agra  
**Audit Environment**: Safari on macOS (WebKit Engine), Automated DOM & Protocol Testing  
**Audit Date**: October 30, 2026  
**Auditor**: Teamwork Explorer (Seller Journey Specialist)  
**Status**: Read-Only Audit Complete  

---

## Executive Summary
Royal Agra Estate provides an elegant, multi-step luxury property listing workflow tailored to the Agra market with strong location confidentiality guarantees and dynamic plot vs. residential adaptations. However, the seller journey suffers from critical UX and architectural friction: **1)** an authentication gating discrepancy that allows unauthenticated access via SEO routes while pre-filling company contact info (`+91 91490 79913` and `shrey@royalagraestate.in`) as the seller's own details; **2)** absence of step-level validation on Steps 1–3 followed by silent HTML5 submission blocking on Step 4 with zero visual error highlights; **3)** a photo dropzone lacking `preventDefault()` on drag events which causes Safari to navigate away if files are dragged; **4)** post-submission confirmation lacking an exact review SLA and direct WhatsApp Concierge connection; and **5)** a complete absence of seller-focused homepage sections, commission/brokerage fee transparency, and property valuation support.

---

## 1. Audit Methodology & Scope
The audit was conducted on the live production environment (`https://royalagraestate.in`) using macOS Safari via AppleScript (`osascript`) and headless DOM runtime probes. The investigation covered:
1. **Seller Entry Points & Homepage Discovery**: Visibility, prominence, and messaging of seller CTAs.
2. **Step-by-Step Listing Workflow**: Form inputs, dynamic toggles, custom fields, and real-time formatting across Steps 1 to 4.
3. **Address Privacy & Masking Communication**: Explicit privacy guarantees, GPS pin isolation, and confidentiality badges.
4. **Photo Upload & Canvas Compression**: File types, dropzone behavior, compression bounds (< 500 KB payload safety), and cover image selection.
5. **Form Validation & Step Transitions**: Step-by-step validation enforcement and error messaging.
6. **Submission & Post-Submission Experience**: Status handling, reference ID generation, review turnaround time, and concierge integration.
7. **Seller Value Proposition & Brand Trust**: Market authority, verified buyer network proof, brokerage/commission clarity, and valuation tools.
8. **Safari WebKit Layout & Responsive Quirks**: Mobile Safari input auto-zoom, drag-and-drop file traps, and responsive rendering.

---

## 2. Detailed Findings by Journey Phase

### 2.1 Seller Entry Points & Discovery
| Entry Point | Location | Visual Presentation | Click Behavior | Audit Finding & Friction |
|---|---|---|---|---|
| **"POST PROPERTY" Button** | Desktop Header (Right) | Pill button, White bg (`#FFFFFF`), Emerald text (`#0F382C`), uppercase bold | Triggers Login Modal if not logged in | **High Friction**: Immediately interrupts prospective sellers with account creation before demonstrating value or showing the form. |
| **"Sell/Rent" Link** | Header Navigation | Clean text link with active underline indicator | Triggers Login Modal if not logged in | Same as above. Blocked by `handleInitiatePostProperty()`. |
| **"Sell/Rent" Footer Link** | Footer Navigation | Gray text link (`#D1D5DB`) | Navigates to `?screen=sell-rent` (triggers login if unauthenticated) | Low visibility; buried in footer. |
| **"Sell Property in Agra"** | Footer SEO Section | Subdued link under "Popular Real Estate Searches" | Navigates to `/sell-property-in-agra` | **Inconsistency**: Bypasses the login gate entirely and renders the full form unauthenticated. |
| **Homepage Hero & Body** | Homepage | **None** | N/A | **Critical Gap**: The entire homepage (Hero, Featured Properties, Why Royal Agra) is 100% buyer-oriented. There is no "Sell With Us" section, no developer inquiry banner, and no seller valuation CTA anywhere on the homepage. |

---

### 2.2 Routing & Authentication Inconsistency
* **Observation**: In `src/App.tsx` (lines 400–403 and 588–596), clicking the navbar button "POST PROPERTY" or "Sell/Rent" calls:
  ```typescript
  if (screen === 'sell-rent' && !user) {
    setLoginPromptMessage('Please log in or create an account to post a property listing in Agra.');
    setPendingPostRedirect(true);
    setLoginModalOpen(true);
    return;
  }
  ```
  However, visiting `https://royalagraestate.in/sell-property-in-agra` or reloading on `?screen=sell-rent` bypasses this check because `activeScreen` is initialized directly from the URL route without checking `if (!user)`.
* **Impact**: External sellers arriving from search engines (Google ads, SEO links) can access the form without logging in, but internal site visitors clicking the prominent navbar CTA are immediately blocked by an authentication modal.
* **Severe Side Effect (Contact Pre-fill Defect)**: When an unauthenticated seller accesses the listing form via `/sell-property-in-agra`, `PostPropertyScreen.tsx` initializes state as follows (lines 61–63):
  ```typescript
  const [ownerName, setOwnerName] = useState(user?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(user?.phone || '+91 91490 79913');
  const [ownerEmail, setOwnerEmail] = useState(user?.email || 'shrey@royalagraestate.in');
  ```
  **The form pre-fills the agency's own phone number (`+91 91490 79913`) and email (`shrey@royalagraestate.in`) into the seller's contact fields!** If a seller does not notice and fails to overwrite these fields, the listing is attributed to Royal Agra Estate's staff, and the actual owner's contact information is never captured.

---

### 2.3 Step-by-Step Listing Workflow Audit

#### Step 1: Basic Info & Location
* **Listing Intent Switcher**: "Sell Property" vs "Lease / Rent Out". Correctly updates the downstream pricing label to "Expected Monthly Rent" vs "Expected Sale Price".
* **Property Type Dropdown**: Includes 16 curated luxury types (Luxury Villa, Penthouse, Heritage Haveli, Builder Floor, Farmhouse, Residential Plot, Commercial Showroom, etc.).
* **Dynamic Custom Property Type**: Selecting `"Other (Custom Type)"` instantly renders a stylized emerald input: `"Write Your Custom Property Type"` with placeholder `"e.g. Colonial Heritage Bungalow, Triplex Villa..."`.
* **Agra Localities**: Contains 10 top Agra localities (Fatehabad Road, Dayalbagh, Tajganj, Shastripuram, Sanjay Place, Sikandra, Shamshabad Road, Kamla Nagar, Vibhav Nagar, Civil Lines). Selecting `"Other"` displays `"Write Your Custom Agra Locality / Sector"`.
* **Address Privacy Reassurance**: Excellent privacy copy:
  - Green security banner: `"Public Privacy: Regular website visitors will only see Fatehabad Road, Agra."`
  - Exact address label: `"Full Exact Address (Confidential)"` with badge `"🔒 CEO & Admin Only"`.
  - Explanation: `"Your exact house/plot address is strictly private. It is never displayed publicly on the live website and is only visible to CEO and Admin accounts."`
* **Google Maps Location Pin**: Dedicated amber card with badge `"Admin & CEO Only"`, explaining that the GPS pin is used strictly for private chauffeur tour navigation and never surfaced publicly.

#### Step 2: Specs & Pricing
* **Super Area & Unit Toggle**: Supports both "Sq. Ft." and "Sq. Yards (Gaj)" with automatic live mathematical conversion (`Sq. Yards * 9 ≈ Sq. Ft.` and `Sq. Ft. / 9 ≈ Sq. Yards`).
* **Dynamic Typology Adaptation**:
  - When a plot or land type is selected (e.g. `Residential Plot / Land` or `Commercial Plot / Land`), bedroom, bathroom, and furnishing dropdowns are dynamically hidden, and an informative banner is displayed: `"Plot / Land Detected: Room, washroom, and furnishing fields are automatically omitted for plots."`
  - For residential estates, displays Bedroom selector (1 to 5+ BHK Mansion), Bathrooms (1 to 5+ Luxury Baths), Furnishing (Designer Fitted, Fully Furnished, Semi-Furnished, Unfurnished).
* **Vastu & Orientation**: Includes 10 specific facing choices, notably `"North-East (Vastu)"`, `"Park Facing"`, and `"Taj View (South-East)"`, highly appealing to luxury Agra buyers.
* **Possession Status**: Options include `"Ready to Move"`, `"Immediate Possession"`, `"Immediate Registry"`, and `"Ready for Construction / Registry"`.
* **Live Price Formatter**: Formats Indian currency in real time (e.g., `28500000` displays as `≈ ₹2.85 Cr`; `7500000` displays as `≈ ₹75.00 Lacs`), preventing costly zero-entry mistakes.

#### Step 3: Amenities, Nearby Landmarks & Photo Upload
* **Amenities Selection**: 10 toggle chips with emerald checkmarks (Swimming Pool, Private Garden, 100% Power Backup, 24/7 Security, Home Theater, Private Gym/Spa, Servant Quarters, EV Charging Point, Vastu Compliant, Covered Car Garage).
* **Agra Landmark Presets**: 10 one-click transit/heritage presets with distances (Taj Mahal East Gate 4.5 km, Metro Station 1.2 km, Lucknow Expressway 5.8 km, Agra Cantt 7.5 km, Dayalbagh Heritage Zone 6.2 km, Inner Ring Road 3.4 km, Sanjay Place 5.0 km, Kheria Airport 11.0 km, Sikandra NH-19 8.0 km, Kamla Nagar 4.8 km).
* **Custom Landmark Input**: Allows adding custom landmarks with distance and travel time. Works smoothly with live chip creation and deletion.
* **Photo Dropzone & Upload**:
  - Accepts `image/*` (JPEG, PNG, WebP) with multi-select support up to 10 photos.
  - Interactive cover photo selection: Sellers can click the star (`⭐`) on any photo to designate it as the "Display Cover".
  - Empty state warning: `"📸 No property photos uploaded yet"`.
  - Delete validation: `"A property listing must have at least one photo."`
* **Canvas Image Compression**:
  - Compresses images client-side to maximum dimensions (1200px at 0.65 quality; secondary pass at 900px at 0.52 quality if length > 70KB).
  - Guarantees overall listing payload < 500 KB, preventing Cloud Firestore payload rejections.
* **Safari Drag-and-Drop WebKit Bug**:
  - The dropzone container (`#upload-property-photos-dropzone`) has an `onClick` handler, but **lacks `onDragOver`, `onDragEnter`, and `onDrop` event listeners**.
  - **Critical Safari Glitch**: If a seller drags an image file from Finder/Desktop onto the dropzone in Safari, the browser executes its default action: **it navigates the tab directly to `file:///...` or the image URL, discarding all previously filled form data without warning**.

#### Step 4: Legal Verification & Owner Contact
* **Legal Verification Toggles**: Three clear choices:
  1. `✓ Verified & Approved` (ADA, UP RERA, Nagar Nigam, Bank Title)
  2. `⏳ In Process / Applied` (Map sanction application submitted)
  3. `✕ Not ADA / Independent` (Private registry / self-declared freehold title)
* **Authority Dropdown**: Contains 8 entities including Agra Development Authority (ADA), UP RERA, Tehsil Registry, and Nagar Nigam Agra.
* **Reference Number Input**: Optional input for ADA or RERA permit numbers.
* **Owner Contact Inputs**: Full Name, Mobile Number, Email Address.
* **Confidential Discretion Guarantee**: Explicit reassurance card stating contact info is never shared publicly and is vetted by Senior Portfolio Advisors.

---

### 2.4 Form Validation Breakdown & Flaws

| Step | Fields | Stated Required | Actual Step Transition Behavior | Flaw Severity |
|---|---|---|---|---|
| **Step 1** | Project Title, Address | Yes (`required`) | User can leave both blank and click "Continue to Specifications". **Advances to Step 2 with no validation block or error message.** | **High** |
| **Step 2** | Super Area, Asking Price | Yes (`required`) | User can leave empty; defaults are applied silently (`3000` sq.ft, `₹2.5 Cr`). No warning given. | **Medium** |
| **Step 3** | Photos | Soft validation | Photo upload is not hard-validated before proceeding to Step 4; if omitted, silently assigns an Unsplash fallback image. | **Low** |
| **Step 4** | Owner Name, Phone, Email | Yes (`required`) | Clicking "Publish Property" executes form submit. **If Owner Name is empty, Safari silently blocks submit via a small native browser bubble.** No custom UI highlighting or scroll-to-error occurs. | **High** |

**Root Cause**: The step buttons for Steps 1–3 are `type="button"` with `onClick={() => setStep(n)}`. They do not trigger HTML5 form validation. When Step 4 is reached, Step 1–3 DOM nodes are unmounted by React, so their `required` attributes are never evaluated by the browser. Only Step 4's inputs remain in the DOM during submission.

---

### 2.5 Submission & Post-Submission Experience
* **Submission Handling**:
  - Successfully generates a unique reference ID (e.g. `#RAE-318270`).
  - Correctly assigns `status: 'Pending Approval'` and `isApproved: false` for non-admin submissions.
  - Automatically pushes the listing to the Hostinger SQLite backend at `/api/properties.php`. Verified live: returns `{"success": true, ...}`.
* **Post-Submission Confirmation Screen**:
  - Displays green checkmark icon with heading: `"Property Submitted for Admin Review!"`.
  - Explains location privacy: `"Location privacy is strictly protected: only Fatehabad Road, Agra is visible publicly."`
* **Gaps in Post-Submission Experience**:
  1. **No Definite Turnaround SLA**: Mentions `"will be reviewed and published by our admin team shortly"`. It does not specify whether "shortly" means 2 hours, 24 hours, or 3 days.
  2. **No Direct WhatsApp Concierge CTA**: Despite Royal Agra Estate's prominent concierge line (`+91 91490 79913`), there is no one-click WhatsApp button on the confirmation screen pre-filled with the reference ID (e.g., `https://wa.me/919149079913?text=Hi%20Royal%20Agra%20Estate,%20I%20just%20listed%20my%20property%20ref%20%23RAE-318270`).
  3. **"View in My Dashboard" Orphan Trap**:
     - If the seller submitted via `/sell-property-in-agra` without prior login, clicking `"View in My Dashboard"` opens the Login Modal: `"Please log in or create an account to view your dashboard."`
     - When the seller registers a new account, the newly created user ID (`user.id`) will **not match** the unauthenticated listing's `ownerId` (`'RAE-OWNER-01'`). As a result, the listing will **never appear in their dashboard**, causing significant confusion.

---

### 2.6 Seller Value Proposition & Brand Trust Audit

| Trust Factor | Evaluation | Observation & Deficit |
|---|---|---|
| **Agra Luxury Market Authority** | **Moderate** | Strong visual design (Cinzel / Playfair typography, deep emerald palette), mentions Taj Mahal corridor and ADA approvals, but lacks past transaction milestones, developer partners, or luxury case studies. |
| **Verified Buyer Network Proof** | **Weak** | Claims to connect with "verified HNIs, NRIs, and serious buyers", but provides zero quantifiable proof points (e.g., "500+ Registered Agra HNIs", "Active NRI Buyer Registry"). |
| **Commission & Brokerage Rates** | **Missing** | **Zero transparency.** There is no mention of commission rates (e.g. 1%, 2%, or 0% for direct builder projects), no fee schedule, and no explanation of brokerage terms anywhere on the portal. |
| **Property Valuation Support** | **Missing** | While buyers have an interactive EMI Calculator, sellers have **no property valuation calculator, no circle rate estimator, and no Agra locality price-per-sq.ft index**. |
| **Developer / Bulk Listing Support** | **Missing** | The form accommodates single listings only. There is no portal or contact flow for Agra real estate developers wishing to list multi-unit inventory (townships, towers, luxury floors). |

---

### 2.7 Safari & WebKit Quirks

1. **Mobile Safari Input Auto-Zoom**:
   - The form uses Tailwind classes `text-xs` (12px) and `text-sm` (14px) on inputs, selects, and textareas:
     - `#verified-authority-select`: `12px`
     - `#post-owner-name`: `14px`
     - `#post-owner-phone`: `14px`
     - `#post-owner-email`: `14px`
   - In WebKit (iOS Safari), focusing any input with font-size < 16px triggers an automatic viewport zoom-in, causing horizontal distortion and requiring manual pinch-to-zoom out.
2. **Drag & Drop File Dropzone Navigation Trap**:
   - Dropping files onto `#upload-property-photos-dropzone` triggers Safari's native file-open navigation rather than uploading the file.
3. **Pill Border-Radius Calculation**:
   - The "POST PROPERTY" navbar button computes to `border-radius: 340282001837565597733306976381245063168px` (`rounded-full`), which renders smoothly in desktop Safari WebKit without pixelation.

---

## 3. Prioritized Actionable Recommendations

### Priority 1: Critical Fixes (Data Integrity & High-Friction Blockers)

1. **Eliminate Agency Contact Auto-Fill for Logged-Out Sellers**:
   - *Target*: `src/components/PostPropertyScreen.tsx` (lines 61–63)
   - *Issue*: Unauthenticated sellers default to `shrey@royalagraestate.in` and `+91 91490 79913`.
   - *Recommendation*: Set defaults to empty strings (`''`) when `user` is null, and force explicit owner contact entry.

2. **Add Safari Drag-and-Drop Event Prevention**:
   - *Target*: `src/components/PostPropertyScreen.tsx` (dropzone container)
   - *Issue*: Dropping files navigates away from the page in Safari.
   - *Recommendation*: Add `onDragOver={(e) => e.preventDefault()}` and `onDrop={handleDropFiles}` to prevent tab navigation and process dropped image files.

3. **Harmonize Authentication Gating on Seller Entry**:
   - *Target*: `src/App.tsx` (lines 400–403 & 588–596)
   - *Issue*: Clicking the navbar CTA blocks with login, while visiting `/sell-property-in-agra` allows direct access.
   - *Recommendation*: Either allow all sellers to start the form immediately and prompt account creation during Step 4 submission (industry best practice to minimize drop-off), OR consistently gate all routes.

4. **Associate Unauthenticated Listings with Subsequent Account Sign-Up**:
   - *Target*: `src/components/PostPropertyScreen.tsx` and `src/App.tsx`
   - *Issue*: Logged-out submissions store `ownerId: 'RAE-OWNER-01'`, so subsequent account registration fails to display the property in the user's dashboard.
   - *Recommendation*: If the seller creates an account on or after submission, link the generated property reference ID to their new account profile by matching email or mobile number.

---

### Priority 2: High Improvements (UX Validation & Post-Submission)

5. **Enforce Step-Level Validation Before Advancing Steps**:
   - *Target*: `src/components/PostPropertyScreen.tsx`
   - *Issue*: Sellers can skip Step 1 required fields (Title, Address) and only get blocked on Step 4.
   - *Recommendation*: Implement an explicit `validateStep(stepNumber)` check before advancing `step`. Highlight invalid fields with red borders and scroll to the first error.

6. **Add Direct WhatsApp Concierge CTA on Submission Confirmation**:
   - *Target*: `src/components/PostPropertyScreen.tsx` (lines 480–500)
   - *Recommendation*: Add a primary WhatsApp button:
     ```tsx
     <a
       href={`https://wa.me/919149079913?text=${encodeURIComponent(`Hi Royal Agra Estate, I just submitted my property listing #${createdPropertyRef} in ${locality} for verification.`)}`}
       target="_blank"
       rel="noopener noreferrer"
       className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2"
     >
       Connect with Concierge on WhatsApp
     </a>
     ```

7. **State Clear Verification SLA (24–48 Hours)**:
   - *Target*: `src/components/PostPropertyScreen.tsx`
   - *Recommendation*: Replace `"shortly"` with `"within 24–48 hours"` and list the next steps (e.g. document check, private site photography call).

---

### Priority 3: Medium Improvements (Brand Trust & Market Authority)

8. **Add Dedicated Seller Section on Homepage**:
   - *Target*: `src/components/HeroSection.tsx` or new `SellerHeroSection`
   - *Recommendation*: Add a dedicated section: `"Sell or Lease Your Luxury Estate in Agra With Complete Confidentiality"`, featuring a secondary CTA `"List Your Property"` and `"Request Private Valuation"`.

9. **Publish Transparent Brokerage / Commission Terms**:
   - *Target*: `src/components/PostPropertyScreen.tsx` (Step 4) and `AboutScreen.tsx`
   - *Recommendation*: Add an advisory disclosure panel detailing the advisory model (e.g. `"Transparent 1% Secondary Advisory Fee | 0% Direct Developer Fees"`).

10. **Introduce Seller Valuation Estimator / Benchmark Guide**:
    - *Target*: New modal or seller tool tab
    - *Recommendation*: Provide an Agra rate index (e.g. Fatehabad Road ₹6,500–₹11,000/sq.ft, Dayalbagh ₹5,000–₹8,500/sq.ft) or a one-click `"Request Free Valuation Report"` form.

11. **Prevent Mobile Safari Auto-Zoom (`fontSize >= 16px`)**:
    - *Target*: `src/components/PostPropertyScreen.tsx`
    - *Recommendation*: Apply `text-base sm:text-sm` (16px on mobile, 14px on desktop) to all `<input>`, `<select>`, and `<textarea>` elements to eliminate iOS Safari viewport auto-zoom.

---

## 4. Conclusion
The seller listing architecture on `https://royalagraestate.in` possesses strong fundamentals: high aesthetic alignment with luxury real estate, comprehensive specs for Agra's market, and strict location privacy masking. Resolving the identified authentication discrepancies, pre-fill defects, drag-and-drop file traps, and post-submission concierge links will transform the portal into a frictionless, premier experience for Agra's luxury homeowners and developers.
