import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@100;300;400&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#06070e;--bg2:#0a0c18;--bg3:#0d1020;
  --text:#dde0f0;--text2:#6a6e90;--text3:#2e3050;
  --border:rgba(255,255,255,0.07);
  --mono:'Space Mono',monospace;--sans:'Inter',-apple-system,sans-serif;
}
html[data-theme='light']{
  --bg:#f3f6fb;--bg2:#ffffff;--bg3:#ffffff;
  --text:#2D2B55;--text2:#5A587A;--text3:#8A88AA;
  --border:rgba(15,23,42,0.16);
}
html,body{width:100%;min-height:100%;background:var(--bg);color:var(--text);font-family:var(--sans)}

  .hero{position:relative;height:100vh;width:100%;overflow:hidden;display:flex;flex-direction:column;justify-content:center}
  .hero video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.65;filter:grayscale(15%) contrast(1.05)}
  .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center, rgba(5,5,5,0) 0%, rgba(5,5,5,0.55) 68%, rgba(5,5,5,0.92) 100%);z-index:1}
  .hero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.1) 22%, rgba(5,5,5,0.15) 70%, rgba(5,5,5,0.85) 100%);z-index:1}

  .hero-nav{position:fixed;top:0;left:0;right:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:34px 5vw;background:transparent;font-weight:300}
  .hero-nav-mark{font-family:'Jost',sans-serif;font-weight:100;font-size:21px;letter-spacing:0.13em;text-transform:uppercase;color:#f4f2ec}
  .hero-nav-mark span{color:#c9a84c}
  .hero-nav-links{display:flex;gap:32px;list-style:none;margin:0;padding:0}
  .hero-nav-links a{color:#f4f2ec;text-decoration:none;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;font-weight:300;opacity:0.82;position:relative;padding-bottom:6px;transition:opacity 0.3s ease}
  .hero-nav-links a::after{content:'';position:absolute;left:0;bottom:0;width:0%;height:1px;background:#C8A020;transition:width 0.35s ease}
  .hero-nav-links a:hover{opacity:1}
  .hero-nav-links a:hover::after{width:100%}
  .hero-nav-links a.active{opacity:1}
  .hero-nav-links a.active::after{width:100%}

  .hero-content{position:relative;z-index:5;padding:0 6vw;display:flex;flex-direction:column;align-items:flex-start}
  .eyebrow-line{display:flex;align-items:center;gap:18px;margin-bottom:16px}
  .eyebrow-line .rule{width:46px;height:1px;background:#C8A020}
  .word-intelligence{font-family:'Jost',sans-serif;font-weight:100;font-size:clamp(26px,2.56vw,35px);letter-spacing:0.5em;text-transform:uppercase;color:#c9a84c}
  .word-system{font-family:'Jost',sans-serif;font-weight:100;font-size:clamp(110px,17.25vw,276px);line-height:0.86;letter-spacing:-0.01em;color:#f4f2ec;margin:6px 0 28px 0;text-transform:uppercase}
  .gold-rule{width:100%;max-width:560px;height:1px;background:linear-gradient(90deg, #C8A020 0%, rgba(200,160,32,0.15) 100%);margin-bottom:30px}
  .slogan{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;font-size:clamp(26px,2.86vw,39px);color:#f4f2ec;max-width:640px;line-height:1.4;opacity:0.92}

  @media(max-width:720px){
    .hero-nav{padding:24px 6vw}
    .hero-nav-links{display:none}
    .hero-nav-mark{font-size:18px}
    .word-system{font-size:clamp(64px,22vw,120px)}
    .slogan{font-size:18px}
  }

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
html[data-theme='light'] .card:hover{border-color:rgba(15,23,42,0.28);background:#f8fbff}
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
html[data-theme='light'] .card.c1 .card-title{color:#4a6ea8}
html[data-theme='light'] .card.c2 .card-title{color:#4a8a5a}
html[data-theme='light'] .card.c3 .card-title{color:#8B6E1A}
html[data-theme='light'] .card.c4 .card-title{color:#8B6E1A}
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

  .card:focus-visible,.hero-nav-links a:focus-visible{
  outline:2px solid #1d4ed8;
  outline-offset:2px;
}
      `}</style>

        <section className="hero">
          <video autoPlay muted loop playsInline>
            <source src="/Videos/hero-2907.mp4" type="video/mp4" />
            <source src="/Videos/hero-2930.mp4" type="video/mp4" />
          </video>

          <nav className="hero-nav">
            <div className="hero-nav-mark">Hyperscale <span>&mdash;</span> Data Center</div>
            <ul className="hero-nav-links">
              <li><NavLink to="/hub-map" className={({ isActive }) => isActive ? 'active' : ''}>Hub Map</NavLink></li>
              <li><NavLink to="/hybrid-map" className={({ isActive }) => isActive ? 'active' : ''}>Hybrid Map</NavLink></li>
              <li><NavLink to="/timeline" className={({ isActive }) => isActive ? 'active' : ''}>Timeline</NavLink></li>
              <li><NavLink to="/growth-pressure" className={({ isActive }) => isActive ? 'active' : ''}>Growth Pressure</NavLink></li>
              <li><NavLink to="/data-query" className={({ isActive }) => isActive ? 'active' : ''}>Data Query</NavLink></li>
              <li><NavLink to="/research" className={({ isActive }) => isActive ? 'active' : ''}>Research</NavLink></li>
            </ul>
          </nav>

          <div className="hero-content">
            <div className="eyebrow-line">
              <div className="rule"></div>
              <div className="word-intelligence">Intelligence</div>
            </div>
            <div className="word-system">System</div>
            <div className="gold-rule"></div>
            <p className="slogan">By the time it's public, it's already done.<br />Not anymore.</p>
          </div>
        </section>

      <div id="page">
        <span className="eyebrow">Pursuit Cycle 2 — Industry Intelligence Project</span>
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
