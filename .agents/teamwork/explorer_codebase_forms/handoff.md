# Investigation & Audit Report: Codebase Property Submission Forms & Verification Architecture

**Agent**: `explorer_codebase_forms` (Teamwork Explorer)  
**Date**: November 2026  
**Target Repository**: Royal Agra Estate (`https://royalagraestate.in`)  
**Workspace Path**: `/Users/shrey/.gemini/antigravity/worktrees/Final website /property_address_privacy_settings/`

---

## 1. Observation

### 1.1 Property Listing Forms in Codebase
Grep search across `src/` for file inputs (`type="file"`), modals, and property posting forms identified three components:
1. `src/components/PostPropertyScreen.tsx` — The primary full-page multi-step property submission form (Steps 1–4).
2. `src/components/EditPropertyModal.tsx` — The modal used to edit existing properties.
3. `src/components/UserDashboardScreen.tsx` — User and admin dashboard for listing approvals and profile editing.

### 1.2 Document Upload Investigation: Mandatory, Optional, or Absent?
- **Finding**: Property legal/ownership document file upload fields (e.g., PDF, sale deed, khatauni, registry papers) are **completely ABSENT** from all property submission forms.
- **File Input Audit**:
  - `src/components/PostPropertyScreen.tsx` (Lines 1083–1090):
    ```tsx
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept="image/*"
      onChange={handleFileUpload}
      className="hidden"
    />
    ```
    *Observation*: Accepts only image files (`accept="image/*"`). Used solely for property photos (up to 10 photos) with canvas compression to JPEG.
  - `src/components/EditPropertyModal.tsx` (Lines 1058–1065):
    ```tsx
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept="image/*"
      className="hidden"
      onChange={handleAddPictures}
    />
    ```
    *Observation*: Accepts only image files (`accept="image/*"`).
  - `src/components/UserDashboardScreen.tsx` (Lines 1333–1339):
    ```tsx
    <input
      type="file"
      ref={profilePhotoInputRef}
      accept="image/*"
      onChange={handleProfilePhotoFile}
      className="hidden"
    />
    ```
    *Observation*: Avatar photo upload only.
  - **Zero Document Inputs**: There are no `<input type="file">` elements that accept `.pdf`, `.doc`, or general document files anywhere in `src/`.

### 1.3 Step 4 Legal Verification in `PostPropertyScreen.tsx`
Step 4 ("Legal Verification & Owner Contact", lines 1201–1418) contains:
1. **Verification Status Toggle** (`isVerified`, lines 1219–1276):
   - `yes`: "Verified & Approved" (ADA, UP RERA, Nagar Nigam, or Bank Title)
   - `in_process`: "In Process / Applied"
   - `no`: "Not ADA / Independent" (Private registry / self-declared freehold title)
2. **Authority Selection Dropdown** (`verifiedByAuthority`, lines 1286–1301):
   - Options: 'Agra Development Authority (ADA)', 'UP RERA (Real Estate Regulatory Authority)', 'Tehsil Registry / Sub-Registrar Agra', 'Nagar Nigam Agra (Municipal Corporation)', 'Royal Agra Legal Advisory Cell', 'Agra Cantonment Board', 'Nationalized / Private Bank (Home Loan Approved)', 'Other Authority (Specify)'.
3. **Reference Number Input** (`verificationDocNumber`, lines 1320–1330):
   ```tsx
   <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
     Approval / RERA / Khasra Reference No. (Optional)
   </label>
   <input
     type="text"
     placeholder="e.g. ADA/2024/782 or UPRERAAGT2024"
     value={verificationDocNumber}
     onChange={(e) => setVerificationDocNumber(e.target.value)}
     className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 font-mono focus:border-[#0F382C]"
   />
   ```
   *Observation*: This text field is explicitly labeled `(Optional)`. It is NOT mandatory and does NOT require document attachments.
4. **Owner/Trustee Contact** (lines 1342–1386):
   - Full Name, Mobile Number, Email Address.

### 1.4 Property Upload Form Fields & Validation Breakdown
- **Step 1 (Basic Info & Location)**:
  - `listingIntent`: 'Sale' | 'Rent' (default: 'Sale')
  - `propertyType`: Dropdown selection ('Luxury Villa', 'Apartment / Flat', 'Residential Plot / Land', etc.) + conditional custom text input `customPropertyType` (required if "Other")
  - `locality`: Dropdown selection (Agra localities) + conditional custom text input `customLocality` (required if "Other")
  - `projectTitle`: Building / House / Project Name (required string)
  - `address`: Full Exact Street Address (required textarea, confidential for Admin/CEO only)
  - `mapUrl`: Google Maps Share Link (optional URL input, confidential for Admin/CEO only)
- **Step 2 (Specifications & Pricing)**:
  - `superArea`: Number input (required)
  - `areaUnit`: 'Sq.Ft' | 'Sq.Yards' (toggle with automatic conversion calculation)
  - `bedrooms`, `bathrooms`, `furnishing`: Conditionally displayed; automatically omitted for plots/land via `isPlotOrLand()`
  - `facing`: Orientation selection (Vastu, Taj View, Park Facing, etc.)
  - `possession`: Construction/Possession Status dropdown
  - `askingPrice`: Number input (required)
- **Step 3 (Amenities, Landmarks & Photos)**:
  - `selectedAmenities`: Multi-select amenity buttons
  - `landmarks`: Nearby Landmarks with Agra presets (Taj Mahal, Agra Metro, Agra-Lucknow Expressway) and custom inputs
  - `images`: Photo upload (up to 10 photos, canvas compressed, display cover selector with ⭐ badge). If 0 photos are uploaded, defaults to a high-resolution placeholder image (`PostPropertyScreen.tsx:325–326`).
- **Step 4 (Legal Verification & Contact)**:
  - Authority verification toggle + authority dropdown
  - Optional text reference number (`verificationDocNumber`)
  - Owner Name, Mobile Number, Email Address

### 1.5 Address Masking (`getMaskedProperty`) Architecture
Direct code observation from `src/utils/security.ts` (lines 258–304):
```typescript
export const getMaskedProperty = (property: Property, user: UserProfile | null): Property => {
  if (canViewFullAddress(property, user)) {
    return property;
  }

  const primaryLocality = formatAgraLocality(property.primaryAgraLocality || property.locality || property.location);
  const baseLocality = primaryLocality.replace(', Agra', '').trim();

  // For non-admin (public / buyer / guest view), mask all confidential location & contact details
  const masked: Property = {
    ...property,
    location: primaryLocality,
    locality: baseLocality,
    primaryAgraLocality: primaryLocality,
    address: primaryLocality,
    fullAddress: undefined,
    buildingName: undefined,
    plotNumber: undefined,
    landmarks: property.landmarks || [],
    ownerContact: undefined,
    locationLink: undefined,
    mapUrl: undefined,
    googleMapsPinUrl: undefined,
    privateLocationNote: undefined,
    coordinates: { lat: 27.1767, lng: 78.0081 },
    agent: {
      name: 'Royal Agra Estate Concierge',
      role: 'Senior Advisory Desk',
      phone: '+91 91490 79913',
      email: 'contact@royalagraestate.in',
      avatar: property.agent?.avatar || '/team/shrey-gupta.jpg',
      experience: 'Verified Luxury Advisory'
    }
  };

  // Clean payload
  delete (masked as any).fullAddress;
  delete (masked as any).buildingName;
  delete (masked as any).plotNumber;
  delete (masked as any).ownerContact;
  delete (masked as any).locationLink;
  delete (masked as any).mapUrl;
  delete (masked as any).googleMapsPinUrl;
  delete (masked as any).privateLocationNote;

  return masked;
};
```
- In `src/utils/security.ts:117–122`, `canViewFullAddress(property, user)` returns `true` **only if** `isCEO(user)`.
- In `src/App.tsx:764–773`, `displayedProperties` is sanitized before passing to public UI:
  ```typescript
  const displayedProperties = properties
    .filter(p => {
      if (p.isDeleted || p.status === 'deleted' || p.status === 'rejected') return false;
      if (isAdmin(user)) return true;
      if (p.status === 'Pending Approval' || p.status === 'pending_verification' || p.isApproved === false) {
        return false;
      }
      return (p.status === 'Active' || p.status === 'published' || p.status === 'Sold' || p.status === 'Rented');
    })
    .map(p => getMaskedProperty(p, user));
  ```
- Public consumers receiving masked properties:
  - `HeroSection` / `FeaturedProperties` (`src/App.tsx:820`)
  - `PropertiesScreen` (`src/App.tsx:843`)
  - `PropertyDetailModal` (`src/App.tsx:963`)
  - `CompareModal` (`src/App.tsx:1008`)
  - `LeadInquiryModal` (`src/App.tsx:1020`)

### 1.6 Cloud Firestore Persistence & Submission Flow
- `src/services/firebaseService.ts` provides persistence with fallback and sync:
  - `saveFirestoreProperty(property: Property)`: Saves immediately to `localStorage` (`royal_agra_properties_v2`), dispatches `royal_agra_properties_updated`, and sends `POST` request to `/properties.php`.
  - Image payloads are strictly compressed client-side via HTML5 canvas down to < 70 KB per photo before document write, ensuring total document payload is well under 500 KB to comply with Firestore quota safety.
  - Auto-approval rule (`src/components/PostPropertyScreen.tsx:373–377`):
    - Admin submissions automatically receive `status: 'Active'`, `isApproved: true`, and `verificationStatus: 'Verified'`.
    - Non-admin (dealer/owner) submissions receive `status: 'Pending Approval'`, `isApproved: false`, and `verificationStatus: 'In Process'`, requiring admin moderation before going live.
  - `saveFirestoreLead(lead: LeadSubmission)`: Validates phone/name via `isValidClientLead`, dispatches Google Ads conversion event `trackLeadSubmission`, caches to `royal_agra_leads_v1`, posts to `/leads.php`, and triggers WhatsApp concierge link (`https://wa.me/919149079913?text=...`).

### 1.7 TypeScript Compilation & Build Status
- `npx tsc --noEmit`: Executed cleanly with **0 errors**.
- `npm run build`: Executed cleanly with **0 errors** (built production bundle in 1.77s).

---

## 2. Logic Chain

1. **Premise**: Partner brokers and local property dealers are reluctant to submit properties to platforms if they are forced to upload legal papers (sale deeds, khatauni, registry copies) upfront, fearing that the platform will contact property owners directly and bypass them.
2. **Analysis of Codebase**:
   - Examination of `src/components/PostPropertyScreen.tsx` shows that Step 4 only asks for a regulatory authority name and an optional text reference number (`verificationDocNumber`), which is explicitly labeled `(Optional)` (line 1321).
   - There are zero document file inputs or validators demanding deed scans, PDFs, or title documents anywhere in the codebase.
   - Property uploads only request property specifications (area, price, BHK, facing, furnishing), photo uploads (up to 10 photos), and contact info (name, mobile, email).
3. **Address Privacy Linkage**:
   - Programmatic address masking via `getMaskedProperty` ensures that unmasked street addresses, plot numbers, owner contacts, and Google Maps pin URLs are stripped for all non-CEO users and public catalog views.
   - This architectural safeguard already protects brokers and sellers from being bypassed by public visitors.
4. **Alignment with Follow-up Requirements**:
   - In `ORIGINAL_REQUEST.md` Follow-up §R4, the requested verification workflow is:
     *Do not ask partner brokers/dealers for property documents at the time of listing.* Instead, when a buyer is interested and willing to buy, collect an approximate ₹10,000 advance from the buyer first, then request and verify the property documents from the broker. If documents are flawed, refund the full ₹10,000 immediately.
   - Because the codebase listing form **already does not ask** for document uploads, no destructive code removals are necessary.
   - However, adding a clear explanatory banner in Step 4 of `PostPropertyScreen.tsx` and updating `docs/marketing_strategy.md` to detail this ₹10,000 refundable advance workflow will give dealers complete assurance and eliminate any friction or fear of bypass.

---

## 3. Caveats

1. **Document Upload Fields**: While document uploads do not exist in the code, the term "Step 4: Legal Verification & Owner Contact" could potentially cause dealers skimming the form to assume verification documents are required. Adding an explicit note for partner dealers/brokers in Step 4 is recommended to prevent any misunderstanding.
2. **Persistence Backend**: The project uses a hybrid persistence layer where `services/firebaseService.ts` maintains Firestore document signatures, `localStorage` caching, and synchronizes with Hostinger API endpoints (`/properties.php`, `/leads.php`, `/accounts.php`). Both local and remote layers adhere to invariant compliance rules.
3. **Strategy Document Scope**: The strategy document `docs/marketing_strategy.md` currently contains legacy mentions of "Buyer-Only Brokerage" and needs to be updated by the document writer agent to remove commission/brokerage language and introduce the ₹10,000 advance verification workflow.

---

## 4. Conclusion

1. **Upfront Document Requirement**: **NO form in the codebase requires or forces upfront property document uploads.** Partner brokers, dealers, and sellers can post listings immediately using only property details, pricing, photos, and contact info.
2. **Document Fields Status**: Legal document file upload fields are **completely absent**. The only verification reference field is an optional text input (`verificationDocNumber`).
3. **Address Masking**: प्रोग्रामिक `getMaskedProperty` is active, robust, and consistently masks all exact addresses, plot numbers, owner contacts, and GPS links across all public views, protecting listing brokers from deal bypass.
4. **Codebase Health**:
   - `npx tsc --noEmit`: **0 errors**.
   - `npm run build`: **0 errors** (built in 1.77s).
5. **Recommended Code Enhancement**:
   To actively reassure partner brokers directly inside `src/components/PostPropertyScreen.tsx`, insert a partner broker callout banner in Step 4:
   ```tsx
   {/* Partner Dealer & Broker Friendly Notice */}
   <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
     <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
     <div>
       <span className="font-bold text-blue-950 block">Partner Dealers & Property Consultants:</span>
       <p className="text-[11px] text-blue-800 leading-relaxed mt-0.5">
         No upfront property ownership documents or deed papers are required to list. Verification documents are requested only after a genuine buyer submits a ₹10,000 refundable advance. Your listing address is 100% masked to protect your client relationship.
       </p>
     </div>
   </div>
   ```

---

## 5. Verification Method

To independently verify these findings, run the following commands in the workspace root:

1. **Verify Absence of Document File Inputs**:
   ```bash
   grep -rn 'type="file"' src/
   ```
   *Expected Output*: Only 3 occurrences (lines in `PostPropertyScreen.tsx`, `EditPropertyModal.tsx`, and `UserDashboardScreen.tsx`), all with `accept="image/*"`.

2. **Verify Optional Status of Verification Document Number in Listing Form**:
   ```bash
   grep -rn -C 3 'verificationDocNumber' src/components/PostPropertyScreen.tsx
   ```
   *Expected Output*: Displays line 1321 with `Approval / RERA / Khasra Reference No. (Optional)`.

3. **Verify Address Masking Implementation**:
   ```bash
   grep -rn 'getMaskedProperty' src/
   ```
   *Expected Output*: Defined in `src/utils/security.ts:258` and enforced in `src/App.tsx:773`.

4. **Run TypeScript Compilation Check**:
   ```bash
   npx tsc --noEmit
   ```
   *Expected Output*: Exit code 0, 0 errors.

5. **Run Production Build**:
   ```bash
   npm run build
   ```
   *Expected Output*: Exit code 0, Vite builds `dist/` cleanly in under 3 seconds.
