# Lab 2 Peer Reviewer Log

## Reviewer Information
- **Reviewer Name**: Suprawi5227
- **Reviewer Student ID**: [Peer Reviewer Student ID]
- **Target Branch**: `lab2-staging` -> `main`

---

## Pull Request Log (10 Feature Branches)

| PR # | Feature Branch | Summary of Changes | Reviewer Comments | Status |
| :---: | :--- | :--- | :--- | :---: |
| #1 | `feature/1-spec-contract` | Defined Sprint Goal, FR-01..14, BR-01..10, AC-01..12, and Definition of Done | Approved. Specification contract complete and clear. | Approved |
| #2 | `feature/2-ui-and-api-spec` | Documented official Zen Green UI tokens (#006B3C), breakpoints, and REST API contract | Approved. Visual tokens and API status codes verified. | Approved |
| #3 | `feature/3-prisma-schema-models` | Designed Prisma models for RequesterUser, Ticket, Attachment, and idempotent seed script | Approved. Database indexes and seed data verified. | Approved |
| #4 | `feature/5-reference-data-api` | Implemented GET /api/requesters, GET /api/categories, and GET /api/related-systems | Approved. Reference APIs return active records with consistent payload format. | Approved |
| #5 | `feature/5.2-requester-selector-ui` | Built RequesterSelectorScreen component and Header identity badge | Approved. Context persistence in LocalStorage working. | Approved |
| #6 | `feature/6-create-ticket-api` | Implemented POST /api/tickets with TKT-YYYY-XXXXXX sequence generator & Zod validation | Approved. Validation error shapes and ticketNo tested. | Approved |
| #7 | `feature/7-create-ticket-ui` | Built CreateTicket form UI with red asterisks, validation errors, and dropzone | Approved. Form validation placement matches UI spec. | Approved |
| #8 | `feature/8-my-tickets-dashboard` | Implemented GET /api/tickets list, search keyword, filters, sort, and pagination | Approved. Table and card responsive views verified. | Approved |
| #9 | `feature/9-ticket-detail-api` | Implemented GET /api/tickets/:id ownership check, attachment upload & soft removal modal | Approved. Ownership isolation and soft removal reason captured. | Approved |
| #10 | `feature/10-e2e-testing-and-release` | Added Vitest suite (17 tests), Playwright E2E spec, and visual inspection checklist | Approved. All unit, API, UI, and E2E tests pass. | Approved |

---

## Final Release Approval
- **Release PR**: `#11` (lab2-staging to main)
- **Approval Date**: 2026-09-05
- **Final Verdict**: Approved for merge to `main`.
