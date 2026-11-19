# One Pager

Use case: A · ServiceSG enquiry response

All quotes and metrics are synthetic and made up for learning purposes.

## Problem and user

**User:** Customer service officers at ServiceSG contact centres, front desks, and helpdesks.

**Problem:** Officers spend more time finding the right policy page than writing the reply. This slows first response, increases error risk, and leads to inconsistent answers.

**What the team found:**
- Two officers answering the same question often give different answers
- Many enquiries (~20%) include an image or attachment that current tools cannot read
- Policy changes often, and the source of truth sits with several teams
- Officers cannot keep up with all policy changes

**User quotes (synthetic):**
- "I spend too long finding the policy pages."
- "There are too many policy changes and some queries are based on policies before the change was made."
- "I wish a tool can just recommend where to look."

## Opportunity and evidence

**Time savings identified:**
| Activity | Current | With tool | Saving |
|----------|---------|-----------|--------|
| Searching for policy | 3 min | 1 min | 2 min/ticket |
| Understanding new/changed policy context | 8 min | 4 min | 4 min/ticket |
| Weekly training on policy changes | 1 hr/week | 0 | 1 hr/week |

**Metrics to track:**
- [Operations] Median first reply time
- [Quality] Agent accuracy
- [Operations] Median resolution time

**Hypothesis:** Officers will more quickly produce a first response if they can find policy pages more quickly.

## Experience and trust

**The AI moment:** Officer opens a ticket and the tool immediately shows the top 3 recommended policy pages based on ticket content, with an option to refine. Upon selecting a policy, a draft reply appears.

**Above the line (what the user sees):**
- Snapshot of recommended policy page with two alternatives
- Chatbox to refine context or start a new search
- Draft reply generated after policy selection

**Below the line:**
- Data: public policy pages, metadata, ticket content and metadata
- Model: LLM to parse information, RAG to retrieve policy pages
- Rules: do not interpret ambiguous situations; escalate with recommendations
- Handoffs: ambiguous cases go to officer or supervisor depending on scope

**Trust gaps and mitigations:**
| Step | Trust gap | Mitigation |
|------|-----------|------------|
| Trigger (open ticket) | Control — recommendations may need refinement | Still faster than manual search |
| AI recommendation | Hallucination — LLM may misread context | Officer reviews before selecting |
| Human check | None | Officer confirms policy and edits draft |
| Outcome | Hallucination risk in draft | All decisions logged for audit |

**Fallback when AI is unsure:** Show links to all policy page sources and put the officer back in control.

**How we measure trust:** Accept-as-is rates cross-referenced with actual user outcomes.
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

(To be completed)

## Agent role and guardrails

**Role:** The AI recommends policies and drafts replies. The officer decides and owns the response. No automated replies.

**Rules of engagement:**

| Action | Agent authority | Human checkpoint |
|--------|----------------|------------------|
| Parse enquiry and extract intent | Decides alone | None — read-only |
| Retrieve top 3 policies | Decides alone | Officer selects one |
| Generate draft reply | Decides alone | Officer reviews and edits |
| Flag high-risk policy | Decides alone | Supervisor verifies via ID |
| Send response to resident | Cannot do | Officer clicks send |
| Refuse personal data request | Decides alone (intent classification) | Officer can override or write own reply |

**Fail-safes by step:**

| Step | If agent is wrong | Why it's safe |
|------|-------------------|---------------|
| Parse enquiry | Misunderstands intent | Officer sees bad recommendations, picks manually |
| Retrieve policies | Wrong policies ranked high | Officer reviews before selecting |
| Generate draft | Draft is inaccurate | Officer must review and edit |
| Flag high-risk | Misses a high-risk policy | Same risk as today (no agent) |
| Refuse personal data | Refuses a policy question | Officer overrides; no data exposed either way |

**Guardrails (5 rules):**

1. **Match to effective date:** If the enquiry references a past event, recommend the policy version active at that time, not the current version.
2. **Surface related policies:** Show policies marked as "related" or "commonly confused with" alongside the primary match.
3. **Flag conflicts:** If two policies give contradictory guidance, alert the officer and do not auto-generate a draft.
4. **Apply risk tier:** High-risk policies (benefits denial, financial impact >$5,000, vulnerable residents) require verified supervisor ID before send is enabled.
5. **Acknowledge gaps:** If the enquiry mentions an attachment, note that the tool cannot read it and prompt manual review.

**What stays human:**
- Which policies are tagged high-risk (Policy Operations Lead)
- Whether the draft is accurate (Officer + Supervisor)
- Whether to send the response (Officer)
- Adding/removing supervisors from the verification list (HR / Team Lead)
- Whether to override a refusal (Officer)

**Refusal:** The tool classifies enquiry intent and refuses requests for personal data (e.g., CPF balances). It recommends policies only and cannot access resident records. Structural fail-safe: even if classification is wrong, no personal data systems are connected.

## Roles and operating model

**Policy Operations Lead (new role):**
- Maintains the policy changelog and relationship map
- Classifies risk tiers for new policies
- Reviews flagged conflicts quarterly
- Accountable for policy index freshness

**Officers:** Use the tool, provide feedback, own all responses sent to residents.

**Supervisors:** Review high-risk responses before they are sent.
## Strategy and roadmap

### Strategy Kernel

**Diagnosis:** Customer service officers spend too much time searching for policy information across fragmented sources, slowing first response and increasing error risk.

**Guiding Policy:** Build an AI-assisted Single Source of Truth tool that surfaces relevant policy documentation in the officer's workflow, reducing search time and improving accuracy.

**Coherent Actions:**

1. Index and consolidate policy documentation from multiple owners into a single searchable repository
2. Build a retrieval tool that recommends policy pages based on ticket content and enquiry type
3. Integrate recommendations into the officer's existing ticketing workflow (not a separate app)
## Metrics plan and stop line

**Success signals:**
- 50% of officers in MVP scope use the tool on at least 20% of their tickets within 2 weeks
- Top-3 recommendations include the correct policy at least 80% of the time

**Stop lines (kill switches):**
| Signal | Threshold | Action |
|--------|-----------|--------|
| Precision at scale | <60% at 500+ policies | Stop and rethink retrieval approach |
| Officer adoption | <3 of 5 officers complete pilot shift | Pause and investigate usability |
| Policy freshness | >20% of audited policies outdated | Pause rollout until ownership resolved |
| Prototype stability | Cannot achieve 3 stable test cycles in 4 sprints | Pause and audit architecture |

## Evals and gates

**Test questions:** 6 test cases defined in `day2-validate/context-skill.md`:
1. Effective date matching
2. Related policy detection
3. Conflict flagging
4. Risk tier escalation
5. Attachment acknowledgement
6. Refusal test (personal data lookup)

**Review triggers — re-evaluate the tool when:**
- A policy recommendation leads to an escalation or complaint
- A new policy supersedes or conflicts with existing policies
- Accuracy on "changed in last 90 days" policies falls below 90%
- More than 5% of officer feedback marks recommendations as "outdated"

## Decision: continue, pivot or stop

(To be completed after pilot)

## Open issues

(To be completed)
