# Beyond Curve

ML & LLM step by step.

An interactive course with 42 lessons in 9 modules, from linear regression to attention, transformers, context windows, RAG and agents. Every lesson is a step-by-step story told with animated SVG diagrams, and every lesson links to the original papers and the best explainers for the full reading. It shares the look of `../sysdesign` (Notion palette, light and dark) and is plain HTML/JS with no build step.

- `index.html`: layout and styles
- `js/engine.js`: course catalog, 2D scene kit (plots, boxes, arrows, heatmaps, token chips, networks), step player, cheatsheet, progress
- `js/lessons-01.js` … `lessons-09.js`: lesson content, one file per module. Most visuals are computed live (k-means, CART, gradient boosting, EM, PCA, value iteration, BPE merges…)
- `js/sources.js`: papers and further reading for every lesson

Modules: 01 Foundations · 02 Supervised Learning · 03 Trees & Ensembles · 04 Unsupervised Learning · 05 Neural Networks · 06 Beyond Labels (RL, VAEs, GANs & diffusion, Kalman filter) · 07 How LLMs Read (tokens, embeddings, attention, multi-head, RoPE) · 08 Inside the Transformer (block, GPT decoding, sampling, context window & KV cache, scaling laws) · 09 Making LLMs Useful (pretraining, RLHF, LoRA & quantisation, RAG, agents).

Landing page at `#/`. Deep links: `#/attention/3`, `#/cheatsheet`. Keys: ← → step · R replay · Space pause · T theme · Ctrl K search.
