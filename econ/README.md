# Money Machine: how the economy works, step by step

An interactive course with 42 lessons in 6 modules, inspired by Ray Dalio's 30-minute video *How the Economic Machine Works*, and expanded with money supply, banking, bonds, the yield curve, the Taylor rule and more.

Every lesson follows one fictional island economy, **Nusa** (Sari's coffee stall, Budi the rice farmer, Bank Nusa and the Central Bank of Nusa), and every chart is computed live from a few small, transparent models in `js/kit.js`, so the short cycle, the long cycle and the deleveraging all agree. The models are teaching toys, not forecasts. It shares the engine and look of `../corpfin` and `../ml-llm` (Notion palette, light and dark) and is plain HTML/JS with no build step.

- `index.html`: layout and styles
- `js/engine.js`: course catalog, 2D scene kit, step player, cheatsheet, progress (progress is stored under `mm-*` keys)
- `js/kit.js`: the economy models (`forces`, `machine` long-term debt cycle, `cbStep` quarterly short cycle + Taylor rule, `delev` four-lever deleveraging, plus `loan`, `bond`, `banks`) and chart helpers
- `js/lessons-01.js` … `lessons-06.js`: lesson content, one file per module
- `js/sources.js`: Dalio video timestamps, central-bank explainers, classic papers and FRED data series for every lesson
- `js/lab.js`: the Machine Lab: *Be the central bank*, *Deleveraging mixer*, *Long-cycle builder*

Modules: 01 Transactions, Markets & Government · 02 Credit, Loans & Interest · 03 Money, Banks & Money Supply · 04 Interest Rates & the Central Bank · 05 Core Forces & Cycles · 06 Deleveraging & Policy Levers.

Landing page at `#/`. Deep links: `#/long-cycle/2`, `#/lab/delev`, `#/cheatsheet`. Keys: ← → step · R replay · Space pause · T theme · Ctrl K search.
