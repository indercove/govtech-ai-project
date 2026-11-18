# Policy Recommendation Prototype

**Scenario:** A · ServiceSG enquiry response  
**All data is synthetic and made up for learning purposes.**

## What this tests

The riskiest assumption: Can an AI tool recommend the right policy page from a ticket's content?

## How to run

1. Open `prototype.html` in a browser
2. Paste a sample enquiry into the text box
3. Click "Find Policies"
4. See 1–3 recommended policy links with reasons

## Files

| File | Purpose |
|------|---------|
| `prototype.html` | Single-page interface |
| `policy-index.json` | 50 synthetic policy entries |
| `match.js` | Keyword matching logic |

## Success criteria

- Officer sees at least one relevant policy in the top 3 for 8/10 sample tickets
- Time from paste to result < 3 seconds

## Sample test enquiries (synthetic)

1. "I want to withdraw my CPF for housing downpayment"
2. "How do I apply for a HDB BTO flat as a single?"
3. "My MediShield claim was rejected, what can I do?"
4. "Can I use SkillsFuture credits for a driving course?"
5. "My work pass is expiring next month, how do I renew?"
