# Action & Score Layer Validation

Scores the **decision layer** (action ladder + relative_score + trap rules)
against realised listing gains. Companion to `VALIDATION.md`, which
certifies only the LightGBM premium model.

- **Joined outcomes**: 152 IPOs with actual gains + latest final prediction
- **Generated**: 2026-09-30T23:29:36+05:30

## 1. Action hit rates

| Action | n | % positive | avg gain | avg win | avg loss |
|---|---:|---:|---:|---:|---:|
| MUST_BUY | 38 | 86.8% | +38.8% | +45.3% | -10.1% | (n=38; treat as indicative)
| BUY | 11 | 100.0% | +35.4% | +35.4% | — | ⚠️ **n=11, directional claims are weakly powered**
| IGNORE | 103 | 57.3% | +7.7% | +17.1% | -8.2% | (n=103)

## 2. Baseline comparison (the alpha question)

Our BUY selection must beat naive baselines or the score adds no value.

| Strategy | n | hit rate | avg gain |
|---|---:|---:|---:|
| ours (MUST_BUY|BUY) | 49 | 89.8% | +38.0% |
| baseline: buy all | 152 | 67.8% | +17.5% |
| baseline: GMP >= 15% | 55 | 89.1% | +39.8% |
| baseline: sub_signal >= 10 | 108 | 68.5% | +24.2% |

> If `ours` does not beat `baseline: GMP >= 15%`, the composite score is not adding selection alpha over raw market sentiment.

## 3. Trap-rule precision

| Group | n | % positive | avg gain |
|---|---:|---:|---:|
| TRAP-regime | 47 | 57.4% | +12.9% |
| Other IGNORE | 56 | 57.1% | +3.3% |

> Trap rules are justified only if TRAP-regime IPOs underperform ordinary IGNOREs (lower % positive / lower avg gain).

## 4. Score quartile returns (discrimination check)

| Quartile | n | score range | avg gain | % positive |
|---|---:|---|---:|---:|
| Q1 | 35 | 1-4 | +0.4% | 51.4% |
| Q2 | 35 | 5-36 | +3.0% | 48.6% |
| Q3 | 35 | 36-88 | +19.2% | 80.0% |
| Q4 | 34 | 88-99 | +46.3% | 91.2% |

> A useful score shows monotonically increasing avg gain from Q1->Q4.

## 5. BUY-threshold sensitivity sweep

Select `relative_score >= X` as the buy rule; how does it do?

| threshold | n | hit rate | avg gain |
|---:|---:|---:|---:|
| 40 | 62 | 87.1% | +35.6% |
| 48 | 60 | 86.7% | +36.6% |
| 55 | 52 | 84.6% | +34.9% |
| 60 | 51 | 86.3% | +35.6% |
| 65 | 49 | 85.7% | +36.5% |
| 72 | 46 | 87.0% | +38.7% |
| 80 | 42 | 85.7% | +40.6% |

## 6. Live model metrics (reconciliation)

- **n**: 152
- **MAE**: 15.65%
- **Directional accuracy**: 65.8% (n=152)
- **|err|>15%**: 43 · **|err|>30%**: 18

> These are **live** numbers and will diverge from CV metrics in `VALIDATION.md`. Trust these for operational expectations.

## Known limitations

- Historical GMP is not stored pre-run, so this validates stored predictions (which did include GMP), not a pure fundamental replay.
- Sample sizes on action-level slices are often < 50; hit rates are noisy. Re-run after each reconciliation cycle.
- Baselines use the same `gmp_signal` the model saw; beating 'buy all' is easy, beating 'GMP >= 15%' is the real test.
