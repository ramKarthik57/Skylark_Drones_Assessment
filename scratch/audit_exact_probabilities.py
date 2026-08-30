import sys
sys.path.insert(0, 'backend')
import pandas as pd
from collections import Counter
from app.normalization.normalizer import normalize_deal_record
from app.analytics.bi_engine import calculate_bi_analytics

df = pd.read_excel('Deal funnel Data.xlsx')
raw_records = df.to_dict('records')

norm_deals = [normalize_deal_record(r) for r in raw_records]

print(f"Total deals normalized: {len(norm_deals)}")

# Count by deal_status
status_counts = Counter(d['deal_status'] for d in norm_deals)
print("\nDeal status counts:")
for s, c in status_counts.items():
    print(f"  {s}: {c}")

open_deals = [d for d in norm_deals if d['deal_status'] == 'Open']
print(f"\nTotal Open Deals: {len(open_deals)}")

# Probability breakdown of open deals
open_probs = [d.get('closure_probability') for d in open_deals]
print("\nOpen deals closure_probability counts:")
for p, c in Counter(open_probs).items():
    print(f"  {repr(p)}: {c}")

# Let's check ALL deals closure_probability
all_probs = [d.get('closure_probability') for d in norm_deals]
print("\nALL deals closure_probability counts:")
for p, c in Counter(all_probs).items():
    print(f"  {repr(p)}: {c}")

# Calculate weighted forecast and check rated/unrated definition in bi_engine
bi = calculate_bi_analytics(norm_deals, [])
ds = bi['deals_summary']
print("\nBI Engine Output:")
print(f"  Open deal count: {ds['open_deal_count']}")
print(f"  Open deals with prob: {ds['open_deals_with_prob']}")
print(f"  Open deals missing prob: {ds['open_deals_missing_prob']}")
print(f"  Open pipeline value: ₹{ds['open_pipeline_value']/10000000:.2f} Cr")
print(f"  Weighted pipeline value: ₹{ds['weighted_pipeline_value']/10000000:.2f} Cr")
print(f"  Win rate: {ds['win_rate']}% (Won: {ds['won_deal_count']}, Dead: {ds['dead_deal_count']})")

print("\nDetail of each Open Deal:")
for i, d in enumerate(open_deals, 1):
    prob = d.get('closure_probability')
    val = d.get('deal_value') or 0.0
    print(f"  {i:02d}. {d.get('deal_name')[:32]:32} | Val: ₹{val/100000:7.2f} L | Prob: {repr(prob)}")
