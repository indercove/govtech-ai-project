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

## Permissions

One row per tool the agent uses. Each tool has a tier (read, draft, write, send) and a setting (auto, confirm, block).

**Tiers:**
- **Read** — agent looks something up; no side effects
- **Draft** — agent creates content the officer will see; does not leave the system
- **Write** — agent records something (logs, state changes); persists but internal
- **Send** — agent causes something to reach a person outside the system

**Settings:**
- **Auto** — agent does it without asking
- **Confirm** — agent proposes; officer clicks to approve
- **Block** — agent cannot do it at all

### Read tools

| Tool | Tier | Setting | Evidence |
|------|------|---------|----------|
| **Policy search** | Read | Auto | Runs 1–6: search ran without issue when input was present |
| **Input validation** | Read | Auto | Runs 4, 4b: empty input was caught before search; explicit rule added |
| **Risk tier lookup** | Read | Auto | Runs 2, 2b: high-risk tag lookup worked correctly |
| **Conflict checker** | Read | Auto | Not triggered in stress tests; read-only lookup |
| **Supervisor list lookup** | Read | Auto | Run 2b: lookup worked; invalid ID rejected |

### Draft tools

| Tool | Tier | Setting | Evidence |
|------|------|---------|----------|
| **Draft generator** | Draft | Auto | Runs 1, 2, 2b: draft shown to officer; officer edits before send |
| **Show relevance scores** | Draft | Auto | Runs 1–6: scores shown with every result; helped officer see low confidence |
| **Show low-confidence warning** | Draft | Auto | Runs 5, 6: warning displayed when scores below threshold |
| **Show escalation banner** | Draft | Auto | Runs 2, 2b: banner appeared when high-risk policy selected |

**Draft generator discretion:** The agent may add empathy sentences (e.g. "I understand this is frustrating") beyond the policy summary. The officer can remove them before sending.

### Write tools

| Tool | Tier | Setting | Evidence |
|------|------|---------|----------|
| **Log recommendation** | Write | Auto | All runs: policies_shown logged correctly |
| **Log policy selected** | Write | Auto | Runs 1, 2, 2b: selection logged |
| **Log supervisor verification** | Write | Auto | Run 2b: supervisor_id and supervisor_name logged |
| **Log refusal** | Write | Auto | Run 3: refusal_reason logged |
| **Log stop condition** | Write | Auto | Runs 4–6, 4b: stop_condition_triggered logged |
| **Log draft discarded** | Write | Auto | Officer starts draft but does not send; event logged (no content) |
| **Disable send button** | Write | Auto | Runs 2, 2b: send blocked until supervisor verified |

### Send tools

| Tool | Tier | Setting | Evidence |
|------|------|---------|----------|
| **Enable send button (standard)** | Send | Auto | Standard policies enable send after draft review; no extra confirmation |
| **Enable send button (high-risk)** | Send | Confirm | Run 2b: send enabled only after supervisor ID verified |
| **Send reply to citizen** | Send | Block | All runs: agent never sends; officer owns final action |

**Confirm sign-off flow (high-risk only):**
1. Officer enters supervisor ID
2. Agent verifies ID against supervisor list
3. Agent shows modal: "Supervisor **[name]** has reviewed this response. Confirm to enable send."
4. Officer clicks **Confirm** or **Cancel**
5. If Confirm: send button enabled; log records supervisor ID, name, and officer confirmation
6. If Cancel: send stays disabled; officer can re-enter a different supervisor ID

### Blocked actions (no tool — agent cannot do these)

| Action | Setting | Why |
|--------|---------|-----|
| Access resident personal data | Block | Run 3: agent refused CPF balance lookup |
| Bypass supervisor review | Block | Run 2b: invalid ID rejected; bypass not possible |
| Auto-select policy | Block | Runs 1–6: agent waited for officer click |
| Invent non-existent policy | Block | Run 5: agent did not pretend MOM-9999 exists |
| Guess when input is empty | Block | Runs 4, 4b: agent did not hallucinate a topic |

**No override path:** Blocked actions stay blocked even if the officer insists. The agent refuses and the officer uses manual search.

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

## Business owner questions

Questions a business owner would ask before funding this, with answers.

### 1. What does this cost to build and run?

| Item | One-time | Ongoing |
|------|----------|---------|
| Build supervisor verification feature | 2 sprints (~$40K dev cost) | — |
| Integrate supervisor list from HR system | 1 sprint (~$20K) | — |
| Policy Operations Lead (new role) | — | 0.5 FTE (~$50K/year) |
| Cloud/API costs for risk tier lookup | — | Negligible (<$500/year) |
| **Total** | **~$60K** | **~$50K/year** |

*All figures are synthetic estimates for learning purposes.*

### 2. What's the payback?

| Benefit | Estimate | How we calculated |
|---------|----------|-------------------|
| Reduced escalation time | 4 min/high-risk ticket × 200 tickets/month = 13 hrs/month | Officers currently spend ~8 min deciding whether to escalate; agent makes it instant |
| Avoided complaints from wrong high-risk responses | 1–2 complaints/year avoided = ~$10K in investigation + remediation | Based on current complaint rate for benefits-related responses |
| Audit readiness | Passes audit without manual log reconstruction | Current state: no record of who reviewed what |

**Payback period:** ~12–18 months if complaint avoidance materialises; longer if benefit is mainly audit readiness.

### 3. What's the worst that can happen?

| Scenario | Likelihood | Impact | Mitigation |
|----------|------------|--------|------------|
| Agent fails to flag a high-risk policy | Low (tag is in policy index) | High — vulnerable resident gets wrong guidance | Kill switch at 10% failure rate; weekly audit of flagging accuracy |
| Supervisor list is stale (departed supervisor still valid) | Medium | Medium — audit trail is incomplete | HR sync weekly; manual review if sync fails |
| Officers game the system (enter any supervisor ID) | Low (ID is verified) | Medium — defeats the purpose | Log all verifications; spot-check 5% weekly |
| Agent is unavailable | Low | Low — officers fall back to manual escalation | Standard policies still work; only high-risk drafts blocked |

**Worst case:** A high-risk policy is not tagged, agent does not flag it, officer sends wrong guidance to a vulnerable resident. This is the same risk as today (officer decides alone), not worse.

### 4. Who is accountable if it goes wrong?

| Role | Accountable for |
|------|-----------------|
| **Policy Operations Lead** | Correct risk tier tags; policy index freshness |
| **Officer** | Final response sent to resident |
| **Supervisor** | Accuracy of responses they verified |
| **Product team** | Agent working as designed; kill switch triggers correctly |
| **HR / Team Lead** | Supervisor list accuracy |

The agent does not shift accountability. It enforces checkpoints that already exist in policy.

### 5. What do we have to maintain forever?

| Item | Owner | Effort |
|------|-------|--------|
| Supervisor list sync with HR | IT / HR | ~2 hrs/month to monitor sync |
| Risk tier tags on new policies | Policy Operations Lead | ~1 hr per new policy |
| Agent code and infrastructure | Engineering | Included in platform maintenance |
| Monitoring dashboard | Product team | ~1 hr/week to review metrics |

**If we stop maintaining:** Supervisor list goes stale (1–2 months before noticeable); risk tags on new policies missing (immediate). Agent still works but becomes less useful.

### 6. Can we turn it off?

**Yes.** Three levels:

| Level | What it does | When to use |
|-------|--------------|-------------|
| **Disable high-risk blocking** | Agent recommends policies but does not enforce supervisor verification | If verification is slowing officers too much |
| **Disable agent entirely** | Officers search policies manually; no draft generation | If agent is causing more problems than it solves |
| **Kill switch (automatic)** | Triggers if >10% of high-risk responses bypass verification | Bug or systematic workaround detected |

Turning off returns officers to the current state. No data is lost; audit logs remain.

### 7. What's the risk to the organisation's reputation?

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| "AI is making decisions about vulnerable residents" | Medium (misperception) | Agent does not decide; it enforces a checkpoint. Human reviews and sends. |
| "Officers are being replaced" | Low | Officer count unchanged; tool saves search time, not headcount |
| "Government is using AI without oversight" | Low | Full audit trail; human-in-the-loop is mandatory |

**Key message for stakeholders:** The agent enforces existing policy (supervisor review for high-risk cases). It does not create new rules or replace human judgement.

### 8. What happens if we don't fund this?

| Current state | Risk |
|---------------|------|
| Officers decide alone whether to escalate | Inconsistent — some over-escalate (slow), some under-escalate (risky) |
| No audit trail of who reviewed high-risk responses | Audit finding; cannot prove compliance |
| Vulnerable residents may receive wrong guidance | Complaints, remediation, reputational damage |

**Cost of inaction:** Harder to quantify, but one serious complaint involving a vulnerable resident can cost more than the entire build.

---

*All data in this file is synthetic and made up for learning purposes.*
