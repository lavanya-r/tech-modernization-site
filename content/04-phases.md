# Program Phases

## Phase Overview

The program is structured across **5 phases**, each with distinct objectives, deliverables, and exit criteria. Phases are not purely sequential — later phases begin while earlier ones continue, following a rolling-wave planning approach.

---

## Phase 1 — Discovery *(FY2025 Q1–Q2)*

**Objective:** Establish program infrastructure, complete current-state assessment, and define target architecture.

### Key Activities
- Stand up Program Management Office (PMO) and governance structures
- Conduct agency discovery workshops and current-state IT inventory
- Complete Application Portfolio Assessment (APA) across all 12 agencies
- Define Target Operating Model (TOM) and enterprise architecture blueprints
- Establish DevSecOps platform, toolchain, and shared services
- Onboard all ART teams and complete SAFe training

### Deliverables
- Program Charter and Master Program Plan
- Current State Assessment Report
- Target Architecture Blueprint (cloud, security, data, integration)
- Agency Onboarding Packages (×12)
- DevSecOps Platform (operational)
- Program Risk Register (baseline)

### Exit Criteria
- All agencies formally onboarded with signed Memoranda of Understanding (MoU)
- DevSecOps platform certified and operational
- Phase 2 PI Planning completed

---

## Phase 2 — Core Infrastructure Modernization *(FY2025 Q3 – FY2026 Q2)*

**Objective:** Migrate foundational infrastructure to the cloud and establish shared platform services.

### Key Activities
- Data center consolidation: decommission 8 of 14 on-premise data centers
- Deploy cloud landing zones (AWS GovCloud / Azure Government) per agency
- Implement Zero Trust network segmentation and identity foundation (IAM/PAM)
- Migrate Tier-3 and Tier-4 (low-criticality) workloads
- Deploy enterprise monitoring, logging, and SIEM platform
- Establish API gateway and integration platform

### Deliverables
- Cloud Landing Zone (per agency, FedRAMP authorized)
- Zero Trust Architecture Implementation — Phase 1
- Enterprise IAM / MFA rollout (100% of staff)
- Network modernization playbooks
- Data center decommission reports

### Exit Criteria
- ≥50% of infrastructure workloads migrated
- Zero Trust identity controls applied to all privileged accounts
- FedRAMP High authorization obtained for cloud environments

---

## Phase 3 — Application Modernization *(FY2026 Q1 – FY2027 Q4)*

**Objective:** Rationalize the application portfolio and migrate Tier-1 and Tier-2 systems to cloud-native platforms.

### Key Activities
- Execute Application Rationalization Plan (Retain / Retire / Rehost / Replatform / Refactor / Replace)
- Migrate all Tier-1 mission-critical systems using targeted modernization strategies
- Decommission 180+ legacy applications identified for retirement
- Build/deploy replacement microservices for core business functions
- Implement event-driven architecture for high-throughput systems

### Modernization Strategy Distribution *(estimated)*

| Strategy | Applications | % of Portfolio |
|---|---|---|
| Retire | 120 | 40% |
| Rehost (Lift & Shift) | 60 | 20% |
| Replatform | 45 | 15% |
| Refactor / Re-architect | 45 | 15% |
| Replace (COTS/SaaS) | 30 | 10% |

### Exit Criteria
- All Tier-1 systems migrated and operational in cloud
- Portfolio reduced to ≤120 applications
- No applications running on hardware past end-of-support

---

## Phase 4 — Data & Digital Services Transformation *(FY2027 Q1 – FY2028 Q4)*

**Objective:** Implement federated data mesh, advanced analytics, and re-platformed citizen digital services.

### Key Activities
- Deploy federated data mesh across 5 authoritative data domains
- Launch unified citizen portal with single sign-on (SSO) and personalized dashboards
- Implement AI/ML capabilities for predictive analytics and process automation
- Deploy open data APIs for authorized third-party integrations
- Complete WCAG 2.1 AA accessibility compliance across all citizen touchpoints

### Data Domains
1. **Identity & Benefits** — Citizen identity, entitlements, benefit eligibility
2. **Finance & Grants** — Federal appropriations, grants management, disbursements
3. **Health & Safety** — Public health records, safety reporting, inspections
4. **Land & Environment** — Geospatial data, environmental monitoring, permitting
5. **Workforce & HR** — Federal employment, payroll, training records

---

## Phase 5 — Optimization & Continuous Improvement *(FY2029 – FY2030)*

**Objective:** Stabilize operations, realize cost savings, measure outcomes, and embed continuous improvement culture.

### Key Activities
- Conduct full program benefits realization review
- Transfer operations to agency-embedded DevSecOps teams
- Decommission remaining legacy infrastructure
- Execute workforce capability uplift and knowledge transfer program
- Publish Open Government data sets under FOIA-compliant framework
- Prepare successor program roadmap

### Exit Criteria
- $400M cost avoidance target achieved or on trajectory
- All program KPIs at or above target
- Operational sustainability plan signed by all agency CIOs
- Final program closeout report delivered to oversight body
