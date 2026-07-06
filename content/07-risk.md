# Risk Management

## Risk Management Approach

The program employs a **proactive, quantitative risk management** methodology aligned with **PMI PMBOK**, **NIST SP 800-30** (for cybersecurity risks), and **OMB Circular A-11** guidance for federal program risk.

Risks are identified, assessed, responded to, and monitored continuously — not as a point-in-time exercise. Every team member is empowered and expected to surface risks.

---

## Risk Classification

### Probability × Impact Matrix

| | **Low Impact** | **Medium Impact** | **High Impact** | **Critical Impact** |
|---|---|---|---|---|
| **Very Likely** | Low | Medium | High | Critical |
| **Likely** | Low | Medium | High | Critical |
| **Possible** | Low | Low | Medium | High |
| **Unlikely** | Low | Low | Low | Medium |

**Thresholds:**
- 🔴 **Critical** — Immediate escalation to PCB; executive attention required
- 🟠 **High** — ART-level mitigation plan within 5 business days
- 🟡 **Medium** — Workstream lead owns mitigation; reviewed monthly
- 🟢 **Low** — Logged and monitored; reviewed quarterly

---

## Top Program Risks

| ID | Risk Description | Category | Probability | Impact | Rating | Mitigation |
|---|---|---|---|---|---|---|
| R-001 | Agency resistance to change delays adoption | Organizational | Likely | High | 🟠 High | Dedicated OCM program, executive sponsorship, agency champions |
| R-002 | Legacy system complexity exceeds migration estimates | Technical | Possible | Critical | 🟠 High | Deep-dive technical discovery sprints; contingency buffer in plan |
| R-003 | Key vendor underperformance or contract dispute | Vendor | Unlikely | High | 🟡 Medium | Vendor scorecards, SLA enforcement, contract incentives/penalties |
| R-004 | Cybersecurity breach during migration window | Security | Possible | Critical | 🔴 Critical | Accelerated ZTA rollout; parallel-run security posture; 24/7 SOC |
| R-005 | Budget tranche approvals delayed by Congress | Financial | Possible | High | 🟠 High | Phased scope with value delivery at each tranche; reserve fund |
| R-006 | Loss of key technical personnel (brain drain) | People | Likely | Medium | 🟡 Medium | Succession planning, knowledge documentation, retention incentives |
| R-007 | Cloud provider outage impacting Tier-1 services | Infrastructure | Unlikely | Critical | 🟡 Medium | Multi-cloud DR strategy; RPO/RTO <4hr for all Tier-1 systems |
| R-008 | Data quality issues in migrated datasets | Data | Likely | High | 🟠 High | Pre-migration data quality assessment; automated cleansing pipelines |
| R-009 | Regulatory or policy changes require rework | Compliance | Possible | Medium | 🟡 Medium | Policy monitoring function; modular architecture for adaptability |
| R-010 | Integration complexity between agencies causes delays | Technical | Likely | Medium | 🟡 Medium | API-first integration strategy; dedicated integration ART squad |

---

## Risk Response Strategies

| Strategy | When to Use | Example |
|---|---|---|
| **Avoid** | Eliminate root cause | Descope risky component to a later phase |
| **Mitigate** | Reduce probability or impact | Increase testing coverage before migration |
| **Transfer** | Shift risk to another party | Contractual SLAs with penalty clauses on vendors |
| **Accept (Active)** | Acknowledge; build contingency | Budget reserve for cost overruns |
| **Accept (Passive)** | Low-rated risks; monitor only | Minor vendor delivery delays |

---

## Issue Management

When a risk materializes, it becomes an **Issue** and follows the issue escalation process:

1. **Log** — Entered in issue register with date, description, and owner
2. **Triage** — Severity assessed within 24 hours
3. **Assign** — Resolution owner and target date confirmed
4. **Resolve** — Mitigation actions tracked to completion
5. **Close** — Issue closed with documented resolution and lessons learned
6. **Escalate** — P1/P2 issues escalated to ALC within 4 hours; PCB within 24 hours

---

## Program Assumptions & Constraints

### Assumptions
- All 12 agencies will provide dedicated product owners and SMEs throughout the program
- FedRAMP authorizations will be maintained by cloud service providers without significant interruption
- Congressional budget appropriations will align with the 3-tranche funding model
- Existing agency network infrastructure is capable of supporting hybrid cloud connectivity

### Constraints
- All systems must maintain compliance with FISMA, FedRAMP, and agency-specific ATO requirements
- No production deployments between November 15 and January 15 (government change freeze)
- Citizen data must remain within continental United States (data sovereignty)
- All vendors must hold active FedRAMP authorization for cloud services offered
