# Living PRD

All data is synthetic and made up for learning purposes.

## Notes from prototype testing

- [solid] No real retrieval — keyword matching won't scale; need embeddings or RAG
- [fragile] 922-line HTML file — UI, styles, and all logic in one file; hard to test or refactor
- [surprise] Draft templates are static — no LLM call; the "AI" is template substitution
