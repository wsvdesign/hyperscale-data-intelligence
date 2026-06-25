# DataQuery.jsx — Setup Instructions for Bruce Lee

## 1. Install sql.js

```bash
npm install sql.js
```

## 2. Use the vite.config.js in this folder
It excludes sql.js from Vite pre-bundling so the WASM loads correctly.

## 3. Add the route to App.jsx

```jsx
import DataQuery from './components/DataQuery'

// Inside <Routes>:
<Route path="/data-query" element={<DataQuery />} />
```

## 4. Add to Nav.jsx LINKS array

```js
{ to: '/data-query', label: 'Data Query', icon: '⑤', cls: '' },
```

## 5. That's it. Run:

```bash
npm run dev
```

Navigate to http://localhost:5173/data-query

---

## What the user sees

- Left panel: schema for all 3 tables + 7 starter queries (click any to load)
- Right panel: SQL editor textarea + Run Query button
- Cmd+Enter / Ctrl+Enter also runs the query
- Results render as a table with numeric columns right-aligned in blue mono
- Copy CSV button copies results to clipboard
- Rows highlight on hover
- Error messages display inline below the editor

---

## Three tables in the database

### states (15 rows)
state, operating, planned, ratio, party

### sectors (10 rows)
id, label, color, primary_layer

### layers (8 rows)
id, label, color, actor_count

---

## Seven starter queries pre-loaded

1. H1 — Virginia concentration
2. H2 — Party vs growth rate (GROUP BY party)
3. H3 — Ratio vs total count with pressure tier CASE statement
4. States above 1.0 ratio
5. All states ranked with ROW_NUMBER()
6. Layer actor count
7. Sectors JOIN layers

---

## If WASM fails to load

The sql.js wasm file needs to be accessible at:
`/node_modules/sql.js/dist/sql-wasm.wasm`

Vite's `server.fs.allow: ['..']` in vite.config.js enables this.
If it still fails, copy the wasm file manually:

```bash
cp node_modules/sql.js/dist/sql-wasm.wasm public/
```

Then update the locateFile in DataQuery.jsx:
```js
locateFile: file => `/${file}`
```
