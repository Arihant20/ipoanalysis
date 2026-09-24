# Quantitative Model Validation & Out-Of-Time Stress Test Report

- **Model Type**: LightGBM Quantile (p10/p50/p90)
- **Model Version**: `af0211e8a304`
- **Training Sample**: 2035 historical IPOs (2018+ regime)
- **Features Used**: 25 engineered signals (current `FEATURE_COLUMNS`)
- **Validated At**: 2026-09-22T08:08:17.691737+00:00
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

**Zero-importance audit:** `is_sme`, `pe`, `sub_trap_zone` — 0 split-importance. `is_sme` may be kept for segment stratification; `pe` with zero importance means the ML model does **not** use P/E as a predictor — P/E enters only through the heuristic/rule layer (cascade + trap vetoes), which is a deliberate split but should be understood when reading scores.

## 3b. Live reconciliation (trust this over CV)

Measured on realised listing outcomes joined to latest final predictions:

| Metric | Live value | CV value (above) |
|---|---:|---:|
| **n reconciled** | 144 | — |
| **MAE** | **16.33%** | 13.64% |
| **Directional accuracy** | **70.6%** | 78.6% |
| **\|err\| > 15%** | 42 | — |
| **\|err\| > 30%** | 17 | — |

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
