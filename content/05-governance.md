# Governance Framework

## Governance Philosophy

Effective governance for a program of this scale requires a tiered decision-making structure that balances **speed of delivery** with **accountability and oversight**. The governance model is designed to push decisions to the lowest appropriate level, escalating only when cross-agency impact, budget authority, or policy deviation is involved.

---

## Governance Tiers

### Tier 1 — Strategic Oversight
**Federal Modernization Steering Committee (FMSC)**

- **Composition:** Deputy Secretaries of participating agencies, Federal CIO, Program Sponsor
- **Meeting Cadence:** Quarterly
- **Authorities:** Program budget approval, policy waivers, strategic direction changes, executive risk escalation

### Tier 2 — Program Governance
**Program Control Board (PCB)**

- **Composition:** Agency CIOs, Program Director, Chief Architect, CISO, PMO Lead
- **Meeting Cadence:** Monthly
- **Authorities:** Scope changes >$5M, architecture exceptions, cross-ART dependency resolution, vendor contract decisions

### Tier 3 — Delivery Governance
**ART Leadership Council (ALC)**

- **Composition:** Release Train Engineers (RTEs), Product Managers, Solution Architects
- **Meeting Cadence:** Bi-weekly
- **Authorities:** PI objective setting, intra-ART trade-offs, team-level risk management

### Tier 4 — Operational Governance
**Squad / Team Level**

- **Composition:** Scrum Masters, Product Owners, Development Leads
- **Meeting Cadence:** Daily/weekly ceremonies
- **Authorities:** Sprint planning, story acceptance, day-to-day technical decisions

---

## Decision Rights Matrix (RACI)

| Decision | FMSC | PCB | ALC | Squad |
|---|---|---|---|---|
| Program budget reallocation | **A** | R | I | — |
| Architecture standard changes | I | **A** | R | C |
| Vendor selection (>$1M) | I | **A** | R | C |
| PI objective setting | I | C | **A** | R |
| Sprint scope changes | — | I | C | **A** |
| Security exception requests | I | **A** | R | C |
| Production deployments | I | I | **A** | R |
| Agency onboarding | C | **A** | R | I |

*R = Responsible, A = Accountable, C = Consulted, I = Informed*

---

## Change Control Process

All changes to program scope, schedule, budget, or architecture follow a formal **Change Request (CR)** process:

1. **Initiation** — Change identified by any team member; CR logged in program ITSM system
2. **Impact Assessment** — Technical, financial, and schedule impact analyzed by relevant SMEs
3. **Classification** — Categorized as Minor (≤$100K, ≤2 week delay) or Major (above thresholds)
4. **Review** — Minor CRs reviewed at ALC; Major CRs escalated to PCB
5. **Decision** — Approved / Rejected / Deferred with documented rationale
6. **Implementation** — Approved changes baselined and communicated to all affected parties
7. **Closure** — CR closed with evidence of implementation

---

## Program Reporting

| Report | Frequency | Audience | Content |
|---|---|---|---|
| Sprint Status Report | Bi-weekly | ALC | Velocity, stories completed, blockers |
| PI Completion Report | Every 12 weeks | PCB | PI objectives met, metrics, risks |
| Executive Dashboard | Monthly | PCB + FMSC | KPIs, budget burn, milestone status |
| Risk & Issues Log | Monthly | PCB | Top 10 risks, mitigations, owners |
| Benefits Realization Report | Quarterly | FMSC | Progress toward strategic targets |
| Annual Program Health Assessment | Annual | FMSC + OMB | IV&V findings, lessons learned |

---

## Key Performance Indicators (KPIs)

### Delivery KPIs
- **PI Predictability:** % of PI objectives met (target: ≥80%)
- **Sprint Velocity:** Story points completed per sprint per team
- **Defect Escape Rate:** Defects reaching production per release (target: <2%)
- **Deployment Frequency:** Production deployments per month per ART

### Quality KPIs
- **Test Automation Coverage:** % of test cases automated (target: ≥75%)
- **Mean Time to Resolve (MTTR):** Average incident resolution time (target: <4 hrs P1)
- **Security Findings:** Open high/critical vulnerabilities (target: 0 at release)

### Business KPIs
- **Cost Avoidance:** Cumulative savings vs. baseline spend
- **Application Portfolio Size:** Running count of rationalized apps
- **System Availability:** Uptime of Tier-1 systems (target: 99.9%)
- **Citizen Satisfaction (NPS):** Survey score for digital services
