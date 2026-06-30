import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import statesData from '../data/states.json';

const MAX_RATIO = 1.65;
const REF_RATIO = 1.0;

export default function GrowthPressure() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const chartWrapRef = useRef(null);
  const firstTrackRef = useRef(null);
  const refLineRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const rows = useMemo(
    () =>
      [...statesData].sort((left, right) => right.ratio - left.ratio),
    [],
  );

  useEffect(() => {
    const positionReferenceLine = () => {
      const chartWrap = chartWrapRef.current;
      const firstTrack = firstTrackRef.current;
      const refLine = refLineRef.current;

      if (!chartWrap || !firstTrack || !refLine) {
        return;
      }

      const chartRect = chartWrap.getBoundingClientRect();
      const trackRect = firstTrack.getBoundingClientRect();
      const topOffset = trackRect.top - chartRect.top;
      const lineLeft = trackRect.left - chartRect.left + trackRect.width * (REF_RATIO / MAX_RATIO);

      refLine.style.left = `${lineLeft}px`;
      refLine.style.top = `${topOffset}px`;
      refLine.style.height = `${chartWrap.scrollHeight - topOffset}px`;
    };

    positionReferenceLine();

    resizeObserverRef.current = new ResizeObserver(() => positionReferenceLine());
    if (chartWrapRef.current) {
      resizeObserverRef.current.observe(chartWrapRef.current);
    }
    window.addEventListener('resize', positionReferenceLine);

    return () => {
      window.removeEventListener('resize', positionReferenceLine);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  const showTooltip = (event, state) => {
    const total = state.operating + state.planned;
    setTooltip({
      state,
      total,
      clientX: event.clientX,
      clientY: event.clientY,
    });
  };

  const moveTooltip = (event) => {
    setTooltip((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        clientX: event.clientX,
        clientY: event.clientY,
      };
    });
  };

  const hideTooltip = () => setTooltip(null);

  const showTooltipForElement = (element, state) => {
    const rect = element.getBoundingClientRect();
    showTooltip(
      {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      },
      state,
    );
  };

  const tooltipStyles = (() => {
    if (!tooltip) {
      return { display: 'none' };
    }

    const tooltipWidth = 220;
    const tooltipHeight = 160;
    const left =
      tooltip.clientX + 14 + tooltipWidth > window.innerWidth
        ? tooltip.clientX - tooltipWidth - 14
        : tooltip.clientX + 14;
    const top =
      tooltip.clientY + 14 + tooltipHeight > window.innerHeight
        ? tooltip.clientY - tooltipHeight - 14
        : tooltip.clientY + 14;

    return {
      display: 'block',
      left,
      top,
    };
  })();

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07080f;--bg3:#0d1020;
  --text:#e8e9f0;--text2:#b3bdd8;--text3:#8792b3;
  --border:rgba(255,255,255,0.07);
  --accent-ga:#e8c060;--accent-high:#6c8ebf;
  --mono:'Space Mono',monospace;--sans:'Inter',-apple-system,sans-serif;
}
html[data-theme='light']{
  --bg:#f3f6fb;--bg3:#DEDAD2;
  --text:#0f172a;--text2:#334155;--text3:#64748b;
  --border:rgba(15,23,42,0.14);
  --accent-ga:#7A5C00;
}
html,body{width:100%;min-height:100%;background:var(--bg);color:var(--text);font-family:var(--sans)}

#toolbar{
  position:fixed;top:0;left:0;right:0;height:52px;z-index:200;
  background:rgba(7,8,15,0.98);border-bottom:1px solid var(--border);
  display:flex;align-items:center;padding:0 20px;gap:10px;
}
html[data-theme='light'] #toolbar{background:rgba(255,255,255,0.98)}
#toolbar h1{font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;flex:1;color:var(--text);white-space:nowrap}
#toolbar h1 span{color:var(--text3);font-weight:400}
.nav-links{display:flex;gap:6px;flex-wrap:nowrap}
.nav-link{
  font-family:var(--mono);font-size:8.5px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
  padding:4px 10px;border:1px solid var(--border);border-radius:3px;
  background:transparent;color:var(--text2);text-decoration:none;
  transition:all 0.2s;white-space:nowrap;
}
.nav-link:hover{border-color:rgba(255,255,255,0.25);color:var(--text)}
.nav-link.active{background:rgba(255,255,255,0.07);color:var(--text);border-color:rgba(255,255,255,0.2)}
.nav-link.home{border-color:rgba(108,142,191,0.3);color:#6c8ebf}
.nav-link.home:hover{border-color:#6c8ebf;background:rgba(108,142,191,0.08)}

#page{padding:82px 0 80px;max-width:860px;margin:0 auto;padding-left:32px;padding-right:32px}
@media(max-width:600px){#page{padding-left:18px;padding-right:18px;padding-top:72px}}

.eyebrow{font-family:var(--mono);font-size:8.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;display:block}
.page-title{font-size:clamp(18px,3vw,26px);font-weight:600;line-height:1.3;margin-bottom:8px;color:var(--text)}
.page-sub{font-size:13px;color:var(--text2);line-height:1.65;margin-bottom:32px;max-width:620px}

.chart-card{
  background:var(--bg3);border:1px solid var(--border);border-radius:10px;
  padding:28px 28px 24px;margin-bottom:28px;
}
@media(max-width:600px){.chart-card{padding:18px 14px 18px}}

.chart-title{font-size:clamp(14px,2.5vw,18px);font-weight:600;line-height:1.35;margin-bottom:6px;color:var(--text)}
.chart-sub{font-size:12px;color:var(--text2);line-height:1.55;margin-bottom:28px}

#chart-wrap{width:100%;overflow:visible;position:relative}
.chart-row{display:flex;align-items:center;gap:10px;margin-bottom:7px;position:relative}
.state-label{font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:0.04em;text-align:right;flex-shrink:0;color:var(--text2);width:110px}
@media(max-width:500px){.state-label{width:80px;font-size:8.5px}}
.state-label.highlight{color:var(--accent-ga)}
.bar-track{flex:1;height:24px;position:relative;cursor:pointer}
@media(max-width:500px){.bar-track{height:20px}}
.bar-fill{height:100%;border-radius:0 3px 3px 0;transition:filter 0.15s;position:relative}
.bar-fill.normal{background:#2a4a7a}
html[data-theme='light'] .bar-fill.normal{background:#6c8ebf}
.bar-fill.high{background:linear-gradient(90deg,#b8860b,var(--accent-ga))}
.bar-track:hover .bar-fill{filter:brightness(1.3)}
.bar-value{
  position:absolute;left:calc(100% + 6px);top:50%;transform:translateY(-50%);
  font-family:var(--mono);font-size:9.5px;font-weight:700;color:var(--text2);white-space:nowrap;
}
.bar-value.highlight{color:var(--accent-ga)}

.ref-line-wrap{position:relative;flex:1;pointer-events:none}
#refline-overlay{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10}

.x-axis{display:flex;align-items:flex-start;gap:10px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)}
.x-axis-spacer{width:110px;flex-shrink:0}
@media(max-width:500px){.x-axis-spacer{width:80px}}
.x-ticks{flex:1;display:flex;justify-content:space-between;position:relative}
.x-tick{font-family:var(--mono);font-size:9px;color:var(--text3);text-align:center}

#tooltip{
  position:fixed;z-index:999;display:none;
  background:rgba(13,16,32,0.97);border:1px solid rgba(255,255,255,0.12);
  border-radius:6px;padding:12px 15px;pointer-events:none;min-width:200px;
}
html[data-theme='light'] #tooltip{background:rgba(255,255,255,0.98);border:1px solid rgba(15,23,42,0.16)}
.tt-state{font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;margin-bottom:8px}
.tt-row{display:flex;justify-content:space-between;gap:16px;font-size:11px;color:var(--text2);padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
.tt-row{border-bottom:1px solid rgba(255,255,255,0.06)}
html[data-theme='light'] .tt-row{border-bottom:1px solid rgba(15,23,42,0.08)}
.tt-row:last-child{border-bottom:none}
.tt-val{color:var(--text);font-weight:500}
.tt-ratio{font-family:var(--mono);font-size:13px;font-weight:700;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.07)}
html[data-theme='light'] .tt-ratio{border-top:1px solid rgba(15,23,42,0.12)}

.insight{
  background:rgba(108,142,191,0.06);border:1px solid rgba(108,142,191,0.15);
  border-radius:6px;padding:16px 18px;margin-bottom:14px;
}
html[data-theme='light'] .insight{background:#ffffff;border:1px solid rgba(15,23,42,0.16)}
.insight p{font-size:12px;color:var(--text2);line-height:1.7}
.insight p+p{margin-top:8px}

.back-link{
  display:inline-flex;align-items:center;gap:7px;
  font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
  color:#6c8ebf;text-decoration:none;padding:7px 14px;
  border:1px solid rgba(108,142,191,0.3);border-radius:3px;
  transition:all 0.2s;margin-top:8px;
}
.back-link:hover{background:rgba(108,142,191,0.08);border-color:#6c8ebf}

.legend{display:flex;gap:18px;flex-wrap:wrap;margin-bottom:20px;background:rgba(13,16,32,0.95);border:1px solid var(--border);border-radius:6px;padding:10px 12px}
html[data-theme='light'] .legend{background:rgba(255,255,255,0.96)}
.leg-item{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--text2)}
.leg-swatch{width:14px;height:14px;border-radius:2px;flex-shrink:0}
.leg-dash{width:20px;height:0;border-top:1.5px dashed rgba(255,255,255,0.35);flex-shrink:0}
html[data-theme='light'] .leg-dash{border-top-color:rgba(15,23,42,0.35)}

.site-nav{display:flex;gap:5px;flex-wrap:wrap;align-items:center;flex-shrink:0}
.sn{font-family:monospace;font-size:8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:4px 9px;border:1px solid rgba(255,255,255,.08);border-radius:3px;background:transparent;color:#5a5e78;text-decoration:none;white-space:nowrap;transition:all .15s}
.sn:hover{border-color:rgba(255,255,255,.25);color:#dde0f0}
.sn.sn-home{border-color:rgba(108,142,191,.3);color:#6c8ebf}
.sn.sn-home:hover{background:rgba(108,142,191,.08);border-color:#6c8ebf}
.sn.sn-active{background:rgba(255,255,255,.07);color:#dde0f0;border-color:rgba(255,255,255,.18)}
html[data-theme='light'] .sn{background:var(--bg);border-color:rgba(15,23,42,.16);color:#334155}
html[data-theme='light'] .sn:hover{border-color:rgba(15,23,42,.4);color:#0f172a}
html[data-theme='light'] .sn.sn-active{background:#e2e8f0;color:#0f172a;border-color:rgba(15,23,42,.24)}
@media(max-width:780px){.sn{font-size:7px;padding:3px 7px}}
@media(max-width:520px){.site-nav .sn-label{display:none}.sn{padding:4px 7px}}
      `}</style>

      <div id="toolbar">
        <h1>
          HYPERSCALE DATA CENTER <span>/ Intelligence System</span>
        </h1>
        <nav className="site-nav">
          <Link className="sn sn-home" to="/">
            <span>⌂</span> <span className="sn-label">Home</span>
          </Link>
          <Link className="sn" to="/hub-map">
            <span>①</span> <span className="sn-label">Hub Map</span>
          </Link>
          <Link className="sn" to="/hybrid-map">
            <span>②</span> <span className="sn-label">Hybrid Map</span>
          </Link>
          <Link className="sn" to="/timeline">
            <span>③</span> <span className="sn-label">Timeline</span>
          </Link>
          <Link className="sn sn-active" to="/growth-pressure">
            <span>④</span> <span className="sn-label">Growth Pressure</span>
          </Link>
        </nav>
      </div>

      <div
        id="tooltip"
        role="status"
        aria-live="polite"
        style={{
          ...tooltipStyles,
        }}
      >
        <div className="tt-state" style={{ color: tooltip?.state?.ratio >= 1 ? 'var(--accent-ga)' : isLight ? '#0f172a' : '#e8e9f0' }}>
          {tooltip?.state?.state}
        </div>
        <div className="tt-row">
          <span>Operating</span>
          <span className="tt-val">{tooltip ? `${tooltip.state.operating.toLocaleString()} facilities` : ''}</span>
        </div>
        <div className="tt-row">
          <span>Planned</span>
          <span className="tt-val">{tooltip ? `${tooltip.state.planned.toLocaleString()} facilities` : ''}</span>
        </div>
        <div className="tt-row">
          <span>Total</span>
          <span className="tt-val">{tooltip ? `${tooltip.total.toLocaleString()} facilities` : ''}</span>
        </div>
        <div className="tt-row">
          <span>Planned share</span>
          <span className="tt-val">{tooltip ? tooltip.state.plannedShare.toFixed(1) + '% of total' : ''}</span>
        </div>
        <div className="tt-ratio" style={{ color: tooltip?.state?.ratio >= 1 ? 'var(--accent-ga)' : '#6c8ebf' }}>
          {tooltip ? `Ratio: ${tooltip.state.ratio.toFixed(2)}` : ''}
        </div>
      </div>

      <div id="page">
        <span className="eyebrow">Growth Pressure — Hypothesis 3</span>
        <h2 className="page-title">The Fastest-Growing Data Center Markets Are Not the Largest</h2>
        <p className="page-sub">
          Planned data centers divided by operating data centers across the top 15 U.S. markets. A
          ratio above 1.0 means more facilities are planned than currently operating.
        </p>

        <div className="legend">
          <div className="leg-item">
            <div className="leg-swatch" style={{ background: 'linear-gradient(90deg,#b8860b,#e8c060)' }}></div>
            Ratio above 1.0 — more planned than operating
          </div>
          <div className="leg-item">
            <div className="leg-swatch" style={{ background: '#2a4a7a' }}></div>
            Ratio below 1.0
          </div>
          <div className="leg-item">
            <div className="leg-dash"></div>
            1.0 reference line
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Planned-to-Operating Ratio by State</div>
          <div className="chart-sub">Ranked highest to lowest · Hover or tap any bar for detail</div>
          <div id="chart-wrap" ref={chartWrapRef}>
            <div className="ref-line-wrap">
              <div
                id="refline-overlay"
                ref={refLineRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 0,
                  pointerEvents: 'none',
                  zIndex: 10,
                  borderLeft: isLight ? '1.5px dashed rgba(15,23,42,0.35)' : '1.5px dashed rgba(255,255,255,0.4)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-22px',
                    left: '4px',
                    fontFamily: 'var(--mono)',
                    fontSize: '8px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  More planned than operating
                </div>
              </div>
            </div>

            {rows.map((state, index) => {
              const isHigh = state.ratio >= 1.0;
              const widthPercent = (state.ratio / MAX_RATIO) * 100;

              return (
                <div className="chart-row" key={state.state}>
                  <div className={`state-label${isHigh ? ' highlight' : ''}`}>{state.state}</div>
                  <div
                    className="bar-track"
                    ref={index === 0 ? firstTrackRef : null}
                    role="button"
                    tabIndex={0}
                    aria-label={`${state.state} ratio ${state.ratio.toFixed(2)}, operating ${state.operating}, planned ${state.planned}`}
                    onMouseEnter={(event) => showTooltip(event, state)}
                    onMouseMove={moveTooltip}
                    onMouseLeave={hideTooltip}
                    onFocus={(event) => showTooltipForElement(event.currentTarget, state)}
                    onBlur={hideTooltip}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        showTooltipForElement(event.currentTarget, state);
                      }
                      if (event.key === 'Escape') {
                        hideTooltip();
                      }
                    }}
                    onTouchStart={(event) => {
                      event.preventDefault();
                      showTooltip(event.touches[0], state);
                    }}
                    onTouchEnd={() => {
                      window.setTimeout(() => hideTooltip(), 1400);
                    }}
                  >
                    <div
                      className={`bar-fill ${isHigh ? 'high' : 'normal'}`}
                      style={{ width: `${widthPercent}%` }}
                    ></div>
                    <div className={`bar-value${isHigh ? ' highlight' : ''}`}>
                      {state.ratio.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="x-axis">
            <div className="x-axis-spacer"></div>
            <div className="x-ticks">
              {[0, 0.4, 0.8, 1.2, 1.6].map((tick) => (
                <div className="x-tick" key={tick}>
                  {tick.toFixed(1)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="insight">
          <p>
            Virginia remains the largest established data center market, but Georgia and Indiana have
            more facilities planned than currently operating. This suggests that future infrastructure
            pressure may emerge fastest in newer Southern and Midwestern growth markets rather than
            only in the largest existing hubs.
          </p>
          <p>
            A high ratio does not prove that grid, water, or community problems will occur. It
            identifies states where rapid expansion may require closer investigation of electricity
            capacity, water demand, land use, permitting, incentives, and community impact.
          </p>
        </div>

        <Link className="back-link" to="/hub-map">
          → Explore the Intelligence Map to see institutions managing this expansion
        </Link>
      </div>
    </>
  );
}
