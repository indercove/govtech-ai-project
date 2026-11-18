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

**Result:** _fill in after you run it: what worked, what broke._

## 2. Behavior

**Prompt:** When a policy lookup fails, show a clear message and keep the officer's draft

**Forced failure:** The policy page lookup returns nothing

**Business rules:**
- Never send a reply without an officer reviewing it

**Edge cases:**
- Enquiries with only a photo

**Result:** _fill in after you run it: what worked, what broke._

## 3. Refine

**Prompt:** Consistent labels and spacing on the reply screen

**Business rules:**
- Never send a reply without an officer reviewing it

**Edge cases:**
- Enquiries with only a photo

**Result:** _fill in after you run it: what worked, what broke._
