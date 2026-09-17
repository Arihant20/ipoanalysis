# Quantitative Model Validation & Out-Of-Time Stress Test Report

- **Model Type**: LightGBM Quantile (p10/p50/p90)
- **Model Version**: `98108754c4fb`
- **Training Sample**: 1832 historical IPOs (2018+ regime)
- **Features Used**: 25 engineered signals
- **Validated At**: 2026-09-12T09:17:02.133644+00:00
- **Validation Gate Status**: **✅ PASS (Validated for Live Inference)**

---

## 1. Purged K-Fold Cross-Validation Metrics
Cross-validation evaluated across 5 folds with 5% chronological embargo:

| Metric | Measured Value | Benchmark Target | Gate Status |
|---|---|---|---|
| **Mean Absolute Error (MAE)** | **12.90%** | < 20.0% | PASS |
| **Root Mean Squared Error (RMSE)** | **21.31%** | < 30.0% | PASS |
| **Directional Accuracy** | **83.1%** | > 60.0% | PASS |
| **80% Prediction Interval Coverage** | **74.6%** | 70.0% - 90.0% | PASS |

---

## 2. Out-Of-Time Bear-Cycle Stress Tests
Trained outside shock windows; evaluated on out-of-time listings during downturns:

| Stress Window | Date Range | N | Measured MAE | RMSE | Dir Acc | Stress Gate |
|---|---|---|---|---|---|---|
| **2020 COVID Crash** | 2020-03-01 to 2020-12-31 | 157 | **9.60%** | 17.65% | 87.3% | PASS (MAE < 25%) |
| **2022 FII Exodus** | 2022-04-01 to 2022-12-31 | 137 | **10.30%** | 18.80% | 89.1% | PASS (MAE < 25%) |

---

## 3. Top Feature Importances (Median Model, ranked by split-importance)
| Feature Column | Split Importance Score |
|---|---|
| `lm_avg_gain` | 139 |
| `subscription_x` | 126 |
| `total_bid_capital_cr` | 116 |
| `lm_total_ipos` | 81 |
| `lm_pct_negative` | 71 |
| `issue_size_cr` | 70 |
| `sub_per_crore` | 60 |
| `lm_pct_positive` | 49 |
| `issue_price` | 47 |
| `log_sub` | 44 |
| `log_bid_capital` | 26 |
| `log_size` | 24 |

**Zero-importance audit:** `ebitda_margin`, `is_sme`, `pe` — 0 split-importance (kept only if structurally required, e.g. `is_sme` for segment stratification; otherwise prune).

---

## 4. Production Trading Certification
- **Purged CV Check**: Passed
- **COVID 2020 Bear Window Check**: Passed
- **FII 2022 Bear Window Check**: Passed
- **Overall Certification**: ✅ PASS (Validated for Live Inference)
