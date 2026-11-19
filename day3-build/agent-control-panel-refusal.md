# Agent Control Panel: Personal Data Refusal

This document describes how the Policy Finder agent handles requests for personal data — CPF balances, NRIC lookups, case history, or any resident-specific information.

All data is synthetic and made up for learning purposes.

---

## What the agent is doing

The agent classifies every enquiry before searching for policies. If the enquiry is asking for personal data (not policy information), the agent refuses and offers alternatives.

**Trigger:** Officer pastes an enquiry into the tool.

**Action:** Agent classifies the enquiry intent before any policy search.

**Intent categories:**
| Category | What it means | Example |
|----------|---------------|---------|
| `policy_question` | Asking about rules, eligibility, process | "What is the CPF withdrawal limit?" |
| `personal_data_request` | Asking for their specific data | "Can you check how much CPF I have?" |
| `ambiguous` | Could be either; needs clarification | "What's my situation with housing grants?" |

**What the agent does for personal data requests:**
1. Classifies enquiry as `personal_data_request`
2. Does not search policy index
3. Does not generate a draft reply
4. Displays refusal message explaining why
5. Offers self-service alternatives (website, hotline, service centre)
6. Logs the refusal with reason
7. Returns control to officer (they can write their own reply)

**Why this is agent-like, not workflow-like:**

| Aspect | Workflow approach | Agent approach (what we use) |
|--------|-------------------|------------------------------|
| Detection method | Keyword matching ("check my balance", "my NRIC") | Intent classification from free text |
| Handles variations | Only phrases in the keyword list | Generalises to new phrasings |
| Handles ambiguity | Cannot — matches or doesn't | Can flag as ambiguous, ask officer |
| False positives | "What is the CPF limit?" triggers on "CPF" | Distinguishes policy question from data request |

---

## Opportunity portfolio

The personal data refusal agent addresses three opportunities:

| Opportunity | Current state | With agent | Evidence |
|-------------|---------------|------------|----------|
| **Prevent privacy breach** | Officer might try to look up data in another system | Agent reminds officer this tool cannot access personal data | One-pager: "Tool must refuse requests to look up personal data" |
| **Faster redirect** | Officer types explanation from scratch | Agent provides ready-to-use redirect message | Saves 2–3 min per misdirected enquiry |
| **Reduce resident frustration** | Resident waits for reply that just says "we can't help" | Immediate, helpful redirect with self-service options | Better experience even when answer is no |

**What we are not trying to do:**
- Access personal data systems (we have no connection to them)
- Decide whether the resident should get their data (that's their right via self-service)
- Block officers from helping (they can still write their own reply)

---

## Rules of engagement

### Decides alone (no human input needed)

| Action | Why it's safe |
|--------|---------------|
| Classify enquiry intent | Read-only; does not send anything |
| Refuse to search policies for personal data requests | Blocks action; officer can override by writing own reply |
| Display refusal message | Information only; officer can ignore it |
| Log the refusal | Audit trail; does not affect resident |

### Proposes and waits (human must respond)

| Action | What the agent proposes | What the human does |
|--------|------------------------|---------------------|
| Show refusal message | "I cannot look up your CPF balance. Here are self-service options..." | Officer copies it, edits it, or writes their own |
| Flag ambiguous enquiry | "This might be asking for personal data. Please clarify." | Officer decides whether to proceed with policy search |

### A person reviews (agent cannot proceed without approval)

| Checkpoint | Who reviews | What they check | What happens if they reject |
|------------|-------------|-----------------|----------------------------|
| **Use refusal message** | Officer | Message is appropriate for this enquiry | Officer writes their own reply instead |
| **Override refusal** | Officer | Enquiry is actually a policy question, not personal data | Officer clicks "Search policies anyway" |

**The agent never:**
- Sends a response without officer action
- Accesses any personal data system (no connection exists)
- Prevents officer from writing their own reply
- Hallucinates personal data it doesn't have

---

## Stop conditions

The agent stops and refuses when:

| Condition | What the agent does | What the officer sees |
|-----------|--------------------|-----------------------|
| **Enquiry asks for personal data** | Do not search policies; show refusal | "I cannot look up [CPF balance / NRIC details / case history]. This tool recommends policies only. Self-service options: [list]" |
| **Enquiry is ambiguous** | Pause and ask officer | "This enquiry might be asking for personal data. Is the resident asking about [their specific data] or [general policy]?" |
| **Enquiry mentions NRIC + request verb** | Strong signal for personal data request | Same refusal message |
| **Officer tries to override incorrectly** | Allow override but log it | "You chose to search policies anyway. If this was a personal data request, please use the refusal message." |

**No kill switch needed:** Even if classification fails completely, the tool cannot expose personal data because it has no access to those systems. The worst case is wasted time, not a breach.

---

## What stays human

These decisions are never made by the agent:

| Decision | Who makes it | Why |
|----------|--------------|-----|
| **Whether to use the refusal message** | Officer | Officer may have better context or prefer different wording |
| **Whether to override a refusal** | Officer | Agent might misclassify; officer can correct |
| **What to say to the resident** | Officer | Agent suggests; officer owns the response |
| **Whether the resident needs escalation** | Officer | Some personal data requests indicate a vulnerable resident who needs help navigating self-service |

**The fail-safe is structural:** The agent has no connection to personal data systems. Even if every classification is wrong, no personal data is exposed.

---

## Monitoring

Track these metrics weekly:

| Metric | Target | Action if missed |
|--------|--------|------------------|
| % of personal data requests correctly classified | >90% | Review misclassified examples; retrain or add patterns |
| % of policy questions incorrectly refused | <5% | Review false positives; adjust classification threshold |
| % of officers who override refusal | <10% | If high, check if classification is too aggressive |
| Officer feedback: "refusal message was helpful" | >80% | Improve message wording or self-service links |

---

## Business owner questions

### 1. What does this cost to build and run?

| Item | One-time | Ongoing |
|------|----------|---------|
| Build intent classifier | 1 sprint (~$20K dev cost) | — |
| Curate training examples (500 enquiries labelled) | 2 weeks (~$5K) | — |
| Maintain classifier as new phrasings emerge | — | ~$5K/year (periodic retraining) |
| **Total** | **~$25K** | **~$5K/year** |

*All figures are synthetic estimates for learning purposes.*

### 2. What's the payback?

| Benefit | Estimate | How we calculated |
|---------|----------|-------------------|
| Time saved on misdirected enquiries | 2 min × 50 enquiries/month = 1.5 hrs/month | Officers currently type redirect from scratch |
| Avoided "why can't you help me" complaints | Minor | Better UX when answer is no |
| Prevented privacy incidents | Priceless if it ever matters | Tool cannot access data, but clear refusal sets expectation |

**Payback period:** This is a low-cost, low-risk feature. Payback is <6 months on time savings alone.

### 3. What's the worst that can happen?

| Scenario | Likelihood | Impact | Mitigation |
|----------|------------|--------|------------|
| Agent misses a personal data request | Medium | **None** — tool has no access to personal data systems | Structural fail-safe; no data to expose |
| Agent refuses a valid policy question | Medium | Low — officer overrides and searches anyway | Override button; log for review |
| Resident is frustrated by refusal | Low | Low — message includes helpful alternatives | Good UX in refusal message |
| Agent hallucinates personal data | Very low | Medium — officer sees nonsense, doesn't send | No plausible source for hallucination; easy to spot |

**Worst case:** Agent misclassifies everything. Officers override or write their own replies. Tool is annoying but not dangerous.

### 4. Who is accountable if it goes wrong?

| Role | Accountable for |
|------|-----------------|
| **Product team** | Classifier accuracy; refusal message quality |
| **Officer** | Final response sent to resident |
| **IT / Security** | Ensuring tool has no connection to personal data systems (the structural fail-safe) |

### 5. What do we have to maintain forever?

| Item | Owner | Effort |
|------|-------|--------|
| Classifier model | Product / ML team | Retrain quarterly with new examples |
| Refusal message and self-service links | Product team | Update when self-service options change |
| Override logging | Engineering | Included in platform maintenance |

**If we stop maintaining:** Classifier gets stale; more false positives/negatives. Tool still works; just less accurate.

### 6. Can we turn it off?

**Yes.** Two levels:

| Level | What it does | When to use |
|-------|--------------|-------------|
| **Disable classification** | Skip intent check; go straight to policy search | If classifier causes too many false positives |
| **Disable refusal message** | Classify but don't show message; just log | If officers find message unhelpful |

Turning off does not expose personal data (structural fail-safe remains).

### 7. What's the risk to the organisation's reputation?

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| "AI is blocking residents from getting help" | Low | Agent doesn't block; it redirects to self-service |
| "AI refused my legitimate question" | Medium | Officer can override; message is polite |
| "AI is making decisions about my data" | Low | Agent has no access to data; this is clear in the message |

### 8. What happens if we don't fund this?

| Current state | Risk |
|---------------|------|
| Officers type redirect message from scratch | Slower; inconsistent wording |
| No clear signal when enquiry is misdirected | Officer might waste time searching policies |
| Residents don't get immediate self-service options | Worse experience |

**Cost of inaction:** Low. This is a convenience feature, not a safety-critical one. The structural fail-safe (no data access) already protects against privacy breach.

---

## Comparison to Step 4 (high-risk escalation)

| Aspect | Step 4 (high-risk) | Step 5 (refusal) |
|--------|-------------------|------------------|
| Type | Workflow (tag lookup) | Agent (intent classification) |
| Input | Structured (policy ID) | Unstructured (free text) |
| Fail-safe | Kill switch + audit | Structural (no data access) |
| Risk if wrong | Vulnerable resident gets bad advice | Wasted time, annoyed officer |
| Judgement required | None | Yes — classify intent |
| Cost to build | ~$60K | ~$25K |
| Maintenance | Supervisor list sync | Classifier retraining |

**Step 5 is lower risk and lower cost than Step 4, but requires more AI capability (intent classification vs. tag lookup).**

---

*All data in this file is synthetic and made up for learning purposes.*
