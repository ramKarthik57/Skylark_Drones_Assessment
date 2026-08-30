# Skylark Drones BI Agent — Data Dictionary

## 1. Deals Board (`Deal funnel Data.xlsx`)

| Field Name | Type | Monday Column Type | Description & Business Logic | Data Quality & Caveats |
| :--- | :--- | :--- | :--- | :--- |
| `Deal Name` | Text | Text (`name`) | Masked name of the sales opportunity / deal | 2 records missing names; mandatory for deal identification |
| `Owner code` | Text | People / Status | Internal code for BD / KAM salesperson (e.g. `OWNER_001`, `OWNER_003`) | 17 records missing owner code |
| `Client Code` | Text | Text | Anonymous client identifier (e.g. `COMPANY089`, `COMPANY124`) | 2 missing client codes; links to Work Orders `Customer Name Code` |
| `Deal Status` | Category | Status | Primary status: `Won`, `Dead`, `Open`, `On Hold` | Normalized to standard 4 statuses; removes invalid headers |
| `Close Date (A)` | Date | Date | Actual closing date for `Won` deals | ~318 missing values (expected for non-closed deals); normalized to YYYY-MM-DD |
| `Closure Probability` | Category | Dropdown / Text | Probability of win: `High`, `Medium`, `Low` | **258 missing values (74% missing)**; High=80%, Medium=50%, Low=20% for weighted pipeline calculations |
| `Masked Deal value` | Currency | Numbers | Deal value in INR (Rupees) | 181 missing values; formatted as float in INR |
| `Tentative Close Date` | Date | Date | Target closing date for open deals | 74 missing values (increases forecast uncertainty) |
| `Deal Stage` | Category | Status | Stage in sales funnel (e.g. `A. Lead Generated`, `G. Project Won`, `H. Work Order Received`, `L. Project Lost`) | Stage codes stripped for visual reporting |
| `Product deal` | Category | Status / Dropdown | Deliverable type: `Pure Service`, `Service + Spectra`, `Dock + DMO + Spectra`, `Hardware` | 170 missing values |
| `Sector/service` | Category | Status | Industry sector: `Renewables`, `Mining`, `Railways`, `Powerline`, `Construction`, `Others`, `DSP`, `Tender` | 8 missing sector fields |
| `Created Date` | Date | Date | Date deal entered CRM | Normalized to ISO date |

---

## 2. Work Orders Board (`Work_Order_Tracker Data.xlsx`)

| Field Name | Type | Monday Column Type | Description & Business Logic | Data Quality & Caveats |
| :--- | :--- | :--- | :--- | :--- |
| `Deal name masked` | Text | Text (`name`) | Work Order / Project title | Links to `Deal Name` in Deals board |
| `Customer Name Code` | Text | Text | Client identifier | Links to `Client Code` in Deals board |
| `Serial #` | Text | Text | Unique WO tracker serial code | Used for execution tracking |
| `Nature of Work` | Text | Long Text | Scope of drone survey / service | Operational description |
| `Execution Status` | Category | Status | Execution state: `Completed`, `Ongoing`, `Delayed`, `On Hold` | Critical for operational workload assessment |
| `Data Delivery Date` | Date | Date | Promised / Actual data delivery date | Delivery tracking |
| `Date of PO/LOI` | Date | Date | Date Purchase Order or LOI was received | Operational start signal |
| `Document Type` | Category | Status | `Purchase Order`, `LOA/LOI`, `Email Confirmation` | Validates binding agreement |
| `BD/KAM Personnel code` | Text | Status | Account owner code | Links to Deals `Owner code` |
| `Sector` | Category | Status | Industry sector (`Mining`, `Renewables`, `Railways`, `Powerline`, `Construction`, `Others`) | Cleaned to align with Deals sector taxonomy |
| `Is any Skylark software platform...` | Category | Status | Deliverable software (`NONE`, `SPECTRA`, `DMO`, `SPECTRA + DMO`) | Software cross-sell metric |
| `Amount in Rupees (Excl of GST)` | Currency | Numbers | Contract value excluding tax (INR) | Primary execution revenue metric |
| `Billed Value in Rupees (Excl of GST)` | Currency | Numbers | Invoiced value to date (INR) | Financial billing milestone metric |
| `Amount Receivable` | Currency | Numbers | Outstanding unpaid balance (INR) | Cashflow risk metric |
| `Invoice Status` | Category | Status | `Fully Billed`, `Partially Billed`, `Not billed yet`, `Stuck` | Billing status |
| `WO Status (billed)` | Category | Status | `Closed`, `Open` | Overall WO billing closure |
| `Billing Status` | Category | Status | `Billed`, `Update Required`, `Not Billable`, `Partially Billed`, `Stuck` | Action status for finance |
