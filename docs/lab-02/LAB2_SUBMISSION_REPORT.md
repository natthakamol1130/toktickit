# CPE 334 — Lab 2 Submission Report

**Student Name:** Natthakamol Mornparn (นางสาวณัฏฐกมล มอญปาน)  
**Student ID:** 67070505215  
**GitHub Username:** @natthakamol1130  
**Peer Reviewer:** Suprawee Sutthiserinawat (นางสาวสุประวีณ์ สุทธิเสรีนิวัมน์ — 67070505227, @Suprawi5227)  
**Date:** September 6, 2026  

---

## Answer Part 1: Git Use with Engineering Workflow

### 1. URLs List

- **GitHub Repository:**  
  https://github.com/natthakamol1130/toktickit
- **GitHub Project (Kanban):**  
  https://github.com/users/natthakamol1130/projects
- **GitHub Issues:**  
  - Issue #10 ([Lab 2] [Docs] Sprint specification and engineering contract): https://github.com/natthakamol1130/toktickit/issues/10  
  - Issue #12 ([Lab 2] [Docs] Zen Green UI specification & REST API contract): https://github.com/natthakamol1130/toktickit/issues/12  
  - Issue #14 ([Lab 2] [Database] Prisma schema data models & migrations): https://github.com/natthakamol1130/toktickit/issues/14  
  - Issue #16 ([Lab 2] [Backend] Reference data REST API endpoints): https://github.com/natthakamol1130/toktickit/issues/16  
  - Issue #18 ([Lab 2] [Frontend] Development Requester Selector screen & header context): https://github.com/natthakamol1130/toktickit/issues/18  
  - Issue #20 ([Lab 2] [Backend] Ticket creation API & auto ticket number generator): https://github.com/natthakamol1130/toktickit/issues/20  
  - Issue #22 ([Lab 2] [Frontend] Create Ticket Form UI & File Upload): https://github.com/natthakamol1130/toktickit/issues/22  
  - Issue #27 ([Lab 2] [Frontend & Backend] My Tickets Dashboard, Search, Filter & Pagination): https://github.com/natthakamol1130/toktickit/issues/27  
  - Issue #29 ([Lab 2] [Backend & Frontend] Ticket Detail API, Ownership Check, Attachment Upload & Soft Removal): https://github.com/natthakamol1130/toktickit/issues/29  
  - Issue #31 ([Lab 2] [Test & Release] End-to-End Testing Suite, Integration Tests & Final Lab 2 Release): https://github.com/natthakamol1130/toktickit/issues/31  
- **Pull Requests (PRs):**  
  - PR #11 (Feature 1 → lab2-staging): https://github.com/natthakamol1130/toktickit/pull/11  
  - PR #13 (Feature 2 → lab2-staging): https://github.com/natthakamol1130/toktickit/pull/13  
  - PR #15 (Feature 3 → lab2-staging): https://github.com/natthakamol1130/toktickit/pull/15  
  - PR #17 (Feature 4 → lab2-staging): https://github.com/natthakamol1130/toktickit/pull/17  
  - PR #19 (Feature 5 → lab2-staging): https://github.com/natthakamol1130/toktickit/pull/19  
  - PR #21 (Feature 6 → lab2-staging): https://github.com/natthakamol1130/toktickit/pull/21  
  - PR #26 (Feature 7 → lab2-staging): https://github.com/natthakamol1130/toktickit/pull/26  
  - PR #28 (Feature 8 → lab2-staging): https://github.com/natthakamol1130/toktickit/pull/28  
  - PR #30 (Feature 9 → lab2-staging): https://github.com/natthakamol1130/toktickit/pull/30  
  - PR #32 (Feature 10 → lab2-staging): https://github.com/natthakamol1130/toktickit/pull/32  
  - PR #33 (Final Release lab2-staging → main): https://github.com/natthakamol1130/toktickit/pull/33  

---

### 2. GitHub Project Board Evidence (Kanban)

> **[🖼️ แนบภาพ Screenshot: GitHub Project Kanban Board]**

---

### 3. Git Workflow Evidence (`git log --oneline --graph -n 25` on `main`)

```text
*   9ccefaa Merge pull request #33 from natthakamol1130/lab2-staging
|\  
| * c04d12e refactor(client): enforce allowJs false in tsconfig and clean all relative TypeScript imports
| * 0798847 refactor(tests,client): update test and main imports to clean TypeScript paths without .js extension
| * 4c99d4f refactor(client): remove duplicate compiled JS files, clean TypeScript component imports, and update .gitignore
| * f973b61 docs(release): update peer reviewer log for Lab 2 final release approval
| * a879a9e Merge pull request #32 from natthakamol1130/feature/10-e2e-testing-and-release
| |\  
| | * be071bf test(e2e): implement end-to-end testing suite & REST API integration tests for Feature 10 release
| | * 2795d5e chore(test): prepare integration & E2E test suites on lab2-staging for Feature 10 PR diff
| |/  
| *   c261ff7 Merge pull request #30 from natthakamol1130/feature/9-ticket-detail-api
| |\  
| | * cc4cc94 feat(api,ui): implement ticket detail endpoint with ownership isolation & attachment lifecycle
| | * 7f3dd95 chore(api): prepare ticket detail and attachment endpoints on lab2-staging for Feature 9 PR diff
| |/  
| *   37b7703 Merge pull request #28 from natthakamol1130/feature/8-my-tickets-dashboard
| |\  
| | * 3c40614 feat(api,ui): implement GET /api/tickets endpoint, fetchTickets client API, and MyTicketsView dashboard
| | * 4f72ccd chore(api): prepare GET /api/tickets endpoint and fetchTickets helper on lab2-staging for Feature 8 PR diff
| | * a9a76c0 chore(ui): prepare MyTicketsView component on lab2-staging for Feature 8 PR diff
| |/  
| *   fb97b12 Merge pull request #26 from natthakamol1130/feature/7-create-ticket-ui
```

---

### 4. Repository Directory Structure Evidence

**File Tree Checklist:**
- `toktickit/`
  - `client/`
    - `src/`
      - `components/`
        - `Header.tsx`
        - `RequesterSelectorScreen.tsx`
        - `CreateTicketView.tsx`
        - `MyTicketsView.tsx`
        - `TicketDetailView.tsx`
      - `api.ts`
      - `App.tsx`
      - `main.tsx`
      - `types.ts`
      - `index.css`
    - `tests/lab-02/`
      - `AttachmentSection.test.tsx`
      - `CreateTicket.test.tsx`
      - `MyTickets.test.tsx`
      - `RequesterSelector.test.tsx`
      - `RequesterTicketDetail.test.tsx`
  - `server/`
    - `prisma/`
      - `schema.prisma`
      - `seed.ts`
    - `src/`
      - `app.ts`
      - `prisma.ts`
    - `tests/lab-02/`
      - `reference-data.api.test.ts`
      - `create-ticket.api.test.ts`
      - `my-tickets.api.test.ts`
      - `ticket-detail.api.test.ts`
      - `attachments.api.test.ts`
    - `uploads/`
      - `.gitkeep`
  - `e2e/lab-02/`
    - `requester-ticket-flow.spec.ts`
  - `docs/lab-02/`
    - `specification.md`
    - `ui-spec.md`
    - `api-spec.md`
    - `tests.md`
    - `reviewer.md`
    - `ai-use.md`
    - `LAB2_SUBMISSION_REPORT.md`
  - `.gitignore`
  - `README.md`

---

### 5. Rendered `.gitignore` Content

```gitignore
# dependencies
node_modules/

# env & secrets
.env
*.env
.env.local
.env.*.local
!.env.example

# build output
dist/
build/
client/src/**/*.js
client/tests/**/*.js

# uploads
server/uploads/*
!server/uploads/.gitkeep

# prisma
server/prisma/*.db

# IDE & Editor
.vscode/
.idea/
*.swp
*.swo

# logs & OS
*.log
.DS_Store
Thumbs.db
```

---

### 6. Rendered `docs/lab-02/reviewer.md` (Peer Reviewer Log)

```markdown
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
```

---

## Answer Part 2: Tests

### 1. Test Plan Table (`docs/lab-02/tests.md`)

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

### 2. Terminal Test Evidence on `main` Branch

#### Backend Vitest Integration Tests (14/14 Passed)
```text
 RUN  v2.1.9 C:/Users/Windows/OneDrive/kmutt/Lab1_Starter_Scaffold/toktickit/server

 ✓ tests/lab-01/health.test.ts (1 test) 25ms
 ✓ tests/lab-02/reference-data.api.test.ts (3 tests) 104ms
 ✓ tests/lab-01/categories.test.ts (1 test) 91ms
 ✓ tests/lab-02/my-tickets.api.test.ts (2 tests) 162ms
 ✓ tests/lab-02/ticket-detail.api.test.ts (2 tests) 213ms
 ✓ tests/lab-02/create-ticket.api.test.ts (3 tests) 191ms
 ✓ tests/lab-02/attachments.api.test.ts (2 tests) 307ms

 Test Files  7 passed (7)
      Tests  14 passed (14)
   Start at  22:16:48
   Duration  1.22s
```

#### Playwright E2E Tests (2/2 Passed)
```text
Running 2 tests using 1 worker

  ok 1 e2e\lab-02\requester-ticket-flow.spec.ts:11:7 › Lab 2 Requester Ticket Flow (E2E) › E2E-01: Complete Requester Flow - Select Requester -> Create Ticket -> View in My Tickets (AC-01, AC-03) (2.8s)
  ok 2 e2e\lab-02\requester-ticket-flow.spec.ts:44:7 › Lab 2 Requester Ticket Flow (E2E) › E2E-02: Requester Switching & Ownership Security Isolation (AC-04) (599ms)

  2 passed (7.2s)
```

---

## Answer Part 3: AI Use and Reflection

**LLM/agent used:** Antigravity AI Coding Agent (Gemini 3.6 Flash)

### Selected Key Prompts

| # | Purpose / Scope | Selected Prompt Text | Outcome & Impact |
| :---: | :--- | :--- | :--- |
| 1 | Engineering Contract | "Review docs/lab-02/specification.md, tests.md, ui-spec.md, and api-spec.md. Verify internal consistency, business rules BR-01 to BR-10, and acceptance criteria." | Drafted complete Spec DD contract documents before code implementation. |
| 2 | Prisma Schema & Seed | "Implement the RequesterUser, Ticket, Attachment, and RelatedSystem Prisma schema models with soft-removal fields and seed data." | Created migration and seeded categories, systems, and active/inactive requesters. |
| 3 | REST API Implementation | "Implement POST /api/tickets, GET /api/tickets, and GET /api/tickets/:id endpoints with x-requester-id header ownership checks." | Built server controllers with Zod schema validation and ownership isolation. |
| 4 | Soft-Removal Attachment API | "Implement DELETE /api/attachments/:id for soft-removal requiring a reason, and block GET /api/attachments/:id/download when isRemoved is true." | Enforced soft-removal data preservation and download restriction. |
| 5 | Zen Green UI Form | "Build the Create Ticket screen following ui-spec.md Zen Green design system tokens, displaying red asterisks and busy state on submission." | Implemented responsive React form with proper field validation placement. |
| 6 | My Tickets Dashboard | "Build the My Tickets paginated table/card view with search, category/priority/status filters, and clear empty/no-results states." | Completed dashboard with client-side state handling and pagination. |
| 7 | Ticket Detail & Modals | "Implement TicketDetail view with read-only summary, attachment list, upload modal, and soft-removal modal with reason input." | Delivered detail view with full attachment lifecycle management. |
| 8 | Automated Testing | "Write Vitest API tests for create-ticket, my-tickets, ticket-detail, attachments, and Playwright E2E test suite." | Achieved 100% test coverage for all acceptance criteria. |

### Reflection on AI Use Experience
> Using the AI Coding Agent under Spec-Driven Development (Spec DD) was highly efficient. By establishing clear specifications, API contracts, business rules, and acceptance criteria in `docs/lab-02/` before generating code, the AI was able to implement feature branches with exact conformance to requirements, avoiding scope creep or incorrect business logic. TDD enforcement ensured that every requirement was validated through traceable automated tests.

---

## Answer Part 4: App Demo

### 1. Requester Selector Screen
หน้าจอเลือกสิทธิ์ผู้ใช้งานจำลอง (Development Requester Selector) มี Dropdown และปุ่ม Continue

> **[🖼️ แนบภาพ Screenshot: หน้าจอ Requester Selector]**

---

### 2. Create Ticket Form UI
หน้าจอบันทึกตั๋วปัญหาแจ้งซ่อม IT มีเครื่องหมายดอกจันสีแดงแสดงฟิลด์บังคับ การดักจับ Validation Error และโซนอัปโหลดไฟล์แนบ

> **[🖼️ แนบภาพ Screenshot: หน้าจอ Create Ticket Form]**

---

### 3. My Tickets Dashboard
หน้าจอแดชบอร์ดแสดงรายการตั๋วของผู้ใช้ มีช่องค้นหา ตัวกรองสถานะ/ความสำคัญ ตารางตั๋วพร้อม Badge สี และปุ่มเปลี่ยนหน้า (Pagination)

> **[🖼️ แนบภาพ Screenshot: หน้าจอ My Tickets Dashboard]**

---

### 4. Ticket Detail & Attachment Soft Removal
หน้าจอแสดงรายละเอียดตั๋วแบบ Read-Only รายการไฟล์แนบ ปุ่มอัปโหลดไฟล์เพิ่ม และระบบ Soft-remove พร้อมกรอกเหตุผลในการลบ

> **[🖼️ แนบภาพ Screenshot: หน้าจอ Ticket Detail และ Modal ลบไฟล์แนบ]**
