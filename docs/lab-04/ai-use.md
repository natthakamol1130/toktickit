# Lab 4 AI Usage & Engineering Reflection (`ai-use.md`)

- **Student Name:** Natthakamol Katippatee (Student ID: 67070505215)
- **Repository:** [`natthakamol1130/toktickit`](https://github.com/natthakamol1130/toktickit)
- **AI Assistant Used:** Google Antigravity Agent (Gemini 2.5 Pro)
- **Lab Increment:** Lab 4 (Sprint 4 — Actions Taken, Role Dashboards, Ticket Workflow & Final Regression)

---

## 1. Key Engineering Prompts & AI Collaboration Log

| Phase / Issue | Prompt Summary | AI Output & Human Verification / Refinement |
| :--- | :--- | :--- |
| **Issue 1 (#56): Spec DD** | *"Draft `docs/lab-04/specification.md`, `ui-spec.md`, and `api-spec.md` covering the 1-to-Many Ticket-to-ActionTaken relationship, collaborative staff action logging, formal Resolution Gate, optimistic concurrency (`409 Conflict`), and role-specific dashboards under the Zen Green design system."* | Reviewed and verified the state transition matrix (`BR-06`), ensuring Requesters can only trigger advisory resolution (`requesterResolved = true`) while IT Staff/Admins control `RESOLVED` and `CLOSED` transitions. |
| **Issue 2 (#58): Test DD** | *"Create `docs/lab-04/tests.md` defining the Planned Tests Table (`API-01`–`API-12`, `UI-01`–`UI-08`, `E2E-01`–`E2E-03`, `REG-01`–`REG-05`) and the Acceptance-Criterion Traceability Matrix (`AC-01`–`AC-12`)."* | Verified 1-to-1 alignment between every Acceptance Criterion (`AC-01` through `AC-12`) and automated test files across API, UI, E2E, and Regression layers. |
| **Issue 3 (#60): DB Schema & Seed** | *"Evolve `server/prisma/schema.prisma` with the `ActionTaken` model (`ticketId`, `performerId`, `actionDateTime`, `description`, `result`, `followUpRequired`, `followUpNote`, `attachmentNotes`), generate the SQL migration, and update `seed.ts` idempotently."* | Verified composite indexes `@@index([ticketId, actionDateTime])` and `@@index([performerId])` and ensured `seed.ts` creates tickets with `0`, `1`, and `2+` actions idempotently. |
| **Issue 4 (#62): Actions Taken API** | *"Implement `server/src/routes/actionsTaken.ts` (`GET`, `POST`, `PATCH /api/tickets/:id/actions-taken`) enforcing RBAC, requester ownership isolation, conditional `followUpNote` validation, inactive user rejection (`BR-05`), and optimistic concurrency (`409 Conflict`)."* | Verified with Supertest in `server/tests/lab-04/actions-taken.api.test.ts` (`API-01` to `API-06`) that `performerId` is strictly bound from the server-side JWT session (`req.user.userId`) and cannot be spoofed. |
| **Issue 5 (#64): Ticket Workflow API** | *"Update `server/src/routes/staffTickets.ts` and `requesterTickets.ts` to enforce the `PERMITTED_TRANSITIONS` matrix, `expectedUpdatedAt` concurrency checks (`409 Conflict`), and `PATCH /api/requester/tickets/:id/indicate-resolved`."* | Verified in `server/tests/lab-04/ticket-workflow.api.test.ts` (`API-07` to `API-09`) that advisory resolution posts an automated public comment while keeping the ticket status unchanged until IT Staff verification. |
| **Issue 6 (#66): Dashboards API** | *"Implement `server/src/routes/dashboards.ts` (`GET /api/dashboards/requester` and `GET /api/dashboards/staff`) using authoritative Prisma database counts and `groupBy` aggregations."* | Verified in `requester-dashboard.api.test.ts` and `staff-dashboard.api.test.ts` (`API-10` to `API-12`) that empty buckets return numeric `0` and `ADMINISTRATOR` receives `userSummary`. |
| **Issue 7 (#68) & Issue 8 (#70): Frontend UI** | *"Implement `ActionsTakenSection.tsx`, `TicketWorkflowPanel.tsx`, `RequesterDashboard.tsx`, and `StaffDashboard.tsx` with RTL component tests (`UI-01` to `UI-08`)."* | Discovered stale compiled `.js` artifacts in `client/src/` shadowing `.ts` edits during Vitest runs; removed the stale `.js` files and added `"noEmit": true` to `client/tsconfig.json`. |
| **Issue 9 (#72): E2E & Regression** | *"Write Playwright E2E tests (`e2e/lab-04/`) and execute full regression verification across Labs 1–4."* | Verified all `15/15` server test suites (`63/63` tests) and `13/13` client test suites (`26/26` tests) pass with zero regressions. |

---

## 2. Engineering Reflection
Applying **Spec-Driven Development (Spec DD)** and **Test-Driven Development (Test DD)** before writing application code prevented contract drift between the Express/Prisma backend and the React frontend. In particular, human verification caught a critical build configuration nuance (`"noEmit": true` in `client/tsconfig.json`) where stale `.js` files previously shadowed TypeScript updates in Vitest, and caught an Express route ordering bug during peer review of our partner's PR #69. Combining AI velocity with strict human code review and automated regression testing ensured enterprise-grade reliability across all 4 sprints.
