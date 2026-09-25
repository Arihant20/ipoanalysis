# Action & Score Layer Validation

Scores the **decision layer** (action ladder + relative_score + trap rules)
against realised listing gains. Companion to `VALIDATION.md`, which
certifies only the LightGBM premium model.

- **Joined outcomes**: 138 IPOs with actual gains + latest final prediction
- **Generated**: 2026-09-25T21:40:08+05:30

## 1. Action hit rates

| Action | n | % positive | avg gain | avg win | avg loss |
|---|---:|---:|---:|---:|---:|
| MUST_BUY | 37 | 86.5% | +37.8% | +44.3% | -10.1% | (n=37; treat as indicative)
| BUY | 11 | 100.0% | +35.4% | +35.4% | — | ⚠️ **n=11, directional claims are weakly powered**
| IGNORE | 90 | 53.3% | +7.4% | +18.3% | -8.8% | (n=90)

## 2. Baseline comparison (the alpha question)

Our BUY selection must beat naive baselines or the score adds no value.

| Strategy | n | hit rate | avg gain |
|---|---:|---:|---:|
| ours (MUST_BUY|BUY) | 48 | 89.6% | +37.2% |
| baseline: buy all | 138 | 65.9% | +17.8% |
| baseline: GMP >= 15% | 53 | 88.7% | +38.1% |
| baseline: sub_signal >= 10 | 98 | 66.3% | +24.7% |

> If `ours` does not beat `baseline: GMP >= 15%`, the composite score is not adding selection alpha over raw market sentiment.

## 3. Trap-rule precision

| Group | n | % positive | avg gain |
|---|---:|---:|---:|
| TRAP-regime | 41 | 53.7% | +12.0% |
| Other IGNORE | 49 | 53.1% | +3.5% |

> Trap rules are justified only if TRAP-regime IPOs underperform ordinary IGNOREs (lower % positive / lower avg gain).

## 4. Score quartile returns (discrimination check)

| Quartile | n | score range | avg gain | % positive |
|---|---:|---|---:|---:|
| Q1 | 32 | 1-5 | -0.3% | 43.8% |
| Q2 | 32 | 6-37 | +3.8% | 53.1% |
| Q3 | 32 | 37-89 | +21.9% | 75.0% |
| Q4 | 29 | 89-99 | +46.5% | 93.1% |

> A useful score shows monotonically increasing avg gain from Q1->Q4.

## 5. BUY-threshold sensitivity sweep

Select `relative_score >= X` as the buy rule; how does it do?

| threshold | n | hit rate | avg gain |
|---:|---:|---:|---:|
| 40 | 57 | 86.0% | +35.6% |
| 48 | 55 | 85.5% | +36.7% |
| 55 | 48 | 83.3% | +34.2% |
| 60 | 47 | 85.1% | +34.9% |
| 65 | 45 | 84.4% | +35.8% |
| 72 | 44 | 86.4% | +36.6% |
| 80 | 40 | 85.0% | +38.5% |

## 6. Live model metrics (reconciliation)

- **n**: 138
- **MAE**: 16.25%
- **Directional accuracy**: 65.9% (n=138)
- **|err|>15%**: 41 · **|err|>30%**: 17

> These are **live** numbers and will diverge from CV metrics in `VALIDATION.md`. Trust these for operational expectations.

## Known limitations

- Historical GMP is not stored pre-run, so this validates stored predictions (which did include GMP), not a pure fundamental replay.
- Sample sizes on action-level slices are often < 50; hit rates are noisy. Re-run after each reconciliation cycle.
- Baselines use the same `gmp_signal` the model saw; beating 'buy all' is easy, beating 'GMP >= 15%' is the real test.
