import Nav from './Nav';

export default function Home() {
  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#06070e;--bg2:#0a0c18;--bg3:#0d1020;
  --text:#dde0f0;--text2:#6a6e90;--text3:#2e3050;
  --border:rgba(255,255,255,0.07);
  --mono:'Space Mono',monospace;--sans:'Inter',-apple-system,sans-serif;
}
html,body{width:100%;min-height:100%;background:var(--bg);color:var(--text);font-family:var(--sans)}

#toolbar{
  position:fixed;top:0;left:0;right:0;height:50px;z-index:200;
  background:rgba(6,7,14,0.98);border-bottom:1px solid var(--border);
  display:flex;align-items:center;padding:0 20px;gap:10px;
}
#toolbar h1{font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;flex:1;color:var(--text);white-space:nowrap}
#toolbar h1 span{color:var(--text3);font-weight:400}

#page{padding:90px 32px 80px;max-width:900px;margin:0 auto}
@media(max-width:600px){#page{padding:76px 18px 60px}}

.eyebrow{font-family:var(--mono);font-size:8.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:12px;display:block}
.page-title{font-size:clamp(22px,4vw,34px);font-weight:600;line-height:1.2;margin-bottom:16px}
.page-intro{font-size:14px;color:var(--text2);line-height:1.75;max-width:680px;margin-bottom:48px}
.page-intro p+p{margin-top:10px}

.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:680px){.grid{grid-template-columns:1fr}}

.card{
  display:block;text-decoration:none;
  background:var(--bg3);border:1px solid var(--border);border-radius:10px;
  padding:24px 22px;transition:all 0.2s;position:relative;overflow:hidden;
}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;opacity:0;transition:opacity 0.2s}
.card:hover{border-color:rgba(255,255,255,0.16);background:rgba(13,16,32,0.9);transform:translateY(-2px)}
.card:hover::before{opacity:1}
.card.c1::before{background:#6c8ebf}
.card.c2::before{background:#7cb87c}
.card.c3::before{background:#c4a84f}
.card.c4::before{background:#e8c060}

.card-num{font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;display:block}
.card-icon{font-size:22px;margin-bottom:10px;display:block}
.card-title{font-size:15px;font-weight:600;margin-bottom:8px;line-height:1.3}
.card.c1 .card-title{color:#6c8ebf}
.card.c2 .card-title{color:#7cb87c}
.card.c3 .card-title{color:#c4a84f}
.card.c4 .card-title{color:#e8c060}
.card-desc{font-size:12px;color:var(--text2);line-height:1.65}
.card-arrow{position:absolute;bottom:20px;right:20px;font-family:var(--mono);font-size:11px;color:var(--text3);transition:color 0.2s}
.card:hover .card-arrow{color:var(--text2)}

.divider{border-top:1px solid var(--border);margin:48px 0 36px}
.section-label{font-family:var(--mono);font-size:8.5px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);margin-bottom:20px;display:block}
.hyp-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
@media(max-width:680px){.hyp-grid{grid-template-columns:1fr}}
.hyp{background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:16px 15px}
.hyp-num{font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;display:block}
.hyp-text{font-size:12px;color:var(--text2);line-height:1.65;font-style:italic}

.site-nav{display:flex;gap:5px;flex-wrap:wrap;align-items:center;flex-shrink:0}
.sn{font-family:monospace;font-size:8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:4px 9px;border:1px solid rgba(255,255,255,.08);border-radius:3px;background:transparent;color:#5a5e78;text-decoration:none;white-space:nowrap;transition:all .15s}
.sn:hover{border-color:rgba(255,255,255,.25);color:#dde0f0}
.sn.sn-home{border-color:rgba(108,142,191,.3);color:#6c8ebf}
.sn.sn-home:hover{background:rgba(108,142,191,.08);border-color:#6c8ebf}
.sn.sn-active{background:rgba(255,255,255,.07);color:#dde0f0;border-color:rgba(255,255,255,.18)}
@media(max-width:780px){.sn{font-size:7px;padding:3px 7px}}
@media(max-width:520px){.site-nav .sn-label{display:none}.sn{padding:4px 7px}}
      `}</style>

      <div id="toolbar">
        <h1>
          HYPERSCALE DATA CENTER <span>/ Intelligence System</span>
        </h1>
        <Nav />
      </div>

      <div id="page">
        <span className="eyebrow">Pursuit Cycle 2 — Industry Intelligence Project</span>
        <h2 className="page-title">
          Hyperscale Data Center
          <br />
          Intelligence System
        </h2>
        <div className="page-intro">
          <p>
            This project combines four analytical perspectives on the same subject: how hyperscale
            data centers become state-supported developments, who controls the process, how decisions
            sequence over time, and where the fastest growth pressure is emerging right now.
          </p>
          <p>
            The four tools work as a set. The maps reveal system relationships and hidden power
            structures. The timeline traces the full development sequence from market demand to
            decommissioning. The growth pressure chart tests the hypothesis that the largest markets
            are not the fastest-growing — and identifies where infrastructure conflicts may emerge
            next.
          </p>
        </div>

        <div className="grid">
          <a className="card c1" href="/hub-map">
            <span className="card-num">View 01</span>
            <span className="card-icon">🕸</span>
            <div className="card-title">Hub & Spoke Intelligence Map</div>
            <p className="card-desc">
              Ten sectors radiate from the data center hub. Click any sector to expand sub-nodes and
              read the full intelligence brief — what each actor controls, wants, provides, receives,
              and where litigation exposure exists.
            </p>
            <span className="card-arrow">→</span>
          </a>
          <a className="card c2" href="/hybrid-map">
            <span className="card-num">View 02</span>
            <span className="card-icon">⚙</span>
            <div className="card-title">Hybrid Intelligence Map</div>
            <p className="card-desc">
              Three views in one. Hub & Spoke, Control Layers A–H (the power architecture from
              strategic intent to legal challenge), and Cross-Section showing how each sector
              connects across all eight layers.
            </p>
            <span className="card-arrow">→</span>
          </a>
          <a className="card c3" href="/timeline">
            <span className="card-num">View 03</span>
            <span className="card-icon">⟶</span>
            <div className="card-title">Linear Development Timeline</div>
            <p className="card-desc">
              Eleven phases, four decision gates, six parallel swimlanes — Main Flow, Land, Utility,
              Regulatory, Financial, and Litigation. Scroll right through time to see how every
              track runs simultaneously, not sequentially.
            </p>
            <span className="card-arrow">→</span>
          </a>
          <a className="card c4" href="/growth-pressure">
            <span className="card-num">View 04</span>
            <span className="card-icon">📊</span>
            <div className="card-title">Growth Pressure</div>
            <p className="card-desc">
              Planned-to-operating ratio across the top 15 U.S. markets. Georgia and Indiana have
              more facilities planned than operating. The largest markets are not the fastest-growing
              — and the fastest-growing are where the next infrastructure conflicts will emerge.
            </p>
            <span className="card-arrow">→</span>
          </a>
        </div>

        <div className="divider"></div>

        <span className="section-label">Hypotheses tested in this project</span>
        <div className="hyp-grid">
          <div className="hyp">
            <span className="hyp-num">Hypothesis 1</span>
            <p className="hyp-text">
              "Virginia has a disproportionate share of planned facilities relative to its
              already-dominant operating count, because the Northern Virginia market is so
              infrastructure-dense that new entrants are still targeting it despite saturation."
            </p>
          </div>
          <div className="hyp">
            <span className="hyp-num">Hypothesis 2</span>
            <p className="hyp-text">
              "Republican-leaning states in the top 15 have more planned facilities as a percentage
              of their total than Democrat-leaning states, because lower regulatory friction and
              aggressive tax incentive packages are pulling future development toward those markets."
            </p>
          </div>
          <div className="hyp">
            <span className="hyp-num">Hypothesis 3 — tested in Growth Pressure</span>
            <p className="hyp-text">
              "The planned-to-operating ratio is a better predictor of where grid stress and
              community conflict will emerge than total facility count, because it is the planned
              pipeline — not the established base — that reveals where the next round of land,
              water, and utility fights will happen."
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
