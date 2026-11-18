# One Pager

Use case: [your chosen scenario (A, B, or C), written with synthetic data only]

## Problem and user
## Opportunity and evidence
## Experience and trust
## Risks (market, technical, team)

All examples are synthetic and made up for learning purposes.

### Market risk: Officers won't adopt the tool

Officers already have personal bookmarks and muscle memory. Early prototype bugs have reduced their confidence in AI-assisted tools. If they see the tool as unreliable, they will revert to old methods regardless of potential time savings.

**How we will test it:** Run a 1-shift pilot with 5 officers. Measure: (1) how many officers use the tool on at least 20% of their tickets, and (2) how many abandon it mid-shift and revert to bookmarks. Kill signal: fewer than 3 of 5 officers complete the shift using the tool.

---

### Technical risk: Prototype instability erodes trust before launch

The prototype keeps breaking during development, reducing stakeholder confidence. If this pattern continues into pilot, officers and leadership will question whether the tool is production-ready, even if individual bugs are fixed.

**How we will test it:** Track bugs per sprint and require 3 consecutive stable test cycles (no critical bugs) before approving pilot. Kill signal: if we cannot achieve 3 stable cycles within 4 sprints, pause development and audit the architecture.

---

### Team risk: No dedicated owner for policy content

The tool depends on accurate, up-to-date policy data. Without a named owner accountable for maintaining the policy index, content will become stale. Officers will lose trust after encountering outdated recommendations.

**How we will test it:** Assign a Policy Operations Lead before pilot. Test accountability by auditing 10 random policies monthly — check if they match the current source of truth. Kill signal: if more than 20% of audited policies are outdated, pause rollout until ownership is resolved.

## Build plan and handoff
## Agent role and guardrails
## Roles and operating model
## Strategy and roadmap

### Strategy Kernel

**Diagnosis:** Customer service officers spend too much time searching for policy information across fragmented sources, slowing first response and increasing error risk.

**Guiding Policy:** Build an AI-assisted Single Source of Truth tool that surfaces relevant policy documentation in the officer's workflow, reducing search time and improving accuracy.

**Coherent Actions:**

1. Index and consolidate policy documentation from multiple owners into a single searchable repository
2. Build a retrieval tool that recommends policy pages based on ticket content and enquiry type
3. Integrate recommendations into the officer's existing ticketing workflow (not a separate app)
## Metrics plan and stop line
## Evals and gates
## Decision: continue, pivot or stop
## Open issues
