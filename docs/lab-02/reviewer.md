# Lab 2 Peer Reviewer Log

## Reviewer Information
- **Reviewer Name**: Suprawee Sutthiserinawat (นางสาวสุประวีณ์ สุทธิเสรีนิวัมน์ — 67070505227, @Suprawi5227)
- **Author Name**: Natthakamol Mornparn (นางสาวณัฏฐกมล มอญปาน — 67070505215, @natthakamol1130)
- **Target Branch**: `lab2-staging` -> `main`

---

## Pull Request Log (10 Feature Branches)

| PR # | Feature Branch | Summary of Changes | Reviewer Comments | Status |
| :---: | :--- | :--- | :--- | :---: |
| #11 | `feature/1-spec-contract` | Defined Sprint Goal, FR-01..14, BR-01..10, AC-01..12, and Definition of Done | Approved. Specification contract complete and clear. | Approved |
| #13 | `feature/2-ui-and-api-spec` | Documented official Zen Green UI tokens (#006B3C), breakpoints, and REST API contract | Approved. Visual tokens and API status codes verified. | Approved |
| #15 | `feature/3-prisma-schema-models` | Designed Prisma models for RequesterUser, Ticket, Attachment, and idempotent seed script | Approved. Database indexes and seed data verified. | Approved |
| #17 | `feature/4-reference-data-api` | Implemented GET /api/requesters, GET /api/categories, and GET /api/related-systems | Approved. Reference APIs return active records with consistent payload format. | Approved |
| #19 | `feature/5-requester-selector-ui` | Built RequesterSelectorScreen component and Header identity badge | Approved. Context persistence in LocalStorage working. | Approved |
| #21 | `feature/6-create-ticket-api` | Implemented POST /api/tickets with TKT-YYYY-XXXXXX sequence generator & Zod validation | Approved. Validation error shapes and ticketNo tested. | Approved |
| #26 | `feature/7-create-ticket-ui` | Built CreateTicket form UI with red asterisks, validation errors, and dropzone | Approved. Form validation placement matches UI spec. | Approved |
| #28 | `feature/8-my-tickets-dashboard` | Implemented GET /api/tickets list, search keyword, filters, sort, and pagination | Approved. Table and card responsive views verified. | Approved |
| #30 | `feature/9-ticket-detail-api` | Implemented GET /api/tickets/:id ownership check, attachment upload & soft removal modal | Approved. Ownership isolation and soft removal reason captured. | Approved |
| #32 | `feature/10-e2e-testing-and-release` | Added Vitest suite (14 tests), Playwright E2E spec, and visual inspection checklist | Approved. All unit, API, UI, and E2E tests pass. | Approved |

---

## Final Release Approval
- **Release PR**: `#33` (`lab2-staging` -> `main`)
- **Approval Date**: 2026-09-06
- **Final Verdict**: Approved for merge to `main`.

---

## GitHub Peer Review Evidence (หลักฐานการรีวิวโค้ดระหว่างคู่รีวิว)

### 1. Peer Review Evidence on My Repository (หลักฐานที่เพื่อน @Suprawi5227 มาตรวจรีวิวและกด Approve ให้เรา)
![Peer Review Approved by Suprawi5227](images/09_peer_review_received.png)

### 2. Peer Review Evidence on Peer Repository (หลักฐานที่เรา @natthakamol1130 ไปตรวจรีวิวและกด Approve ให้เพื่อน)
![Peer Review Given to Suprawi5227](images/10_peer_review_given.png)
