export const demoScripts: Record<number, { invite: string; transcript: string }> = {
  1: {
    invite: `Subject: Project Kickoff - Multi-Tenant Migration & SOC 2 Type II Initiative
Date: Thursday, Jan 15, 2026 • 10:00 AM – 11:30 AM EST
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO), David Chen (Lead Architect), Priya Patel (VP of Product)

Agenda:
1. Executive mandate and strategic alignment.
2. Multi-tenant architecture initial scoping and resource requirements.
3. SOC 2 Type II audit timeline and gap assessment planning.
4. Product roadmap adjustments and project governance.`,
    transcript: `Meeting Date: 2026-01-15
Type: Executive Steering Committee
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO), David Chen (Lead Architect), Priya Patel (VP of Product).

Discussion summary: The committee convened to align on the absolute necessity of both strategic projects. Sarah Jenkins opened by stating the dual mandate is non-negotiable for Series C funding. Marcus Vance highlighted that the current single-tenant database infrastructure cannot scale without margin collapse. David Chen proposed initiating a two-week technical spike to evaluate various multi-tenant database models. Elena Rostova stressed that SOC 2 Type II requires a continuous 6-to-12 month observation period. Priya Patel expressed serious concern over freezing the product roadmap for two quarters.

Decisions:
- Multi-Tenant Migration and SOC 2 Type II preparation will be managed as a single integrated program.
- A partial feature freeze will be implemented in Q2.

Action items:
- Draft SOC 2 Gap Analysis timeline and initiate vendor RFP.
- Complete technical spike evaluating multi-tenant database models.
- Revise the Q1/Q2 product roadmap.`
  },
  2: {
    invite: `Subject: Security Policy Approval & Migration Script Draft
Date: Thursday, Mar 12, 2026 • 10:00 AM – 11:00 AM EST
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO), David Chen (Lead Architect), Priya Patel (VP of Product), Michael O'Connor (External Auditor)

Agenda:
1. Introduction of External Auditor and finalization of the SOC 2 observation period.
2. Review staging index optimizations and query latency metrics.
3. Review customer communication plan for April downtime.`,
    transcript: `Meeting Date: 2026-03-12
Type: Executive Steering Committee
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO), David Chen (Lead Architect), Priya Patel (VP of Product), Michael O'Connor (External Auditor).

Discussion summary: Michael O'Connor outlined the strict temporal requirements for the audit. To generate a final Type II report by Q4, a minimum 6-month observation period must run continuously from May 1 to October 31, 2026. This creates a hard, non-negotiable deadline: the multi-tenant database migration and all internal security policies must be strictly operational by April 30. David Chen confirmed that aggressive index optimizations and query rewriting reduced the RLS latency overhead from 15% to just 4%, which Marcus Vance deemed highly acceptable for a production deployment. Priya Patel presented the customer communication plan, scheduling four 12-hour maintenance windows on Saturday nights throughout April.

Decisions:
- SOC 2 Type II observation period is formally set for May 1, 2026 – October 31, 2026.
- 4% query latency overhead is accepted as a necessary architectural tradeoff for strict tenant data isolation.
- Customer communication plan approved; official maintenance notices will be distributed next week.

Action items:
- Distribute maintenance window notifications to all enterprise clients.
- Execute full end-to-end data migration script test in the staging environment.
- Roll out endpoint security agents (MDM) to all employee laptops.`
  },
  3: {
    invite: `Subject: System Monitoring & Vendor Risk Management
Date: Thursday, May 21, 2026 • 10:00 AM – 11:00 AM EST
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO)

Agenda:
1. Infrastructure scaling and performance update.
2. Vendor Risk Management audit results.
3. Addressing Shadow IT and procurement policies.`,
    transcript: `Meeting Date: 2026-05-21
Type: Executive Steering Committee
Attendees: Sarah Jenkins (CEO), Marcus Vance (CTO), Elena Rostova (CISO).

Discussion summary: Marcus Vance confirmed the AWS auto-scaling rules were updated; the platform now pre-warms instances at 7:30 AM EST, entirely eliminating the morning latency spikes reported in the previous meeting. Elena Rostova presented the Vendor Risk Management audit. The automated scan discovered a severe Shadow IT violation: the marketing team was using an unauthorized, non-compliant analytics tool to ingest customer email addresses. This tool was procured outside the centralized IT purchasing process, violating the Data Classification and Asset Management policies. Sarah Jenkins expressed deep frustration and instructed immediate remediation to prevent an audit exception that could jeopardize the entire Q4 timeline.

Decisions:
- The unauthorized marketing tool is banned immediately; access will be blocked at the firewall level and API keys revoked.
- A mandatory retraining on the software procurement policy will be issued to all department heads to prevent future Shadow IT drift.

Action items:
- Revoke API access and block the unauthorized marketing tool at the network level.
- Issue software procurement retraining module to all VP-level staff.
- Schedule the mandatory annual Incident Response (IR) tabletop exercise.`
  }
};
