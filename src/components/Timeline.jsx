import { useEffect, useRef, useState } from 'react';
import Nav from './Nav';

const TRACKS = [
  { id: 'main', label: 'Main', color: 'var(--c-main)' },
  { id: 'land', label: 'Land', color: 'var(--c-land)' },
  { id: 'util', label: 'Utility', color: 'var(--c-util)' },
  { id: 'reg', label: 'Regulatory', color: 'var(--c-reg)' },
  { id: 'fin', label: 'Financial', color: 'var(--c-fin)' },
  { id: 'lit', label: 'Litigation', color: 'var(--c-lit)' },
];

const TRACK_NAMES = {
  main: 'Main Flow',
  land: 'Land Track',
  util: 'Utility Track',
  reg: 'Regulatory Track',
  fin: 'Financial Track',
  lit: 'Litigation Exposure',
};

const TRACK_COLORS = {
  main: 'var(--c-main)',
  land: 'var(--c-land)',
  util: 'var(--c-util)',
  reg: 'var(--c-reg)',
  fin: 'var(--c-fin)',
  lit: 'var(--c-lit)',
};

const PHASES = [
  {
    num: '01',
    name: 'Market Demand',
    color: '#3a4060',
    width: 1,
    cols: [
      {
        main: {
          label: 'AI / Cloud Demand',
          actors: 'Hyperscaler internal strategy team',
          docs: ['Market feasibility', 'Latency map', 'Energy-access study', 'Tax-jurisdiction analysis'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL — internal corporate strategy, never public',
          risks: ['Strategic risk', 'Competitive risk'],
          litigation: [],
          questions: ['Which states are being evaluated?', 'What power thresholds drive site requirements?'],
        },
        land: {
          label: 'Geographic Target',
          actors: 'Site-selection consultant',
          docs: ['Regional land scan', 'County GIS data review'],
          tags: [{ t: 'PRIV', c: 'ntag-r' }],
          transparency: 'PRIVATE',
          risks: ['Land risk'],
          litigation: [],
          questions: [],
        },
        util: {
          label: 'Power & Fiber Scan',
          actors: 'Site-selection consultant, utility brokers',
          docs: ['Available grid capacity map', 'Fiber route map'],
          tags: [{ t: 'PRIV', c: 'ntag-r' }],
          transparency: 'PRIVATE',
          risks: ['Grid risk'],
          litigation: [],
          questions: ['Which utilities have available capacity?'],
        },
        reg: {
          label: 'Regulatory Scan',
          actors: 'Legal counsel',
          docs: ['State incentive survey', 'Environmental baseline'],
          tags: [{ t: 'PRIV', c: 'ntag-r' }],
          transparency: 'PRIVATE',
          risks: ['Regulatory risk'],
          litigation: [],
          questions: [],
        },
        fin: {
          label: 'Capital Allocation',
          actors: 'CFO, investors, board',
          docs: ['Internal pro forma', 'Capital budget authorization'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL',
          risks: ['Financial risk'],
          litigation: [],
          questions: [],
        },
        lit: { empty: true },
      },
    ],
  },
  {
    num: '02',
    name: 'Confidential State Recruitment',
    color: '#2a4030',
    width: 1,
    cols: [
      {
        main: {
          label: 'State RFI Issued',
          actors: 'Site consultant → State econ-dev agency, Governor\'s office',
          docs: ['Project RFI (confidential)', 'NDA with state', 'Project code-name file'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL — NDA prevents public disclosure',
          risks: ['Political risk', 'Reputational risk'],
          litigation: ['FOIA challenge: residents seek NDA and RFI records', 'Open meetings challenge if board discussed project'],
          questions: ['Which states received the RFI?', 'What commitments did officials make under NDA?'],
        },
        land: {
          label: 'State Site Proposals',
          actors: 'State econ-dev, local authorities',
          docs: ['Candidate site list (confidential)', 'County infrastructure maps'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL',
          risks: ['Land risk'],
          litigation: [],
          questions: ['Were preferred sites pre-selected before public process?'],
        },
        util: {
          label: 'Utility Capacity Check',
          actors: 'State econ-dev, utility executives',
          docs: ['Informal load capacity review', 'Fiber corridor assessment'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL',
          risks: ['Grid risk'],
          litigation: [],
          questions: [],
        },
        reg: {
          label: 'Incentive Package Drafted',
          actors: 'State econ-dev, legal, tax dept',
          docs: ['Draft incentive term sheet', 'Tax exemption assessment', 'Clawback provisions draft'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL',
          risks: ['Political risk'],
          litigation: ['Constitutional challenge if incentive bypasses legislative approval'],
          questions: ['Was the legislature involved or bypassed?', 'Are incentive projections independently verified?'],
        },
        fin: {
          label: 'Incentive Pro Forma',
          actors: 'Developer finance team, state econ-dev',
          docs: ['10-year net present value model', 'Tax benefit calculation'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL',
          risks: ['Financial risk'],
          litigation: [],
          questions: ['What is the total public subsidy in NPV terms?'],
        },
        lit: {
          label: 'FOIA Window Opens',
          actors: 'Community groups, journalists',
          docs: ['Public records requests for NDA', 'State FOIA statutes'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — records can be requested; agencies may assert exemptions',
          risks: ['Legal risk'],
          litigation: ['FOIA litigation if records are withheld', 'Open meetings violation if discussions were in private'],
          questions: ['Are NDA terms themselves subject to FOIA?'],
        },
      },
    ],
  },
  {
    num: '◇',
    name: 'GATE: State Selected',
    color: '#2a2a18',
    width: 1,
    gate: true,
    gateLabel: 'State\nSelected?',
    gateSub: 'Utility capacity + incentive package + site availability must all confirm. If not → return to Phase 02 or exit.',
    gateOutcomes: ['Yes → proceed to land control', 'No → reopen RFI to other states', 'Partial → negotiate conditions'],
  },
  {
    num: '03',
    name: 'Land Control',
    color: '#2a2010',
    width: 1,
    cols: [
      {
        main: {
          label: 'Site Secured (Confidential)',
          actors: 'Shell LLC, real-estate attorney, site consultant',
          docs: ['Land option agreements', 'Purchase and sale agreements', 'Parcel assembly map'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL — LLC identity not public until deed recording',
          risks: ['Land risk', 'Schedule risk'],
          litigation: ['LLC identity challenge via FOIA', 'Deed restriction enforcement if prior conditions exist', 'Challenge to annexation if rushed'],
          questions: ['Who controls the shell LLCs?', 'Were neighboring landowners given fair market information?', 'Is the full project scale disclosed to individual sellers?'],
        },
        land: {
          label: 'Parcel Assembly',
          actors: 'Shell LLC, title company, real-estate broker',
          docs: ['Individual purchase options', 'Title searches', 'Boundary surveys', 'Environmental site assessments'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL — recorded only after option exercise',
          risks: ['Land risk'],
          litigation: ['Deed restriction litigation — Taylor TX example', 'Groundwater rights dispute', 'Eminent domain for adjacent parcels or easements'],
          questions: ['Were deed restrictions reviewed before acquisition?', 'Are water rights included or separate?'],
        },
        util: {
          label: 'Infrastructure Easements Identified',
          actors: 'Developer, utility, title company',
          docs: ['Easement identification study', 'Right-of-way assessment', 'Transmission corridor map'],
          tags: [{ t: 'PRIV', c: 'ntag-r' }],
          transparency: 'PRIVATE — easement routes not yet public',
          risks: ['Grid risk', 'Land risk'],
          litigation: ['Eminent domain for transmission easements across non-participating land'],
          questions: ['Which landowners are affected by utility easements but not purchasing the site?'],
        },
        reg: {
          label: 'Zoning Due Diligence',
          actors: 'Land-use attorney, planning consultant',
          docs: ['Existing zoning assessment', 'Deed restriction review', 'Annexation feasibility study'],
          tags: [{ t: 'PRIV', c: 'ntag-r' }],
          transparency: 'PRIVATE',
          risks: ['Regulatory risk'],
          litigation: ['Pre-annexation challenge if jurisdiction unclear'],
          questions: ['Is current zoning permissive or does rezoning require public vote?'],
        },
        fin: {
          label: 'Land Financing',
          actors: 'Developer, institutional lender',
          docs: ['Bridge loan for land', 'Option exercise funding', 'Title insurance'],
          tags: [{ t: 'PRIV', c: 'ntag-r' }],
          transparency: 'PRIVATE',
          risks: ['Financial risk'],
          litigation: [],
          questions: [],
        },
        lit: {
          label: 'Deed Restriction Risk',
          actors: 'Former landowners, community groups',
          docs: ['Prior deed conditions', 'Chain of title review'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED — deeds are public after recording',
          risks: ['Legal risk'],
          litigation: ['Deed restriction enforcement suit (Taylor TX model)', 'Nuisance claim from neighboring landowners'],
          questions: ['Were deed conditions disclosed to the municipality?', 'Can residents enforce deed restrictions against a city or developer?'],
        },
      },
    ],
  },
  {
    num: '04',
    name: 'Incentive Negotiation',
    color: '#251828',
    width: 1,
    cols: [
      {
        main: {
          label: 'Incentive Package Finalized',
          actors: 'Developer, state econ-dev, governor\'s office, tax dept',
          docs: ['Performance agreement', 'Clawback agreement', 'Tax exemption certification', 'MOU', 'Development agreement (draft)'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL until approved — then partially disclosed',
          risks: ['Political risk', 'Financial risk'],
          litigation: ['Open meetings challenge on board approval', 'Constitutional challenge to tax exemption', 'FOIA for performance agreement terms'],
          questions: ['What is the total value of incentives waived?', 'Are clawback provisions enforceable and funded?', 'Did the legislature authorize or was this executive action?'],
        },
        land: {
          label: 'Land Conditions Tied to Incentives',
          actors: 'State econ-dev, local authority',
          docs: ['Land-use conditions in performance agreement', 'Agricultural land conversion terms'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL',
          risks: ['Land risk'],
          litigation: [],
          questions: ['Does the performance agreement require the developer to maintain agricultural buffers?'],
        },
        util: {
          label: 'Utility Commitments Linked to Incentives',
          actors: 'State, utility, developer',
          docs: ['Utility infrastructure commitment letter', 'Cost-sharing terms'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL',
          risks: ['Grid risk', 'Financial risk'],
          litigation: ['Utility rate case if ratepayers subsidize infrastructure'],
          questions: ['Are utility upgrades a condition of the incentive package?'],
        },
        reg: {
          label: 'Fast-Track Permitting Commitment',
          actors: 'State, local government',
          docs: ['Expedited permitting MOU', 'Designated economic project status'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL — may reduce public review time',
          risks: ['Regulatory risk'],
          litigation: ['Procedural challenge: was required review time shortened?'],
          questions: ['Does fast-tracking reduce public comment periods below statutory minimum?'],
        },
        fin: {
          label: 'Tax Benefit Modeled',
          actors: 'Developer, financial institutions, tax counsel',
          docs: ['Tax exemption NPV model', 'Bond financing feasibility', 'REIT structure finalization'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL',
          risks: ['Financial risk'],
          litigation: ['Tax credit recapture dispute if project changes scope'],
          questions: ['Is public authority financing being used?', 'Who bears risk if project underperforms?'],
        },
        lit: {
          label: 'Pre-Approval Challenge Risk',
          actors: 'Taxpayer groups, competing developers',
          docs: ['State competitive bidding laws', 'Economic development challenge statutes'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC after approval',
          risks: ['Legal risk'],
          litigation: ['Procurement challenge if state law requires competitive process', 'Taxpayer standing to challenge incentive without competitive bid'],
          questions: ['Did the project receive a sole-source incentive outside of public competition?'],
        },
      },
    ],
  },
  {
    num: '◇',
    name: 'GATE: Incentive Approved',
    color: '#2a2a18',
    width: 1,
    gate: true,
    gateLabel: 'Incentive\nApproved?',
    gateSub: 'Performance agreement signed. Tax exemption certified. Development agreement executed. Public announcement may follow immediately.',
    gateOutcomes: ['Yes → public announcement + utility feasibility begins', 'Condition → renegotiate terms', 'No → seek alternative jurisdiction'],
  },
  {
    num: '05',
    name: 'Utility Feasibility',
    color: '#18102a',
    width: 1,
    cols: [
      {
        main: {
          label: 'Load Request Submitted',
          actors: 'Developer → Electric utility, grid operator',
          docs: ['Formal load request letter', 'Interconnection queue application', 'Power quality requirements'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED — study triggers regulatory filings',
          risks: ['Grid risk', 'Schedule risk'],
          litigation: ['Utility rate case — who pays for study costs?', 'Interconnection queue challenge if position disputed'],
          questions: ['How large is the requested load vs. regional grid capacity?', 'Is the interconnection queue years-long?'],
        },
        land: {
          label: 'Easements for Transmission',
          actors: 'Utility, developer, landowners',
          docs: ['Transmission easement negotiations', 'Right-of-way surveys', 'Property owner notifications'],
          tags: [{ t: 'PRIV', c: 'ntag-r' }],
          transparency: 'PRIVATE — easement terms private until recorded',
          risks: ['Land risk'],
          litigation: ['Eminent domain for transmission corridor across non-participating land'],
          questions: ['Which landowners are affected by transmission easements who never sold their land?'],
        },
        util: {
          label: 'Interconnection / Load Study',
          actors: 'Electric utility, grid operator (PJM/MISO)',
          docs: ['Interconnection feasibility study', 'Transmission upgrade plan', 'Substation siting study', 'Distribution upgrade assessment'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED — study results in regulatory filings',
          risks: ['Grid risk', 'Schedule risk — studies can take 2+ years'],
          litigation: ['Grid operator queue challenge', 'Transmission siting challenge by affected landowners'],
          questions: ['Who pays for transmission upgrades — the developer or all ratepayers?', 'Are study costs recoverable if project cancels?'],
        },
        reg: {
          label: 'Water Source Selection',
          actors: 'Developer, municipal water authority, state environmental agency',
          docs: ['Water availability letter', 'Water demand study', 'Potable vs. reclaimed water assessment', 'Groundwater feasibility study'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED — municipal use may be aggregated',
          risks: ['Water risk', 'Environmental risk'],
          litigation: ['Water withdrawal permit challenge', 'Groundwater impact dispute from neighboring landowners'],
          questions: ['Was reclaimed water evaluated before potable water was committed?', 'What is daily gallons demand at full buildout?'],
        },
        fin: {
          label: 'Infrastructure Cost Allocation',
          actors: 'Developer, utility, state, PSC',
          docs: ['Cost-sharing agreement (draft)', 'Ratepayer protection provisions', 'Security deposit requirement'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL — service agreement terms often redacted',
          risks: ['Financial risk'],
          litigation: ['PSC challenge to cost allocation', 'Ratepayer organization intervention in utility proceeding'],
          questions: ['Are other ratepayers subsidizing the data center\'s infrastructure?', 'What happens financially if the project is abandoned after infrastructure is built?'],
        },
        lit: {
          label: 'PSC Proceeding Opens',
          actors: 'Consumer advocates, PSC, utility',
          docs: ['PSC rate case filing', 'Consumer advocate intervention', 'Tariff approval proceeding'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — PSC proceedings are public record',
          risks: ['Legal risk', 'Schedule risk'],
          litigation: ['Consumer advocate challenge to special tariff', 'Ratepayer class action if costs improperly allocated', 'Environmental group challenge to power-source adequacy'],
          questions: ['Can ratepayer advocates effectively participate in PSC proceedings?', 'Are hearing transcripts and filings publicly accessible?'],
        },
      },
    ],
  },
  {
    num: '◇',
    name: 'GATE: Utility Capacity Confirmed',
    color: '#2a2a18',
    width: 1,
    gate: true,
    gateLabel: 'Utility\nConfirmed?',
    gateSub: 'Electric service agreement executed. Water source committed. PSC approves tariff. If not confirmed → project may stall for years in interconnection queue.',
    gateOutcomes: ['Yes → zoning and local approval proceeds', 'Delayed → interconnection queue backup', 'No → alternate site or energy source required'],
  },
  {
    num: '06',
    name: 'Zoning & Local Approval',
    color: '#101a20',
    width: 1,
    cols: [
      {
        main: {
          label: 'Zoning Application Filed',
          actors: 'Developer, local planning dept, planning commission, city/county board',
          docs: ['Zoning application', 'Special-use permit application', 'Site plan (preliminary)', 'Traffic study', 'Noise assessment', 'Visual impact study'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — hearings are public record; neighbors notified',
          risks: ['Political risk', 'Community risk', 'Schedule risk'],
          litigation: ['Zoning appeal by neighbors or advocacy groups', 'Special-use permit challenge', 'Open meetings violation if pre-decision discussions were private'],
          questions: ['Is the use permitted by right or discretionary?', 'Are neighboring property owners notified adequately?', 'Is the full buildout scope disclosed at this stage?'],
        },
        land: {
          label: 'Annexation (if required)',
          actors: 'Developer, city, county, state',
          docs: ['Annexation petition', 'Service plan', 'Development agreement linked to annexation'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — annexation proceedings are public',
          risks: ['Political risk', 'Community risk'],
          litigation: ['Annexation challenge by excluded property owners', 'County challenge if municipal annexation is disputed'],
          questions: ['Does annexation shift tax revenue from county to municipality?', 'Are county residents affected but unrepresented in the municipal process?'],
        },
        util: {
          label: 'Municipal Utility Commitments',
          actors: 'City public works, water authority, developer',
          docs: ['Water service agreement', 'Sewer capacity agreement', 'Road access agreement', 'Infrastructure reimbursement agreement'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED — agreements public after execution',
          risks: ['Financial risk — who builds and who pays'],
          litigation: ['Challenge to infrastructure cost allocation', 'Ratepayer suit if utility charges exceed fair value'],
          questions: ['Who owns the infrastructure after construction?', 'Are these infrastructure agreements subject to public bidding requirements?'],
        },
        reg: {
          label: 'Environmental Review Begins',
          actors: 'State environmental agency, developer, EPA (if federal nexus)',
          docs: ['Environmental site assessment', 'Wetlands delineation', 'Stormwater permit application', 'Air permit pre-application meeting'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — permit applications are public documents',
          risks: ['Environmental risk', 'Schedule risk'],
          litigation: ['Environmental permit challenge if NEPA not triggered', 'Cumulative impact review demand', 'Wetlands jurisdictional dispute'],
          questions: ['Is NEPA triggered by any federal nexus?', 'Are environmental impacts reviewed cumulatively or permit by permit?'],
        },
        fin: {
          label: 'Development Agreement Executed',
          actors: 'Developer, city/county, state',
          docs: ['Development agreement (final)', 'Infrastructure reimbursement agreement', 'Community benefit agreement (if any)', 'Performance bond'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED — some terms may be redacted',
          risks: ['Financial risk', 'Political risk'],
          litigation: ['Development agreement default claim', 'Challenge if community benefit agreement is unenforceable'],
          questions: ['Is the development agreement publicly accessible in full?', 'Are community benefit commitments enforceable or aspirational?'],
        },
        lit: {
          label: 'Public Hearing Opens',
          actors: 'Neighbors, community groups, planning commission',
          docs: ['Public hearing notice', 'Neighbor testimony', 'Environmental impact comments'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — testimony and records are public',
          risks: ['Legal risk', 'Schedule risk'],
          litigation: ['Zoning appeal filed within 30 days of approval', 'Environmental permit public comment exhaustion requirement', 'Open meetings challenge if pre-hearing discussions improperly excluded public'],
          questions: ['Is this the first time the public can meaningfully challenge the project?', 'Have major commitments already been made before this hearing?'],
        },
      },
    ],
  },
  {
    num: '◇',
    name: 'GATE: Zoning Granted',
    color: '#2a2a18',
    width: 1,
    gate: true,
    gateLabel: 'Zoning\nGranted?',
    gateSub: 'Rezoning or special-use permit approved. Site plan accepted. Development agreement signed. This is often where public opposition peaks.',
    gateOutcomes: ['Yes → environmental permitting proceeds', 'Appeal filed → injunction risk / delay', 'Denied → redesign or alternative site'],
  },
  {
    num: '07',
    name: 'Environmental Permitting',
    color: '#0e1a14',
    width: 1,
    cols: [
      {
        main: {
          label: 'Multi-Permit Process',
          actors: 'Developer, state env agency, EPA, Army Corps',
          docs: ['Air permit application', 'NPDES stormwater permit', 'Wastewater/NPDES permit', 'Wetlands 404 authorization', 'Water withdrawal registration/permit', 'Generator inventory'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — applications and comments are public',
          risks: ['Environmental risk', 'Schedule risk', 'Legal risk'],
          litigation: ['Air permit challenge — generator aggregation dispute', 'Clean Water Act wetlands challenge', 'Cumulative impact review demand via NEPA or state law'],
          questions: ['Are hundreds of backup diesel generators evaluated as one combined source?', 'Are cumulative watershed impacts reviewed across all permits together?'],
        },
        land: {
          label: 'Construction Easements & Grading',
          actors: 'Developer, local engineering dept',
          docs: ['Grading permit', 'Land disturbance permit', 'Stormwater pollution prevention plan'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC',
          risks: ['Environmental risk'],
          litigation: ['Stormwater enforcement action', 'Neighbor nuisance claim from construction runoff'],
          questions: [],
        },
        util: {
          label: 'Generator Permits',
          actors: 'Developer, state air agency, EPA',
          docs: ['Generator air permit application', 'Emergency backup engine registration', 'Emissions inventory', 'NOx and PM emission limits'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — permits and emission limits are public record',
          risks: ['Environmental risk', 'Legal risk'],
          litigation: ['Air permit challenge: are generators individually or collectively a major source?', 'Neighbor nuisance claim from diesel emissions and noise'],
          questions: ['How many diesel generators are permitted?', 'Are noise and emissions limits enforced during testing?'],
        },
        reg: {
          label: 'Permits Issued (Fragmented)',
          actors: 'State env agency, EPA, Army Corps',
          docs: ['Air operating permit', 'Stormwater general permit authorization', 'Section 404 wetlands permit', 'Water withdrawal permit', 'Wastewater discharge permit'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — but fragmented across agencies; no single cumulative review',
          risks: ['Environmental risk', 'Regulatory risk'],
          litigation: ['Challenge to fragmented review: demand for coordinated cumulative impact assessment'],
          questions: ['Which agency has the complete picture of all environmental impacts combined?', 'Is there a NEPA gap if no federal nexus exists?'],
        },
        fin: {
          label: 'Environmental Compliance Budget',
          actors: 'Developer, environmental counsel',
          docs: ['Mitigation cost estimates', 'Wetlands mitigation bank credits', 'Environmental insurance'],
          tags: [{ t: 'PRIV', c: 'ntag-r' }],
          transparency: 'PRIVATE',
          risks: ['Financial risk'],
          litigation: [],
          questions: [],
        },
        lit: {
          label: 'Environmental Challenge Window',
          actors: 'Environmental groups, neighbors, state AG',
          docs: ['Permit challenge filings', 'Administrative appeal notices', 'NEPA supplemental EIS demands'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — appeals are public record',
          risks: ['Legal risk', 'Schedule risk'],
          litigation: ['Air permit challenge — generator aggregation', 'Wetlands Section 404 challenge', 'Stormwater permit violation enforcement', 'Cumulative watershed impact lawsuit'],
          questions: ['Is there standing for downstream communities to challenge upstream water withdrawal?', 'Can a court order a cumulative environmental impact assessment?'],
        },
      },
    ],
  },
  {
    num: '08',
    name: 'Construction',
    color: '#141020',
    width: 1,
    cols: [
      {
        main: {
          label: 'Construction Begins',
          actors: 'General contractor, subcontractors, developer, local inspectors',
          docs: ['Building permits (per phase)', 'Construction contracts', 'Labor compliance certifications', 'Stormwater construction permit'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — building permits and inspections are public',
          risks: ['Schedule risk', 'Community risk'],
          litigation: ['Prevailing wage violation claim', 'Construction noise or dust nuisance claim', 'Stormwater enforcement during construction'],
          questions: ['Are local workers being hired?', 'Are prevailing wage requirements being met and monitored?', 'Who inspects stormwater compliance during active construction?'],
        },
        land: {
          label: 'Phased Buildout Begins',
          actors: 'Developer, contractor, local building dept',
          docs: ['Phase 1 building permit', 'Phase 2 building permit (later)', 'Grading and foundation permits'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — but phasing may obscure full scale',
          risks: ['Community risk', 'Land risk'],
          litigation: ['Challenge to cumulative scale if full buildout not disclosed in original zoning'],
          questions: ['Was the total campus scale fully disclosed in the original zoning application?', 'Can later phases be challenged separately if conditions change?'],
        },
        util: {
          label: 'Infrastructure Construction',
          actors: 'Utility, contractor, road authority',
          docs: ['Substation construction contract', 'Transmission line permits', 'Water pipe construction', 'Road widening permits'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED',
          risks: ['Grid risk', 'Schedule risk'],
          litigation: ['Eminent domain action for final transmission easements', 'Contractor dispute over infrastructure reimbursement'],
          questions: ['Who owns transmission infrastructure built to serve the project?', 'Are road and water improvements publicly bid?'],
        },
        reg: {
          label: 'Inspections & Compliance',
          actors: 'Building dept, fire marshal, state env agency',
          docs: ['Framing inspections', 'MEP inspections', 'Fire suppression permit', 'Generator commissioning records'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC',
          risks: ['Schedule risk'],
          litigation: ['Building code violation enforcement', 'Fire code compliance dispute'],
          questions: [],
        },
        fin: {
          label: 'Draw Schedule Active',
          actors: 'Lender, developer, title company',
          docs: ['Construction draw requests', 'Inspection certifications', 'Lien releases'],
          tags: [{ t: 'PRIV', c: 'ntag-r' }],
          transparency: 'PRIVATE',
          risks: ['Financial risk'],
          litigation: ['Mechanic\'s lien claims from unpaid subcontractors'],
          questions: [],
        },
        lit: {
          label: 'Construction-Phase Challenges',
          actors: 'Neighbors, environmental groups, labor unions',
          docs: ['Nuisance complaints', 'OSHA filings', 'Environmental violation reports'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC',
          risks: ['Legal risk', 'Schedule risk'],
          litigation: ['Preliminary injunction to halt construction pending permit review', 'Noise or dust nuisance lawsuit', 'Prevailing wage enforcement action', 'Environmental violation complaint'],
          questions: ['Can a court issue a preliminary injunction halting active construction?', 'How long does an injunction typically delay a project of this scale?'],
        },
      },
    ],
  },
  {
    num: '◇',
    name: 'GATE: Certificate of Occupancy',
    color: '#2a2a18',
    width: 1,
    gate: true,
    gateLabel: 'CO\nIssued?',
    gateSub: 'Building inspections complete. Fire, MEP, and safety systems certified. Environmental systems tested. Temporary or final CO issued per phase.',
    gateOutcomes: ['Yes → operation begins; compliance reporting starts', 'Conditional → punch-list required', 'No → construction deficiencies must be resolved'],
  },
  {
    num: '09',
    name: 'Operation',
    color: '#0e1020',
    width: 1,
    cols: [
      {
        main: {
          label: 'Facility Operating',
          actors: 'Developer, hyperscaler, facility management team',
          docs: ['Certificate of occupancy', 'Operating permits', 'Annual compliance reports', 'Job and investment reporting'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — compliance reports required; actual operations private',
          risks: ['Reputational risk', 'Regulatory risk'],
          litigation: ['Breach of performance agreement if job thresholds not met', 'Tax incentive clawback enforcement', 'Annual reporting dispute'],
          questions: ['Are permanent job counts verified independently?', 'Are clawback provisions actively monitored?', 'Is the tax exemption annual reporting public?'],
        },
        land: {
          label: 'Ongoing Agricultural Loss',
          actors: 'Remaining neighboring landowners, community groups',
          docs: ['Land value assessment', 'Agricultural conversion records'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — but fragmented across county assessor records',
          risks: ['Community risk', 'Land risk'],
          litigation: ['Ongoing nuisance claims from neighboring farms', 'Eminent domain disputes if expansion triggers additional easements'],
          questions: ['Are neighboring farmland values and viability being tracked?', 'Is the cumulative agricultural conversion being monitored at county level?'],
        },
        util: {
          label: 'Grid Load Active',
          actors: 'Electric utility, grid operator, developer',
          docs: ['Monthly demand records', 'Annual water use report', 'Generator testing logs', 'Wastewater discharge monitoring'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED',
          risks: ['Grid risk', 'Water risk'],
          litigation: ['Water withdrawal dispute if actual use exceeds permitted levels', 'Grid stability complaint from neighboring industrial users'],
          questions: ['Does actual power draw match projected load?', 'Is water use disclosed at facility level or aggregated into municipal totals?'],
        },
        reg: {
          label: 'Ongoing Compliance',
          actors: 'State env agency, local building dept, fire marshal',
          docs: ['Air emissions annual report', 'Stormwater annual report', 'Water use registration update', 'Generator operating hours log'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — but fragmented; no consolidated facility report',
          risks: ['Regulatory risk'],
          litigation: ['Environmental compliance enforcement if emissions exceed limits', 'Water withdrawal violation if use exceeds permit'],
          questions: ['Which agency receives a complete picture of all environmental compliance data?', 'Are enforcement records publicly searchable?'],
        },
        fin: {
          label: 'Tax Exemption Active',
          actors: 'State tax dept, developer',
          docs: ['Annual tax exemption certification', 'Equipment replacement schedule', 'Incentive compliance report'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED — exemption amounts may be aggregated',
          risks: ['Financial risk'],
          litigation: ['Tax incentive clawback if performance thresholds missed', 'Challenge to ongoing exemption as equipment is replaced'],
          questions: ['Is the annual value of tax exemptions publicly reported by project?', 'Are server equipment replacements re-qualifying for the exemption?'],
        },
        lit: {
          label: 'Operations-Phase Litigation',
          actors: 'Neighbors, consumer advocates, state AG, former landowners',
          docs: ['Noise complaints', 'Groundwater monitoring data', 'Annual job count reports'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC',
          risks: ['Legal risk'],
          litigation: ['Nuisance claim — noise, generator emissions, light pollution', 'Groundwater injury suit from neighboring property owners', 'Clawback enforcement for missed job thresholds', 'Consumer rate case if grid costs exceed projections', 'FOIA for actual water use, emissions, and job counts'],
          questions: ['Is there a public mechanism to monitor whether the public benefits match the public costs?', 'Who has standing to enforce the clawback?'],
        },
      },
    ],
  },
  {
    num: '10',
    name: 'Expansion',
    color: '#101428',
    width: 1,
    cols: [
      {
        main: {
          label: 'Phase 2+ Announced',
          actors: 'Developer, hyperscaler, state, local government',
          docs: ['Phase 2 building permits', 'Expansion incentive application', 'Updated performance agreement'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED — may require new public process or may be by right',
          risks: ['Community risk', 'Political risk'],
          litigation: ['Challenge: was full expansion scope disclosed in original zoning?', 'New zoning challenge if expansion exceeds original approval'],
          questions: ['Does expansion require new public hearings?', 'Were original residents told the campus would grow to this scale?'],
        },
        land: {
          label: 'Additional Land Acquisition',
          actors: 'Developer (possibly new LLC), neighboring landowners',
          docs: ['New option agreements', 'Eminent domain filings for infrastructure', 'Easement expansions'],
          tags: [{ t: 'CONF', c: 'ntag-c' }],
          transparency: 'CONFIDENTIAL',
          risks: ['Land risk'],
          litigation: ['Eminent domain challenge for expansion-related easements', 'Nuisance claim from newly adjacent landowners'],
          questions: ['Does expansion pressure remaining agricultural landowners to sell?'],
        },
        util: {
          label: 'Additional Load Request',
          actors: 'Developer → utility, grid operator',
          docs: ['Phase 2 load request', 'Supplemental interconnection study', 'Additional substation design'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED',
          risks: ['Grid risk'],
          litigation: ['New ratepayer challenge to expanded infrastructure costs'],
          questions: ['Are expansion-related grid costs separately accounted from original build?'],
        },
        reg: {
          label: 'Modified Permits',
          actors: 'State env agency, local building dept',
          docs: ['Air permit modification', 'Updated generator inventory', 'Stormwater modification'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC',
          risks: ['Regulatory risk'],
          litigation: ['Challenge to permit modification: is expansion a new project requiring full review?'],
          questions: ['Does expansion trigger a new cumulative environmental impact assessment?'],
        },
        fin: {
          label: 'Renewed Tax Exemption',
          actors: 'State tax dept, developer',
          docs: ['Phase 2 equipment exemption certification', 'Updated performance agreement'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED',
          risks: ['Financial risk'],
          litigation: ['Challenge to exemption renewal if original job thresholds unmet'],
          questions: ['Can the state renew an exemption if original performance commitments were missed?'],
        },
        lit: {
          label: 'Expansion Challenges',
          actors: 'Community groups, neighbors, state AG',
          docs: ['New zoning appeal', 'Updated environmental permit challenges', 'FOIA requests for expansion plans'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC',
          risks: ['Legal risk'],
          litigation: ['Full-scope disclosure challenge: original approval was for smaller project', 'Cumulative environmental impact lawsuit', 'New ratepayer challenge to expanded grid costs'],
          questions: ['At what point does cumulative expansion require a fresh comprehensive review?'],
        },
      },
    ],
  },
  {
    num: '11',
    name: 'Decommission / Repurpose',
    color: '#1a1010',
    width: 1,
    cols: [
      {
        main: {
          label: 'End of Life or Transition',
          actors: 'Developer, hyperscaler, local government, state',
          docs: ['Decommissioning plan', 'Environmental remediation assessment', 'Property disposition agreement'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED',
          risks: ['Environmental risk', 'Community risk', 'Financial risk'],
          litigation: ['Remediation dispute if contamination found', 'Clawback if incentive repayment triggered by closure', 'Tax abatement reversal'],
          questions: ['Who is responsible for environmental remediation after decommissioning?', 'Are there clawback provisions triggered by closure before agreed period?', 'Is farmland conversion reversible?'],
        },
        land: {
          label: 'Land Disposition',
          actors: 'Developer, local government, community',
          docs: ['Property sale or transfer agreement', 'Deed conditions for future use', 'Remediation bond'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED',
          risks: ['Land risk'],
          litigation: ['Remediation cost dispute', 'Community challenge to redevelopment plan'],
          questions: ['Can the land return to agricultural use?', 'Who funds remediation of equipment foundations, fuel tanks, and electrical infrastructure?'],
        },
        util: {
          label: 'Grid & Water Disconnection',
          actors: 'Utility, developer, municipal water authority',
          docs: ['Load termination agreement', 'Substation disposition', 'Water service termination'],
          tags: [{ t: 'PART', c: 'ntag-t' }],
          transparency: 'PARTIALLY DISCLOSED',
          risks: ['Grid risk'],
          litigation: ['Stranded infrastructure cost dispute — who absorbs decommissioned substation cost?'],
          questions: ['Who owns and maintains the substation if the data center closes?', 'Are ratepayers exposed to stranded asset costs?'],
        },
        reg: {
          label: 'Permit Closure',
          actors: 'State env agency, EPA',
          docs: ['Permit surrender filings', 'Final environmental compliance report', 'Generator decommissioning records'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC',
          risks: ['Regulatory risk'],
          litigation: [],
          questions: ['Is a final environmental audit required?'],
        },
        fin: {
          label: 'Incentive Clawback Assessment',
          actors: 'State tax dept, developer, state AG',
          docs: ['Clawback calculation', 'Job threshold audit', 'Tax recovery filing'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC — clawback enforcement is a public legal action',
          risks: ['Financial risk'],
          litigation: ['Clawback enforcement suit', 'Developer insolvency — who recovers public funds?', 'Bond default if financed by public authority'],
          questions: ['Are clawback provisions actually enforceable?', 'What happens to public debt if the developer is insolvent at closure?'],
        },
        lit: {
          label: 'Post-Closure Litigation',
          actors: 'State AG, community groups, former landowners',
          docs: ['Remediation liability claims', 'Clawback suits', 'Stranded asset rate cases'],
          tags: [{ t: 'PUB', c: 'ntag-p' }],
          transparency: 'PUBLIC',
          risks: ['Legal risk'],
          litigation: ['Environmental remediation liability', 'Tax incentive clawback enforcement', 'Stranded infrastructure cost recovery', 'Nuisance — residual noise and diesel contamination', 'Community benefit agreement breach'],
          questions: ['Is there a sunset provision in the development agreement?', 'Who has standing to bring a clawback claim after the project closes?'],
        },
      },
    ],
  },
];

const PANEL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #07080f;
  --bg2: #0d1020;
  --rail-w: 148px;
  --col-w: 240px;
  --row-h: 110px;
  --gap: 1px;
  --border: rgba(255,255,255,0.06);
  --text: #e8e9f0;
  --text2: #b3bdd8;
  --text3: #8792b3;
  --mono: 'Space Mono', monospace;
  --sans: 'Inter', -apple-system, sans-serif;

  --c-main:  #c8d0f0;
  --c-land:  #c4a84f;
  --c-util:  #8c6cb8;
  --c-reg:   #4fb87c;
  --c-fin:   #b84f8c;
  --c-lit:   #e04040;
  --c-gate:  #e8c060;
}

html[data-theme='light'] .timeline-page {
  --bg: #f3f6fb;
  --bg2: #E8E6E0;
  --border: rgba(15,23,42,0.14);
  --text: #0f172a;
  --text2: #334155;
  --text3: #64748b;
}

.timeline-page, .timeline-page body { width: 100%; height: 100%; }
.timeline-page {
  position: fixed; inset: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  overflow: hidden;
}

.timeline-page .page-shell {
  position: fixed; inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
}

.toolbar {
  position: fixed; top: 0; left: 0; right: 0; height: 52px; z-index: 300;
  background: rgba(7,8,15,0.98); border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 18px; gap: 10px;
}
html[data-theme='light'] .toolbar { background: rgba(255,255,255,0.98); }
.toolbar h1 { font-family: var(--mono); font-size: 9.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; flex: 1; color: var(--text); }
.toolbar h1 span { color: var(--text3); font-weight: 400; }
.tb-btn {
  font-family: var(--mono); font-size: 9px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
  padding: 5px 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 3px;
  background: transparent; color: var(--text2); cursor: pointer; transition: all 0.2s;
}
.tb-btn:hover { border-color: rgba(255,255,255,0.3); color: var(--text); }
html[data-theme='light'] .tb-btn { background: var(--bg); border-color: rgba(15,23,42,0.22); }
html[data-theme='light'] .tb-btn:hover { border-color: rgba(15,23,42,0.4); }
.tb-btn.lit-on { border-color: var(--c-lit); color: var(--c-lit); background: rgba(224,64,64,0.08); }
.track-btns { display: flex; gap: 5px; }
.track-btn {
  font-family: var(--mono); font-size: 8px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  padding: 4px 9px; border-radius: 3px; border: 1px solid transparent; cursor: pointer;
  transition: all 0.15s; opacity: 0.5; background: transparent;
}
.track-btn.on { opacity: 1; }
html[data-theme='light'] .track-btn { background: var(--bg); border-color: rgba(15,23,42,0.16) !important; }
.track-btn.track-main { color: var(--c-main); border-color: rgba(200,208,240,0.18); }
.track-btn.track-land { color: var(--c-land); border-color: rgba(196,168,79,0.18); }
.track-btn.track-util { color: var(--c-util); border-color: rgba(140,108,184,0.18); }
.track-btn.track-reg { color: var(--c-reg); border-color: rgba(79,184,124,0.18); }
.track-btn.track-fin { color: var(--c-fin); border-color: rgba(184,79,140,0.18); }
.track-btn.track-lit { color: var(--c-lit); border-color: rgba(224,64,64,0.18); }

.main-layout { position: fixed; top: 52px; left: 0; right: 0; bottom: 0; display: flex; }

.rail {
  width: var(--rail-w); flex-shrink: 0;
  background: rgba(13,16,32,0.97);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  z-index: 100;
}
html[data-theme='light'] .rail { background: rgba(255,255,255,0.97); }
.rail-header { height: 54px; flex-shrink: 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 14px; }
.rail-header-text { font-family: var(--mono); font-size: 7.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text3); }
.rail-track {
  flex: 1; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 14px; gap: 8px;
  cursor: pointer; transition: background 0.15s;
}
.rail-track:last-child { flex: 1.5; border-bottom: none; }
.rail-track:hover { background: rgba(255,255,255,0.02); }
.rail-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.rail-label { font-family: var(--mono); font-size: 8px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; line-height: 1.4; }

.scroll-wrap { flex: 1; overflow-x: auto; overflow-y: hidden; cursor: grab; position: relative; }
.scroll-wrap.grabbing { cursor: grabbing; }
.scroll-wrap::-webkit-scrollbar { height: 4px; }
.scroll-wrap::-webkit-scrollbar-track { background: transparent; }
.scroll-wrap::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
html[data-theme='light'] .scroll-wrap::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.18); }

.timeline { display: flex; flex-direction: column; min-width: max-content; height: 100%; }
.phase-row { height: 54px; flex-shrink: 0; display: flex; align-items: stretch; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; background: rgba(13,16,32,0.97); }
html[data-theme='light'] .phase-row { background: rgba(255,255,255,0.97); }
.phase-cell { display: flex; align-items: center; padding: 0 16px; border-right: 1px solid var(--border); position: relative; }
.phase-num { font-family: var(--mono); font-size: 8px; font-weight: 700; letter-spacing: 0.1em; color: var(--text3); display: block; margin-bottom: 3px; }
.phase-name { font-family: var(--mono); font-size: 9px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }

.tracks-wrap { flex: 1; display: flex; flex-direction: column; }
.track-row { flex: 1; display: flex; align-items: stretch; border-bottom: 1px solid var(--border); transition: opacity 0.2s; }
.track-row:last-child { flex: 1.5; border-bottom: none; }
.track-row.dimmed { opacity: 0.2; }
.track-row.lit-row .cell:not(.empty) { border-top: 1px dashed rgba(224,64,64,0.2); }

.cell { min-width: var(--col-w); border-right: 1px solid var(--border); padding: 10px 12px; display: flex; flex-direction: column; justify-content: center; position: relative; cursor: pointer; transition: background 0.15s; }
.cell:hover { background: rgba(255,255,255,0.025); }
html[data-theme='light'] .cell:hover { background: rgba(15,23,42,0.04); }
.cell.empty { cursor: default; }
.cell.empty:hover { background: transparent; }
.cell.active-cell { background: rgba(255,255,255,0.04) !important; }
html[data-theme='light'] .cell.active-cell { background: rgba(15,23,42,0.07) !important; }
.cell.gate { align-items: center; justify-content: center; text-align: center; background: rgba(232,192,96,0.04); border-left: 2px solid rgba(232,192,96,0.25); cursor: pointer; }
.cell.gate:hover { background: rgba(232,192,96,0.08); }
.gate-diamond { width: 36px; height: 36px; border: 2px solid rgba(232,192,96,0.6); transform: rotate(45deg); margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.gate-diamond span { transform: rotate(-45deg); font-family: var(--mono); font-size: 11px; color: var(--c-gate); display: block; }
.gate-label { font-family: var(--mono); font-size: 8px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; line-height: 1.5; white-space: pre-line; }
.gate-sublabel { font-size: 9px; color: var(--text2); margin-top: 4px; line-height: 1.4; }
.cell.span-2 { min-width: calc(var(--col-w) * 2 + 1px); }
.cell.span-3 { min-width: calc(var(--col-w) * 3 + 2px); }

.node-label { font-family: var(--mono); font-size: 8px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 4px; display: flex; gap: 5px; align-items: flex-start; }
.node-label-main { min-width: 0; }
.node-label-tags { display: flex; gap: 3px; flex-wrap: wrap; justify-content: flex-end; margin-left: auto; }
.node-actors { font-size: 10px; color: var(--text2); line-height: 1.5; margin-bottom: 5px; }
.node-docs { display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 4px; }
.node-doc { font-family: var(--mono); font-size: 7.5px; color: var(--text3); border: 1px solid rgba(255,255,255,0.08); padding: 2px 5px; border-radius: 2px; }
html[data-theme='light'] .node-doc { border-color: rgba(15,23,42,0.16); }
.ntag { font-family: var(--mono); font-size: 7px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; padding: 2px 5px; border-radius: 2px; }
.ntag-c { background: rgba(255,68,68,0.15); color: #ff7070; }
.ntag-p { background: rgba(76,178,76,0.15); color: #6ed06e; }
.ntag-r { background: rgba(200,150,50,0.15); color: #d4a040; }
.ntag-t { background: rgba(100,140,210,0.15); color: #80a8e8; }
.ntag-risk { background: rgba(150,80,200,0.1); color: #b070d8; font-size: 6.5px; }
.lit-badge { position: absolute; top: 6px; right: 6px; font-family: var(--mono); font-size: 6.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--c-lit); opacity: 0; transition: opacity 0.3s; }
.lit-stripe { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 0.3s; background: repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(224,64,64,0.03) 8px, rgba(224,64,64,0.03) 9px); }
.lit-on .lit-badge { opacity: 1; }
.lit-on .lit-stripe { opacity: 1; }

.connector { position: absolute; right: -1px; top: 50%; width: 24px; height: 1px; background: rgba(255,255,255,0.12); z-index: 10; }
.connector-lit { background: rgba(224,64,64,0.5); }

.panel {
  position: fixed; top: 52px; right: -440px; bottom: 0; width: 420px;
  background: #0d1020; border-left: 1px solid var(--border);
  transition: right 0.3s ease; z-index: 250; display: flex; flex-direction: column; overflow: hidden;
}
html[data-theme='light'] .panel { background: var(--bg); }
.panel.open { right: 0; }
.panel-head { padding: 18px 22px 14px; border-bottom: 1px solid var(--border); flex-shrink: 0; position: relative; }
.panel-type { font-family: var(--mono); font-size: 8px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; display: block; margin-bottom: 6px; }
.panel-name { font-size: 15px; font-weight: 600; line-height: 1.35; }
.panel-sub { font-size: 12px; color: var(--text2); margin-top: 5px; line-height: 1.55; }
.panel-close { position: absolute; top: 14px; right: 18px; width: 26px; height: 26px; border: 1px solid var(--border); border-radius: 3px; background: transparent; color: var(--text2); cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; font-family: var(--mono); }
.panel-close:hover { color: var(--text); border-color: rgba(255,255,255,0.3); }
html[data-theme='light'] .panel-close:hover { border-color: rgba(15,23,42,0.4); }
.panel-body { flex: 1; overflow-y: auto; padding: 18px 22px; }
.panel-body::-webkit-scrollbar { width: 3px; }
.panel-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
.ps-s { margin-bottom: 18px; }
.ps-l { font-family: var(--mono); font-size: 7.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text3); display: block; margin-bottom: 7px; }
.ps-p { font-size: 12px; color: var(--text2); line-height: 1.65; }
.irow { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 11px; }
.irow:last-child { border-bottom: none; }
.ik { color: var(--text3); min-width: 80px; flex-shrink: 0; font-family: var(--mono); font-size: 8.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding-top: 1px; }
.iv { color: var(--text2); line-height: 1.55; }
.tags { display: flex; flex-wrap: wrap; gap: 4px; }
.tag { font-family: var(--mono); font-size: 8.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; padding: 3px 7px; border-radius: 2px; }
.tag-c { background: rgba(255,68,68,0.12); color: #ff7070; border: 1px solid rgba(255,68,68,0.25); }
.tag-p { background: rgba(76,178,76,0.12); color: #6ed06e; border: 1px solid rgba(76,178,76,0.25); }
.tag-r { background: rgba(200,150,50,0.12); color: #d4a040; border: 1px solid rgba(200,150,50,0.25); }
.tag-t { background: rgba(100,140,210,0.12); color: #80a8e8; border: 1px solid rgba(100,140,210,0.25); }
.tag-risk { background: rgba(150,80,200,0.1); color: #b070d8; border: 1px solid rgba(150,80,200,0.2); }
.doc { font-family: var(--mono); font-size: 9.5px; color: var(--text3); padding: 5px 8px; border: 1px solid rgba(255,255,255,0.08); border-radius: 2px; margin-bottom: 3px; display: flex; gap: 6px; }
html[data-theme='light'] .doc { border-color: rgba(15,23,42,0.16); }
.doc::before { content: '▸'; flex-shrink: 0; color: var(--text3); }
.lit-item { font-size: 11px; color: rgba(224,90,90,0.8); padding: 5px 0; border-bottom: 1px solid rgba(224,64,64,0.07); display: flex; gap: 6px; line-height: 1.5; }
.lit-item:last-child { border-bottom: none; }
.ld { color: var(--c-lit); flex-shrink: 0; }
.q-item { font-size: 11px; color: rgba(255,195,60,0.8); padding: 5px 0; border-bottom: 1px solid rgba(255,195,60,0.06); display: flex; gap: 5px; line-height: 1.5; }
.q-item:last-child { border-bottom: none; }
.qm { color: rgba(255,195,60,0.45); flex-shrink: 0; font-weight: 700; }

.hint { position: fixed; bottom: 16px; right: 20px; font-family: var(--mono); font-size: 8px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text3); pointer-events: none; transition: opacity 1s; z-index: 100; }
.legend { position: fixed; left: 164px; bottom: 16px; z-index: 100; display: flex; gap: 14px; align-items: center; background: rgba(13,16,32,0.95); border: 1px solid var(--border); border-radius: 6px; padding: 10px 12px; }
html[data-theme='light'] .legend { background: rgba(255,255,255,0.96); }
.leg { display: flex; align-items: center; gap: 5px; font-family: var(--mono); font-size: 8px; color: var(--text2); letter-spacing: 0.04em; }
.leg-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.leg-diamond { width: 9px; height: 9px; border: 1.5px solid var(--c-gate); transform: rotate(45deg); flex-shrink: 0; }
.leg-dash { width: 16px; height: 0; border-top: 1.5px dashed var(--c-lit); flex-shrink: 0; }
.progress { position: fixed; top: 52px; left: var(--rail-w); right: 0; height: 2px; z-index: 200; background: rgba(255,255,255,0.04); }
.progress-bar { height: 100%; background: rgba(255,255,255,0.12); width: 0%; transition: width 0.1s; }
html[data-theme='light'] .progress-bar { background: rgba(15,23,42,0.2); }

@media(max-width:780px){.tb-btn{font-size:8px;padding:4px 10px}.track-btn{font-size:7px;padding:3px 7px}.toolbar h1{font-size:8.5px}}
@media(max-width:520px){.toolbar h1 .toolbar-sub{display:none}.toolbar .site-nav .sn-label{display:none}.toolbar .sn{padding:4px 7px}}
`;

function renderTag(tag, index) {
  return (
    <span key={`${tag.t}-${index}`} className={`tag ${tag.c}`}>
      {tag.t}
    </span>
  );
}

function TimelinePanel({ panel }) {
  if (!panel) return null;

  if (panel.type === 'intro') {
    return (
      <>
        <span className="panel-type" style={{ color: 'rgba(255,255,255,0.25)' }}>
          LINEAR DEVELOPMENT TIMELINE
        </span>
        <div className="panel-name">How a Hyperscale Data Center Becomes a State-Supported Development</div>
        <div className="panel-sub">11 phases · 5 parallel tracks · 4 decision gates · Full litigation overlay</div>
        <div className="ps-s">
          <span className="ps-l">How to read this map</span>
          <p className="ps-p">Scroll right through time. Six tracks run in parallel — they are not sequential. Land control, utility feasibility, incentive negotiation, and regulatory review all happen simultaneously. Click any cell to open the full intelligence brief for that phase and track.</p>
        </div>
        <div className="ps-s">
          <span className="ps-l">Six tracks</span>
          <div className="irow"><div className="ik" style={{ color: 'var(--c-main)' }}>Main Flow</div><div className="iv">The primary project lifecycle — what the developer and state announce publicly.</div></div>
          <div className="irow"><div className="ik" style={{ color: 'var(--c-land)' }}>Land Track</div><div className="iv">How farmland is identified, optioned, assembled, rezoned, and converted — often invisibly through shell LLCs.</div></div>
          <div className="irow"><div className="ik" style={{ color: 'var(--c-util)' }}>Utility Track</div><div className="iv">Electricity, water, fiber, roads — parallel infrastructure negotiations that determine project viability and ratepayer exposure.</div></div>
          <div className="irow"><div className="ik" style={{ color: 'var(--c-reg)' }}>Regulatory Track</div><div className="iv">Zoning, environmental permits, labor compliance — fragmented across agencies with no single cumulative review.</div></div>
          <div className="irow"><div className="ik" style={{ color: 'var(--c-fin)' }}>Financial Track</div><div className="iv">Incentives, bonds, REIT structure, clawbacks — the private financial architecture largely invisible to the public.</div></div>
          <div className="irow"><div className="ik" style={{ color: 'var(--c-lit)' }}>Litigation</div><div className="iv">Legal challenges that can arise at every phase — not just at the end. Toggle ⬤ Litigation in the toolbar to highlight.</div></div>
        </div>
        <div className="ps-s">
          <span className="ps-l">Four decision gates ◇</span>
          <p className="ps-p">Gates mark where the project must confirm conditions before proceeding. They are also the highest-risk points for legal challenge. Click any gate diamond to read its outcomes.</p>
        </div>
        <div className="ps-s">
          <span className="ps-l">Click any rail label</span>
          <p className="ps-p">Clicking a track label on the left dims all other tracks so you can follow one thread through the full lifecycle.</p>
        </div>
      </>
    );
  }

  if (panel.type === 'gate') {
    const { phase } = panel;
    return (
      <>
        <span className="panel-type" style={{ color: 'var(--c-gate)' }}>DECISION GATE</span>
        <div className="panel-name" style={{ color: 'var(--c-gate)' }}>{phase.name}</div>
        <div className="panel-sub">{phase.gateSub || ''}</div>
        <div className="ps-s">
          <span className="ps-l">What must be true to pass this gate</span>
          <p className="ps-p">{phase.gateSub || ''}</p>
        </div>
        <div className="ps-s">
          <span className="ps-l">Possible outcomes</span>
          {(phase.gateOutcomes || []).map((outcome, index) => (
            <div className="irow" key={`${outcome}-${index}`}><div className="ik">→</div><div className="iv">{outcome}</div></div>
          ))}
        </div>
        <div className="ps-s">
          <span className="ps-l">Why gates matter</span>
          <p className="ps-p">Decision gates are the points where the project can stall, be rerouted, or be cancelled. They are also the points where litigation risk is highest — community groups and advocacy organizations often file challenges immediately after a gate is cleared, attempting to trigger review before construction begins.</p>
        </div>
      </>
    );
  }

  const { phase, track, data } = panel;
  return (
    <>
      <span className="panel-type" style={{ color: TRACK_COLORS[track] }}>PHASE {phase.num} — {TRACK_NAMES[track]}</span>
      <div className="panel-name">{data.label}</div>
      <div className="panel-sub">Actors: {data.actors || '—'}</div>
      <div className="ps-s">
        <span className="ps-l">Transparency</span>
        <p className="ps-p">{data.transparency || '—'}</p>
      </div>
      {(data.tags || []).length > 0 && (
        <div className="ps-s">
          <span className="ps-l">Classification</span>
          <div className="tags">{data.tags.map(renderTag)}</div>
        </div>
      )}
      {(data.risks || []).length > 0 && (
        <div className="ps-s">
          <span className="ps-l">Risk tags</span>
          <div className="tags">{(data.risks || []).map((risk, index) => <span key={`${risk}-${index}`} className="tag tag-risk">{risk}</span>)}</div>
        </div>
      )}
      <div className="ps-s">
        <span className="ps-l">Key documents</span>
        {(data.docs || []).map((doc) => <div className="doc" key={doc}>{doc}</div>)}
      </div>
      {(data.litigation || []).length > 0 && (
        <div className="ps-s">
          <span className="ps-l">Litigation exposure</span>
          {(data.litigation || []).map((item) => <div className="lit-item" key={item}><span className="ld">⬤</span>{item}</div>)}
        </div>
      )}
      {(data.questions || []).length > 0 && (
        <div className="ps-s">
          <span className="ps-l">Public-interest questions</span>
          {(data.questions || []).map((question) => <div className="q-item" key={question}><span className="qm">?</span>{question}</div>)}
        </div>
      )}
      <div className="ps-s">
        <span className="ps-l">Phase context</span>
        <p className="ps-p">{phase.name} — this is one of six parallel tracks active during this phase. Decisions in this track affect and are affected by the other five simultaneously.</p>
      </div>
    </>
  );
}

export default function Timeline() {
  const scrollWrapRef = useRef(null);
  const progressBarRef = useRef(null);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const [trackButtons, setTrackButtons] = useState([]);
  const [litOn, setLitOn] = useState(false);
  const [focusedTrack, setFocusedTrack] = useState(null);
  const [activeCell, setActiveCell] = useState(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [panel, setPanel] = useState(null);

  useEffect(() => {
    setTrackButtons(TRACKS);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setHintVisible(false), 5000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPanel({ type: 'intro' });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const scrollWrap = scrollWrapRef.current;
    if (!scrollWrap) return undefined;

    const updateProgress = () => {
      if (!progressBarRef.current) return;
      const maxScroll = scrollWrap.scrollWidth - scrollWrap.clientWidth;
      const percent = maxScroll > 0 ? (scrollWrap.scrollLeft / maxScroll) * 100 : 0;
      progressBarRef.current.style.width = `${percent}%`;
    };

    const onMouseMove = (event) => {
      if (!draggingRef.current) return;
      scrollWrap.scrollLeft = dragStartScrollRef.current - (event.pageX - dragStartXRef.current);
      updateProgress();
    };

    const onMouseUp = () => {
      draggingRef.current = false;
      scrollWrap.classList.remove('grabbing');
    };

    const onScroll = () => updateProgress();

    const onMouseDown = (event) => {
      const targetCell = event.target.closest('.cell');
      if (targetCell && !targetCell.classList.contains('empty')) return;
      draggingRef.current = true;
      dragStartXRef.current = event.pageX;
      dragStartScrollRef.current = scrollWrap.scrollLeft;
      scrollWrap.classList.add('grabbing');
    };

    scrollWrap.addEventListener('scroll', onScroll);
    scrollWrap.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    updateProgress();

    return () => {
      scrollWrap.removeEventListener('scroll', onScroll);
      scrollWrap.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const focusTrack = (trackId) => {
    setFocusedTrack((currentTrack) => (currentTrack === trackId ? null : trackId));
  };

  const toggleLit = () => {
    setLitOn((currentValue) => !currentValue);
  };

  const scrollToStart = () => {
    scrollWrapRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const closePanel = () => {
    setPanel(null);
    setActiveCell(null);
  };

  const openCellPanel = (phase, track, data) => {
    setActiveCell(`${phase.num}-${track}`);
    setPanel({ type: 'cell', phase, track, data });
  };

  const openGatePanel = (phase) => {
    setActiveCell(null);
    setPanel({ type: 'gate', phase });
  };

  const handleKeyActivate = (event, callback) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <div className="timeline-page">
      <style>{PANEL_STYLE}</style>
      <div className="page-shell">
        <div className="toolbar">
          <h1>HYPERSCALE DATA CENTER <span className="toolbar-sub">/ Linear Development &amp; Approval Timeline</span></h1>
          <div className="track-btns" id="track-btns">
            {trackButtons.map((track) => (
              <button
                key={track.id}
                type="button"
                className={`track-btn track-${track.id} ${focusedTrack === track.id ? 'on' : ''}`.trim()}
                onClick={() => focusTrack(track.id)}
              >
                {track.label}
              </button>
            ))}
          </div>
          <button type="button" aria-pressed={litOn} className={`tb-btn ${litOn ? 'lit-on' : ''}`.trim()} onClick={toggleLit}>⬤ Litigation</button>
          <button type="button" className="tb-btn" onClick={scrollToStart} aria-label="Scroll timeline to start">↤ Start</button>
          <Nav />
        </div>

        <div className="progress"><div ref={progressBarRef} className="progress-bar" /></div>

        <div className={`main-layout ${litOn ? 'lit-on' : ''}`.trim()} id="main" style={{ zIndex: 1 }}>
          <div className="rail">
            <div className="rail-header"><span className="rail-header-text">Track</span></div>
            <div className="rail-track" id="rail-main" role="button" tabIndex={0} onClick={() => focusTrack('main')} onKeyDown={(event) => handleKeyActivate(event, () => focusTrack('main'))}>
              <div className="rail-dot" style={{ background: 'var(--c-main)' }} />
              <div className="rail-label" style={{ color: 'var(--c-main)' }}>Main<br />Flow</div>
            </div>
            <div className="rail-track" id="rail-land" role="button" tabIndex={0} onClick={() => focusTrack('land')} onKeyDown={(event) => handleKeyActivate(event, () => focusTrack('land'))}>
              <div className="rail-dot" style={{ background: 'var(--c-land)' }} />
              <div className="rail-label" style={{ color: 'var(--c-land)' }}>Land<br />Track</div>
            </div>
            <div className="rail-track" id="rail-util" role="button" tabIndex={0} onClick={() => focusTrack('util')} onKeyDown={(event) => handleKeyActivate(event, () => focusTrack('util'))}>
              <div className="rail-dot" style={{ background: 'var(--c-util)' }} />
              <div className="rail-label" style={{ color: 'var(--c-util)' }}>Utility<br />Track</div>
            </div>
            <div className="rail-track" id="rail-reg" role="button" tabIndex={0} onClick={() => focusTrack('reg')} onKeyDown={(event) => handleKeyActivate(event, () => focusTrack('reg'))}>
              <div className="rail-dot" style={{ background: 'var(--c-reg)' }} />
              <div className="rail-label" style={{ color: 'var(--c-reg)' }}>Regulatory<br />Track</div>
            </div>
            <div className="rail-track" id="rail-fin" role="button" tabIndex={0} onClick={() => focusTrack('fin')} onKeyDown={(event) => handleKeyActivate(event, () => focusTrack('fin'))}>
              <div className="rail-dot" style={{ background: 'var(--c-fin)' }} />
              <div className="rail-label" style={{ color: 'var(--c-fin)' }}>Financial<br />Track</div>
            </div>
            <div className="rail-track" id="rail-lit" role="button" tabIndex={0} onClick={() => focusTrack('lit')} onKeyDown={(event) => handleKeyActivate(event, () => focusTrack('lit'))}>
              <div className="rail-dot" style={{ background: 'var(--c-lit)' }} />
              <div className="rail-label" style={{ color: 'var(--c-lit)' }}>Litigation<br />Exposure</div>
            </div>
          </div>

          <div ref={scrollWrapRef} className="scroll-wrap" id="scroll-wrap">
            <div className="timeline" id="timeline">
              <div className="phase-row" id="phase-row">
                {PHASES.map((phase) => {
                  const phaseWidth = phase.gate ? 120 : (phase.width || 1) * 240;
                  return (
                    <div
                      key={`${phase.name}-${phase.num}`}
                      className="phase-cell"
                      style={{ minWidth: `${phaseWidth}px`, borderColor: phase.color || 'var(--border)', background: phase.color ? `${phase.color}22` : 'transparent' }}
                    >
                      <div>
                        <span className="phase-num" style={{ color: phase.gate ? 'var(--c-gate)' : 'var(--text3)' }}>PHASE {phase.num}</span>
                        <span className="phase-name" style={{ color: phase.gate ? 'var(--c-gate)' : 'var(--text)' }}>{phase.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="tracks-wrap" id="tracks-wrap">
                {TRACKS.map((track) => (
                  <div key={track.id} id={`track-row-${track.id}`} className={`track-row ${track.id === 'lit' ? 'lit-row' : ''} ${focusedTrack && focusedTrack !== track.id ? 'dimmed' : ''}`.trim()}>
                    {PHASES.map((phase) => {
                      const phaseWidth = phase.gate ? 120 : (phase.width || 1) * 240;
                      if (phase.gate) {
                        const isMainTrack = track.id === 'main';
                        return (
                          <div
                            key={`${phase.name}-${track.id}`}
                            className={`cell gate ${!isMainTrack ? 'empty' : ''}`.trim()}
                            style={{ minWidth: `${phaseWidth}px` }}
                            role={isMainTrack ? 'button' : undefined}
                            tabIndex={isMainTrack ? 0 : undefined}
                            onClick={isMainTrack ? () => openGatePanel(phase) : undefined}
                            onKeyDown={isMainTrack ? (event) => handleKeyActivate(event, () => openGatePanel(phase)) : undefined}
                          >
                            {isMainTrack ? (
                              <>
                                <div className="gate-diamond"><span>◇</span></div>
                                <div className="gate-label" style={{ color: 'var(--c-gate)' }}>{phase.gateLabel}</div>
                                <div className="gate-sublabel">{phase.gateSub || ''}</div>
                              </>
                            ) : (
                              <div style={{ fontFamily: 'var(--mono)', fontSize: '8px', color: 'rgba(232,192,96,0.2)', textAlign: 'center' }}>◇</div>
                            )}
                          </div>
                        );
                      }

                      const phaseData = phase.cols?.[0]?.[track.id];
                      const isEmpty = !phaseData || phaseData.empty;
                      return (
                        <div
                          key={`${phase.name}-${track.id}`}
                          className={`cell ${isEmpty ? 'empty' : ''}`.trim()}
                          style={{ minWidth: `${phaseWidth}px`, borderTop: '2px solid', borderTopColor: TRACK_COLORS[track.id] }}
                          role={isEmpty ? undefined : 'button'}
                          tabIndex={isEmpty ? undefined : 0}
                          onClick={isEmpty ? undefined : () => openCellPanel(phase, track.id, phaseData)}
                          onKeyDown={isEmpty ? undefined : (event) => handleKeyActivate(event, () => openCellPanel(phase, track.id, phaseData))}
                        >
                          <div className="lit-stripe" />
                          {!isEmpty && phaseData.litigation?.length > 0 && <div className="lit-badge">⚠ LIT</div>}
                          {!isEmpty && (
                            <div>
                              <div className="node-label" style={{ color: TRACK_COLORS[track.id] }}>
                                <span className="node-label-main">{phaseData.label || ''}</span>
                                <span className="node-label-tags">{(phaseData.tags || []).map((tag, index) => renderTag(tag, index))}</span>
                              </div>
                              <div className="node-actors">{phaseData.actors || ''}</div>
                              <div className="node-docs">
                                {(phaseData.docs || []).slice(0, 3).map((doc) => <span key={doc} className="node-doc">{doc}</span>)}
                                {(phaseData.docs || []).length > 3 && <span className="node-doc">+{(phaseData.docs || []).length - 3} more</span>}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`panel ${panel ? 'open' : ''}`.trim()} id="panel" role="dialog" aria-modal="false" aria-hidden={!panel}>
          <button type="button" className="panel-close" id="pc" onClick={closePanel} aria-label="Close timeline details panel">✕</button>
          <div className="panel-head" id="ph">
            <TimelinePanel panel={panel} />
          </div>
        </div>

        <div className="legend" id="legend">
          <div className="leg"><div className="leg-dot" style={{ background: 'var(--c-main)' }} />Main flow</div>
          <div className="leg"><div className="leg-dot" style={{ background: 'var(--c-land)' }} />Land</div>
          <div className="leg"><div className="leg-dot" style={{ background: 'var(--c-util)' }} />Utility</div>
          <div className="leg"><div className="leg-dot" style={{ background: 'var(--c-reg)' }} />Regulatory</div>
          <div className="leg"><div className="leg-dot" style={{ background: 'var(--c-fin)' }} />Financial</div>
          <div className="leg"><div className="leg-dot" style={{ background: 'var(--c-lit)' }} />Litigation</div>
          <div className="leg"><div className="leg-diamond" />Decision gate</div>
          <div className="leg"><div className="leg-dash" />Litigation risk</div>
        </div>

        <div className="hint" id="hint" style={{ opacity: hintVisible ? 1 : 0 }}>← Scroll to advance through time →</div>
      </div>
    </div>
  );
}
