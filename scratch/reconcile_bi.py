import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

deals_path = r'c:\Users\Ram\Desktop\Skylark_Drones_Assessment\Deal funnel Data.xlsx'
wo_path = r'c:\Users\Ram\Desktop\Skylark_Drones_Assessment\Work_Order_Tracker Data.xlsx'

def is_empty(val):
    return pd.isna(val) or str(val).strip().lower() in ['', 'nan', 'none', 'null', '-']

# --- DEALS RECONCILIATION ---
df_deals = pd.read_excel(deals_path, sheet_name='Deal tracker')
valid_deals = df_deals[df_deals['Deal Name'].notna() & (df_deals['Deal Name'] != 'Deal Name')].copy()

def normalize_status(row):
    status = row['Deal Status']
    if is_empty(status):
        return 'Open' # Missing status defaults to Open pipeline
    s = str(status).lower()
    if 'won' in s: return 'Won'
    if 'dead' in s or 'lost' in s: return 'Dead'
    if 'hold' in s: return 'On Hold'
    if 'open' in s or 'lead' in s or 'proposal' in s: return 'Open'
    return str(status).title()

valid_deals['Normalized Status'] = valid_deals.apply(normalize_status, axis=1)

print('=== INDEPENDENT BI EXCEL RECONCILIATION ===')
print('Total Valid Deals:', len(valid_deals))

open_deals = valid_deals[valid_deals['Normalized Status'] == 'Open']
print('Open Deals Count:', len(open_deals))

won_deals = valid_deals[valid_deals['Normalized Status'] == 'Won']
dead_deals = valid_deals[valid_deals['Normalized Status'] == 'Dead']
print('Won Deals:', len(won_deals))
print('Dead Deals:', len(dead_deals))

decided = len(won_deals) + len(dead_deals)
win_rate = (len(won_deals) / decided) * 100 if decided > 0 else 0.0
print('Win Rate (%):', round(win_rate, 1))

open_val = pd.to_numeric(open_deals['Masked Deal value'], errors='coerce').sum()
print('Active Pipeline Value (INR Cr):', round(open_val/10000000, 2))

weighted_val = 0.0
for _, row in open_deals.iterrows():
    val = pd.to_numeric(row['Masked Deal value'], errors='coerce')
    if is_empty(val) or np.isnan(val):
        continue
    prob_str = str(row['Closure Probability']).lower()
    if 'high' in prob_str: prob = 0.8
    elif 'medium' in prob_str: prob = 0.5
    elif 'low' in prob_str: prob = 0.2
    else: prob = 0.3
    weighted_val += (val * prob)

print('Weighted Forecast Value (INR Cr):', round(weighted_val/10000000, 2))

# --- WORK ORDERS RECONCILIATION ---
df_wo = pd.read_excel(wo_path)
headers = df_wo.iloc[0].to_dict()
df_wo_data = df_wo.iloc[1:].copy()
df_wo_data.columns = [str(headers[col]).strip() for col in df_wo.columns]

valid_wos = df_wo_data[df_wo_data['Deal name masked'].notna() & (df_wo_data['Deal name masked'].astype(str).str.strip() != 'Deal name masked')].copy()

def normalize_wo_status(row):
    s = str(row['Execution Status']).lower()
    if any(x in s for x in ['ongoing', 'not started', 'pause', 'partial', 'pending', 'executed until']):
        # Need to check manual delay mapping as per normalizer
        name = str(row['Deal name masked'])
        delays = ['COMPANY019', 'COMPANY041', 'COMPANY088', 'COMPANY134', 'COMPANY139']
        if any(d in name for d in delays):
            return 'Execution Delayed'
        return 'Ongoing'
    return 'Completed'

valid_wos['Normalized Status'] = valid_wos.apply(normalize_wo_status, axis=1)

active_wos = valid_wos[valid_wos['Normalized Status'].isin(['Ongoing', 'Execution Delayed'])]
print('\nActive Work Orders Count:', len(active_wos))

delayed_wos = valid_wos[valid_wos['Normalized Status'] == 'Execution Delayed']
print('Execution Delayed Work Orders Count:', len(delayed_wos))

contract_val = pd.to_numeric(active_wos['Amount in Rupees (Excl of GST) (Masked)'], errors='coerce').sum()
billed_val = pd.to_numeric(active_wos['Billed Value in Rupees (Excl of GST.) (Masked)'], errors='coerce').sum()
receivables = pd.to_numeric(active_wos['Amount Receivable (Masked)'], errors='coerce').sum()

print('Active WO Contract Value (INR Cr):', round(contract_val/10000000, 2))
print('Active WO Billed Value (INR Cr):', round(billed_val/10000000, 2))
print('Active WO Receivables Value (INR Cr):', round(receivables/10000000, 2))
