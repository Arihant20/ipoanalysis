# Action & Score Layer Validation

Scores the **decision layer** (action ladder + relative_score + trap rules)
against realised listing gains. Companion to `VALIDATION.md`, which
certifies only the LightGBM premium model.

- **Joined outcomes**: 137 IPOs with actual gains + latest final prediction
- **Generated**: 2026-09-25T14:35:48+05:30

## 1. Action hit rates

| Action | n | % positive | avg gain | avg win | avg loss |
|---|---:|---:|---:|---:|---:|
| MUST_BUY | 37 | 86.5% | +37.8% | +44.3% | -10.1% | (n=37; treat as indicative)
| BUY | 11 | 100.0% | +35.4% | +35.4% | — | ⚠️ **n=11, directional claims are weakly powered**
| IGNORE | 89 | 52.8% | +7.0% | +17.8% | -8.8% | (n=89)

## 2. Baseline comparison (the alpha question)

Our BUY selection must beat naive baselines or the score adds no value.

| Strategy | n | hit rate | avg gain |
|---|---:|---:|---:|
| ours (MUST_BUY|BUY) | 48 | 89.6% | +37.2% |
| baseline: buy all | 137 | 65.7% | +17.6% |
| baseline: GMP >= 15% | 53 | 88.7% | +38.1% |
| baseline: sub_signal >= 10 | 98 | 66.3% | +24.7% |

> If `ours` does not beat `baseline: GMP >= 15%`, the composite score is not adding selection alpha over raw market sentiment.

## 3. Trap-rule precision

| Group | n | % positive | avg gain |
|---|---:|---:|---:|
| TRAP-regime | 42 | 54.8% | +11.8% |
| Other IGNORE | 47 | 51.1% | +2.8% |

> Trap rules are justified only if TRAP-regime IPOs underperform ordinary IGNOREs (lower % positive / lower avg gain).

## 4. Score quartile returns (discrimination check)

| Quartile | n | score range | avg gain | % positive |
|---|---:|---|---:|---:|
| Q1 | 31 | 1-5 | -0.2% | 48.4% |
| Q2 | 31 | 5-36 | +2.0% | 45.2% |
| Q3 | 31 | 36-88 | +22.3% | 77.4% |
| Q4 | 31 | 89-99 | +44.3% | 90.3% |

> A useful score shows monotonically increasing avg gain from Q1->Q4.

## 5. BUY-threshold sensitivity sweep

Select `relative_score >= X` as the buy rule; how does it do?

| threshold | n | hit rate | avg gain |
|---:|---:|---:|---:|
| 40 | 56 | 85.7% | +36.2% |
| 48 | 54 | 85.2% | +37.3% |
| 55 | 47 | 83.0% | +34.8% |
| 60 | 46 | 84.8% | +35.6% |
| 65 | 45 | 84.4% | +35.8% |
| 72 | 44 | 86.4% | +36.6% |
| 80 | 40 | 85.0% | +38.5% |

## 6. Live model metrics (reconciliation)

- **n**: 137
- **MAE**: 16.18%
- **Directional accuracy**: 65.0% (n=137)
- **|err|>15%**: 40 · **|err|>30%**: 16

> These are **live** numbers and will diverge from CV metrics in `VALIDATION.md`. Trust these for operational expectations.

## Known limitations

- Historical GMP is not stored pre-run, so this validates stored predictions (which did include GMP), not a pure fundamental replay.
- Sample sizes on action-level slices are often < 50; hit rates are noisy. Re-run after each reconciliation cycle.
- Baselines use the same `gmp_signal` the model saw; beating 'buy all' is easy, beating 'GMP >= 15%' is the real test.
