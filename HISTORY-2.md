# Hyperscale Data Intelligence — Project History

**Repository:** hyperscale-data-intelligence  
**Collaborator:** Natalie (Creative Technologist & AI Product Strategist, Pursuit Fellow L2)  
**Built with:** Claude Sonnet (Anthropic)  
**Period:** June 2026  

---

## What this project is

A research intelligence library on the hyperscale data center services industry, built as a Pursuit Cycle 2 deliverable. The project combines systems relationship mapping, control structure analysis, development sequence tracing, and quantitative growth pressure analysis into a single unified website.

The site is a living library — not a one-time deliverable. As new data emerges (state PSC filings, incentive agreements, community impact reports), the JSON data files are updated and pushed. The Claude-powered query interface allows plain-English questions against the dataset.

---

## Origin

Started as a Pursuit Cycle 2 hypothesis-first dataset analysis assignment. The industry chosen was hyperscale data center services — selected because of 28.9% revenue growth (highest on the initial shortlist) and because the data infrastructure behind AI demand was the most consequential and least publicly understood sector in the cohort's shortlist.

---

## Three hypotheses (written before opening the dataset)

**Hypothesis 1**  
Virginia has a disproportionate share of planned facilities relative to its already-dominant operating count, because the Northern Virginia market is so infrastructure-dense that new entrants are still targeting it despite saturation — meaning the concentration is compounding, not spreading.

**Hypothesis 2**  
Republican-leaning states in the top 15 have more planned facilities as a percentage of their total than Democrat-leaning states, because lower regulatory friction, cheaper land, and aggressive tax incentive packages are pulling future development toward those markets faster than existing tech-infrastructure states.

**Hypothesis 3** *(tested in the Growth Pressure view)*  
The planned-to-operating ratio is a better predictor of where grid stress and community conflict will emerge in the next five years than total facility count, because it is the planned pipeline — not the established base — that reveals where the next round of land, water, and utility fights will happen.

---

## What was built — full deliverable history

### Phase 1 — Research dashboard

**File:** `hyperscale_data_center_map.html`

An interactive data dashboard built from a uploaded research document. Contains:
- State-by-state data table (top 15 markets) with party filter and sort by total/operating/planned
- Bar chart visualization of state data
- Dataset matrix (15 data categories with source, why it matters, transparency tag)
- Employment and salary data by role
- State incentive types (9 incentive categories with benefit and risk analysis)
- Community burden framework
- Environmental justice data tracking
- Public-benefit test checklist
- 19 source links

### Phase 2 — Hub & Spoke Intelligence Map

**File:** `hyperscale_intelligence_map.html`

Canvas-based interactive intelligence map. Dark background (#07080f). Hub node pulses at center. Ten sectors radiate outward on a 200px orbit:

1. Developer / Hyperscaler (#6c8ebf)
2. State Government (#7cb87c)
3. Local Government (#b87c6c)
4. Landowners / Community (#c4a84f)
5. Electric Utility / Grid (#8c6cb8)
6. Water & Sewer (#4fa8b8)
7. Environmental Regulators (#4fb87c)
8. Financial Institutions (#b84f8c)
9. Contractors / Infrastructure (#b8874f)
10. Courts & Admin Review (#bf6c6c)

Click any sector → expands 4 sub-nodes + side panel opens with full intelligence brief:
- What it controls
- What it wants
- What it provides
- What it receives
- Transparency classification (CONFIDENTIAL / PUBLIC / PRIVATE / PARTIALLY DISCLOSED)
- Risk tags
- Key documents
- Litigation exposure
- Public-interest questions

Litigation overlay toggle: red dashed lines across the system showing where legal challenges intersect.

Pan by drag. Zoom by scroll. Reset button. Hint fades after 5 seconds.

**Key content per sector** (abbreviated):

- **Developer**: Shell LLCs, site consultants, RE developer, hyperscaler identity concealment
- **State**: Governor's office NDA, econ dev agency, tax department, legislature
- **Local**: City/county board, planning commission, building dept, township
- **Landowners**: Farmer/landowner, community groups, water rights, deed restrictions
- **Electric**: Utility, grid operator (PJM/MISO), PSC, substation/transmission
- **Water**: Municipal water authority, potable water, reclaimed water, groundwater withdrawal
- **Environmental**: State env agency, EPA/federal, generator emissions, wetlands/streams
- **Financial**: Institutional lenders, private equity/REIT, public authority, tax credits/bonds
- **Contractors**: General contractor, fiber/roads, cooling systems, security/fencing
- **Courts**: State courts, admin appeals, FOIA/public records, injunction/delay

**Litigation overlay connections:**
dev→courts, state→courts, local→courts, land→courts, elec→courts, water→courts, env→courts, fin→courts, dev→land, dev→state, local→land, elec→state, water→env, env→local

### Phase 3 — Hybrid Intelligence Map

**File:** `hyperscale_hybrid_map.html`

Three views in one file, switchable via toolbar:

**View 1 — Hub & Spoke**  
Identical canvas logic to the standalone intelligence map. Mode indicator strip: blue (rgba(108,142,191,.5)).

**View 2 — Control Layers A–H**  
Pure HTML scrollable document — completely different visual from the canvas views. Eight colored layer cards stacked vertically with spine letters down the left side and downward connector arrows between layers. Click any card to expand its node inventory and a "why it matters" explanation.

Layer structure:
- **A** Strategic Intent (#5a8abd) — actors: dev
- **B** Political & Economic Recruitment (#6aaa6a) — actors: state
- **C** Land Control (#b8a048) — actors: land
- **D** Utility Dependency (#7a5aaa) — actors: elec, water, infra
- **E** Regulatory Authorization (#4aaa70) — actors: local, env
- **F** Financial & Contractual Structure (#aa4a80) — actors: fin, state
- **G** Public Consequences (#aa8040) — actors: land
- **H** Legal Challenge & Accountability (#aa5050) — actors: courts

Mode indicator strip: green (rgba(106,170,106,.5)).

**View 3 — Cross-Section**  
Hub-and-spoke canvas returns but every sector node has a small colored letter badge (A–H) showing its primary layer. Click any sector → panel shows all layer connections with specific mechanism for each. Dashed arc lines radiate from active sector showing layer connections visually. Mode indicator strip: amber (rgba(255,195,60,.4)).

**Shared features across all three views:**
- Litigation toggle (red dashed lines)
- Reset button
- Zoom +/− buttons (hidden in layers view)
- Side panel (420px, slides in from right)
- Pan by drag on canvas views

**Technical note:** Built using HTML Canvas API with `requestAnimationFrame` loop. No template literals in script (uses string concatenation throughout) to prevent truncation errors. Braces verified balanced (185 open, 185 close). All functions verified present: buildLayers, setMode, openHub, openSec, openSub, openCross, openLayer, drawCV, wire, loop.

### Phase 4 — Linear Development & Approval Timeline

**File:** `hyperscale_linear_timeline.html`

Horizontal scroll timeline across 11 phases with 6 parallel swimlanes. Fixed rail on the left keeps track labels anchored. Progress bar under toolbar. Font: Space Mono (headers) + Inter (body).

**11 phases:**
1. Market Demand
2. Confidential State Recruitment ◇ Gate: State Selected
3. Land Control
4. Incentive Negotiation ◇ Gate: Incentive Approved
5. Utility Feasibility ◇ Gate: Utility Capacity Confirmed
6. Zoning & Local Approval ◇ Gate: Zoning Granted
7. Environmental Permitting
8. Construction ◇ Gate: Certificate of Occupancy
9. Operation
10. Expansion
11. Decommission / Repurpose

**Six swimlanes:**
- Main Flow (--c-main: #c8d0f0)
- Land Track (--c-land: #c4a84f)
- Utility Track (--c-util: #8c6cb8)
- Regulatory Track (--c-reg: #4fb87c)
- Financial Track (--c-fin: #b84f8c)
- Litigation Exposure (--c-lit: #e04040)

Click any cell → full intelligence brief for that phase + track (actors, documents, transparency, risks, litigation, public-interest questions). Click any gate diamond → outcomes and what must be true to pass. Click rail label → dims all other tracks, follow one thread through full lifecycle. Litigation toggle adds diagonal stripe pattern and ⚠ LIT badges to cells with exposure. Drag to scroll. Track-btns div is populated by JavaScript.

### Phase 5 — Growth Pressure Chart

**File:** `hyperscale_growth_pressure.html`

**Core hypothesis tested:** Planned-to-operating ratio reveals where infrastructure pressure emerges next, not total facility count.

**Chart:** Horizontal bar chart, ranked highest to lowest ratio. Pure HTML/CSS/JS — no chart library.

**Data (15 states, planned ÷ operating):**

| State | Operating | Planned | Ratio |
|-------|----------:|--------:|------:|
| Georgia | 94 | 141 | 1.50 |
| Indiana | 38 | 54 | 1.42 |
| Illinois | 139 | 123 | 0.88 |
| Arizona | 98 | 86 | 0.88 |
| Virginia | 398 | 287 | 0.72 |
| Pennsylvania | 78 | 51 | 0.65 |
| Iowa | 64 | 41 | 0.64 |
| Texas | 296 | 170 | 0.57 |
| North Carolina | 72 | 41 | 0.57 |
| Ohio | 166 | 57 | 0.34 |
| Oregon | 115 | 27 | 0.23 |
| California | 277 | 54 | 0.19 |
| Washington | 124 | 11 | 0.09 |
| Florida | 120 | 8 | 0.07 |
| New York | 148 | 6 | 0.04 |

Georgia and Indiana bars: amber gradient (#b8860b → #e8c060) — ratio exceeds 1.0.  
All other bars: navy (#2a4a7a).  
Reference line at 1.0 labeled "More planned than operating" — dashed white.  
Hover/tap tooltip shows: state, operating, planned, total, planned share %, ratio.  
Tooltip repositions to stay in viewport.  
Scale max: 1.65.  
X-axis ticks: 0, 0.4, 0.8, 1.2, 1.6.

### Phase 6 — Portal / Landing Page

**File:** `index.html`

Landing page introducing the full system. Contains:
- Project title and two-paragraph introduction
- Four view cards (one per visualization) with color accent bars
- All three hypotheses displayed
- Consistent dark dashboard styling

### Navigation system (added across all five files)

Shared CSS class `.site-nav` with `.sn` links. Responsive at 780px (smaller text/padding) and 520px (icon-only, labels hidden). Each file has its own active link highlighted. Nav is positioned:
- Outside `.mg` container on hybrid map
- Outside `#track-btns` container on timeline
- After map-specific controls (mode buttons, litigation toggle, zoom, reset) in all cases

---

## Key technical decisions

**Canvas API over SVG or D3** — chosen for the intelligence maps because it handles the animation loop (pulsing hub, hover states) cleanly without DOM overhead.

**No template literals in canvas files** — template literal truncation caused repeated file corruption. All panel HTML uses string concatenation.

**No chart library for Growth Pressure** — pure HTML/CSS bars are more reliable in a standalone file context than CDN-dependent Chart.js.

**No Supabase / no external database** — data lives in JSON files in the repo. Update the JSON, push, done.

**React + Vite migration** — converting all five HTML files into components. Data moves to `/src/data/*.json`. Canvas logic moves to React refs and useEffect hooks.

---

## Data sources

| Source | URL |
|--------|-----|
| IEA — Energy demand from AI | https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai |
| DOE — Electricity demand from data centers | https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers |
| Lawrence Berkeley Lab — 2024 Data Center Energy Usage | https://eta-publications.lbl.gov/publications/2024-united-states-data-center-energy |
| Goldman Sachs — 165% power demand increase by 2030 | https://www.goldmansachs.com/insights/articles/ai-to-drive-165-increase-in-data-center-power-demand-by-2030 |
| Pew Research Center — Most new data centers in rural areas | https://www.pewresearch.org/short-reads/2026/04/13/most-new-data-centers-in-the-us-are-coming-to-rural-areas/ |
| NCSL — Subsidizing Servers | https://www.ncsl.org/fiscal/subsidizing-servers-how-states-are-competing-to-attract-data-centers |
| Brookings — Data center employment effects | https://www.brookings.edu/articles/new-evidence-on-data-center-employment-effects/ |
| BLS — Computer Network Support Specialists | https://www.bls.gov/ooh/computer-and-information-technology/computer-support-specialists.htm |
| BLS — Electrical Power-Line Installers | https://www.bls.gov/ooh/installation-maintenance-and-repair/line-installers-and-repairers.htm |
| EIA Open Data | https://www.eia.gov/opendata/ |
| WRI Aqueduct (water stress) | https://www.wri.org/aqueduct |
| EPA eGRID | https://www.epa.gov/egrid |
| EPA — Clean Air Act data center resource | https://www.epa.gov/newsreleases/epa-unveils-clean-air-act-related-resource-provide-transparency-data-center-developers |
| EPA — Water-related permits for data centers | https://www.epa.gov/watersense/water-related-permits-data-centers |
| NOAA Climate Data Online | https://www.ncei.noaa.gov/cdo-web/ |
| Microsoft — Hydrogen fuel cells for data centers | https://news.microsoft.com/source/features/sustainability/hydrogen-fuel-cells-could-provide-emission-free-backup-power-at-datacenters-microsoft-says/ |
| Michigan EGLE — Water Use Program | https://www.michigan.gov/egle/about/organization/geologic-resources-management/water-use |
| Michigan PSC — Consumers Energy data center terms | https://www.michigan.gov/mpsc/commission/news-releases/2025/11/06/mpsc-approves-terms-of-service-between-consumers-energy-and-data-centers |

---

## Qualitative datasets identified (not yet in the site)

- **Good Jobs First Subsidy Tracker** — incentive amounts by company, state, project. No API; CSV download. Directly tests Hypothesis 2.
- **State PSC dockets** — utility rate case filings, consumer advocate testimony, commission orders. Public but manual download per state.
- **County planning commission minutes** — Loudoun VA, Prince William VA, Douglas GA, Hendricks IN are the priority counties.
- **Deed restriction litigation records** — Taylor TX and Prince William County Rural Crescent cases are public court documents.
- **EPA air permit public comment records** — generator aggregation question evidence.
- **Army Corps Section 404 wetlands permit files** — public comment records.
- **State legislative hearing transcripts** — Illinois, Virginia data center tax incentive bills.
- **Congressional testimony** — Senate Energy Committee hearings on AI infrastructure and energy demand, 2024–2025.

---

## Gaps identified (where new data collection should focus)

1. **Water disclosure** — facility-level water use is aggregated into municipal totals; no public data at the project level in most states.
2. **Ratepayer exposure** — infrastructure cost allocation buried in PSC dockets; not consolidated anywhere.
3. **Community burden** — noise complaints, generator testing records, and groundwater monitoring data exist at county level but are not aggregated.
4. **Permanent job delivery vs. promise** — incentive agreements contain job pledges; actual delivered job counts are in annual compliance reports that are rarely public in full.
5. **Clawback enforcement** — whether clawback provisions are actually triggered and recovered is not tracked by any public database.

---

## React + Vite migration plan

**Repository:** `hyperscale-data-intelligence`

```
hyperscale-data-intelligence/
├── index.html
├── vite.config.js
├── package.json
├── .env                          ← VITE_ANTHROPIC_API_KEY (gitignored)
├── .gitignore
├── README.md
├── HISTORY.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles/
    │   └── global.css
    ├── data/
    │   ├── states.json           ← 15-state dataset
    │   ├── sectors.json          ← hub map sector + subnode data
    │   └── layers.json           ← A-H control layer data
    └── components/
        ├── Nav.jsx               ← shared navigation
        ├── Home.jsx              ← index landing page
        ├── HubMap.jsx            ← canvas intelligence map
        ├── HybridMap.jsx         ← three-view hybrid map
        ├── Timeline.jsx          ← linear development timeline
        ├── GrowthPressure.jsx    ← planned/operating ratio chart
        └── DataQuery.jsx         ← Claude-powered query interface
```

**Routing:** React Router v6. Each component is a route.  
**Canvas components:** useRef for canvas element, useEffect for draw loop, cleanup on unmount.  
**Data:** imported directly from JSON files, passed as props or accessed via context.  
**Claude query interface:** fetch to Anthropic /v1/messages, API key from import.meta.env.VITE_ANTHROPIC_API_KEY, dataset injected into system prompt as JSON.  
**No design changes:** all colors, fonts, spacing, interactions preserved exactly.

---

## Design tokens (do not change)

```css
--bg: #06070e
--bg2: #0a0c18
--bg3: #0d1020
--text: #dde0f0
--text2: #6a6e90
--text3: #2e3050
--border: rgba(255,255,255,0.07)
--mono: 'Space Mono', monospace
--sans: 'Inter', -apple-system, sans-serif
```

Toolbar height: 50–52px fixed. Side panel: 420px, slides from right. Canvas background: #07080f.

Sector colors:
- dev: #6c8ebf
- state: #7cb87c
- local: #b87c6c
- land: #c4a84f
- elec: #8c6cb8
- water: #4fa8b8
- env: #4fb87c
- fin: #b84f8c
- infra: #b8874f
- courts: #bf6c6c

Layer colors:
- A: #5a8abd
- B: #6aaa6a
- C: #b8a048
- D: #7a5aaa
- E: #4aaa70
- F: #aa4a80
- G: #aa8040
- H: #aa5050

Timeline track colors:
- main: #c8d0f0
- land: #c4a84f
- util: #8c6cb8
- reg: #4fb87c
- fin: #b84f8c
- lit: #e04040
- gate: #e8c060
