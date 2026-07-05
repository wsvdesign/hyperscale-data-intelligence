import { useEffect, useRef, useState } from 'react';
import Nav from './Nav';

const HYBRID_MAP_STYLES = `
*{box-sizing:border-box;margin:0;padding:0}
.hybrid-map-page{background:#07080f;color:#e8e9f0;font-family:Inter,-apple-system,sans-serif;overflow:hidden;width:100vw;height:100vh}
:root{--hy-main:#e8e9f0;--hy-sub:#b3bdd8;--hy-muted:#98a3c2;--hy-faint:#8792b3}
html[data-theme='light'] .hybrid-map-page{background:#f3f6fb;color:#0f172a;--bg:#f3f6fb;--hy-main:#0f172a;--hy-sub:#334155;--hy-muted:#475569;--hy-faint:#64748b}
#hybrid-sub-row{position:fixed;top:52px;left:0;right:0;height:38px;z-index:299;background:rgba(13,16,32,0.99);border-bottom:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;padding:0 18px;gap:8px;}
html[data-theme='light'] #hybrid-sub-row{background:rgba(232,237,245,0.99);border-bottom:1px solid rgba(15,23,42,0.14);}
.hybrid-map-page #toolbar{position:fixed;top:0;left:0;right:0;height:52px;z-index:300;background:rgba(7,8,15,.98);border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;padding:0 18px;gap:10px}
.hybrid-map-page #toolbar h1{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;flex:1;white-space:nowrap}
.hybrid-map-page #toolbar h1 span{color:var(--hy-faint)}
html[data-theme='light'] #hybrid-sub-row{position:fixed;top:52px;left:0;right:0;height:38px;z-index:299;background:rgba(13,16,32,0.99);border-bottom:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;padding:0 18px;gap:8px;}
html[data-theme='light'] #hybrid-sub-row{background:rgba(232,237,245,0.99);border-bottom:1px solid rgba(15,23,42,0.14);}
.hybrid-map-page #toolbar{background:rgba(7,8,15,.98);border-bottom:1px solid rgba(255,255,255,.07)}
.hybrid-map-page .mg{display:flex;border:1px solid rgba(255,255,255,.1);border-radius:5px;overflow:hidden;flex-shrink:0}
.hybrid-map-page .mb{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:5px 14px;background:transparent;color:var(--hy-sub);cursor:pointer;border:none;border-right:1px solid rgba(255,255,255,.07);transition:all .2s;white-space:nowrap}
.hybrid-map-page .mb:last-child{border-right:none}
.hybrid-map-page .mb.on{background:rgba(255,255,255,.09);color:#e8e9f0}
.hybrid-map-page .mb:hover:not(.on){color:#8a8eb0}
.hybrid-map-page .tb{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:5px 12px;border:1px solid rgba(255,255,255,.1);border-radius:4px;background:transparent;color:var(--hy-sub);cursor:pointer;transition:all .2s;white-space:nowrap}
.hybrid-map-page .tb:hover{border-color:rgba(255,255,255,.3);color:#e8e9f0}
.hybrid-map-page .tb.lit{border-color:#ff4444;color:#ff4444;background:rgba(255,68,68,.1)}
html[data-theme='light'] .hybrid-map-page .mg{border-color:rgba(15,23,42,.18)}
html[data-theme='light'] .hybrid-map-page .mb{background:var(--bg);color:var(--hy-sub);border-right-color:rgba(15,23,42,.14)}
html[data-theme='light'] .hybrid-map-page .mb.on{background:#e2e8f0;color:var(--hy-main)}
html[data-theme='light'] .hybrid-map-page .mb:hover:not(.on){color:var(--hy-main)}
html[data-theme='light'] .hybrid-map-page .tb{background:var(--bg);border-color:rgba(15,23,42,.22);color:var(--hy-sub)}
html[data-theme='light'] .hybrid-map-page .tb:hover{border-color:rgba(15,23,42,.4);color:var(--hy-main)}
.hybrid-map-page #mstrip{position:fixed;top:52px;left:0;right:0;height:3px;z-index:299;transition:background .3s}
.hybrid-map-page .view{position:fixed;top:90px;left:0;right:0;bottom:0;display:none}
.hybrid-map-page .view.on{display:block}
.hybrid-map-page #vhub,.hybrid-map-page #vcross{background:#07080f;cursor:grab}
.hybrid-map-page #vhub canvas,.hybrid-map-page #vcross canvas{display:block;width:100%;height:100%}
.hybrid-map-page #vlayers{background:#07080f;overflow-y:auto;overflow-x:hidden}
html[data-theme='light'] .hybrid-map-page #vhub,html[data-theme='light'] .hybrid-map-page #vcross,html[data-theme='light'] .hybrid-map-page #vlayers{background:#f3f6fb}
.hybrid-map-page .lpage{max-width:760px;margin:0 auto;padding:44px 36px 100px}
.hybrid-map-page .lpage-title{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--hy-faint);margin-bottom:28px;display:block}
.hybrid-map-page .lrow{display:flex;gap:0;margin-bottom:0}
.hybrid-map-page .lspine{width:44px;flex-shrink:0;display:flex;flex-direction:column;align-items:center}
.hybrid-map-page .lletter{width:34px;height:34px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;z-index:1;position:relative;flex-shrink:0}
.hybrid-map-page .lline{flex:1;width:1px;margin:0 auto}
.hybrid-map-page .lconnector{height:22px;display:flex;align-items:center;justify-content:center;margin-left:21px}
.hybrid-map-page .lconnector-inner{width:1px;height:100%;position:relative}
.hybrid-map-page .lconnector-arrow{position:absolute;bottom:-5px;left:-4px;color:rgba(255,255,255,.1);font-size:9px}
.hybrid-map-page .lconnector-inner.lit{width:0;border-left:1.5px dashed rgba(255,68,68,.45)}
.hybrid-map-page .lconnector-inner.lit .lconnector-arrow{color:rgba(255,68,68,.6)}
.hybrid-map-page .lcard{flex:1;margin-left:14px;margin-bottom:6px;border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:15px 17px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.hybrid-map-page .lcard:hover{border-color:rgba(255,255,255,.14);background:rgba(255,255,255,.02)}
.hybrid-map-page .lcard.exp{border-color:rgba(255,255,255,.18)!important}
.hybrid-map-page .lcard.lit{box-shadow:inset 0 0 0 1px rgba(255,68,68,.2)}
.hybrid-map-page .lcard-bar{position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:8px 0 0 8px}
.hybrid-map-page .lcard-head{display:flex;gap:10px;align-items:flex-start}
.hybrid-map-page .lcard-name{font-size:13px;font-weight:600;margin-bottom:4px;line-height:1.3}
.hybrid-map-page .lcard-desc{font-size:11px;color:#5a5e78;line-height:1.6}
.hybrid-map-page .lcard-actors{display:flex;gap:5px;flex-wrap:wrap;margin-left:auto;flex-shrink:0;align-items:flex-start}
.hybrid-map-page .achip{font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:3px 7px;border-radius:3px;white-space:nowrap}
.hybrid-map-page .lnodes{margin-top:13px;padding-top:13px;border-top:1px solid rgba(255,255,255,.05);display:none;flex-wrap:wrap;gap:5px}
.hybrid-map-page .lnodes.op{display:flex}
.hybrid-map-page .lnode{font-size:10px;color:#3a3e58;border:1px solid rgba(255,255,255,.06);padding:4px 9px;border-radius:3px}
.hybrid-map-page .lwhy{margin-top:10px;font-size:11px;color:#4a4e68;line-height:1.6;font-style:italic;display:none}
.hybrid-map-page .lwhy.op{display:block}
.hybrid-map-page #panel{position:fixed;top:52px;right:-430px;bottom:0;width:420px;background:#0d1020;border-left:1px solid rgba(255,255,255,.06);transition:right .3s ease;z-index:250;display:flex;flex-direction:column;overflow:hidden}
.hybrid-map-page #panel.op{right:0}
.hybrid-map-page #ph{padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0;position:relative}
.hybrid-map-page #pt{font-size:8px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;display:block;margin-bottom:6px}
.hybrid-map-page #pn{font-size:15px;font-weight:700;line-height:1.35}
.hybrid-map-page #ps{font-size:12px;color:var(--hy-sub);margin-top:5px;line-height:1.55}
.hybrid-map-page #pc{position:absolute;top:14px;right:18px;width:26px;height:26px;border:1px solid rgba(255,255,255,.1);border-radius:4px;background:transparent;color:var(--hy-sub);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center}
.hybrid-map-page #pc:hover{color:#e8e9f0;border-color:rgba(255,255,255,.3)}
html[data-theme='light'] .hybrid-map-page #panel{background:var(--bg);border-left:1px solid rgba(15,23,42,.14)}
.hybrid-map-page #pb{flex:1;overflow-y:auto;padding:18px 22px}
.hybrid-map-page .ss{margin-bottom:18px}
.hybrid-map-page .sl{font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--hy-faint);display:block;margin-bottom:7px}
.hybrid-map-page .sp{font-size:12px;color:var(--hy-sub);line-height:1.65}
.hybrid-map-page .ir{display:flex;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:11px}
.hybrid-map-page .ik{color:var(--hy-faint);min-width:80px;flex-shrink:0;font-size:9px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding-top:1px}
.hybrid-map-page .iv{color:var(--hy-sub);line-height:1.55}
.hybrid-map-page .tgs{display:flex;flex-wrap:wrap;gap:4px;margin-top:3px}
.hybrid-map-page .tg{font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:3px 7px;border-radius:3px}
.hybrid-map-page .tg-c{background:rgba(255,68,68,.12);color:#ff7070;border:1px solid rgba(255,68,68,.25)}
.hybrid-map-page .tg-p{background:rgba(76,178,76,.12);color:#6ed06e;border:1px solid rgba(76,178,76,.25)}
.hybrid-map-page .tg-r{background:rgba(200,150,50,.12);color:#d4a040;border:1px solid rgba(200,150,50,.25)}
.hybrid-map-page .tg-t{background:rgba(100,140,210,.12);color:#80a8e8;border:1px solid rgba(100,140,210,.25)}
.hybrid-map-page .tg-risk{background:rgba(150,80,200,.1);color:#b070d8;border:1px solid rgba(150,80,200,.2)}
.hybrid-map-page .dc{font-size:10px;color:var(--hy-muted);padding:5px 8px;border:1px solid rgba(255,255,255,.08);border-radius:3px;margin-bottom:3px;display:flex;gap:6px}
.hybrid-map-page .dc::before{content:'▸';flex-shrink:0;color:var(--hy-faint)}
.hybrid-map-page .li{font-size:11px;color:rgba(255,80,80,.75);padding:5px 0;border-bottom:1px solid rgba(255,68,68,.07);display:flex;gap:6px;line-height:1.5}
.hybrid-map-page .li:last-child{border-bottom:none}
.hybrid-map-page .ld{color:#ff4444;flex-shrink:0}
.hybrid-map-page .qi{font-size:11px;color:rgba(255,195,60,.8);padding:5px 0;border-bottom:1px solid rgba(255,195,60,.06);display:flex;gap:5px;line-height:1.5}
.hybrid-map-page .qi:last-child{border-bottom:none}
.hybrid-map-page .qm{color:rgba(255,195,60,.45);flex-shrink:0;font-weight:700}
.hybrid-map-page .lci{padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)}
.hybrid-map-page .lci:last-child{border-bottom:none}
.hybrid-map-page .lcl{font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:3px;display:block}
.hybrid-map-page .lch{font-size:11px;color:var(--hy-sub);line-height:1.55}
.hybrid-map-page #legend{position:fixed;left:16px;bottom:16px;z-index:200;background:rgba(13,16,32,.95);border:1px solid rgba(255,255,255,.06);border-radius:6px;padding:12px 14px}
.hybrid-map-page #legend h3{font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--hy-faint);margin-bottom:9px}
.hybrid-map-page .leg{display:flex;align-items:center;gap:7px;font-size:9px;color:var(--hy-sub);margin-bottom:5px}
html[data-theme='light'] .hybrid-map-page #legend{background:var(--bg);border:1px solid rgba(15,23,42,.16)}
.hybrid-map-page .lc{width:11px;height:11px;border-radius:50%;flex-shrink:0}
.hybrid-map-page .ll{width:16px;height:1.5px;flex-shrink:0}
.hybrid-map-page .ld2{width:16px;height:0;border-top:1.5px dashed #ff4444;flex-shrink:0}
.hybrid-map-page .lsep{border-top:1px solid rgba(255,255,255,.04);margin:6px 0}
.hybrid-map-page #zb{position:fixed;right:16px;bottom:16px;z-index:200;display:flex;flex-direction:column;gap:4px}
.hybrid-map-page .zbt{width:30px;height:30px;border:1px solid rgba(255,255,255,.1);border-radius:4px;background:rgba(13,16,32,.9);color:var(--hy-sub);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.hybrid-map-page .zbt:hover{color:#e8e9f0;border-color:rgba(255,255,255,.25)}
html[data-theme='light'] .hybrid-map-page .zbt{background:var(--bg);border-color:rgba(15,23,42,.22);color:var(--hy-sub)}
html[data-theme='light'] .hybrid-map-page .zbt:hover{border-color:rgba(15,23,42,.45);color:var(--hy-main)}
.hybrid-map-page #hint{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#1a1d30;pointer-events:none;transition:opacity 1s;z-index:100;white-space:nowrap}
html[data-theme='light'] .hybrid-map-page #hint{color:var(--hy-faint)}
.hybrid-map-page .site-nav{display:flex;gap:5px;flex-wrap:wrap;align-items:center;flex-shrink:0}
.hybrid-map-page .sn{font-family:monospace;font-size:8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:4px 9px;border:1px solid rgba(255,255,255,.08);border-radius:3px;background:transparent;color:#5a5e78;text-decoration:none;white-space:nowrap;transition:all .15s}
.hybrid-map-page .sn:hover{border-color:rgba(255,255,255,.25);color:#dde0f0}
.hybrid-map-page .sn.sn-home{border-color:rgba(108,142,191,.3);color:#6c8ebf}
.hybrid-map-page .sn.sn-home:hover{background:rgba(108,142,191,.08);border-color:#6c8ebf}
.hybrid-map-page .sn.sn-active{background:rgba(255,255,255,.07);color:#dde0f0;border-color:rgba(255,255,255,.18)}
@media(max-width:780px){.hybrid-map-page .sn{font-size:7px;padding:3px 7px}}
@media(max-width:520px){.hybrid-map-page .site-nav .sn-label{display:none}.hybrid-map-page .sn{padding:4px 7px}}
`;

const SECTORS = [
  {
    id: 'dev',
    label: 'Developer\n/ Hyperscaler',
    icon: '🏢',
    color: '#6c8ebf',
    angle: 0,
    pl: 'A',
    controls: 'Site selection, capital allocation, project code names, LLC structures',
    wants: 'Power, land, tax incentives, water, fiber, permitting speed',
    provides: 'Capital investment, jobs promise, technology positioning',
    receives: 'Tax exemptions, infrastructure, utility agreements, political support',
    transp: 'CONFIDENTIAL — initial recruitment, land options, LLC identity',
    risks: ['Schedule risk', 'Grid risk', 'Political risk', 'Reputational risk'],
    docs: ['Project code-name file', 'NDA with state', 'Site-selection RFI', 'Land options via LLC', 'Load request to utility', 'Incentive application', 'Performance agreement'],
    lit: ['LLC identity challenge via FOIA', 'Land option disclosure dispute', 'Breach of incentive agreement', 'Failure to meet job thresholds'],
    qs: ['Was full buildout scale disclosed?', 'Who controls the shell LLCs?', 'Is project phased to avoid review thresholds?'],
    lc: [
      { l: 'B', h: 'Approaches state econ-dev agency under NDA; project code name assigned' },
      { l: 'C', h: 'Shell LLCs assemble parcels before public announcement' },
      { l: 'D', h: 'Load request to utility; fiber and road routing determined' },
      { l: 'F', h: 'REIT or co-location structure chosen; tax credits layered' },
    ],
    subs: [
      { id: 'hyper', label: 'Hyperscaler', icon: '☁', tag: 'CONF', tc: 'tg-c', detail: 'Amazon, Microsoft, Google, Meta, Oracle. Conceals identity behind project code names and subsidiaries.' },
      { id: 'sitec', label: 'Site Consultant', icon: '📍', tag: 'PRIV', tc: 'tg-r', detail: 'Third-party firm issuing RFIs to states, negotiating confidentially under NDA.' },
      { id: 'sllc', label: 'Shell LLC', icon: '🔲', tag: 'CONF', tc: 'tg-c', detail: 'Anonymous entity assembling land parcels without revealing buyer identity or project scale.' },
      { id: 'redev', label: 'RE Developer', icon: '🏗', tag: 'PRIV', tc: 'tg-r', detail: 'May construct the facility and lease to hyperscaler, keeping ownership off public record.' },
    ],
  },
  {
    id: 'state',
    label: 'State\nGovernment',
    icon: '🏛',
    color: '#7cb87c',
    angle: 36,
    pl: 'B',
    controls: 'Tax exemptions, economic development incentives, environmental permits, utility regulation',
    wants: 'Capital investment, job announcements, AI/tech positioning',
    provides: 'Tax exemptions, infrastructure grants, fast-track permitting',
    receives: 'Investment commitments, job pledges, construction activity',
    transp: 'PARTIALLY DISCLOSED — incentive negotiations confidential until approved',
    risks: ['Political risk', 'Financial risk — foregone tax revenue', 'Reputational risk'],
    docs: ['RFI response', 'Confidentiality agreement', 'Incentive application', 'Tax exemption certification', 'Performance agreement', 'Clawback agreement'],
    lit: ['Tax incentive clawback dispute', 'Open meetings challenge', 'FOIA for NDA and RFI records', 'Constitutional challenge to tax exemption'],
    qs: ['Were projections independently verified?', 'What taxes are waived over 10+ years?', 'Can state recover incentives if thresholds missed?'],
    lc: [
      { l: 'A', h: 'Receives confidential RFI; prepares site and incentive package under NDA' },
      { l: 'E', h: 'Issues or delegates air, water, wetlands, and environmental permits' },
      { l: 'F', h: 'Negotiates performance agreement, clawback provisions, statutory exemptions' },
      { l: 'G', h: 'Controls what job and investment data is publicly reported' },
    ],
    subs: [
      { id: 'gov', label: "Governor's\nOffice", icon: '⭐', tag: 'CONF', tc: 'tg-c', detail: 'First contact. Governor may personally recruit projects under NDA. Announcement timed for political benefit.' },
      { id: 'econ', label: 'Econ Dev\nAgency', icon: '📊', tag: 'CONF', tc: 'tg-c', detail: 'Prepares incentive package, manages confidential negotiations, drafts performance and clawback agreements.' },
      { id: 'tax', label: 'Tax Dept', icon: '💲', tag: 'PART', tc: 'tg-t', detail: 'Administers statutory exemptions. Individual project data sometimes aggregated in public reports.' },
      { id: 'leg', label: 'Legislature', icon: '📜', tag: 'PUB', tc: 'tg-p', detail: 'Creates enabling legislation. Votes are public but often framed as general business incentives.' },
    ],
  },
  {
    id: 'local',
    label: 'Local\nGovernment',
    icon: '🏘',
    color: '#b87c6c',
    angle: 72,
    pl: 'E',
    controls: 'Zoning, land-use permits, site plan approval, development agreements, annexation',
    wants: 'Tax base, construction jobs, county investment, infrastructure upgrades',
    provides: 'Rezoning, special-use permits, development agreements, road access',
    receives: 'Tax revenue net of abatements, infrastructure contributions',
    transp: 'PUBLIC — zoning hearings public, but often after major commitments already made',
    risks: ['Political risk', 'Community risk', 'Land risk — deed restrictions'],
    docs: ['Zoning application', 'Special-use permit', 'Site plan', 'Development agreement', 'Infrastructure reimbursement agreement', 'Annexation petition'],
    lit: ['Zoning appeal by neighbors', 'Special-use permit challenge', 'Open meetings violation', 'Deed restriction enforcement'],
    qs: ['Who builds the roads and water lines?', 'Can residents challenge the decision?', 'Is farmland permanently removed?'],
    lc: [
      { l: 'C', h: 'Rezoning and annexation convert agricultural land to industrial use' },
      { l: 'D', h: 'Commits municipal water and sewer; grants road access for utility corridors' },
      { l: 'G', h: 'First to absorb noise, traffic, groundwater, and community burden' },
      { l: 'H', h: 'Primary defendant in zoning appeals, deed restriction claims, open meetings challenges' },
    ],
    subs: [
      { id: 'council', label: 'City / County\nBoard', icon: '🗳', tag: 'PUB', tc: 'tg-p', detail: 'Votes on rezoning and development agreements. Public vote but often after the done-deal sequence.' },
      { id: 'plan', label: 'Planning\nCommission', icon: '📐', tag: 'PUB', tc: 'tg-p', detail: 'Reviews zoning applications. Hearings are public. Neighbors may testify.' },
      { id: 'build', label: 'Building Dept', icon: '🔧', tag: 'PUB', tc: 'tg-p', detail: 'Issues construction permits. Phased projects receive separate permits per building, obscuring total scale.' },
      { id: 'town', label: 'Township /\nCounty', icon: '🗺', tag: 'PUB', tc: 'tg-p', detail: 'May have initial land-use authority. Annexation can rapidly shift authority to municipality.' },
    ],
  },
  {
    id: 'land',
    label: 'Landowners\n/ Community',
    icon: '🌾',
    color: '#c4a84f',
    angle: 108,
    pl: 'C',
    controls: 'Deed restrictions, voluntary sale decisions, water rights, agricultural use, legal standing',
    wants: 'Fair price, transparency about buyer, protection of deed conditions',
    provides: 'Land, water rights, political legitimacy, community opposition or support',
    receives: 'Purchase price, displacement pressure, possible eminent domain on infrastructure',
    transp: 'PRIVATE — land option terms confidential until deed recording',
    risks: ['Land risk', 'Water risk', 'Community risk — displacement'],
    docs: ['Land option agreement', 'Purchase and sale agreement', 'Deed restrictions', 'Easement agreements', 'Eminent domain filing'],
    lit: ['Deed restriction enforcement', 'Groundwater injury claim', 'Eminent domain challenge', 'Nuisance and noise claims'],
    qs: ['Was eminent domain used directly or indirectly?', 'Is farmland permanently removed?', 'Did LLC concealment prevent fair pricing?'],
    lc: [
      { l: 'C', h: 'Primary subject of land assembly — options, purchase, easements' },
      { l: 'G', h: 'Permanent farmland loss and displacement are direct public consequences' },
      { l: 'H', h: 'May bring deed restriction claims, groundwater injury suits, nuisance actions' },
    ],
    subs: [
      { id: 'farm', label: 'Farmer /\nLandowner', icon: '🌱', tag: 'PRIV', tc: 'tg-r', detail: 'LLC-based assembly prevents sellers from understanding full project scale, limiting negotiating power.' },
      { id: 'comm', label: 'Community\nGroups', icon: '👥', tag: 'PUB', tc: 'tg-p', detail: 'May testify at hearings, file FOIA requests, fund legal challenges.' },
      { id: 'wtr', label: 'Water Rights', icon: '💧', tag: 'PRIV', tc: 'tg-r', detail: 'Agricultural water rights may be implicated by large industrial withdrawals.' },
      { id: 'deed', label: 'Deed\nRestrictions', icon: '📋', tag: 'PART', tc: 'tg-t', detail: 'Key litigation trigger. Taylor TX: farmer donated land for park; city sold to data-center developer.' },
    ],
  },
  {
    id: 'elec',
    label: 'Electric Utility\n/ Grid',
    icon: '⚡',
    color: '#8c6cb8',
    angle: 144,
    pl: 'D',
    controls: 'Power supply, interconnection queue, transmission capacity, substation locations, tariff structures',
    wants: 'Load growth revenue, cost recovery, ratepayer protection, schedule certainty',
    provides: 'Power supply, interconnection study, service agreement, approved tariff',
    receives: 'Infrastructure cost contributions, minimum monthly payments, long-term commitment',
    transp: 'PARTIALLY DISCLOSED — service agreements often redacted; tariff approved by PSC',
    risks: ['Grid risk', 'Financial risk — stranded infrastructure', 'Schedule risk'],
    docs: ['Load request letter', 'Interconnection/load study', 'Electric service agreement', 'Special tariff filing', 'PSC filing', 'Transmission upgrade plan'],
    lit: ['Utility rate case — ratepayer subsidy challenge', 'Transmission siting challenge', 'Cost-allocation dispute', 'PSC appeal'],
    qs: ['Who pays for substations and transmission upgrades?', 'Are ratepayers subsidizing data-center infrastructure?', 'Who bears grid risk if project abandoned?'],
    lc: [
      { l: 'A', h: 'Power availability is a primary site selection factor' },
      { l: 'D', h: 'Core utility actor — confirms capacity, builds infrastructure, prices service agreement' },
      { l: 'F', h: 'Minimum demand payments and infrastructure contributions enter financial model' },
      { l: 'G', h: 'Ratepayer exposure and grid strain are direct public consequences' },
    ],
    subs: [
      { id: 'util', label: 'Electric\nUtility', icon: '🔌', tag: 'PART', tc: 'tg-t', detail: 'Evaluates whether system can serve the load. Negotiates service agreement with minimum payments and termination charges.' },
      { id: 'grid', label: 'Grid Operator', icon: '📡', tag: 'PART', tc: 'tg-t', detail: 'Regional transmission organization (PJM, MISO) manages interconnection queue. Studies can take years.' },
      { id: 'psc', label: 'Public Service\nCommission', icon: '⚖', tag: 'PUB', tc: 'tg-p', detail: 'Regulates utility tariffs. Must approve cost allocation to ratepayers. Proceedings are public.' },
      { id: 'sub', label: 'Substation /\nTransmission', icon: '🔋', tag: 'PRIV', tc: 'tg-r', detail: 'New substations and lines may require easements across third-party land — potentially triggering eminent domain.' },
    ],
  },
  {
    id: 'water',
    label: 'Water &\nSewer',
    icon: '💧',
    color: '#4fa8b8',
    angle: 180,
    pl: 'D',
    controls: 'Water supply, withdrawal permits, wastewater discharge, treatment capacity, reclaimed water',
    wants: 'Revenue, infrastructure cost recovery, regulatory compliance',
    provides: 'Water availability letter, service agreement, sewer capacity',
    receives: 'Infrastructure contributions, connection fees, ongoing revenue',
    transp: 'PARTIALLY DISCLOSED — municipal use aggregated; private withdrawal permits may be public',
    risks: ['Water risk', 'Environmental risk — watershed', 'Regulatory risk'],
    docs: ['Water availability letter', 'Water service agreement', 'Sewer agreement', 'Water withdrawal permit', 'Wastewater discharge permit'],
    lit: ['Water withdrawal dispute — stream impact', 'Groundwater injury claim', 'Wastewater permit challenge', 'FOIA for facility-level water use'],
    qs: ['Is drinking water or reclaimed water used for cooling?', 'Was reclaimed water evaluated first?', 'Are cumulative watershed impacts reviewed?'],
    lc: [
      { l: 'D', h: 'Parallel utility dependency alongside electricity — negotiated simultaneously' },
      { l: 'E', h: 'Withdrawal and discharge permits issued by state environmental agency' },
      { l: 'G', h: 'Water demand and potable-vs-reclaimed choice are direct public consequences' },
      { l: 'H', h: 'Groundwater injury claims and stream impact disputes are active litigation pathways' },
    ],
    subs: [
      { id: 'mun', label: 'Municipal\nWater Auth', icon: '🚰', tag: 'PART', tc: 'tg-t', detail: 'Authority may hold the formal withdrawal permit, making facility-level water use invisible in public records.' },
      { id: 'pot', label: 'Potable Water', icon: '🥤', tag: 'PART', tc: 'tg-t', detail: 'Drinking-quality water used for cooling. Should drinking water be used for industrial cooling?' },
      { id: 'rec', label: 'Reclaimed\nWater', icon: '♻', tag: 'PART', tc: 'tg-t', detail: 'Treated wastewater reused for cooling. Not always evaluated before potable commitments are made.' },
      { id: 'gw', label: 'Groundwater\nWithdrawal', icon: '⛏', tag: 'PART', tc: 'tg-t', detail: 'Private wells at large scale require registration and possibly state permits. Can affect neighboring wells.' },
    ],
  },
  {
    id: 'env',
    label: 'Environmental\nRegulators',
    icon: '🌿',
    color: '#4fb87c',
    angle: 216,
    pl: 'E',
    controls: 'Air permits, water permits, wetlands jurisdiction, stormwater authorization, cumulative impact review',
    wants: 'Regulatory compliance, environmental protection, legal defensibility',
    provides: 'Air permits, water withdrawal permits, wetlands approvals, stormwater authorization',
    receives: 'Application fees, monitoring data, compliance reports',
    transp: 'PARTIALLY DISCLOSED — permit applications public; enforcement sometimes redacted',
    risks: ['Environmental risk', 'Legal risk — permit challenges', 'Regulatory risk — NEPA gap'],
    docs: ['Air permit application', 'Stormwater permit NPDES', 'Wastewater NPDES permit', 'Wetlands authorization', 'Generator emissions inventory'],
    lit: ['Air permit challenge — generator aggregation', 'Clean Water Act wetlands dispute', 'Stormwater violation', 'Cumulative impact review demand'],
    qs: ['Are generator emissions evaluated individually or as one source?', 'Are cumulative impacts reviewed if no federal nexus?', 'Does NEPA apply?'],
    lc: [
      { l: 'E', h: 'Issues permits — each a separate proceeding with its own public comment window' },
      { l: 'G', h: 'Generator emissions, water discharge, and wetlands loss are environmental public consequences' },
      { l: 'H', h: 'Environmental permits are primary targets for litigation by advocacy groups' },
    ],
    subs: [
      { id: 'senv', label: 'State Env\nAgency', icon: '🏭', tag: 'PUB', tc: 'tg-p', detail: 'Issues air, water, wetlands, and stormwater permits. Each is a separate proceeding. No cross-permit coordination.' },
      { id: 'epa', label: 'EPA / Federal', icon: '🇺🇸', tag: 'PUB', tc: 'tg-p', detail: 'NEPA applies only with a federal nexus. Private data centers may not trigger federal review despite cumulative impacts.' },
      { id: 'gen', label: 'Generator\nEmissions', icon: '🔥', tag: 'PART', tc: 'tg-t', detail: 'Hundreds of backup diesel generators may collectively constitute a major emission source. Evaluated individually or aggregated?' },
      { id: 'wet', label: 'Wetlands /\nStreams', icon: '🌊', tag: 'PUB', tc: 'tg-p', detail: 'Filling wetlands requires Clean Water Act Section 404 authorization. Army Corps may have jurisdiction.' },
    ],
  },
  {
    id: 'fin',
    label: 'Financial\nInstitutions',
    icon: '🏦',
    color: '#b84f8c',
    angle: 252,
    pl: 'F',
    controls: 'Project financing, bond issuance, equity investment, public authority financing, REIT structures',
    wants: 'Returns, security, tax efficiency, predictable cash flows',
    provides: 'Capital, debt financing, equity, bond issuance, tax-credit investment',
    receives: 'Interest, returns, tax benefits, performance guarantees',
    transp: 'PRIVATE — financing terms, investor identity, and bond covenants largely private',
    risks: ['Financial risk', 'Schedule risk', 'Legal risk — default or clawback'],
    docs: ['Loan agreement', 'Bond documents', 'Investment agreement', 'REIT structure filings', 'Tax credit agreements', 'Letter of credit'],
    lit: ['Bond default challenge', 'Clawback triggering investor loss', 'Tax credit recapture dispute', 'Public authority financing challenge'],
    qs: ['Is public authority financing being used?', 'Are tax-exempt bonds subsidizing private infrastructure?', 'Who bears financial risk if project abandoned?'],
    lc: [
      { l: 'B', h: 'Financing structure shapes the incentive asks — tax exemptions enter pro forma' },
      { l: 'F', h: 'Core layer — provides debt, equity, bond financing, and tax credit investment' },
      { l: 'G', h: 'Foregone tax revenue and public authority financing are direct public cost consequences' },
    ],
    subs: [
      { id: 'lend', label: 'Institutional\nLenders', icon: '💳', tag: 'PRIV', tc: 'tg-r', detail: 'Banks and infrastructure lenders provide project finance. Loan agreements are private.' },
      { id: 'eq', label: 'Private Equity\n/ REIT', icon: '📈', tag: 'PRIV', tc: 'tg-r', detail: 'Infrastructure funds and REITs increasingly finance data-center campuses.' },
      { id: 'pub', label: 'Public\nAuthority', icon: '🏛', tag: 'PART', tc: 'tg-t', detail: 'Industrial development authority may provide tax-exempt financing, triggering disclosure requirements.' },
      { id: 'tc', label: 'Tax Credits\n/ Bonds', icon: '🎫', tag: 'PART', tc: 'tg-t', detail: 'Federal and state tax credits and tax-exempt bonds may layer on top of direct incentives invisibly.' },
    ],
  },
  {
    id: 'infra',
    label: 'Contractors\n/ Infrastructure',
    icon: '🔩',
    color: '#b8874f',
    angle: 288,
    pl: 'D',
    controls: 'Construction timeline, labor sourcing, infrastructure specs, fiber/road routing, cooling design',
    wants: 'Contracts, timeline certainty, payment, site access',
    provides: 'Construction, electrical, plumbing, mechanical, fiber, roads, cooling',
    receives: 'Contract payments, subcontract work, maintenance contracts',
    transp: 'PRIVATE — contract terms private; labor conditions rarely disclosed',
    risks: ['Schedule risk', 'Community risk — labor displacement', 'Environmental risk'],
    docs: ['Construction contracts', 'Subcontract agreements', 'Labor compliance certifications', 'Construction stormwater permits', 'Building permits'],
    lit: ['Prevailing wage dispute', 'Construction lien claims', 'Environmental violation', 'Stormwater enforcement'],
    qs: ['Are local workers being hired?', 'Are prevailing wage requirements met?', 'Who owns infrastructure built at public expense?'],
    lc: [
      { l: 'D', h: 'Builds the physical infrastructure — substations, fiber, roads, cooling systems' },
      { l: 'E', h: 'Subject to building permits, stormwater permits, and labor compliance' },
      { l: 'G', h: 'Construction employment is the primary temporary public labor benefit' },
    ],
    subs: [
      { id: 'gc', label: 'General\nContractor', icon: '🏗', tag: 'PRIV', tc: 'tg-r', detail: 'Manages construction. Contract terms private. May receive infrastructure reimbursement from local government.' },
      { id: 'fr', label: 'Fiber / Roads', icon: '🛣', tag: 'PRIV', tc: 'tg-r', detail: 'Fiber and road infrastructure ownership determines who controls access after construction.' },
      { id: 'cool', label: 'Cooling\nSystems', icon: '❄', tag: 'PRIV', tc: 'tg-r', detail: 'Cooling technology choice determines water consumption. Made privately with major public consequences.' },
      { id: 'sec', label: 'Security /\nFencing', icon: '🔐', tag: 'PRIV', tc: 'tg-r', detail: 'High-security perimeters can fragment agricultural land and create barriers for neighboring properties.' },
    ],
  },
  {
    id: 'courts',
    label: 'Courts &\nAdmin Review',
    icon: '⚖',
    color: '#bf6c6c',
    angle: 324,
    pl: 'H',
    controls: 'Legal validity of permits, zoning decisions, incentive agreements, environmental approvals',
    wants: 'Legal compliance, procedural fairness, complete administrative record',
    provides: 'Injunctions, remand orders, enforcement, damage awards, settlement pressure',
    receives: 'Appeals, lawsuits, administrative filings, public records requests',
    transp: 'PUBLIC — court proceedings and records generally public after filing',
    risks: ['Legal risk', 'Schedule risk — injunctions halt construction', 'Financial risk'],
    docs: ['Zoning appeal', 'Environmental permit challenge', 'FOIA request', 'Eminent domain complaint', 'Deed restriction claim', 'Utility rate case filing'],
    lit: ['Zoning appeal by neighbors', 'Environmental permit challenge', 'Utility rate case', 'Deed restriction enforcement', 'FOIA litigation', 'Constitutional challenge to tax exemption', 'Nuisance claims'],
    qs: ['Can residents challenge a decision already made?', 'What stays confidential after litigation begins?', 'Can the state recover incentives through court enforcement?'],
    lc: [
      { l: 'H', h: 'Core actor in litigation overlay — all challenges flow through courts and admin bodies' },
      { l: 'B', h: 'FOIA litigation targets confidential incentive negotiations and NDAs' },
      { l: 'E', h: 'Environmental permit appeals and zoning challenges heard in administrative proceedings' },
      { l: 'G', h: 'Court outcomes determine whether communities receive mitigation, damages, or cancellation' },
    ],
    subs: [
      { id: 'sc', label: 'State Courts', icon: '⚖', tag: 'PUB', tc: 'tg-p', detail: 'Primary venue for zoning appeals, deed restriction claims, nuisance suits, eminent domain challenges.' },
      { id: 'adm', label: 'Admin Appeals', icon: '📩', tag: 'PUB', tc: 'tg-p', detail: 'Environmental permit challenges and utility tariff appeals heard by administrative bodies before court.' },
      { id: 'foia', label: 'FOIA /\nPublic Records', icon: '🗂', tag: 'PUB', tc: 'tg-p', detail: 'Requests for NDAs, incentive applications, utility agreements. FOIA litigation is a key accountability tool.' },
      { id: 'inj', label: 'Injunction /\nDelay', icon: '🛑', tag: 'PUB', tc: 'tg-p', detail: 'Courts may issue preliminary injunctions halting construction. Even temporary injunctions shift project economics.' },
    ],
  },
];

const LAYERS = [
  { id: 'A', label: 'Strategic Intent', color: '#5a8abd', desc: 'AI demand, cloud expansion, geographic redundancy, market access, tax strategy, energy access. The invisible first layer — never disclosed publicly.', actors: ['dev'], nodes: ['Market feasibility study', 'Latency / fiber map', 'Energy-availability study', 'Tax strategy memo', 'Project code-name file', 'Regional site scan'], why: 'This layer determines which states are even considered. It happens entirely inside the corporation, before any government entity is contacted.' },
  { id: 'B', label: 'Political & Economic Recruitment', color: '#6aaa6a', desc: 'Governor, state economic-development agency, local authority, incentive package, NDA, project code name, public announcement. The layer where government becomes a partner — under confidentiality.', actors: ['state'], nodes: ['NDA with state', 'RFI and state response', 'MOU', 'Incentive application', 'Performance agreement', 'Clawback agreement', 'Public announcement'], why: 'States compete for projects under nondisclosure. The public announcement is a political event, not the start of the process.' },
  { id: 'C', label: 'Land Control', color: '#b8a048', desc: 'Farmland targeting, option agreements, shell LLCs, parcel assembly, annexation, rezoning, easements, infrastructure corridors. Physical taking of land — usually before any public hearing.', actors: ['land'], nodes: ['Land option via LLC', 'Purchase agreement', 'Parcel assembly map', 'Annexation petition', 'Rezoning application', 'Easement filings', 'Deed restriction review'], why: 'By the time zoning hearings are held, the land is often already under option or contract. The public responds to decisions already financially locked in.' },
  { id: 'D', label: 'Utility Dependency', color: '#7a5aaa', desc: 'Power reservation, transmission study, substation, water availability, potable vs. reclaimed water, sewer capacity, fiber, roads, cooling. Six parallel infrastructure negotiations that run simultaneously.', actors: ['elec', 'water', 'infra'], nodes: ['Load request', 'Interconnection study', 'Electric service agreement', 'Water availability letter', 'Water service agreement', 'Sewer agreement', 'Fiber routing plan', 'Road access plan', 'Cooling system design'], why: 'The largest public costs hide here. Ratepayers may absorb substation and transmission costs. Water source decisions are made privately. None of this is a single public vote.' },
  { id: 'E', label: 'Regulatory Authorization', color: '#4aaa70', desc: 'Zoning, site plan, air permit, water withdrawal, wastewater, wetlands, stormwater, generator approval, building permits. The layer that looks like public process — but is fragmented.', actors: ['local', 'env'], nodes: ['Zoning / special-use permit', 'Site plan', 'Air permit', 'Water withdrawal permit', 'Wastewater permit', 'Wetlands authorization', 'Stormwater permit', 'Building permits', 'Certificate of occupancy'], why: 'Each permit is a separate proceeding with its own agency, timeline, and public comment window. No single agency coordinates them or sees the cumulative picture.' },
  { id: 'F', label: 'Financial & Contractual Structure', color: '#aa4a80', desc: 'Tax exemptions, grants, utility tariff, infrastructure reimbursement, development agreement, performance agreement, clawbacks, bonds, financing. The layer that determines the actual public cost.', actors: ['fin', 'state'], nodes: ['Tax exemption certification', 'Clawback agreement', 'Development agreement', 'Infrastructure reimbursement', 'Bond documents', 'REIT structure', 'Tax credit agreement', 'Annual compliance report'], why: 'The financial layer is where the deal is actually made. Clawbacks and infrastructure reimbursement determine whether the public investment is recoverable. Most of this is never in one public document.' },
  { id: 'G', label: 'Public Consequences', color: '#aa8040', desc: 'Permanent jobs, construction jobs, tax revenue, foregone taxes, ratepayer exposure, water demand, farmland loss, noise, emissions, community benefits, displacement risk.', actors: ['land'], nodes: ['Permanent jobs count', 'Construction jobs count', 'Tax exemptions waived ($)', 'Ratepayer cost exposure', 'Water demand (gal/day)', 'Farmland acres converted', 'Noise / emissions reports', 'Community benefit agreement'], why: 'This is the layer the public is promised but rarely gets to audit. Permanent job counts are often small relative to incentives. Tax exemptions may be reported in aggregate.' },
  { id: 'H', label: 'Legal Challenge & Accountability', color: '#aa5050', desc: 'Litigation, administrative appeal, public records, open meetings, eminent domain, deed enforcement, environmental review, utility commission challenge, contract default, clawback enforcement.', actors: ['courts'], nodes: ['Zoning appeal', 'Environmental permit challenge', 'FOIA litigation', 'Deed restriction claim', 'Utility rate case', 'Eminent domain challenge', 'Open meetings complaint', 'Nuisance claim', 'Clawback enforcement'], why: 'Legal challenge is not a last resort — it runs in parallel with every other layer. Communities can challenge at zoning, permitting, utility approval, and the incentive agreement stage.' },
];

const LIT_PAIRS = [['dev', 'courts'], ['state', 'courts'], ['local', 'courts'], ['land', 'courts'], ['elec', 'courts'], ['water', 'courts'], ['env', 'courts'], ['fin', 'courts'], ['dev', 'land'], ['dev', 'state'], ['local', 'land'], ['elec', 'state'], ['water', 'env'], ['env', 'local']];
const STRIP = { hub: 'rgba(108,142,191,.5)', layers: 'rgba(106,170,106,.5)', cross: 'rgba(255,195,60,.4)' };

function hexAlpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function openPanel(next) {
  const panel = document.getElementById('panel');
  if (panel) panel.classList.add('op');
  return next;
}

function closePanel() {
  const panel = document.getElementById('panel');
  if (panel) panel.classList.remove('op');
}

function fitCanvas(canvas) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width || canvas.offsetWidth || canvas.clientWidth || window.innerWidth));
  const height = Math.max(1, Math.round(rect.height || canvas.offsetHeight || canvas.clientHeight || (window.innerHeight - 55)));
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

function tagsHTML(tags, prefix) {
  return tags.map((t) => `<span class="tg ${prefix}${t}">${t === 'c' ? 'CONF' : t === 'p' ? 'PUB' : t === 'r' ? 'PRIV' : 'PART'}</span>`).join('');
}

function docsHTML(docs) {
  return docs.map((doc) => `<div class="dc">${doc}</div>`).join('');
}

function litHTML(items) {
  return items.map((item) => `<div class="li"><span class="ld">⬤</span>${item}</div>`).join('');
}

function qHTML(items) {
  return items.map((item) => `<div class="qi"><span class="qm">?</span>${item}</div>`).join('');
}

function ha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function HybridMap() {
  const BASE_SCALE = 1.3;
  const [mode, setMode] = useState('hub');
  const [litOn, setLitOn] = useState(false);
  const [panel, setPanel] = useState({ open: false, title: '', subtitle: '', body: '' });
  const [openLayerId, setOpenLayerId] = useState(null);

  const hubRef = useRef(null);
  const crossRef = useRef(null);
  const hubState = useRef({ scale: BASE_SCALE, panX: 0, panY: 0, activeSector: null, hovered: null, dragging: false, dragSX: 0, dragSY: 0, dragPX: 0, dragPY: 0, frame: null });
  const crossState = useRef({ scale: BASE_SCALE, panX: 0, panY: 0, activeSector: null, hovered: null, dragging: false, dragSX: 0, dragSY: 0, dragPX: 0, dragPY: 0, frame: null });
  const panelRef = useRef(null);
  const panelBodyRef = useRef(null);
  const panelTitleRef = useRef(null);
  const panelSubRef = useRef(null);
  const litBtnRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hint = document.getElementById('hint');
      if (hint) hint.style.opacity = '0';
    }, 5000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const delay = window.setTimeout(() => {
      if (mode === 'hub') fitCanvas(hubRef.current);
      if (mode === 'cross') fitCanvas(crossRef.current);
    }, 10);
    return () => window.clearTimeout(delay);
  }, [mode]);

  useEffect(() => {
    const canvas = hubRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const state = hubState.current;
    const dpr = () => window.devicePixelRatio || 1;
    const OR = 195;
    const SD = 95;
    const HR = 44;
    const SR = 33;
    const SUB = 19;

    const sXY = (ang) => {
      const r = ((ang - 90) * Math.PI) / 180;
      return [Math.cos(r) * OR, Math.sin(r) * OR];
    };

    const snXY = (sec, idx) => {
      const n = sec.subs.length;
      const base = ((sec.angle - 90) * Math.PI) / 180;
      const off = (idx - (n - 1) / 2) * 0.42;
      const dist = OR + SD + Math.abs(idx - (n - 1) / 2) * 8;
      return [Math.cos(base + off) * dist, Math.sin(base + off) * dist];
    };

    const ts = (wx, wy) => [canvas.width / 2 + (wx + state.panX) * state.scale * dpr(), canvas.height / 2 + (wy + state.panY) * state.scale * dpr()];

    const dc = (wx, wy, r, fill, stroke, sw) => {
      const [x, y] = ts(wx, wy);
      const rs = r * state.scale * dpr();
      ctx.beginPath();
      ctx.arc(x, y, rs, 0, Math.PI * 2);
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = sw * dpr();
        ctx.stroke();
      }
    };

    const dl = (x1, y1, x2, y2, col, w, dash) => {
      const [ax, ay] = ts(x1, y1);
      const [bx, by] = ts(x2, y2);
      ctx.beginPath();
      ctx.setLineDash(dash ? [5 * state.scale * dpr(), 4 * state.scale * dpr()] : []);
      ctx.strokeStyle = col;
      ctx.lineWidth = w * state.scale * dpr();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const dt = (text, wx, wy, dy, sz, col, align, bold) => {
      const [x, y] = ts(wx, wy);
      ctx.fillStyle = col;
      ctx.font = `${bold ? '700' : '400'} ${sz * state.scale * dpr()}px Inter,-apple-system,sans-serif`;
      ctx.textAlign = align || 'center';
      ctx.textBaseline = 'middle';
      text.split('\n').forEach((line, i, arr) => {
        ctx.fillText(line, x, y + dy * state.scale * dpr() + (i - (arr.length - 1) / 2) * (sz + 2.5) * state.scale * dpr());
      });
    };

    const de = (emoji, wx, wy, dy, sz) => {
      const [x, y] = ts(wx, wy);
      ctx.font = `${sz * state.scale * dpr()}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, x, y + dy * state.scale * dpr());
    };

    const dtag = (text, wx, wy, cls) => {
      const [x, y] = ts(wx, wy);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const rs = (SUB + 4) * state.scale * dpr();
      const tx = x + rs * 0.6;
      const ty = y - rs * 0.65;
      const w = 22 * state.scale * dpr();
      const h = 10 * state.scale * dpr();
      const map = {
        'tg-c': ['rgba(255,68,68,.22)', '#ff7070'],
        'tg-p': ['rgba(76,178,76,.22)', '#6ed06e'],
        'tg-r': ['rgba(200,150,50,.22)', '#d4a040'],
        'tg-t': ['rgba(100,140,210,.22)', '#80a8e8'],
      };
      const [bg, fg] = map[cls] || ['rgba(100,100,100,.2)', '#aaa'];
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.rect(tx - w / 2, ty - h / 2, w, h);
      ctx.fill();
      ctx.font = `700 ${7 * state.scale * dpr()}px Inter,sans-serif`;
      ctx.fillStyle = isLight ? '#0f172a' : fg;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, tx, ty);
    };

    const hit = (mx, my) => {
      const [hx, hy] = ts(0, 0);
      if (Math.hypot(mx * dpr() - hx, my * dpr() - hy) < HR * state.scale * dpr() * 1.2) return { type: 'hub' };
      if (state.activeSector) {
        for (let i = 0; i < state.activeSector.subs.length; i += 1) {
          const [sx, sy] = snXY(state.activeSector, i);
          const [px, py] = ts(sx, sy);
          if (Math.hypot(mx * dpr() - px, my * dpr() - py) < SUB * state.scale * dpr() * 1.8) {
            return { type: 'sub', sector: state.activeSector, sub: state.activeSector.subs[i] };
          }
        }
      }
      for (const sec of SECTORS) {
        const [sx, sy] = sXY(sec.angle);
        const [px, py] = ts(sx, sy);
        if (Math.hypot(mx * dpr() - px, my * dpr() - py) < SR * state.scale * dpr() * 1.5) {
          return { type: 'sector', sector: sec };
        }
      }
      return null;
    };

    const openHub = () => {
      const body = `<div class="ss"><span class="sl">Three views</span><div class="ir"><div class="ik" style="color:#6c8ebf">① Hub & Spoke</div><div class="iv">Dark canvas. 10 sectors radiate from hub. Click a sector to expand 4 sub-nodes. Full intelligence brief for each actor.</div></div><div class="ir"><div class="ik" style="color:#6aaa6a">② Control Layers</div><div class="iv">A scrollable document — 8 colored layer cards stacked top to bottom. Completely different visual. Click any card to expand its node inventory and open the brief.</div></div><div class="ir"><div class="ik" style="color:#e8c060">③ Cross-Section</div><div class="iv">Hub-and-spoke returns but with layer badges on every sector node. Click any sector to see exactly which A–H layers it connects to and how.</div></div></div><div class="ss"><span class="sl">Core finding</span><p class="sp">A hyperscale data center is not one contract. It is a fragmented network of decisions across 10 sectors and 8 control layers — each with its own timeline, authority, and transparency level.</p><p class="sp" style="margin-top:10px;color:rgba(255,195,60,.85);font-style:italic">"After tax benefits, water, electricity, infrastructure, environmental effects and permanent employment are combined — is this project actually in the public interest?"</p></div>`;
      setPanel({ open: true, title: 'Hyperscale Data Center Hub', subtitle: 'Three genuinely different views. Switch in the toolbar.', body });
      window.setTimeout(() => panelRef.current?.classList.add('op'), 0);
    };

    const openSec = (sec) => {
      const lay = LAYERS.find((layer) => layer.id === sec.pl);
      const body = `<div class="ss"><span class="sl">Controls</span><p class="sp">${sec.controls}</p></div><div class="ss"><span class="sl">Wants</span><p class="sp">${sec.wants}</p></div><div class="ss"><span class="sl">Provides</span><p class="sp">${sec.provides}</p></div><div class="ss"><span class="sl">Receives</span><p class="sp">${sec.receives}</p></div><div class="ss"><span class="sl">Risk tags</span><div class="tgs">${sec.risks.map((risk) => `<span class="tg tg-risk">${risk}</span>`).join('')}</div></div><div class="ss"><span class="sl">Key documents</span>${docsHTML(sec.docs)}</div><div class="ss"><span class="sl">Litigation exposure</span>${litHTML(sec.lit)}</div><div class="ss"><span class="sl">Public-interest questions</span>${qHTML(sec.qs)}</div>`;
      setPanel({ open: true, title: sec.label.replace('\n', ' / '), subtitle: `${sec.icon}  Primary layer: [${sec.pl}] ${lay ? lay.label : ''} · ${sec.transp}`, body });
      window.setTimeout(() => panelRef.current?.classList.add('op'), 0);
    };

    const openSub = (sec, sub) => {
      const body = `<div class="ss"><span class="sl">Transparency</span><div class="tgs"><span class="tg ${sub.tc}">${sub.tag}</span></div></div><div class="ss"><span class="sl">Sector context</span><div class="ir"><div class="ik">Controls</div><div class="iv">${sec.controls}</div></div><div class="ir"><div class="ik">Wants</div><div class="iv">${sec.wants}</div></div></div><div class="ss"><span class="sl">Litigation exposure</span>${litHTML(sec.lit)}</div><div class="ss"><span class="sl">Public-interest questions</span>${qHTML(sec.qs)}</div>`;
      setPanel({ open: true, title: `${sec.label.replace('\n', ' ').toUpperCase()} › ${sub.label.replace('\n', ' ')}`, subtitle: sub.label.replace('\n', ' '), body });
      window.setTimeout(() => panelRef.current?.classList.add('op'), 0);
    };

    const draw = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gs = 60 * state.scale * dpr();
      const ox = (canvas.width / 2 + state.panX * state.scale * dpr()) % gs;
      const oy = (canvas.height / 2 + state.panY * state.scale * dpr()) % gs;
      ctx.strokeStyle = 'rgba(255,255,255,0.013)';
      ctx.lineWidth = 1;
      for (let x = ox - gs; x < canvas.width + gs; x += gs) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = oy - gs; y < canvas.height + gs; y += gs) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      if (litOn) {
        LIT_PAIRS.forEach(([a, b]) => {
          const sa = SECTORS.find((sector) => sector.id === a);
          const sb = SECTORS.find((sector) => sector.id === b);
          if (!sa || !sb) return;
          const [ax, ay] = sXY(sa.angle);
          const [bx, by] = sXY(sb.angle);
          dl(ax, ay, bx, by, 'rgba(255,68,68,0.38)', 1.2, true);
        });
      }
      if (state.activeSector) {
        const [sx, sy] = sXY(state.activeSector.angle);
        state.activeSector.subs.forEach((_, i) => {
          const [bx, by] = snXY(state.activeSector, i);
          dl(sx, sy, bx, by, ha(state.activeSector.color, 0.2), 1, false);
        });
      }
      SECTORS.forEach((sec) => {
        const [sx, sy] = sXY(sec.angle);
        dl(0, 0, sx, sy, ha(sec.color, 0.28), 1.4, false);
      });
      if (state.activeSector) {
        state.activeSector.subs.forEach((sub, i) => {
          const [bx, by] = snXY(state.activeSector, i);
          const isH = state.hovered && state.hovered.type === 'sub' && state.hovered.sub && state.hovered.sub.id === sub.id;
          const r = isH ? SUB * 1.2 : SUB;
          dc(bx, by, r, ha(state.activeSector.color, isH ? 0.25 : 0.1), ha(state.activeSector.color, isH ? 0.9 : 0.45), 1);
          de(sub.icon, bx, by, -2, 11);
          sub.label.split('\n').forEach((line, li) => dt(line, bx, by, r + 10 + li * 11, 7.5, isLight ? '#0f172a' : 'rgba(255,255,255,.48)', 'center', false));
          dtag(sub.tag, bx, by, sub.tc);
        });
      }
      SECTORS.forEach((sec) => {
        const [sx, sy] = sXY(sec.angle);
        const isA = state.activeSector && state.activeSector.id === sec.id;
        const isH = state.hovered && state.hovered.type === 'sector' && state.hovered.sector && state.hovered.sector.id === sec.id;
        const r = isA || isH ? SR * 1.14 : SR;
        if (isA) {
          const [spx, spy] = ts(sx, sy);
          const g = ctx.createRadialGradient(spx, spy, 0, spx, spy, r * 2.5 * state.scale * dpr());
          g.addColorStop(0, ha(sec.color, 0.14));
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(spx, spy, r * 2.5 * state.scale * dpr(), 0, Math.PI * 2);
          ctx.fill();
        }
        dc(sx, sy, r, ha(sec.color, isA ? 0.22 : 0.1), ha(sec.color, isA ? 1 : 0.48), isA ? 2 : 1.5);
        de(sec.icon, sx, sy, -8, 15);
        sec.label.split('\n').forEach((line, li) => dt(line, sx, sy, 9 + li * 10, 8, isLight ? '#0f172a' : isA ? '#ffffff' : 'rgba(255,255,255,.72)', 'center', isA));
        const lay = LAYERS.find((layer) => layer.id === sec.pl);
        if (lay) {
          const [spx, spy] = ts(sx, sy);
          const bx = spx + r * state.scale * dpr() * 0.72;
          const by = spy - r * state.scale * dpr() * 0.72;
          ctx.fillStyle = ha(lay.color, 0.4);
          ctx.beginPath();
          ctx.rect(bx - 8, by - 6, 16, 12);
          ctx.fill();
          ctx.font = `700 ${7.5 * state.scale * dpr()}px Inter,sans-serif`;
          ctx.fillStyle = lay.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sec.pl, bx, by);
        }
      });
      const isHH = state.hovered && state.hovered.type === 'hub';
      const hR = isHH ? HR * 1.07 : HR;
      const [hpx, hpy] = ts(0, 0);
      const pulse = (Date.now() % 3000) / 3000;
      ctx.beginPath();
      ctx.arc(hpx, hpy, (hR + 18 + pulse * 22) * state.scale * dpr(), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - pulse)})`;
      ctx.lineWidth = 1.5 * dpr();
      ctx.stroke();
      dc(0, 0, hR, 'rgba(255,255,255,.06)', 'rgba(255,255,255,.42)', 2);
      dt('HYPERSCALE', 0, 0, -9, 7, isLight ? '#0f172a' : 'rgba(255,255,255,.9)', 'center', true);
      dt('DATA CENTER', 0, 0, 1, 7, isLight ? '#0f172a' : 'rgba(255,255,255,.9)', 'center', true);
      dt('HUB', 0, 0, 12, 5.5, isLight ? '#0f172a' : 'rgba(255,255,255,.3)', 'center', false);
      state.frame = window.requestAnimationFrame(draw);
    };

    const clientPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches) return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
      return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const onMouseDown = (e) => {
      state.dragging = true;
      [state.dragSX, state.dragSY] = clientPos(e);
      state.dragPX = state.panX;
      state.dragPY = state.panY;
      canvas.style.cursor = 'grabbing';
    };

    const onMouseMove = (e) => {
      if (state.dragging) {
        const [mx, my] = clientPos(e);
        state.panX = state.dragPX + (mx - state.dragSX) / state.scale;
        state.panY = state.dragPY + (my - state.dragSY) / state.scale;
      } else {
        const rect = canvas.getBoundingClientRect();
        state.hovered = hit(e.clientX - rect.left, e.clientY - rect.top);
        canvas.style.cursor = state.hovered ? 'pointer' : 'grab';
      }
    };

    const onMouseUp = () => {
      state.dragging = false;
      canvas.style.cursor = 'grab';
    };

    const onClick = (e) => {
      if (state.dragging) return;
      const rect = canvas.getBoundingClientRect();
      const h = hit(e.clientX - rect.left, e.clientY - rect.top);
      if (!h) {
        closePanel();
        state.activeSector = null;
        return;
      }
      if (h.type === 'hub') {
        state.activeSector = null;
        openHub();
        return;
      }
      if (h.type === 'sector') {
        if (state.activeSector && state.activeSector.id === h.sector.id) {
          state.activeSector = null;
          openSec(h.sector);
          return;
        }
        state.activeSector = h.sector;
        openSec(h.sector);
        return;
      }
      if (h.type === 'sub') openSub(h.sector, h.sub);
    };

    const onWheel = (e) => {
      e.preventDefault();
      state.scale = Math.max(0.2, Math.min(3, state.scale * (e.deltaY > 0 ? 0.9 : 1.1)));
    };

    const onTouchStart = (e) => {
      state.dragging = true;
      [state.dragSX, state.dragSY] = clientPos(e);
      state.dragPX = state.panX;
      state.dragPY = state.panY;
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      const [mx, my] = clientPos(e);
      state.panX = state.dragPX + (mx - state.dragSX) / state.scale;
      state.panY = state.dragPY + (my - state.dragSY) / state.scale;
    };

    const onTouchEnd = () => {
      state.dragging = false;
    };

    const onResize = () => fitCanvas(canvas);

    window.addEventListener('resize', onResize);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    fitCanvas(canvas);
    draw();

    return () => {
      if (state.frame) window.cancelAnimationFrame(state.frame);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [litOn]);

  useEffect(() => {
    const canvas = crossRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const state = crossState.current;
    const dpr = () => window.devicePixelRatio || 1;
    const OR = 195;
    const SD = 95;
    const HR = 44;
    const SR = 33;
    const SUB = 19;

    const sXY = (ang) => {
      const r = ((ang - 90) * Math.PI) / 180;
      return [Math.cos(r) * OR, Math.sin(r) * OR];
    };

    const snXY = (sec, idx) => {
      const n = sec.subs.length;
      const base = ((sec.angle - 90) * Math.PI) / 180;
      const off = (idx - (n - 1) / 2) * 0.42;
      const dist = OR + SD + Math.abs(idx - (n - 1) / 2) * 8;
      return [Math.cos(base + off) * dist, Math.sin(base + off) * dist];
    };

    const ts = (wx, wy) => [canvas.width / 2 + (wx + state.panX) * state.scale * dpr(), canvas.height / 2 + (wy + state.panY) * state.scale * dpr()];

    const dc = (wx, wy, r, fill, stroke, sw) => {
      const [x, y] = ts(wx, wy);
      const rs = r * state.scale * dpr();
      ctx.beginPath();
      ctx.arc(x, y, rs, 0, Math.PI * 2);
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = sw * dpr();
        ctx.stroke();
      }
    };

    const dl = (x1, y1, x2, y2, col, w, dash) => {
      const [ax, ay] = ts(x1, y1);
      const [bx, by] = ts(x2, y2);
      ctx.beginPath();
      ctx.setLineDash(dash ? [5 * state.scale * dpr(), 4 * state.scale * dpr()] : []);
      ctx.strokeStyle = col;
      ctx.lineWidth = w * state.scale * dpr();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const dt = (text, wx, wy, dy, sz, col, align, bold) => {
      const [x, y] = ts(wx, wy);
      ctx.fillStyle = col;
      ctx.font = `${bold ? '700' : '400'} ${sz * state.scale * dpr()}px Inter,-apple-system,sans-serif`;
      ctx.textAlign = align || 'center';
      ctx.textBaseline = 'middle';
      text.split('\n').forEach((line, i, arr) => {
        ctx.fillText(line, x, y + dy * state.scale * dpr() + (i - (arr.length - 1) / 2) * (sz + 2.5) * state.scale * dpr());
      });
    };

    const de = (emoji, wx, wy, dy, sz) => {
      const [x, y] = ts(wx, wy);
      ctx.font = `${sz * state.scale * dpr()}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, x, y + dy * state.scale * dpr());
    };

    const dtag = (text, wx, wy, cls) => {
      const [x, y] = ts(wx, wy);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const rs = (SUB + 4) * state.scale * dpr();
      const tx = x + rs * 0.6;
      const ty = y - rs * 0.65;
      const w = 22 * state.scale * dpr();
      const h = 10 * state.scale * dpr();
      const map = {
        'tg-c': ['rgba(255,68,68,.22)', '#ff7070'],
        'tg-p': ['rgba(76,178,76,.22)', '#6ed06e'],
        'tg-r': ['rgba(200,150,50,.22)', '#d4a040'],
        'tg-t': ['rgba(100,140,210,.22)', '#80a8e8'],
      };
      const [bg, fg] = map[cls] || ['rgba(100,100,100,.2)', '#aaa'];
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.rect(tx - w / 2, ty - h / 2, w, h);
      ctx.fill();
      ctx.font = `700 ${7 * state.scale * dpr()}px Inter,sans-serif`;
      ctx.fillStyle = isLight ? '#0f172a' : fg;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, tx, ty);
    };

    const hit = (mx, my) => {
      const [hx, hy] = ts(0, 0);
      if (Math.hypot(mx * dpr() - hx, my * dpr() - hy) < HR * state.scale * dpr() * 1.2) return { type: 'hub' };
      if (state.activeSector) {
        for (let i = 0; i < state.activeSector.subs.length; i += 1) {
          const [sx, sy] = snXY(state.activeSector, i);
          const [px, py] = ts(sx, sy);
          if (Math.hypot(mx * dpr() - px, my * dpr() - py) < SUB * state.scale * dpr() * 1.8) {
            return { type: 'sub', sector: state.activeSector, sub: state.activeSector.subs[i] };
          }
        }
      }
      for (const sec of SECTORS) {
        const [sx, sy] = sXY(sec.angle);
        const [px, py] = ts(sx, sy);
        if (Math.hypot(mx * dpr() - px, my * dpr() - py) < SR * state.scale * dpr() * 1.5) {
          return { type: 'sector', sector: sec };
        }
      }
      return null;
    };

    const openHub = () => {
      setPanel({ open: true, title: 'Hyperscale Data Center Hub', subtitle: 'Three genuinely different views. Switch in the toolbar.', body: `<div class="ss"><span class="sl">Three views</span><div class="ir"><div class="ik" style="color:#6c8ebf">① Hub & Spoke</div><div class="iv">Dark canvas. 10 sectors radiate from hub. Click a sector to expand 4 sub-nodes. Full intelligence brief for each actor.</div></div><div class="ir"><div class="ik" style="color:#6aaa6a">② Control Layers</div><div class="iv">A scrollable document — 8 colored layer cards stacked top to bottom. Completely different visual. Click any card to expand its node inventory and open the brief.</div></div><div class="ir"><div class="ik" style="color:#e8c060">③ Cross-Section</div><div class="iv">Hub-and-spoke returns but with layer badges on every sector node. Click any sector to see exactly which A–H layers it connects to and how.</div></div></div><div class="ss"><span class="sl">Core finding</span><p class="sp">A hyperscale data center is not one contract. It is a fragmented network of decisions across 10 sectors and 8 control layers — each with its own timeline, authority, and transparency level.</p><p class="sp" style="margin-top:10px;color:rgba(255,195,60,.85);font-style:italic">"After tax benefits, water, electricity, infrastructure, environmental effects and permanent employment are combined — is this project actually in the public interest?"</p></div>` });
      window.setTimeout(() => panelRef.current?.classList.add('op'), 0);
    };

    const openSec = (sec) => {
      const lay = LAYERS.find((layer) => layer.id === sec.pl);
      setPanel({ open: true, title: sec.label.replace('\n', ' / '), subtitle: `${sec.icon}  Primary layer: [${sec.pl}] ${lay ? lay.label : ''} · ${sec.transp}`, body: `<div class="ss"><span class="sl">Controls</span><p class="sp">${sec.controls}</p></div><div class="ss"><span class="sl">Wants</span><p class="sp">${sec.wants}</p></div><div class="ss"><span class="sl">Provides</span><p class="sp">${sec.provides}</p></div><div class="ss"><span class="sl">Receives</span><p class="sp">${sec.receives}</p></div><div class="ss"><span class="sl">Risk tags</span><div class="tgs">${sec.risks.map((risk) => `<span class="tg tg-risk">${risk}</span>`).join('')}</div></div><div class="ss"><span class="sl">Key documents</span>${docsHTML(sec.docs)}</div><div class="ss"><span class="sl">Litigation exposure</span>${litHTML(sec.lit)}</div><div class="ss"><span class="sl">Public-interest questions</span>${qHTML(sec.qs)}</div>` });
      window.setTimeout(() => panelRef.current?.classList.add('op'), 0);
    };

    const openSub = (sec, sub) => {
      setPanel({ open: true, title: `${sec.label.replace('\n', ' ').toUpperCase()} › ${sub.label.replace('\n', ' ')}`, subtitle: sub.label.replace('\n', ' '), body: `<div class="ss"><span class="sl">Transparency</span><div class="tgs"><span class="tg ${sub.tc}">${sub.tag}</span></div></div><div class="ss"><span class="sl">Sector context</span><div class="ir"><div class="ik">Controls</div><div class="iv">${sec.controls}</div></div><div class="ir"><div class="ik">Wants</div><div class="iv">${sec.wants}</div></div></div><div class="ss"><span class="sl">Litigation exposure</span>${litHTML(sec.lit)}</div><div class="ss"><span class="sl">Public-interest questions</span>${qHTML(sec.qs)}</div>` });
      window.setTimeout(() => panelRef.current?.classList.add('op'), 0);
    };

    const openCross = (sec) => {
      const lay = LAYERS.find((layer) => layer.id === sec.pl);
      const conns = (sec.lc || []).map((item) => {
        const layer = LAYERS.find((layerItem) => layerItem.id === item.l);
        return `<div class="lci"><span class="lcl" style="color:${layer ? layer.color : '#666'}">[${item.l}] ${layer ? layer.label : item.l}</span><span class="lch">${item.h}</span></div>`;
      }).join('');
      setPanel({ open: true, title: 'Layer Connections', subtitle: `${sec.label.replace('\n', ' / ')} — [${sec.pl}] ${lay ? lay.label : ''}`, body: `<div class="ss"><span class="sl">How this sector connects across the A–H layers</span>${conns}</div><div class="ss"><span class="sl">Sector detail</span><div class="ir"><div class="ik">Controls</div><div class="iv">${sec.controls}</div></div><div class="ir"><div class="ik">Wants</div><div class="iv">${sec.wants}</div></div></div><div class="ss"><span class="sl">Litigation exposure</span>${litHTML(sec.lit)}</div><div class="ss"><span class="sl">Public-interest questions</span>${qHTML(sec.qs)}</div>` });
      window.setTimeout(() => panelRef.current?.classList.add('op'), 0);
    };

    const draw = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gs = 60 * state.scale * dpr();
      const ox = (canvas.width / 2 + state.panX * state.scale * dpr()) % gs;
      const oy = (canvas.height / 2 + state.panY * state.scale * dpr()) % gs;
      ctx.strokeStyle = 'rgba(255,255,255,0.013)';
      ctx.lineWidth = 1;
      for (let x = ox - gs; x < canvas.width + gs; x += gs) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = oy - gs; y < canvas.height + gs; y += gs) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      if (litOn) {
        LIT_PAIRS.forEach(([a, b]) => {
          const sa = SECTORS.find((sector) => sector.id === a);
          const sb = SECTORS.find((sector) => sector.id === b);
          if (!sa || !sb) return;
          const [ax, ay] = sXY(sa.angle);
          const [bx, by] = sXY(sb.angle);
          dl(ax, ay, bx, by, 'rgba(255,68,68,0.38)', 1.2, true);
        });
      }
      if (state.activeSector) {
        const [sx, sy] = sXY(state.activeSector.angle);
        state.activeSector.subs.forEach((_, i) => {
          const [bx, by] = snXY(state.activeSector, i);
          dl(sx, sy, bx, by, ha(state.activeSector.color, 0.2), 1, false);
        });
      }
      SECTORS.forEach((sec) => {
        const [sx, sy] = sXY(sec.angle);
        dl(0, 0, sx, sy, ha(sec.color, 0.28), 1.4, false);
      });
      if (state.activeSector) {
        state.activeSector.subs.forEach((sub, i) => {
          const [bx, by] = snXY(state.activeSector, i);
          const isH = state.hovered && state.hovered.type === 'sub' && state.hovered.sub && state.hovered.sub.id === sub.id;
          const r = isH ? SUB * 1.2 : SUB;
          dc(bx, by, r, ha(state.activeSector.color, isH ? 0.25 : 0.1), ha(state.activeSector.color, isH ? 0.9 : 0.45), 1);
          de(sub.icon, bx, by, -2, 11);
          sub.label.split('\n').forEach((line, li) => dt(line, bx, by, r + 10 + li * 11, 7.5, isLight ? '#0f172a' : 'rgba(255,255,255,.48)', 'center', false));
          dtag(sub.tag, bx, by, sub.tc);
        });
      }
      SECTORS.forEach((sec) => {
        const [sx, sy] = sXY(sec.angle);
        const isA = state.activeSector && state.activeSector.id === sec.id;
        const isH = state.hovered && state.hovered.type === 'sector' && state.hovered.sector && state.hovered.sector.id === sec.id;
        const r = isA || isH ? SR * 1.14 : SR;
        if (isA) {
          const [spx, spy] = ts(sx, sy);
          const g = ctx.createRadialGradient(spx, spy, 0, spx, spy, r * 2.5 * state.scale * dpr());
          g.addColorStop(0, ha(sec.color, 0.14));
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(spx, spy, r * 2.5 * state.scale * dpr(), 0, Math.PI * 2);
          ctx.fill();
        }
        dc(sx, sy, r, ha(sec.color, isA ? 0.22 : 0.1), ha(sec.color, isA ? 1 : 0.48), isA ? 2 : 1.5);
        de(sec.icon, sx, sy, -8, 15);
        sec.label.split('\n').forEach((line, li) => dt(line, sx, sy, 9 + li * 10, 8, isLight ? '#0f172a' : isA ? '#ffffff' : 'rgba(255,255,255,.72)', 'center', isA));
        const lay = LAYERS.find((layer) => layer.id === sec.pl);
        if (lay) {
          const [spx, spy] = ts(sx, sy);
          const bx = spx + r * state.scale * dpr() * 0.72;
          const by = spy - r * state.scale * dpr() * 0.72;
          ctx.fillStyle = ha(lay.color, 0.4);
          ctx.beginPath();
          ctx.rect(bx - 8, by - 6, 16, 12);
          ctx.fill();
          ctx.font = `700 ${7.5 * state.scale * dpr()}px Inter,sans-serif`;
          ctx.fillStyle = lay.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sec.pl, bx, by);
        }
      });
      const isHH = state.hovered && state.hovered.type === 'hub';
      const hR = isHH ? HR * 1.07 : HR;
      const [hpx, hpy] = ts(0, 0);
      const pulse = (Date.now() % 3000) / 3000;
      ctx.beginPath();
      ctx.arc(hpx, hpy, (hR + 18 + pulse * 22) * state.scale * dpr(), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - pulse)})`;
      ctx.lineWidth = 1.5 * dpr();
      ctx.stroke();
      dc(0, 0, hR, 'rgba(255,255,255,.06)', 'rgba(255,255,255,.42)', 2);
      dt('HYPERSCALE', 0, 0, -9, 7, isLight ? '#0f172a' : 'rgba(255,255,255,.9)', 'center', true);
      dt('DATA CENTER', 0, 0, 1, 7, isLight ? '#0f172a' : 'rgba(255,255,255,.9)', 'center', true);
      dt('CROSS', 0, 0, 12, 5.5, isLight ? '#0f172a' : 'rgba(255,195,60,.5)', 'center', false);
      state.frame = window.requestAnimationFrame(draw);
    };

    const clientPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches) return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
      return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const onMouseDown = (e) => {
      state.dragging = true;
      [state.dragSX, state.dragSY] = clientPos(e);
      state.dragPX = state.panX;
      state.dragPY = state.panY;
      canvas.style.cursor = 'grabbing';
    };

    const onMouseMove = (e) => {
      if (state.dragging) {
        const [mx, my] = clientPos(e);
        state.panX = state.dragPX + (mx - state.dragSX) / state.scale;
        state.panY = state.dragPY + (my - state.dragSY) / state.scale;
      } else {
        const rect = canvas.getBoundingClientRect();
        state.hovered = hit(e.clientX - rect.left, e.clientY - rect.top);
        canvas.style.cursor = state.hovered ? 'pointer' : 'grab';
      }
    };

    const onMouseUp = () => {
      state.dragging = false;
      canvas.style.cursor = 'grab';
    };

    const onClick = (e) => {
      if (state.dragging) return;
      const rect = canvas.getBoundingClientRect();
      const h = hit(e.clientX - rect.left, e.clientY - rect.top);
      if (!h) {
        closePanel();
        state.activeSector = null;
        return;
      }
      if (h.type === 'hub') {
        state.activeSector = null;
        openHub();
        return;
      }
      if (h.type === 'sector') {
        if (state.activeSector && state.activeSector.id === h.sector.id) {
          state.activeSector = null;
          openCross(h.sector);
          return;
        }
        state.activeSector = h.sector;
        openCross(h.sector);
        return;
      }
      if (h.type === 'sub') openSub(h.sector, h.sub);
    };

    const onWheel = (e) => {
      e.preventDefault();
      state.scale = Math.max(0.2, Math.min(3, state.scale * (e.deltaY > 0 ? 0.9 : 1.1)));
    };

    const onTouchStart = (e) => {
      state.dragging = true;
      [state.dragSX, state.dragSY] = clientPos(e);
      state.dragPX = state.panX;
      state.dragPY = state.panY;
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      const [mx, my] = clientPos(e);
      state.panX = state.dragPX + (mx - state.dragSX) / state.scale;
      state.panY = state.dragPY + (my - state.dragSY) / state.scale;
    };

    const onTouchEnd = () => {
      state.dragging = false;
    };

    const onResize = () => fitCanvas(canvas);

    window.addEventListener('resize', onResize);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    fitCanvas(canvas);
    draw();

    return () => {
      if (state.frame) window.cancelAnimationFrame(state.frame);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [litOn]);

  useEffect(() => {
    const layersList = document.getElementById('lc');
    if (!layersList) return;
    const html = LAYERS.map((lay, index) => {
      const actors = lay.actors.map((aid) => SECTORS.find((sec) => sec.id === aid)).filter(Boolean);
      return `${index > 0 ? `<div class="lconnector"><div class="lconnector-inner ${litOn ? 'lit' : ''}"><span class="lconnector-arrow">▾</span></div></div>` : ''}<div class="lrow"><div class="lspine"><div class="lletter" style="background:${ha(lay.color, 0.18)};color:${lay.color}">${lay.id}</div><div class="lline" style="background:${ha(lay.color, 0.15)}"></div></div><div class="lcard ${openLayerId === lay.id ? 'exp' : ''} ${litOn ? 'lit' : ''}" data-layer="${lay.id}" style="${openLayerId === lay.id ? 'border-color:rgba(255,255,255,.18)' : ''}"><div class="lcard-bar" style="background:${lay.color}"></div><div class="lcard-head"><div style="flex:1"><div class="lcard-name" style="color:${lay.color}">${lay.label}</div><div class="lcard-desc">${lay.desc}</div></div><div class="lcard-actors">${actors.map((sec) => `<span class="achip" style="background:${ha(sec.color, 0.15)};color:${sec.color};border:1px solid ${ha(sec.color, 0.35)}">${sec.icon} ${sec.id.toUpperCase()}</span>`).join('')}</div></div><div class="lnodes ${openLayerId === lay.id ? 'op' : ''}">${lay.nodes.map((node) => `<div class="lnode">${node}</div>`).join('')}</div><div class="lwhy ${openLayerId === lay.id ? 'op' : ''}">${lay.why}</div></div></div>`;
    }).join('');
    layersList.innerHTML = html;
    layersList.querySelectorAll('[data-layer]').forEach((card) => {
      card.addEventListener('click', () => {
        const layerId = card.getAttribute('data-layer');
        setOpenLayerId((current) => (current === layerId ? null : layerId));
        const lay = LAYERS.find((layer) => layer.id === layerId);
        if (lay) {
          const actors = lay.actors.map((aid) => SECTORS.find((sec) => sec.id === aid)).filter(Boolean);
          setPanel({ open: true, title: `Control Layer ${lay.id}`, subtitle: `[${lay.id}] ${lay.label}`, body: `<div class="ss"><span class="sl">Why this layer matters</span><p class="sp">${lay.why}</p></div><div class="ss"><span class="sl">What it controls</span><p class="sp">${lay.desc}</p></div><div class="ss"><span class="sl">Primary sector actors</span>${actors.map((sec) => `<div class="ir"><div class="ik" style="color:${sec.color}">${sec.icon} ${sec.id.toUpperCase()}</div><div class="iv">${sec.label.replace('\n', ' ')} — ${sec.controls.slice(0, 90)}…</div></div>`).join('')}</div><div class="ss"><span class="sl">Key nodes and documents</span>${docsHTML(lay.nodes)}</div>` });
          window.setTimeout(() => panelRef.current?.classList.add('op'), 0);
        }
      });
    });
  }, [openLayerId, litOn]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const legendTitle = document.getElementById('lgh');
      const legendBody = document.getElementById('lgb');
      if (!legendTitle || !legendBody) return;
      if (mode === 'hub') {
        legendTitle.textContent = 'Hub & Spoke';
        legendBody.innerHTML = '<div class="leg"><div class="lc" style="background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.45)"></div>Hub</div><div class="leg"><div class="lc" style="background:rgba(108,142,191,.2);border:1.5px solid rgba(108,142,191,.6)"></div>Sector</div><div class="leg"><div class="lc" style="width:9px;height:9px;background:rgba(108,142,191,.12);border:1px solid rgba(108,142,191,.5)"></div>Sub-node</div><div class="leg"><div class="ll" style="background:rgba(255,255,255,.2)"></div>Spoke</div><div class="leg"><div class="ld2"></div>Litigation</div><div class="lsep"></div><div class="leg"><span style="font-size:8px;background:rgba(255,68,68,.15);color:#ff7070;padding:1px 5px;border-radius:2px;font-weight:700">CONF</span>Confidential</div><div class="leg"><span style="font-size:8px;background:rgba(76,178,76,.15);color:#6ed06e;padding:1px 5px;border-radius:2px;font-weight:700">PUB</span>Public</div><div class="leg"><span style="font-size:8px;background:rgba(200,150,50,.15);color:#d4a040;padding:1px 5px;border-radius:2px;font-weight:700">PRIV</span>Private</div>';
      } else if (mode === 'layers') {
        legendTitle.textContent = 'A–H Layers';
        legendBody.innerHTML = LAYERS.map((lay) => `<div class="leg"><div class="lc" style="background:${ha(lay.color, 0.25)};border:1.5px solid ${ha(lay.color, 0.7)}"></div>${lay.id}: ${lay.label}</div>`).join('');
      } else {
        legendTitle.textContent = 'Cross-Section';
        legendBody.innerHTML = '<p style="font-size:9px;color:#3a3e58;line-height:1.6;margin-bottom:8px">Each sector shows its primary layer badge. Click a sector to see all its layer connections.</p>' + LAYERS.map((lay) => `<div class="leg"><div class="lc" style="background:${ha(lay.color, 0.25)};border:1.5px solid ${ha(lay.color, 0.7)}"></div>${lay.id}: ${lay.label}</div>`).join('');
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [mode]);

  const toggleLit = () => {
    setLitOn((current) => !current);
    if (litBtnRef.current) litBtnRef.current.classList.toggle('lit', !litOn);
  };

  const resetView = () => {
    hubState.current.scale = BASE_SCALE;
    hubState.current.panX = 0;
    hubState.current.panY = 0;
    hubState.current.activeSector = null;
    hubState.current.hovered = null;
    crossState.current.scale = BASE_SCALE;
    crossState.current.panX = 0;
    crossState.current.panY = 0;
    crossState.current.activeSector = null;
    crossState.current.hovered = null;
    closePanel();
  };

  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setPanel((current) => ({ ...current, open: false }));
    setOpenLayerId(null);
    if (next === 'hub') {
      hubState.current.activeSector = null;
      window.setTimeout(() => fitCanvas(hubRef.current), 10);
    }
    if (next === 'cross') {
      crossState.current.activeSector = null;
      window.setTimeout(() => fitCanvas(crossRef.current), 10);
    }
  };

  return (
    <div className="hybrid-map-page">
      <style dangerouslySetInnerHTML={{ __html: HYBRID_MAP_STYLES }} />
      <div id="toolbar" role="region" aria-label="Hybrid map controls">
        <h1>HYPERSCALE DATA CENTER <span>/ Hybrid Intelligence Map</span></h1>
        <Nav />
      </div>
      <div id="hybrid-sub-row">
        <div className="mg">
          <button type="button" aria-pressed={mode === 'hub'} className={`mb ${mode === 'hub' ? 'on' : ''}`} id="b1" onClick={() => switchMode('hub')}>① Hub &amp; Spoke</button>
          <button type="button" aria-pressed={mode === 'layers'} className={`mb ${mode === 'layers' ? 'on' : ''}`} id="b2" onClick={() => switchMode('layers')}>② Control Layers A–H</button>
          <button type="button" aria-pressed={mode === 'cross'} className={`mb ${mode === 'cross' ? 'on' : ''}`} id="b3" onClick={() => switchMode('cross')}>③ Cross-Section</button>
        </div>
        <button type="button" ref={litBtnRef} aria-pressed={litOn} className={`tb ${litOn ? 'lit' : ''}`} id="litbtn" onClick={toggleLit}>⬤ Litigation</button>
        <button type="button" className="tb" onClick={resetView} aria-label="Reset map view">↺ Reset</button>
      </div>
      <div id="mstrip" style={{ background: STRIP[mode] || 'transparent' }} />
      <div id="vhub" className={`view ${mode === 'hub' ? 'on' : ''}`}><canvas id="c1" ref={hubRef} tabIndex={0} aria-label="Hybrid map hub and spoke view" /></div>
      <div id="vlayers" className={`view ${mode === 'layers' ? 'on' : ''}`}>
        <div className="lpage">
          <span className="lpage-title">Control Layers A–H — how power flows through the system, top to bottom. Click any layer to expand.</span>
          <div id="lc" />
        </div>
      </div>
      <div id="vcross" className={`view ${mode === 'cross' ? 'on' : ''}`}><canvas id="c2" ref={crossRef} tabIndex={0} aria-label="Hybrid map cross-section view" /></div>
      <div id="panel" ref={panelRef} className={panel.open ? 'op' : ''} role="dialog" aria-modal="false" aria-hidden={!panel.open}>
        <button type="button" id="pc" onClick={closePanel} aria-label="Close details panel">✕</button>
        <div id="ph"><span id="pt">HYBRID INTELLIGENCE MAP</span><div id="pn" ref={panelTitleRef}>{panel.title}</div><div id="ps" ref={panelSubRef}>{panel.subtitle}</div></div>
        <div id="pb" ref={panelBodyRef} dangerouslySetInnerHTML={{ __html: panel.body }} />
      </div>
      <div id="legend"><h3 id="lgh">Legend</h3><div id="lgb" /></div>
      <div id="zb"><button type="button" className="zbt" aria-label="Zoom in" onClick={() => { if (mode === 'hub') hubState.current.scale = Math.max(0.2, Math.min(3, hubState.current.scale * 1.15)); if (mode === 'cross') crossState.current.scale = Math.max(0.2, Math.min(3, crossState.current.scale * 1.15)); }}>+</button><button type="button" className="zbt" aria-label="Zoom out" onClick={() => { if (mode === 'hub') hubState.current.scale = Math.max(0.2, Math.min(3, hubState.current.scale * 0.87)); if (mode === 'cross') crossState.current.scale = Math.max(0.2, Math.min(3, crossState.current.scale * 0.87)); }}>−</button></div>
      <div id="hint">Click any node · Switch views in toolbar · Drag to pan</div>
    </div>
  );
}
