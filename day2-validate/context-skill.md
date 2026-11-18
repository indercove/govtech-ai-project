# Context Skill · Policy Recommendation

All examples are synthetic and made up for learning purposes.

## Purpose

Enable the Policy Finder tool to recommend the correct policy version and surface relevant context (effective dates, related policies, risk tier) so officers can respond accurately without additional searching.

## Sources

| Source | What it provides | Update frequency |
|--------|------------------|------------------|
| Policy repository | Current policy text, URL, category | On policy change |
| Policy changelog | Version history, effective dates, what changed | On policy change |
| Policy relationship map | Supersedes, conflicts-with, depends-on links | Quarterly review |
| Risk tier registry | High/medium/low classification per policy | On policy creation or incident |
| Enquiry type taxonomy | Complaint, question, request, appeal, escalation | Stable |

## Rules

1. **Match to effective date**: If the enquiry references a past event (e.g., "I applied in March 2025"), recommend the policy version that was active at that time, not the current version.
2. **Surface related policies**: When recommending a policy, also show policies marked as "related" or "commonly confused with" in the relationship map.
3. **Flag conflicts**: If two policies give contradictory guidance for the same situation, alert the officer and do not auto-generate a draft.
4. **Apply risk tier**: High-risk policies (benefits denial, financial impact > $5,000, vulnerable residents) require supervisor review before sending.
5. **Acknowledge gaps**: If the enquiry mentions an attachment or image, note that the tool cannot read it and prompt the officer to review manually.

## Examples

### Good example 1: Policy version matching

**Enquiry**: "I submitted my CPF housing withdrawal application in January 2025 but it was rejected. The rules seem different now."

**Tool behaviour**:
- Detects date reference: January 2025
- Retrieves policy version active in January 2025 (v2.3) and current version (v2.5)
- Shows: "Policy changed in April 2025. Showing version that applied to your application."
- Recommends: CPF Housing Withdrawal (v2.3) with link to change summary

**Why this is good**: The officer sees the correct rules for the resident's situation and understands what changed.

---

### Good example 2: Related policy surfacing

**Enquiry**: "Can I use my CPF to pay for my child's university fees?"

**Tool behaviour**:
- Matches: CPF Education Scheme
- Detects related policy: Post-Secondary Education Account (PSEA)
- Shows both with note: "Officers often need to explain the difference between these two schemes."
- Risk tier: Low — no supervisor review required

**Why this is good**: The officer gets both relevant policies upfront instead of discovering the second one mid-conversation.

---

### Bad example: Ignoring conflict

**Enquiry**: "I'm a PR and I want to apply for the HDB grant. Am I eligible?"

**Tool behaviour (wrong)**:
- Matches: HDB Enhanced CPF Housing Grant
- Auto-generates draft: "You may be eligible for the Enhanced CPF Housing Grant..."
- Does not check: PR eligibility rules, which differ from citizen rules

**Why this is bad**: The draft implies eligibility without checking the PR-specific constraints. The officer may send incorrect advice. The tool should have flagged: "Eligibility differs for PRs — please verify Section 3.2 before responding."

## Owner

Policy Operations Lead (synthetic role)

Responsible for:
- Maintaining the policy changelog and relationship map
- Classifying risk tiers for new policies
- Reviewing flagged conflicts quarterly

## Review trigger

Re-evaluate this skill when:
- A policy recommendation leads to an escalation or complaint
- A new policy is added that supersedes or conflicts with existing policies
- Accuracy on "changed in last 90 days" policies falls below 90%
- More than 5% of officer feedback marks recommendations as "outdated"

## Test questions and expected answers

All questions and answers are synthetic and made up for learning purposes.

### Q1: Effective date matching

**Question**: "I was told in February 2025 that I could withdraw my CPF at 55. Now the website says 57. Which is correct for me?"

**Expected answer**: The tool should detect "February 2025" and "55" as date/age references. It should retrieve the policy version active in February 2025 (withdrawal age 55 for those born before 1970) and the current version (withdrawal age 57 for those born after 1975). The recommendation should show both versions with a note: "Rules depend on your birth year. Please confirm the resident's birth year before advising."

---

### Q2: Related policy detection

**Question**: "My MediShield claim was rejected. What other options do I have?"

**Expected answer**: The tool should recommend MediShield Life Claims (primary match) and surface related policies: MediFund Assistance, Integrated Shield Plan top-ups, and CHAS subsidies. It should note: "If the resident cannot afford remaining bills, MediFund may apply — check income eligibility."

---

### Q3: Conflict flagging

**Question**: "I'm a single aged 34. Can I buy an HDB flat?"

**Expected answer**: The tool should detect a conflict: Singles Scheme requires age 35+, but some pilot programmes allow age 34. It should NOT auto-generate a draft. It should flag: "Conflicting eligibility rules — Singles Scheme (35+) vs Prime Location Pilot (34+ with conditions). Please verify which programme the resident is asking about."

---

### Q4: Risk tier escalation

**Question**: "My elderly mother's MediSave was used without her consent. I want to file a complaint."

**Expected answer**: The tool should classify this as high-risk (vulnerable resident, potential fraud, complaint). It should recommend: MediSave Unauthorised Use policy and CPF Nomination policy. It should flag: "High-risk — supervisor review required before responding. Do not send draft without approval."

---

### Q5: Attachment acknowledgement

**Question**: "Please see the attached rejection letter. Why was my application denied?"

**Expected answer**: The tool should detect "attached" and note: "This enquiry references an attachment that the tool cannot read. Please review the attachment manually before selecting a policy." It should not recommend a policy until the officer indicates the attachment topic.
