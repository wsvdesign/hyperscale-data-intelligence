/**
 * DataQuery.jsx
 * Real SQL queries against an in-memory SQLite database (sql.js)
 * Three tables: states, sectors, layers
 * State Inquiry tab: plain-English questions via Anthropic API + web search
 */

import { useState, useEffect, useRef } from 'react'
import initSqlJs from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import Nav from './Nav'

// ── DATA ─────────────────────────────────────────────────────────────────────

const STATES = [
  { state:'Georgia',        operating:94,  planned:141, ratio:1.50, party:'Republican' },
  { state:'Indiana',        operating:38,  planned:54,  ratio:1.42, party:'Republican' },
  { state:'Illinois',       operating:139, planned:123, ratio:0.88, party:'Democrat'   },
  { state:'Arizona',        operating:98,  planned:86,  ratio:0.88, party:'Republican' },
  { state:'Virginia',       operating:398, planned:287, ratio:0.72, party:'Democrat'   },
  { state:'Pennsylvania',   operating:78,  planned:51,  ratio:0.65, party:'Republican' },
  { state:'Iowa',           operating:64,  planned:41,  ratio:0.64, party:'Republican' },
  { state:'Texas',          operating:296, planned:170, ratio:0.57, party:'Republican' },
  { state:'North Carolina', operating:72,  planned:41,  ratio:0.57, party:'Republican' },
  { state:'Ohio',           operating:166, planned:57,  ratio:0.34, party:'Republican' },
  { state:'Oregon',         operating:115, planned:27,  ratio:0.23, party:'Democrat'   },
  { state:'California',     operating:277, planned:54,  ratio:0.19, party:'Democrat'   },
  { state:'Washington',     operating:124, planned:11,  ratio:0.09, party:'Democrat'   },
  { state:'Florida',        operating:120, planned:8,   ratio:0.07, party:'Republican' },
  { state:'New York',       operating:148, planned:6,   ratio:0.04, party:'Democrat'   },
]

const SECTORS = [
  { id:'dev',    label:'Developer / Hyperscaler',      color:'#6c8ebf', primary_layer:'A' },
  { id:'state',  label:'State Government',             color:'#7cb87c', primary_layer:'B' },
  { id:'local',  label:'Local Government',             color:'#b87c6c', primary_layer:'E' },
  { id:'land',   label:'Landowners / Community',       color:'#c4a84f', primary_layer:'C' },
  { id:'elec',   label:'Electric Utility / Grid',      color:'#8c6cb8', primary_layer:'D' },
  { id:'water',  label:'Water & Sewer',                color:'#4fa8b8', primary_layer:'D' },
  { id:'env',    label:'Environmental Regulators',     color:'#4fb87c', primary_layer:'E' },
  { id:'fin',    label:'Financial Institutions',       color:'#b84f8c', primary_layer:'F' },
  { id:'infra',  label:'Contractors / Infrastructure', color:'#b8874f', primary_layer:'D' },
  { id:'courts', label:'Courts & Admin Review',        color:'#bf6c6c', primary_layer:'H' },
]

const LAYERS = [
  { id:'A', label:'Strategic Intent',                  color:'#5a8abd', actor_count:1 },
  { id:'B', label:'Political & Economic Recruitment',  color:'#6aaa6a', actor_count:1 },
  { id:'C', label:'Land Control',                      color:'#b8a048', actor_count:1 },
  { id:'D', label:'Utility Dependency',                color:'#7a5aaa', actor_count:3 },
  { id:'E', label:'Regulatory Authorization',          color:'#4aaa70', actor_count:2 },
  { id:'F', label:'Financial & Contractual Structure', color:'#aa4a80', actor_count:2 },
  { id:'G', label:'Public Consequences',               color:'#aa8040', actor_count:1 },
  { id:'H', label:'Legal Challenge & Accountability',  color:'#aa5050', actor_count:1 },
]

// ── STARTER QUERIES ───────────────────────────────────────────────────────────

const HYPOTHESIS_QUERIES = [
  {
    label: 'H1 — Virginia concentration',
    sql: `-- Hypothesis 1: Is Virginia's planned share disproportionate?
SELECT
  state,
  operating,
  planned,
  operating + planned AS total,
  ROUND(CAST(planned AS FLOAT) / (operating + planned) * 100, 1) AS planned_pct,
  ROUND(ratio, 2) AS ratio
FROM states
ORDER BY operating DESC;`
  },
  {
    label: 'H2 — Party vs growth rate',
    sql: `-- Hypothesis 2: Do Republican states have higher planned ratios?
SELECT
  party,
  COUNT(*) AS state_count,
  ROUND(AVG(ratio), 3) AS avg_ratio,
  ROUND(AVG(planned), 1) AS avg_planned,
  ROUND(AVG(operating), 1) AS avg_operating,
  SUM(planned) AS total_planned,
  SUM(operating) AS total_operating
FROM states
GROUP BY party
ORDER BY avg_ratio DESC;`
  },
  {
    label: 'H3 — Ratio vs total count',
    sql: `-- Hypothesis 3: Does ratio predict pressure better than total count?
SELECT
  state,
  operating + planned AS total_facilities,
  ROUND(ratio, 2) AS planned_to_operating_ratio,
  CASE
    WHEN ratio >= 1.0 THEN 'HIGH PRESSURE'
    WHEN ratio >= 0.6 THEN 'MODERATE'
    WHEN ratio >= 0.3 THEN 'LOW'
    ELSE 'ESTABLISHED'
  END AS pressure_tier,
  party
FROM states
ORDER BY ratio DESC;`
  },
]

const STARTER_QUERIES = [
  {
    label: 'States above 1.0 ratio',
    color: '#6c8ebf',
    sql: `SELECT state, operating, planned, ratio, party
FROM states
WHERE ratio >= 1.0
ORDER BY ratio DESC;`
  },
  {
    label: 'All states ranked',
    color: '#7cb87c',
    sql: `SELECT
  ROW_NUMBER() OVER (ORDER BY ratio DESC) AS rank,
  state,
  operating,
  planned,
  ROUND(ratio, 2) AS ratio,
  party
FROM states
ORDER BY ratio DESC;`
  },
  {
    label: 'Layer actor count',
    color: '#7a5aaa',
    sql: `SELECT id, label, actor_count
FROM layers
ORDER BY id;`
  },
  {
    label: 'Sectors by layer',
    color: '#b8a048',
    sql: `SELECT
  s.id,
  s.label,
  s.primary_layer,
  l.label AS layer_name
FROM sectors s
JOIN layers l ON s.primary_layer = l.id
ORDER BY s.primary_layer, s.id;`
  },
  {
    label: 'Employment impact by state',
    color: '#4aaa70',
    sql: `-- Employment pressure: planned facilities × avg construction jobs estimate
SELECT
  state,
  planned,
  operating,
  ROUND(ratio, 2) AS ratio,
  planned * 500 AS est_construction_jobs,
  planned * 50  AS est_permanent_jobs,
  party
FROM states
ORDER BY planned DESC;`
  },
  {
    label: 'Water stress / high-growth',
    color: '#4fa8b8',
    sql: `-- High-ratio states with Republican lean (lower regulatory friction)
SELECT
  state,
  ROUND(ratio, 2) AS ratio,
  planned,
  operating,
  party
FROM states
WHERE ratio >= 0.6
ORDER BY ratio DESC;`
  },
  {
    label: 'Community displacement risk',
    color: '#b87c6c',
    sql: `-- States where planned exceeds operating by largest absolute margin
SELECT
  state,
  planned,
  operating,
  planned - operating AS net_new_planned,
  ROUND(ratio, 2) AS ratio,
  CASE
    WHEN planned - operating > 100 THEN 'EXTREME'
    WHEN planned - operating > 50  THEN 'HIGH'
    WHEN planned - operating > 20  THEN 'MODERATE'
    ELSE 'LOW'
  END AS displacement_risk
FROM states
ORDER BY net_new_planned DESC;`
  },
  {
    label: 'Sector power concentration',
    color: '#aa4a80',
    sql: `-- Which decision layers have the most actors (bottleneck risk)
SELECT
  l.id,
  l.label,
  l.actor_count,
  CASE
    WHEN l.actor_count >= 3 THEN 'HIGH CONCENTRATION'
    WHEN l.actor_count = 2  THEN 'MODERATE'
    ELSE 'SINGLE ACTOR'
  END AS power_structure
FROM layers l
ORDER BY l.actor_count DESC, l.id;`
  },
  {
    label: 'Pressure tier distribution',
    color: '#aa5050',
    sql: `-- Count of states in each pressure tier
SELECT
  CASE
    WHEN ratio >= 1.0 THEN 'HIGH PRESSURE'
    WHEN ratio >= 0.6 THEN 'MODERATE'
    WHEN ratio >= 0.3 THEN 'LOW'
    ELSE 'ESTABLISHED'
  END AS pressure_tier,
  COUNT(*) AS state_count,
  ROUND(AVG(ratio), 3) AS avg_ratio
FROM states
GROUP BY pressure_tier
ORDER BY avg_ratio DESC;`
  },
  {
    label: 'H4 - Incentive-to-jobs ratio',
    sql: `-- Hypothesis 4 (Andres): Are states getting enough permanent jobs per incentive dollar?
SELECT state, planned, operating, ROUND(ratio, 2) AS ratio, planned * 50 AS est_permanent_jobs, party FROM states ORDER BY planned DESC;`
  },
  {
    label: 'H5 - Water stress correlation',
    sql: `-- Hypothesis 5 (Andres): Does water stress influence data center location?
-- Finding: r = 0.098, water stress is noise in location decisions
SELECT state, ROUND(ratio, 2) AS growth_ratio, planned, party, CASE WHEN state IN ('Arizona','California','Texas','Colorado') THEN 'HIGH WATER STRESS' WHEN state IN ('Washington','Oregon','Iowa','Pennsylvania') THEN 'LOW WATER STRESS' ELSE 'MODERATE WATER STRESS' END AS water_stress_tier FROM states ORDER BY ratio DESC;`
  },
  {
    label: 'H6 - Virginia plateau',
    sql: `-- Hypothesis 6 (Andres): Is Virginia plateauing vs Georgia and Indiana?
-- Finding: ratio lower but absolute pipeline still largest at 287 planned
SELECT state, operating, planned, operating + planned AS total_facilities, ROUND(ratio, 2) AS ratio, CASE WHEN state = 'Virginia' THEN 'DOMINANT - slowing ratio' WHEN ratio >= 1.0 THEN 'SURGING - fastest relative growth' WHEN ratio >= 0.6 THEN 'GROWING' ELSE 'ESTABLISHED' END AS market_status FROM states WHERE state IN ('Virginia','Georgia','Indiana','Texas','California') ORDER BY planned DESC;`
  }
]

// ── SCHEMA DISPLAY ────────────────────────────────────────────────────────────

const SCHEMA = [
  {
    table: 'states',
    color: '#6c8ebf',
    cols: [
      { name: 'state',     type: 'TEXT', note: 'primary key' },
      { name: 'operating', type: 'INT',  note: 'currently operating' },
      { name: 'planned',   type: 'INT',  note: 'planned facilities' },
      { name: 'ratio',     type: 'REAL', note: 'planned ÷ operating' },
      { name: 'party',     type: 'TEXT', note: 'Republican | Democrat' },
    ]
  },
  {
    table: 'sectors',
    color: '#4fb87c',
    cols: [
      { name: 'id',            type: 'TEXT', note: 'primary key' },
      { name: 'label',         type: 'TEXT', note: 'display name' },
      { name: 'color',         type: 'TEXT', note: 'hex color' },
      { name: 'primary_layer', type: 'TEXT', note: 'FK → layers.id' },
    ]
  },
  {
    table: 'layers',
    color: '#b8a048',
    cols: [
      { name: 'id',          type: 'TEXT', note: 'A–H' },
      { name: 'label',       type: 'TEXT', note: 'layer name' },
      { name: 'color',       type: 'TEXT', note: 'hex color' },
      { name: 'actor_count', type: 'INT',  note: 'sectors in layer' },
    ]
  },
]

// ── STATE INQUIRY DATA ────────────────────────────────────────────────────────

const STATE_DATA = {
  Georgia: { operating: 94, planned: 141, ratio: '1.50' },
  Indiana: { operating: 38, planned: 54,  ratio: '1.42' },
}

const SYSTEM_PROMPT = `You are the research assistant for the Hyperscale Data Center Intelligence System, a public-interest platform mapping hyperscale data center development in the United States.

SCOPE: Answer questions about all 15 states in this dataset. Provide full in-depth inquiry for Georgia and Indiana only. For other states, provide statistical context. Never refuse a question.

RESPONSE FORMAT - YOU MUST FOLLOW THIS EXACTLY. Use bold subject headers and bullet points. Structure every answer as a formal research report with these exact sections:

## Overview
2-3 sentences directly answering the question with the most important finding stated first.

## Key Actors and Decision Layers
- List which of the ten actors are most relevant and explain each one role in one sentence
- Developer/Hyperscaler controls site selection and NDA negotiations at Layer A
- State Government manages incentive packages at Layer B
- Local Government controls zoning permits and public hearings at Layer E
- Electric Utility controls grid interconnection capacity at Layer D
- Courts and PSC handle all legal challenges at Layer H

## Current Status and Timeline
- Cover publicly known permit status utility interconnection filings and legislative activity
- Cite the source for every specific fact
- If a fact is unknown say so and explain exactly where to search for it

## Community and Policy Impact
- Property tax implications for the county and school district
- Displacement and land acquisition risk using shell LLC patterns
- Ratepayer cost shifts from grid infrastructure upgrades
- Water stress and consumption projections
- Employment reality: average incentive cost is $166K per permanent job against $61K median salary

## What To Do Next
- Specific agency to contact with the agency name and what to request
- Which database to search: Good Jobs First, FERC queue, SEC EDGAR, state PSC docket
- Which document to FOIA and from which county or state office
- Whether a public comment period is currently open and how to submit

## Helpful Resources
List every real link retrieved through web search with source name and URL.

SOURCES TO ALWAYS SEARCH: Georgia General Assembly at legis.ga.gov, Indiana General Assembly at iga.in.gov, state Public Service Commission dockets, FERC interconnection queue at ferc.gov, PJM and MISO capacity requests, state circuit court filings, Good Jobs First at goodjobsfirst.org, SEC EDGAR for hyperscaler 10-K filings, county assessor and recorder databases, Secretary of State LLC registration search, city and county council meeting minutes, planning commission hearing records, zoning board decisions, state lobbying registration databases, Data Center Dynamics at datacenterdynamics.com.

TONE: Authoritative specific and actionable. Every bullet point must contain a real specific usable piece of information. NEVER use markdown tables with pipe characters. NEVER use --- dividers. Only use ## headers, ### subheaders, and - bullet points.

END every response with:
RESOURCES_JSON:[{"title":"...","url":"..."},{"title":"...","url":"..."}]`

// ── STYLES ────────────────────────────────────────────────────────────────────

const makeStyles = (isLight) => ({
  page: {
    '--bg': isLight ? '#f3f6fb' : '#07080f',
    '--text': isLight ? '#0f172a' : '#e8e9f0',
    '--text2': isLight ? '#334155' : '#b3bdd8',
    '--text3': isLight ? '#64748b' : '#8792b3',
    '--text4': isLight ? '#94a3b8' : '#5a5e78',
    '--border': isLight ? 'rgba(15,23,42,0.14)' : 'rgba(255,255,255,0.07)',
    '--border2': isLight ? 'rgba(15,23,42,0.22)' : 'rgba(255,255,255,0.12)',
    '--surface': isLight ? '#e8edf5' : '#0d1020',
    '--surface2': isLight ? '#dce3ef' : '#050608',
    '--gold': isLight ? '#7A5C00' : '#C8A020',
    '--green': isLight ? '#1a7a3c' : '#3FBF6A',
    '--blue': isLight ? '#3a6a9f' : '#6c8ebf',
    '--warm': '#faf0d7',
    position:'fixed', inset:0,
    display:'flex', flexDirection:'column',
    background: isLight ? '#f3f6fb' : '#07080f',
    color: isLight ? '#0f172a' : '#e8e9f0',
    fontFamily:"'Inter',-apple-system,sans-serif",
    overflow:'hidden',
  },
  body: { flex:1, display:'flex', overflow:'hidden' },
  left: {
    width:'260px', flexShrink:0,
    background:'var(--surface)',
    borderRight:'1px solid var(--border)',
    display:'flex', flexDirection:'column', overflow:'hidden',
  },
  leftHead: {
    padding:'12px 14px 8px',
    borderBottom:'1px solid var(--border)',
    flexShrink:0,
  },
  lbl: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.10em', textTransform:'uppercase',
    color:'var(--text3)', display:'block', marginBottom:'2px',
  },
  lsub: { fontSize:'12px', color:'var(--text3)' },
  leftScroll: { flex:1, overflowY:'auto', padding:'10px 12px' },
  schemaTable: { marginBottom:'12px' },
  schemaTableName: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.06em', textTransform:'uppercase',
    marginBottom:'5px', display:'flex', alignItems:'center', gap:'6px',
  },
  schemaDot: { width:'7px', height:'7px', borderRadius:'50%', flexShrink:0 },
  schemaRow: {
    display:'flex', gap:'8px', alignItems:'baseline',
    padding:'3px 0',
    borderBottom:'1px solid rgba(255,255,255,0.04)',
  },
  schemaCol: { color:'var(--text3)', minWidth:'80px', flexShrink:0, fontSize:'12px' },
  schemaType: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', color:'var(--text4)',
  },
  qsec: {
    flexShrink:0, padding:'8px 14px 4px',
    borderTop:'1px solid var(--border)',
  },
  hypSelect: {
    width:'100%',
    background:'var(--surface2)',
    border:'1px solid rgba(200,160,32,0.2)',
    color:'var(--text4)',
    borderRadius:'3px',
    padding:'5px 8px',
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.04em',
    marginTop:'4px', marginBottom:'8px',
    cursor:'pointer',
    appearance:'none', WebkitAppearance:'none',
  },
  qscroll: { overflowY:'auto', maxHeight:'230px', padding:'4px 14px 10px' },
  right: { flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  editorWrap: {
    flexShrink:0, padding:'13px 16px 10px',
    borderBottom:'1px solid var(--border)',
    background:'var(--surface)',
  },
  textarea: {
    width:'100%', height:'95px',
    background:'var(--surface2)',
    border:'1px solid var(--border2)',
    borderRadius:'4px', padding:'8px 10px',
    fontFamily:"'Space Mono',monospace",
    fontSize:'11px', color:'#faf0d7',
    resize:'vertical', outline:'none', lineHeight:1.6,
  },
  btnRow: { display:'flex', gap:'8px', alignItems:'center', marginTop:'8px' },
  runBtn: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.07em', textTransform:'uppercase',
    padding:'6px 14px',
    background:'var(--blue)', color:'var(--surface2)',
    border:'none', borderRadius:'3px', cursor:'pointer',
  },
  clearBtn: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.07em', textTransform:'uppercase',
    padding:'6px 12px',
    background:'transparent', color:'var(--text4)',
    border:'1px solid var(--border)', borderRadius:'3px', cursor:'pointer',
  },
  iconBtn: {
    background:'transparent',
    border:'1px solid rgba(63,191,106,0.3)',
    borderRadius:'3px', padding:'4px 7px',
    cursor:'pointer', color:'var(--green)',
    display:'flex', alignItems:'center', fontSize:'14px',
  },
  errorMsg: {
    marginTop:'8px', padding:'8px 10px',
    background:'rgba(224,64,64,0.1)',
    border:'1px solid rgba(224,64,64,0.25)',
    borderRadius:'3px',
    fontFamily:"'Space Mono',monospace",
    fontSize:'10px', color:'#e04040',
  },
  resultsWrap: { flex:1, overflow:'auto', padding:'13px 16px' },
  resultsMeta: { display:'flex', gap:'10px', alignItems:'center', marginBottom:'10px' },
  rowCount: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.07em', textTransform:'uppercase',
    color:'var(--green)', flex:1,
  },
  copyBtn: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.06em', textTransform:'uppercase',
    padding:'4px 9px',
    background:'transparent', color:'var(--text4)',
    border:'1px solid var(--border)', borderRadius:'3px', cursor:'pointer',
  },
  table: { width:'100%', borderCollapse:'collapse' },
  th: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.06em', textTransform:'uppercase',
    color:'var(--text4)', textAlign:'left',
    padding:'6px 8px',
    borderBottom:'1px solid var(--border)',
  },
  td: {
    padding:'6px 8px',
    borderBottom:'1px solid rgba(255,255,255,0.04)',
    color:'var(--text2)', fontSize:'13px',
  },
  tdNum: {
    padding:'6px 8px',
    borderBottom:'1px solid rgba(255,255,255,0.04)',
    color:'var(--blue)',
    fontFamily:"'Space Mono',monospace",
    fontSize:'12px', textAlign:'right',
  },
  tdHi: {
    padding:'6px 8px',
    borderBottom:'1px solid rgba(255,255,255,0.04)',
    color:'var(--gold)',
    fontFamily:"'Space Mono',monospace",
    fontSize:'12px', textAlign:'right',
  },
  emptyState: { padding:'48px 0', textAlign:'center', color:'var(--text3)' },
  emptyIcon: { fontSize:'28px', marginBottom:'12px', display:'block' },
  emptyText: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.08em', textTransform:'uppercase',
    color:'var(--text4)', marginBottom:'6px',
  },
  emptySub: { fontSize:'12px', color:'var(--text4)' },
  // State inquiry
  statePanel: { flex:1, display:'flex', flexDirection:'column', overflow:'auto', padding:'14px 16px', gap:'12px' },
  stateRow: { display:'flex', alignItems:'center', gap:'12px' },
  stateLbl: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.10em', textTransform:'uppercase',
    color:'var(--text3)', flexShrink:0,
  },
  stateSelect: {
    background:'var(--surface2)',
    border:'1px solid var(--border2)',
    color:'var(--text2)',
    borderRadius:'3px', padding:'7px 12px',
    fontSize:'12px', minWidth:'148px',
    appearance:'none', WebkitAppearance:'none',
  },
  badge: {
    fontSize:'10px', color:'var(--green)',
    background:'rgba(63,191,106,0.08)',
    border:'1px solid rgba(63,191,106,0.18)',
    borderRadius:'3px', padding:'3px 8px',
    fontFamily:"'Space Mono',monospace",
    letterSpacing:'0.04em',
  },
  cards: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' },
  card: {
    background:'var(--surface2)',
    borderRadius:'3px', padding:'11px',
    border:'1px solid var(--border)',
  },
  cardHi: {
    background:'var(--surface2)',
    borderRadius:'3px', padding:'11px',
    border:'1px solid rgba(200,160,32,0.2)',
  },
  cardLbl: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.07em', textTransform:'uppercase',
    color:'var(--text4)', marginBottom:'6px',
  },
  cardVal: { fontSize:'18px', fontWeight:500, color:'var(--text2)' },
  askBox: {
    background:'var(--surface2)',
    borderRadius:'3px', padding:'12px',
    border:'1px solid var(--border)',
  },
  askInput: {
    flex:1,
    background:'var(--surface)',
    border:'1px solid var(--border2)',
    color:'var(--text2)',
    borderRadius:'3px', padding:'8px 11px',
    fontSize:'12px', outline:'none',
  },
  askBtn: {
    background:'rgba(108,142,191,0.1)',
    border:'1px solid rgba(108,142,191,0.25)',
    color:'var(--blue)',
    borderRadius:'3px', padding:'8px 14px',
    cursor:'pointer',
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.06em', textTransform:'uppercase',
    whiteSpace:'nowrap',
  },
  answerBox: {
    background:'var(--surface2)',
    borderRadius:'3px', padding:'13px',
    border:'1px solid var(--border)',
  },
  answerText: { fontSize:'12px', lineHeight:1.75, color:'var(--text3)', marginBottom:'10px' },
  resourcesDivider: { borderTop:'1px solid var(--border)', paddingTop:'9px' },
  resourceNote: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'8px', color:'var(--text4)',
    letterSpacing:'0.04em', marginBottom:'8px', display:'block',
  },
  resourceLink: {
    fontSize:'12px', color:'var(--blue)',
    display:'flex', alignItems:'center', gap:'6px',
    marginBottom:'5px', cursor:'pointer', opacity:0.75,
    textDecoration:'none',
  },
})

const DATAQUERY_NAV_CSS = `
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/tabler-icons.min.css');
.data-query-page #toolbar{position:fixed;top:0;left:0;right:0;height:52px;z-index:300;background:rgba(7,8,15,.98);border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;padding:0 18px;gap:10px}
.data-query-page #toolbar h1{font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;flex:1;white-space:nowrap;color:#e8e9f0;font-family:'Space Mono',monospace}
.data-query-page #toolbar h1 span{color:#8792b3;font-weight:400}
html[data-theme='light'] .data-query-page #toolbar{background:rgba(243,246,251,.98);border-bottom:1px solid rgba(15,23,42,.14)}
html[data-theme='light'] .data-query-page #toolbar h1{color:#0f172a}
html[data-theme='light'] .data-query-page #toolbar h1 span{color:#64748b}
.data-query-page .site-nav{display:flex;gap:5px;flex-wrap:wrap;align-items:center;flex-shrink:0}
.data-query-page .sn{font-family:monospace;font-size:8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:4px 9px;border:1px solid rgba(255,255,255,.08);border-radius:3px;background:transparent;color:#5a5e78;text-decoration:none;white-space:nowrap;transition:all .15s}
.data-query-page .sn:hover{border-color:rgba(255,255,255,.25);color:#dde0f0}
.data-query-page .sn.sn-home{border-color:rgba(108,142,191,.3);color:#6c8ebf}
.data-query-page .sn.sn-home:hover{background:rgba(108,142,191,.08);border-color:#6c8ebf}
.data-query-page .sn.sn-active{background:rgba(255,255,255,.07);color:#dde0f0;border-color:rgba(255,255,255,.18)}
html[data-theme='light'] .data-query-page .sn{background:var(--bg);border-color:rgba(15,23,42,.16);color:#334155}
html[data-theme='light'] .data-query-page .sn:hover{border-color:rgba(15,23,42,.4);color:#0f172a}
html[data-theme='light'] .data-query-page .sn.sn-active{background:#e2e8f0;color:#0f172a;border-color:rgba(15,23,42,.24)}
.dq-tab-bar{display:flex;border-bottom:1px solid rgba(255,255,255,0.07);padding:0 18px;background:#07080f;flex-shrink:0}
html[data-theme='light'] .dq-tab-bar{background:#f3f6fb;border-bottom:1px solid rgba(15,23,42,0.14)}
.dq-tab{padding:9px 16px;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5a5e78;cursor:pointer;border-bottom:2px solid transparent;transition:color .15s;background:none;border-left:none;border-right:none;border-top:none}
.dq-tab.active{color:#C8A020;border-bottom:2px solid #C8A020}
html[data-theme='light'] .dq-tab{color:#94a3b8}
html[data-theme='light'] .dq-tab.active{color:#7A5C00;border-bottom-color:#7A5C00}
.qbtn-item{display:block;width:100%;text-align:left;background:transparent;border-radius:3px;padding:5px 8px;margin-bottom:3px;cursor:pointer;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;transition:opacity .15s;border-left:2px solid;border-top:none;border-right:none;border-bottom:none;opacity:1}
.qbtn-item:hover{opacity:.4}
@media(max-width:780px){.data-query-page .sn{font-size:7px;padding:3px 7px}}
@media(max-width:520px){.data-query-page .site-nav .sn-label{display:none}.data-query-page .sn{padding:4px 7px}}
`

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function DataQuery() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light'
  const S = makeStyles(isLight)

  // SQL state
  const [db,       setDb]       = useState(null)
  const [dbReady,  setDbReady]  = useState(false)
  const [dbError,  setDbError]  = useState(null)
  const [sql,      setSql]      = useState(HYPOTHESIS_QUERIES[0].sql)
  const [results,  setResults]  = useState(null)
  const [error,    setError]    = useState(null)
  const [copied,   setCopied]   = useState(false)
  const textareaRef = useRef(null)

  // Tab state
  const [activeTab, setActiveTab] = useState('sql')

  // State inquiry state
  const [selectedState, setSelectedState] = useState('Georgia')
  const [question,      setQuestion]      = useState('')
  const [answer,        setAnswer]        = useState(null)
  const [resources,     setResources]     = useState([])
  const [asking,        setAsking]        = useState(false)
  const [askStage,      setAskStage]      = useState('Searching the web...')
  const [askError,      setAskError]      = useState(null)

  // ── INIT sql.js ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    async function initDb() {
      try {
        const SQL = await initSqlJs({ locateFile: () => sqlWasmUrl })
        if (cancelled) return
        const database = new SQL.Database()
        database.run(`
          CREATE TABLE states (state TEXT PRIMARY KEY, operating INTEGER, planned INTEGER, ratio REAL, party TEXT);
          CREATE TABLE sectors (id TEXT PRIMARY KEY, label TEXT, color TEXT, primary_layer TEXT);
          CREATE TABLE layers (id TEXT PRIMARY KEY, label TEXT, color TEXT, actor_count INTEGER);
        `)
        const stateStmt = database.prepare('INSERT INTO states VALUES (?, ?, ?, ?, ?)')
        STATES.forEach(r => stateStmt.run([r.state, r.operating, r.planned, r.ratio, r.party]))
        stateStmt.free()
        const secStmt = database.prepare('INSERT INTO sectors VALUES (?, ?, ?, ?)')
        SECTORS.forEach(r => secStmt.run([r.id, r.label, r.color, r.primary_layer]))
        secStmt.free()
        const layStmt = database.prepare('INSERT INTO layers VALUES (?, ?, ?, ?)')
        LAYERS.forEach(r => layStmt.run([r.id, r.label, r.color, r.actor_count]))
        layStmt.free()
        setDb(database)
        setDbReady(true)
      } catch (err) {
        if (!cancelled) setDbError(err.message)
      }
    }
    initDb()
    return () => { cancelled = true }
  }, [])

  // ── RUN QUERY ──────────────────────────────────────────────────────────────
  function runQuery() {
    if (!db) return
    setError(null)
    setResults(null)
    try {
      const res = db.exec(sql.trim())
      if (!res || res.length === 0) {
        setResults({ columns: [], rows: [], empty: true })
        return
      }
      const { columns, values } = res[res.length - 1]
      setResults({ columns, rows: values })
    } catch (err) {
      setError(err.message)
    }
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      runQuery()
    }
  }

  // ── COPY CSV ───────────────────────────────────────────────────────────────
  function copyCSV() {
    if (!results || !results.columns.length) return
    const header = results.columns.join(',')
    const rows = results.rows.map(r =>
      r.map(v => (typeof v === 'string' && v.includes(',') ? `"${v}"` : v)).join(',')
    )
    navigator.clipboard.writeText([header, ...rows].join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  // ── PRINT ──────────────────────────────────────────────────────────────────
  function withJsPdf(run) {
    if (window.jspdf?.jsPDF) {
      run(window.jspdf.jsPDF)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    script.onload = () => {
      run(window.jspdf.jsPDF)
    }
    script.onerror = () => {
      console.error('Failed to load jsPDF library')
    }
    document.head.appendChild(script)
  }

  function sanitizePdfText(value) {
    return String(value ?? '')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\u2026/g, '...')
      .replace(/\u00A0/g, ' ')
      .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '')
  }

  function drawReportTitleBlock(doc, marginLeft, marginTop, contentWidth, title, meta, previewLabel, previewText) {
    let y = marginTop

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(30, 30, 30)
    doc.text(sanitizePdfText(title), marginLeft, y)
    y += 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(90, 90, 90)
    doc.text(sanitizePdfText(meta), marginLeft, y)
    y += 5

    doc.setTextColor(70, 70, 70)
    const preview = doc.splitTextToSize(sanitizePdfText(`${previewLabel}: ${previewText}`), contentWidth)
    doc.text(preview, marginLeft, y)
    return y + preview.length * 3 + 2
  }

  function handlePrintSql() {
    if (!results || results.empty || !results.columns?.length) return

    withJsPdf((jsPDF) => {
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const marginLeft = 10
      const marginRight = 10
      const marginTop = 12
      const marginBottom = 10
      const tableWidth = pageWidth - marginLeft - marginRight
      const colCount = results.columns.length
      const maxCharsByCol = results.columns.map((name, i) => {
        const fromRows = results.rows.reduce((max, row) => {
          const cell = row?.[i]
          const text = cell === null || cell === undefined ? 'NULL' : String(cell)
          return Math.max(max, text.length)
        }, 0)
        return Math.min(Math.max(name.length, fromRows), 32)
      })

      const totalChars = maxCharsByCol.reduce((sum, n) => sum + n, 0) || 1
      let colWidths = maxCharsByCol.map((n) => Math.max(18, (n / totalChars) * tableWidth))
      const widthScale = tableWidth / colWidths.reduce((sum, n) => sum + n, 0)
      colWidths = colWidths.map((w) => w * widthScale)

      const drawTitleBlock = () => drawReportTitleBlock(
        doc,
        marginLeft,
        marginTop,
        tableWidth,
        'Hyperscale Data Center SQL Report',
        `Rows: ${results.rows.length} | Exported: ${new Date().toISOString()}`,
        'SQL',
        sql
      )

      const drawHeaderRow = (y) => {
        doc.setFillColor(236, 240, 247)
        doc.setDrawColor(185, 192, 204)
        doc.setTextColor(28, 34, 44)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)

        let x = marginLeft
        results.columns.forEach((col, i) => {
          const w = colWidths[i]
          doc.rect(x, y, w, 7, 'FD')
          const colText = doc.splitTextToSize(String(col), w - 2)
          doc.text(colText, x + 1, y + 4)
          x += w
        })
      }

      let y = drawTitleBlock()
      drawHeaderRow(y)
      y += 7

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(45, 45, 45)

      results.rows.forEach((row, rowIndex) => {
        const wrappedByCol = row.map((cell, i) => {
          const text = cell === null || cell === undefined ? 'NULL' : String(cell)
          return doc.splitTextToSize(text, colWidths[i] - 2)
        })

        const maxLineCount = wrappedByCol.reduce((max, lines) => Math.max(max, lines.length), 1)
        const rowHeight = Math.max(6, maxLineCount * 3.6 + 1.6)

        if (y + rowHeight > pageHeight - marginBottom) {
          doc.addPage()
          y = marginTop
          drawHeaderRow(y)
          y += 7
        }

        let x = marginLeft
        wrappedByCol.forEach((lines, i) => {
          const w = colWidths[i]
          doc.setDrawColor(205, 210, 218)
          if (rowIndex % 2 === 0) {
            doc.setFillColor(252, 253, 255)
            doc.rect(x, y, w, rowHeight, 'FD')
          } else {
            doc.rect(x, y, w, rowHeight, 'S')
          }
          doc.text(lines, x + 1, y + 4)
          x += w
        })

        y += rowHeight
      })

      const date = new Date().toISOString().slice(0, 10)
      doc.save(`SQL_DataCenter_Report_${date}.pdf`)
    })
  }

  function handlePrintAnswer() {
    if (!answer) return

    withJsPdf((jsPDF) => {
      try {
        const doc = new jsPDF({ unit: 'mm', format: 'a4' })
        const pageWidth = doc.internal.pageSize.getWidth()
        const marginLeft = 15
        const marginTop = 20
        const contentWidth = pageWidth - 30
        let y = drawReportTitleBlock(
          doc,
          marginLeft,
          marginTop,
          contentWidth,
          'Hyperscale Data Center State Inquiry Report',
          `State: ${selectedState} | Exported: ${new Date().toISOString()}`,
          'Question',
          question
        ) + 2

        const lines = (answer || '').split('\n')
        lines.forEach((line) => {
          const safeLine = sanitizePdfText(line)
          if (y > 270) { doc.addPage(); y = marginTop }

          if (safeLine.startsWith('## ')) {
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(10)
            doc.setTextColor(30, 30, 30)
            doc.text(sanitizePdfText(safeLine.slice(3).toUpperCase()), marginLeft, y)
            y += 6
          } else if (safeLine.startsWith('- ')) {
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(9)
            doc.setTextColor(60, 60, 60)
            const wrapped = doc.splitTextToSize(`- ${safeLine.slice(2)}`, contentWidth)
            doc.text(wrapped, marginLeft, y)
            y += wrapped.length * 5
          } else if (safeLine.trim()) {
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(9)
            doc.setTextColor(60, 60, 60)
            const wrapped = doc.splitTextToSize(safeLine, contentWidth)
            doc.text(wrapped, marginLeft, y)
            y += wrapped.length * 5
          } else {
            y += 3
          }
        })

        const date = new Date().toISOString().slice(0, 10)
        doc.save(`${sanitizePdfText(selectedState).replace(/\s+/g, '_')}_DataCenter_Report_${date}.pdf`)
      } catch (error) {
        console.error('State Inquiry PDF generation failed:', error)
      }
    })
  }

  // ── NUMERIC COLUMN DETECTION ───────────────────────────────────────────────
  function isNumeric(col, rows) {
    return rows.every(r => {
      const v = r[col]
      return v === null || v === undefined || typeof v === 'number'
    })
  }

  function isHighPressure(col, val) {
    return col === 'ratio' && typeof val === 'number' && val >= 1.0
  }

  async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 15000) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, { ...options, signal: controller.signal })
      return response
    } finally {
      clearTimeout(timer)
    }
  }

  // ── ASK CLAUDE ─────────────────────────────────────────────────────────────
  async function askClaude() {
    if (!question.trim()) return
    setAsking(true)
    setAnswer(null)
    setResources([])
    setAskError(null)
    setAskStage('Searching the web...')
    const stageTimers = [
      setTimeout(() => setAskStage('Reading sources...'), 8000),
      setTimeout(() => setAskStage('Writing your report...'), 16000),
      setTimeout(() => setAskStage('Compiling final report...'), 28000),
    ]

    const stateRecord = STATES.find(s => s.state === selectedState)
    const contextMsg = stateRecord
      ? `State: ${selectedState}. Operating: ${stateRecord.operating}. Planned: ${stateRecord.planned}. Ratio: ${stateRecord.ratio.toFixed(2)}. Party: ${stateRecord.party}. Question: ${question}`
      : `Scope: All U.S. states in dataset. Question: ${question}`

    const requestPayload = {
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: contextMsg }],
      max_tokens: 2000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    }

    const runLegacyInquiry = async () => {
      const requestOnce = async (timeoutMs) => {
        const legacyResponse = await fetchJsonWithTimeout('/.netlify/functions/anthropic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload),
        }, timeoutMs)

        if (!legacyResponse.ok) {
          throw new Error('Could not get a response from inquiry service')
        }

        return legacyResponse.json()
      }

      try {
        return await requestOnce(90000)
      } catch (error) {
        if (error?.name === 'AbortError') {
          return requestOnce(120000)
        }
        throw error
      }
    }

    try {
      // Use the synchronous legacy endpoint for reliability during live demos.
      const data = await runLegacyInquiry()

      if (!data) {
        throw new Error('Inquiry timed out before completion')
      }

      const textBlocks = (data.content || [])
        .filter(b => b.type === 'text' && typeof b.text === 'string')
        .map(b => b.text.trim())
        .filter(Boolean)
      if (!textBlocks.length) throw new Error('No response from API')

      let rawText = textBlocks.join('\n\n')
      let parsedResources = []

      const jsonMatch = rawText.match(/RESOURCES_JSON:\[.*?\]/s)
      if (jsonMatch) {
        try {
          parsedResources = JSON.parse(jsonMatch[0].replace('RESOURCES_JSON:', ''))
        } catch {}
        rawText = rawText.replace(/RESOURCES_JSON:\[.*?\]/s, '').trim()
      }

      setAnswer(rawText)
      setResources(parsedResources)
    } catch (err) {
      if (err?.name === 'AbortError') {
        setAskError('Inquiry request timed out. Please try again.')
      } else {
        setAskError(err?.message || 'Could not get a response. Please try again.')
      }
    } finally {
      stageTimers.forEach(clearTimeout)
      setAsking(false)
      setAskStage('Searching the web...')
    }
  }


  function renderMarkdown(text) {
    return text.split('\n').map((line) => {
      if (line.startsWith('# ') && !line.startsWith('## ')) return '<h2 style="font-size:12px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:var(--text);margin:0 0 10px">' + line.slice(2) + '</h2>'
      if (line.startsWith('## ')) return '<h3 style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text2);margin:16px 0 6px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.07)">' + line.slice(3) + '</h3>'
      if (line.startsWith('### ')) return '<h4 style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--gold);margin:10px 0 4px">' + line.slice(4) + '</h4>'
      if (line.startsWith('- ') || line.startsWith('* ')) return '<div style="display:flex;gap:8px;margin-bottom:5px;line-height:1.5"><span style="color:#C8A020;flex-shrink:0;margin-top:1px">-</span><span style="color:var(--text2);">' + line.slice(2) + '</span></div>'
      if (line.startsWith('|') || line.trim() === '---') return ''
      if (line.trim() === '') return '<div style="height:8px"></div>'
      return '<p style="margin-bottom:6px;color:var(--text2);line-height:1.6">' + line + '</p>'
    }).join('')
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  const stateData = STATES.find(s => s.state === selectedState)

  return (
    <div className="data-query-page" style={S.page} role="main" aria-label="Data query workspace">
      <style>{DATAQUERY_NAV_CSS}</style>

      {/* TOOLBAR */}
      <div id="toolbar" role="region" aria-label="Data query controls">
        <h1>HYPERSCALE DATA CENTER <span>/ Data Query</span></h1>
        <Nav />
      </div>

      {/* TAB BAR */}
      <div className="dq-tab-bar" style={{ marginTop:'52px' }}>
        <button className={`dq-tab${activeTab === 'sql' ? ' active' : ''}`} onClick={() => setActiveTab('sql')}>SQL</button>
        <button className={`dq-tab${activeTab === 'state' ? ' active' : ''}`} onClick={() => setActiveTab('state')}>State Inquiry</button>
      </div>

      <div style={S.body}>

        {/* LEFT — schema + queries (always visible) */}
        <div style={S.left}>
          <div style={S.leftHead}>
            <span style={S.lbl}>Schema</span>
            <span style={S.lsub}>{dbReady ? '3 tables loaded' : dbError ? 'Error loading db' : 'Loading…'}</span>
          </div>
          <div style={S.leftScroll}>
            {SCHEMA.map(t => (
              <div key={t.table} style={S.schemaTable}>
                <div style={S.schemaTableName}>
                  <div style={{ ...S.schemaDot, background: t.color }} />
                  <span style={{ color: t.color }}>{t.table}</span>
                </div>
                {t.cols.map(c => (
                  <div key={c.name} style={S.schemaRow}>
                    <span style={S.schemaCol}>{c.name}</span>
                    <span style={S.schemaType}>{c.type}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* HYPOTHESES + QUERIES */}
          <div style={S.qsec}>
            <span style={S.lbl}>Hypotheses</span>
            <select
              style={S.hypSelect}
              onChange={e => {
                const q = HYPOTHESIS_QUERIES.find(h => h.label === e.target.value)
                if (q) { setSql(q.sql); setResults(null); setError(null); setActiveTab('sql')
                  setTimeout(() => runQuery(), 50)
                }
              }}
              defaultValue=""
            >
              <option value="">— select —</option>
              {HYPOTHESIS_QUERIES.map(q => (
                <option key={q.label} value={q.label}>{q.label}</option>
              ))}
            </select>
            <span style={S.lbl}>Queries</span>
          </div>
          <div style={S.qscroll}>
            {STARTER_QUERIES.map((q, i) => (
              <button
                key={i}
                className="qbtn-item"
                style={{ color: q.color, borderLeftColor: q.color }}
                onClick={() => {
                  setSql(q.sql)
                  setResults(null)
                  setError(null)
                  setActiveTab('sql')
                  textareaRef.current?.focus()
                  setTimeout(() => runQuery(), 50)
                }}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* SQL TAB */}
        {activeTab === 'sql' && (
          <div style={S.right}>
            <div style={S.editorWrap}>
              <span style={S.lbl}>SQL Editor — Ctrl+Enter or ⌘+Enter to run</span>
              <textarea
                ref={textareaRef}
                style={S.textarea}
                value={sql}
                onChange={e => setSql(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                aria-label="SQL editor"
                placeholder="SELECT * FROM states ORDER BY ratio DESC;"
              />
              <div style={S.btnRow}>
                <button
                  type="button"
                  style={S.runBtn}
                  disabled={!dbReady}
                  onClick={runQuery}
                >
                  {dbReady ? '▶ Run Query' : 'Loading db…'}
                </button>
                <button
                  type="button"
                  style={S.clearBtn}
                  onClick={() => { setSql(''); setResults(null); setError(null); textareaRef.current?.focus() }}
                >
                  Clear
                </button>
                {dbError && <span style={{ fontSize:'10px', color:'#e04040' }}>DB error: {dbError}</span>}
                <div style={{ marginLeft:'auto' }}>
                  <button type="button" style={S.iconBtn} onClick={handlePrintSql} title="Print / save as PDF">
                    <i className="ti ti-printer" aria-hidden="true" />
                  </button>
                </div>
              </div>
              {error && <div style={S.errorMsg}>⚠ {error}</div>}
            </div>

            <div style={S.resultsWrap}>
              {results === null ? (
                <div style={S.emptyState}>
                  <span style={S.emptyIcon}>⬡</span>
                  <div style={S.emptyText}>Run a query to see results</div>
                  <div style={S.emptySub}>Three tables: states · sectors · layers</div>
                </div>
              ) : results.empty ? (
                <div style={S.emptyState}>
                  <span style={S.emptyIcon}>○</span>
                  <div style={S.emptyText}>Query executed — 0 rows returned</div>
                </div>
              ) : (
                <>
                  <div style={S.resultsMeta}>
                    <span style={S.rowCount}>{results.rows.length} row{results.rows.length !== 1 ? 's' : ''} returned</span>
                    <button type="button" style={S.copyBtn} onClick={copyCSV}>
                      {copied ? '✓ Copied' : 'Copy CSV'}
                    </button>
                  </div>
                  <table style={S.table}>
                    <thead>
                      <tr>{results.columns.map(col => <th key={col} style={S.th}>{col}</th>)}</tr>
                    </thead>
                    <tbody>
                      {results.rows.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((val, ci) => {
                            const num = isNumeric(ci, results.rows)
                            const hi  = num && isHighPressure(results.columns[ci], val)
                            return (
                              <td key={ci} style={hi ? S.tdHi : num ? S.tdNum : S.td}>
                                {val === null ? <span style={{ color:'var(--text4)' }}>NULL</span> : String(val)}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        )}

        {/* STATE INQUIRY TAB */}
        {activeTab === 'state' && (
          <div style={S.right}>
            <div style={S.statePanel}>
              <div style={{ ...S.lbl, marginBottom:'10px' }}>State Inquiry</div>

              {/* State selector */}
              <div style={S.stateRow}>
                <span style={S.stateLbl}>{selectedState === 'All States' ? 'Scope' : 'State'}</span>
                <select
                  style={S.stateSelect}
                  value={selectedState}
                  onChange={e => { setSelectedState(e.target.value); setAnswer(null); setResources([]) }}
                >
                  <option value="All States">All States</option>
                  {['Arizona','California','Florida','Georgia','Illinois','Indiana','Iowa','New York','North Carolina','Ohio','Oregon','Pennsylvania','Texas','Virginia','Washington'].map(s => (
                    <option key={s} value={s}>
                      {['Georgia','Indiana'].includes(s) ? String.fromCharCode(9733)+' '+s : s}
                    </option>
                  ))}
                </select>
                {['Georgia','Indiana'].includes(selectedState) && <span style={S.badge}>Full inquiry available</span>}
              </div>

              {/* Stat cards */}
              {selectedState !== 'All States' && stateData && (
                <div style={S.cards}>
                  <div style={S.card}>
                    <div style={S.cardLbl}>Operating</div>
                    <div style={S.cardVal}>{stateData.operating}</div>
                  </div>
                  <div style={S.card}>
                    <div style={S.cardLbl}>Planned</div>
                    <div style={S.cardVal}>{stateData.planned}</div>
                  </div>
                  <div style={S.cardHi}>
                    <div style={S.cardLbl}>Ratio</div>
                    <div style={{ ...S.cardVal, color:'var(--gold)' }}>{stateData.ratio.toFixed(2)}</div>
                  </div>
                  <div style={S.card}>
                    <div style={S.cardLbl}>EIA grid demand</div>
                    <div style={{ ...S.cardVal, color:'var(--green)', fontSize:'13px', paddingTop:'3px' }}>
                      Live <i className="ti ti-bolt" style={{ fontSize:'13px' }} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              )}

              {/* Question box */}
              <div style={S.askBox}>
                <span style={{ ...S.lbl, marginBottom:'7px' }}>Ask about {selectedState}</span>
                <div style={{ display:'flex', gap:'8px' }}>
                  <input
                    style={S.askInput}
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') askClaude() }}
                    placeholder={selectedState === 'All States' ? 'Ask about U.S. hyperscale data center development across all states...' : 'How long does a planned facility take from concept to completion?'}
                  />
                  <button type="button" style={S.askBtn} onClick={askClaude} disabled={asking}>
                    {asking ? 'Asking…' : 'Ask'}
                  </button>
                </div>
                {askError && <div style={{ ...S.errorMsg, marginTop:'8px' }}>⚠ {askError}</div>}
              </div>

              {/* Answer */}
              {(answer || asking) && (
                <div style={S.answerBox}>
                  <div style={{ display:'flex', alignItems:'center', marginBottom:'8px' }}>
                    <span style={{ ...S.lbl, flex:1 }}>State Inquiry</span>
                    {answer && (
                      <button type="button" style={S.iconBtn} onClick={handlePrintAnswer} title="Print / save as PDF">
                        <i className="ti ti-printer" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  {asking ? (
                    <div style={{ ...S.answerText, color:'var(--text4)' }}>{askStage}</div>
                  ) : (
                    <div style={S.answerText} dangerouslySetInnerHTML={{__html: renderMarkdown(answer)}} />
                  )}
                  {resources.length > 0 && (
                    <div style={S.resourcesDivider}>
                      <span style={S.lbl}>Helpful resources</span>
                      <span style={S.resourceNote}>Links generated live by web search</span>
                      {resources.map((r, i) => (
                        (r.url && (r.url.startsWith('http://') || r.url.startsWith('https://'))) ? <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={S.resourceLink}>
                          <i className="ti ti-external-link" aria-hidden="true" />
                          {r.title}
                        </a> : null
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
