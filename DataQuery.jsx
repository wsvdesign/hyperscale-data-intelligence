/**
 * DataQuery.jsx
 * Real SQL queries against an in-memory SQLite database (sql.js)
 * Three tables: states, sectors, layers
 *
 * Dependency: npm install sql.js
 * Vite config note: sql.js uses WebAssembly — see vite.config.js update below
 */

import { useState, useEffect, useRef } from 'react'
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

const STARTER_QUERIES = [
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
  {
    label: 'States above 1.0 ratio',
    sql: `SELECT state, operating, planned, ratio, party
FROM states
WHERE ratio >= 1.0
ORDER BY ratio DESC;`
  },
  {
    label: 'All states ranked',
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
    sql: `SELECT id, label, actor_count
FROM layers
ORDER BY id;`
  },
  {
    label: 'Sectors by layer',
    sql: `SELECT
  s.id,
  s.label,
  s.primary_layer,
  l.label AS layer_name
FROM sectors s
JOIN layers l ON s.primary_layer = l.id
ORDER BY s.primary_layer, s.id;`
  },
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

// ── STYLES (inline — matches site dark theme exactly) ─────────────────────────

const S = {
  page: {
    position:'fixed', inset:0,
    display:'flex', flexDirection:'column',
    background:'#06070e', color:'#dde0f0',
    fontFamily:"'Inter',-apple-system,sans-serif",
    overflow:'hidden',
  },
  toolbar: {
    flexShrink:0, height:'52px',
    background:'rgba(6,7,14,0.98)',
    borderBottom:'1px solid rgba(255,255,255,0.07)',
    display:'flex', alignItems:'center',
    padding:'0 18px', gap:'10px', zIndex:300,
  },
  h1: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9.5px', fontWeight:700,
    letterSpacing:'0.1em', textTransform:'uppercase',
    flex:1, margin:0, whiteSpace:'nowrap',
  },
  h1span: { color:'#2e3050', fontWeight:400 },
  body: {
    flex:1, display:'flex', overflow:'hidden',
  },
  // LEFT PANEL
  left: {
    width:'280px', flexShrink:0,
    background:'#0a0c18',
    borderRight:'1px solid rgba(255,255,255,0.07)',
    display:'flex', flexDirection:'column',
    overflow:'hidden',
  },
  leftHead: {
    padding:'14px 16px 10px',
    borderBottom:'1px solid rgba(255,255,255,0.07)',
    flexShrink:0,
  },
  leftTitle: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'8px', fontWeight:700,
    letterSpacing:'0.12em', textTransform:'uppercase',
    color:'#2e3050', marginBottom:'2px', display:'block',
  },
  leftSub: { fontSize:'11px', color:'#5a5e78' },
  leftScroll: { flex:1, overflowY:'auto', padding:'12px 14px' },
  // schema table
  schemaTable: { marginBottom:'18px' },
  schemaTableName: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.06em', textTransform:'uppercase',
    marginBottom:'6px', display:'flex', alignItems:'center', gap:'6px',
  },
  schemaDot: { width:'7px', height:'7px', borderRadius:'50%', flexShrink:0 },
  schemaRow: {
    display:'flex', gap:'6px', alignItems:'baseline',
    padding:'3px 0', borderBottom:'1px solid rgba(255,255,255,0.04)',
    fontSize:'10px',
  },
  schemaCol: { color:'#dde0f0', minWidth:'80px' },
  schemaType: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'8px', color:'#3a3e58',
  },
  schemaNoteText: { fontSize:'9px', color:'#2e3050' },
  // starter queries
  starterHead: {
    padding:'10px 14px 6px',
    borderTop:'1px solid rgba(255,255,255,0.07)',
    flexShrink:0,
  },
  starterTitle: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'8px', fontWeight:700,
    letterSpacing:'0.1em', textTransform:'uppercase',
    color:'#2e3050',
  },
  starterScroll: { overflowY:'auto', maxHeight:'200px', padding:'6px 14px 12px' },
  starterBtn: {
    display:'block', width:'100%', textAlign:'left',
    background:'transparent', border:'1px solid rgba(255,255,255,0.06)',
    borderRadius:'3px', padding:'6px 9px', marginBottom:'4px',
    cursor:'pointer', transition:'all 0.15s',
    fontFamily:"'Space Mono',monospace",
    fontSize:'8.5px', fontWeight:700,
    letterSpacing:'0.04em', textTransform:'uppercase',
    color:'#5a5e78',
  },
  // RIGHT PANEL
  right: {
    flex:1, display:'flex', flexDirection:'column', overflow:'hidden',
  },
  editorWrap: {
    flexShrink:0, padding:'16px 18px 12px',
    borderBottom:'1px solid rgba(255,255,255,0.07)',
    background:'#0d1020',
  },
  editorLabel: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'8px', fontWeight:700,
    letterSpacing:'0.1em', textTransform:'uppercase',
    color:'#2e3050', marginBottom:'8px', display:'block',
  },
  textarea: {
    width:'100%', height:'120px',
    background:'#06070e',
    border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:'4px', padding:'10px 12px',
    fontFamily:"'Space Mono',monospace",
    fontSize:'12px', color:'#dde0f0',
    resize:'vertical', outline:'none',
    lineHeight:1.6,
  },
  btnRow: {
    display:'flex', gap:'8px', alignItems:'center', marginTop:'10px',
  },
  runBtn: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.07em', textTransform:'uppercase',
    padding:'7px 16px',
    background:'#6c8ebf', color:'#06070e',
    border:'none', borderRadius:'3px',
    cursor:'pointer', transition:'background 0.15s',
  },
  clearBtn: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.07em', textTransform:'uppercase',
    padding:'7px 14px',
    background:'transparent', color:'#3a3e58',
    border:'1px solid rgba(255,255,255,0.08)',
    borderRadius:'3px', cursor:'pointer',
  },
  errorMsg: {
    marginTop:'8px', padding:'8px 10px',
    background:'rgba(224,64,64,0.1)',
    border:'1px solid rgba(224,64,64,0.25)',
    borderRadius:'3px',
    fontFamily:"'Space Mono',monospace",
    fontSize:'10px', color:'#e04040',
  },
  // RESULTS
  resultsWrap: {
    flex:1, overflow:'auto', padding:'16px 18px',
  },
  resultsMeta: {
    display:'flex', gap:'12px', alignItems:'center',
    marginBottom:'12px',
  },
  rowCount: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'9px', fontWeight:700,
    letterSpacing:'0.07em', textTransform:'uppercase',
    color:'#4fb87c',
  },
  copyBtn: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'8px', fontWeight:700,
    letterSpacing:'0.06em', textTransform:'uppercase',
    padding:'3px 9px',
    background:'transparent', color:'#3a3e58',
    border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'3px', cursor:'pointer',
    transition:'all 0.15s',
  },
  table: {
    width:'100%', borderCollapse:'collapse',
    fontSize:'12px',
  },
  th: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'8.5px', fontWeight:700,
    letterSpacing:'0.06em', textTransform:'uppercase',
    color:'#3a3e58', textAlign:'left',
    padding:'7px 10px',
    borderBottom:'1px solid rgba(255,255,255,0.07)',
    whiteSpace:'nowrap',
  },
  td: {
    padding:'7px 10px',
    borderBottom:'1px solid rgba(255,255,255,0.04)',
    color:'#dde0f0',
  },
  tdNum: {
    padding:'7px 10px',
    borderBottom:'1px solid rgba(255,255,255,0.04)',
    color:'#6c8ebf', fontFamily:"'Space Mono',monospace",
    fontSize:'11px', textAlign:'right',
  },
  emptyState: {
    padding:'48px 0', textAlign:'center',
    color:'#2e3050',
  },
  emptyIcon: { fontSize:'28px', marginBottom:'12px', display:'block' },
  emptyText: {
    fontFamily:"'Space Mono',monospace",
    fontSize:'10px', fontWeight:700,
    letterSpacing:'0.08em', textTransform:'uppercase',
    marginBottom:'6px',
  },
  emptySub: { fontSize:'12px', color:'#252838' },
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function DataQuery() {
  const [db,       setDb]       = useState(null)
  const [dbReady,  setDbReady]  = useState(false)
  const [dbError,  setDbError]  = useState(null)
  const [sql,      setSql]      = useState(STARTER_QUERIES[0].sql)
  const [results,  setResults]  = useState(null)  // { columns, rows }
  const [error,    setError]    = useState(null)
  const [copied,   setCopied]   = useState(false)
  const textareaRef = useRef(null)

  // ── INIT sql.js ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function initDb() {
      try {
        // Dynamically import sql.js
        // sql.js must be installed: npm install sql.js
        const initSqlJs = (await import('sql.js')).default

        // sql.js needs the wasm file — Vite serves it from node_modules
        const SQL = await initSqlJs({
          locateFile: file => `/node_modules/sql.js/dist/${file}`
        })

        if (cancelled) return

        const database = new SQL.Database()

        // Create tables
        database.run(`
          CREATE TABLE states (
            state     TEXT PRIMARY KEY,
            operating INTEGER,
            planned   INTEGER,
            ratio     REAL,
            party     TEXT
          );
          CREATE TABLE sectors (
            id            TEXT PRIMARY KEY,
            label         TEXT,
            color         TEXT,
            primary_layer TEXT
          );
          CREATE TABLE layers (
            id          TEXT PRIMARY KEY,
            label       TEXT,
            color       TEXT,
            actor_count INTEGER
          );
        `)

        // Insert states
        const stateStmt = database.prepare(
          'INSERT INTO states VALUES (?, ?, ?, ?, ?)'
        )
        STATES.forEach(r => {
          stateStmt.run([r.state, r.operating, r.planned, r.ratio, r.party])
        })
        stateStmt.free()

        // Insert sectors
        const secStmt = database.prepare(
          'INSERT INTO sectors VALUES (?, ?, ?, ?)'
        )
        SECTORS.forEach(r => {
          secStmt.run([r.id, r.label, r.color, r.primary_layer])
        })
        secStmt.free()

        // Insert layers
        const layStmt = database.prepare(
          'INSERT INTO layers VALUES (?, ?, ?, ?)'
        )
        LAYERS.forEach(r => {
          layStmt.run([r.id, r.label, r.color, r.actor_count])
        })
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

  // Run on Cmd+Enter / Ctrl+Enter
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
    const rows   = results.rows.map(r =>
      r.map(v => (typeof v === 'string' && v.includes(',') ? `"${v}"` : v)).join(',')
    )
    navigator.clipboard.writeText([header, ...rows].join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  // ── NUMERIC COLUMN DETECTION ───────────────────────────────────────────────
  function isNumeric(col, rows) {
    return rows.every(r => {
      const v = r[col]
      return v === null || v === undefined || typeof v === 'number'
    })
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>

      {/* TOOLBAR */}
      <div style={S.toolbar}>
        <h1 style={S.h1}>
          HYPERSCALE DATA CENTER <span style={S.h1span}>/ Data Query</span>
        </h1>
        <Nav />
      </div>

      <div style={S.body}>

        {/* LEFT — schema + starter queries */}
        <div style={S.left}>

          <div style={S.leftHead}>
            <span style={S.leftTitle}>Schema</span>
            <span style={S.leftSub}>
              {dbReady ? '3 tables loaded' : dbError ? 'Error loading db' : 'Loading…'}
            </span>
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
                    <span style={S.schemaNoteText}>{c.note}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* STARTER QUERIES */}
          <div style={S.starterHead}>
            <span style={S.starterTitle}>Starter queries</span>
          </div>
          <div style={S.starterScroll}>
            {STARTER_QUERIES.map((q, i) => (
              <button
                key={i}
                style={S.starterBtn}
                onMouseEnter={e => { e.currentTarget.style.color = '#dde0f0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#5a5e78'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
                onClick={() => {
                  setSql(q.sql)
                  setResults(null)
                  setError(null)
                  textareaRef.current?.focus()
                }}
              >
                {q.label}
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT — editor + results */}
        <div style={S.right}>

          {/* EDITOR */}
          <div style={S.editorWrap}>
            <span style={S.editorLabel}>SQL Editor — Ctrl+Enter or ⌘+Enter to run</span>
            <textarea
              ref={textareaRef}
              style={S.textarea}
              value={sql}
              onChange={e => setSql(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder="SELECT * FROM states ORDER BY ratio DESC;"
            />
            <div style={S.btnRow}>
              <button
                style={S.runBtn}
                disabled={!dbReady}
                onMouseEnter={e => { e.currentTarget.style.background = '#8aabda' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#6c8ebf' }}
                onClick={runQuery}
              >
                {dbReady ? '▶ Run Query' : 'Loading db…'}
              </button>
              <button
                style={S.clearBtn}
                onClick={() => { setSql(''); setResults(null); setError(null); textareaRef.current?.focus() }}
              >
                Clear
              </button>
              {dbError && (
                <span style={{ fontSize:'10px', color:'#e04040' }}>
                  DB error: {dbError}
                </span>
              )}
            </div>
            {error && <div style={S.errorMsg}>⚠ {error}</div>}
          </div>

          {/* RESULTS */}
          <div style={S.resultsWrap}>
            {results === null ? (
              <div style={S.emptyState}>
                <span style={S.emptyIcon}>⬡</span>
                <div style={S.emptyText}>Run a query to see results</div>
                <div style={S.emptySub}>
                  Three tables: states · sectors · layers
                </div>
              </div>
            ) : results.empty ? (
              <div style={S.emptyState}>
                <span style={S.emptyIcon}>○</span>
                <div style={S.emptyText}>Query executed — 0 rows returned</div>
              </div>
            ) : (
              <>
                <div style={S.resultsMeta}>
                  <span style={S.rowCount}>
                    {results.rows.length} row{results.rows.length !== 1 ? 's' : ''} returned
                  </span>
                  <button
                    style={S.copyBtn}
                    onMouseEnter={e => { e.currentTarget.style.color = '#dde0f0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#3a3e58'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                    onClick={copyCSV}
                  >
                    {copied ? '✓ Copied' : 'Copy CSV'}
                  </button>
                </div>

                <table style={S.table}>
                  <thead>
                    <tr>
                      {results.columns.map(col => (
                        <th key={col} style={S.th}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        {row.map((val, ci) => {
                          const numeric = isNumeric(ci, results.rows)
                          return (
                            <td key={ci} style={numeric ? S.tdNum : S.td}>
                              {val === null ? <span style={{ color:'#252838' }}>NULL</span> : String(val)}
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
      </div>
    </div>
  )
}
