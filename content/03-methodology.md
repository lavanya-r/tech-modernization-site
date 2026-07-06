# Delivery Methodology

## Methodology Framework

The program adopts **SAFe 6.0 (Scaled Agile Framework)** as its delivery methodology, scaled to accommodate 12 agencies, 30+ delivery teams, and a multi-vendor ecosystem. SAFe provides the structure for aligning strategy to execution while preserving team-level agility.

The framework is complemented by:
- **Human-Centered Design (HCD)** — for discovery, research, and UX validation
- **DevSecOps** — for continuous integration, security automation, and deployment pipelines
- **ITIL 4** — for IT service management, change management, and operations
- **PMBOK / PRINCE2 Agile** — for program-level governance, risk, and controls

---

## Delivery Model: Agile Release Trains (ARTs)

The program is organized into **5 Agile Release Trains (ARTs)**, each responsible for a distinct delivery domain:

| ART | Domain | Teams | Cadence |
|---|---|---|---|
| ART-1 | Infrastructure & Cloud | 6 | PI (12 weeks) |
| ART-2 | Application Modernization | 8 | PI (12 weeks) |
| ART-3 | Data & Analytics | 5 | PI (12 weeks) |
| ART-4 | Cybersecurity & Identity | 4 | PI (12 weeks) |
| ART-5 | Digital Services & UX | 7 | PI (12 weeks) |

Each ART conducts a **Program Increment (PI) Planning** event every 12 weeks, setting aligned objectives across all squads for the coming increment.

---

## Sprint & PI Cadence

```
Week 1-2:   Sprint 1
Week 3-4:   Sprint 2
Week 5-6:   Sprint 3
Week 7-8:   Sprint 4
Week 9-10:  Sprint 5
Week 11:    Innovation & Planning (IP) Sprint
Week 12:    PI Planning for next increment
```

### Key Ceremonies

| Ceremony | Frequency | Participants | Purpose |
|---|---|---|---|
| Daily Stand-up | Daily | Squad | Sync, blockers, progress |
| Sprint Review | Bi-weekly | Squad + PO | Demo and acceptance |
| Sprint Retrospective | Bi-weekly | Squad | Continuous improvement |
| PI Planning | Every 12 weeks | All ARTs | Alignment and commitment |
| ART Sync | Weekly | RTE + PMs | Cross-team dependency management |
| System Demo | End of each PI | Stakeholders | Integrated increment showcase |
| Inspect & Adapt | End of each PI | All ARTs | Quantitative retrospective |

---

## Definition of Ready (DoR)

A user story or feature is **Ready** for sprint planning when:
- Acceptance criteria are clearly defined
- Dependencies are identified and acknowledged
- Security and compliance requirements are documented
- Effort has been estimated (story points)
- UI/UX mockups are available (for front-end stories)

## Definition of Done (DoD)

A story is **Done** when:
- Code is written, peer-reviewed, and merged to main branch
- Unit tests pass (≥80% coverage)
- Integration tests pass in CI pipeline
- Security scan completed (SAST/DAST/SCA) with no high/critical findings
- Accessibility check passed (WCAG 2.1 AA)
- Documentation updated (API docs, runbooks)
- Product Owner acceptance confirmed

---

## Quality Assurance

The program runs a **shift-left QA model**:

1. **Unit Testing** — developer responsibility, automated in CI pipeline
2. **Integration Testing** — automated suite per ART, run on every merge
3. **Performance Testing** — load/stress tests on every major release
4. **Security Testing** — SAST, DAST, container scanning in pipeline
5. **User Acceptance Testing (UAT)** — agency SMEs validate before each production release
6. **Accessibility Testing** — automated (axe-core) + manual screen-reader testing
7. **Independent Verification & Validation (IV&V)** — quarterly independent assessments

---

## Toolchain

| Category | Tool |
|---|---|
| Project Management | Jira / Azure DevOps |
| Source Control | GitHub Enterprise |
| CI/CD | GitHub Actions / Azure Pipelines |
| Infrastructure as Code | Terraform + Ansible |
| Containerization | Kubernetes (EKS / AKS) |
| Monitoring | Datadog + Splunk |
| Collaboration | Microsoft Teams + Confluence |
| Security Scanning | Snyk + Veracode + Prisma Cloud |
| API Management | Azure API Management / Kong |
