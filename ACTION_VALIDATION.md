# Action & Score Layer Validation

Scores the **decision layer** (action ladder + relative_score + trap rules)
against realised listing gains. Companion to `VALIDATION.md`, which
certifies only the LightGBM premium model.

- **Joined outcomes**: 141 IPOs with actual gains + latest final prediction
- **Generated**: 2026-09-28T23:06:52+05:30

## 1. Action hit rates

| Action | n | % positive | avg gain | avg win | avg loss |
|---|---:|---:|---:|---:|---:|
| MUST_BUY | 37 | 86.5% | +37.8% | +44.3% | -10.1% | (n=37; treat as indicative)
| BUY | 11 | 100.0% | +35.4% | +35.4% | — | ⚠️ **n=11, directional claims are weakly powered**
| IGNORE | 93 | 54.8% | +8.2% | +19.2% | -8.8% | (n=93)

## 2. Baseline comparison (the alpha question)

Our BUY selection must beat naive baselines or the score adds no value.

| Strategy | n | hit rate | avg gain |
|---|---:|---:|---:|
| ours (MUST_BUY|BUY) | 48 | 89.6% | +37.2% |
| baseline: buy all | 141 | 66.7% | +18.1% |
| baseline: GMP >= 15% | 54 | 88.9% | +39.1% |
| baseline: sub_signal >= 10 | 101 | 67.3% | +24.9% |

> If `ours` does not beat `baseline: GMP >= 15%`, the composite score is not adding selection alpha over raw market sentiment.

## 3. Trap-rule precision

| Group | n | % positive | avg gain |
|---|---:|---:|---:|
| TRAP-regime | 43 | 55.8% | +13.7% |
| Other IGNORE | 50 | 54.0% | +3.5% |

> Trap rules are justified only if TRAP-regime IPOs underperform ordinary IGNOREs (lower % positive / lower avg gain).

## 4. Score quartile returns (discrimination check)

| Quartile | n | score range | avg gain | % positive |
|---|---:|---|---:|---:|
| Q1 | 32 | 1-5 | -0.1% | 46.9% |
| Q2 | 32 | 5-36 | +3.2% | 50.0% |
| Q3 | 32 | 37-88 | +21.8% | 78.1% |
| Q4 | 32 | 89-99 | +45.7% | 90.6% |

> A useful score shows monotonically increasing avg gain from Q1->Q4.

## 5. BUY-threshold sensitivity sweep

Select `relative_score >= X` as the buy rule; how does it do?

| threshold | n | hit rate | avg gain |
|---:|---:|---:|---:|
| 40 | 59 | 86.4% | +35.9% |
| 48 | 57 | 86.0% | +37.1% |
| 55 | 49 | 83.7% | +35.3% |
| 60 | 48 | 85.4% | +36.1% |
| 65 | 46 | 84.8% | +37.0% |
| 72 | 45 | 86.7% | +37.8% |
| 80 | 41 | 85.4% | +39.8% |

## 6. Live model metrics (reconciliation)

- **n**: 141
- **MAE**: 16.15%
- **Directional accuracy**: 65.2% (n=141)
- **|err|>15%**: 42 · **|err|>30%**: 17

> These are **live** numbers and will diverge from CV metrics in `VALIDATION.md`. Trust these for operational expectations.

## Known limitations

- Historical GMP is not stored pre-run, so this validates stored predictions (which did include GMP), not a pure fundamental replay.
- Sample sizes on action-level slices are often < 50; hit rates are noisy. Re-run after each reconciliation cycle.
- Baselines use the same `gmp_signal` the model saw; beating 'buy all' is easy, beating 'GMP >= 15%' is the real test.
