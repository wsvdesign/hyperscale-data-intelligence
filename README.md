# Hyperscale Data Intelligence

A research intelligence library on the hyperscale data center services industry. Built as a Pursuit Cycle 2 deliverable by Natalie Walker, Creative Technologist & AI Product Strategist.

---

## What this is

A unified website combining four analytical perspectives on how hyperscale data centers become state-supported developments — who controls the process, how decisions sequence over time, and where growth pressure is emerging fastest.

This is a living research library. The data lives in JSON files. Update the data, push, done.

---

## Five views

| View | File | What it does |
|------|------|--------------|
| Home | `Home.jsx` | Landing page, hypotheses, links to all views |
| Hub & Spoke Intelligence Map | `HubMap.jsx` | 10 sectors, sub-nodes, litigation overlay, side panel |
| Hybrid Intelligence Map | `HybridMap.jsx` | Hub + Control Layers A–H + Cross-Section in one file |
| Linear Development Timeline | `Timeline.jsx` | 11 phases, 6 swimlanes, 4 decision gates |
| Growth Pressure | `GrowthPressure.jsx` | Planned-to-operating ratio chart, 15 states |
| Data Query | `DataQuery.jsx` | Claude-powered plain-English queries against the dataset |

---

## Stack

- **React 18 + Vite** — component structure, routing, build
- **React Router v6** — client-side routing between views
- **HTML Canvas API** — intelligence map and hybrid map visualizations
- **Plain HTML/CSS** — growth pressure chart (no chart library)
- **Anthropic API** — DataQuery component (claude-sonnet-4-6)

---

## Getting started

```bash
git clone https://github.com/YOUR_USERNAME/hyperscale-data-intelligence.git
cd hyperscale-data-intelligence
npm install
cp .env.example .env
# add your Anthropic API key to .env
npm run dev
```

---

## Environment variables

```
VITE_ANTHROPIC_API_KEY=your_key_here
```

Get an API key at https://console.anthropic.com

---

## Data files

All dataset lives in `/src/data/`. Update these JSON files to update the site.

| File | Contents |
|------|----------|
| `states.json` | 15-state dataset: operating, planned, ratio, party lean |
| `sectors.json` | Hub map: 10 sectors with sub-nodes, documents, litigation |
| `layers.json` | Hybrid map: A–H control layers with nodes and why-it-matters |

---

## Design

Dark intelligence dashboard. Do not change fonts, colors, or spacing.
Full design token reference in `HISTORY.md`.

Primary font: Inter  
Monospace: Space Mono  
Background: #06070e  
Text: #dde0f0

---

## Project history

See `HISTORY.md` for the full build history, hypothesis documentation, data sources, identified gaps, and migration notes from the original HTML files.

---

## Data sources

Pew Research Center · IEA · DOE / Lawrence Berkeley Lab · Goldman Sachs · NCSL · Brookings · BLS · EIA · WRI Aqueduct · EPA eGRID · Michigan EGLE · Michigan PSC

Full source list with URLs in `HISTORY.md`.

---

## Next steps

- [ ] Add Good Jobs First subsidy data to `states.json`
- [ ] Add SQL schema for hypothesis testing (Pursuit Cycle 2)
- [ ] Connect EIA API for live energy demand data
- [ ] Add PSC docket references per state
- [ ] Community burden layer with county-level data

---

*Pursuit Cycle 2 — June 2026*
