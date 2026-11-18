# Handoff Note: Policy Finder Prototype

**Date:** 2026-11-18  
**From:** Product team  
**To:** Engineering team

All data in the prototype is synthetic and made up for learning purposes.

---

## How to Run It

1. Open a terminal in this repository
2. Start a local server:
   ```bash
   cd day2-validate/prototype
   python3 -m http.server 8080
   ```
3. Open http://localhost:8080/prototype.html in your browser

**Important:** Opening the HTML file directly (double-click) will not work. The browser blocks JSON fetches from `file://` URLs due to CORS restrictions. You must use a local server.

---

## File Inventory

| File | What it does |
|------|-------------|
| `prototype.html` | Main UI — inbox view, policy finder, draft reply |
| `styles.css` | All CSS styling (extracted from HTML) |
| `match.js` | Matching algorithm + reply template generation |
| `policy-index.json` | 50 synthetic policies for normal testing |
| `policy-index-scale.json` | 250 synthetic policies for scale testing |
| `README.md` | Brief description of the prototype |

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

## How the Matching Algorithm Works

Located in `match.js`, the `calculateScore()` function:

1. **Tokenizes the query** — lowercase, remove punctuation, split on whitespace, drop 1-char words
2. **Scores each policy** against the query tokens:
   - Direct keyword match: **+30 points**
   - Partial keyword match (substring): **+15 points**
   - Title word match: **+10 points**
   - Summary word match: **+5 points**
3. **Normalizes** the score to a percentage: `score / queryTokens.length * 2`, capped at 100%
4. **Returns top 3** policies with score > 0

**Example:** Query "CPF housing withdrawal" (3 tokens) against a policy with keywords `["cpf", "housing", "downpayment"]`:
- "cpf" matches keyword → +30
- "housing" matches keyword → +30
- "withdrawal" matches title → +10
- Total: 70 / 3 * 2 = 47% → displayed as "Relevance score: 47%"

---

## How to Run the Scale Test

1. Start the prototype (see "How to Run It")
2. Check the **Scale Test** checkbox in the top bar
3. The toggle changes from "50 policies" to "250 policies"
4. Click **Run Test** to test 5 predefined queries
5. Results show pass/fail and precision percentage

**Interpreting results:**
- ≥80% precision → Good; retrieval is working
- 60–79% precision → Acceptable; monitor closely
- <60% precision → **Kill switch triggers**; red warning banner appears

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

## How to Add a New Policy

Add an entry to `policy-index.json` (or `policy-index-scale.json` for scale testing):

```json
{
  "id": "agency-nnn",
  "title": "Human-readable policy title",
  "category": "CPF | HDB | Healthcare | Education | Employment",
  "keywords": ["keyword1", "keyword2", "phrase as single string"],
  "summary": "One sentence describing what this policy covers.",
  "url": "https://example.gov.sg/path/to/policy"
}
```

**Tips:**
- `id` must be unique across the file
- `keywords` are the most important field — matching weights them highest (+30)
- Include synonyms and abbreviations in keywords (e.g., "oa" for "ordinary account")
- Keep `summary` under 100 words

---

## Known Limitations

| Issue | Workaround |
|-------|-----------|
| **Must use local server** | `python3 -m http.server 8080` — direct file open fails due to CORS |
| **No synonym handling** | Add synonyms manually to keywords array |
| **No typo tolerance** | Misspellings won't match; consider fuzzy matching for production |
| **Browser-only** | No persistence; refresh loses state |
| **Hardcoded test queries** | Edit `runScaleTest()` in `prototype.html` to add more |

---

## Who to Contact

| Question | Contact |
|----------|---------|
| Product decisions, scope, priorities | Product team (author of this handoff) |
| Policy content, accuracy, freshness | Policy Operations Lead (to be assigned) |
| Technical implementation | Engineering lead for this workstream |

---

*Source: `day2-validate/prototype/` and `day2-validate/living-prd.md`*
