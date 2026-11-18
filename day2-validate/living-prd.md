# Living PRD: Policy Finder Prototype

Extracted from the working prototype in `day2-validate/prototype/`.

All data is synthetic and made up for learning purposes.

---

## 1. Product Overview

**What it is:** A browser-based tool that helps ServiceSG customer service officers find relevant policy pages and generate draft replies to citizen enquiries.

**Core workflow (3 steps):**
1. **Customer Enquiry** — Officer pastes ticket content into a text area
2. **Recommended Policies** — Tool shows top 3 matching policies with relevance scores
3. **Draft Reply** — Officer clicks a policy to generate a template reply

**Current state:** Working HTML/JS prototype with 50 synthetic policies (expandable to 250 for scale testing).

---

## 2. Problem and Riskiest Assumption

**Problem:** Officers spend more time finding the right policy page than writing the reply. This slows first response, increases error risk, and leads to inconsistent answers.

**Riskiest assumption:** The 50→2000 policy gap is unproven — keyword matching works with our 50 synthetic policies, but we have no evidence it will work at real-world scale (2000+ policy documents across multiple agencies).

| Field | Value |
|-------|-------|
| **Risk type** | Technical feasibility |
| **Why it matters** | If retrieval quality drops at scale (irrelevant results, missed matches), officers will lose trust and stop using the tool. |
| **Kill switch** | If precision drops below 60% when tested against 500+ policies, stop and rethink the retrieval approach. |
| **Success signal** | Top-3 recommendations include the correct policy at least 80% of the time, even with 500+ policies. |

---

## 3. User Flow and Screen Map

**Entry points:**
- **Inbox view** — List of 8 synthetic tickets sorted by date, with category badges (CPF, HDB, Healthcare, Education, Employment, Unknown)
- **Policy Finder view** — Direct access to the 3-column workflow

**Screen map:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚠️ Prototype only. Synthetic data.    [ ] Scale Test (50 policies) │
├─────────────────────────────────────────────────────────────────────┤
│  [📥 Inbox]  [🔍 Policy Finder]                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  INBOX VIEW:                        POLICY FINDER VIEW:             │
│  ┌─────────────┐                    ┌───────┬───────┬───────┐       │
│  │ Ticket list │                    │   1   │   2   │   3   │       │
│  │ (8 tickets) │        or          │Enquiry│Policies│Draft │       │
│  │ Click to    │                    │       │  (3)  │ Reply │       │
│  │ open finder │                    └───────┴───────┴───────┘       │
│  └─────────────┘                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Click ticket → Loads content into Policy Finder, switches to that view
- Type/paste enquiry → Click "Find Policies →" → See top 3 matches
- Click policy card → Generates draft reply with template
- "Regenerate" button → Picks alternate template for same policy
- "Copy to Clipboard" → Copies draft text
- Scale Test toggle → Switches between 50 and 250 policy datasets

---

## 4. Success Metrics

| Metric | Target | How measured |
|--------|--------|--------------|
| **Top-3 precision** | ≥80% | Correct policy in top 3 results for test queries |
| **Scale test precision** | ≥60% (kill switch) | Same measure at 250+ policies |
| **Officer adoption** | 50% use on 20%+ of tickets | Pilot tracking |
| **First response time** | Reduced by 2 min/ticket | Before/after comparison |

**Current prototype results:**
- 5 test queries defined (CPF housing, HDB single, MediShield claim, SkillsFuture, work pass)
- 100% precision at 50 policies
- 100% precision at 250 policies (scale test)

---

## 5. Technical Reality

**What is actually built:**

| Component | Implementation | File |
|-----------|----------------|------|
| **UI** | Static HTML with external CSS | `prototype.html`, `styles.css` |
| **Matching algorithm** | Keyword-based scoring | `match.js` |
| **Policy data** | JSON files with synthetic policies | `policy-index.json`, `policy-index-scale.json` |
| **Reply generation** | Template substitution (no LLM) | `match.js` → `generateReplyDraft()` |

**Matching algorithm details (`match.js`):**
- Tokenizes query and policy fields (lowercase, remove punctuation)
- Scoring weights:
  - Direct keyword match: +30 points
  - Partial keyword match: +15 points
  - Title token match: +10 points
  - Summary token match: +5 points
- Normalizes to percentage, caps at 100%
- Returns top 3 results with score > 0

**Data structure (per policy):**
```json
{
  "id": "cpf-001",
  "title": "CPF Ordinary Account Withdrawal for Housing",
  "category": "CPF",
  "keywords": ["cpf", "oa", "housing", "downpayment"],
  "summary": "Rules for using CPF OA savings...",
  "url": "https://example.gov.sg/..."
}
```

**Not built (would need for production):**
- Semantic search / embeddings
- LLM-based reply generation
- Backend API
- User authentication
- Audit logging
- Policy version tracking
- Attachment handling

---

## 6. Assumptions and Risks

**Validated assumptions:**
- [x] Officers can paste ticket text (UI works)
- [x] Keyword matching finds relevant policies at small scale (100% precision at 50)
- [x] Keyword matching holds at 5x scale (100% precision at 250)

**Unvalidated assumptions:**
- [ ] Keyword matching works at 2000+ policies (real-world scale)
- [ ] Officers will trust and adopt the tool
- [ ] Template-based replies are acceptable quality
- [ ] Policy keywords are comprehensive enough
- [ ] Response time is acceptable under load

**Active risks:**

| Risk | Mitigation in prototype | Production mitigation |
|------|------------------------|----------------------|
| Wrong policy recommended | Shows relevance score, officer must click to use | Add confidence thresholds, show "low confidence" warning |
| Stale policy data | N/A (synthetic) | Policy Operations Lead role, freshness audits |
| Attachment handling | Shows "📎 Has attachment" badge | Acknowledge limitation, prompt manual review |
| Ambiguous queries | Returns best matches by keyword | Add "refine search" or escalation flow |

---

## 7. In and Out of Scope

**In scope (prototype):**
- [x] Text-based enquiry input
- [x] Top 3 policy recommendations with scores
- [x] Draft reply generation from templates
- [x] Scale testing with 250 policies
- [x] Kill switch warning at <60% precision
- [x] Inbox view with sample tickets
- [x] Copy to clipboard

**Out of scope (prototype):**
- [ ] Image/attachment reading
- [ ] Policy version history
- [ ] Multi-turn conversation
- [ ] Backend persistence
- [ ] User accounts/roles
- [ ] Supervisor escalation workflow
- [ ] High-risk policy flagging
- [ ] Conflict detection between policies
- [ ] Integration with ticketing system

**Deferred to production:**
- Semantic search (embeddings, vector DB)
- LLM-based reply generation
- Real policy data ingestion
- Audit trail
- Access control

---

## 8. Engineering Recommendation

**What works:**
- Keyword matching is surprisingly effective for structured queries ("CPF housing withdrawal", "HDB single 35")
- 3-column layout keeps full workflow visible
- Scale test validates approach up to 250 policies

**What to watch:**
- Keyword matching may degrade with vague or multi-topic queries
- Current scoring weights are arbitrary (30/15/10/5) — may need tuning
- No handling for synonyms or misspellings

**Next steps before production:**
1. **Test at real scale** — Index 500+ real (or realistic synthetic) policies
2. **Add semantic search** — Embeddings will handle synonyms and vague queries better
3. **Evaluate LLM reply generation** — Templates are limited; LLM can personalize
4. **Build backend** — Move from JSON files to searchable API
5. **Define policy schema** — Add fields: effective_date, related_policies, risk_tier, supersedes

**Recommended architecture:**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │───▶│   API       │───▶│  Vector DB  │
│   (React)   │    │   (FastAPI) │    │  (Postgres  │
│             │◀───│             │◀───│   + pgvector│
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   LLM API   │
                   │  (Claude)   │
                   └─────────────┘
```

**Effort estimate:**
- MVP backend + semantic search: 2-3 sprints
- LLM reply generation: 1 sprint
- Policy ingestion pipeline: 2 sprints
- Production hardening: 2 sprints

---

*Last updated: 2026-11-18*
*Source: `day2-validate/prototype/`*
