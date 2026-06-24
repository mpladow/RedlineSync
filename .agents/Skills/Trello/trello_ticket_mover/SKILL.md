# Trello Ticket Move Skill

This skill listens for a confirmed task and moves the corresponding Trello ticket to the designated list (e.g., "Done" or "In Review").

## Skill Configuration

* **Name**: Move Confirmed Trello Ticket
* **Description**: Automatically moves a Trello card once a confirmation signal has been received from the user or previous system steps.

## Triggers
This skill is activated when the following condition is met:
* `confirmation_status` == `True` (Confirmed)

## Prerequisites
Before this skill runs, the system must gather the following variables:
1. `card_id` or `ticket_name` (The Trello ticket to move)
2. `destination_list` (The exact name of the list to move the card to, e.g., "Ready for QA" or "Done")

## Actions
The system will execute the following steps in order:

1. **Authenticate**: Connect to [Trello REST API](https://developer.atlassian.com/cloud/trello/rest/api-group-actions/) using your API key and token.
2. **Locate List ID**: Fetch the available lists on your Trello board to find the exact `list_id` for your `destination_list`.
3. **Move Card**: Send a `PUT` request to update the card's list destination:
   `PUT /1/cards/{card_id}?idList={list_id}`

## Response
Once the API responds with a success status (200 OK), the system will output:
> 🟢 Success: Ticket `[ticket_name]` has been moved to `[destination_list]`!