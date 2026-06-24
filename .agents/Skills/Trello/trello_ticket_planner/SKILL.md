---
name: trello-ticket-planner
description: >-
  Analyze a Trello card in Development, summarize the work required,
  ask for missing details, await user confirmation, then move the card to Review.
metadata:
  version: "1.0"
  category: trello
---

# Trello Ticket Planner

## Instructions for Codex

1. Ask the user for the exact Trello card or ticket in the `Development` column before doing any work. If the user already named the ticket, confirm the ticket title or ID and the board/list context.
2. Retrieve the card details, including description, acceptance criteria, comments, checklist items, attachments, and any related fields.
3. Analyze the requirements and produce a concise summary of what the ticket is asking for.
4. Outline the work required to complete the ticket, including:
   - implementation tasks
   - dependencies
   - acceptance criteria
   - testing or verification steps
   - any assumptions you are making
5. Drill into any gaps by asking the user for additional requirements or clarifications, such as:
   - expected behavior edge cases
   - data inputs/outputs
   - UI or style expectations
   - API/contract details
   - performance, error handling, or integration requirements
6. Do not begin implementation until the user explicitly approves the plan.
7. Once the user confirms the implementation plan, proceed with the requested work.
8. After successful implementation, move the Trello card to the `Review` list on the same board.
9. Confirm the card has been moved and summarize the change.

## Workflow

- User identifies the ticket in `Development`
- Codex assesses requirements
- Codex outlines required work and asks for missing details
- Codex waits for explicit approval
- On approval, Codex completes implementation and moves the ticket to `Review`

## Notes

- If the board or list names differ, ask the user to confirm the correct Trello board and list names.
- If required details are missing from the ticket, ask follow-up questions before implementation.
- The move should only happen after the user explicitly approves the implementation plan.
