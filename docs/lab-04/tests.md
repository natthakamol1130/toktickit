# TokTickIT Lab 4 Test Plan and Traceability Matrix

## 1. Test Strategy & Architecture
Sprint 4 implements rigorous **Test-Driven Development (Test DD / TDD)** covering parent-child Actions Taken work records, formal Ticket status transitions with resolution gates, optimistic concurrency detection, authoritative role-based dashboards, and full regression verification of Labs 1–3 functionality.

### 1.1 Testing Layers & Tools
- **Server API & Integration Tests**: Executed using **Vitest** and **Supertest** against an ephemeral or isolated test PostgreSQL database.
  - Path: `server/tests/lab-04/`
  - Scope: REST API contracts, role authorization (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`), schema validation, database foreign key constraints, state transition gates, and concurrency checks.
- **Client Component & Integration Tests**: Executed using **Vitest**, **React Testing Library (RTL)**, and **Jest-DOM**.
  - Path: `client/tests/lab-04/`
  - Scope: Action Taken history list, create/edit modal drawers, follow-up note dynamic validation, resolution advisory banners, dashboard metric cards, drill-down parameters, and empty/error states.
- **End-to-End (E2E) Workflow Tests**: Executed using **Playwright** across Chromium, Firefox, and WebKit on Desktop (1280x800), Tablet (768x1024), and Mobile (375x667) viewports.
  - Path: `e2e/lab-04/`
  - Scope: Complete multi-role user journeys, live database mutations, navigation drill-down integrity, and safe concurrency conflict recovery.
- **Regression Test Suite**: Automated execution of all existing test suites from Lab 1, Lab 2, and Lab 3 to guarantee zero regression.

---

## 2. Planned Tests Table

| Test ID | Level / Type | Requirement / AC | What It Tests | Expected Result | Automated Test File | Final Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **API-01** | API / Integration | AC-01, FR-01, FR-02 | Create valid Action Taken under Ticket | 201 Created; auto-populates `performerId` with authenticated user | `server/tests/lab-04/actions-taken.api.test.ts` | Pass |
| **API-02** | API / Validation | AC-02, FR-03, BR-03 | Action Taken with `followUpRequired=true` but missing `followUpNote` | 400 Bad Request; descriptive validation error returned | `server/tests/lab-04/actions-taken.api.test.ts` | Pass |
| **API-03** | API / Auth | AC-03, FR-04, BR-04 | Requester attempts to create or update Action Taken | 403 Forbidden; write operation blocked by backend | `server/tests/lab-04/actions-taken.api.test.ts` | Pass |
| **API-04** | API / Security | AC-04, FR-04, BR-04 | Requester views Actions Taken for unowned Ticket | 403 Forbidden; ownership boundary enforced strictly | `server/tests/lab-04/actions-taken.api.test.ts` | Pass |
| **API-05** | API / Workflow | AC-05, FR-05, BR-02 | Non-owner IT Staff member records Action Taken | 201 Created; action recorded under actor while ticket owner stays intact | `server/tests/lab-04/actions-taken.api.test.ts` | Pass |
| **API-06** | API / Integrity | AC-11, FR-13, BR-05 | Inactive IT Staff user attempts to record Action Taken | 400 Bad Request; inactive assignee/performer rejected | `server/tests/lab-04/actions-taken.api.test.ts` | Pass |
| **API-07** | API / Workflow | AC-06, FR-07, BR-06 | Disallowed status transition (e.g., `OPEN` directly to `CLOSED`) | 400 Bad Request; transition matrix enforced on backend | `server/tests/lab-04/ticket-workflow.api.test.ts` | Pass |
| **API-08** | API / Workflow | AC-07, FR-08, BR-07 | Requester marks ticket resolved; verify status remains non-resolved | Advisory flag set; status unchanged until IT Staff resolves | `server/tests/lab-04/ticket-workflow.api.test.ts` | Pass |
| **API-09** | API / Concurrency | AC-08, FR-09, BR-08 | Concurrent ticket update with stale `expectedUpdatedAt` | 409 Conflict; server detects race condition and returns current record | `server/tests/lab-04/ticket-workflow.api.test.ts` | Pass |
| **API-10** | API / Dashboard | AC-09, FR-10, BR-09 | Requester dashboard metrics isolation | 200 OK; metrics strictly scoped to authenticated Requester's tickets | `server/tests/lab-04/requester-dashboard.api.test.ts` | Pass |
| **API-11** | API / Dashboard | AC-10, FR-11, BR-10 | IT Staff dashboard operational metrics & queue calculations | 200 OK; accurate real-time aggregates from authoritative DB queries | `server/tests/lab-04/staff-dashboard.api.test.ts` | Pass |
| **API-12** | API / Dashboard | FR-11, BR-11 | Admin dashboard user summary metrics | 200 OK; includes active/inactive user counts alongside queue metrics | `server/tests/lab-04/staff-dashboard.api.test.ts` | Pass |
| **UI-01** | UI Component | AC-01, FR-01 | Actions Taken list rendering on Ticket Detail | Chronological list rendered with performer, result, and follow-up badges | `client/tests/lab-04/ActionsTaken.test.tsx` | Pass |
| **UI-02** | UI Component | AC-02, FR-03 | Add Action Taken modal dynamic follow-up validation | Toggling follow-up displays required note input and validates before submit | `client/tests/lab-04/ActionsTaken.test.tsx` | Pass |
| **UI-03** | UI Component | AC-04, FR-04 | Requester view of Actions Taken tab | Read-only mode rendered; "Add Action" and "Edit" buttons hidden | `client/tests/lab-04/ActionsTaken.test.tsx` | Pass |
| **UI-04** | UI Component | AC-06, AC-07 | Status transition dropdown and Resolution advisory banner | Shows only permitted transitions; displays notice if requester resolved | `client/tests/lab-04/TicketWorkflow.test.tsx` | Pass |
| **UI-05** | UI Component | AC-08, FR-09 | Concurrency 409 Conflict modal and recovery | Conflict dialog shown on 409 response with "Refresh Details" button | `client/tests/lab-04/TicketWorkflow.test.tsx` | Pass |
| **UI-06** | UI Component | AC-09, FR-10 | Requester Dashboard metric cards and quick actions | Displays Open, In Progress, Resolved counts; drill-down links navigate to My Tickets | `client/tests/lab-04/RequesterDashboard.test.tsx` | Pass |
| **UI-07** | UI Component | AC-10, FR-11 | IT Staff Dashboard operational metric cards & recent tickets | Displays New, In Progress, My Assigned counts; drill-down links to queue | `client/tests/lab-04/StaffDashboard.test.tsx` | Pass |
| **UI-08** | UI Component | BR-11, FR-14 | Dashboard zero-state and error-state handling | Renders "0" cleanly without NaN; renders user-friendly error banners on API failure | `client/tests/lab-04/StaffDashboard.test.tsx` | Pass |
| **E2E-01** | E2E Workflow | AC-01, AC-04, AC-05 | End-to-end multi-staff Actions Taken recording flow | Staff records action -> collaborator adds follow-up -> Requester views read-only | `e2e/lab-04/actions-taken-flow.spec.ts` | Pass |
| **E2E-02** | E2E Workflow | AC-07, AC-08 | Ticket Resolution Gate & Stale Update Conflict flow | Requester indicates resolved -> Staff confirms -> Concurrency conflict caught | `e2e/lab-04/ticket-resolution.spec.ts` | Pass |
| **E2E-03** | E2E Workflow | AC-09, AC-10 | Requester & IT Staff Dashboard drill-down flow | Click dashboard metric cards -> verify filtered queue reflects exact counts | `e2e/lab-04/dashboards.spec.ts` | Pass |
| **REG-01** | Regression | AC-12, FR-15 | User Authentication & Change Password workflow (Lab 3) | Login, token persistence, and mandatory password change intact | `server/tests/lab-03/auth.api.test.ts` | Pass |
| **REG-02** | Regression | AC-12, FR-15 | Requester Ticket creation & file attachments (Lab 2) | File upload, size limit, and attachment download intact | `server/tests/lab-02/` | Pass |
| **REG-03** | Regression | AC-12, FR-15 | Public Comments & role-restricted Internal Notes (Lab 3) | Comments visible to all; Internal Notes strictly 403 for Requesters | `server/tests/lab-03/comments-notes.api.test.ts` | Pass |
| **REG-04** | Regression | AC-12, FR-15 | Administrator User Management & Safety Guards (Lab 3) | Admin self-deactivation & last-admin protections pass | `server/tests/lab-03/users-admin.api.test.ts` | Pass |
| **REG-05** | Regression | AC-12, FR-15 | Multi-role UI regression suite | All previous UI screens (Login, Queue, Detail, Admin) render cleanly | `client/tests/lab-03/` | Pass |

---

## 3. Acceptance-Criterion Traceability Matrix

| Acceptance Criterion | Criterion Summary | Covered Automated Test IDs | Verifying Test Files | Final Status |
| :--- | :--- | :--- | :--- | :---: |
| **AC-01** | Action Taken Created under Ticket with authenticated performer | `API-01`, `UI-01`, `E2E-01` | `actions-taken.api.test.ts`, `ActionsTaken.test.tsx`, `actions-taken-flow.spec.ts` | Pass |
| **AC-02** | Action Taken Follow-up Note mandatory when `followUpRequired=true` | `API-02`, `UI-02` | `actions-taken.api.test.ts`, `ActionsTaken.test.tsx` | Pass |
| **AC-03** | Requester forbidden to create/update Actions Taken (403) | `API-03`, `UI-03` | `actions-taken.api.test.ts`, `ActionsTaken.test.tsx` | Pass |
| **AC-04** | Requester has read-only visibility into Actions Taken for owned tickets | `API-04`, `UI-03`, `E2E-01` | `actions-taken.api.test.ts`, `ActionsTaken.test.tsx`, `actions-taken-flow.spec.ts` | Pass |
| **AC-05** | Non-owner IT Staff can record Action Taken while preserving Ticket Owner | `API-05`, `E2E-01` | `actions-taken.api.test.ts`, `actions-taken-flow.spec.ts` | Pass |
| **AC-06** | Permitted status transitions strictly enforced on backend | `API-07`, `UI-04` | `ticket-workflow.api.test.ts`, `TicketWorkflow.test.tsx` | Pass |
| **AC-07** | Resolution Gate: Requester resolved is advisory, Staff formal resolution | `API-08`, `UI-04`, `E2E-02` | `ticket-workflow.api.test.ts`, `TicketWorkflow.test.tsx`, `ticket-resolution.spec.ts` | Pass |
| **AC-08** | Concurrency conflict detection (409 Conflict) on stale updates | `API-09`, `UI-05`, `E2E-02` | `ticket-workflow.api.test.ts`, `TicketWorkflow.test.tsx`, `ticket-resolution.spec.ts` | Pass |
| **AC-09** | Requester Dashboard metrics strictly scoped to user with drill-downs | `API-10`, `UI-06`, `E2E-03` | `requester-dashboard.api.test.ts`, `RequesterDashboard.test.tsx`, `dashboards.spec.ts` | Pass |
| **AC-10** | IT Staff Dashboard operational queue metrics with drill-downs | `API-11`, `UI-07`, `E2E-03` | `staff-dashboard.api.test.ts`, `StaffDashboard.test.tsx`, `dashboards.spec.ts` | Pass |
| **AC-11** | Inactive user account assignment / action rejection | `API-06` | `actions-taken.api.test.ts` | Pass |
| **AC-12** | 100% Regression Preservation from Labs 1–3 | `REG-01` through `REG-05` | Complete historical test suites in `server/tests/` and `client/tests/` | Pass |

---

## 4. Responsive & Accessibility Test Matrix

| Viewport Category | Resolution | Tested Pages / Components | Verification Criteria |
| :--- | :--- | :--- | :--- |
| **Desktop** | $1280 \times 800$ | IT Staff Dashboard, Requester Dashboard, Ticket Detail Actions Taken | Full 5-column metric layout, expanded recent ticket table, split modal form. |
| **Tablet** | $768 \times 1024$ | IT Staff Dashboard, Requester Dashboard, Ticket Detail Actions Taken | 2-column wrapping for metric cards, responsive table horizontal scrolling if needed without page clipping. |
| **Mobile** | $375 \times 667$ | IT Staff Dashboard, Requester Dashboard, Ticket Detail Actions Taken | Single-column stacked cards, full-width action buttons, touch-friendly tap targets ($\ge 44\text{px}$). |
| **Accessibility** | All Viewports | Entire Application | Keyboard `Tab` navigation order, visible focus rings, WCAG AA contrast ratio $\ge 4.5:1$, screen reader ARIA labels. |
