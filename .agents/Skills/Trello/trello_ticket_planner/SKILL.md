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
7. After approval, create a new Git branch from `main` that is linked to the ticket before starting implementation. Use a clear branch name that includes the ticket identifier, for example: `ticket/<card-id>-short-description` (or `ticket/<ticket-number>-short-description`). Push the branch to the remote and open a PR or mark it as the implementation branch according to the project's conventions.
8. Once the branch is created and pushed, proceed with the requested work on that branch.
9. After successful implementation, move the Trello card to the `Review` list on the same board.
10. Confirm the card has been moved and summarize the change, including the branch name and remote URL.

## Workflow

- User identifies the ticket in `Development`
- Codex assesses requirements
- Codex outlines required work and asks for missing details
- Codex waits for explicit approval
- On approval, Codex creates a branch from `main`, implements the work on that branch, then moves the ticket to `Review`

## Notes

- If the board or list names differ, ask the user to confirm the correct Trello board and list names.
- If required details are missing from the ticket, ask follow-up questions before implementation.
- The move should only happen after the user explicitly approves the implementation plan.
- Branch creation guidance:
  - Ensure local `main` is up-to-date: `git checkout main && git pull origin main`.
  - Create the branch locally: `git checkout -b ticket/<card-id>-short-description`.
  - Push the branch to remote: `git push -u origin ticket/<card-id>-short-description`.
  - Include the Trello card ID in the branch name or PR description so the ticket and branch can be linked.
  - If your workflow requires a PR, open a draft PR and mention the Trello card in the PR description.

- Don't move the Trello card before the branch exists and the implementation is pushed or otherwise available for review.
