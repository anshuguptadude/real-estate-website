---
trigger: always_on
---

# Royal Agra Estate Architecture & Compliance Rules

## 1. Native Hostinger Engine & Direct Persistence
* Always write listings directly to the native Hostinger persistence API (`https://royalagraestate.in/api/properties.php`).
* Never rely on silent `localStorage`-only fallbacks for property submissions or lead capture.
* Ensure payload safety by compressing images before document write (< 500 KB payload) to prevent network timeout issues.

## 2. Admin Auto-Approval & Verification
* Recognized Admins: `shrey123@gmail.com`, `abhi9557138449@gmail.com`, and `@royalagraestate.in`.
* Properties posted by verified admins must automatically receive:
  - `status: 'Active'`
  - `isApproved: true`
  - `verificationStatus: 'Verified'`
* Regular user listings receive `status: 'pending_verification'` and require admin review in the dashboard.

## 3. Location Privacy & Masking
* Public catalogues (`PropertiesScreen`, `HeroSection`, `FeaturedProperties`, and public card previews) must sanitize property objects using `getMaskedProperty(property, user)`.
* Only authenticated admins have access to exact house/plot addresses and GPS map coordinates.

## 4. Lead Submission & WhatsApp Integration
* Inquiries must push a structured `LeadSubmission` record to the Hostinger persistence API (`https://royalagraestate.in/api/leads.php`).
* Direct inquiry buttons must trigger WhatsApp concierge links (`https://wa.me/919149079913?text=...`) with URL-encoded property title and reference ID.

## 5. Zero-Error Verification & Automated Push Protocol
* Whenever any code changes are requested or implemented:
  1. Run `npx tsc --noEmit` and ensure 0 TypeScript or syntax errors.
  2. Run `npm run build` and ensure production bundle compiles cleanly.
  3. Ensure all property, lead, account, and project changes write directly to the Hostinger API.
  4. Commit changes with a descriptive message and push directly to `origin/main`.
  5. Keep local Mac files in 100% clean synchronization with GitHub and Hostinger.

## 6. Paid Advertising & Meta Campaign Invariants
* **Draft-Only Protection**: All ad campaigns, ad sets, and creatives in Meta Ads Manager or Google Ads must remain strictly in `DRAFT` status until explicit user authorization to publish. Never trigger Publish, Boost, or Payment methods automatically.
* **Conversion Architecture**:
  - Priority 1: Direct Click-to-WhatsApp when WhatsApp Business is connected to the Facebook Page.
  - Priority 2 (Fallback): Higher-Intent Instant Lead Form with custom qualification dropdowns (Corridor & Budget) routing to WhatsApp Concierge (`+91 91490 79913` / `https://wa.me/919149079913`) on completion.
  - Avoid routing cold low-budget ad traffic to website landing pages unless Meta Pixel / Conversions API is verified active.
* **Placement & Audience Hygiene**:
  - Exclude Audience Network (`apps_and_sites`) to prevent junk mobile game clicks.
  - Explicitly disable automatic location expansion (`geo: 0`) to enforce strict residency in targeted Agra corridors.
* **Brand & Creative Compliance**: Ad copies and creatives must cite `royalagraestate.in`, 30-year legal due diligence, and ADA approval to reinforce trust.

