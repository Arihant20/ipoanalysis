# Action & Score Layer Validation

Scores the **decision layer** (action ladder + relative_score + trap rules)
against realised listing gains. Companion to `VALIDATION.md`, which
certifies only the LightGBM premium model.

- **Joined outcomes**: 156 IPOs with actual gains + latest final prediction
- **Generated**: 2026-10-01T19:06:59+05:30

## 1. Action hit rates

| Action | n | % positive | avg gain | avg win | avg loss |
|---|---:|---:|---:|---:|---:|
| MUST_BUY | 40 | 87.5% | +40.6% | +47.0% | -10.1% | (n=40; treat as indicative)
| BUY | 11 | 100.0% | +35.4% | +35.4% | — | ⚠️ **n=11, directional claims are weakly powered**
| IGNORE | 105 | 57.1% | +7.7% | +17.0% | -8.0% | (n=105)

## 2. Baseline comparison (the alpha question)

Our BUY selection must beat naive baselines or the score adds no value.

| Strategy | n | hit rate | avg gain |
|---|---:|---:|---:|
| ours (MUST_BUY|BUY) | 51 | 90.2% | +39.5% |
| baseline: buy all | 156 | 67.9% | +18.1% |
| baseline: GMP >= 15% | 57 | 89.5% | +41.0% |
| baseline: sub_signal >= 10 | 111 | 68.5% | +24.9% |

> If `ours` does not beat `baseline: GMP >= 15%`, the composite score is not adding selection alpha over raw market sentiment.

## 3. Trap-rule precision

| Group | n | % positive | avg gain |
|---|---:|---:|---:|
| TRAP-regime | 36 | 55.6% | +6.4% |
| Other IGNORE | 69 | 58.0% | +8.3% |

> Trap rules are justified only if TRAP-regime IPOs underperform ordinary IGNOREs (lower % positive / lower avg gain).

## 4. Score quartile returns (discrimination check)

| Quartile | n | score range | avg gain | % positive |
|---|---:|---|---:|---:|
| Q1 | 36 | 1-8 | -0.4% | 44.4% |
| Q2 | 36 | 8-37 | +4.4% | 58.3% |
| Q3 | 36 | 39-90 | +13.1% | 72.2% |
| Q4 | 35 | 90-99 | +54.6% | 97.1% |

> A useful score shows monotonically increasing avg gain from Q1->Q4.

## 5. BUY-threshold sensitivity sweep

Select `relative_score >= X` as the buy rule; how does it do?

| threshold | n | hit rate | avg gain |
|---:|---:|---:|---:|
| 40 | 69 | 84.1% | +34.2% |
| 48 | 67 | 83.6% | +35.1% |
| 55 | 64 | 82.8% | +36.6% |
| 60 | 63 | 84.1% | +37.2% |
| 65 | 61 | 83.6% | +37.9% |
| 72 | 57 | 84.2% | +40.4% |
| 80 | 51 | 84.3% | +43.7% |

## 6. Live model metrics (reconciliation)

- **n**: 156
- **MAE**: 14.62%
- **Directional accuracy**: 69.9% (n=156)
- **|err|>15%**: 44 · **|err|>30%**: 18

> These are **live** numbers and will diverge from CV metrics in `VALIDATION.md`. Trust these for operational expectations.

## Known limitations

- Historical GMP is not stored pre-run, so this validates stored predictions (which did include GMP), not a pure fundamental replay.
- Sample sizes on action-level slices are often < 50; hit rates are noisy. Re-run after each reconciliation cycle.
- Baselines use the same `gmp_signal` the model saw; beating 'buy all' is easy, beating 'GMP >= 15%' is the real test.
