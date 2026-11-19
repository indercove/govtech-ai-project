# AI PRD: Policy Finder Agent

All data is synthetic and made up for learning purposes.

---

## Problem and user

**User:** ServiceSG customer service officers who answer citizen enquiries across multiple agencies (CPF, HDB, Healthcare, Education, Employment).

**Problem:** Officers spend more time finding the right policy page than writing the reply. This slows first response, increases error risk, and leads to inconsistent answers.

**What the agent does:** Helps officers find the most relevant policy (top 3 matches) and draft a reply once the officer selects a policy. The officer owns every decision and the final response.

---

## Instructions

The agent follows this workflow:

1. **Receive enquiry** — Officer pastes ticket content
2. **Search policies** — Agent queries the policy index and returns top 3 matches with relevance scores
3. **Wait for selection** — Officer clicks one of the 3 recommendations
4. **Check risk tier** — Agent looks up the selected policy's risk tag
5. **Generate draft** — Agent creates a reply template based on the selected policy
6. **Enforce checkpoints** — If high-risk, require supervisor verification before enabling send
7. **Log interaction** — Record every recommendation and action for audit

The agent does not send replies. The officer clicks send.

---

## Tools

| Tool | What it does | Source |
|------|-------------|--------|
| **Policy search** | Query policy index by keywords, title, summary | `policy-index.json` |
| **Draft generator** | Create reply template from policy summary | `match.js` templates |
| **Risk tier lookup** | Check if policy requires supervisor review | Policy index `risk_tier` field |
| **Conflict checker** | Flag when two policies contradict | Policy index `related_policies` field |
| **Supervisor list lookup** | Verify supervisor ID is valid | HR system (to be integrated) |

**Not available to the agent:**
- Resident personal data (CPF balances, addresses, NRIC, case history)
- Internal staff systems
- Real government databases
- Attachment contents (images, documents)

---

## Context and memory

**What the agent knows:**
- Policy index (title, category, keywords, summary, URL, risk tier)
- The citizen's enquiry text (pasted by officer)
- Supervisor list (for verification)

**What the agent does not know:**
- Anything about the citizen beyond the enquiry text
- Previous interactions with the same citizen
- Full policy content (only summaries)
- Attachment contents

**What the agent checks every time:**
1. Does the enquiry mention a past date? → Match to policy version active at that time
2. Does the enquiry mention an attachment? → Note it cannot be read
3. Is the matched policy high-risk? → Require supervisor review

---

## Permissions

### Read actions

| Action | Tier | Setting | Notes |
|--------|------|---------|-------|
| Query policy index | Read | **Auto** | Read-only lookup |
| Look up risk tier tag | Read | **Auto** | Read-only lookup |
| Look up supervisor list | Read | **Auto** | Verify ID only |
| Read enquiry text | Read | **Auto** | Officer pasted it |

### Draft actions

| Action | Tier | Setting | Notes |
|--------|------|---------|-------|
| Generate draft reply | Draft | **Auto** | Officer must review before send |
| Show relevance scores | Draft | **Auto** | Information only |
| Show related policies | Draft | **Auto** | Information only |
| Show escalation banner | Draft | **Auto** | Information only |

### Write actions

| Action | Tier | Setting | Notes |
|--------|------|---------|-------|
| Log recommendation | Write | **Auto** | Audit trail |
| Log policy selected | Write | **Auto** | Audit trail |
| Log supervisor verification | Write | **Auto** | Audit trail |
| Log bypass attempt | Write | **Auto** | Security audit |
| Disable send button (high-risk) | Write | **Auto** | Blocks until checkpoint |

### Send actions

| Action | Tier | Setting | Notes |
|--------|------|---------|-------|
| Enable send button | Send | **Confirm** | Only after officer confirms supervisor reviewed |
| Send reply to citizen | Send | **Block** | Agent never sends; officer clicks send |

### Refused actions

| Action | Tier | Setting | Notes |
|--------|------|---------|-------|
| Access resident personal data | — | **Block** | Agent cannot access |
| Bypass supervisor review | — | **Block** | Logged and denied |
| Auto-select policy | — | **Block** | Officer must choose |
| Send without officer confirmation | — | **Block** | Officer owns response |

---

## Human checkpoints

| Checkpoint | Who | What they do | Agent cannot proceed without |
|------------|-----|--------------|------------------------------|
| **Policy selection** | Officer | Clicks one of top 3 recommendations | Officer click |
| **Draft review** | Officer | Reads, edits, or discards draft | Officer action |
| **Supervisor verification** | Officer + Supervisor | Supervisor reviews draft; officer enters supervisor ID | Valid supervisor ID |
| **Conflict resolution** | Officer | Chooses which policy to follow when two conflict | Officer choice |
| **Final send** | Officer | Clicks send button | Officer click |

---

## Stop conditions

| Condition | What the agent does | What the officer sees |
|-----------|--------------------|-----------------------|
| No match above 20% | Show results anyway; note low confidence | "Low confidence. Consider manual search." |
| Two policies conflict | Do not draft; show both policies | "These policies may conflict. Please choose one." |
| High-risk policy selected | Disable send; require supervisor ID | "⚠️ Supervisor review required." |
| Personal data requested | Refuse; explain limitation | "I cannot access resident records." |
| Precision below 60% | Display kill switch warning | "⚠️ Matching accuracy is below threshold. Use manual search." |
| Enquiry mentions attachment | Note limitation | "📎 Attachment detected. I cannot read it. Please review manually." |
| Supervisor ID invalid | Reject; keep send disabled | "Supervisor ID not recognised." |
| Supervisor list unavailable | Block high-risk sends | "Cannot verify supervisor. High-risk responses blocked." |

**Kill switch:** If >10% of high-risk responses bypass verification in a week, disable high-risk draft generation and alert product team.

---

## Logs

Record for every interaction:

| Field | Example | Contains PII? |
|-------|---------|---------------|
| `timestamp` | `2026-11-19T14:32:00+08:00` | No |
| `officer_id` | `officer_12345` | No (synthetic) |
| `enquiry_hash` | SHA256 hash | No (hashed) |
| `policies_shown` | `["cpf-001", "cpf-002", "hdb-015"]` | No |
| `relevance_scores` | `[0.72, 0.65, 0.41]` | No |
| `policy_selected` | `cpf-001` | No |
| `draft_generated` | `true` | No |
| `draft_edited` | `true` | No |
| `high_risk_flagged` | `false` | No |
| `conflict_flagged` | `false` | No |
| `supervisor_id` | `supervisor_789` | No (synthetic) |
| `supervisor_verified` | `true` | No |
| `bypass_attempted` | `false` | No |

**Never logged:** Full enquiry text, citizen name, NRIC, address, or any personal data.

---

## Business rules

| Rule | Source | Consequence if violated |
|------|--------|------------------------|
| Top 3 results only | Officer feedback ("more choices slow us down") | Do not show 4+ results |
| Officer must click to use policy | Accountability requirement | No auto-population |
| Kill switch at <60% precision | Leadership agreement | Tool does more harm than good below this |
| Show relevance score | Transparency for trust | Officer can judge low-confidence matches |
| High-risk requires supervisor | Policy for vulnerable residents | Benefits denial, >$5K impact, vulnerable resident |
| Policy Operations Lead owns freshness | Handoff note | Do not ship without this role assigned |

---

## What engineering decides

These are implementation choices. Engineering can decide without asking product:

| Decision | Guidance |
|----------|----------|
| Scoring algorithm weights | Current: 30/15/10/5. Tune based on test results. |
| Cache duration for policy index | Balance freshness vs performance |
| Retry logic for supervisor list lookup | Standard error handling |
| Hash algorithm for enquiry | SHA256 or equivalent |
| Log storage format and retention | Follow org standards |
| UI framework | React recommended in living PRD |
| API structure | FastAPI recommended in living PRD |

---

## Open decisions

These need your input before engineering proceeds:

| Decision | Options | Your choice |
|----------|---------|-------------|
| **1. How long before precision warning?** | (a) Warn immediately at <60% (b) Warn after 3 consecutive low matches (c) Warn only on scale test | _____ |
| **2. Can officer override low-confidence match?** | (a) Yes, with extra confirmation (b) No, must use manual search (c) Yes, no extra step | _____ |
| **3. What happens if supervisor rejects?** | (a) Officer edits and resubmits (b) Draft is discarded (c) Escalate to supervisor's manager | _____ |
| **4. How often to sync supervisor list?** | (a) Real-time (b) Daily (c) Weekly | _____ |
| **5. Should agent explain why a policy matched?** | (a) Yes, show matched keywords (b) No, just show score (c) Optional toggle | _____ |
| **6. Conflict detection scope?** | (a) Only between top 3 results (b) Top 3 vs all related policies (c) Not in MVP | _____ |
| **7. Template vs LLM for draft generation?** | (a) Templates only (current) (b) LLM with template fallback (c) LLM only | _____ |
| **8. Attachment handling?** | (a) Show warning only (b) Block draft until officer confirms review (c) Allow draft with disclaimer | _____ |

---

*Last updated: 2026-11-19*
*Source: `day2-validate/living-prd.md`, `day2-validate/handoff-note.md`, `day3-build/CLAUDE.md`, `day3-build/agent-control-panel.md`*
