**HYPERSCALE DATA CENTER INTELLIGENCE SYSTEM**

*Product Requirements Document: Net New Build*

**Build name:**  Hyperscale Data Center Intelligence System

**Owner:**  Natalie Walker (WASIVI)  ·  Andres

**Date:**  June 2026  ·  Pursuit Fellow L2

# **1\. Problem**

Policy researchers, investigative journalists, community advocates, and local government officials experience a critical information gap when a hyperscale data center project comes to their state — because the full decision-making process is fragmented across ten separate actors, eight layers of government and private negotiation, and dozens of permit proceedings that no single agency coordinates — resulting in communities finding out last, officials approving projects they do not fully understand, and ratepayers absorbing infrastructure costs they never agreed to.

**Supporting Context**

* Georgia has a planned-to-operating ratio of 1.50 and Indiana 1.42 — both states have more facilities planned than currently operating, yet no public agency is tracking the cumulative impact.

* The standard first step in hyperscale data center site selection is a confidential RFI and NDA between the developer and the state economic development agency — signed before any public announcement is made.

* Shell LLCs are routinely used to assemble land parcels before rezoning applications are filed — meaning sellers do not know who is buying their land or why until after closing.

* The planned-to-operating ratio reveals that Virginia (0.72) — the largest market — is not the fastest growing. Georgia (1.50) and Indiana (1.42) are where the next conflict will happen.

## **1a. Opportunity**

Enable policy researchers, journalists, and community advocates to identify where hyperscale data center growth pressure is building fastest and navigate the full decision-making system — capturing a first-mover position in public-interest infrastructure intelligence at a moment when AI demand is driving a historic wave of data center development with almost no public accountability infrastructure in place.

**Market Opportunity**

* The U.S. hyperscale data center industry is growing at 28.9% revenue — the highest of any sector analyzed. IEA projects data center electricity demand to double by 2030\.

* No existing platform maps the full decision-making system. Good Jobs First tracks incentives. State PSC dockets track utility costs. County planning records track zoning. No single tool connects them.

## **1b. Users & Needs**

**Primary users:** Policy researchers and investigative journalists who need to understand the full decision-making system — not just individual permits — and who need to run specific queries against the data.

**Secondary users:** Community advocates, Constituents,,and local government officials who need plain-language explanations of who the actors are, what levers they control, and what documents to request.

**Key User Needs**

* As a policy researcher, I need to see which states have the highest growth pressure because I need to prioritize where to direct investigative resources before conflicts emerge.

* As a community advocate, I need to understand who controls the approval process because I need to know who to call, what to request, and when the window to intervene is still open.

* As a local government official, I need to understand the full ten-year cost picture before I sign an incentive agreement because the jobs promise rarely accounts for the infrastructure and tax revenue I am giving away.

* As a constituent, I need clear information about how hyperscale data centers may impact my community infrastructure, essential neighborhood services, utilities, land use, property taxes, traffic, jobs, and overall quality of life., traffic, jobs, and overall quality of life.

# **2\. Proposed Solution**

The Hyperscale Data Center Intelligence System is a React \+ Vite web application that maps the hidden decision-making process behind hyperscale data center development in the United States. Users navigate six interactive views — from a hub-and-spoke intelligence map showing who controls each stage of the approval process, to a live SQL query interface that lets researchers interrogate the dataset directly. As a result, they can answer the question no single agency is currently equipped to answer: after tax benefits, water, electricity, infrastructure, environmental effects, and permanent employment are combined — is this project actually in the public interest?

## **2a. Value Proposition**

| *Policy researchers, journalists, and community advocates who struggle with a fragmented public record — scattered across state agency websites, county planning offices, PSC dockets, and NDA-protected incentive agreements — use the Hyperscale Data Center Intelligence System, a public-interest research platform, to navigate the full decision-making system in one place. Unlike individual permit searches, subsidy trackers, or news aggregators, it maps the ten actors and eight decision layers simultaneously — showing where the process happens before the community is notified — helping them intervene while there is still time to ask the right questions.* |
| :---- |

## **2b. Top 3 MVP Value Props**

* **The Vitamin** (must-have baseline):  A complete map of the 15 highest-pressure U.S. states with operating and planned facility counts, ranked by planned-to-operating ratio.

* **The Painkiller** (solves the core pain):  The intelligence map shows who controls the process at every stage — before the community is notified — so advocates and officials know who to call and what to request before the window closes.

* **The Steroid** (the magic moment):  A live SQL query interface — in the browser, no server required — where researchers type a question and get data back in seconds. Georgia 1.50. Indiana 1.42. Virginia 0.72. The hypothesis proven in real time.

## **2c. Goals & Non-Goals**

**Goals**

* Give policy researchers and community advocates a single platform that maps the full hyperscale data center approval system — ten actors, eight decision layers, the full development timeline.

* Prove that the planned-to-operating ratio is a better predictor of infrastructure conflict than total facility count — and surface the states where that pressure is building fastest.

* Make the SQL dataset queryable in the browser so researchers can test hypotheses directly without needing a data science background or external tools.

* Deploy a live, publicly accessible platform at a real URL that can be shared with journalists, advocates, and policy organizations.

* Establish the foundation for a Phase 2 backend with live API feeds from EIA, BLS, WRI Aqueduct, and EPA eGRID.

**Non-Goals**

* User authentication or saved queries — deferred to Phase 2\.

* Real-time data center announcement tracking — deferred to Phase 3\.

* International markets — regulatory complexity, out of MVP scope.

* Mobile-native application — the platform is responsive but not mobile-first.

* Paid tier or subscription model — this is a public-interest research tool.

## **2d. Success Metrics**

| Goal | Signal | Metric | Target |
| :---- | :---- | :---- | :---- |
| Adoption | Unique visitors to the live site | Netlify analytics — unique visits | 500 in 90 days post-launch |
| Engagement | Users run SQL queries and navigate multiple views | Queries per session; view-switching rate | 3+ queries per session average |
| Task Success | User identifies Georgia and Indiana as highest-pressure states | Time to first insight on Growth Pressure chart | Under 2 minutes without guidance |
| Data Quality | Hypothesis 3 confirmed by SQL query | H3 query returns Georgia 1.50, Indiana 1.42, Virginia 0.72 | 100% accuracy vs. source data |
| Security | No credential exposure or unauthorized API usage | Netlify security headers score | A or A+ at securityheaders.com |

# **3\. Requirements**

## **User Journey 1: Researcher identifying high-pressure states**

Context: A policy researcher lands on the platform for the first time and needs to identify which states are at highest risk for infrastructure conflict — in under five minutes, without reading documentation.

**Sub-journey: Landing and orientation**

* **\[P0\]**  User can read a clear statement of what the platform does and why it exists on the home page — without clicking anything.

* **\[P0\]**  User can navigate to any of the six views from a persistent navigation bar on every page.

* **\[P1\]**  User can see the three research hypotheses on the home page before entering any view.

**Sub-journey: Finding the growth pressure finding**

* **\[P0\]**  User can view all 15 states ranked by planned-to-operating ratio on the Growth Pressure chart.

* **\[P0\]**  User can identify Georgia (1.50) and Indiana (1.42) as the highest-pressure states visually — without reading labels — because they are color-distinguished from all other states.

* **\[P0\]**  User can hover or click any state bar and see operating count, planned count, total, planned share, ratio, and pressure tier in a tooltip.

* **\[P1\]**  User can see the reference line at 1.0 labeled "More planned than operating."

* **\[P2\]**  User can click Georgia or Indiana and navigate to a state deep-dive page.

**Sub-journey: Running a SQL query**

* **\[P0\]**  User can navigate to the Data Query page and see the schema for three tables: states, sectors, layers.

* **\[P0\]**  User can click any of the seven starter queries and have it load into the editor automatically.

* **\[P0\]**  User can press Cmd+Enter or Ctrl+Enter to execute a query and see results in a table.

* **\[P0\]**  User can copy results as CSV.

* **\[P1\]**  User can write a custom SQL query from scratch.

## **User Journey 2: Advocate understanding who controls the process**

Context: A community advocate in Georgia has heard a data center is coming to their county. They need to understand who the actors are, what levers they control, and what documents to request — in plain language.

**Sub-journey: Navigating the intelligence map**

* **\[P0\]**  User can click any of the 10 sector nodes on the Hub & Spoke map and read a full intelligence brief — what the actor controls, wants, provides, receives, and where litigation exposure exists.

* **\[P0\]**  User can toggle the litigation overlay and see where legal challenges can fire across the system.

* **\[P0\]**  User can expand sub-nodes for each sector and read detail on specific actors — Shell LLC, Site Consultant, Public Service Commission.

* **\[P1\]**  User can switch to the Hybrid Map Control Layers view and read the A–H power architecture from strategic intent to legal challenge.

**Sub-journey: Understanding the timeline**

* **\[P0\]**  User can scroll the Linear Development Timeline and see all 11 phases across 6 parallel swimlanes.

* **\[P0\]**  User can click any cell and read the full brief for that phase and track — who the actors are, what documents are in play, and where litigation exposure exists.

* **\[P0\]**  User can click any of the 4 decision gates and read what must be true to pass and what the litigation exposure is at that gate.

* **\[P1\]**  User can click any rail label to isolate that track and follow one thread through the full lifecycle.

## **User Journey 3: Official reviewing research evidence**

Context: A local government official or policy analyst needs to verify the data behind the platform and understand the methodology before citing it in a report or hearing.

**Sub-journey: Accessing the research dashboard**

* **\[P0\]**  User can navigate to the Research Dashboard and access all seven tabs: Overview, State Map, Dataset Matrix, Employment, Incentives, Community, Sources.

* **\[P0\]**  User can click any of the 19 source links and navigate to the original source document.

* **\[P0\]**  User can read the dataset matrix showing all 15 data categories with what to collect, why it matters, and the source.

* **\[P1\]**  User can view employment data by role with salary comparisons and the incentive-per-job calculation.

# **4\. Appendix**

## **Live Site**

hyperdataintelligence.netlify.app — deployed on Netlify, auto-deploy from GitHub main branch (wsvdesign/hyperscale-data-intelligence), branch protection enabled requiring pull request approval before any merge to main.

## **Technical Stack**

* Frontend: React 18 \+ Vite 5 · React Router v6

* Visualization: HTML Canvas API (intelligence maps) · Plain HTML/CSS (growth pressure, timeline)

* In-browser Database: sql.js — SQLite compiled to WebAssembly

* AI Interface: Anthropic API — claude-sonnet-4-6 — direct browser access

* Hosting: Netlify CDN · Security headers via netlify.toml · Branch protection on GitHub

## **Hypothesis Results**

* H1 (Virginia concentration): Directionally correct — Virginia pipeline of 287 planned is still the largest in the country. Ratio of 0.72 reflects relative slowdown, not absolute decline.

* H2 (Republican-leaning states): Partially confirmed — Republican-leaning states average higher planned-to-operating ratios consistent with lower regulatory friction and aggressive incentive packages.

* H3 (Ratio as predictor): CONFIRMED — Georgia 1.50, Indiana 1.42, Virginia 0.72. The ratio reveals what total facility count hides. This is the core finding and the foundation of the platform.

## **Phase 2 Roadmap**

* Supabase backend — PostgreSQL replacing static JSON files

* EIA API — live electricity demand by state

* BLS API — employment data by occupation

* WRI Aqueduct — water stress scores by location

* EPA eGRID — generator emissions by state

* State deep-dive pages — Georgia and Indiana with live API data and investigation checklist

## **Ownership**

© 2026 Natalie Walker · WASIVI · All rights reserved. The medium changed. The thinking never did.