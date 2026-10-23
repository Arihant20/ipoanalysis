# Action & Score Layer Validation

Scores the **decision layer** (action ladder + relative_score + trap rules)
against realised listing gains. Companion to `VALIDATION.md`, which
certifies only the LightGBM premium model.

- **Joined outcomes**: 138 IPOs with actual gains + latest final prediction
- **Generated**: 2026-10-23T12:39:09+05:30

## 1. Action hit rates

| Action | n | % positive | avg gain | avg win | avg loss |
|---|---:|---:|---:|---:|---:|
| MUST_BUY | 29 | 89.7% | +43.3% | +48.7% | -10.1% | (n=29; treat as indicative)
| BUY | 15 | 86.7% | +28.9% | +33.3% | — | ⚠️ **n=15, directional claims are weakly powered**
| IGNORE | 94 | 54.3% | +6.5% | +16.6% | -8.2% | (n=94)

## 2. Baseline comparison (the alpha question)

Our BUY selection must beat naive baselines or the score adds no value.

| Strategy | n | hit rate | avg gain |
|---|---:|---:|---:|
| ours (MUST_BUY|BUY) | 44 | 88.6% | +38.4% |
| baseline: buy all | 138 | 65.2% | +16.7% |
| baseline: GMP >= 15% | 48 | 91.7% | +43.0% |
| baseline: sub_signal >= 10 | 103 | 68.0% | +21.9% |

> If `ours` does not beat `baseline: GMP >= 15%`, the composite score is not adding selection alpha over raw market sentiment.

## 3. Trap-rule precision

| Group | n | % positive | avg gain |
|---|---:|---:|---:|
| TRAP-regime | 34 | 58.8% | +8.6% |
| Other IGNORE | 60 | 51.7% | +5.3% |

> Trap rules are justified only if TRAP-regime IPOs underperform ordinary IGNOREs (lower % positive / lower avg gain).

## 4. Score quartile returns (discrimination check)

| Quartile | n | score range | avg gain | % positive |
|---|---:|---|---:|---:|
| Q1 | 32 | 1-6 | +0.2% | 46.9% |
| Q2 | 32 | 6-46 | +5.8% | 50.0% |
| Q3 | 32 | 48-89 | +6.4% | 65.6% |
| Q4 | 32 | 90-99 | +51.2% | 93.8% |

> A useful score shows monotonically increasing avg gain from Q1->Q4.

## 5. BUY-threshold sensitivity sweep

Select `relative_score >= X` as the buy rule; how does it do?

| threshold | n | hit rate | avg gain |
|---:|---:|---:|---:|
| 40 | 69 | 78.3% | +27.8% |
| 48 | 63 | 79.4% | +29.1% |
| 55 | 58 | 79.3% | +31.4% |
| 60 | 52 | 82.7% | +35.2% |
| 65 | 49 | 81.6% | +36.4% |
| 72 | 45 | 82.2% | +39.3% |
| 80 | 41 | 82.9% | +41.6% |

## 6. Live model metrics (reconciliation)

- **n**: 138
- **MAE**: 13.55%
- **Directional accuracy**: 71.0% (n=138)
- **|err|>15%**: 39 · **|err|>30%**: 11

> These are **live** numbers and will diverge from CV metrics in `VALIDATION.md`. Trust these for operational expectations.

## Known limitations

- Historical GMP is not stored pre-run, so this validates stored predictions (which did include GMP), not a pure fundamental replay.
- Sample sizes on action-level slices are often < 50; hit rates are noisy. Re-run after each reconciliation cycle.
- Baselines use the same `gmp_signal` the model saw; beating 'buy all' is easy, beating 'GMP >= 15%' is the real test.
