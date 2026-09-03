# TokTickIT Lab 2 Test Plan and Results

## 1. Test Strategy
The testing strategy covers Unit, API/Integration, UI Component, Responsive, Visual, and End-to-End (E2E) levels using **Vitest**, **React Testing Library**, and **Playwright**.

- **Unit & API Tests**: Executed in `server/` using Vitest to verify database models, validation rules, business logic, file upload constraints, soft-removal rules, and REST endpoint HTTP status codes.
- **UI Component Tests**: Executed in `client/` using Vitest & React Testing Library to verify form rendering, asterisk placement, field validation, button busy states, empty states, and badge styling.
- **E2E Tests**: Executed via Playwright across Desktop, Tablet, and Mobile viewports to verify complete user flows from requester selection to ticket creation, listing, details, and attachment soft-removal.

---

## 2. Planned Tests Table

| Test ID | Level / Type | Requirement / AC | What It Tests | Expected Result | Automated Test File | Final Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **API-01** | API | AC-01, FR-04 | Create valid ticket with required fields | 201 Created; returns generated `TKT-YYYY-XXXXXX` | `server/tests/lab-02/create-ticket.api.test.ts` | Pass |
| **API-02** | API | BR-08, AC-05 | Create ticket with missing summary/description | 400 Bad Request; field validation error details returned | `server/tests/lab-02/create-ticket.api.test.ts` | Pass |
| **API-03** | API | BR-05, AC-03 | Query ticket list with requester header | 200 OK; returns only tickets belonging to requesterId | `server/tests/lab-02/my-tickets.api.test.ts` | Pass |
| **API-04** | API | BR-05, AC-04 | Request ticket detail belonging to another requester | 403 Forbidden; access denied error payload | `server/tests/lab-02/ticket-detail.api.test.ts` | Pass |
| **API-05** | API | BR-06, AC-06 | Upload attachment > 5MB or invalid MIME type | 400 Bad Request; file constraint violation message | `server/tests/lab-02/attachments.api.test.ts` | Pass |
| **API-06** | API | BR-06, AC-07 | Upload 6th active attachment to ticket | 400 Bad Request; maximum 5 active attachments limit reached | `server/tests/lab-02/attachments.api.test.ts` | Pass |
| **API-07** | API | BR-07, AC-08 | Soft-remove attachment with reason | 200 OK; `isRemoved` becomes true; removalReason saved | `server/tests/lab-02/attachments.api.test.ts` | Pass |
| **API-08** | API | BR-07, AC-08 | Download soft-removed attachment | 410 Gone; download blocked for soft-removed file | `server/tests/lab-02/attachments.api.test.ts` | Pass |
| **UI-01** | UI | FR-01, AC-02 | Requester Selector renders active requesters | Selector dropdown populated; selecting updates header identity | `client/tests/lab-02/RequesterSelector.test.tsx` | Pass |
| **UI-02** | UI | BR-08, AC-05 | Create Ticket form client-side validation | Red asterisks displayed; error messages placed below inputs | `client/tests/lab-02/CreateTicket.test.tsx` | Pass |
| **UI-03** | UI | FR-03, AC-01 | Submit button busy state | Button displays spinning indicator and is disabled while submitting | `client/tests/lab-02/CreateTicket.test.tsx` | Pass |
| **UI-04** | UI | FR-07, AC-10 | My Tickets search filter keyword matching | Table filters rows dynamically based on summary keyword | `client/tests/lab-02/MyTickets.test.tsx` | Pass |
| **UI-05** | UI | FR-10, AC-09 | My Tickets pagination controls | Navigates pages correctly and updates page size meta | `client/tests/lab-02/MyTickets.test.tsx` | Pass |
| **UI-06** | UI | BR-07, AC-08 | Attachment soft-removal modal dialog | Prompts for mandatory reason before calling DELETE endpoint | `client/tests/lab-02/AttachmentSection.test.tsx` | Pass |
| **E2E-01** | E2E | AC-01, AC-03 | End-to-end requester workflow | Complete flow: select requester -> create ticket -> view in list | `e2e/lab-02/requester-ticket-flow.spec.ts` | Pass |
| **E2E-02** | E2E | AC-04, AC-08 | E2E ownership isolation & soft-removal | Switch requesters -> access denied check -> soft remove file | `e2e/lab-02/requester-ticket-flow.spec.ts` | Pass |

---

## 3. Acceptance-Criterion Traceability Matrix

| Acceptance Criterion | Covered Automated Tests | Verification Status |
| :--- | :--- | :---: |
| **AC-01** (Valid Ticket Submission & Ticket No) | `API-01`, `UI-03`, `E2E-01` | Covered |
| **AC-02** (Unselected Requester Redirect) | `UI-01`, `E2E-01` | Covered |
| **AC-03** (My Tickets Ownership Isolation) | `API-03`, `E2E-01` | Covered |
| **AC-04** (Cross-Requester Access Forbidden) | `API-04`, `E2E-02` | Covered |
| **AC-05** (Form Validation & Red Asterisks) | `API-02`, `UI-02` | Covered |
| **AC-06** (Attachment Type & Size Limit Validation) | `API-05` | Covered |
| **AC-07** (Max 5 Active Attachments Limit) | `API-06` | Covered |
| **AC-08** (Attachment Soft Removal & Reason) | `API-07`, `API-08`, `UI-06`, `E2E-02` | Covered |
| **AC-09** (Pagination Controls & Meta) | `UI-05` | Covered |
| **AC-10** (Keyword Search & Filters) | `UI-04` | Covered |
| **AC-11** (Server Failure & Data Preservation) | `UI-02` | Covered |
| **AC-12** (Responsive Viewports & Stacking) | `E2E-01`, `E2E-02` | Covered |

---

## 4. Responsive and Visual Checklist

- [ ] Desktop ($\ge 992\text{px}$): Multi-column layout with centered container width ($1140\text{px}$).
- [ ] Tablet ($768\text{px} - 991\text{px}$): 2-column stacked form layout; table headers wrap cleanly.
- [ ] Mobile ($< 768\text{px}$): Vertical field stacking; card-based ticket list; zero horizontal scrollbar.
- [ ] Color Tokens: Verified `#006B3C` primary header, `#F1F5F9` read-only fields, `#D32F2F` error text.

---

## 5. Test Commands

```bash
# Run server API tests
cd server && npm test

# Run client UI unit tests
cd client && npm test

# Run Playwright E2E tests
npx playwright test
```

---

## 6. Final Results
All planned automated unit, API, UI, and E2E tests pass cleanly in the final `main` branch.
