# Action & Score Layer Validation

Scores the **decision layer** (action ladder + relative_score + trap rules)
against realised listing gains. Companion to `VALIDATION.md`, which
certifies only the LightGBM premium model.

- **Joined outcomes**: 101 IPOs with actual gains + latest final prediction
- **Generated**: 2026-10-03T14:16:08+05:30

## 1. Action hit rates

| Action | n | % positive | avg gain | avg win | avg loss |
|---|---:|---:|---:|---:|---:|
| MUST_BUY | 22 | 86.4% | +41.7% | +48.8% | -10.1% | (n=22; treat as indicative)
| BUY | 12 | 100.0% | +37.6% | +37.6% | — | ⚠️ **n=12, directional claims are weakly powered**
| IGNORE | 67 | 55.2% | +7.3% | +16.7% | -7.2% | (n=67)

## 2. Baseline comparison (the alpha question)

Our BUY selection must beat naive baselines or the score adds no value.

| Strategy | n | hit rate | avg gain |
|---|---:|---:|---:|
| ours (MUST_BUY|BUY) | 34 | 91.2% | +40.2% |
| baseline: buy all | 101 | 67.3% | +18.4% |
| baseline: GMP >= 15% | 40 | 90.0% | +42.0% |
| baseline: sub_signal >= 10 | 77 | 68.8% | +23.3% |

> If `ours` does not beat `baseline: GMP >= 15%`, the composite score is not adding selection alpha over raw market sentiment.

## 3. Trap-rule precision

| Group | n | % positive | avg gain |
|---|---:|---:|---:|
| TRAP-regime | 26 | 57.7% | +8.5% |
| Other IGNORE | 41 | 53.7% | +6.5% |

> Trap rules are justified only if TRAP-regime IPOs underperform ordinary IGNOREs (lower % positive / lower avg gain).

## 4. Score quartile returns (discrimination check)

| Quartile | n | score range | avg gain | % positive |
|---|---:|---|---:|---:|
| Q1 | 23 | 1-6 | -0.0% | 43.5% |
| Q2 | 23 | 6-42 | +7.6% | 56.5% |
| Q3 | 23 | 46-89 | +13.2% | 73.9% |
| Q4 | 22 | 89-99 | +50.5% | 90.9% |

> A useful score shows monotonically increasing avg gain from Q1->Q4.

## 5. BUY-threshold sensitivity sweep

Select `relative_score >= X` as the buy rule; how does it do?

| threshold | n | hit rate | avg gain |
|---:|---:|---:|---:|
| 40 | 47 | 83.0% | +30.5% |
| 48 | 43 | 81.4% | +32.7% |
| 55 | 40 | 80.0% | +34.9% |
| 60 | 38 | 81.6% | +36.6% |
| 65 | 36 | 80.6% | +37.7% |
| 72 | 34 | 82.4% | +39.9% |
| 80 | 29 | 86.2% | +44.7% |

## 6. Live model metrics (reconciliation)

- **n**: 101
- **MAE**: 13.96%
- **Directional accuracy**: 72.3% (n=101)
- **|err|>15%**: 29 · **|err|>30%**: 12

> These are **live** numbers and will diverge from CV metrics in `VALIDATION.md`. Trust these for operational expectations.

## Known limitations

- Historical GMP is not stored pre-run, so this validates stored predictions (which did include GMP), not a pure fundamental replay.
- Sample sizes on action-level slices are often < 50; hit rates are noisy. Re-run after each reconciliation cycle.
- Baselines use the same `gmp_signal` the model saw; beating 'buy all' is easy, beating 'GMP >= 15%' is the real test.
