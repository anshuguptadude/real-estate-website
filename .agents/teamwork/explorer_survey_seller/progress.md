# Progress — Seller Journey Explorer

Last visited: 2026-10-30T02:15:20Z

## Status
- [x] Initialized DISPATCH.md and BRIEFING.md
- [x] Inspected codebase components (`PostPropertyScreen.tsx`, `Navbar.tsx`, `HeroSection.tsx`, `WhyRoyalAgra.tsx`, `Footer.tsx`, `firebaseService.ts`, `App.tsx`)
- [x] Tested live website https://royalagraestate.in via Safari automation on macOS:
  - [x] Seller entry points and navigation ("POST PROPERTY", "Sell/Rent", footer links, missing homepage seller section)
  - [x] Authentication intercept on navbar click vs direct bypass via `/sell-property-in-agra`
  - [x] Pre-fill bug: Logged-out form pre-fills company phone (`+91 91490 79913`) and email (`shrey@royalagraestate.in`)
  - [x] Multi-step listing workflow (Steps 1 to 4):
    - [x] Step 1: Property types, custom type/locality dynamic inputs, address privacy communication, Google Maps pin input
    - [x] Step 1-3 validation bypass: missing required fields on steps 1-3 do not block step progression
    - [x] Step 2: Sq.Ft vs Sq.Yards conversion, BHK & furnishing vs Plot omission, live price formatting in Cr/Lacs
    - [x] Step 3: Amenities checkboxes, 10 landmark presets, custom landmark addition, photo dropzone
    - [x] Step 3 image upload quirks: Missing native drag-and-drop preventDefault handlers in Safari; canvas compression limits (< 500 KB)
    - [x] Step 4: Legal verification status toggles, authority selection, owner contact fields
    - [x] Step 4 validation blocking: Missing required owner name silently blocks submission without custom error message
  - [x] Submission & Post-Submission Experience:
    - [x] Success screen confirmation modal with reference ID `#RAE-XXXXXX`
    - [x] Pending Approval vs Active status based on admin role
    - [x] Lack of explicit SLA turnaround time (e.g. 24-48 hours)
    - [x] Missing direct WhatsApp concierge connection button on post-submit confirmation screen
    - [x] Post-submit "View in My Dashboard" prompts login, but newly registered account cannot see listing if submitted logged-out
  - [x] Seller Value Proposition & Brand Trust:
    - [x] Agra luxury market positioning and discretion
    - [x] Missing brokerage/commission transparency
    - [x] Missing property valuation tool / pricing index for sellers
    - [x] Verified buyer network claims lack proof points
  - [x] Safari / WebKit layout & responsive quirks:
    - [x] Input font sizes (12px / 14px) triggering mobile Safari auto-zoom
- [ ] Synthesize findings into comprehensive `report.md`
- [ ] Write 5-component `handoff.md` and send completion message to parent
