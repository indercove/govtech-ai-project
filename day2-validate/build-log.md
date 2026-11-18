# Day 2 Build Log

This log tracks what we built, tested, and learned during Day 2 Validate.

---

## Riskiest Assumption

**Assumption:** The 50→2000 policy gap is unproven — keyword matching works with our 50 synthetic policies, but we have no evidence it will work at real-world scale (2000+ policy documents across multiple agencies).

| Field | Value |
|-------|-------|
| **Risk type** | Technical feasibility |
| **Why it matters** | If retrieval quality drops at scale (irrelevant results, missed matches), officers will lose trust and stop using the tool. The whole value prop breaks. |
| **Kill switch** | If precision drops below 60% when tested against 500+ policies, stop and rethink the retrieval approach before building further. |
| **Success signal** | The top-3 recommendations include the correct policy at least 80% of the time, even with 500+ policies in the index. |

---

## How we tested it

We added a **scale test** to the prototype:
- Expanded the synthetic policy index from ~50 to 500 made-up policies
- Ran the same sample queries against the larger dataset
- Checked whether the right policy still appears in the top 3 results

See `day2-validate/prototype/` for the test data and results.

---

## Notes

- All data is synthetic and made up for learning purposes.
- The scale test uses made-up policy titles, not real government documents.
