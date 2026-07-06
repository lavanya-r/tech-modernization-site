# Program Workstreams

## Workstream Structure

The program is organized into **6 delivery workstreams**, each mapped to a distinct technical or functional domain. Workstreams operate across multiple ARTs and are led by a Workstream Lead who reports to the Program Director.

---

## WS-1: Infrastructure & Cloud

**Objective:** Establish a secure, scalable, and cost-efficient cloud foundation for all agency workloads.

### Scope
- Cloud strategy and landing zone design (AWS GovCloud, Azure Government, hybrid)
- Data center consolidation and decommissioning
- Network modernization (SD-WAN, MPLS migration, DNS/DNSSEC)
- Compute, storage, and backup platform services
- Enterprise monitoring and observability (AIOps)

### Key Milestones
| Milestone | Target |
|---|---|
| Cloud landing zones deployed (all agencies) | FY2025 Q4 |
| 50% infrastructure migrated to cloud | FY2026 Q2 |
| 8 data centers decommissioned | FY2026 Q3 |
| 100% Tier-1 workloads on cloud | FY2027 Q1 |
| Remaining legacy infra decommissioned | FY2029 Q2 |

---

## WS-2: Application Modernization

**Objective:** Rationalize and modernize the government application portfolio through targeted migration strategies.

### Scope
- Application Portfolio Assessment and rationalization planning
- Legacy application migration (rehost, replatform, refactor, replace)
- Microservices decomposition of monolithic core systems
- API-first integration uplift
- SaaS adoption (ERP, HR, Finance, Case Management)

### Application Categories
| Category | Count | Strategy |
|---|---|---|
| Mission-Critical Systems | 45 | Refactor / Replatform |
| Administrative Systems | 90 | Replace (SaaS) or Retire |
| Reporting / Analytics | 60 | Consolidate / Replatform |
| Legacy Integrations | 105 | Retire / Replace with API |

---

## WS-3: Data & Analytics

**Objective:** Transform government data from siloed, inconsistent stores into a trusted, federated, and analytics-ready asset.

### Scope
- Data inventory and lineage mapping
- Master Data Management (MDM) framework
- Federated data mesh architecture
- Data quality and governance tooling
- Analytics platform (BI dashboards, self-service analytics)
- AI/ML platform for predictive use cases
- Open Data portal (FOIA-compliant publication)

### Data Governance Model
- **Data Owners:** Agency-level accountable executives per data domain
- **Data Stewards:** Technical custodians managing pipelines and quality
- **Data Council:** Cross-agency body setting standards and resolving disputes
- **Data Catalog:** Enterprise metadata registry (Collibra / Apache Atlas)

---

## WS-4: Cybersecurity & Identity

**Objective:** Implement a Zero Trust security architecture and establish government-wide Identity, Credential, and Access Management (ICAM).

### Scope
- Zero Trust Architecture (ZTA) per NIST SP 800-207
- Enterprise Identity Provider (IdP) with MFA and passwordless authentication
- Privileged Access Management (PAM) — CyberArk / BeyondTrust
- Security Operations Center (SOC) modernization
- Vulnerability management and patch automation
- Supply chain risk management (SCRM)
- Security Information and Event Management (SIEM) — Splunk / Microsoft Sentinel

### Zero Trust Pillars Progress

| Pillar | Current Maturity | Target Maturity | Timeline |
|---|---|---|---|
| Identity | Initial | Advanced | Year 2 |
| Device | Initial | Intermediate | Year 2 |
| Network | Ad hoc | Advanced | Year 3 |
| Application | Initial | Advanced | Year 3 |
| Data | Ad hoc | Intermediate | Year 4 |

---

## WS-5: Digital Services & UX

**Objective:** Redesign and re-platform citizen-facing services to deliver a modern, accessible, and personalized digital experience.

### Scope
- Citizen portal redesign and consolidation
- Mobile-first, accessible service delivery (WCAG 2.1 AA)
- Single Sign-On (SSO) for all citizen-facing applications
- Omnichannel service delivery (web, mobile, assisted)
- Forms modernization (eliminate paper/PDF forms)
- Notification and correspondence management
- Feedback and continuous UX improvement loops

### HCD Process
Each digital service follows the Human-Centered Design double diamond:

1. **Discover** — User research, journey mapping, pain point analysis
2. **Define** — Problem framing, personas, service blueprinting
3. **Develop** — Prototyping, co-design workshops, iterative testing
4. **Deliver** — Staged rollout, A/B testing, post-launch monitoring

---

## WS-6: Program Enablement

**Objective:** Provide the cross-cutting functions that enable all workstreams to operate effectively.

### Scope
- PMO operations (schedule, budget, resource management)
- Change management and communications
- Training and workforce capability uplift
- Vendor management and contract governance
- Organizational change management (OCM)
- Benefits tracking and realization management
- Knowledge management and documentation

### OCM Approach
Change management follows the **Prosci ADKAR** model:
- **Awareness** — Stakeholder communications strategy
- **Desire** — Agency champion networks and executive sponsorship
- **Knowledge** — Training programs and playbooks
- **Ability** — Coaching, sandbox environments, hands-on labs
- **Reinforcement** — Recognition programs, metrics tracking, feedback loops
