# Surfboard Volume Calculator

A clean, mobile-first surfboard volume calculator built with React and Vite. Available in English and Hebrew.

**Live:** [razco7.github.io/surfboard-volume-calculator](https://razco7.github.io/surfboard-volume-calculator)

---

## How it works

The calculator is based on the **Guild Factor (GF)** formula by John "Whitney" Guild — the ratio of surfboard volume (in liters) to the surfer's body weight.

```
Base volume = weight × (skill factor + fitness adjustment)
After board type = base × board factor
After wave size = after board × wave factor
Recommended = after wave × construction factor
```

All modifiers are **percentage-based** and scale with the surfer's weight, so a heavier surfer gets proportionally larger adjustments — not flat liter values.

### Skill level factors

| Level | GF Factor |
|---|---|
| Pro | 0.35 |
| Advanced | 0.37 |
| Intermediate | 0.40 |
| Casual | 0.44 |
| Novice | 0.50 |

Calibrated against ranges published by Lost Surfboards and Roberts Surf.

### Fitness adjustment

| Fitness | Adjustment |
|---|---|
| Fit | −0.02 |
| Average | 0.00 |
| Not Too Fit | +0.03 |

### Board type factors

| Board | Factor |
|---|---|
| Shortboard | ×1.00 |
| Perf. Groveler | ×1.05 |
| Groveler | ×1.10 |
| Fish | ×1.133 |
| Funboard | ×1.20 |
| Step-Up | ×0.95 |

### Wave size factors

| Wave | Factor |
|---|---|
| Small (knee–waist) | ×1.06 |
| Medium (chest–head) | ×1.00 |
| Large (overhead+) | ×0.94 |

### Construction factors

| Construction | Factor |
|---|---|
| PU / PE | ×1.000 |
| Soft Top | ×0.970 |
| EPS / Epoxy | ×0.950 |

### Output range

The recommended volume is displayed alongside a ±6% paddle/performance range:
- **↑ paddle** — 6% above recommended (more float, easier paddling)
- **↓ perform** — 6% below recommended (less float, more responsive)

---

## Stack

- React 19 + Vite
- `vite-plugin-singlefile` — builds to a single self-contained HTML file
- No CSS framework — all inline styles
- IBM Plex Mono / IBM Plex Sans (Google Fonts)
- Deployed via GitHub Actions → GitHub Pages

---

## Run locally

```bash
npm install
npm run dev
```

---

*Created by [Claude](https://claude.ai) & [Raz Cohen](https://www.razcohen.com)*
