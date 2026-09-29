export const stage2Background = [
  `Meeting Date: 2026-01-29
Type: Executive Steering Committee
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO), David Chen (Lead Architect), Priya Patel (VP of Product).

Discussion summary: David Chen presented the technical spike, comparing three primary models. He strongly recommended the Shared Database/Separate Schemas architecture utilizing PostgreSQL. Elena Rostova agreed, noting that this model simplifies access control audits for SOC 2 compliance. Elena presented three vendors for the SOC 2 gap assessment software. The committee selected 'TrustCloud'. Priya Patel requested an extension for the roadmap revision.

Decisions:
- Formally approved the "Shared Database, Separate Schemas" architecture for the multi-tenant migration.
- Selected TrustCloud as the SOC 2 readiness and automated gap assessment platform.

Action items:
- Execute vendor contract with TrustCloud.
- Create initial database schema migration script plan.
- Finalize and present the revised Q1/Q2 product roadmap.`,

  `Meeting Date: 2026-02-12
Type: Executive Steering Committee
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO), David Chen (Lead Architect), Priya Patel (VP of Product).

Discussion summary: Priya Patel presented the revised roadmap. The Advanced Analytics module is delayed to Q4, but the multi-tenant migration will be marketed as a performance/security upgrade to appease clients. Elena shared TrustCloud gap analysis results: lacking formalized InfoSec Policies, incomplete endpoint security (MDM), and unmonitored API telemetry. David proposed splitting 500TB data migration across four 12-hour weekend maintenance windows in April.

Decisions:
- Q1/Q2 Roadmap is formally approved and locked.
- Approved the 4-phase weekend maintenance window strategy for April.

Action items:
- Draft core SOC 2 policies (Access Control, Incident Response, Data Classification).
- Implement PostgreSQL Row-Level Security (RLS) policies in staging.
- Draft customer communication plan for April maintenance windows.`,

  `Meeting Date: 2026-02-26
Type: Executive Steering Committee
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO), David Chen (Lead Architect).

Discussion summary: Elena presented drafts for Access Control, IR, and Data Classification policies. The new Access Control policy restricts production DB access to a strict break-glass protocol. David reported RLS configured in staging, but load testing showed a 15% increase in query latency. Marcus directed engineering to optimize DB indexes. Elena proposed hiring 'Accorp Partners' for the external CPA firm audit.

Decisions:
- Core SOC 2 policies approved in draft form.
- Selected Accorp Partners as the external CPA firm for the audit.

Action items:
- Optimize Postgres indexes in staging to resolve the 15% latency degradation.
- Finalize contract with Accorp Partners and establish the formal audit window timeline.
- Draft customer communication plan for April maintenance (carried over).`
];

export const stage3Background = [
  `Meeting Date: 2026-03-26
Type: Executive Steering Committee
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO), David Chen (Lead Architect), Priya Patel (VP of Product).

Discussion summary: David Chen reported a highly successful dry run of the migration scripts in the staging environment. The process took 9.5 hours, leaving a 2.5-hour safety buffer. Automated data integrity checksums passed with 100% accuracy. Elena Rostova reported that 92% of employees have installed the MDM software; however, several senior developers actively resisted due to privacy concerns. Sarah Jenkins stated HR will enforce the installation by Friday as it is a non-negotiable SOC 2 Type II requirement. Priya confirmed no customer churn risks were identified following maintenance notifications.

Decisions:
- UNANIMOUS GO decision for Phase 1 of the production multi-tenant migration.
- HR will mandate MDM installation; non-compliant laptops blocked from VPN on Monday.

Action items:
- Execute Phase 1 Production Migration (Cohorts 1-25).
- Achieve 100% MDM compliance across the organization via VPN enforcement.
- Schedule an external penetration test.`,

  `Meeting Date: 2026-04-09
Type: Executive Steering Committee
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO), David Chen (Lead Architect), Priya Patel (VP of Product).

Discussion summary: Phase 1 migration was successful. A minor configuration error caused a 15-minute outage for two clients but was resolved quickly. Elena confirmed 100% MDM compliance after HR enforced a VPN block. The TrustCloud dashboard shows Security at 98% pending the pen test, and Availability/Confidentiality at 100%. External pen test scheduled for April 15-18.

Decisions:
- Approved to proceed with Phases 2, 3, and 4 of the DB migration.
- External penetration testing vendor and scope approved.

Action items:
- Execute Phases 2-4 of Production Migration.
- Oversee external pen test and prepare remediation report.
- Finalize the formal System Description document.`,

  `Meeting Date: 2026-04-23
Type: Executive Steering Committee
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO), David Chen (Lead Architect).

Discussion summary: Multi-tenant database migration fully complete. Legacy single-tenant databases decommissioned, reducing AWS RDS costs by 40%. Pen test results showed 0 Critical and 1 High vulnerability (XSS flaw), which David's team patched within 24 hours. The System Description document was approved.

Decisions:
- Formally close the Multi-Tenant Database Migration project (total success).
- Approve the System Description for formal submission to CPA firm.

Action items:
- Submit signed System Description and evidence vault to Accorp Partners.
- Patch remaining 4 Medium vulnerabilities from pen test.
- Transition engineering resources back to Q3 product roadmap.`,

  `Meeting Date: 2026-05-07
Type: Executive Steering Committee
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO), Priya Patel (VP of Product).

Discussion summary: Observation period commenced May 1. TrustCloud monitoring shows 100% compliance. Marcus reported the 4 Medium pen test vulnerabilities were patched. The new architecture is stable, but compute scaling rules need adjustment due to minor sluggishness during peak morning logins. Priya stated product team successfully pivoted back to Advanced Analytics.

Decisions:
- Steering Committee shifts to "Monitoring and Governance Mode" for the next 6 months.

Action items:
- Tune AWS auto-scaling groups to handle peak morning login loads.
- Conduct a Vendor Risk Management audit of all third-party SaaS tools.`
];
