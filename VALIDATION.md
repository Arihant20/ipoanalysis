# Quantitative Model Validation & Out-Of-Time Stress Test Report

- **Model Type**: LightGBM Quantile (p10/p50/p90)
- **Model Version**: `36dcb9a538c5`
- **Training Sample**: 1832 historical IPOs (2018+ regime)
- **Features Used**: 41 engineered signals
- **Validated At**: 2026-09-12T07:55:59.826591Z
- **Validation Gate Status**: **✅ PASS (Validated for Live Inference)**

---

## 1. Purged K-Fold Cross-Validation Metrics
Cross-validation evaluated across 5 folds with 5% chronological embargo:

| Metric | Measured Value | Benchmark Target | Gate Status |
|---|---|---|---|
| **Mean Absolute Error (MAE)** | **12.11%** | < 20.0% | PASS |
| **Root Mean Squared Error (RMSE)** | **20.16%** | < 30.0% | PASS |
| **Directional Accuracy** | **83.5%** | > 60.0% | PASS |
| **80% Prediction Interval Coverage** | **78.4%** | 70.0% - 90.0% | PASS |

---

## 2. Out-Of-Time Bear-Cycle Stress Tests
Trained outside shock windows; evaluated on out-of-time listings during downturns:

| Stress Window | Date Range | N | Measured MAE | RMSE | Dir Acc | Stress Gate |
|---|---|---|---|---|---|---|
| **2020 COVID Crash** | 2020-03-01 to 2020-12-31 | 157 | **9.46%** | 17.29% | 87.9% | PASS (MAE < 25%) |
| **2022 FII Exodus** | 2022-04-01 to 2022-12-31 | 137 | **10.40%** | 18.80% | 88.3% | PASS (MAE < 25%) |

---

## 3. Top Feature Importances (Median Model)
| Feature Column | Split Importance Score |
|---|---|
| `is_sme` | 0 |
| `issue_price` | 52 |
| `log_price` | 8 |
| `issue_size_cr` | 68 |
| `log_size` | 19 |
| `lot_size` | 15 |
| `log_lot` | 4 |
| `subscription_x` | 115 |
| `log_sub` | 72 |
| `total_bid_capital_cr` | 117 |
| `log_bid_capital` | 29 |
| `sub_undersubscribed` | 0 |

---

## 4. Production Trading Certification
- **Purged CV Check**: Passed
- **COVID 2020 Bear Window Check**: Passed
- **FII 2022 Bear Window Check**: Passed
- **Overall Certification**: ✅ PASS (Validated for Live Inference)
