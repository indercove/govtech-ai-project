# Operating Model: Policy Finder Agent

All data is synthetic and made up for learning purposes.

---

## Roles

| Role | Responsibility |
|------|----------------|
| **Product Owner** | Owns the agent roadmap, success metrics, and go-live decisions |
| **Policy Operations Lead** | Maintains policy index, risk tier tags, and content freshness |
| **Engineering Lead** | Owns technical implementation, model selection, and incident response |
| **Officer** | Uses the tool daily; owns every response sent to residents |
| **Supervisor** | Reviews high-risk responses before send is enabled |
| **Team Lead** | Manages officer roster and supervisor list; approves process changes |
| **IT Security** | Reviews permissions, vendor risk, and data handling |
| **Business Owner** | Approves funding, scope changes, and retirement decisions |

---

## Decision rights

| Decision | Harness part | Who decides | Who is consulted | Who is told |
|----------|--------------|-------------|------------------|-------------|
| **Scope** — what the agent can and cannot do | Permissions, tools, stop conditions | Product Owner | Engineering Lead, Policy Operations Lead, IT Security | Officers, Supervisors, Business Owner |
| **Permissions** — read/draft/write/send tiers for each action | Permission settings in AI PRD | Product Owner | Engineering Lead, IT Security | Officers, Team Lead |
| **Vendor and model** — which LLM provider and model version | Model config, API contracts | Engineering Lead | Product Owner, IT Security | Business Owner, Policy Operations Lead |
| **Go-live** — when the agent moves to pilot or production | Kill switches, success thresholds | Business Owner | Product Owner, Engineering Lead, Team Lead | Officers, Supervisors, Policy Operations Lead |
| **Incident** — how to respond when the agent fails or misbehaves | Stop conditions, kill switch triggers, monitoring | Engineering Lead | Product Owner, IT Security | Officers, Supervisors, Business Owner |
| **Retire** — when to turn off or replace the agent | Kill switch, sunset plan | Business Owner | Product Owner, Engineering Lead, Policy Operations Lead | Officers, Supervisors, Team Lead |

---

## How to read this table

- **Who decides:** Has final authority. One role only.
- **Who is consulted:** Gives input before the decision. Their view is considered but not binding.
- **Who is told:** Informed after the decision is made. No input required.

---

*Last updated: 2026-11-19*
