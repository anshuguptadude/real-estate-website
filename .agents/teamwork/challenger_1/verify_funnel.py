"""
Empirical traffic routing and conversion funnel stress-test script.
Challenger 1: Empirical Budget, Unit Economics & Traffic Challenger
"""

def simulate_routing_funnel():
    print("=" * 70)
    print("EMPIRICAL TRAFFIC ROUTING & FUNNEL SIMULATION (TIER-2 AGRA ECOSYSTEM)")
    print("=" * 70)
    
    # Baseline traffic for a ₹500/day budget over 30 days = ₹15,000 spend
    # Budget plots: CPM = ₹150, Impressions = 100,000
    # CTR = 3.0% -> Link Clicks = 3,000 clicks
    total_clicks = 3000
    
    print(f"\nScenario: 3,000 Ad Clicks on Budget Plots (< ₹45 Lakhs)")
    print("-" * 50)
    
    # Path A: 100% Direct-to-WhatsApp (CTWA)
    # 1. Click to App Open: Native deep-link intent -> 85% reach WhatsApp (15% drop-off)
    ctwa_opens = total_clicks * 0.85
    # 2. Open to First Message Sent: Pre-filled text -> 45% send the pre-filled message
    ctwa_messages = ctwa_opens * 0.45
    # 3. Message to Qualification (Interactive 3-button bot triage): 60% complete triage
    ctwa_qualified = ctwa_messages * 0.60
    # 4. Qualified to Site Visit: 22% book & attend site visit
    ctwa_site_visits = ctwa_qualified * 0.22
    
    print(f"PATH A: DIRECT-TO-WHATSAPP (CTWA)")
    print(f"  Ad Clicks:               {total_clicks:,}")
    print(f"  WhatsApp App Opens:      {ctwa_opens:,.0f} (15% latency drop-off)")
    print(f"  First Message Sent:      {ctwa_messages:,.0f} (45% send pre-filled text)")
    print(f"  Triage Completed:        {ctwa_qualified:,.0f} (60% finish 3-step bot)")
    print(f"  Physical Site Visits:    {ctwa_site_visits:,.1f} (22% conversion)")
    print(f"  Cost Per Raw Inquiry:    ₹{15000 / ctwa_messages:.2f}")
    print(f"  Cost Per Qualified Lead: ₹{15000 / ctwa_qualified:.2f}")
    print(f"  Cost Per Site Visit:     ₹{15000 / ctwa_site_visits:.2f}")
    
    # Path B: 100% Website Landing Page (React/Firestore)
    # 1. Click to Page Interactive: Tier-2 mobile 4G latency (3.5s) -> 45% bounce before load (55% load)
    web_visitors = total_clicks * 0.55
    # 2. Form Completion: Form fields (Name, Phone, Email, Slot) -> 8% submit form
    web_form_leads = web_visitors * 0.08
    # 3. Connection Rate on Phone Follow-up: Truecaller spam flag / unanswered calls -> 40% answered
    web_contacted = web_form_leads * 0.40
    # 4. Contacted to Qualification: 75% of contacted are qualified
    web_qualified = web_contacted * 0.75
    # 5. Qualified to Site Visit: 25% book & attend site visit
    web_site_visits = web_qualified * 0.25
    
    print(f"\nPATH B: 100% WEBSITE LANDING PAGE (NO WHATSAPP ROUTING)")
    print(f"  Ad Clicks:               {total_clicks:,}")
    print(f"  Page Interactive Users:  {web_visitors:,.0f} (45% latency bounce)")
    print(f"  Form Submissions:        {web_form_leads:,.0f} (8% form conversion)")
    print(f"  Phone Call Connected:    {web_contacted:,.0f} (60% blocked by Truecaller/unanswered)")
    print(f"  Qualified Buyers:        {web_qualified:,.0f} (75% qualification)")
    print(f"  Physical Site Visits:    {web_site_visits:,.1f} (25% conversion)")
    print(f"  Cost Per Form Lead:      ₹{15000 / web_form_leads:.2f}")
    print(f"  Cost Per Qualified Lead: ₹{15000 / web_qualified:.2f}")
    print(f"  Cost Per Site Visit:     ₹{15000 / web_site_visits:.2f}")
    
    efficiency_gain = ctwa_site_visits / web_site_visits
    print(f"\n>>> RESULT FOR BUDGET SEGMENT: WhatsApp yields {efficiency_gain:.2f}x MORE site visits at {1/efficiency_gain:.2f}x the cost per visit compared to Pure Website!")

    # Now let's test Luxury Segment (> ₹1.5 Crores)
    print("\n" + "=" * 70)
    print("SCENARIO 2: LUXURY & HERITAGE SEGMENT (> ₹1.5 CRORES)")
    print("=" * 70)
    # 1,000 Clicks on Luxury Villas
    lux_clicks = 1000
    lux_spend = 35000 # @ ₹35 CPC
    
    # Path A for Luxury: Direct-to-WhatsApp
    # HNIs seeing cold WhatsApp chat without brochure/aesthetic context
    # High drop-off due to perceived unverified broker spam
    lux_wa_opens = lux_clicks * 0.85
    lux_wa_msgs = lux_wa_opens * 0.20 # Only 20% message cold without specs
    lux_wa_qual = lux_wa_msgs * 0.35 # High proportion of curiosity/casual seekers
    lux_wa_visits = lux_wa_qual * 0.25
    
    # Path B for Luxury: Immersive Website Showcase + VIP Concierge Trigger
    # Serious HNIs browse specs, Italian marble, ADA approvals
    lux_web_visitors = lux_clicks * 0.70 # HNIs use iPhone/5G, lower latency bounce (30%)
    lux_web_engagers = lux_web_visitors * 0.25 # Read specs for > 60s
    lux_web_leads = lux_web_engagers * 0.20 # High-intent lead modal + auto WhatsApp handshake
    lux_web_qual = lux_web_leads * 0.85 # High qualification rate
    lux_web_visits = lux_web_qual * 0.40 # High site tour conversion
    
    print(f"LUXURY PATH A: Direct WhatsApp (Unqualified)")
    print(f"  Clicks: {lux_clicks:,} -> Messages: {lux_wa_msgs:,.0f} -> Qualified: {lux_wa_qual:,.1f} -> Site Visits: {lux_wa_visits:,.1f}")
    print(f"  Cost Per Qualified Lead: ₹{lux_spend / lux_wa_qual:.2f}")
    
    print(f"\nLUXURY PATH B: Immersive Website Showcase + VIP Concierge Handshake")
    print(f"  Clicks: {lux_clicks:,} -> Engaged Browsers: {lux_web_engagers:,.0f} -> Leads: {lux_web_leads:,.1f} -> Qualified: {lux_web_qual:,.1f} -> Site Visits: {lux_web_visits:,.1f}")
    print(f"  Cost Per Qualified Lead: ₹{lux_spend / lux_web_qual:.2f}")
    
    lux_gain = lux_web_visits / lux_wa_visits
    print(f"\n>>> RESULT FOR LUXURY SEGMENT: Website Showcase yields {lux_gain:.2f}x MORE HNI site visits with superior qualification!")

if __name__ == "__main__":
    simulate_routing_funnel()
