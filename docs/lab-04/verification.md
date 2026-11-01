# TokTickIT Lab 4 Verification & Regression Evidence (`verification.md`)

- **Student Name:** Natthakamol Katippatee (Student ID: 67070505215)
- **Repository:** [`natthakamol1130/toktickit`](https://github.com/natthakamol1130/toktickit)
- **Peer Reviewer:** Suprawi Srikamwong ([`@Suprawi5227`](https://github.com/Suprawi5227))
- **Sprint / Increment:** Lab 4 — Actions Taken, Role Dashboards, Ticket Workflow & Final Regression

---

## 1. Automated Test Suite Summary

All automated test suites across **Server API / Integration**, **Client UI Components**, **End-to-End (Playwright) User Journeys**, and **Full Regression (Labs 1–3)** pass with a **100% pass rate**.

| Test Suite Layer | Command Executed | Test Files Passed | Total Assertions / Tests Passed | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Server API & Integration (Labs 1–4)** | `npm --prefix server test` | `15 / 15` | `63 / 63` | ✅ PASS |
| **Client UI Components (Labs 1–4)** | `npm --prefix client test` | `13 / 13` | `26 / 26` | ✅ PASS |
| **Playwright End-to-End (Lab 4)** | `npx playwright test e2e/lab-04/` | `3 / 3` | `4 / 4` | ✅ PASS |

---

## 2. Server API & Regression Test Execution Output (`npm --prefix server test`)

```text
> toktickit-server@1.0.0 test
> vitest run

 RUN  v2.1.9 C:/Users/Windows/OneDrive/kmutt/Lab1_Starter_Scaffold/toktickit/server

 ✓ tests/lab-01/health.test.ts (1 test)
 ✓ tests/lab-01/categories.test.ts (1 test)
 ✓ tests/lab-02/requesters.api.test.ts (1 test)
 ✓ tests/lab-02/tickets-create.api.test.ts (3 tests)
 ✓ tests/lab-02/tickets-my-list.api.test.ts (4 tests)
 ✓ tests/lab-02/ticket-detail-and-attachments.api.test.ts (4 tests)
 ✓ tests/lab-03/seed-users.test.ts (2 tests)
 ✓ tests/lab-03/auth.api.test.ts (5 tests)
 ✓ tests/lab-03/requester-tickets.api.test.ts (4 tests)
 ✓ tests/lab-03/staff-queue.api.test.ts (6 tests)
 ✓ tests/lab-03/comments-notes.api.test.ts (6 tests)
 ✓ tests/lab-03/users-admin.api.test.ts (7 tests)
 ✓ tests/lab-04/actions-taken.api.test.ts (7 tests)
 ✓ tests/lab-04/ticket-workflow.api.test.ts (6 tests)
 ✓ tests/lab-04/requester-dashboard.api.test.ts (3 tests)
 ✓ tests/lab-04/staff-dashboard.api.test.ts (3 tests)

 Test Files  15 passed (15)
      Tests  63 passed (63)
```

---

## 3. Client UI Component & Regression Test Execution Output (`npm --prefix client test`)

```text
> toktickit-client@1.0.0 test
> vitest run

 RUN  v2.1.9 C:/Users/Windows/OneDrive/kmutt/Lab1_Starter_Scaffold/toktickit/client

 ✓ tests/lab-01/App.test.tsx (1 test)
 ✓ tests/lab-02/RequesterSelector.test.tsx (1 test)
 ✓ tests/lab-02/CreateTicket.test.tsx (1 test)
 ✓ tests/lab-02/MyTickets.test.tsx (1 test)
 ✓ tests/lab-02/RequesterTicketDetail.test.tsx (1 test)
 ✓ tests/lab-02/AttachmentSection.test.tsx (1 test)
 ✓ tests/lab-03/Login.test.tsx (4 tests)
 ✓ tests/lab-03/ChangePassword.test.tsx (3 tests)
 ✓ tests/lab-03/AppIntegration.test.tsx (2 tests)
 ✓ tests/lab-04/ActionsTaken.test.tsx (3 tests)
 ✓ tests/lab-04/TicketWorkflow.test.tsx (3 tests)
 ✓ tests/lab-04/RequesterDashboard.test.tsx (2 tests)
 ✓ tests/lab-04/StaffDashboard.test.tsx (3 tests)

 Test Files  13 passed (13)
      Tests  26 passed (26)
```

---

## 4. Acceptance Criteria Verification Checklist (`AC-01` – `AC-12`)

- [x] **AC-01 (`API-01`, `UI-01`, `E2E-01`)**: `POST /api/tickets/:id/actions-taken` persists Action Taken records and automatically binds `performerId` to the authenticated session user.
- [x] **AC-02 (`API-02`, `UI-02`)**: Submitting `followUpRequired = true` without a non-empty `followUpNote` is rejected by both UI inline validation and backend `400 Bad Request`.
- [x] **AC-03 (`API-03`, `UI-03`)**: Requesters attempting `POST` or `PATCH` on `/api/tickets/:id/actions-taken` are blocked with `403 Forbidden`, and create/edit controls are hidden in the UI.
- [x] **AC-04 (`API-04`, `UI-03`, `E2E-01`)**: Requesters can view Actions Taken in read-only mode strictly for tickets they own; unowned tickets return `403 Forbidden`.
- [x] **AC-05 (`API-05`, `E2E-01`)**: Any active IT Staff member can record an Action Taken on a ticket while preserving the primary `Ticket.ownerId`.
- [x] **AC-06 (`API-07`, `UI-04`)**: Backend enforces the formal state machine transition matrix (`PERMITTED_TRANSITIONS`) and rejects illegal jumps with `400 Bad Request`.
- [x] **AC-07 (`API-08`, `UI-04`, `E2E-02`)**: Requester "Problem Appears Resolved" sets `requesterResolved = true` and appends an automated Public Comment without changing `Ticket.status` to `RESOLVED`.
- [x] **AC-08 (`API-09`, `UI-05`, `E2E-02`)**: Stale `expectedUpdatedAt` timestamps on ticket or action updates return `409 Conflict` and trigger the UI conflict recovery banner.
- [x] **AC-09 (`API-10`, `UI-06`, `E2E-03`)**: `GET /api/dashboards/requester` returns metrics strictly scoped to the authenticated requester with interactive status drill-downs.
- [x] **AC-10 (`API-11`, `API-12`, `UI-07`, `E2E-03`)**: `GET /api/dashboards/staff` returns authoritative queue metrics, priority breakdowns, and Administrator `userSummary` counts with queue drill-downs.
- [x] **AC-11 (`API-06`)**: Deactivated user accounts (`isActive = false`) are rejected with `400 Bad Request` when attempting to record or be attributed an Action Taken.
- [x] **AC-12 (`REG-01` – `REG-05`)**: Zero regressions across all Lab 1, Lab 2, and Lab 3 server and client test suites.
