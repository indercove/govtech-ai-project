# Agent Control Panel: High-Risk Escalation

This document describes how the Policy Finder agent handles high-risk enquiries — those involving benefits denial, financial impact over $5,000, or vulnerable residents.

All data is synthetic and made up for learning purposes.

---

## What the agent is doing

The agent screens every policy recommendation for risk tier before allowing the officer to send a reply.

**Trigger:** Officer selects a policy from the top 3 recommendations.

**Action:** Agent checks the selected policy's risk tier tag in the policy index.

**Risk tier tags:**
| Tag | Meaning | Example |
|-----|---------|---------|
| `standard` | Normal response flow | CPF withdrawal limits |
| `high-risk` | Requires supervisor review | ComCare appeal, HDB repossession, MediShield denial |

**What the agent does for high-risk:**
1. Generates the draft reply (officer can see it)
2. Disables the send button
3. Displays escalation banner: "Supervisor review required"
4. Prompts officer to enter supervisor ID
5. Verifies supervisor ID against the supervisor list
6. Logs supervisor ID and name
7. Enables send only after verification

---

## Opportunity portfolio

The high-risk escalation agent addresses three opportunities:

| Opportunity | Current state | With agent | Evidence |
|-------------|---------------|------------|----------|
| **Protect vulnerable residents** | Officer decides alone whether to escalate | Agent enforces escalation for tagged policies | One-pager risk: "High-risk policies require supervisor review before sending" |
| **Create audit trail** | No record of who reviewed high-risk responses | Log records supervisor ID, name, timestamp | Handoff note: "Every recommendation and action must be recorded" |
| **Reduce officer anxiety** | Officers unsure when to escalate; some over-escalate, some under-escalate | Clear rule: if policy is tagged high-risk, escalate | User quote: "I wish a tool can just recommend where to look" (applies to escalation too) |

**What we are not trying to do:**
- Replace supervisor judgement (supervisor still reviews the content)
- Auto-approve any high-risk response
- Change who is accountable (officer owns the response)

---

## Rules of engagement

### Decides alone (no human input needed)

| Action | Why it's safe |
|--------|---------------|
| Look up risk tier tag for selected policy | Read-only; does not change anything |
| Disable send button when high-risk | Blocks action; officer can still cancel or edit |
| Display escalation banner | Information only |
| Reject invalid supervisor ID | Blocks action; officer can retry with valid ID |

### Proposes and waits (human must respond)

| Action | What the agent proposes | What the human does |
|--------|------------------------|---------------------|
| Prompt for supervisor ID | "Enter supervisor ID who reviewed this response:" | Officer types supervisor ID |
| Show draft reply | Draft text with disclaimer | Officer reviews, edits, or discards |

### A person reviews (agent cannot proceed without approval)

| Checkpoint | Who reviews | What they check | What happens if they reject |
|------------|-------------|-----------------|----------------------------|
| **Supervisor verification** | Officer + Supervisor | Supervisor reads draft and confirms it is accurate and appropriate | Officer does not enter supervisor ID; send stays disabled |
| **Final send** | Officer | Draft is correct and supervisor has reviewed | Officer clicks send (or discards) |

**The agent never:**
- Sends a response without officer clicking send
- Accepts a supervisor ID without verifying it
- Removes the high-risk tag from a policy
- Overrides a supervisor's rejection

---

## Stop conditions

The agent stops and alerts when:

| Condition | What the agent does | What the officer sees |
|-----------|--------------------|-----------------------|
| **Policy is tagged high-risk** | Disable send; require supervisor ID | "⚠️ Supervisor review required. This response involves [benefits denial / financial impact / vulnerable resident]." |
| **Supervisor ID not in list** | Reject ID; keep send disabled | "Supervisor ID not recognised. Please enter a valid supervisor ID." |
| **Supervisor list unavailable** | Block all high-risk sends; allow standard policies | "Cannot verify supervisor. High-risk responses are blocked until supervisor list is restored." |
| **Officer tries to bypass** | Log attempt; keep send disabled | "Supervisor verification is required for this policy. This requirement cannot be skipped." |

**Kill switch:** If more than 10% of high-risk responses are sent without valid supervisor ID in a week (due to bug or workaround), disable high-risk draft generation entirely and alert the product team.

---

## What stays human

These decisions are never made by the agent:

| Decision | Who makes it | Why |
|----------|--------------|-----|
| **Which policies are high-risk** | Policy Operations Lead | Risk classification requires policy expertise and judgement calls |
| **Whether the draft is accurate** | Officer + Supervisor | Agent drafts from summaries; humans verify against full policy |
| **Whether to send the response** | Officer | Officer owns the response and is accountable |
| **Whether to override a rejection** | Supervisor's manager | Escalation path for disputed cases; not in agent scope |
| **Adding/removing supervisors from list** | HR / Team Lead | Agent verifies against list but does not manage it |

**The human-in-the-loop is not optional.** The agent enforces checkpoints but cannot replace the judgement that happens at those checkpoints.

---

## Monitoring

Track these metrics weekly:

| Metric | Target | Action if missed |
|--------|--------|------------------|
| % of high-risk policies correctly flagged | 100% | Audit policy index; fix missing tags |
| % of high-risk sends with valid supervisor ID | 100% | Investigate; check for workarounds |
| Median time from draft to supervisor verification | <5 min | Check if supervisors are available; adjust staffing |
| % of supervisor IDs rejected (invalid) | <5% | Train officers; check supervisor list freshness |

---

*All data in this file is synthetic and made up for learning purposes.*
