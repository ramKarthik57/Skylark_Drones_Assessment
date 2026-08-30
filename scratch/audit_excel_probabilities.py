import sys
sys.path.insert(0, 'backend')
import pandas as pd
from collections import Counter
from app.normalization.normalizer import normalize_deals_df
from app.analytics.bi_engine import calculate_bi_analytics

df = pd.read_excel('Deal funnel Data.xlsx')
print("Total rows in raw Excel:", len(df))
print("Raw columns:", df.columns.tolist())

# Inspect raw column for probability
prob_col = [c for c in df.columns if 'probability' in c.lower() or 'closure' in c.lower() or 'rate' in c.lower()]
print("Raw probability columns found:", prob_col)
if prob_col:
    print("Raw probability values across ALL deals:")
    print(df[prob_col[0]].value_counts(dropna=False))

norm_deals = normalize_deals_df(df)
deals_records = norm_deals.to_dict('records')

open_deals = [d for d in deals_records if d.get('deal_status') == 'Open']
print("\nOpen deals count:", len(open_deals))

probs = [d.get('closure_probability') for d in open_deals]
print("Normalized probability values in Open deals:")
print(Counter(probs))

high_count = sum(1 for p in probs if str(p).lower() == 'high' or '80' in str(p))
med_count = sum(1 for p in probs if str(p).lower() == 'medium' or '50' in str(p))
low_count = sum(1 for p in probs if str(p).lower() == 'low' or '20' in str(p))
unrated_count = sum(1 for p in probs if not p or str(p).lower() in ['unrated', 'none', 'nan', ''])

print(f"\nBreakdown of 50 Open Deals:")
print(f"  High (80%): {high_count}")
print(f"  Medium (50%): {med_count}")
print(f"  Low (20%): {low_count}")
print(f"  Total Rated: {high_count + med_count + low_count}")
print(f"  Unrated / Missing: {unrated_count}")

# Check BI engine calculations
bi = calculate_bi_analytics(deals_records, [])
ds = bi['deals_summary']
print(f"\nBI Engine Summary:")
print(f"  Total deals: {ds['total_deal_count']}")
print(f"  Open deals: {ds['open_deal_count']}")
print(f"  Open deals with prob: {ds['open_deals_with_prob']}")
print(f"  Open deals missing prob: {ds['open_deals_missing_prob']}")
print(f"  Open pipeline value: ₹{ds['open_pipeline_value']/10000000:.2f} Cr")
print(f"  Weighted pipeline value: ₹{ds['weighted_pipeline_value']/10000000:.2f} Cr")

# Let's inspect raw Excel values for the open deals
print("\nIndividual Open Deals in Raw Excel vs Normalized:")
for i, d in enumerate(open_deals, 1):
    raw_match = df[df['Deal Name'] == d.get('deal_name')]
    raw_p = raw_match[prob_col[0]].values[0] if len(raw_match) > 0 and prob_col else 'N/A'
    print(f"  {i:02d}. {d.get('deal_name')[:30]}: Value={d.get('deal_value'):,.0f} | Raw Prob={raw_p} | Norm Prob={d.get('closure_probability')}")
