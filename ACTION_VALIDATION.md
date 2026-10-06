# Action & Score Layer Validation

Scores the **decision layer** (action ladder + relative_score + trap rules)
against realised listing gains. Companion to `VALIDATION.md`, which
certifies only the LightGBM premium model.

- **Joined outcomes**: 107 IPOs with actual gains + latest final prediction
- **Generated**: 2026-10-06T14:38:56+05:30

## 1. Action hit rates

| Action | n | % positive | avg gain | avg win | avg loss |
|---|---:|---:|---:|---:|---:|
| MUST_BUY | 24 | 87.5% | +43.5% | +50.2% | -10.1% | (n=24; treat as indicative)
| BUY | 12 | 91.7% | +32.4% | +35.4% | — | ⚠️ **n=12, directional claims are weakly powered**
| IGNORE | 71 | 53.5% | +6.5% | +16.3% | -7.9% | (n=71)

## 2. Baseline comparison (the alpha question)

Our BUY selection must beat naive baselines or the score adds no value.

| Strategy | n | hit rate | avg gain |
|---|---:|---:|---:|
| ours (MUST_BUY|BUY) | 36 | 88.9% | +39.8% |
| baseline: buy all | 107 | 65.4% | +17.7% |
| baseline: GMP >= 15% | 41 | 90.2% | +42.6% |
| baseline: sub_signal >= 10 | 80 | 68.8% | +23.3% |

> If `ours` does not beat `baseline: GMP >= 15%`, the composite score is not adding selection alpha over raw market sentiment.

## 3. Trap-rule precision

| Group | n | % positive | avg gain |
|---|---:|---:|---:|
| TRAP-regime | 26 | 53.8% | +7.7% |
| Other IGNORE | 45 | 53.3% | +5.8% |

> Trap rules are justified only if TRAP-regime IPOs underperform ordinary IGNOREs (lower % positive / lower avg gain).

## 4. Score quartile returns (discrimination check)

| Quartile | n | score range | avg gain | % positive |
|---|---:|---|---:|---:|
| Q1 | 25 | 1-6 | -0.7% | 40.0% |
| Q2 | 25 | 6-48 | +3.3% | 56.0% |
| Q3 | 25 | 49-89 | +15.5% | 68.0% |
| Q4 | 22 | 90-99 | +53.4% | 95.5% |

> A useful score shows monotonically increasing avg gain from Q1->Q4.

## 5. BUY-threshold sensitivity sweep

Select `relative_score >= X` as the buy rule; how does it do?

| threshold | n | hit rate | avg gain |
|---:|---:|---:|---:|
| 40 | 51 | 82.4% | +31.2% |
| 48 | 47 | 80.9% | +33.2% |
| 55 | 44 | 79.5% | +35.3% |
| 60 | 41 | 80.5% | +37.7% |
| 65 | 38 | 78.9% | +37.5% |
| 72 | 36 | 80.6% | +39.5% |
| 80 | 30 | 86.7% | +45.4% |

## 6. Live model metrics (reconciliation)

- **n**: 107
- **MAE**: 13.57%
- **Directional accuracy**: 70.1% (n=107)
- **|err|>15%**: 31 · **|err|>30%**: 10

> These are **live** numbers and will diverge from CV metrics in `VALIDATION.md`. Trust these for operational expectations.

## Known limitations

- Historical GMP is not stored pre-run, so this validates stored predictions (which did include GMP), not a pure fundamental replay.
- Sample sizes on action-level slices are often < 50; hit rates are noisy. Re-run after each reconciliation cycle.
- Baselines use the same `gmp_signal` the model saw; beating 'buy all' is easy, beating 'GMP >= 15%' is the real test.
