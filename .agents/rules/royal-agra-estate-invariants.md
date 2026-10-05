---
trigger: always_on
---

# Royal Agra Estate Architecture & Compliance Rules

## 1. Cloud Firestore Persistence & Direct Submission
* Always write listings directly to the Cloud Firestore `properties` collection (`setDoc`/`addDoc`).
* Never rely on silent `localStorage`-only fallbacks for property submissions or lead capture.
* Ensure payload safety by compressing images before document write (< 500 KB payload) to prevent Firestore quota rejects.

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
* Inquiries must push a structured `LeadSubmission` record to the Firestore `leads` collection.
* Direct inquiry buttons must trigger WhatsApp concierge links (`https://wa.me/919149079913?text=...`) with URL-encoded property title and reference ID.
