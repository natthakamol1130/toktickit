# TokTickIT Lab 3 Test Plan and Results

## 1. Test Strategy
The testing strategy covers Unit, API/Integration, UI Component, Security Authorization, and End-to-End (E2E) levels using **Vitest**, **React Testing Library**, and **Playwright**.

- **Server API Tests**: Executed in `server/tests/lab-03/` using Vitest & Supertest to verify authentication, session validation, role authorization, IT Staff Queue queries, Ticket operations, Comments/Notes scoping, and Administrator user management rules.
- **Client UI Component Tests**: Executed in `client/src/tests/lab-03/` using Vitest & React Testing Library to verify form validation, password rules, role navigation, queue filters/sorting, modal drawers, and responsive feedback.
- **E2E Tests**: Executed in `e2e/lab-03/` via Playwright across Desktop, Tablet, and Mobile viewports to verify complete multi-role workflows.

---

## 2. Planned Tests Table

| Test ID | Level / Type | Requirement / AC | What It Tests | Expected Result | Automated Test File | Final Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **API-01** | API | AC-01, FR-01 | Valid user authentication (Login) | 200 OK; returns user identity and role | `server/tests/lab-03/auth.api.test.ts` | Pass |
| **API-02** | API | BR-01, FR-01 | Login with invalid password or inactive account | 401 Unauthorized; safe error message | `server/tests/lab-03/auth.api.test.ts` | Pass |
| **API-03** | API | AC-02, BR-02 | Mandatory password change enforcement | Access blocked until valid new password saved | `server/tests/lab-03/auth.api.test.ts` | Pass |
| **API-04** | API | AC-03, BR-03 | Requester ownership isolation with session auth | Returns only owned tickets regardless of client input | `server/tests/lab-03/authorization.api.test.ts` | Pass |
| **API-05** | API | AC-04, BR-04 | Requester attempts to request Internal Notes endpoint | 403 Forbidden; no note content exposed | `server/tests/lab-03/comments-notes.api.test.ts` | Pass |
| **API-06** | API | AC-05, FR-05..08 | IT Staff Queue query with search, filter, sort, pagination | 200 OK; returns matching subset and pagination metadata | `server/tests/lab-03/staff-queue.api.test.ts` | Pass |
| **API-07** | API | AC-08, FR-09,10 | Claim/Reassign ticket owner and set IT Priority | 200 OK; updated ownership and IT Priority saved | `server/tests/lab-03/staff-ticket-detail.api.test.ts` | Pass |
| **API-08** | API | FR-11, BR-05 | Permitted status transition workflow | Status updated according to transition rules | `server/tests/lab-03/staff-ticket-detail.api.test.ts` | Pass |
| **API-09** | API | AC-11, FR-15..19 | Admin User Listing, Search, Filter, Create User | 200 OK / 201 Created; user created with single role | `server/tests/lab-03/users-admin.api.test.ts` | Pass |
| **API-10** | API | AC-06, BR-09,10 | Admin self-deactivation & last Admin protection | 400 Bad Request; server rejects dangerous action | `server/tests/lab-03/users-admin.api.test.ts` | Pass |
| **UI-01** | UI | FR-01, AC-01 | Login screen form validation & busy state | Validation errors shown; submit button displays spinner | `client/src/tests/lab-03/Login.test.tsx` | Pass |
| **UI-02** | UI | FR-02, AC-02 | Mandatory Password Change screen rule validation | Real-time checklist updates; submit enables when valid | `client/src/tests/lab-03/ChangePassword.test.tsx` | Pass |
| **UI-03** | UI | FR-05..08 | Staff Ticket Queue filter/sort controls & table | Filter dropdowns update list; badge colors match tokens | `client/src/tests/lab-03/StaffTicketQueue.test.tsx` | Pass |
| **UI-04** | UI | FR-09..13 | Staff Ticket Detail operational sidebar & comment tabs | Sidebar updates status/owner; Internal Notes styled amber | `client/src/tests/lab-03/StaffTicketDetail.test.tsx` | Pass |
| **UI-05** | UI | FR-15..19 | Admin User Management list & Create/Edit Drawer | Drawer opens; role dropdown & status toggle work | `client/src/tests/lab-03/UserManagement.test.tsx` | Pass |
| **E2E-01** | E2E | AC-01, AC-02 | Login & Mandatory First Password Change Flow | Login with initial pass -> forced change -> enter app | `e2e/lab-03/authentication.spec.ts` | Pass |
| **E2E-02** | E2E | AC-05, FR-09..13 | IT Staff Ticket Queue & Operational Flow | Login as Staff -> filter queue -> open ticket -> claim & note | `e2e/lab-03/staff-ticket-flow.spec.ts` | Pass |
| **E2E-03** | E2E | AC-06, FR-15..19 | Administrator User Management & Safety Flow | Login as Admin -> create user -> reset password -> safety guard | `e2e/lab-03/user-administration.spec.ts` | Pass |

---

## 3. Acceptance-Criterion Traceability Matrix

| Acceptance Criterion | Description | Covered Automated Tests | Verification Status |
| :--- | :--- | :--- | :---: |
| **AC-01** | User Login & Role Authentication | `API-01`, `UI-01`, `E2E-01` | Covered |
| **AC-02** | Mandatory First Password Change Enforcement | `API-03`, `UI-02`, `E2E-01` | Covered |
| **AC-03** | Requester Session Ownership Isolation | `API-04`, `authorization.api.test.ts` | Covered |
| **AC-04** | Internal Notes Role Protection (403 Forbidden) | `API-05`, `comments-notes.api.test.ts` | Covered |
| **AC-05** | IT Staff Queue Query, Search, Filter & Pagination | `API-06`, `UI-03`, `E2E-02` | Covered |
| **AC-06** | Administrator Safety Guards (Self/Last Admin Protection) | `API-10`, `UI-05`, `E2E-03` | Covered |
| **AC-07** | Inactive User Account Rejection (401 Unauthorized) | `API-02`, `auth.api.test.ts` | Covered |
| **AC-08** | Ticket Ownership Claim/Reassign & IT Priority Update | `API-07`, `UI-04`, `E2E-02` | Covered |
| **AC-09** | Role-Restricted Internal Notes Persistence & Visibility | `API-05`, `UI-04`, `E2E-02` | Covered |
| **AC-10** | Requester Public Comment & Resolution Indicator | `comments-notes.api.test.ts`, `StaffTicketDetail.test.tsx` | Covered |
| **AC-11** | Admin User Creation with Initial Password & Single Role | `API-09`, `UI-05`, `E2E-03` | Covered |
| **AC-12** | Responsive Viewport Reflow & Zen Green Styling | `E2E-01`, `E2E-02`, `E2E-03` | Covered |

---

## 4. Responsive and Visual Checklist

- [ ] **Desktop ($\ge 992\text{px}$)**: Full navigation bar; multi-column queue table; split ticket detail view.
- [ ] **Tablet ($768\text{px} - 991\text{px}$)**: Reflowed filter controls; responsive table wrapping.
- [ ] **Mobile ($< 768\text{px}$)**: Vertical card view for Queue and User Management; stacked communication panels.
- [ ] **Zen Green Badge Styling**: Status, Requested Priority, IT Priority, and Role badges properly colored.

---

## 5. Test Commands

```bash
# Run server API test suite
cd server && npm test

# Run client UI unit test suite
cd client && npm test

# Run Playwright E2E test suite
npx playwright test
```

---

## 6. Final Results
All planned unit, API, UI component, authorization, and E2E tests pass cleanly on the final `main` branch.
