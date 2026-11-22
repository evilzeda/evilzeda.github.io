# physcx — physics in three dimensions

An interactive, narrated 3D physics explorer in the spirit of 3Blue1Brown, built around *The Feynman Lectures on Physics*.
The simulations live in `index.html`; the written lessons live in `js/lessons-0.js`, `js/lessons-a.js`, `js/lessons-b.js` and `js/lessons-c.js`. Open `index.html` in Chrome or Edge (needs an internet connection to load three.js, KaTeX and fonts from a CDN).

## Contents — 31 chapters in 10 topics

New to physics? Start with **0 · Foundations**: vectors, motion, forces and energy, the basics every later chapter uses.
Each later topic starts with the physics (built on a Feynman lecture) and ends with an **applied** chapter showing a real machine that uses it.
Every theory chapter also has an "In the real world" card and a closing narration step; applied chapters link back to "The physics behind it".

| # | Chapter | Feynman Lectures |
|---|---|---|
| **0** | **Foundations** | |
| 0.1 | Vectors — components, adding, dot and cross products | Vol. I, Ch. 11 |
| 0.2 | Position, Velocity, Acceleration — throws, parabolas, circular motion | Vol. I, Ch. 8 |
| 0.3 | Forces and Newton's Laws — free-body diagrams, a block on a slope, friction | Vol. I, Ch. 12 |
| 0.4 | Energy and Momentum — a half-pipe, colliding carts | Vol. I, Ch. 4 |
| **1** | **Mechanics** | |
| 1.1 | Planetary Motion by Hand | Vol. I, Ch. 9 |
| 1.2 | Orbits in a Gravity Well | Vol. I, Ch. 7 (related) |
| 1.3 | The Principle of Least Action | Vol. II, Ch. 19 |
| 1.4 | The Lorenz Attractor | — |
| 1.5 | *Applied:* Satellites in Orbit — ISS, GPS, geostationary, Kepler's third law | Vol. I, Ch. 7 (related) |
| **2** | **Rotation** | |
| 2.1 | The Spinning Top | Vol. I, Ch. 20 |
| 2.2 | The Tennis-Racket Theorem | Vol. I, Ch. 20 (related) |
| 2.3 | *Applied:* Reaction Wheels — turning a space telescope without fuel | Vol. I, Ch. 20 (related) |
| **3** | **Oscillations** | |
| 3.1 | Resonance | Vol. I, Ch. 23 |
| 3.2 | *Applied:* Tuned Mass Dampers — the Taipei 101 pendulum | Vol. I, Ch. 23 (related) |
| **4** | **Waves & Optics** | |
| 4.1 | Superposition of Waves | Vol. I, Ch. 29 (related) |
| 4.2 | The Principle of Least Time | Vol. I, Ch. 26 |
| 4.3 | *Applied:* Optical Fibers — total internal reflection | Vol. I, Ch. 26 (related) |
| **5** | **Fluids** | |
| 5.1 | The Flow of Dry Water | Vol. II, Ch. 40 |
| 5.2 | The Flow of Wet Water (live Navier–Stokes) | Vol. II, Ch. 41 |
| 5.3 | *Applied:* How a Wing Lifts — Joukowski airfoil, Boeing 737 numbers | Vol. II, Ch. 40 (related) |
| 5.4 | *Applied:* Wind Turbines — the Betz limit | Vol. II, Ch. 40 (related) |
| **6** | **Electromagnetism** | |
| 6.1 | Electric Field Lines | Vol. II, Ch. 4 (related) |
| 6.2 | The Lorentz Force | Vol. II, Ch. 29 (related) |
| 6.3 | Electromagnetic Radiation | Vol. I, Ch. 28 |
| 6.4 | *Applied:* The Electric Generator — Faraday's law, AC and DC | Vol. II, Ch. 17 (related) |
| **7** | **Heat** | |
| 7.1 | The Kinetic Theory of Gases | Vol. I, Ch. 39 |
| 7.2 | *Applied:* The Jet Engine — ideal turbofan, Brayton cycle | Vol. I, Ch. 44 (related) |
| **8** | **Relativity** | |
| 8.1 | Space-Time | Vol. I, Ch. 17 |
| 8.2 | *Applied:* GPS and Relativity — the 38 μs/day clock correction | Vol. I, Ch. 15 (related) |
| **9** | **Quantum** | |
| 9.1 | Electrons Through Two Slits | Vol. III, Ch. 1 |
| 9.2 | *Applied:* Seeing Atoms by Tunneling — the scanning tunneling microscope | Vol. III, Ch. 1 (related) |

## Inside every chapter
Every chapter is a full lesson of 7–9 steps, each tagged by kind: **Setup**, **Concept**, **Derivation**, **Experiment**, **Pitfall**, **Real world** and **Recap**.

- **Step card** (right panel; a bottom sheet on phones) with the step's title, paragraphs, a *Key idea* or *Watch out* box, and *Try it* suggestions for the sliders. Each step can move the camera and set the simulation.
- **Stepper** above the toolbar: jump to any step.
- **What you'll learn**: four goals that tick off as you go.
- **Key facts**: four formulas and numbers worth remembering.
- Level (Beginner / Intermediate / Advanced), reading time and step count.
- Live sliders, live readouts, governing equations and a link to the lecture.
- **Progress**: a chapter is marked ✓ when you reach its last step (saved in your browser).
- **Contents** (`M`) with search (`/` or `Ctrl K`) across titles, lessons and formulas, and a **Cheatsheet** tab with every chapter's key facts.

## Controls
| Action | Input |
|---|---|
| Contents (all chapters by topic) | `M` or the Contents button |
| Search chapters, ideas, formulas | `/` or `Ctrl K` |
| Previous / next chapter | `[` / `]` (or the « » buttons) |
| Jump to a topic | `0` – `9` |
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
Each chapter is a plain object in `index.html` with `params`, `init(ctx)`, `reset(ctx)`, `update(dt, ctx)` and `readouts(ctx)` (optional `ref` for a Feynman lecture link).
Write one and add it to a topic's `chapters` list in `TOPICS`.

Its lesson goes in one of the `js/lessons-*.js` files (also loaded with a `<script>` tag in `index.html`) under the chapter's `id`:

```js
PHX['my-id'] = {level:'Beginner', min:8,
  learn:['…four goals…'], cheat:['…four key facts, $\\LaTeX$ allowed…'],
  steps:[{k:'concept', t:'Title', s:'Short label', b:'Paragraph.\n\nParagraph.',
          tip:['Key idea', '…'], try:['…'], cam:[[x,y,z],[tx,ty,tz]], run:c => c.setParam('key', value, seconds)}]};
```
