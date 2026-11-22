# Deal Room: corporate finance, step by step

An interactive course with 35 lessons in 5 modules, covering the core vocabulary of corporate finance and investment banking: the three statements, EV and the EV bridge, FCF, WACC, DCF and terminal value, comps and precedents, M&A (strategics, sponsors, synergies, cash vs stock, accretion/dilution, earnouts, fairness opinions, the football field), LBOs and debt (capital structure, leverage, covenants, return drivers, MOIC/IRR) and capital markets (IPO, greenshoe, converts, auctions, CIM, QoE).

Every lesson follows one fictional company, **Kopi Kita Corp**, and every number on screen is computed live from one shared model in `js/kit.js`, so the DCF, the LBO, the merger model and the football field all agree. All companies, peers and deals are fictional and for illustration only. It shares the engine and look of `../ml-llm` (Notion palette, light and dark) and is plain HTML/JS with no build step.

- `index.html`: layout and styles
- `js/engine.js`: course catalog, 2D scene kit, step player, cheatsheet, progress (forked from `../ml-llm`; progress is stored under `cf-*` keys)
- `js/kit.js`: the live company model (three statements, depreciation walk, DCF, LBO with cash sweep, merger model) plus finance chart helpers (tables, waterfalls, stacks, timelines, football-field ranges)
- `js/lessons-01.js` … `lessons-05.js`: lesson content, one file per module
- `js/sources.js`: standards, textbooks, practitioner guides and explainers for every lesson

Modules: 01 Accounting & Statements · 02 Core Valuation & Modeling · 03 Mergers & Acquisitions · 04 Leveraged Buyouts & Debt · 05 Capital Markets & Deal Process.

Landing page at `#/`. Deep links: `#/dcf/3`, `#/cheatsheet`. Keys: ← → step · R replay · Space pause · T theme · Ctrl K search.
