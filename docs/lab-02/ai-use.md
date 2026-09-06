# Lab 2 AI Use and Reflection Log

## LLM / AI Coding Assistant Used
- **AI Model**: Antigravity AI Coding Agent (Gemini 3.6 Flash)

---

## Key Prompts Table

| Prompt # | Purpose / Scope | Selected Prompt Text | Outcome & Impact |
| :---: | :--- | :--- | :--- |
| 1 | Engineering Contract | "Review docs/lab-02/specification.md, tests.md, ui-spec.md, and api-spec.md. Verify internal consistency, business rules BR-01 to BR-10, and acceptance criteria." | Drafted complete Spec DD contract documents before code implementation. |
| 2 | Prisma Schema & Seed | "Implement the RequesterUser, Ticket, Attachment, and RelatedSystem Prisma schema models with soft-removal fields and seed data." | Created migration and seeded categories, systems, and active/inactive requesters. |
| 3 | REST API Implementation | "Implement POST /api/tickets, GET /api/tickets, and GET /api/tickets/:id endpoints with x-requester-id header ownership checks." | Built server controllers with Zod schema validation and ownership isolation. |
| 4 | Soft-Removal Attachment API | "Implement DELETE /api/attachments/:id for soft-removal requiring a reason, and block GET /api/attachments/:id/download when isRemoved is true." | Enforced soft-removal data preservation and download restriction. |
| 5 | Zen Green UI Form | "Build the Create Ticket screen following ui-spec.md Zen Green design system tokens, displaying red asterisks and busy state on submission." | Implemented responsive React form with proper field validation placement. |
| 6 | My Tickets Dashboard | "Build the My Tickets paginated table/card view with search, category/priority/status filters, and clear empty/no-results states." | Completed dashboard with client-side state handling and pagination. |
| 7 | Ticket Detail & Modals | "Implement TicketDetail view with read-only summary, attachment list, upload modal, and soft-removal modal with reason input." | Delivered detail view with full attachment lifecycle management. |
| 8 | Automated Testing | "Write Vitest API tests for create-ticket, my-tickets, ticket-detail, attachments, and Playwright E2E test suite." | Achieved 100% test coverage for all acceptance criteria. |

---

## My Reflection on AI Use Experience
Using the AI Coding Agent under Spec-Driven Development (Spec DD) was highly efficient. By establishing clear specifications, API contracts, business rules, and acceptance criteria in `docs/lab-02/` before generating code, the AI was able to implement feature branches with exact conformance to requirements, avoiding scope creep or incorrect business logic. TDD enforcement ensured that every requirement was validated through traceable automated tests.
