# AI user flow: Customer service officer opens the tool and a snapshot of the recommended policy page based on the current active ticket is already loaded, together with an option to refine the context

**Scenario:** A · ServiceSG enquiry response

All data in this file is synthetic.

## The moment

Customer service officer opens the tool and a snapshot of the recommended policy page based on the current active ticket is already loaded, together with an option to refine the context

## The iceberg

### Above the line: what the user sees

The snapshot of the recommended policy page together with another two recommendations and a chatbox for the user to either refine the context or to start a new search. Upon selecting a policy, to surface a possible reply based on the policy chosen

### Below the line

- Data: the public policy pages and relevant metadata, access to all tickets, tickets meta data such as agent assignment and activity status
- Model: LLM to parse all the information, RAG to retrieve the policy pages,
- Rules: Do not interpret ambiguous situation; instead escalate it to the customer service officer with recommendations and a notice to escalate if it is beyond their role to decide
- Handoffs: Handoff all ambiguous situations where the rules are not explicit to the customer service officer or their supervisor, depending on whether it is within the customer service officer's role to decide

## The flow

1. **Trigger:** upon opening a new customer query
   - Trust gap: Control. The policy pages recommendations are not optimised when first using the tool, leading it additional refinement required. However, the overall experience is still faster than searching the pages
2. **AI step:** simply recommend the policy pages for the agent to review and select, before drafting a possible reply once selected
   - Trust gap: Hallucination. In recommending the pages and in drafting, the LLM may not get the context right especially for tickets that are ambiguous.
3. **Human check:** officer encounters a pop up once a ticket has opened with the policy page recommendations to select and a chatbox to refine if it's not right. upon selection, the box closes and a draft appears in the reply field
   - Trust gap: none
4. **Outcome:** the resident gets the reply and all human and AI recommendations and decisions are logged
   - Trust gap: Hallucination. In recommending the pages and in drafting, the LLM may not get the context right especially for tickets that are ambiguous.

## Fallback when the AI is unsure (Advanced)

Put the officer back in control by offering the links to all the different policy page sources.

## How we measure trust (Expert)

accept-as-is rates cross referenced with actual user outcomes
