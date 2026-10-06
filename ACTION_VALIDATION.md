# Action & Score Layer Validation

Scores the **decision layer** (action ladder + relative_score + trap rules)
against realised listing gains. Companion to `VALIDATION.md`, which
certifies only the LightGBM premium model.

- **Joined outcomes**: 108 IPOs with actual gains + latest final prediction
- **Generated**: 2026-10-06T17:15:57+05:30

## 1. Action hit rates

| Action | n | % positive | avg gain | avg win | avg loss |
|---|---:|---:|---:|---:|---:|
| MUST_BUY | 25 | 88.0% | +43.2% | +49.6% | -10.1% | (n=25; treat as indicative)
| BUY | 12 | 91.7% | +32.4% | +35.4% | — | ⚠️ **n=12, directional claims are weakly powered**
| IGNORE | 71 | 53.5% | +6.5% | +16.3% | -7.9% | (n=71)

## 2. Baseline comparison (the alpha question)

Our BUY selection must beat naive baselines or the score adds no value.

| Strategy | n | hit rate | avg gain |
|---|---:|---:|---:|
| ours (MUST_BUY|BUY) | 37 | 89.2% | +39.7% |
| baseline: buy all | 108 | 65.7% | +17.9% |
| baseline: GMP >= 15% | 42 | 90.5% | +42.4% |
| baseline: sub_signal >= 10 | 81 | 69.1% | +23.5% |

> If `ours` does not beat `baseline: GMP >= 15%`, the composite score is not adding selection alpha over raw market sentiment.

## 3. Trap-rule precision

| Group | n | % positive | avg gain |
|---|---:|---:|---:|
| TRAP-regime | 26 | 53.8% | +7.6% |
| Other IGNORE | 45 | 53.3% | +5.8% |

> Trap rules are justified only if TRAP-regime IPOs underperform ordinary IGNOREs (lower % positive / lower avg gain).

## 4. Score quartile returns (discrimination check)

| Quartile | n | score range | avg gain | % positive |
|---|---:|---|---:|---:|
| Q1 | 25 | 1-6 | -1.1% | 36.0% |
| Q2 | 25 | 7-52 | +3.0% | 60.0% |
| Q3 | 25 | 53-92 | +12.3% | 68.0% |
| Q4 | 23 | 93-99 | +56.8% | 95.7% |

> A useful score shows monotonically increasing avg gain from Q1->Q4.

## 5. BUY-threshold sensitivity sweep

Select `relative_score >= X` as the buy rule; how does it do?

| threshold | n | hit rate | avg gain |
|---:|---:|---:|---:|
| 40 | 53 | 83.0% | +30.9% |
| 48 | 50 | 82.0% | +32.3% |
| 55 | 46 | 80.4% | +34.7% |
| 60 | 43 | 81.4% | +36.9% |
| 65 | 42 | 81.0% | +37.2% |
| 72 | 38 | 81.6% | +40.8% |
| 80 | 34 | 82.4% | +43.7% |

## 6. Live model metrics (reconciliation)

- **n**: 108
- **MAE**: 12.79%
- **Directional accuracy**: 74.1% (n=108)
- **|err|>15%**: 29 · **|err|>30%**: 9

> These are **live** numbers and will diverge from CV metrics in `VALIDATION.md`. Trust these for operational expectations.

## Known limitations

- Historical GMP is not stored pre-run, so this validates stored predictions (which did include GMP), not a pure fundamental replay.
- Sample sizes on action-level slices are often < 50; hit rates are noisy. Re-run after each reconciliation cycle.
- Baselines use the same `gmp_signal` the model saw; beating 'buy all' is easy, beating 'GMP >= 15%' is the real test.
