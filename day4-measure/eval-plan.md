# Eval Plan: Policy Finder Agent

All data is synthetic and made up for learning purposes.

**Scenario:** A: ServiceSG enquiry response

This file says who runs the eval for the Policy Finder Agent, when it runs, and how we will know the agent is working. It uses job roles from `day3-build/operating-model.md`, not names. The scoring method is in `day4-measure/human-rubric.md`. The first results are in `day4-measure/eval-results.md`.

Status: **Decided** on 2026-11-20. The learner agreed every item and every owner below.

---

## Who owns what

| Job | Owner | Consulted | Status |
|-----|-------|-----------|--------|
| **Signs the pass bar** (agrees the numbers in `human-rubric.md` and any change to them) | Product Owner | Engineering Lead, Policy Operations Lead, Team Lead | Decided |
| **Uses the pass bar for go-live** (decides pilot or production from the eval result) | Business Owner | Product Owner, Engineering Lead, Team Lead | Decided |
| **Writes and refreshes the test cases** (`eval-cases.md`) and the answer key in `human-rubric.md` | Policy Operations Lead | Product Owner, Supervisor (for high-risk cases) | Decided |
| **Runs the eval** (acts as the runner in the rubric runbook, saves every answer, works out the pass bar) | Engineering Lead, or an engineer they name | Product Owner | Decided |
| **Scores the eval** (Reviewer 1 and Reviewer 2; neither runs the agent) | Two Officers chosen by the Team Lead each month | Supervisor (third reviewer for tie-breaks) | Decided |
| **Reviews a weekly sample of live use** (20 logged interactions picked at random, checked against the 5 rubric questions) | Supervisor | Team Lead; findings go to the Product Owner | Decided |
| **Triggers the kill switch** if a stop line is hit | Engineering Lead (Product Owner as backup), as in `operating-model.md` | Product Owner, IT Security | Decided |

**Why these owners (Decided):**
- The Product Owner owns success metrics in the operating model, so they sign the bar. The Business Owner owns go-live, so they use it.
- The Policy Operations Lead keeps the policy index, so they know when a test case or answer key goes stale.
- The runner and the reviewers are different people, so nobody scores an answer they produced. The first run broke this rule (see `eval-results.md`, "Limits of this run").
- Officers score because the rubric judges the answer "from the officer's seat".

---

## When it runs

| When | What runs | Who | Gate | Status |
|------|-----------|-----|------|--------|
| **Before go-live** (pilot and production) | Full eval: all 14 cases, two reviewers, warm-up set first | Runner + 2 reviewers | Every pass bar check in `human-rubric.md` must pass. One deal-breaker "No" = no go-live. | Decided |
| **Before every change** to `day3-build/CLAUDE.md`, the templates in `match.js`, the matcher, the model or the policy index | Full eval on the changed version, before it reaches officers. Re-calibrate first (rubric Calibration step 6). | Runner + 2 reviewers | No new deal-breaker "No", and no pass bar number lower than the last run | Decided |
| **Every week** | Full eval on the live version, plus the Supervisor's sample of 20 live interactions | Runner + 2 reviewers; Supervisor for the sample | Results saved as `eval-results-YYYY-MM-DD.md`. Any deal-breaker "No" starts the incident steps in `operating-model.md`. | Decided |
| **When a policy changes** (new scheme, new amount, new date, or a policy retired) | Rerun the cases that use that policy. Add a past-date case like Case 11 for the change. Update the answer key in the same change. | Policy Operations Lead updates cases; Runner reruns | Affected cases still pass. Old version stays findable for past-date enquiries. | Decided |

---

## How I'll know it's working

### The goal

Officers find the right policy in seconds and start from a safe, accurate draft, while staying in charge of every decision and every send. (From the value proposition in `human-rubric.md` and the problem in `one-pager.md`.) Status: Decided.

### The baseline

| Measure | Baseline | Source | Status |
|---------|----------|--------|--------|
| Time to find the right policy | 3 min per ticket | `one-pager.md`, time savings table | Decided |
| Average handling time | 9.3 min per request | `data/synthetic-usage.csv`, 12 weeks, weighted by requests | Decided |
| Resolved first time | 69.1% of requests | `data/synthetic-usage.csv` | Decided |
| Escalated | 10.9% of requests | `data/synthetic-usage.csv` | Decided |
| Right policy in top 3 (rubric Q1) | 55% first run; 73% after the fixes | `eval-results.md`, 2026-11-20 | Decided |
| Deal-breaker "No" answers | 4 first run; 0 after the fixes | `eval-results.md` | Decided |
| Easy to act on (rubric Q5) | Average 3.1 first run; 3.5 after the fixes | `eval-results.md` | Decided |

The usage data is made up for the course lab. It is a stand-in for real pre-launch numbers.

### The target and review date

| Measure | Target | Review date | Status |
|---------|--------|-------------|--------|
| Time to find the right policy | 1 min per ticket (from 3) | 2026-12-21 | Decided |
| Right policy in top 3 (Q1) | At least 80%, and 5 of 6 everyday cases | 2026-12-21 | Decided |
| Deal-breaker "No" answers | Zero, every week | Every weekly run | Decided |
| Easy to act on (Q5) | Average 4.0 or higher, no score of 2 or below | 2026-12-21 | Decided |
| Resolved first time | Up from 69.1%, with no rise in escalations above 10.9% | 2027-01-18 (after 8 weeks of live use) | Decided |

### A usage metric

**Share of tickets where the officer clicks a recommended policy.** Count logged interactions where `policy_selected` is filled, divided by all logged interactions. The log fields are in `day3-build/CLAUDE.md`.

- **Target:** 50% of officers in scope use the tool on at least 20% of their tickets within 2 weeks of pilot start (from `one-pager.md`).
- **Also watch:** how often officers edit the draft (`draft_edited`). Edits on almost every draft mean the templates are not helping.

Status: Decided.

### The pattern to watch first

**False low-confidence warnings.** In the first run, only 2 of 14 cases scored above 20%, so the warning showed even on correct matches (Cases 1 and 2). If officers see the warning on most tickets, they will learn to ignore it, including when it is right.

What to check each week:
- How often "Low confidence. Consider manual search." shows in the live log, and how often the officer then clicks the top result anyway.
- In the eval: any Q3 "No" caused by a false alarm on an everyday case.

If the warning shows on more than half of live tickets, raise it with the Engineering Lead before the next change. Status: Decided.

### The stop line

Stop or pause the agent if any of these happen. The Engineering Lead triggers the kill switch, as in `operating-model.md`.

| Signal | Stop line | Action | Status |
|--------|-----------|--------|--------|
| Deal-breaker answer | Any "No" on Q2, Q3 or Q4 in an eval run, or in the Supervisor's weekly sample | Do not ship the change. If live, start incident steps the same day. | Decided |
| Right policy in top 3 (Q1) | Below 60% | Kill switch. Officers go back to manual search. Rethink retrieval. | Decided |
| Wrong reply sent to a resident | One confirmed case | Incident steps in `operating-model.md` | Decided |
| Officer adoption | Fewer than 3 of 5 officers complete the pilot shift | Pause and look at usability | Decided |
| Policy freshness | More than 20% of audited policies out of date | Pause rollout until the Policy Operations Lead fixes ownership | Decided |

---

## First 30 days

All dates are Decided. Day 1 is the first working day after the Product Owner signs this plan.

| When | What happens | Owner | Done when | Status |
|------|--------------|-------|-----------|--------|
| **Days 1 to 5** | Product Owner signs the pass bar. Team Lead names two Officer reviewers and one Supervisor tie-breaker. Policy Operations Lead adds ECDA, Workfare and Senior Household Top-Up to the index and updates the answer key. | Product Owner, Team Lead, Policy Operations Lead | Pass bar signed; reviewers named; index and answer key updated together | Decided |
| **Days 6 to 10** | Warm-up set (Cases 1, 8, 12 and one made-up bad answer) with both reviewers. Then the first full run by people who did not build the agent. Fix the Q5 issues (high-risk template, no NRIC line in the CPF template). | Engineering Lead (runner), Officer reviewers | Agreement targets met; results saved as `eval-results-YYYY-MM-DD.md` | Decided |
| **Days 11 to 15** | Go-live check against the full pass bar. If it passes, Business Owner decides on a pilot with 5 officers. Add the two watch cases from `eval-results.md`: wrong scheme above 20%, and ComCare and SSO both shown when only one is asked about. | Business Owner, Product Owner, Policy Operations Lead | Go or no-go recorded with the reason | Decided |
| **Days 16 to 30** | Pilot runs. Weekly full eval and Supervisor sample of 20 live interactions each week. Track the usage metric and how often the low-confidence warning shows. | Engineering Lead, Supervisor, Product Owner | Two weekly runs saved; adoption checked at day 14 of the pilot | Decided |
| **Day 30** | Review against the targets and stop lines. Decide: widen the pilot, fix and rerun, or stop. Update this plan with anything that changes. | Product Owner (decides), Business Owner (told) | Review notes saved in `day4-measure/` | Decided |

---

*Last updated: 2026-11-20*
*Source: `SCENARIO-PICK.md`, `day3-build/operating-model.md`, `day3-build/CLAUDE.md`, `day4-measure/human-rubric.md`, `day4-measure/eval-results.md`, `day4-measure/data/synthetic-usage.csv`, `one-pager.md`*
