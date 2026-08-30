import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.path.insert(0, 'backend')

import pandas as pd
from collections import Counter
from app.normalization.normalizer import normalize_deal_record
from app.analytics.bi_engine import calculate_bi_analytics

df = pd.read_excel('Deal funnel Data.xlsx')
raw_records = df.to_dict('records')

norm_deals = [normalize_deal_record(r) for r in raw_records]

# Filter out duplicate header row if any
valid_deals = [d for d in norm_deals if d.get('deal_name') and d.get('deal_name') != 'Deal Name']
print(f"Total Valid Deals: {len(valid_deals)}")

open_deals = [d for d in valid_deals if d.get('deal_status') == 'Open']
print(f"Total Open Deals: {len(open_deals)}")

probs = [d.get('closure_probability') for d in open_deals]
print("\nOpen Deals Probability Breakdown:")
for p, c in Counter(probs).items():
    print(f"  {repr(p)}: {c}")

high_deals = [d for d in open_deals if d.get('closure_probability') == 'High']
med_deals = [d for d in open_deals if d.get('closure_probability') == 'Medium']
low_deals = [d for d in open_deals if d.get('closure_probability') == 'Low']
unrated_deals = [d for d in open_deals if not d.get('closure_probability')]

def safe_sum(deals):
    return sum(d.get('deal_value') or 0.0 for d in deals)

print(f"\nExact Counts for 50 Open Deals:")
print(f"  High (80%):   {len(high_deals)} deals | Sum Value: INR {safe_sum(high_deals)/10000000:.2f} Cr")
print(f"  Medium (50%): {len(med_deals)} deals | Sum Value: INR {safe_sum(med_deals)/10000000:.2f} Cr")
print(f"  Low (20%):    {len(low_deals)} deals | Sum Value: INR {safe_sum(low_deals)/10000000:.2f} Cr")
print(f"  Total Rated:  {len(high_deals) + len(med_deals) + len(low_deals)} deals")
print(f"  Unrated (30% baseline): {len(unrated_deals)} deals | Sum Value: INR {safe_sum(unrated_deals)/10000000:.2f} Cr")

# Let's inspect the 3 unrated deals
print("\nThe 3 Unrated Open Deals:")
for d in unrated_deals:
    print(f"  - {d.get('deal_name')}: Value=INR {d.get('deal_value') or 0:,.0f} | Status={d.get('deal_status')}")

# Run through bi_engine
bi = calculate_bi_analytics(valid_deals, [])
ds = bi['deals_summary']
print(f"\nBI Engine Calculation Output:")
print(f"  Open deal count: {ds['open_deal_count']}")
print(f"  Open deals with prob: {ds['open_deals_with_prob']}")
print(f"  Open deals missing prob: {ds['open_deals_missing_prob']}")
print(f"  Open pipeline value: INR {ds['open_pipeline_value']/10000000:.2f} Cr")
print(f"  Weighted pipeline value: INR {ds['weighted_pipeline_value']/10000000:.2f} Cr")

manual_weighted = (
    safe_sum(high_deals) * 0.8 +
    safe_sum(med_deals) * 0.5 +
    safe_sum(low_deals) * 0.2 +
    safe_sum(unrated_deals) * 0.3
)
print(f"Manual Weighted Sum: INR {manual_weighted/10000000:.2f} Cr ({manual_weighted:,.2f})")
