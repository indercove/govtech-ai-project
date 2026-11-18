# Prompt chain

**Scenario:** A · ServiceSG enquiry response
**Prototype today:** Helps customer service officers find relevant policy pages and generate draft replies.

All data is synthetic and labelled as made up.

## 1. Expand

**Prompt:** Let the officer see the inbox of their tickets, with the option to sort by policy topic

**Business rules:**
- Never send a reply without an officer reviewing it

**Edge cases:**
- Enquiries with only a photo

**Result:**
- ✅ Inbox view shows 8 synthetic tickets with sorting (Newest, Oldest, By Topic)
- ✅ Tickets with attachments display a warning badge ("📎 Has attachment")
- ✅ View toggle switches between Inbox and Policy Finder
- ⚠️ Photo-only tickets show as "Unknown" topic — officer must review manually

## 2. Behavior

**Prompt:** When a policy lookup fails, show a clear message and keep the officer's draft

**Forced failure:** The policy page lookup returns nothing

**Business rules:**
- Never send a reply without an officer reviewing it

**Edge cases:**
- Enquiries with only a photo

**Result:**
- ✅ Failed lookup shows clear warning box with actionable suggestions
- ✅ Previous draft preserved with green notice ("Your previous draft is still available")
- ✅ Officer can copy or regenerate preserved draft
- ⚠️ Photo-only enquiries cannot trigger lookup — no keywords to match

## 3. Refine

**Prompt:** Consistent labels and spacing on the reply screen

**Business rules:**
- Never send a reply without an officer reviewing it

**Edge cases:**
- Enquiries with only a photo

**Result:**
- ✅ Consistent section labels (SOURCE POLICY, DRAFT REPLY) added
- ✅ Blue left-border accent on source policy box
- ✅ Button icons (📋 Copy, 🔄 Regenerate) with top border separator
- ✅ Improved spacing and visual hierarchy throughout reply screen
