# Lab 4 Peer Reviewer Document (`reviewer.md`)

- **Student Name:** Natthakamol Katippatee (Student ID: 67070505215)
- **Repository:** [`natthakamol1130/toktickit`](https://github.com/natthakamol1130/toktickit)
- **Peer Reviewer:** Suprawi Srikamwong ([`@Suprawi5227`](https://github.com/Suprawi5227))
- **Peer Repository:** [`Suprawi5227/toktickit`](https://github.com/Suprawi5227/toktickit)
- **Staging Branch:** `lab4-staging`
- **Main Branch:** `main`

---

## 1. Reviewer Identity Verification
All pull requests in [`natthakamol1130/toktickit`](https://github.com/natthakamol1130/toktickit) were peer-reviewed and merged by **Suprawi Srikamwong (`@Suprawi5227`)** into `lab4-staging` and `main`. Likewise, all pull requests in [`Suprawi5227/toktickit`](https://github.com/Suprawi5227/toktickit) were reviewed with constructive technical feedback and approved by **Natthakamol Katippatee (`@natthakamol1130`)**.

---

## 2. Pull Requests Received (`natthakamol1130/toktickit`)

| Issue # | PR # | Branch Name | Feature Title | Reviewer | Status | Direct GitHub PR Link |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| #56 | PR #57 | `feature/lab04-1-spec-contract` | `[Lab 4] Spec DD: Engineering Specification, UI Spec & API Contract (#56)` | `@Suprawi5227` | Merged | [PR #57](https://github.com/natthakamol1130/toktickit/pull/57) |
| #58 | PR #59 | `feature/lab04-2-test-plan` | `[Lab 4] Test DD: Test Plan & AC Traceability Matrix (#58)` | `@Suprawi5227` | Merged | [PR #59](https://github.com/natthakamol1130/toktickit/pull/59) |
| #60 | PR #61 | `feature/lab04-3-db-schema-and-seed` | `[Lab 4] Database Schema Evolution (ActionTaken) & Idempotent Seed (#60)` | `@Suprawi5227` | Merged | [PR #61](https://github.com/natthakamol1130/toktickit/pull/61) |
| #62 | PR #63 | `feature/lab04-4-actions-taken-api` | `[Lab 4] Actions Taken API: Create, List, Update & RBAC Enforcement (#62)` | `@Suprawi5227` | Merged | [PR #63](https://github.com/natthakamol1130/toktickit/pull/63) |
| #64 | PR #65 | `feature/lab04-5-ticket-workflow-api` | `[Lab 4] Ticket Workflow API: Status Transitions, Resolution Gate & Concurrency (#64)` | `@Suprawi5227` | Merged | [PR #65](https://github.com/natthakamol1130/toktickit/pull/65) |
| #66 | PR #67 | `feature/lab04-6-dashboards-api` | `[Lab 4] Dashboards API: Requester, IT Staff & Admin Aggregations (#66)` | `@Suprawi5227` | Merged | [PR #67](https://github.com/natthakamol1130/toktickit/pull/67) |
| #68 | PR #69 | `feature/lab04-7-ticket-detail-actions-ui` | `[Lab 4] Ticket Detail UI: Actions Taken Section, Status Workflow & Conflict Recovery (#68)` | `@Suprawi5227` | Merged | [PR #69](https://github.com/natthakamol1130/toktickit/pull/69) |
| #70 | PR #71 | `feature/lab04-8-role-dashboards-ui` | `[Lab 4] Dashboards UI: Requester, IT Staff & Admin Dashboards with Queue Drill-Down (#70)` | `@Suprawi5227` | Merged | [PR #71](https://github.com/natthakamol1130/toktickit/pull/71) |
| #72 | PR #73 | `feature/lab04-9-e2e-regression-and-docs` | `[Lab 4] Playwright E2E Suite, Full Sprint Regression & Verification Documentation (#72)` | `@Suprawi5227` | Merged | [PR #73](https://github.com/natthakamol1130/toktickit/pull/73) |
| #74 | PR #75 | `lab4-staging` -> `main` | `[Lab 4] Release v4.0.0: Actions Taken, Role Dashboards, Ticket Workflow & Final Regression (#74)` | `@Suprawi5227` | Open / Ready | [PR #75](https://github.com/natthakamol1130/toktickit/pull/75) |

---

## 3. Pull Requests Reviewed & Constructive Feedback Given (`Suprawi5227/toktickit`)

| Peer Issue # | Peer PR # | PR Title | Constructive Review Findings & Resolution | Status | Direct GitHub Link |
| :--- | :--- | :--- | :--- | :---: | :--- |
| #55 | PR #66 | `docs(lab-04): Specification, UI Spec, and API Contract (Part 2) L4` | Reviewed state transition table (`REOPENED -> WAITING_FOR_REQUESTER`), `indicate-resolved` optional `note` payload, `PATCH` optimistic concurrency timestamp, and `BR-16` immutable audit trail policy. Verified fixes in Round 2. | Approved & Merged | [Peer PR #66](https://github.com/Suprawi5227/toktickit/pull/66) |
| #56 | PR #67 | `test(lab-04): Test Plan, Traceability Matrix & TDD Scaffolding (Part 3) L4` | Identified missing `REOPENED -> WAITING_FOR_REQUESTER` test case in `unit-validators.test.ts` (`UNIT-02`) and unchecked PR checklist items. Verified fixes in Round 2. | Approved & Merged | [Peer PR #67](https://github.com/Suprawi5227/toktickit/pull/67) |
| #57 | PR #68 | `feat(db): ActionTaken model, indexes, migration & seed data (Part 4) L4` | Identified non-idempotent `passwordHash` omission in `prisma.user.upsert({ update: {} })` in `seed.ts` and missing SQL migration artifact under `prisma/migrations/`. Verified fixes in Round 2. | Approved & Merged | [Peer PR #68](https://github.com/Suprawi5227/toktickit/pull/68) |
| #58 | PR #69 | `feat(api): Actions Taken REST endpoints & authorization (Part 5) L4` | Caught route shadowing in `server/src/app.ts` where `app.use("/api/tickets", staffRouter)` was mounted after `app.get("/api/tickets/:id")` (breaking `/api/tickets/queue` in Lab 3 regression tests) and strengthened `API-10` (`BR-14` inactive performer check). Verified fixes in Round 2. | Approved & Merged | [Peer PR #69](https://github.com/Suprawi5227/toktickit/pull/69) |
| #59 | PR #70 | `feat(workflow): Ticket workflow state machine & resolution gate (Part 6) L4` | Verified 8-state `PERMITTED_TRANSITIONS` matrix, Resolution Gate (`BR-08`), advisory resolution (`BR-09`), optimistic concurrency (`409 Conflict`), and idempotent `beforeEach` test setup (`API-11`–`API-16`, `UNIT-01`–`UNIT-02`). | Approved & Merged | [Peer PR #70](https://github.com/Suprawi5227/toktickit/pull/70) |
| #60 | PR #71 | `feat(dashboards): Role dashboards backend API & aggregations (Part 7) L4` | Verified `GET /api/dashboards/staff` and `GET /api/dashboards/requester` database aggregations (`BR-11`), requester ownership scoping (`BR-12`), zero-value count integrity (`BR-13`), Admin `userSummary` (`FR-11`), and automated API tests (`API-17`–`API-22`). | Approved & Merged | [Peer PR #71](https://github.com/Suprawi5227/toktickit/pull/71) |
| #61 | PR #72 | `feat(ui): Actions Taken UI on Ticket Detail (Part 8) L4` | Identified `performedBy` vs `performer` field mismatch in `ActionsTaken.tsx`, reverse prepend order (`[created, ...prev]`) violating `BR-15` chronological ascending order, and `claimTicket` (`POST` vs `PATCH`) / `postPublicComment` & `postInternalNote` (`content` field) contract mismatches in `client/src/api.ts`. Verified fixes in Round 2. | Approved | [Peer PR #72](https://github.com/Suprawi5227/toktickit/pull/72) |
