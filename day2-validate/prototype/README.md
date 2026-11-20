# Policy Finder Prototype

**Scenario:** A · ServiceSG enquiry response  
**All data is synthetic and made up for learning purposes.**

## What it does

Helps customer service officers find relevant policy pages and generate draft replies. Three-column workflow:

1. **Paste enquiry** — Officer pastes ticket content
2. **Find policies** — Tool shows top 3 matches with relevance scores
3. **Generate draft** — Click a policy to get a draft reply

## Features

| Feature | Description |
|---------|-------------|
| Keyword matching | Weighted scoring: keywords (30), title (10), summary (5) |
| Category templates | Draft replies tailored to CPF, HDB, Healthcare, Education, Employment |
| Scale test mode | Toggle to 250+ policies to test retrieval at scale |
| Kill switch | Triggers if precision drops below 60% |
| Sample queries | Quick-start buttons for common enquiry types |

## How to run

Open via a local server (required for fetch to work):

```
cd day2-validate/prototype
npx serve .
```

Or use the Claude Code preview server.

## Files

| File | Purpose |
|------|---------|
| `prototype.html` | Main interface (3-column layout) |
| `match.js` | Matching logic + draft templates |
| `policy-index.json` | 56 synthetic policies |
| `policy-index-scale.json` | 250+ policies for scale testing |

## Stop line

If precision at scale drops below 60%, the kill switch triggers. Stop and rethink retrieval before building further.

## Related

- `context-skill.md` — Guardrails and test cases the prototype does not yet implement
- `build-log.md` — What we tested and learned
