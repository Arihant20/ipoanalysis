# Quantitative Model Validation & Out-Of-Time Stress Test Report

- **Model Type**: LightGBM Quantile (p10/p50/p90)
- **Model Version**: `af0211e8a304`
- **Training Sample**: 2035 historical IPOs (2018+ regime)
- **Features Used**: 25 engineered signals
- **Validated At**: 2026-09-22T08:08:17.691737+00:00
- **Validation Gate Status**: **✅ PASS (Validated for Live Inference)**

---

## 1. Purged K-Fold Cross-Validation Metrics
Cross-validation evaluated across 5 folds with 5% chronological embargo:

| Metric | Measured Value | Benchmark Target | Gate Status |
|---|---|---|---|
| **Mean Absolute Error (MAE)** | **13.64%** | < 20.0% | PASS |
| **Root Mean Squared Error (RMSE)** | **21.10%** | < 30.0% | PASS |
| **Directional Accuracy** | **78.6%** | > 60.0% | PASS |
| **80% Prediction Interval Coverage** | **74.3%** | 70.0% - 90.0% | PASS |

---

## 2. Out-Of-Time Bear-Cycle Stress Tests
Trained outside shock windows; evaluated on out-of-time listings during downturns:

| Stress Window | Date Range | N | Measured MAE | RMSE | Dir Acc | Stress Gate |
|---|---|---|---|---|---|---|
| **2020 COVID Crash** | 2020-03-01 to 2020-12-31 | 186 | **9.35%** | 17.57% | 88.2% | PASS (MAE < 25%) |
| **2022 FII Exodus** | 2022-04-01 to 2022-12-31 | 166 | **10.30%** | 18.81% | 89.8% | PASS (MAE < 25%) |

---

## 3. Top Feature Importances (Median Model, ranked by split-importance)
| Feature Column | Split Importance Score |
|---|---|
| `lm_avg_gain` | 139 |
| `subscription_x` | 111 |
| `lm_pct_positive` | 80 |
| `total_bid_capital_cr` | 75 |
| `sub_per_crore` | 65 |
| `lm_total_ipos` | 65 |
| `issue_price` | 59 |
| `issue_size_cr` | 53 |
| `lm_pct_negative` | 48 |
| `roe` | 47 |
| `log_sub` | 29 |
| `ebitda_margin` | 27 |

**Zero-importance audit:** `is_sme`, `pe`, `sub_trap_zone` — 0 split-importance (kept only if structurally required, e.g. `is_sme` for segment stratification; otherwise prune).

---

## 4. Production Trading Certification
- **Purged CV Check**: Passed
- **COVID 2020 Bear Window Check**: Passed
- **FII 2022 Bear Window Check**: Passed
- **Overall Certification**: ✅ PASS (Validated for Live Inference)
