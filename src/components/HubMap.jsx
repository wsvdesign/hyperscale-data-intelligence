import { useEffect, useRef, useState } from 'react';
import Nav from './Nav';

const SECTORS = [
  {
    id: 'dev',
    label: 'Developer\n/ Hyperscaler',
    icon: '🏢',
    color: '#6c8ebf',
    angle: 0,
    controls:
      'Site selection, capital allocation, project code names, LLC structures, internal go/no-go decisions',
    wants: 'Power, land, tax incentives, water, fiber, permitting speed, political cover',
    provides: 'Capital investment, jobs promise, tax base, technology positioning',
    receives: 'Tax exemptions, infrastructure, utility agreements, political support',
    transparency:
      'CONFIDENTIAL — initial recruitment, land options, LLC identity, load requests are all withheld from public until announcement.',
    risks: ['Schedule risk', 'Grid risk', 'Political risk', 'Reputational risk'],
    documents: [
      'Project code-name file',
      'NDA with state',
      'Site-selection RFI',
      'Land options via LLC',
      'Load request to utility',
      'Incentive application',
      'Performance agreement',
    ],
    litigation: [
      'LLC identity challenge via FOIA',
      'Land option disclosure dispute',
      'Breach of incentive agreement',
      'Failure to meet job thresholds',
    ],
    questions: [
      'Was the full buildout scale disclosed?',
      'Who controls the shell LLCs?',
      'Is the project phased to avoid review thresholds?',
    ],
    subnodes: [
      {
        id: 'hyper',
        label: 'Hyperscaler',
        icon: '☁',
        tag: 'CONF',
        tagcls: 'tag-c',
        detail:
          'Amazon, Microsoft, Google, Meta, Oracle. Often conceals identity behind project code names and real-estate subsidiaries to prevent land price inflation and competitor awareness.',
      },
      {
        id: 'siteconsult',
        label: 'Site Consultant',
        icon: '📍',
        tag: 'PRIV',
        tagcls: 'tag-r',
        detail:
          'Third-party firm that issues RFIs to states and negotiates confidentially on behalf of the hyperscaler. Operates under NDA. Results may never become public.',
      },
      {
        id: 'shellllc',
        label: 'Shell LLC',
        icon: '🔲',
        tag: 'CONF',
        tagcls: 'tag-c',
        detail:
          'Anonymous real-estate entity used to assemble land parcels without revealing buyer identity or project scale. May use nested LLCs across multiple jurisdictions.',
      },
      {
        id: 'redev',
        label: 'RE Developer',
        icon: '🏗',
        tag: 'PRIV',
        tagcls: 'tag-r',
        detail:
          "May construct the facility and lease it to the hyperscaler, keeping the tech company's ownership off public record. Common in third-party co-location models.",
      },
    ],
  },
  {
    id: 'state',
    label: 'State\nGovernment',
    icon: '🏛',
    color: '#7cb87c',
    angle: 36,
    controls:
      'Tax exemptions, economic development incentives, environmental permits, utility regulation, public land, state infrastructure funding',
    wants: 'Capital investment, job announcements, AI/tech positioning, tax base expansion',
    provides: 'Tax exemptions, infrastructure grants, fast-track permitting, workforce training funds',
    receives: 'Investment commitments, job pledges, construction activity, eventual tax revenue',
    transparency:
      'PARTIALLY DISCLOSED — incentive negotiations confidential; statutory exemptions public only after approval.',
    risks: [
      'Political risk',
      'Financial risk — foregone tax revenue',
      'Reputational risk if permanent jobs underdeliver',
    ],
    documents: [
      'RFI response',
      'Confidentiality agreement',
      'Incentive application',
      'Tax exemption certification',
      'Performance agreement',
      'Clawback agreement',
      'MOU with developer',
    ],
    litigation: [
      'Tax incentive clawback dispute',
      'Open meetings challenge on incentive approval',
      'FOIA for NDA and RFI records',
      'Constitutional challenge to tax exemption',
    ],
    questions: [
      'Were projections independently verified?',
      'What taxes are waived over 10+ years?',
      'Can the state recover incentives if job thresholds are missed?',
    ],
    subnodes: [
      {
        id: 'gov',
        label: "Governor's\nOffice",
        icon: '⭐',
        tag: 'CONF',
        tagcls: 'tag-c',
        detail:
          'Typically the first contact point. Governor may personally recruit large projects under NDA. Public announcement timed for political benefit, often before zoning or environmental review.',
      },
      {
        id: 'econdev',
        label: 'Econ Dev\nAgency',
        icon: '📊',
        tag: 'CONF',
        tagcls: 'tag-c',
        detail:
          'Prepares incentive package, coordinates site proposals, manages confidential negotiations, drafts performance and clawback agreements.',
      },
      {
        id: 'taxdept',
        label: 'Tax\nDepartment',
        icon: '💲',
        tag: 'PART',
        tagcls: 'tag-t',
        detail:
          'Administers statutory tax exemptions. May certify qualifying equipment. Reports may be public after approval but individual project data is sometimes aggregated.',
      },
      {
        id: 'leg',
        label: 'Legislature',
        icon: '📜',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'Creates enabling legislation for tax exemptions and data-center programs. Votes are public record but often framed as general business incentives without naming specific companies.',
      },
    ],
  },
  {
    id: 'local',
    label: 'Local\nGovernment',
    icon: '🏘',
    color: '#b87c6c',
    angle: 72,
    controls:
      'Zoning, land-use permits, site plan approval, development agreements, local tax abatements, annexation authority',
    wants: 'Tax base, construction jobs, county investment, infrastructure upgrades, political wins',
    provides: 'Rezoning, special-use permits, development agreements, road access, utility connections',
    receives: 'Tax revenue (net of abatements), infrastructure contributions, construction activity',
    transparency:
      'PUBLIC — zoning hearings are public, but often occur only after major commitments have already been made.',
    risks: [
      'Political risk',
      'Community risk',
      'Land risk — deed restrictions',
      'Financial risk — infrastructure obligations',
    ],
    documents: [
      'Zoning application',
      'Special-use permit',
      'Site plan',
      'Development agreement',
      'Infrastructure reimbursement agreement',
      'Community benefit agreement',
      'Annexation petition',
    ],
    litigation: [
      'Zoning appeal by neighbors',
      'Special-use permit challenge',
      'Open meetings violation claim',
      'Deed restriction enforcement',
      'Development agreement default',
    ],
    questions: [
      'Who builds the roads and water lines?',
      'Can residents challenge the decision?',
      'Is farmland permanently removed from agricultural use?',
    ],
    subnodes: [
      {
        id: 'council',
        label: 'City / County\nBoard',
        icon: '🗳',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'Votes on rezoning, special-use permits, development agreements, and local tax abatements. Public vote but often occurs after the "done deal" political sequence.',
      },
      {
        id: 'plancomm',
        label: 'Planning\nCommission',
        icon: '📐',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          "Reviews zoning applications and site plans, makes recommendations. Hearings are public. Neighbors may testify. Staff reports are public documents and can be FOIA'd.",
      },
      {
        id: 'building',
        label: 'Building\nDept',
        icon: '🔧',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'Issues construction permits, inspects, issues certificates of occupancy. Phased projects receive separate permits per building, which can obscure the total scale.',
      },
      {
        id: 'township',
        label: 'Township /\nCounty',
        icon: '🗺',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'May have initial land-use authority. Annexation can rapidly shift authority to municipality. Annexation proceedings are public but timing can be fast and surprising.',
      },
    ],
  },
  {
    id: 'land',
    label: 'Landowners\n/ Community',
    icon: '🌾',
    color: '#c4a84f',
    angle: 108,
    controls:
      'Deed restrictions, voluntary sale decisions, water rights, agricultural use, legal standing to challenge',
    wants:
      'Fair price, transparency about buyer identity, protection of deed conditions, agricultural preservation',
    provides: 'Land, water rights, political legitimacy, community opposition or support',
    receives:
      'Purchase price (if sale), displacement pressure, possible eminent domain on supporting infrastructure',
    transparency:
      'PRIVATE — land option terms confidential; purchase prices may be public only after deed recording.',
    risks: ['Land risk', 'Water risk', 'Community risk — displacement', 'Environmental risk'],
    documents: [
      'Land option agreement',
      'Purchase and sale agreement',
      'Deed restrictions',
      'Easement agreements',
      'Eminent domain filing',
      'Water rights documentation',
    ],
    litigation: [
      'Deed restriction enforcement',
      'Groundwater injury claim',
      'Eminent domain challenge for infrastructure',
      'Nuisance and noise claims',
      'Environmental damage claims',
    ],
    questions: [
      'Was eminent domain used directly or indirectly?',
      'Is farmland permanently removed?',
      'Did LLC concealment prevent fair pricing for sellers?',
    ],
    subnodes: [
      {
        id: 'farmer',
        label: 'Farmer /\nLandowner',
        icon: '🌱',
        tag: 'PRIV',
        tagcls: 'tag-r',
        detail:
          'May receive very high offers. Some accept; others refuse. LLC-based land assembly prevents individual sellers from understanding full project scale, limiting negotiating power.',
      },
      {
        id: 'commgrp',
        label: 'Community\nGroups',
        icon: '👥',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'Residents, neighborhood organizations, and agricultural groups. May testify at zoning hearings, file FOIA requests, fund legal challenges, or run campaigns.',
      },
      {
        id: 'waterrts',
        label: 'Water\nRights',
        icon: '💧',
        tag: 'PRIV',
        tagcls: 'tag-r',
        detail:
          'Agricultural water rights may be implicated by large industrial withdrawals. Some landowners hold senior rights that data-center groundwater withdrawal could legally affect.',
      },
      {
        id: 'deed',
        label: 'Deed\nRestrictions',
        icon: '📋',
        tag: 'PART',
        tagcls: 'tag-t',
        detail:
          'Key litigation trigger. Taylor, TX: farmer donated land for a park; city sold it to data-center developer; residents challenged deed restriction. Restrictions run with the land regardless of buyer.',
      },
    ],
  },
  {
    id: 'elec',
    label: 'Electric Utility\n/ Grid',
    icon: '⚡',
    color: '#8c6cb8',
    angle: 144,
    controls:
      'Power supply, interconnection queue, transmission capacity, substation locations, tariff structures, cost allocation between ratepayers',
    wants:
      'Load growth revenue, cost recovery for infrastructure, ratepayer protection, schedule certainty',
    provides: 'Power supply, interconnection study, service agreement, approved tariff',
    receives:
      'Infrastructure cost contributions, minimum monthly demand payments, long-term load commitment',
    transparency:
      'PARTIALLY DISCLOSED — service agreements often redacted; tariff must be approved by public utility commission.',
    risks: [
      'Grid risk',
      'Financial risk — stranded infrastructure',
      'Schedule risk — interconnection queue delays',
    ],
    documents: [
      'Load request letter',
      'Interconnection/load study',
      'Electric service agreement',
      'Special tariff filing',
      'Public service commission filing',
      'Transmission upgrade plan',
    ],
    litigation: [
      'Utility rate case — ratepayer subsidy challenge',
      'Transmission siting challenge',
      'Cost-allocation dispute',
      'Public service commission appeal',
    ],
    questions: [
      'Who pays for new substations and transmission upgrades?',
      'Are ratepayers subsidizing data center infrastructure?',
      'Who bears grid risk if the project is abandoned?',
    ],
    subnodes: [
      {
        id: 'utility',
        label: 'Electric\nUtility',
        icon: '🔌',
        tag: 'PART',
        tagcls: 'tag-t',
        detail:
          'Evaluates whether system can serve the load. Negotiates service agreement covering minimum payments, infrastructure contributions, security deposits, and termination charges.',
      },
      {
        id: 'gridop',
        label: 'Grid\nOperator',
        icon: '📡',
        tag: 'PART',
        tagcls: 'tag-t',
        detail:
          'Regional transmission organization (PJM, MISO, etc.) manages interconnection queue for large loads. Studies can take years and reveal costly infrastructure needs.',
      },
      {
        id: 'psc',
        label: 'Public Service\nCommission',
        icon: '⚖',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'Regulates utility tariffs and large-load service agreements. Must approve cost allocation to ratepayers. Proceedings are public. Consumer advocates may intervene and challenge.',
      },
      {
        id: 'subst',
        label: 'Substation /\nTransmission',
        icon: '🔋',
        tag: 'PRIV',
        tagcls: 'tag-r',
        detail:
          'New substations and transmission lines may require easements across third-party land, potentially triggering eminent domain separate from the data-center site itself.',
      },
    ],
  },
  {
    id: 'water',
    label: 'Water &\nSewer',
    icon: '💧',
    color: '#4fa8b8',
    angle: 180,
    controls:
      'Water supply, withdrawal permits, wastewater discharge, treatment capacity, reclaimed water availability',
    wants: 'Revenue, infrastructure cost recovery, regulatory compliance, supply security',
    provides: 'Water availability letter, service agreement, sewer capacity, connection permits',
    receives: 'Infrastructure contributions, connection fees, ongoing usage revenue',
    transparency:
      'PARTIALLY DISCLOSED — municipal water use aggregated by system; private withdrawal permits may be individually public.',
    risks: ['Water risk', 'Environmental risk — watershed impact', 'Regulatory risk — permit challenge'],
    documents: [
      'Water availability letter',
      'Water service agreement',
      'Sewer agreement',
      'Water withdrawal permit',
      'Wastewater discharge permit',
      'Water demand study',
    ],
    litigation: [
      'Water withdrawal dispute — stream impact',
      'Groundwater injury claim from neighbors',
      'Wastewater discharge permit challenge',
      'Water rights conflict',
      'FOIA for facility-level water use data',
    ],
    questions: [
      'Is drinking water or reclaimed water being used for cooling?',
      'Was reclaimed water evaluated before potable water was committed?',
      'Are cumulative watershed impacts reviewed?',
    ],
    subnodes: [
      {
        id: 'munwater',
        label: 'Municipal\nWater Auth',
        icon: '🚰',
        tag: 'PART',
        tagcls: 'tag-t',
        detail:
          'Provides water and sewer service. The authority — not the data center — may hold the formal withdrawal permit, making facility-level water use invisible in public records.',
      },
      {
        id: 'potable',
        label: 'Potable\nWater',
        icon: '🥤',
        tag: 'PART',
        tagcls: 'tag-t',
        detail:
          'Drinking-quality water used for cooling. A key public-interest question: should drinking water be used for industrial cooling when reclaimed water alternatives exist nearby?',
      },
      {
        id: 'reclaim',
        label: 'Reclaimed\nWater',
        icon: '♻',
        tag: 'PART',
        tagcls: 'tag-t',
        detail:
          'Treated wastewater reused for cooling. Reduces potable demand. Not always evaluated before potable commitments are made — a gap in environmental review.',
      },
      {
        id: 'groundw',
        label: 'Groundwater\nWithdrawal',
        icon: '⛏',
        tag: 'PART',
        tagcls: 'tag-t',
        detail:
          'Private wells for large withdrawals require registration and possibly state permits. Withdrawal at scale can affect neighboring wells — a significant litigation trigger.',
      },
    ],
  },
  {
    id: 'env',
    label: 'Environmental\nRegulators',
    icon: '🌿',
    color: '#4fb87c',
    angle: 216,
    controls:
      'Air permits, water permits, wetlands jurisdiction, stormwater authorization, cumulative impact review',
    wants: 'Regulatory compliance, environmental protection, legal defensibility of issued permits',
    provides: 'Air permits, water withdrawal permits, wetlands approvals, stormwater authorization',
    receives: 'Application fees, monitoring data, annual compliance reports',
    transparency:
      'PARTIALLY DISCLOSED — permit applications are public; enforcement settlements sometimes redacted.',
    risks: [
      'Environmental risk',
      'Legal risk — permit challenges',
      'Regulatory risk — NEPA gap for private projects',
    ],
    documents: [
      'Air permit application',
      'Stormwater permit (NPDES)',
      'Wastewater/NPDES permit',
      'Wetlands authorization',
      'Water withdrawal permit',
      'Generator emissions inventory',
      'Environmental site assessment',
    ],
    litigation: [
      'Air permit challenge — generator aggregation issue',
      'Clean Water Act wetlands dispute',
      'Stormwater violation enforcement action',
      'Cumulative impact review demand',
      'Environmental permit appeal',
    ],
    questions: [
      'Are generator emissions evaluated individually or as one combined source?',
      'Are cumulative impacts reviewed if no federal nexus exists?',
      'Does NEPA apply to this project?',
    ],
    subnodes: [
      {
        id: 'stateenv',
        label: 'State Env\nAgency',
        icon: '🏭',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'Issues air, water, wetlands, and stormwater permits. Each is a separate proceeding with its own public comment window. Agency may not coordinate across permit types — a key gap.',
      },
      {
        id: 'epafed',
        label: 'EPA /\nFederal',
        icon: '🇺🇸',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'NEPA applies only when there is a federal nexus (federal land, permit, or financing). Private data centers on private land may not trigger NEPA despite enormous cumulative impacts.',
      },
      {
        id: 'genems',
        label: 'Generator\nEmissions',
        icon: '🔥',
        tag: 'PART',
        tagcls: 'tag-t',
        detail:
          'Hundreds of backup diesel generators may collectively constitute a major emission source. Legal question: are they evaluated individually or aggregated as one facility under Clean Air Act?',
      },
      {
        id: 'wetl',
        label: 'Wetlands /\nStreams',
        icon: '🌊',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'Filling wetlands requires Clean Water Act Section 404 authorization. Army Corps may have jurisdiction. Mitigation required. Wetlands permits are public and subject to challenge.',
      },
    ],
  },
  {
    id: 'fin',
    label: 'Financial\nInstitutions',
    icon: '🏦',
    color: '#b84f8c',
    angle: 252,
    controls:
      'Project financing, bond issuance, equity investment, public authority financing, REIT structures',
    wants: 'Returns, security, tax efficiency, predictable cash flows, incentive certainty',
    provides: 'Capital, debt financing, equity, bond issuance, tax-credit investment',
    receives: 'Interest, investment returns, tax benefits, performance guarantees',
    transparency:
      'PRIVATE — financing terms, investor identity, and bond covenants are largely private.',
    risks: ['Financial risk', 'Schedule risk', 'Legal risk — default or clawback triggers investor loss'],
    documents: [
      'Loan agreement',
      'Bond documents',
      'Investment agreement',
      'REIT structure filings',
      'Tax credit agreements',
      'Letter of credit for utility',
      'Infrastructure fund terms',
    ],
    litigation: [
      'Bond default challenge',
      'Clawback triggering investor loss',
      'Tax credit recapture dispute',
      'Public authority financing challenge',
    ],
    questions: [
      'Is public authority financing being used?',
      'Are tax-exempt bonds subsidizing private infrastructure?',
      'Who bears financial risk if the project is abandoned mid-construction?',
    ],
    subnodes: [
      {
        id: 'lenders',
        label: 'Institutional\nLenders',
        icon: '💳',
        tag: 'PRIV',
        tagcls: 'tag-r',
        detail:
          'Banks and infrastructure lenders provide project finance. Loan agreements are private. Lender due diligence may include environmental and regulatory risk assessments not visible to the public.',
      },
      {
        id: 'equity',
        label: 'Private Equity\n/ REIT',
        icon: '📈',
        tag: 'PRIV',
        tagcls: 'tag-r',
        detail:
          'Infrastructure funds and REITs increasingly finance data-center campuses. REIT structure separates real estate ownership from operations, affecting tax and liability.',
      },
      {
        id: 'pubauth',
        label: 'Public\nAuthority',
        icon: '🏛',
        tag: 'PART',
        tagcls: 'tag-t',
        detail:
          'Industrial development authority or municipal bond issuer may provide tax-exempt financing. Public authority involvement can trigger disclosure requirements and public hearings.',
      },
      {
        id: 'taxcred',
        label: 'Tax Credits\n/ Bonds',
        icon: '🎫',
        tag: 'PART',
        tagcls: 'tag-t',
        detail:
          'Federal and state tax credits, tax-exempt bonds, or opportunity-zone investments may layer on top of direct incentives, increasing total public subsidy without appearing in any one document.',
      },
    ],
  },
  {
    id: 'infra',
    label: 'Contractors\n/ Infrastructure',
    icon: '🔩',
    color: '#b8874f',
    angle: 288,
    controls:
      'Construction timeline, labor sourcing, infrastructure specifications, fiber and road routing, cooling system design',
    wants: 'Contracts, timeline certainty, payment, site access, skilled labor pool',
    provides:
      'Construction, electrical, plumbing, mechanical, fiber, roads, security systems, cooling',
    receives: 'Contract payments, subcontract work, ongoing maintenance contracts post-opening',
    transparency:
      'PRIVATE — contract terms are private; subcontractor lists and labor conditions rarely publicly disclosed.',
    risks: [
      'Schedule risk',
      'Community risk — labor displacement if local hiring not required',
      'Environmental risk — stormwater during construction',
    ],
    documents: [
      'Construction contracts',
      'Subcontract agreements',
      'Labor compliance certifications',
      'Stormwater construction permits',
      'Building permits',
      'Infrastructure reimbursement agreement',
    ],
    litigation: [
      'Prevailing wage dispute',
      'Construction lien claims',
      'Environmental violation during construction',
      'Stormwater enforcement action',
    ],
    questions: [
      'Are local workers being hired?',
      'Are prevailing wage requirements met and enforced?',
      'Who owns infrastructure built at public or ratepayer expense?',
    ],
    subnodes: [
      {
        id: 'gencon',
        label: 'General\nContractor',
        icon: '🏗',
        tag: 'PRIV',
        tagcls: 'tag-r',
        detail:
          'Manages construction. Contract terms private. May receive infrastructure reimbursement from local government for roads, pipes, and utility connections built to serve the project.',
      },
      {
        id: 'fibroad',
        label: 'Fiber /\nRoads',
        icon: '🛣',
        tag: 'PRIV',
        tagcls: 'tag-r',
        detail:
          'Fiber and road infrastructure may be built by developer but later transferred to public entity, or built by public entity and reimbursed by developer. Ownership determines who controls access.',
      },
      {
        id: 'cooling',
        label: 'Cooling\nSystems',
        icon: '❄',
        tag: 'PRIV',
        tagcls: 'tag-r',
        detail:
          'Cooling technology choice (air, evaporative, liquid, immersion) determines water consumption. Decision made privately but has major public water-use consequences for years.',
      },
      {
        id: 'sec',
        label: 'Security /\nFencing',
        icon: '🔐',
        tag: 'PRIV',
        tagcls: 'tag-r',
        detail:
          'High-security perimeters can fragment agricultural land and create barriers for neighboring properties. Security infrastructure sometimes extends well beyond the immediate campus site.',
      },
    ],
  },
  {
    id: 'courts',
    label: 'Courts &\nAdmin Review',
    icon: '⚖',
    color: '#bf6c6c',
    angle: 324,
    controls:
      'Legal validity of permits, zoning decisions, incentive agreements, environmental approvals, eminent domain proceedings',
    wants: 'Legal compliance, procedural fairness, complete administrative record',
    provides: 'Injunctions, remand orders, enforcement, damage awards, settlement pressure',
    receives: 'Appeals, lawsuits, administrative filings, public records requests, constitutional challenges',
    transparency: 'PUBLIC — court proceedings and records are generally public after filing.',
    risks: ['Legal risk', 'Schedule risk — injunctions can halt construction', 'Financial risk — damages or clawback enforcement'],
    documents: [
      'Zoning appeal',
      'Special-use permit challenge',
      'Environmental permit challenge',
      'FOIA/public records request',
      'Eminent domain complaint',
      'Deed restriction claim',
      'Utility rate case filing',
      'Open meetings complaint',
    ],
    litigation: [
      'Zoning appeal by neighbors or advocacy groups',
      'Environmental permit challenge',
      'Utility rate case — consumer advocates',
      'Deed restriction enforcement — former landowners',
      'FOIA litigation for confidential records',
      'Constitutional challenge to tax exemption',
      'Nuisance claims — noise, emissions, groundwater',
    ],
    questions: [
      'Can residents challenge a decision already made?',
      'What information stays confidential even after litigation begins?',
      'Can the state recover incentives through court enforcement of clawback provisions?',
    ],
    subnodes: [
      {
        id: 'statecourt',
        label: 'State\nCourts',
        icon: '⚖',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'Primary venue for zoning appeals, deed restriction claims, nuisance suits, eminent domain challenges, and contract enforcement. Proceedings and records are public.',
      },
      {
        id: 'admin',
        label: 'Admin\nAppeals',
        icon: '📩',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'Environmental permit challenges, utility tariff appeals, and tax exemption disputes are heard by administrative bodies before court. Proceedings typically public.',
      },
      {
        id: 'foia',
        label: 'FOIA /\nPublic Records',
        icon: '🗂',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'Requests for NDAs, incentive applications, utility agreements, and development agreements. Agencies assert exemptions; FOIA litigation is a key accountability tool for communities.',
      },
      {
        id: 'injunct',
        label: 'Injunction /\nDelay',
        icon: '🛑',
        tag: 'PUB',
        tagcls: 'tag-p',
        detail:
          'Courts may issue preliminary injunctions halting construction pending environmental or zoning review. Even temporary injunctions can significantly shift project economics and timelines.',
      },
    ],
  },
];

const LIT_PAIRS = [
  ['dev', 'courts'],
  ['state', 'courts'],
  ['local', 'courts'],
  ['land', 'courts'],
  ['elec', 'courts'],
  ['water', 'courts'],
  ['env', 'courts'],
  ['fin', 'courts'],
  ['dev', 'land'],
  ['dev', 'state'],
  ['local', 'land'],
  ['elec', 'state'],
  ['water', 'env'],
  ['env', 'local'],
];

const ORBIT = 200;
const SUB_EXTRA = 100;
const HUB_R = 46;
const SEC_R = 34;
const SUB_R = 20;
const BASE_SCALE = 1.3;

function hexAlpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function panelState(tag = '', title = '', sub = '', body = '', tagColor = 'rgba(255,255,255,0.3)') {
  return { open: true, tag, title, sub, body, tagColor };
}

export default function HubMap() {
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef({
    W: 0,
    H: 0,
    CX: 0,
    CY: 0,
    scale: BASE_SCALE,
    panX: 0,
    panY: 0,
    litOn: false,
    activeSector: null,
    hovered: null,
    dragging: false,
    dragSX: 0,
    dragSY: 0,
    dragPX: 0,
    dragPY: 0,
  });

  const [litOn, setLitOn] = useState(false);
  const [hintHidden, setHintHidden] = useState(false);
  const [panel, setPanel] = useState({ open: false, tag: '', title: '', sub: '', body: '', tagColor: 'rgba(255,255,255,0.3)' });

  useEffect(() => {
    stateRef.current.litOn = litOn;
  }, [litOn]);

  useEffect(() => {
    const hintTimer = window.setTimeout(() => setHintHidden(true), 5000);
    const initialPanelTimer = window.setTimeout(() => {
      openHubPanel();
    }, 400);

    const cv = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!cv || !wrap) {
      return () => {
        window.clearTimeout(hintTimer);
        window.clearTimeout(initialPanelTimer);
      };
    }

    const ctx = cv.getContext('2d');
    if (!ctx) {
      return () => {
        window.clearTimeout(hintTimer);
        window.clearTimeout(initialPanelTimer);
      };
    }

    function toScreen(wx, wy) {
      const state = stateRef.current;
      const dpr = window.devicePixelRatio;
      return [state.CX + (wx + state.panX) * state.scale * dpr, state.CY + (wy + state.panY) * state.scale * dpr];
    }

    function secPos(angle) {
      const r = ((angle - 90) * Math.PI) / 180;
      return [Math.cos(r) * ORBIT, Math.sin(r) * ORBIT];
    }

    function subPos(sec, idx) {
      const n = sec.subnodes.length;
      const base = ((sec.angle - 90) * Math.PI) / 180;
      const spread = 0.42;
      const off = (idx - (n - 1) / 2) * spread;
      const r = base + off;
      const dist = ORBIT + SUB_EXTRA + Math.abs(idx - (n - 1) / 2) * 8;
      return [Math.cos(r) * dist, Math.sin(r) * dist];
    }

    function drawCircle(wx, wy, r, fill, stroke, sw) {
      const [x, y] = toScreen(wx, wy);
      const dpr = window.devicePixelRatio;
      const rs = r * stateRef.current.scale * dpr;
      ctx.beginPath();
      ctx.arc(x, y, rs, 0, Math.PI * 2);
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = sw * dpr;
        ctx.stroke();
      }
    }

    function drawLine(wx1, wy1, wx2, wy2, color, width, dash) {
      const [x1, y1] = toScreen(wx1, wy1);
      const [x2, y2] = toScreen(wx2, wy2);
      const dpr = window.devicePixelRatio;
      const scale = stateRef.current.scale;
      ctx.beginPath();
      ctx.setLineDash(dash ? [6 * scale * dpr, 4 * scale * dpr] : []);
      ctx.strokeStyle = color;
      ctx.lineWidth = width * scale * dpr;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function drawText(text, wx, wy, offsetY, size, color, align, bold) {
      const [x, y] = toScreen(wx, wy);
      const dpr = window.devicePixelRatio;
      const scale = stateRef.current.scale;
      ctx.fillStyle = color;
      ctx.font = `${bold ? '700' : '400'} ${size * scale * dpr}px Inter, -apple-system, sans-serif`;
      ctx.textAlign = align || 'center';
      ctx.textBaseline = 'middle';
      const lines = text.split('\n');
      lines.forEach((line, i) => {
        const ly = y + offsetY * scale * dpr + (i - (lines.length - 1) / 2) * (size + 2) * scale * dpr;
        ctx.fillText(line, x, ly);
      });
    }

    function drawEmoji(emoji, wx, wy, offsetY, size) {
      const [x, y] = toScreen(wx, wy);
      const dpr = window.devicePixelRatio;
      const scale = stateRef.current.scale;
      ctx.font = `${size * scale * dpr}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, x, y + offsetY * scale * dpr);
    }

    function drawTag(text, wx, wy, cls) {
      const [x, y] = toScreen(wx, wy);
      const dpr = window.devicePixelRatio;
      const scale = stateRef.current.scale;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const rs = (SUB_R + 4) * scale * dpr;
      const tx = x + rs * 0.6;
      const ty = y - rs * 0.6;
      const w = 22 * scale * dpr;
      const h = 10 * scale * dpr;
      let bg;
      let fg;
      if (cls === 'tag-c') {
        bg = 'rgba(255,68,68,0.2)';
        fg = '#ff7070';
      } else if (cls === 'tag-p') {
        bg = 'rgba(76,178,76,0.2)';
        fg = '#6ed06e';
      } else if (cls === 'tag-r') {
        bg = 'rgba(200,150,50,0.2)';
        fg = '#d4a040';
      } else {
        bg = 'rgba(100,140,210,0.2)';
        fg = '#80a8e8';
      }
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.roundRect(tx - w / 2, ty - h / 2, w, h, 2 * scale * dpr);
      ctx.fill();
      ctx.font = `700 ${7 * scale * dpr}px Inter, sans-serif`;
      ctx.fillStyle = isLight ? '#0f172a' : fg;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, tx, ty);
    }

    function draw() {
      const state = stateRef.current;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.clearRect(0, 0, state.W, state.H);

      ctx.strokeStyle = 'rgba(255,255,255,0.015)';
      ctx.lineWidth = 1;
      const dpr = window.devicePixelRatio;
      const gs = 60 * state.scale * dpr;
      const ox = (state.CX + state.panX * state.scale * dpr) % gs;
      const oy = (state.CY + state.panY * state.scale * dpr) % gs;
      for (let x = ox - gs; x < state.W + gs; x += gs) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, state.H);
        ctx.stroke();
      }
      for (let y = oy - gs; y < state.H + gs; y += gs) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(state.W, y);
        ctx.stroke();
      }

      if (state.litOn) {
        LIT_PAIRS.forEach(([a, b]) => {
          const sa = SECTORS.find((s) => s.id === a);
          const sb = SECTORS.find((s) => s.id === b);
          if (!sa || !sb) {
            return;
          }
          const [ax, ay] = secPos(sa.angle);
          const [bx, by] = secPos(sb.angle);
          drawLine(ax, ay, bx, by, 'rgba(255,68,68,0.45)', 1.2, true);
        });
      }

      if (state.activeSector) {
        const [sx, sy] = secPos(state.activeSector.angle);
        state.activeSector.subnodes.forEach((sub, i) => {
          const [sbx, sby] = subPos(state.activeSector, i);
          drawLine(sx, sy, sbx, sby, hexAlpha(state.activeSector.color, 0.25), 1, false);
        });
      }

      SECTORS.forEach((sec) => {
        const [sx, sy] = secPos(sec.angle);
        drawLine(0, 0, sx, sy, hexAlpha(sec.color, 0.35), 1.5, false);
      });

      if (state.activeSector) {
        state.activeSector.subnodes.forEach((sub, i) => {
          const [sbx, sby] = subPos(state.activeSector, i);
          const isHov = state.hovered && state.hovered.type === 'sub' && state.hovered.sub.id === sub.id;
          const r = isHov ? SUB_R * 1.2 : SUB_R;
          drawCircle(
            sbx,
            sby,
            r,
            hexAlpha(state.activeSector.color, isHov ? 0.25 : 0.12),
            hexAlpha(state.activeSector.color, isHov ? 0.8 : 0.45),
            1
          );
          drawEmoji(sub.icon, sbx, sby, -3, 11);
          const lines = sub.label.split('\n');
          lines.forEach((ln, li) => {
            drawText(ln, sbx, sby, r + 10 + li * 11, 8, isLight ? '#0f172a' : 'rgba(255,255,255,0.55)', 'center', false);
          });
          drawTag(sub.tag, sbx, sby, sub.tagcls);
        });
      }

      SECTORS.forEach((sec) => {
        const [sx, sy] = secPos(sec.angle);
        const isActive = state.activeSector && state.activeSector.id === sec.id;
        const isHov = state.hovered && state.hovered.type === 'sector' && state.hovered.sector.id === sec.id;
        const r = isActive || isHov ? SEC_R * 1.15 : SEC_R;

        if (isActive) {
          const [px, py] = toScreen(sx, sy);
          const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 2.5 * state.scale * dpr);
          grad.addColorStop(0, hexAlpha(sec.color, 0.12));
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, r * 2.5 * state.scale * dpr, 0, Math.PI * 2);
          ctx.fill();
        }

        drawCircle(
          sx,
          sy,
          r,
          hexAlpha(sec.color, isActive ? 0.22 : 0.1),
          hexAlpha(sec.color, isActive ? 1 : 0.5),
          isActive ? 2 : 1.5
        );

        drawEmoji(sec.icon, sx, sy, -8, 16);
        const lines = sec.label.split('\n');
        lines.forEach((ln, li) => {
          drawText(
            ln,
            sx,
            sy,
            10 + li * 10,
            8.5,
            isLight ? '#0f172a' : isActive ? '#ffffff' : 'rgba(255,255,255,0.75)',
            'center',
            isActive
          );
        });
      });

      const isHubHov = state.hovered && state.hovered.type === 'hub';
      const hubR = isHubHov ? HUB_R * 1.08 : HUB_R;
      const [hpx, hpy] = toScreen(0, 0);
      const pulse = (Date.now() % 3000) / 3000;
      const pr = (hubR + 20 + pulse * 25) * state.scale * dpr;
      ctx.beginPath();
      ctx.arc(hpx, hpy, pr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - pulse)})`;
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      drawCircle(0, 0, hubR, 'rgba(255,255,255,0.07)', 'rgba(255,255,255,0.45)', 2);
      drawText('HYPERSCALE', 0, 0, -10, 7.5, isLight ? '#0f172a' : 'rgba(255,255,255,0.9)', 'center', true);
      drawText('DATA CENTER', 0, 0, 1, 7.5, isLight ? '#0f172a' : 'rgba(255,255,255,0.9)', 'center', true);
      drawText('HUB', 0, 0, 12, 6.5, isLight ? '#0f172a' : 'rgba(255,255,255,0.4)', 'center', false);

      rafRef.current = requestAnimationFrame(draw);
    }

    function resize() {
      const dpr = window.devicePixelRatio;
      const state = stateRef.current;
      state.W = cv.width = cv.offsetWidth * dpr;
      state.H = cv.height = cv.offsetHeight * dpr;
      cv.style.width = `${cv.offsetWidth}px`;
      cv.style.height = `${cv.offsetHeight}px`;
      state.CX = state.W / 2;
      state.CY = state.H / 2;
    }

    function hitTest(mx, my) {
      const state = stateRef.current;
      const dpr = window.devicePixelRatio;
      const [hx, hy] = toScreen(0, 0);
      if (Math.hypot(mx * dpr - hx, my * dpr - hy) < HUB_R * state.scale * dpr) {
        return { type: 'hub' };
      }
      if (state.activeSector) {
        for (let i = 0; i < state.activeSector.subnodes.length; i += 1) {
          const [sx, sy] = subPos(state.activeSector, i);
          const [px, py] = toScreen(sx, sy);
          if (Math.hypot(mx * dpr - px, my * dpr - py) < SUB_R * state.scale * dpr * 1.5) {
            return { type: 'sub', sector: state.activeSector, sub: state.activeSector.subnodes[i] };
          }
        }
      }
      for (const sec of SECTORS) {
        const [sx, sy] = secPos(sec.angle);
        const [px, py] = toScreen(sx, sy);
        if (Math.hypot(mx * dpr - px, my * dpr - py) < SEC_R * state.scale * dpr * 1.4) {
          return { type: 'sector', sector: sec };
        }
      }
      return null;
    }

    function clientPos(e) {
      const rect = cv.getBoundingClientRect();
      if (e.touches) {
        return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
      }
      return [e.clientX - rect.left, e.clientY - rect.top];
    }

    function onMouseDown(e) {
      const state = stateRef.current;
      state.dragging = true;
      [state.dragSX, state.dragSY] = clientPos(e);
      state.dragPX = state.panX;
      state.dragPY = state.panY;
      wrap.classList.add('dragging');
    }

    function onMouseMove(e) {
      const state = stateRef.current;
      if (state.dragging) {
        const [mx, my] = clientPos(e);
        state.panX = state.dragPX + (mx - state.dragSX) / state.scale;
        state.panY = state.dragPY + (my - state.dragSY) / state.scale;
      } else {
        const rect = cv.getBoundingClientRect();
        const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
        state.hovered = hit;
        cv.style.cursor = hit ? 'pointer' : 'grab';
      }
    }

    function onMouseUp() {
      stateRef.current.dragging = false;
      wrap.classList.remove('dragging');
    }

    function onClick(e) {
      const state = stateRef.current;
      if (state.dragging) {
        return;
      }
      const rect = cv.getBoundingClientRect();
      const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
      if (!hit) {
        closePanel();
        state.activeSector = null;
        return;
      }
      if (hit.type === 'hub') {
        openHubPanel();
        state.activeSector = null;
        return;
      }
      if (hit.type === 'sector') {
        if (state.activeSector && state.activeSector.id === hit.sector.id) {
          state.activeSector = null;
          openSectorPanel(hit.sector);
          return;
        }
        state.activeSector = hit.sector;
        openSectorPanel(hit.sector);
        return;
      }
      if (hit.type === 'sub') {
        openSubPanel(hit.sector, hit.sub);
      }
    }

    function onWheel(e) {
      e.preventDefault();
      const state = stateRef.current;
      const f = e.deltaY > 0 ? 0.9 : 1.1;
      state.scale = Math.max(0.25, Math.min(3, state.scale * f));
    }

    function onTouchStart(e) {
      const state = stateRef.current;
      const [mx, my] = clientPos(e);
      state.dragging = true;
      state.dragSX = mx;
      state.dragSY = my;
      state.dragPX = state.panX;
      state.dragPY = state.panY;
    }

    function onTouchMove(e) {
      e.preventDefault();
      const state = stateRef.current;
      const [mx, my] = clientPos(e);
      state.panX = state.dragPX + (mx - state.dragSX) / state.scale;
      state.panY = state.dragPY + (my - state.dragSY) / state.scale;
    }

    function onTouchEnd() {
      stateRef.current.dragging = false;
    }

    cv.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    cv.addEventListener('click', onClick);
    cv.addEventListener('wheel', onWheel, { passive: false });
    cv.addEventListener('touchstart', onTouchStart, { passive: true });
    cv.addEventListener('touchmove', onTouchMove, { passive: false });
    cv.addEventListener('touchend', onTouchEnd);
    window.addEventListener('resize', resize);

    resize();
    draw();

    return () => {
      window.clearTimeout(hintTimer);
      window.clearTimeout(initialPanelTimer);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      cv.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      cv.removeEventListener('click', onClick);
      cv.removeEventListener('wheel', onWheel);
      cv.removeEventListener('touchstart', onTouchStart);
      cv.removeEventListener('touchmove', onTouchMove);
      cv.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', resize);
    };
  }, []);

  function closePanel() {
    setPanel((prev) => ({ ...prev, open: false }));
  }

  function openHubPanel() {
    const body = `
    <div class="ps"><span class="ps-label">How to use this map</span>
      <p>Click any sector node to expand sub-nodes and read its full intelligence brief. Click a sub-node for detail on a specific actor or document. Toggle <strong>Litigation Overlay</strong> to reveal where legal challenges can fire across the system.</p>
    </div>
    <div class="ps"><span class="ps-label">Core finding</span>
      <p>A hyperscale data center is not created through one state contract. It is a fragmented network of decisions across 10 sectors — each with its own timeline, authority, and transparency level. This fragmentation prevents any single agency, official, or community from asking the complete question:</p>
      <p style="margin-top:10px;color:rgba(255,195,60,0.9);font-style:italic;line-height:1.7">"After tax benefits, water, electricity, infrastructure, environmental effects and permanent employment are combined — is this project actually in the public interest?"</p>
    </div>
    <div class="ps"><span class="ps-label">The "done deal" sequence</span>
      ${[
        ['Step 1', 'Confidential recruitment begins — NDA signed with state'],
        ['Step 2', 'Developer quietly secures land via anonymous LLCs'],
        ['Step 3', 'State offers incentives — privately negotiated'],
        ['Step 4', 'Utility begins expensive infrastructure studies'],
        ['Step 5', 'Company announces billion-dollar investment'],
        ['Step 6', 'Officials publicly celebrate the project'],
        ['Step 7', 'Local zoning and environmental hearings begin'],
        ['Step 8', 'Residents told substantial commitments already made'],
      ]
        .map(([k, v]) => `<div class="irow"><div class="ik">${k}</div><div class="iv">${v}</div></div>`)
        .join('')}
    </div>
    <div class="ps"><span class="ps-label">Ten sectors — click each on the map</span>
      ${SECTORS.map(
        (s) => `<div class="irow"><div class="ik">${s.icon} ${s.id.toUpperCase()}</div><div class="iv">${s.label.replace('\n', ' ')}</div></div>`
      ).join('')}
    </div>`;

    setPanel(
      panelState(
        'INTELLIGENCE MAP',
        'Proposed Hyperscale Data Center',
        'The focal point of a fragmented network of land transactions, tax programs, utility agreements, environmental permits, zoning approvals, infrastructure commitments, and private negotiations spanning 10 sectors.',
        body,
        'rgba(255,255,255,0.3)'
      )
    );
  }

  function openSectorPanel(sec) {
    const body = `
    <div class="ps"><span class="ps-label">Controls</span><p>${sec.controls}</p></div>
    <div class="ps"><span class="ps-label">Wants</span><p>${sec.wants}</p></div>
    <div class="ps"><span class="ps-label">Provides</span><p>${sec.provides}</p></div>
    <div class="ps"><span class="ps-label">Receives</span><p>${sec.receives}</p></div>
    <div class="ps"><span class="ps-label">Risk tags</span><div class="tags">${sec.risks.map((r) => `<span class="tag tag-risk">${r}</span>`).join('')}</div></div>
    <div class="ps"><span class="ps-label">Key documents</span>${sec.documents.map((d) => `<div class="doc">${d}</div>`).join('')}</div>
    <div class="ps"><span class="ps-label">Litigation exposure</span>${sec.litigation.map((l) => `<div class="lit-item"><span class="lit-dot">⬤</span>${l}</div>`).join('')}</div>
    <div class="ps"><span class="ps-label">Public-interest questions</span>${sec.questions.map((q) => `<div class="q-item"><span class="qm">?</span>${q}</div>`).join('')}</div>
    <div class="ps"><span class="ps-label">Sub-nodes (now visible on map)</span>${sec.subnodes.map((s) => `<div class="irow"><div class="ik">${s.icon} ${s.tag}</div><div class="iv">${s.label.replace('\n', ' ')}</div></div>`).join('')}</div>`;

    setPanel(
      panelState(
        sec.label.replace('\n', ' / ').toUpperCase(),
        sec.label.replace('\n', ' / '),
        `${sec.icon}  ${sec.transparency}`,
        body,
        sec.color
      )
    );
  }

  function openSubPanel(sec, sub) {
    const body = `
    <div class="ps"><span class="ps-label">Transparency</span><div class="tags"><span class="tag ${sub.tagcls}">${sub.tag}</span></div></div>
    <div class="ps"><span class="ps-label">Sector context</span>
      <div class="irow"><div class="ik">Controls</div><div class="iv">${sec.controls}</div></div>
      <div class="irow"><div class="ik">Wants</div><div class="iv">${sec.wants}</div></div>
      <div class="irow"><div class="ik">Provides</div><div class="iv">${sec.provides}</div></div>
      <div class="irow"><div class="ik">Receives</div><div class="iv">${sec.receives}</div></div>
    </div>
    <div class="ps"><span class="ps-label">Risk tags</span><div class="tags">${sec.risks.map((r) => `<span class="tag tag-risk">${r}</span>`).join('')}</div></div>
    <div class="ps"><span class="ps-label">Key documents — this sector</span>${sec.documents.map((d) => `<div class="doc">${d}</div>`).join('')}</div>
    <div class="ps"><span class="ps-label">Litigation exposure</span>${sec.litigation.map((l) => `<div class="lit-item"><span class="lit-dot">⬤</span>${l}</div>`).join('')}</div>
    <div class="ps"><span class="ps-label">Public-interest questions</span>${sec.questions.map((q) => `<div class="q-item"><span class="qm">?</span>${q}</div>`).join('')}</div>`;

    setPanel(
      panelState(
        `${sec.label.replace('\n', ' / ').toUpperCase()} › ${sub.label.replace('\n', ' ')}`,
        sub.label.replace('\n', ' '),
        sub.detail,
        body,
        sec.color
      )
    );
  }

  function zoom(f) {
    const state = stateRef.current;
    state.scale = Math.max(0.25, Math.min(3, state.scale * f));
  }

  function resetView() {
    const state = stateRef.current;
    state.scale = BASE_SCALE;
    state.panX = 0;
    state.panY = 0;
    state.activeSector = null;
    closePanel();
  }

  function toggleLit() {
    setLitOn((prev) => !prev);
  }

  return (
    <div className="hub-map-root">
      <style>{`
* { box-sizing: border-box; margin: 0; padding: 0; }
.hub-map-root { background: #06070e; color: #e8e9f0; font-family: 'Inter', -apple-system, sans-serif; overflow: hidden; width: 100vw; height: 100vh; }
:root {
  --hm-text-main: #e8e9f0;
  --hm-text-sub: #b3bdd8;
  --hm-text-muted: #98a3c2;
  --hm-text-faint: #8792b3;
}
html[data-theme='light'] .hub-map-root {
  background: #f3f6fb;
  color: #0f172a;
  --hm-text-main: #0f172a;
  --hm-text-sub: #334155;
  --hm-text-muted: #475569;
  --hm-text-faint: #64748b;
}

#toolbar {
  position: fixed; top: 0; left: 0; right: 0; height: 50px; z-index: 100;
  background: rgba(6,7,14,0.98); border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex; align-items: center; padding: 0 20px; gap: 10px;
}
html[data-theme='light'] #toolbar {
  background: rgba(255,255,255,0.98);
  border-bottom: 1px solid rgba(15,23,42,0.14);
}
#toolbar h1 { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; flex: 1; color: var(--hm-text-main); }
#toolbar h1 span { color: var(--hm-text-faint); font-weight: 500; }
.tb-btn {
  font-size: 10px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
  padding: 5px 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px;
  background: transparent; color: var(--hm-text-sub); cursor: pointer; transition: all 0.2s;
}
.tb-btn:hover { border-color: rgba(255,255,255,0.3); color: #e8e9f0; }
.tb-btn.lit-on { border-color: #ff4444; color: #ff4444; background: rgba(255,68,68,0.1); }
html[data-theme='light'] .tb-btn {
  border-color: rgba(15,23,42,0.22);
  color: var(--hm-text-sub);
  background: #ffffff;
}
html[data-theme='light'] .tb-btn:hover {
  border-color: rgba(15,23,42,0.4);
  color: var(--hm-text-main);
}
.tb-btn:focus-visible, #panel-close:focus-visible, .zbtn:focus-visible {
  outline: 2px solid #93c5fd;
  outline-offset: 2px;
}

#canvas-wrap {
  position: fixed; top: 50px; left: 0; right: 0; bottom: 0;
  cursor: grab; overflow: hidden;
}
#canvas-wrap.dragging { cursor: grabbing; }

canvas#map { display: block; width: 100%; height: 100%; }

#panel {
  position: fixed; top: 50px; right: -430px; bottom: 0; width: 420px;
  background: #0d1020; border-left: 1px solid rgba(255,255,255,0.07);
  transition: right 0.3s ease; z-index: 200; display: flex; flex-direction: column;
  overflow: hidden;
}
html[data-theme='light'] #panel {
  background: #ffffff;
  border-left: 1px solid rgba(15,23,42,0.14);
}
#panel.open { right: 0; }
#panel-head {
  padding: 18px 22px 14px; border-bottom: 1px solid rgba(255,255,255,0.07); flex-shrink: 0;
}
#panel-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 6px; }
#panel-title { font-size: 15px; font-weight: 700; letter-spacing: 0.03em; line-height: 1.35; }
#panel-sub { font-size: 12px; color: var(--hm-text-sub); margin-top: 5px; line-height: 1.55; }
#panel-close {
  position: absolute; top: 14px; right: 18px;
  width: 26px; height: 26px; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px; background: transparent; color: var(--hm-text-sub);
  cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;
}
#panel-close:hover { color: #e8e9f0; border-color: rgba(255,255,255,0.3); }
#panel-body { flex: 1; overflow-y: auto; padding: 18px 22px; }
#panel-body::-webkit-scrollbar { width: 3px; }
#panel-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

.ps { margin-bottom: 18px; }
.ps-label { font-size: 8px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--hm-text-faint); display: block; margin-bottom: 7px; }
.ps p { font-size: 12px; color: var(--hm-text-sub); line-height: 1.65; }
.irow { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 11px; }
.irow:last-child { border-bottom: none; }
.ik { color: var(--hm-text-faint); min-width: 80px; flex-shrink: 0; font-size: 9px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding-top: 1px; }
.iv { color: var(--hm-text-sub); line-height: 1.55; }
.tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 3px; }
.tag { font-size: 9px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding: 3px 7px; border-radius: 3px; }
.tag-c { background: rgba(255,68,68,0.12); color: #ff7070; border: 1px solid rgba(255,68,68,0.25); }
.tag-p { background: rgba(76,178,76,0.12); color: #6ed06e; border: 1px solid rgba(76,178,76,0.25); }
.tag-r { background: rgba(200,150,50,0.12); color: #d4a040; border: 1px solid rgba(200,150,50,0.25); }
.tag-t { background: rgba(100,140,210,0.12); color: #80a8e8; border: 1px solid rgba(100,140,210,0.25); }
.tag-risk { background: rgba(150,80,200,0.12); color: #b070d8; border: 1px solid rgba(150,80,200,0.25); }
.doc { font-size: 10px; color: var(--hm-text-muted); padding: 5px 8px; border: 1px solid rgba(255,255,255,0.08); border-radius: 3px; margin-bottom: 3px; display: flex; gap: 6px; }
.doc::before { content: '▸'; flex-shrink: 0; }
.lit-item { font-size: 11px; color: rgba(255,90,90,0.75); padding: 5px 0; border-bottom: 1px solid rgba(255,68,68,0.07); display: flex; gap: 6px; line-height: 1.5; }
.lit-item:last-child { border-bottom: none; }
.lit-dot { color: #ff4444; flex-shrink: 0; }
.q-item { font-size: 11px; color: rgba(255,195,60,0.8); padding: 5px 0; border-bottom: 1px solid rgba(255,195,60,0.06); display: flex; gap: 5px; line-height: 1.5; }
.q-item:last-child { border-bottom: none; }
.qm { color: rgba(255,195,60,0.5); flex-shrink: 0; font-weight: 700; }

#legend {
  position: fixed; left: 16px; bottom: 16px; z-index: 100;
  background: rgba(13,16,32,0.92); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 6px; padding: 12px 14px; backdrop-filter: blur(8px);
}
html[data-theme='light'] #legend {
  background: rgba(255,255,255,0.96);
  border: 1px solid rgba(15,23,42,0.16);
}
#legend h3 { font-size: 8px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--hm-text-faint); margin-bottom: 9px; }
.leg { display: flex; align-items: center; gap: 7px; font-size: 9px; color: var(--hm-text-sub); margin-bottom: 5px; letter-spacing: 0.03em; }
.leg-circle { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.leg-line { width: 18px; height: 1.5px; flex-shrink: 0; }
.leg-dash { width: 18px; height: 0; border-top: 1.5px dashed #ff4444; flex-shrink: 0; }
.leg-sep { border-top: 1px solid rgba(255,255,255,0.05); margin: 7px 0; }

#zoom-btns { position: fixed; right: 16px; bottom: 16px; z-index: 100; display: flex; flex-direction: column; gap: 4px; }
.zbtn { width: 30px; height: 30px; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; background: rgba(13,16,32,0.9); color: var(--hm-text-sub); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.zbtn:hover { color: #e8e9f0; border-color: rgba(255,255,255,0.3); }
html[data-theme='light'] .zbtn {
  background: rgba(255,255,255,0.96);
  border-color: rgba(15,23,42,0.2);
}
html[data-theme='light'] .zbtn:hover {
  color: var(--hm-text-main);
  border-color: rgba(15,23,42,0.45);
}

#hint { position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--hm-text-faint); pointer-events: none; transition: opacity 1s; z-index: 50; }

.site-nav{display:flex;gap:5px;flex-wrap:wrap;align-items:center;flex-shrink:0}
.sn{font-family:monospace;font-size:8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:4px 9px;border:1px solid rgba(255,255,255,.08);border-radius:3px;background:transparent;color:#5a5e78;text-decoration:none;white-space:nowrap;transition:all .15s}
.sn:hover{border-color:rgba(255,255,255,.25);color:#dde0f0}
.sn.sn-home{border-color:rgba(108,142,191,.3);color:#6c8ebf}
.sn.sn-home:hover{background:rgba(108,142,191,.08);border-color:#6c8ebf}
.sn.sn-active{background:rgba(255,255,255,.07);color:#dde0f0;border-color:rgba(255,255,255,.18)}
@media(max-width:780px){.sn{font-size:7px;padding:3px 7px}}
@media(max-width:520px){.site-nav .sn-label{display:none}.sn{padding:4px 7px}}
      `}</style>

      <div id="toolbar" role="region" aria-label="Hub map controls">
        <h1>
          HYPERSCALE DATA CENTER <span>/ Intelligence Map — Hub &amp; Spoke</span>
        </h1>
        <button
          type="button"
          className={`tb-btn ${litOn ? 'lit-on' : ''}`}
          id="lit-btn"
          aria-pressed={litOn}
          aria-label="Toggle litigation overlay"
          onClick={toggleLit}
        >
          ⬤ Litigation Overlay
        </button>
        <button type="button" className="tb-btn" onClick={resetView} aria-label="Reset map view">
          ↺ Reset
        </button>
        <Nav />
      </div>

      <div id="canvas-wrap" ref={canvasWrapRef} role="img" aria-label="Interactive hub and spoke map">
        <canvas
          id="map"
          ref={canvasRef}
          tabIndex={0}
          aria-label="Interactive hub and spoke map. Use mouse or touch to pan and zoom, then select sectors for details."
        />
      </div>

      <div id="panel" className={panel.open ? 'open' : ''} role="dialog" aria-modal="false" aria-hidden={!panel.open}>
        <button type="button" id="panel-close" onClick={closePanel} aria-label="Close details panel">
          ✕
        </button>
        <div id="panel-head">
          <span id="panel-tag" style={{ color: panel.tagColor }}>
            {panel.tag}
          </span>
          <div id="panel-title">{panel.title}</div>
          <div id="panel-sub">{panel.sub}</div>
        </div>
        <div id="panel-body" dangerouslySetInnerHTML={{ __html: panel.body }} />
      </div>

      <div id="legend">
        <h3>Legend</h3>
        <div className="leg">
          <div
            className="leg-circle"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.5)' }}
          />
          Data Center Hub
        </div>
        <div className="leg">
          <div
            className="leg-circle"
            style={{ background: 'rgba(108,142,191,0.2)', border: '1.5px solid rgba(108,142,191,0.6)' }}
          />
          Sector node
        </div>
        <div className="leg">
          <div
            className="leg-circle"
            style={{
              width: '9px',
              height: '9px',
              background: 'rgba(108,142,191,0.15)',
              border: '1px solid rgba(108,142,191,0.5)',
            }}
          />
          Sub-node
        </div>
        <div className="leg">
          <div className="leg-line" style={{ background: 'rgba(255,255,255,0.2)' }} />
          Relationship
        </div>
        <div className="leg">
          <div className="leg-dash" />
          Litigation risk
        </div>
        <div className="leg-sep" />
        <div className="leg">
          <span
            style={{
              fontSize: '8px',
              background: 'rgba(255,68,68,0.15)',
              color: '#ff7070',
              padding: '1px 5px',
              borderRadius: '2px',
              fontWeight: 700,
            }}
          >
            CONF
          </span>
          Confidential
        </div>
        <div className="leg">
          <span
            style={{
              fontSize: '8px',
              background: 'rgba(76,178,76,0.15)',
              color: '#6ed06e',
              padding: '1px 5px',
              borderRadius: '2px',
              fontWeight: 700,
            }}
          >
            PUB
          </span>
          Public
        </div>
        <div className="leg">
          <span
            style={{
              fontSize: '8px',
              background: 'rgba(200,150,50,0.15)',
              color: '#d4a040',
              padding: '1px 5px',
              borderRadius: '2px',
              fontWeight: 700,
            }}
          >
            PRIV
          </span>
          Private
        </div>
        <div className="leg">
          <span
            style={{
              fontSize: '8px',
              background: 'rgba(100,140,210,0.15)',
              color: '#80a8e8',
              padding: '1px 5px',
              borderRadius: '2px',
              fontWeight: 700,
            }}
          >
            PART
          </span>
          Partial
        </div>
      </div>

      <div id="zoom-btns">
        <button type="button" className="zbtn" onClick={() => zoom(1.15)} aria-label="Zoom in">
          +
        </button>
        <button type="button" className="zbtn" onClick={() => zoom(0.87)} aria-label="Zoom out">
          −
        </button>
      </div>

      <div id="hint" style={{ opacity: hintHidden ? 0 : 1 }}>
        Click any node · Drag to pan · Scroll to zoom
      </div>
    </div>
  );
}
