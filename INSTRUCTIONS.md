# INSTRUCTIONS.md

## Purpose

This file explains when to call each project agent and in what order.

**Repository:** `hyperscale-data-intelligence`  
**Project:** Hyperscale Data Intelligence — Data Center Database

## Default Workflow

1. Raphael scopes and assigns the task.
2. The specialist agent performs the work.
3. Precision verifies data, claims, calculations, and labels when relevant.
4. Ant reviews security when credentials, APIs, forms, user input, or deployment are involved.
5. Bach tests and debugs.
6. Raphael confirms completion and scope compliance.
7. Natalie approves material changes.

## When to Call Raphael

Call Raphael:
- At the beginning of a new feature.
- When scope is unclear.
- When a task affects multiple files or agents.
- Before changing architecture.
- Before adding dependencies.
- When two agents disagree.
- When a request may change the approved design.
- Before a release.

## When to Call Leonardo

Call Leonardo:
- When finding APIs, CSVs, downloadable datasets, public records, or reports.
- When validating data sources.
- When researching state incentives, utilities, water, employment, litigation, or community impact.
- When the dataset lacks a field.
- When a claim needs evidence.
- When source freshness matters.

Leonardo hands sources and field definitions to JIRO for ingestion.

## When to Call JIRO

Call JIRO:
- For all HTML-to-JSX migration work.
- For React + Vite architecture.
- For SQL files.
- For database schemas.
- For JSON schemas.
- For API ingestion.
- For serverless functions.
- For query logic.
- For data normalization.
- For calculations used by charts.
- For component data flow.
- For Canvas lifecycle conversion.

### Required JIRO Migration Sequence

For each existing HTML file:

1. Read the complete original file.
2. Record its structure and interactions.
3. Identify data, rendering, event, and animation logic.
4. Create a React component that reproduces the same output.
5. Move static data to approved JSON files only when behavior remains unchanged.
6. Convert Canvas setup to `useRef`.
7. Convert animation and listeners to `useEffect`.
8. Add cleanup for listeners and animation frames.
9. Preserve all labels, calculations, colors, spacing, controls, and views.
10. Compare the JSX version side by side with the original HTML.
11. Hand the component to Victor for application integration.
12. Hand the completed route to Bach for regression testing.

JIRO must stop and request approval if exact preservation is not possible.

## When to Call Victor

Call Victor:
- After JIRO completes a component.
- When integrating components into routes.
- When creating shared navigation.
- When checking responsive behavior.
- When improving keyboard access or semantic markup.
- When resolving layout conflicts without changing design.

## When to Call Ant

Call Ant:
- Before adding any API key.
- Before connecting Anthropic, OpenAI, EIA, or another authenticated API.
- Before deploying a serverless function.
- Before adding forms or user-submitted queries.
- When environment variables are added.
- When a new dependency is installed.
- When CORS, rate limiting, logging, or error exposure matters.
- Before making the repository public.

## When to Call Bach

Call Bach:
- After every feature or migration.
- When a route is broken.
- When a chart, tooltip, panel, map, filter, or animation fails.
- When the browser console shows errors.
- When responsive layout changes.
- Before every push to production.
- After dependency updates.
- After API integration.
- After a bug fix.

## When to Call Precision

Call Precision:
- After data import.
- After SQL queries are written.
- After ratios or percentages are calculated.
- Before publishing charts.
- Before writing conclusions.
- When labels, dates, units, or sources change.
- When AI-generated analysis is used.
- When two methods produce different results.

## Task Routing Examples

### Convert an HTML visualization to JSX

1. Raphael scopes the migration.
2. JIRO converts the file exactly.
3. Victor integrates the route.
4. Bach compares original and migrated behavior.
5. Precision checks labels and data values.
6. Raphael approves completion.

### Add an EIA API

1. Raphael defines the feature.
2. Leonardo identifies the endpoint and fields.
3. Ant reviews authentication and key handling.
4. JIRO creates ingestion and data mapping.
5. Precision verifies units and values.
6. Victor adds approved UI output.
7. Bach tests success, loading, empty, and error states.

### Add Claude-powered data queries

1. Raphael confirms scope.
2. Ant defines secure server-side architecture.
3. JIRO builds the serverless endpoint and dataset context.
4. Precision defines response constraints and claim language.
5. Victor integrates the query interface.
6. Bach tests input handling, failures, rate limits, and regressions.

### Create the SQL file

1. Raphael confirms required questions and outputs.
2. Leonardo supplies source-field definitions.
3. JIRO writes schema, imports, constraints, and analysis queries.
4. Precision verifies calculations and expected results.
5. Bach runs queries and records defects.

## Stop Conditions

Stop work and request clarification when:
- The requested change would alter the design.
- Existing functionality would be removed.
- Source data conflicts.
- A key would be exposed in client code.
- The requested API has licensing or cost concerns.
- The architecture does not support the requested feature.
- Exact HTML-to-JSX preservation is not possible.
- A calculation cannot be verified.
- A public claim is stronger than the evidence.

## Tonight's Architecture Workflow

Use this order tonight:

1. Raphael confirms the approved structure in `ARCHITECTURE.md`.
2. JIRO creates the Vite folders and files exactly as specified.
3. JIRO moves the 15-state data into `src/data/states.json`.
4. JIRO moves Hub Map content into `src/data/sectors.json`.
5. JIRO moves A–H layer content into `src/data/layers.json`.
6. JIRO converts the existing HTML visualizations into the approved JSX components without redesign.
7. Victor connects `Nav.jsx`, routes, and responsive behavior.
8. Precision verifies every data value and calculation.
9. Ant confirms that `DataQuery.jsx` does not expose `ANTHROPIC_API_KEY`.
10. Bach runs the complete regression checklist.
11. Raphael reviews the handoff.
12. Natalie approves the push.
