## 2026-11-03T20:47:30Z
You are a Worker agent (teamwork_worker).
Your working directory is: /Users/shrey/.gemini/antigravity/worktrees/Final website /property_address_privacy_settings/.agents/teamwork/worker_marketing_update/
Original request file: /Users/shrey/.gemini/antigravity/worktrees/Final website /property_address_privacy_settings/.agents/teamwork/ORIGINAL_REQUEST.md
Scope document: /Users/shrey/.gemini/antigravity/worktrees/Final website /property_address_privacy_settings/.agents/teamwork/orchestrator_2/PROJECT.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

You must read and synthesize the findings from all three explorer reports before modifying any files:
1. `/Users/shrey/.gemini/antigravity/worktrees/Final website /property_address_privacy_settings/.agents/teamwork/explorer_marketing_strategy/handoff.md`
2. `/Users/shrey/.gemini/antigravity/worktrees/Final website /property_address_privacy_settings/.agents/teamwork/explorer_verification_advance/handoff.md`
3. `/Users/shrey/.gemini/antigravity/worktrees/Final website /property_address_privacy_settings/.agents/teamwork/explorer_codebase_forms/handoff.md`

Your Tasks:
1. **Update `docs/marketing_strategy.md`**:
   - **Remove ALL Brokerage and Commission Sections**:
     * Completely remove the legacy Section 5 ("Buyer-Only Brokerage Business Model Strategy & Anti-Circumvention", lines 815–1004).
     * Remove all references to buyer-only brokerage fees (1.0%–1.5%), 0% seller commission vs buyer commission, arbitration clauses under the Arbitration and Conciliation Act 1996 to legally enforce commissions, pre-inspection mandates/agreements for commission protection, and commission-based unit economics (e.g., Section 4.7.2).
     * Clean up Header subtitle, Table of Contents, Executive Summary (Pillar 4), Section R1/R3 copy references, and concluding remarks as cataloged in `explorer_marketing_strategy/handoff.md`.
   - **Update Requirement R1 (Meta Ads Campaign Setup & Social Profile Posting Policy)**:
     * Step-by-step Meta Ads setup guide for maximum ₹10,000–₹15,000/month (₹350–₹500/day) using ABO (Ad Set Budget Optimization).
     * Demographic reach in Agra: younger buyers and investors on Instagram vs. families, mature decision-makers, and NRIs on Facebook.
     * Placement mix: Feed 30%, Stories 10%, Reels 45%, Marketplace 15% (strictly excluding Meta Audience Network).
     * Clearly and definitively explain the Social Profile Posting Policy: explain that there is NO need for continuous organic posting or daily uploading on the public Instagram and Facebook accounts of the website. Explain the "6-Post Digital Billboard" profile hygiene concept (pinned brand trust assets) vs. dark ad creatives that drive traffic directly to WhatsApp/Website without cluttering public feeds.
   - **Update Requirement R2 (Ad Destination Analysis & Lead Tracking System)**:
     * In-depth comparative evaluation between WhatsApp Concierge (+91 91490 79913) and Website (`royalagraestate.in`).
     * Dynamic 3-tier hybrid routing decision framework based on ticket size and user intent.
     * Comprehensive, step-by-step, zero-cost lead tracking system using WhatsApp Business (color-coded labels, quick replies, catalogs, broadcast lists) and a 16-column Google Sheets Master Lead Tracker with stage transitions and response SLAs.
   - **Update Requirement R3 (Inclusive Multi-Tier Audience Strategy)**:
     * Audience targeting, creative hooks, and positioning angles covering:
       a) Budget segment (< ₹45L: affordable plots, entry-level apartments, Rohta, Shamshabad Rd).
       b) Mid-tier residential (₹45L–₹1.5Cr: family homes, independent floors in Kamla Nagar, Sikandra, Shastripuram).
       c) Premium & heritage (> ₹1.5Cr: luxury villas, heritage kothis, Fatehabad Rd, Dayalbagh).
     * Calibrate budget allocation strictly to ₹10,000–₹15,000/month (Model A at ₹350/day and Model B at ₹500/day).
     * High-converting localized Hindi/Hinglish creative copy scripts for each tier.
   - **Author New Requirement R4 (Seller & Dealer Quality Control & ₹10,000 Buyer Advance Verification Workflow)**:
     * Address traditional Agra partner broker/dealer psychology: explain why we do NOT ask partner brokers/dealers for property documents upfront at listing time (they fear being bypassed and having the platform contact the seller directly).
     * Detail the exact 6-step verification workflow:
       1. Property listed with photos, specs, pricing, and masked location (no upfront legal documents).
       2. Buyer shows serious intent and is willing to buy.
       3. Platform collects an approximate ₹10,000 refundable advance from the buyer first.
       4. Upon receiving the ₹10,000 advance, platform requests property documents from the broker/dealer.
       5. 5-point legal and revenue verification audit (Registry chain, Bhulekh UP Khatauni, IGRSUP Barah Sala / Nil EC, ADA Master Plan 2031, site inspection).
       6. Dual-path resolution: If genuine and clear -> proceed to closing and advance is credited in full toward transaction settlement; If flawed, disputed, or unapproved -> return full ₹10,000 advance to the buyer immediately with zero deductions.
     * Incorporate mobile OTP/call intake verification and programmatic address privacy masking (`getMaskedProperty`) to eliminate fake/duplicate listings and prevent deal bypass.
   - **Update Roadmap & Invariant Alignment**:
     * Ensure seamless flow, professional markdown formatting, and strict alignment with repository invariants.

2. **Codebase Check & Enhancement in `src/components/PostPropertyScreen.tsx`**:
   - Inspect `src/components/PostPropertyScreen.tsx` Step 4 ("Legal Verification & Owner Contact").
   - Insert the friendly Partner Broker / Dealer reassurance banner (suggested in `explorer_codebase_forms/handoff.md`) reassuring brokers that no upfront documents are required to list, listings are protected by address masking, and verification documents are requested only after a genuine buyer deposits the ₹10,000 refundable advance.

3. **Verification**:
   - Run `npx tsc --noEmit` and confirm 0 TypeScript errors.
   - Run `npm run build` and confirm production build compiles cleanly with 0 errors.

Deliverable:
Write a comprehensive handoff report to:
`/Users/shrey/.gemini/antigravity/worktrees/Final website /property_address_privacy_settings/.agents/teamwork/worker_marketing_update/handoff.md`
detailing every file modified, diff summaries, verification commands and exit codes.
When complete, notify the orchestrator with send_message.
