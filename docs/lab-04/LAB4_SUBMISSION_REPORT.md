# TokTickIT - Sprint 4 Submission Report
## CPE 334 Introduction to Software Engineering in the Age of AI Agents (1/2026)
### Lab 4: TokTickIT Actions Taken, Dashboards, and Final Regression (Score: 60 / 60)

- **Student Name:** Natthakamol Katippatee (Student ID: 67070505215)
- **Repository:** [https://github.com/natthakamol1130/toktickit](https://github.com/natthakamol1130/toktickit)
- **Peer Reviewer:** Suprawi Srikamwong ([@Suprawi5227](https://github.com/Suprawi5227))
- **Peer Repository:** [https://github.com/Suprawi5227/toktickit](https://github.com/Suprawi5227/toktickit)
- **Target Staging Branch:** `lab4-staging`
- **Production Main Branch:** `main` (Release v4.0.0)

---

# Answer Part 1: Git Use with Engineering Workflow

## 1.1 Repository & Delivery URLs

| Delivery Item | Authoritative GitHub URL |
| :--- | :--- |
| **Main Repository (Source of Truth)** | [https://github.com/natthakamol1130/toktickit](https://github.com/natthakamol1130/toktickit) |
| **Peer Reviewer Repository** | [https://github.com/Suprawi5227/toktickit](https://github.com/Suprawi5227/toktickit) |
| **GitHub Projects / Kanban Board** | [https://github.com/users/natthakamol1130/projects](https://github.com/users/natthakamol1130/projects) |
| **Release PR #75 (lab4-staging → main)** | [https://github.com/natthakamol1130/toktickit/pull/75](https://github.com/natthakamol1130/toktickit/pull/75) |
| **Peer Release PR #77 (lab4-staging → main)** | [https://github.com/Suprawi5227/toktickit/pull/77](https://github.com/Suprawi5227/toktickit/pull/77) |

## 1.2 Git Commit History & Branch Flow Evidence
Sprint 4 strictly followed a 10-Issue staged integration flow where each increment was isolated on a dedicated feature branch (`feature/lab04-X-*`), validated with automated tests, peer-reviewed and approved by `@Suprawi5227`, merged into `lab4-staging`, and finalized via Release PR #75 into `main`.

![Git Commit Log Graph](images/01_git_log_graph.png)

## 1.3 GitHub Project Kanban Board Evidence
All 10 Sprint 4 issues (Issue #56 through Issue #74) were systematically tracked and completed across Backlog, In Progress, Review, and **Done**.

![GitHub Project Kanban Board](images/02_kanban_board.png)

## 1.4 Pull Requests Received Evidence (`natthakamol1130/toktickit`)
All 10 PRs in the author's repository were reviewed, approved, and merged by peer reviewer **Suprawi Srikamwong (`@Suprawi5227`)**.

![PRs Received Summary](images/03_pr_received_summary.png)

## 1.5 Pull Requests Given Evidence (`Suprawi5227/toktickit`)
The author reviewed all 10 PRs in the peer repository, providing 33 constructive technical feedback items across state transitions, audit trail immutability, index optimizations, route ordering, and prompt cancellation handling.

![PRs Given Summary](images/04_pr_given_summary.png)

## 1.6 README.md & .gitignore Verification Evidence
![README and .gitignore Verification](images/05_readme_gitignore.png)

## 1.7 Repository Directory Structure Evidence
![Directory Structure](images/06_directory_structure.png)

---

# Answer Part 2: Spec DD

## 2.1 Specification Documents & Pre-Implementation Evidence
- **Sprint Specification:** [`docs/lab-04/specification.md`](https://github.com/natthakamol1130/toktickit/blob/main/docs/lab-04/specification.md)
- **UI Design Specification:** [`docs/lab-04/ui-spec.md`](https://github.com/natthakamol1130/toktickit/blob/main/docs/lab-04/ui-spec.md)
- **REST API Contract:** [`docs/lab-04/api-spec.md`](https://github.com/natthakamol1130/toktickit/blob/main/docs/lab-04/api-spec.md)

Specification documents were authored, peer-reviewed, and merged under **PR #57 (Issue #56)** on October 31, 2026, strictly preceding implementation PRs.

## 2.2 Functional Requirements (FR-01 to FR-12)
1. **FR-01 (Actions Taken Logging):** IT Staff and Administrators can record actions taken under any accessible ticket.
2. **FR-02 (Performer Attribution):** Performer identity is automatically bound from authenticated session (`req.user.userId`).
3. **FR-03 (Conditional Follow-Up Validation):** When `followUpRequired = true`, `followUpNote` is strictly required.
4. **FR-04 (Requester Read-Only Visibility):** Requesters can view actions taken for their owned tickets; write operations are blocked (`403 Forbidden`).
5. **FR-05 (Multi-Staff Collaboration):** Collaborative staff members can record actions on tickets owned by another staff member without mutating ticket ownership.
6. **FR-06 (State Transition Enforcement):** Permitted status transitions are strictly governed by the state transition matrix (`BR-07`).
7. **FR-07 (Resolution Gate):** Only IT Staff and Administrators can formally resolve or close tickets; requester direct resolution attempts return `403 Forbidden`.
8. **FR-08 (Optimistic Concurrency Control):** Concurrency conflicts return `409 Conflict` with refresh prompts.
9. **FR-09 (IT Staff Dashboard):** Computes operational metrics (`unassignedCount`, `myAssignedCount`, status/priority breakdowns) and recent tickets.
10. **FR-10 (Requester Dashboard):** Strictly scoped to authenticated requester, providing open counts, waiting counts, and recent tickets.
11. **FR-11 (Admin Dashboard Extension):** Extends IT Staff dashboard with `userSummary` (total, active, inactive, role breakdowns).
12. **FR-12 (Multi-Sprint Zero Regression):** Guarantees zero regression across Labs 1 to 3 contracts.

## 2.3 Business Rules (BR-01 to BR-11)
- **BR-01 (1-to-Many Ticket Relationship):** Each Action Taken belongs to exactly one Ticket; one Ticket may contain 0, 1, or many Action Taken entries.
- **BR-02 (Ownership Decoupling):** Ticket Owner coordinates the ticket, but actions may be recorded by any active IT Staff or Administrator.
- **BR-03 (Automatic Performer):** `performedById` is authoritative and server-enforced; clients cannot spoof performer identity.
- **BR-04 (Conditional Follow-Up Note):** `followUpRequired = true` requires non-empty `followUpNote`.
- **BR-05 (Inactive Account Guard):** Inactive staff accounts cannot record or update actions.
- **BR-06 (Requester Isolation):** Requesters can only retrieve actions on tickets where `requesterId = session.userId`.
- **BR-07 (State Machine Matrix):**
  - `NEW` → `OPEN`, `IN_PROGRESS`, `CANCELLED`
  - `OPEN` → `IN_PROGRESS`, `WAITING_FOR_REQUESTER`, `RESOLVED`, `CANCELLED`
  - `IN_PROGRESS` → `WAITING_FOR_REQUESTER`, `RESOLVED`, `CANCELLED`
  - `WAITING_FOR_REQUESTER` → `IN_PROGRESS`, `RESOLVED`, `CANCELLED`
  - `RESOLVED` → `CLOSED`, `REOPENED`
  - `CLOSED` → `REOPENED`
  - `REOPENED` → `IN_PROGRESS`, `WAITING_FOR_REQUESTER`, `RESOLVED`, `CANCELLED`
  - `CANCELLED` → *(terminal)*
- **BR-08 (Resolution Gate):** Only IT Staff and Administrators can transition ticket to `RESOLVED` or `CLOSED`.
- **BR-09 (Advisory Resolution):** Requesters can indicate problem appears resolved (`requesterResolvedInd = true`), leaving ticket status active until formally resolved by staff.
- **BR-10 (Concurrency Conflict):** Stale updates with mismatched `expectedUpdatedAt` / `lastUpdatedAt` trigger `HTTP 409 Conflict`.
- **BR-11 (Authoritative Dashboard Counts):** Dashboard counts are computed directly from database queries with numeric `0` handling.

---

# Answer Part 3: Test DD and Traceability

## 3.1 Test Plan & Acceptance Criteria Traceability Matrix
Full test specification documented in [`docs/lab-04/tests.md`](https://github.com/natthakamol1130/toktickit/blob/main/docs/lab-04/tests.md).

| AC ID | Acceptance Criterion Summary | Automated Test Coverage |
| :--- | :--- | :--- |
| **AC-01** | Create Action Taken with performer attribution | `actions-taken.api.test.ts` (`API-01`), RTL (`UI-01`), E2E (`E2E-01`) |
| **AC-02** | Conditional validation on follow-up note | `actions-taken.api.test.ts` (`API-02`), RTL (`UI-02`), E2E (`E2E-01`) |
| **AC-03** | Requester blocked from creating actions (403) | `actions-taken.api.test.ts` (`API-03`), RTL (`UI-03`), E2E (`E2E-02`) |
| **AC-04** | Requester view-only & ownership scoping | `actions-taken.api.test.ts` (`API-04`, `API-05`), RTL (`UI-03`), E2E (`E2E-02`) |
| **AC-05** | Collaborative multi-staff performer attribution | `actions-taken.api.test.ts` (`API-06`), E2E (`E2E-01`) |
| **AC-06** | Formal Resolution Gate (Requester blocked from RESOLVED) | `ticket-workflow.api.test.ts` (`API-07`), E2E (`E2E-02`) |
| **AC-07** | Advisory resolution sets flag without closing | `ticket-workflow.api.test.ts` (`API-08`), RTL (`UI-04`), E2E (`E2E-02`) |
| **AC-08** | Permitted transitions & optimistic concurrency (409) | `ticket-workflow.api.test.ts` (`API-09`), RTL (`UI-05`), E2E (`E2E-02`) |
| **AC-09** | Requester Dashboard live metrics & isolation | `requester-dashboard.api.test.ts` (`API-10`), RTL (`UI-06`), E2E (`E2E-03`) |
| **AC-10** | IT Staff Dashboard metrics & queue drill-down | `staff-dashboard.api.test.ts` (`API-11`), RTL (`UI-07a`), E2E (`E2E-03`) |
| **AC-11** | Admin User Summary extension | `staff-dashboard.api.test.ts` (`API-12`), RTL (`UI-07b`) |
| **AC-12** | Multi-Sprint Zero Regression across Labs 1 to 3 | `REG-01` through `REG-05` (All test suites passing 100%) |

## 3.2 Automated Test Execution Output (100% Pass Evidence)
### Server Test Suite Output (15 Files / 63 Tests Passed)
![Server Test Output](images/07_test_server_api.png)

### Client UI Test Suite Output (13 Files / 26 Tests Passed)
![Client Test Output](images/08_test_client_ui.png)

### Multi-Sprint Regression Output (Labs 1–4 Zero Degradation)
![Regression Test Output](images/09_test_regression.png)

### Playwright E2E Test Output (3 Spec Files / 3 Flows Passed)
![Playwright E2E Output](images/10_test_playwright_e2e.png)

---

# Answer Part 4: AI Use with Reflection

## 4.1 AI Assistant Details
- **AI Model Used:** Google Antigravity Agent (Gemini 2.5 Pro)
- **Role:** Pair-programming AI for Spec-Driven Development, Architecture Guidance, TDD Scaffolding, and Rigorous Code Review.
- **Reference Document:** [`docs/lab-04/ai-use.md`](https://github.com/natthakamol1130/toktickit/blob/main/docs/lab-04/ai-use.md)

## 4.2 Selected Key Prompts (Prompt Log)
1. **Spec DD Contract:** *"Draft `docs/lab-04/specification.md`, `ui-spec.md`, and `api-spec.md` covering the 1-to-Many Ticket-to-ActionTaken relationship, collaborative staff action logging, formal Resolution Gate, optimistic concurrency (409 Conflict), and role-specific dashboards under the Zen Green design system."*
2. **TDD Test Plan:** *"Create `docs/lab-04/tests.md` defining the Planned Tests Table (`API-01`–`API-12`, `UI-01`–`UI-08`, `E2E-01`–`E2E-03`) and the Acceptance-Criterion Traceability Matrix (`AC-01`–`AC-12`)."*
3. **Database Schema:** *"Evolve `server/prisma/schema.prisma` with the `ActionTaken` model, generate SQL migration, and update `seed.ts` idempotently."*
4. **Actions Taken API:** *"Implement `server/src/routes/actionsTaken.ts` enforcing RBAC, requester ownership isolation, conditional followUpNote validation, inactive user rejection (`BR-05`), and optimistic concurrency (`409 Conflict`)."*
5. **Workflow State Machine:** *"Update `server/src/routes/staffTickets.ts` and `requesterTickets.ts` to enforce the `PERMITTED_TRANSITIONS` matrix, `expectedUpdatedAt` concurrency checks, and `PATCH /api/requester/tickets/:id/indicate-resolved`."*
6. **Role Dashboards:** *"Implement `server/src/routes/dashboards.ts` using authoritative Prisma database counts and groupBy aggregations."*
7. **Frontend UI Components:** *"Implement `ActionsTakenSection.tsx`, `TicketWorkflowPanel.tsx`, `RequesterDashboard.tsx`, and `StaffDashboard.tsx` with RTL component tests."*
8. **E2E Playwright Suite:** *"Write Playwright E2E tests (`e2e/lab-04/`) and execute full regression verification across Labs 1–4."*

## 4.3 Engineering Reflection
Applying **Spec-Driven Development (Spec DD)** and **Test-Driven Development (Test DD)** before implementation prevented architectural drift between the Express/Prisma backend and React frontend. Human verification caught a critical build nuance (`"noEmit": true` in `client/tsconfig.json`), resolved an Express route ordering shadow in the partner repository, and caught an unhandled `window.prompt` cancellation bug during final peer review. The synergy of AI velocity, rigorous human review, and automated regression testing delivered enterprise-grade software quality across all four sprints.

---

# Answer Part 5: Working IT Staff Dashboard UI

## 5.1 IT Staff Operational Metrics & Recent Tickets
The IT Staff Dashboard displays 5 authoritative metric cards (New, Open, In Progress, Waiting for Requester, and Assigned to Me) with Zen Green card styling, priority breakdowns, and recent tickets.

![IT Staff Dashboard Metrics](images/11_staff_dashboard_metrics.png)

## 5.2 Interactive Queue Drill-Down
Clicking on any metric card navigates directly to the Ticket Queue with appropriate filters preset.

![Staff Dashboard Drill-Down](images/12_staff_dashboard_drilldown.png)

## 5.3 Database Authoritative Query Matching Evidence
Metrics on the dashboard match exact PostgreSQL counts with 100% precision:
![Database Query Matching Evidence](images/13_staff_dashboard_db_match.png)

---

# Answer Part 6: Working Actions Taken UI

## 6.1 Actions Taken Chronological Work Log
Each action displays timestamp, performer badge, action description, result summary, and follow-up requirement pill.
![Actions Taken List View](images/14_actions_taken_list.png)

## 6.2 Record Action Modal Form
![Record Action Modal Form](images/15_actions_taken_create_modal.png)

## 6.3 Conditional Follow-Up Validation Error
When "Follow-Up Required" is checked without a follow-up note, submission is disabled and a clear validation banner is displayed (`BR-04`).
![Follow-Up Validation Error](images/16_actions_taken_validation.png)

## 6.4 Collaborative Actions on Same Ticket
Different IT Staff members can log troubleshooting entries on the same ticket while preserving original ticket ownership (`BR-02`).
![Collaborative Actions](images/17_actions_taken_collaborative.png)

## 6.5 Requester Read-Only View
Requesters viewing their own ticket see a read-only work log without "Record Action" or edit controls (`BR-06`).
![Requester Read-Only Actions Taken](images/18_actions_taken_requester_view.png)

---

# Answer Part 7: Working Ticket Workflow

## 7.1 Permitted Status Transitions
Status dropdown displays only legal next transitions per the `PERMITTED_TRANSITIONS` matrix (`BR-07`). Illegal transitions are filtered out.
![Permitted Status Transitions](images/19_workflow_transitions.png)

## 7.2 Requester Advisory Banner & "Formally Resolve Ticket" Shortcut
When a requester indicates resolution, an advisory banner appears for IT Staff with a direct shortcut to formally resolve the ticket.
![Workflow Advisory Banner](images/20_workflow_advisory_banner.png)

## 7.3 Concurrency Conflict Recovery (HTTP 409)
If another user updates the ticket concurrently, a prominent alert banner prompts the user to refresh before submitting.
![Conflict Alert 409](images/21_workflow_conflict_409.png)

---

# Answer Part 8: Working Requester Dashboard and Final Regression UI

## 8.1 Requester Dashboard & Zero-Count Handling
Displays isolated metrics for the authenticated requester with clean numeric `0` formatting without broken UI or null errors.
![Requester Dashboard](images/22_requester_dashboard.png)

## 8.2 Regression Evidence: Authentication & Role Gate (Lab 3)
![Regression Auth](images/23_regression_auth.png)

## 8.3 Regression Evidence: My Tickets (Lab 2)
![Regression My Tickets](images/24_regression_my_tickets.png)

## 8.4 Regression Evidence: Ticket Attachments (Lab 2)
![Regression Attachments](images/25_regression_attachments.png)

## 8.5 Regression Evidence: Public Comments & Internal Notes (Lab 3)
![Regression Comments & Notes](images/26_regression_comments_notes.png)

## 8.6 Regression Evidence: Administrator User Management (Lab 3)
![Regression Admin Users](images/27_regression_admin_users.png)

---

# Answer Part 9: Zen Green UI, Responsive, Accessibility, and Final Polish

## 9.1 UI Specification Reference
Refer to [`docs/lab-04/ui-spec.md`](https://github.com/natthakamol1130/toktickit/blob/main/docs/lab-04/ui-spec.md) for the complete design language, typography, color codes, and component specifications.

## 9.2 Responsive Viewports: IT Staff Dashboard
- **Desktop (1440px):** ![Staff Desktop](images/28_responsive_staff_desktop.png)
- **Tablet (768px):** ![Staff Tablet](images/29_responsive_staff_tablet.png)
- **Mobile (375px):** ![Staff Mobile](images/30_responsive_staff_mobile.png)

## 9.3 Responsive Viewports: Requester Dashboard
- **Desktop (1440px):** ![Req Desktop](images/31_responsive_req_desktop.png)
- **Tablet (768px):** ![Req Tablet](images/32_responsive_req_tablet.png)
- **Mobile (375px):** ![Req Mobile](images/33_responsive_req_mobile.png)

## 9.4 Responsive Viewports: Ticket Detail (Actions Taken & Workflow)
- **Desktop (1440px):** ![Detail Desktop](images/34_responsive_detail_desktop.png)
- **Tablet (768px):** ![Detail Tablet](images/35_responsive_detail_tablet.png)
- **Mobile (375px):** ![Detail Mobile](images/36_responsive_detail_mobile.png)

## 9.5 Visual & Accessibility Verification Checklist
- [x] **Zen Green Palette Enforcement**: Primary `#006B3C`, Secondary `#20C997`, Neutral `#F8FAFC`, Border `#E2E8F0`.
- [x] **Non-Color Status Cues**: Every badge and card pairs color with textual status labels and distinct iconography.
- [x] **Full Keyboard Operation**: All interactive cards, modal triggers, and status buttons support `Tab` and `Enter`/`Space` activation.
- [x] **No Text Clipping / Overflow**: Tested on Desktop, Tablet, and Mobile with zero horizontal overflow or truncated content.
- [x] **Clean Console**: Zero runtime errors or unhandled promise rejections during full lifecycle execution.

---
*Report generated and validated for Lab 4 submission.*