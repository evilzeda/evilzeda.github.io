# System Design, step by step

An interactive system design course with 41 lessons in 9 modules, each a step-by-step story told with animated isometric diagrams. It uses Notion's colour palette (light and dark) and is plain HTML/JS with no build step.

- `index.html`: layout and styles
- `js/engine.js`: course catalog, isometric renderer, step player, cheatsheet, progress
- `js/lessons-*.js`: lesson content (one file per module)
- `js/sources.js`: further-reading links for every lesson, plus which steps animate in parallel

Landing page at `#/`. Deep links: `#/load-balancing/5`, `#/cheatsheet`. In each step, numbered arrows play in order and the "What's happening" list narrates them. Keys: ← → step · R replay · Space pause · T theme · Ctrl K search.

Topics follow the curriculum of designed-to-scale.vercel.app by Dilum Sanjaya; all text, diagrams and code here are original.
