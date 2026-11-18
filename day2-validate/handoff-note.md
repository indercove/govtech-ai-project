# Handoff Note: Policy Finder Prototype

**Date:** 2026-11-18  
**From:** Product team  
**To:** Engineering team

All data in the prototype is synthetic and made up for learning purposes.

---

## What It Does

A browser-based tool that helps ServiceSG customer service officers:

1. **Paste a customer enquiry** into a text box
2. **See top 3 matching policies** ranked by relevance score
3. **Generate a draft reply** by clicking a policy card

The prototype also includes:
- An inbox view with 8 sample tickets
- Scale testing toggle (50 vs 250 policies)
- Kill switch warning if precision drops below 60%

---

## What Is Synthetic

| Item | Why it's synthetic |
|------|-------------------|
| **50 policies** in `policy-index.json` | Made up for learning; real policies would come from agency sources |
| **250 policies** in `policy-index-scale.json` | Same; used for scale testing |
| **8 tickets** in the inbox | Invented scenarios, not real citizen enquiries |
| **Reply templates** in `match.js` | Placeholder text, not approved agency language |
| **Scoring weights** (30/15/10/5) | Arbitrary; not tuned against real query logs |
| **URLs** in policy data | Point to `example.gov.sg`, not live pages |

---

## What Is Missing for Production

### Must have before pilot

| Gap | Why it matters |
|-----|---------------|
| **Backend API** | Cannot serve 2000+ policies from a JSON file in browser |
| **Semantic search** | Keyword matching won't handle synonyms, misspellings, or vague queries |
| **Real policy data pipeline** | Need to ingest and keep current with agency sources |
| **User authentication** | Officers must log in; audit trail requires identity |
| **Audit logging** | Every recommendation and action must be recorded |

### Should have before rollout

| Gap | Why it matters |
|-----|---------------|
| **LLM reply generation** | Templates are limited; LLM can personalize and cite |
| **Policy version tracking** | Enquiries may reference past policies |
| **High-risk policy flagging** | Some responses need supervisor review |
| **Attachment handling** | ~20% of enquiries include an image or document |
| **Conflict detection** | Alert officers when two policies contradict |

### Nice to have

| Gap | Why it matters |
|-----|---------------|
| **Multi-turn refinement** | Officer may want to narrow or expand search |
| **Related policy suggestions** | Show commonly confused policies together |
| **Feedback loop** | Officers mark correct/incorrect to improve matching |

---

## Decisions an Engineer Must Not Change Without Asking

These choices were made deliberately. If you want to change them, check with the product team first.

| Decision | Reason |
|----------|--------|
| **Top 3 results, not more** | Officers said more choices slow them down; 3 is enough if matching is good |
| **Officer must click to use a policy** | No auto-population; keeps officer accountable for the response |
| **Kill switch at <60% precision** | Agreed with leadership; below this, the tool does more harm than good |
| **Show relevance score to officer** | Transparency builds trust; officer can judge low-confidence matches |
| **3-column layout (enquiry → policies → draft)** | Tested with officers; full workflow visible without scrolling |
| **No LLM in prototype** | Intentional; we want to validate retrieval before adding generation complexity |
| **Policy Operations Lead role** | Someone must own policy freshness; don't ship without this |

---

## Handoff Decision

**Decision:** Keep prototyping — do not move to a production spec yet.

### Why

1. **The riskiest assumption is still untested.** The prototype works at 250 policies, but real scale is 2000+. We have not validated that keyword matching (or any retrieval method) maintains ≥60% precision at that scale.

2. **No user validation yet.** Officers have not used the prototype on real tickets. We do not know if the workflow fits their habits or if they will trust the recommendations.

3. **Template replies may not be acceptable.** We have not tested whether officers find the draft quality good enough to use, or whether supervisors approve of the language.

### Next steps before production spec

1. **Index 500+ realistic policies** and re-run the scale test. If precision drops below 60%, stop and evaluate semantic search.

2. **Run a 1-day pilot** with 3–5 officers using the prototype on real tickets (with synthetic policies). Measure: adoption rate, time to first reply, and qualitative feedback.

3. **Test template acceptability** with supervisors. Get sign-off that the draft language is safe to send.

If all three pass, proceed to production spec. If any fail, iterate on the prototype or reconsider the approach.

---

*Source: `day2-validate/prototype/` and `day2-validate/living-prd.md`*
