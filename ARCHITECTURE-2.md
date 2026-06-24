# ARCHITECTURE.md

## Project

**Repository:** `hyperscale-data-intelligence`  
**Project:** Hyperscale Data Intelligence — Data Center Database

## Approved Structure for Tonight

```text
hyperscale-data-intelligence/
├── src/
│   ├── data/
│   │   ├── states.json
│   │   ├── sectors.json
│   │   └── layers.json
│   ├── components/
│   │   ├── Nav.jsx
│   │   ├── HubMap.jsx
│   │   ├── HybridMap.jsx
│   │   ├── Timeline.jsx
│   │   ├── GrowthPressure.jsx
│   │   └── DataQuery.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── .env.example
├── vite.config.js
├── package.json
├── README.md
├── HISTORY.md
├── AGENTS.md
├── RULES.md
├── INSTRUCTIONS.md
├── DEBUGGING.md
└── ARCHITECTURE.md
```

## File Responsibilities

### `src/data/states.json`
Contains the full 15-state dataset, including:
- State
- Operating facilities
- Planned facilities
- Total facilities
- Planned-to-operating ratio
- Planned share of total
- Political classification
- Any approved source or metadata fields

### `src/data/sectors.json`
Contains all Hub Map data:
- Ten sectors
- Sub-nodes
- Documents
- Risks
- Litigation exposure
- Transparency classification
- Public-interest questions
- Relationship metadata

### `src/data/layers.json`
Contains the Hybrid Map control layers:
- Layers A through H
- Layer names
- Colors
- Actors
- Nodes
- Explanations
- Cross-layer relationships

### `src/components/Nav.jsx`
Shared site navigation only. It must not contain visualization-specific logic.

### `src/components/HubMap.jsx`
React translation of the existing Hub & Spoke Intelligence Map.

### `src/components/HybridMap.jsx`
React translation of the existing three-view Hybrid Intelligence Map:
- Hub & Spoke
- Control Layers A–H
- Cross-Section

### `src/components/Timeline.jsx`
React translation of the existing 11-phase, 6-swimlane development timeline.

### `src/components/GrowthPressure.jsx`
React translation of the existing ranked planned-to-operating ratio visualization.

### `src/components/DataQuery.jsx`
User interface for plain-English dataset questions.

This component must never call Anthropic directly with a secret embedded in the browser. It must call an approved backend or serverless endpoint.

### `src/App.jsx`
Owns application routes and page composition.

### `src/main.jsx`
Creates the React root and mounts the application.

## Migration Rule

The current HTML files are the behavioral and visual source of truth.

The migration must:
- Preserve all views.
- Preserve all interactions.
- Preserve all copy.
- Preserve all calculations.
- Preserve all design tokens.
- Preserve navigation meaning.
- Preserve Canvas logic and animation behavior.
- Preserve tooltip and panel behavior.
- Preserve timeline phases, lanes, and gates.

The migration may reorganize code internally only as required by React.

## Security Architecture

The following is not allowed:

```text
DataQuery.jsx
  -> Anthropic API directly
  -> secret key bundled into browser
```

The approved pattern is:

```text
DataQuery.jsx
  -> secure server or serverless endpoint
  -> Anthropic API
```

The `.env` file may contain:

```text
ANTHROPIC_API_KEY=your_private_key
```

But the key must only be read by server-side code. It must not be imported into React components and must not use a `VITE_` prefix.

Because the current approved tree does not yet include a backend or serverless folder, `DataQuery.jsx` must remain a non-secret mock or disabled interface until the secure endpoint architecture is added and approved.

## Tonight's Build Order

1. Create the Vite project structure.
2. Add the three JSON data files.
3. Create `Nav.jsx`.
4. Convert the existing HTML views to JSX under JIRO.
5. Connect routes in `App.jsx`.
6. Verify rendering through `main.jsx`.
7. Keep `DataQuery.jsx` disconnected from any private API until Ant approves a secure backend.
8. Run Bach's regression checklist.
9. Run Precision's data verification.
10. Commit and push only after the build passes.
