# Action & Score Layer Validation

Scores the **decision layer** (action ladder + relative_score + trap rules)
against realised listing gains. Companion to `VALIDATION.md`, which
certifies only the LightGBM premium model.

- **Joined outcomes**: 132 IPOs with actual gains + latest final prediction
- **Generated**: 2026-09-23T12:43:36+05:30

## 1. Action hit rates

| Action | n | % positive | avg gain | avg win | avg loss |
|---|---:|---:|---:|---:|---:|
| MUST_BUY | 37 | 86.5% | +37.8% | +44.3% | -10.1% | (n=37; treat as indicative)
| BUY | 12 | 91.7% | +32.4% | +35.4% | -0.2% | ⚠️ **n=12, directional claims are weakly powered**
| IGNORE | 83 | 50.6% | +6.3% | +17.5% | -9.2% | (n=83)

## 2. Baseline comparison (the alpha question)

Our BUY selection must beat naive baselines or the score adds no value.

| Strategy | n | hit rate | avg gain |
|---|---:|---:|---:|
| ours (MUST_BUY|BUY) | 49 | 87.8% | +36.5% |
| baseline: buy all | 132 | 64.4% | +17.5% |
| baseline: GMP >= 15% | 52 | 88.5% | +37.2% |
| baseline: sub_signal >= 10 | 95 | 65.3% | +24.4% |

> If `ours` does not beat `baseline: GMP >= 15%`, the composite score is not adding selection alpha over raw market sentiment.

## 3. Trap-rule precision

| Group | n | % positive | avg gain |
|---|---:|---:|---:|
| TRAP-regime | 36 | 50.0% | +10.3% |
| Other IGNORE | 47 | 51.1% | +3.3% |

> Trap rules are justified only if TRAP-regime IPOs underperform ordinary IGNOREs (lower % positive / lower avg gain).

## 4. Score quartile returns (discrimination check)

| Quartile | n | score range | avg gain | % positive |
|---|---:|---|---:|---:|
| Q1 | 30 | 1-5 | -0.5% | 40.0% |
| Q2 | 30 | 5-34 | +11.6% | 53.3% |
| Q3 | 30 | 34-89 | +10.5% | 66.7% |
| Q4 | 29 | 89-99 | +47.4% | 96.6% |

> A useful score shows monotonically increasing avg gain from Q1->Q4.

## 5. BUY-threshold sensitivity sweep

Select `relative_score >= X` as the buy rule; how does it do?

| threshold | n | hit rate | avg gain |
|---:|---:|---:|---:|
| 40 | 50 | 84.0% | +33.1% |
| 48 | 49 | 83.7% | +33.7% |
| 55 | 48 | 83.3% | +34.3% |
| 60 | 46 | 84.8% | +35.6% |
| 65 | 45 | 84.4% | +35.8% |
| 72 | 43 | 86.0% | +37.1% |
| 80 | 40 | 85.0% | +38.5% |

## 6. Live model metrics (reconciliation)

- **n**: 132
- **MAE**: 16.35%
- **Directional accuracy**: 65.2% (n=132)
- **|err|>15%**: 38 · **|err|>30%**: 15

> These are **live** numbers and will diverge from CV metrics in `VALIDATION.md`. Trust these for operational expectations.

## Known limitations

- Historical GMP is not stored pre-run, so this validates stored predictions (which did include GMP), not a pure fundamental replay.
- Sample sizes on action-level slices are often < 50; hit rates are noisy. Re-run after each reconciliation cycle.
- Baselines use the same `gmp_signal` the model saw; beating 'buy all' is easy, beating 'GMP >= 15%' is the real test.
