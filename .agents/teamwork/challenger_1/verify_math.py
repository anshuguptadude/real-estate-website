"""
Empirical verification test suite for docs/marketing_strategy.md
Challenger 1: Empirical Budget, Unit Economics & Traffic Challenger
"""

import sys

def verify_kpi_math():
    print("=" * 60)
    print("1. EMPIRICAL VERIFICATION: KPI BENCHMARK MATRIX (SECTION 4.7.1)")
    print("=" * 60)
    
    # Tier 1: Plots
    # Expected CPM: 120 - 190
    # CTR: 2.2% - 3.8% (0.022 - 0.038)
    # CPC Formula: CPM / (1000 * CTR)
    # Lowest CPC = min_cpm / (1000 * max_ctr)
    # Highest CPC = max_cpm / (1000 * min_ctr)
    
    tiers = {
        "Tier 1: Plots": {
            "cpm": (120, 190),
            "ctr": (0.022, 0.038),
            "claimed_cpc": (4.50, 9.00),
            "cvr": (0.08, 0.14),
            "claimed_cpl": (60, 105),
            "qual_rate": (0.40, 0.50),
            "claimed_cpql": (130, 220),
            "site_visit_rate": 0.20,
            "claimed_site_visit_cost": (650, 1100),
        },
        "Tier 2: Mid-Tier Homes": {
            "cpm": (190, 310),
            "ctr": (0.016, 0.024),
            "claimed_cpc": (9.00, 18.00),
            "cvr": (0.06, 0.10),
            "claimed_cpl": (135, 220),
            "qual_rate": (0.55, 0.65),
            "claimed_cpql": (230, 380),
            "site_visit_rate": 0.25,
            "claimed_site_visit_cost": (920, 1520),
        },
        "Tier 3: Luxury Villas": {
            "cpm": (380, 650),
            "ctr": (0.009, 0.016),
            "claimed_cpc": (24.00, 48.00),
            "cvr": (0.04, 0.07),
            "claimed_cpl": (380, 650),
            "qual_rate": (0.65, 0.75),
            "claimed_cpql": (550, 950),
            "site_visit_rate": 0.30,
            "claimed_site_visit_cost": (1800, 3100),
        }
    }
    
    all_passed = True
    
    for name, data in tiers.items():
        print(f"\n--- Testing {name} ---")
        min_cpm, max_cpm = data["cpm"]
        min_ctr, max_ctr = data["ctr"]
        
        # Theoretical CPC range
        calc_min_cpc = min_cpm / (1000 * max_ctr)
        calc_max_cpc = max_cpm / (1000 * min_ctr)
        cl_min_cpc, cl_max_cpc = data["claimed_cpc"]
        
        print(f"Calculated CPC range: ₹{calc_min_cpc:.2f} - ₹{calc_max_cpc:.2f}")
        print(f"Claimed CPC range:    ₹{cl_min_cpc:.2f} - ₹{cl_max_cpc:.2f}")
        
        # Check CPC overlap
        cpc_valid = (calc_min_cpc <= cl_max_cpc) and (calc_max_cpc >= cl_min_cpc)
        print(f"CPC Range Overlap / Consistency: {'PASS' if cpc_valid else 'FAIL'}")
        if not cpc_valid: all_passed = False
        
        # CPL Calculation: CPC / CVR
        min_cvr, max_cvr = data["cvr"]
        calc_min_cpl = cl_min_cpc / max_cvr
        calc_max_cpl = cl_max_cpc / min_cvr
        cl_min_cpl, cl_max_cpl = data["claimed_cpl"]
        
        print(f"Calculated CPL from Claimed CPC & CVR: ₹{calc_min_cpl:.2f} - ₹{calc_max_cpl:.2f}")
        print(f"Claimed CPL range:                     ₹{cl_min_cpl:.2f} - ₹{cl_max_cpl:.2f}")
        cpl_valid = (calc_min_cpl <= cl_max_cpl) and (calc_max_cpl >= cl_min_cpl)
        print(f"CPL Range Overlap / Consistency: {'PASS' if cpl_valid else 'FAIL'}")
        if not cpl_valid: all_passed = False
        
        # CPQL Calculation: CPL / qual_rate
        min_q, max_q = data["qual_rate"]
        calc_min_cpql = cl_min_cpl / max_q
        calc_max_cpql = cl_max_cpl / min_q
        cl_min_cpql, cl_max_cpql = data["claimed_cpql"]
        
        print(f"Calculated CPQL from Claimed CPL & Qual%: ₹{calc_min_cpql:.2f} - ₹{calc_max_cpql:.2f}")
        print(f"Claimed CPQL range:                        ₹{cl_min_cpql:.2f} - ₹{cl_max_cpql:.2f}")
        cpql_valid = (calc_min_cpql <= cl_max_cpql) and (calc_max_cpql >= cl_min_cpql)
        print(f"CPQL Range Overlap / Consistency: {'PASS' if cpql_valid else 'FAIL'}")
        if not cpql_valid: all_passed = False
        
        # Site Visit Cost: CPQL / site_visit_rate
        svr = data["site_visit_rate"]
        calc_min_svc = cl_min_cpql / svr
        calc_max_svc = cl_max_cpql / svr
        cl_min_svc, cl_max_svc = data["claimed_site_visit_cost"]
        
        print(f"Calculated Site Visit Cost: ₹{calc_min_svc:.2f} - ₹{calc_max_svc:.2f}")
        print(f"Claimed Site Visit Cost:    ₹{cl_min_svc:.2f} - ₹{cl_max_svc:.2f}")
        svc_valid = (abs(calc_min_svc - cl_min_svc) < 50) and (abs(calc_max_svc - cl_max_svc) < 100)
        print(f"Site Visit Cost Consistency: {'PASS' if svc_valid else 'FAIL'}")
        if not svc_valid: all_passed = False

    return all_passed

def verify_google_vs_meta():
    print("\n" + "=" * 60)
    print("2. EMPIRICAL VERIFICATION: GOOGLE SEARCH VS META AUCTION (SECTION 2.1)")
    print("=" * 60)
    
    budget_daily = 600
    budget_weekly = budget_daily * 7
    
    # Google Search
    google_cpc_min, google_cpc_max = 55, 180
    google_clicks_day_min = budget_daily / google_cpc_max
    google_clicks_day_max = budget_daily / google_cpc_min
    google_clicks_wk_min = google_clicks_day_min * 7
    google_clicks_wk_max = google_clicks_day_max * 7
    
    google_cvr_min, google_cvr_max = 0.06, 0.10
    google_leads_wk_min = google_clicks_wk_min * google_cvr_min
    google_leads_wk_max = google_clicks_wk_max * google_cvr_max
    
    print(f"Google Daily Clicks: {google_clicks_day_min:.1f} to {google_clicks_day_max:.1f} (Claimed: ~4 to 9)")
    print(f"Google Weekly Clicks: {google_clicks_wk_min:.1f} to {google_clicks_wk_max:.1f} (Claimed: 28 to 63)")
    print(f"Google Weekly Leads: {google_leads_wk_min:.1f} to {google_leads_wk_max:.1f} (Claimed: 2 to 5)")
    
    # Meta
    meta_cpc_min, meta_cpc_max = 7, 14
    meta_clicks_day_min = budget_daily / meta_cpc_max
    meta_clicks_day_max = budget_daily / meta_cpc_min
    meta_clicks_wk_min = meta_clicks_day_min * 7
    meta_clicks_wk_max = meta_clicks_day_max * 7
    
    meta_cvr_min, meta_cvr_max = 0.08, 0.12
    meta_leads_wk_min = meta_clicks_wk_min * meta_cvr_min
    meta_leads_wk_max = meta_clicks_wk_max * meta_cvr_max
    
    print(f"Meta Daily Clicks: {meta_clicks_day_min:.1f} to {meta_clicks_day_max:.1f} (Claimed: ~45 to 85)")
    print(f"Meta Weekly Clicks: {meta_clicks_wk_min:.1f} to {meta_clicks_wk_max:.1f} (Claimed: 315 to 595)")
    print(f"Meta Weekly Leads: {meta_leads_wk_min:.1f} to {meta_leads_wk_max:.1f} (Claimed: 25 to 55)")

    # Learning phase verification
    print(f"Meta weekly leads ({meta_leads_wk_min:.0f}-{meta_leads_wk_max:.0f}) vs Meta Learning threshold (50 events/wk):")
    if meta_leads_wk_max >= 50:
        print("PASS: Meta can hit or approach 50 events/week at ₹600/day when consolidated.")
    else:
        print("WARNING: Borderline for Meta 50 events/week.")

def verify_model_a_and_b():
    print("\n" + "=" * 60)
    print("3. EMPIRICAL VERIFICATION: MODEL A & B BUDGET ALLOCATIONS (SECTION 4.5)")
    print("=" * 60)
    
    # Model A: Sequential ₹500/day
    print("--- Model A: ₹500/day (₹15,000/mo) Sequential ---")
    w12_spend = 500 * 14
    w12_leads_min = w12_spend / 95
    w12_leads_max = w12_spend / 60
    print(f"Weeks 1 & 2 (Budget Plots): ₹{w12_spend} spend -> {w12_leads_min:.1f} to {w12_leads_max:.1f} leads (Claimed: 70-110). Daily: {w12_leads_min/14:.1f}-{w12_leads_max/14:.1f} (Claimed: 5-8).")
    
    w3_spend = 500 * 7
    w3_leads_min = w3_spend / 190
    w3_leads_max = w3_spend / 140
    print(f"Week 3 (Mid-Tier): ₹{w3_spend} spend -> {w3_leads_min:.1f} to {w3_leads_max:.1f} leads (Claimed: 18-25). Daily: {w3_leads_min/7:.1f}-{w3_leads_max/7:.1f} (Claimed: 2-4).")
    
    w4_spend = 500 * 7
    w4_leads_min = w4_spend / 550
    w4_leads_max = w4_spend / 400
    print(f"Week 4 (Luxury): ₹{w4_spend} spend -> {w4_leads_min:.1f} to {w4_leads_max:.1f} leads (Claimed: 6-9). Cadence: 1 lead every {7/w4_leads_max*24:.1f}h to {7/w4_leads_min*24:.1f}h (Claimed: 24-36h).")
    
    # Model B: Parallel ₹1,000/day
    print("\n--- Model B: ₹1,000/day (₹30,000/mo) Parallel ABO ---")
    adset1_daily = 450
    adset2_daily = 350
    adset3_daily = 200
    
    print(f"AdSet 1 (Plots): ₹{adset1_daily}/day -> Weekly spend ₹{adset1_daily*7}. Weekly leads at ₹60-₹90 CPL: {adset1_daily*7/90:.1f} to {adset1_daily*7/60:.1f} leads/week.")
    print(f"AdSet 2 (Mid-Tier): ₹{adset2_daily}/day -> Weekly spend ₹{adset2_daily*7}. Weekly leads at ₹135-₹220 CPL: {adset2_daily*7/220:.1f} to {adset2_daily*7/135:.1f} leads/week.")
    print(f"AdSet 3 (Luxury): ₹{adset3_daily}/day -> Weekly spend ₹{adset3_daily*7}. Weekly leads at ₹380-₹650 CPL: {adset3_daily*7/650:.1f} to {adset3_daily*7/380:.1f} leads/week.")
    
    print("\n--- CRITICAL LEARNING PHASE EVALUATION FOR MODEL B ---")
    as1_wk_leads = adset1_daily * 7 / 75
    as2_wk_leads = adset2_daily * 7 / 175
    as3_wk_leads = adset3_daily * 7 / 500
    print(f"AdSet 1 average weekly leads: {as1_wk_leads:.1f} (Needs 50 for Learning Phase Exit)")
    print(f"AdSet 2 average weekly leads: {as2_wk_leads:.1f} (Needs 50 for Learning Phase Exit) -> DEFICIT: {50 - as2_wk_leads:.1f} leads/wk")
    print(f"AdSet 3 average weekly leads: {as3_wk_leads:.1f} (Needs 50 for Learning Phase Exit) -> DEFICIT: {50 - as3_wk_leads:.1f} leads/wk")

def verify_financial_settlement_and_roas():
    print("\n" + "=" * 60)
    print("4. EMPIRICAL VERIFICATION: ROAS & SETTLEMENT SHEET MATH (SECTIONS 4.7.2 & 5.3.3)")
    print("=" * 60)
    
    # Settlement sheet
    price = 7500000
    circle_rate_val = 4600000
    taxable_base = max(price, circle_rate_val)
    stamp_duty_female = taxable_base * 0.06
    reg_fee = taxable_base * 0.01
    drafting = 15000
    mutation = 10000
    brokerage_1_25 = price * 0.0125
    
    total_outlay = price + stamp_duty_female + reg_fee + drafting + mutation + brokerage_1_25
    claimed_outlay = 8143750
    
    print(f"Calculated Total Outlay: ₹{total_outlay:,.2f}")
    print(f"Claimed Total Outlay:    ₹{claimed_outlay:,.2f}")
    print(f"Outlay Match: {'PASS' if total_outlay == claimed_outlay else 'FAIL'}")
    
    # ROAS Scenarios
    ad_spend = 30000
    
    # Scenario A
    rev_a = 5500000 * 0.0125
    net_a = rev_a - ad_spend
    roas_a = rev_a / ad_spend
    print(f"\nScenario A: Gross ₹{rev_a:,.2f}, Net ₹{net_a:,.2f}, ROAS {roas_a:.2f}x (Claimed: 2.29x)")
    
    # Scenario B
    rev_b = (1200000 * 0.015) + (7000000 * 0.0125)
    net_b = rev_b - ad_spend
    roas_b = rev_b / ad_spend
    print(f"Scenario B: Gross ₹{rev_b:,.2f}, Net ₹{net_b:,.2f}, ROAS {roas_b:.2f}x (Claimed: 3.51x)")
    
    # Scenario C
    rev_c = 25000000 * 0.01
    net_c = rev_c - ad_spend
    roas_c = rev_c / ad_spend
    print(f"Scenario C: Gross ₹{rev_c:,.2f}, Net ₹{net_c:,.2f}, ROAS {roas_c:.2f}x (Claimed: 8.33x)")

if __name__ == "__main__":
    v1 = verify_kpi_math()
    verify_google_vs_meta()
    verify_model_a_and_b()
    verify_financial_settlement_and_roas()
