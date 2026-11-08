# physcx — physics in three dimensions

An interactive, narrated 3D physics explorer in the spirit of 3Blue1Brown, built around *The Feynman Lectures on Physics*.
Everything lives in `index.html` — double-click it to open in Chrome or Edge (needs an internet connection to load three.js, KaTeX and fonts from a CDN).

## Contents — 17 chapters in 9 topics

| # | Chapter | Feynman Lectures |
|---|---|---|
| **1** | **Mechanics** | |
| 1.1 | Planetary Motion by Hand | Vol. I, Ch. 9 |
| 1.2 | Orbits in a Gravity Well | Vol. I, Ch. 7 (related) |
| 1.3 | The Principle of Least Action | Vol. II, Ch. 19 |
| 1.4 | The Lorenz Attractor | — |
| **2** | **Rotation** | |
| 2.1 | The Spinning Top | Vol. I, Ch. 20 |
| 2.2 | The Tennis-Racket Theorem | Vol. I, Ch. 20 (related) |
| **3** | **Oscillations** | |
| 3.1 | Resonance — driven pendulums and the resonance curve | Vol. I, Ch. 23 |
| **4** | **Waves & Optics** | |
| 4.1 | Superposition of Waves | Vol. I, Ch. 29 (related) |
| 4.2 | The Principle of Least Time | Vol. I, Ch. 26 |
| **5** | **Fluids** | |
| 5.1 | The Flow of Dry Water — ideal flow, Bernoulli pressure, Magnus lift | Vol. II, Ch. 40 |
| 5.2 | The Flow of Wet Water — live Navier–Stokes (lattice Boltzmann) solver, vortex street, Strouhal number | Vol. II, Ch. 41 |
| **6** | **Electromagnetism** | |
| 6.1 | Electric Field Lines | Vol. II, Ch. 4 (related) |
| 6.2 | The Lorentz Force | Vol. II, Ch. 29 (related) |
| 6.3 | Electromagnetic Radiation — a⊥(t − r/c)/r from a shaken charge | Vol. I, Ch. 28 |
| **7** | **Heat** | |
| 7.1 | The Kinetic Theory of Gases | Vol. I, Ch. 39 |
| **8** | **Relativity** | |
| 8.1 | Space-Time — light cone, worldlines, Lorentz boost | Vol. I, Ch. 17 |
| **9** | **Quantum** | |
| 9.1 | Electrons Through Two Slits | Vol. III, Ch. 1 |

Each chapter has step-by-step narration with equations, live sliders, live readouts, and a link to its lecture.

## Controls
| Action | Input |
|---|---|
| Contents (all chapters by topic) | `M` or the Contents button |
| Previous / next chapter | `[` / `]` (or the « » buttons) |
| Jump to a topic | `1` – `9` |
| Next / previous narration step | `→` / `←` |
| Orbit / zoom / pan | drag · scroll · right-drag |
| Play / pause | `Space` |
| Restart simulation | `R` |
| Auto-advance tour | `T` |
| Auto-orbit camera | `O` |
| Reset camera | `C` |
| Hide UI (clean recording view) | `H` (double-click to bring it back) |
| Speed up / down | `+` / `-` |
| Fullscreen | `F` |

## Adding a chapter
Each chapter is a plain object in the script with `params`, `steps`, `init(ctx)`, `reset(ctx)`, `update(dt, ctx)` and `readouts(ctx)` (optional `ref` for a Feynman lecture link).
Write one and add it to a topic's `chapters` list in `TOPICS`.
