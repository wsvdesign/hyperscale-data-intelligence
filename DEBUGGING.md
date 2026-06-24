# DEBUGGING.md

## Project Debugging and QA Log

**Repository:** `hyperscale-data-intelligence`  
**Owner:** Bach — QA and Debugging Lead

## Severity Levels

### Critical
- Application will not build or load.
- Secret or credential exposure.
- Data corruption.
- All routes fail.
- Major visualization is unusable.

### High
- A primary route or visualization fails.
- Calculations are wrong.
- Navigation prevents access to a major view.
- Canvas controls or timeline interactions are broken.
- Mobile layout blocks core use.

### Medium
- One interaction, tooltip, filter, or panel fails.
- Layout overlap affects some devices.
- Accessibility issue limits use.
- Error state is unclear.

### Low
- Cosmetic defect.
- Minor spacing or text issue.
- Non-blocking console warning.
- Small documentation mismatch.

## Bug Report Template

### BUG-[number] — [short title]

**Status:** Open / In Progress / Fixed / Verified / Closed  
**Severity:** Critical / High / Medium / Low  
**Reported by:**  
**Assigned agent:**  
**Date reported:**  
**Environment:**  
**Branch/commit:**  
**Route/component:**  

**Expected behavior:**  

**Actual behavior:**  

**Steps to reproduce:**
1.
2.
3.

**Console or network output:**  

**Likely cause:**  

**Fix implemented:**  

**Files changed:**
- 

**Tests performed:**
- 

**Regression results:**
- Home:
- Hub Map:
- Hybrid Map:
- Timeline:
- Growth Pressure:
- Data Query:
- Mobile:
- Console:
- Build:

**Verified by Bach:** Yes / No  
**Date verified:**  
**Notes:**  

## Mandatory Regression Checklist

### Application
- [ ] `npm install` completes.
- [ ] Development server starts.
- [ ] Production build completes.
- [ ] No critical console errors.
- [ ] No broken imports.
- [ ] No missing routes.
- [ ] Refreshing a route works in deployment.

### Navigation
- [ ] Home works.
- [ ] Hub Map works.
- [ ] Hybrid Map works.
- [ ] Timeline works.
- [ ] Growth Pressure works.
- [ ] Data Query works when included.
- [ ] Active navigation state is correct.
- [ ] Mobile navigation remains usable.

### Hub Map
- [ ] Canvas renders.
- [ ] Hub pulse works.
- [ ] Sector nodes render.
- [ ] Sub-nodes open.
- [ ] Side panel opens and closes.
- [ ] Pan works.
- [ ] Zoom works.
- [ ] Reset works.
- [ ] Litigation overlay works.
- [ ] Labels and colors match the original HTML.

### Hybrid Map
- [ ] Hub & Spoke view works.
- [ ] Control Layers A–H view works.
- [ ] Cross-Section view works.
- [ ] Mode switching works.
- [ ] Layer cards expand.
- [ ] Side panel works.
- [ ] Pan and zoom work on Canvas views.
- [ ] Litigation toggle works.
- [ ] Existing visual structure is preserved.

### Timeline
- [ ] All 11 phases appear.
- [ ] All 6 swimlanes appear.
- [ ] All 4 decision gates appear.
- [ ] Horizontal scrolling works.
- [ ] Drag-to-scroll works.
- [ ] Track isolation works.
- [ ] Cell panels open.
- [ ] Gate panels open.
- [ ] Litigation indicators work.
- [ ] Progress indicator works.
- [ ] Labels and colors match the original HTML.

### Growth Pressure
- [ ] All 15 states appear.
- [ ] Sort order is descending by ratio.
- [ ] Georgia ratio is 1.50.
- [ ] Indiana ratio is 1.42.
- [ ] Reference line is at 1.0.
- [ ] Tooltip totals are correct.
- [ ] Planned share formula is correct.
- [ ] Highlighting is correct.
- [ ] Mobile labels remain readable.
- [ ] Explanatory text matches approved language.

### Data and SQL
- [ ] Schema loads.
- [ ] Primary keys are valid.
- [ ] Numeric fields use correct types.
- [ ] Ratios match source counts.
- [ ] Queries return expected columns.
- [ ] No duplicate state rows.
- [ ] Missing values are handled.
- [ ] SQL results agree with displayed values.

### Security
- [ ] No real `.env` file is committed.
- [ ] No API key appears in client code.
- [ ] No secret appears in Git history.
- [ ] User input is validated.
- [ ] API errors do not expose internals.
- [ ] Rate limiting is present when needed.
- [ ] Dependencies have been reviewed.

### Accessibility
- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Buttons have accessible names.
- [ ] Canvas views have meaningful alternative text or summaries.
- [ ] Contrast remains sufficient.
- [ ] Motion does not prevent use.

## Release Gate

Bach may approve release only when:
- No Critical defects remain.
- No unresolved High defects affect core use.
- Production build succeeds.
- All primary routes pass.
- Regression checklist is complete.
- Precision has verified public-facing data.
- Ant has approved security-sensitive changes.
- Raphael confirms scope.
- Natalie approves material changes.

## Architecture Verification

- [ ] `src/data/states.json` exists and contains all 15 states.
- [ ] `src/data/sectors.json` exists and supplies Hub Map data.
- [ ] `src/data/layers.json` exists and supplies A–H layer data.
- [ ] `Nav.jsx` contains shared navigation only.
- [ ] `HubMap.jsx` preserves the original Hub Map.
- [ ] `HybridMap.jsx` preserves all three original modes.
- [ ] `Timeline.jsx` preserves all phases, lanes, and gates.
- [ ] `GrowthPressure.jsx` preserves all 15 state values.
- [ ] `DataQuery.jsx` contains no private API key.
- [ ] `App.jsx` routes all approved views.
- [ ] `main.jsx` mounts without console errors.
- [ ] No duplicate or alternate architecture was introduced.
