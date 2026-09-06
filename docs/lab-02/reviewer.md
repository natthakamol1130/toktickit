# Lab 2 Peer Reviewer Log

## Reviewer Information
- **Peer Reviewer (ผู้ตรวจรีวิว)**: Suprawee Sutthiserinawat (นางสาวสุประวีณ์ สุทธิเสรีนิวัมน์ — 67070505227, @Suprawi5227)
- **Author / Developer (ผู้พัฒนา)**: Natthakamol Mornparn (นางสาวณัฏฐกมล มอญปาน — 67070505215, @natthakamol1130)
- **Target Branch**: `lab2-staging` -> `main`

---

## 1. Pull Request Review Log on Repository: `natthakamol1130/toktickit`
**(รายการการตรวจรีวิวทั้งหมดที่เพื่อน @Suprawi5227 ตรวจรีวิวและกด Approve ให้เรา ห้ามย่อ)**

| PR # | Feature Branch | Summary of Changes | Reviewer Comments | Status |
| :---: | :--- | :--- | :--- | :---: |
| #11 | `feature/1-spec-contract` | Defined Sprint Goal, Functional Requirements FR-01..14, Business Rules BR-01..10, Acceptance Criteria AC-01..12, and Definition of Done contract in `docs/lab-02/specification.md`. | Approved. Specification contract complete, business rules BR-01 through BR-10 are well-defined, and acceptance criteria are unambiguous. | Approved |
| #13 | `feature/2-ui-and-api-spec` | Documented official Zen Green UI tokens (#006B3C), responsive breakpoints, component layouts, and REST API contract in `docs/lab-02/ui-spec.md` and `api-spec.md`. | Approved. Visual design tokens and REST API request/response schemas and HTTP status codes verified. | Approved |
| #15 | `feature/3-prisma-schema-models` | Designed Prisma schema data models (RequesterUser, Ticket, Attachment, RelatedSystem, Category), soft-removal columns, and created idempotent database seed script in `server/prisma/seed.ts`. | Approved. Database models, relations, indexes, and seed data logic verified successfully. | Approved |
| #17 | `feature/4-reference-data-api` | Implemented REST API endpoints for GET /api/requesters, GET /api/categories, and GET /api/related-systems returning active reference records. | Approved. Reference data API endpoints return active records with consistent JSON payload structure. | Approved |
| #19 | `feature/5-requester-selector-ui` | Built RequesterSelectorScreen UI component and top navigation Header identity badge with active requester persistence in LocalStorage. | Approved. Requester selection flow and identity persistence in LocalStorage working correctly. | Approved |
| #21 | `feature/6-create-ticket-api` | Implemented POST /api/tickets endpoint with TKT-YYYY-XXXXXX auto sequence generator, Zod schema validation, and database storage. | Approved. Ticket number generator and validation error shapes verified. | Approved |
| #26 | `feature/7-create-ticket-ui` | Built CreateTicketView form component featuring red asterisks for mandatory fields, client-side validation error messages, dropzone file upload, and busy submitting state. | Approved. Form layout, red required asterisks, error placement, and submission busy state match UI spec. | Approved |
| #28 | `feature/8-my-tickets-dashboard` | Implemented GET /api/tickets search, category/priority/status filters, sorting, pagination, and MyTicketsView dashboard with desktop table and mobile card view. | Approved. Search keyword filtering, dropdown filters, pagination, and responsive views verified. | Approved |
| #30 | `feature/9-ticket-detail-api` | Implemented GET /api/tickets/:id ownership security check, attachment upload, and DELETE /api/attachments/:id soft-removal endpoint requiring removal reason. | Approved. Ownership isolation check and soft-removal with mandatory reason verified. | Approved |
| #32 | `feature/10-e2e-testing-and-release` | Added Vitest unit & API integration test suite (14 tests passed), Playwright E2E end-to-end test suite (2 specs passed), and pre-release inspection checklist. | Approved. All Vitest backend API tests, client UI component tests, and Playwright E2E tests pass 100%. | Approved |
| #33 | `lab2-staging` -> `main` | Final Lab 2 release PR merging all verified features, test suites, and documentation from lab2-staging into main. | Approved for merge into main. All 10 features, database migrations, unit tests, and E2E tests pass. Code adheres strictly to Zen Green UI spec and Spec DD contract. | Approved |

---

## 2. Pull Request Review Log on Repository: `Suprawi5227/toktickit`
**(รายการการตรวจรีวิวทั้งหมดที่เรา @natthakamol1130 ตรวจรีวิวและกด Approve ให้เพื่อน ห้ามย่อ)**

| PR # | Feature Branch | Summary of Changes | Reviewer Comments (@natthakamol1130) | Status |
| :---: | :--- | :--- | :--- | :---: |
| #1 | `feature/1-spec-contract` | Defined Sprint Goal, Functional Requirements, Business Rules, and Acceptance Criteria in `docs/lab-02/specification.md`. | Approved. Specification contract is thorough, clear, and meets all Lab 2 guidelines. | Approved |
| #2 | `feature/2-ui-and-api-spec` | Documented Zen Green UI design tokens (#006B3C), responsive breakpoints, and REST API contract in `ui-spec.md` and `api-spec.md`. | Approved. Design tokens, color palette, and API response contracts verified. | Approved |
| #3 | `feature/3-prisma-schema-models` | Designed Prisma schema data models and seed data script for reference categories, systems, and development requesters. | Approved. Database models, seed script, and Prisma migration scripts verified. | Approved |
| #4 | `feature/4-reference-data-api` | Implemented reference data endpoints for GET /api/requesters, GET /api/categories, and GET /api/related-systems. | Approved. API responses return active reference items formatted correctly. | Approved |
| #5 | `feature/5-requester-selector-ui` | Built RequesterSelectorScreen and top header context badge with requester selection persistence. | Approved. Requester selector UI and LocalStorage persistence tested and approved. | Approved |
| #6 | `feature/6-create-ticket-api` | Implemented POST /api/tickets endpoint with TKT-YYYY-XXXXXX sequence generator and field validation. | Approved. Ticket code generator and validation error handling verified. | Approved |
| #7 | `feature/7-create-ticket-ui` | Built CreateTicket form UI with required red asterisks, client validation, and attachment dropzone. | Approved. Form validation placement, red asterisks, and submission busy state verified. | Approved |
| #8 | `feature/8-my-tickets-dashboard` | Implemented GET /api/tickets list endpoint, keyword search, status/priority filters, pagination, and MyTickets view. | Approved. Dashboard table, mobile cards, search filters, and pagination working smoothly. | Approved |
| #9 | `feature/9-ticket-detail-api` | Implemented ticket detail endpoint with requester ownership check, attachment upload, and soft-removal modal with mandatory reason. | Approved. Ownership isolation and soft-removal reason dialog verified. | Approved |
| #10 | `feature/10-e2e-testing-and-release` | Added Vitest unit test suite, Playwright E2E integration test suite, and pre-release documentation. | Approved. All backend unit tests, frontend component tests, and E2E specs pass 100%. | Approved |
| Release | `lab2-staging` -> `main` | Merged all 10 completed feature branches from lab2-staging into default branch main. | Approved for merge into main. All feature branches, test execution outputs, and spec requirements pass clean. | Approved |

---

## 3. GitHub Peer Review Evidence Screenshots

### 3.1 Peer Review Evidence on My Repository (หลักฐานที่เพื่อน @Suprawi5227 มาตรวจรีวิวและกด Approve ให้เรา)
![Peer Review Approved by Suprawi5227](images/09_peer_review_received.png)

### 3.2 Peer Review Evidence on Peer Repository (หลักฐานที่เรา @natthakamol1130 ไปตรวจรีวิวและกด Approve ให้เพื่อน)
![Peer Review Given to Suprawi5227](images/10_peer_review_given.png)
