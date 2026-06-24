# RULES.md

## Project Rules

**Repository:** `hyperscale-data-intelligence`  
**Project:** Hyperscale Data Intelligence — Data Center Database

These rules apply to every human contributor, AI assistant, agent, script, and automated workflow.

## 1. Preserve the Existing Product

The existing HTML visualizations are the source of truth for layout, behavior, interaction, and design.

The React migration must preserve:
- All pages and views
- Navigation structure
- Canvas maps
- Control layers
- Cross-section view
- Timeline phases and swimlanes
- Litigation overlays
- Tooltips and side panels
- Growth-pressure chart
- State data and formulas
- Dark dashboard design
- Typography, spacing, and color tokens

Do not redesign unless Natalie gives explicit written approval.

## 2. HTML-to-JSX Means Translation, Not Reinvention

During migration:
- Convert valid HTML attributes to JSX syntax.
- Convert inline event handlers to React handlers.
- Move scripts into component logic.
- Use `useRef` for Canvas elements.
- Use `useEffect` for setup, animation loops, listeners, and cleanup.
- Preserve calculations and interaction behavior.
- Preserve component output.
- Preserve route names and user flow.

Do not:
- Rename features for convenience.
- Remove difficult interactions.
- Replace Canvas with SVG, D3, or another library.
- Replace custom visualizations with generic templates.
- Merge separate views into one crowded screen.
- Change copy, claims, or data without approval.

## 3. JIRO Owns Migration and Data Architecture

All of the following are JIRO tasks:
- HTML-to-JSX conversion
- React component structure
- SQL schema
- JSON schema
- API integration
- Data normalization
- Serverless functions
- Query architecture
- Data validation

## 4. No Secret Keys in the Browser

Never place secret credentials in:
- React components
- Public JavaScript
- Committed `.env` files
- Variables prefixed with `VITE_`
- HTML source
- JSON files
- GitHub Pages
- Screenshots or documentation

Private APIs must be called through a secure backend or serverless function.

## 5. Data Must Remain Traceable

Every dataset must document:
- Source
- URL
- Date accessed
- Update frequency
- Download or API method
- Relevant fields
- Units
- Known limitations
- License or usage conditions when applicable

Raw data must not be silently edited.

## 6. Claims Must Match the Evidence

Use cautious language where the data does not prove causation.

Allowed:
- “suggests”
- “is associated with”
- “may indicate”
- “identifies where closer investigation is needed”

Not allowed without evidence:
- “proves”
- “causes”
- “will definitely”
- “predicts” when no validated prediction model exists

The planned-to-operating ratio is an indicator of relative expansion pressure. It is not proof of future grid, water, or community harm.

## 7. SQL Must Be Reproducible

Every SQL file must include:
- Table definitions
- Field types
- Primary keys
- Constraints
- Source mapping
- Insert or import notes
- Queries used for hypotheses
- Comments explaining calculations
- Expected output shape

Do not hard-code conclusions into queries.

## 8. Debug Before Redesigning

When something breaks:
1. Reproduce the issue.
2. Record it in `DEBUGGING.md`.
3. Identify the smallest responsible change.
4. Fix the root cause.
5. Run regression tests.
6. Confirm no existing view was damaged.

Do not solve bugs by deleting features.

## 9. One Task, One Owner

Every task must have a primary agent:
- Raphael: orchestration
- Leonardo: research
- JIRO: backend, SQL, data architecture, migration
- Victor: frontend integration and accessibility
- Ant: security
- Bach: debugging and QA
- Precision: verification

## 10. Document Every Material Change

For each material change, record:
- Date
- Agent
- Purpose
- Files changed
- Behavior before
- Behavior after
- Tests run
- Approval status

## 11. Do Not Change Approved Design Tokens

```css
--bg: #06070e;
--bg2: #0a0c18;
--bg3: #0d1020;
--text: #dde0f0;
--text2: #6a6e90;
--text3: #2e3050;
--border: rgba(255,255,255,0.07);
--mono: 'Space Mono', monospace;
--sans: 'Inter', -apple-system, sans-serif;
```

## 12. No Unapproved Dependencies

Before adding a package:
- Explain why native React, JavaScript, or CSS is insufficient.
- Check maintenance status and license.
- Check security advisories.
- Estimate bundle impact.
- Obtain approval if it changes architecture.

## 13. Accessibility Is Required, Not a Redesign

Improve accessibility through:
- Semantic elements
- ARIA labels when needed
- Keyboard operation
- Visible focus states
- Adequate contrast
- Accessible tooltip alternatives
- Reduced-motion consideration

## 14. Test Before Push

Before every push:
- Run the app locally.
- Check all routes.
- Check console errors.
- Check broken links.
- Check responsive layout.
- Test map interactions.
- Test timeline interactions.
- Test Growth Pressure values and tooltips.
- Confirm no secrets are staged.
- Run lint, build, and test commands when available.

## 15. Natalie Has Final Approval

Natalie is the final decision-maker for scope, design, naming, data interpretation, public copy, deployment, paid services, major dependencies, and removal or replacement of features.

## 16. Follow the Approved Folder Structure

The project must follow `ARCHITECTURE.md`.

Do not:
- Rename approved components.
- Duplicate the JSON datasets in component files.
- Create a second navigation component.
- Move Canvas data back into inline HTML.
- Add an unapproved backend structure.
- Call Anthropic directly from `DataQuery.jsx`.

`DataQuery.jsx` must remain disconnected from private credentials until a secure server or serverless endpoint is added and approved.
