# Quantitative Model Validation & Out-Of-Time Stress Test Report

- **Model Type**: LightGBM Quantile (p10/p50/p90)
- **Model Version**: `f2080bfbe387`
- **Training Sample**: 2266 historical IPOs (2018+ regime)
- **Features Used**: 34 engineered signals (current `FEATURE_COLUMNS`)
- **Validated At**: 2026-10-06T08:45:57.851764+00:00
- **Model Gate Status**: **✅ PASS (model gate cleared — live-inference eligible)**

> **Scope**: this report certifies the **premium model only**. The action
> ladder, relative-score thresholds, and trap rules are validated separately
> in `ACTION_VALIDATION.md`. Passing this gate is necessary but not sufficient
> for trusting a MUST_BUY.

---

## 1. Purged K-Fold Cross-Validation Metrics
Cross-validation evaluated across 5 folds with 5% chronological embargo
(expanding-window walk-forward: train is always strictly before the fold):

| Metric | Measured Value | Benchmark Target | Gate Status |
|---|---|---|---|
| **Mean Absolute Error (MAE)** | **12.96%** | < 20.0% | PASS |
| **Root Mean Squared Error (RMSE)** | **20.16%** | < 30.0% | PASS |
| **Directional Accuracy** | **71.0%** | > 60.0% | PASS |
| **80% Prediction Interval Coverage** | **64.4%** | 70.0% - 90.0% | REVIEW |

---

## 2. Out-Of-Time Bear-Cycle Stress Tests
Trained outside shock windows; evaluated on out-of-time listings during downturns:

| Stress Window | Date Range | N | Measured MAE | RMSE | Dir Acc | Stress Gate |
|---|---|---|---|---|---|---|
| **2020 COVID Crash** | 2020-03-01 to 2020-12-31 | 219 | **5.82%** | 13.47% | 81.7% | PASS (MAE < 25%) |
| **2022 FII Exodus** | 2022-04-01 to 2022-12-31 | 199 | **5.17%** | 13.19% | 83.9% | PASS (MAE < 25%) |

---

## 3. Top Feature Importances (Median Model, ranked by split-importance)
| Feature Column | Split Importance Score |
|---|---|
| `pe` | 1297 |
| `subscription_x` | 823 |
| `issue_size_cr` | 755 |
| `total_bid_capital_cr` | 682 |
| `issue_price` | 611 |
| `sub_per_crore` | 576 |
| `lot_size` | 284 |
| `pat_margin` | 276 |
| `roe` | 258 |
| `debt_equity` | 240 |
| `log_sub` | 228 |
| `ebitda_margin` | 163 |

**Zero-importance audit:** `lm_avg_gain`, `lm_pct_negative`, `lm_pct_positive`, `lm_total_ipos`, `sector_bmom20`, `sector_breadth_200d`, `sector_breadth_50d`, `sector_rs20`, `sector_trendscore` — 0 split-importance. `is_sme` may be kept for segment stratification; `pe` with zero importance means the ML model does **not** use P/E as a predictor — P/E enters only through the heuristic/rule layer (cascade + trap vetoes), which is a deliberate split but should be understood when reading scores.

## 3b. Live reconciliation (trust this over CV)

Measured on realised listing outcomes joined to latest final predictions:

| Metric | Live value | CV value (above) |
|---|---:|---:|
| **n reconciled** | 114 | — |
| **MAE** | **12.53%** | 12.96% |
| **Directional accuracy** | **74.5%** | 71.0% |
| **\|err\| > 15%** | 30 | — |
| **\|err\| > 30%** | 9 | — |

> CV numbers describe the training regime. **Live numbers describe what you
> actually get.** Where they diverge, live wins. The action layer has its own
> report in `ACTION_VALIDATION.md`.

---

## 4. Model gate checklist (not a trading certification)
- **Purged CV Check**: Passed
- **COVID 2020 Bear Window Check**: Passed
- **FII 2022 Bear Window Check**: Passed
- **Overall Model Gate**: ✅ PASS (model gate cleared — live-inference eligible)

**What this does NOT certify:** action thresholds (10/30/48/60/72), logit
weights, trap-rule precision, or portfolio outcomes. Those require
`ACTION_VALIDATION.md` with adequate sample sizes.
