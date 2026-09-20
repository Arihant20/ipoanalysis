# Quantitative Model Validation & Out-Of-Time Stress Test Report

- **Model Type**: LightGBM Quantile (p10/p50/p90)
- **Model Version**: `7007fa0731d6`
- **Training Sample**: 1993 historical IPOs (2018+ regime)
- **Features Used**: 15 engineered signals
- **Validated At**: 2026-09-20T14:01:04.531787+00:00
- **Validation Gate Status**: **✅ PASS (Validated for Live Inference)**

---

## 1. Purged K-Fold Cross-Validation Metrics
Cross-validation evaluated across 5 folds with 5% chronological embargo:

| Metric | Measured Value | Benchmark Target | Gate Status |
|---|---|---|---|
| **Mean Absolute Error (MAE)** | **13.34%** | < 20.0% | PASS |
| **Root Mean Squared Error (RMSE)** | **21.02%** | < 30.0% | PASS |
| **Directional Accuracy** | **81.1%** | > 60.0% | PASS |
| **80% Prediction Interval Coverage** | **77.2%** | 70.0% - 90.0% | PASS |

---

## 2. Out-Of-Time Bear-Cycle Stress Tests
Trained outside shock windows; evaluated on out-of-time listings during downturns:

| Stress Window | Date Range | N | Measured MAE | RMSE | Dir Acc | Stress Gate |
|---|---|---|---|---|---|---|
| **2020 COVID Crash** | 2020-03-01 to 2020-12-31 | 180 | **9.34%** | 17.48% | 88.9% | PASS (MAE < 25%) |
| **2022 FII Exodus** | 2022-04-01 to 2022-12-31 | 160 | **10.11%** | 18.45% | 89.4% | PASS (MAE < 25%) |

---

## 3. Top Feature Importances (Median Model, ranked by split-importance)
| Feature Column | Split Importance Score |
|---|---|
| `lm_avg_gain` | 136 |
| `subscription_x` | 134 |
| `total_bid_capital_cr` | 121 |
| `lm_pct_positive` | 97 |
| `issue_size_cr` | 76 |
| `sub_per_crore` | 66 |
| `lm_total_ipos` | 62 |
| `lm_pct_negative` | 61 |
| `issue_price` | 54 |
| `gmp_gain_pct` | 48 |
| `lot_size` | 20 |
| `sub_moderate` | 19 |

**Zero-importance audit:** None — every feature splits at least once.

---

## 4. Production Trading Certification
- **Purged CV Check**: Passed
- **COVID 2020 Bear Window Check**: Passed
- **FII 2022 Bear Window Check**: Passed
- **Overall Certification**: ✅ PASS (Validated for Live Inference)
