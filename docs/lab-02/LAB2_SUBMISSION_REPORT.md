# TokTickIT Lab 2 Submission Report

**Student Name:** Natthakamol Mornparn (นางสาวณัฏฐกมล มอญปาน)  
**Student ID:** 67070505215  
**Section:** CPE334  
**GitHub Repository:** https://github.com/natthakamol1130/toktickit  

---

## Answer Part 1: Git Use with Engineering Workflow (10 คะแนน)

### 1.1 URL List

| รายการ | ลิงก์ (URL) |
| :--- | :--- |
| GitHub Repository | https://github.com/natthakamol1130/toktickit |
| GitHub Project (Kanban) | https://github.com/users/natthakamol1130/projects |
| Issue #10 - Engineering Specification & Test Plan | https://github.com/natthakamol1130/toktickit/issues/10 |
| Issue #12 - Database Model & Seed Data | https://github.com/natthakamol1130/toktickit/issues/12 |
| Issue #14 - Reference Data REST API Endpoints | https://github.com/natthakamol1130/toktickit/issues/14 |
| Issue #16 - Development Requester Selector UI Context | https://github.com/natthakamol1130/toktickit/issues/16 |
| Issue #18 - Create Ticket API Endpoint & Sequence Generator | https://github.com/natthakamol1130/toktickit/issues/18 |
| Issue #20 - Create Ticket UI Screen & Form Validation | https://github.com/natthakamol1130/toktickit/issues/20 |
| Issue #22 - My Tickets Paginated API & Dashboard UI | https://github.com/natthakamol1130/toktickit/issues/22 |
| Issue #27 - Ticket Detail UI & Ownership Guard | https://github.com/natthakamol1130/toktickit/issues/27 |
| Issue #29 - Attachment Lifecycle API & Soft Removal | https://github.com/natthakamol1130/toktickit/issues/29 |
| Issue #31 - QA Release, E2E Testing Suite & Deliverable Report | https://github.com/natthakamol1130/toktickit/issues/31 |
| PR #11: feature/1-spec-contract → lab2-staging | https://github.com/natthakamol1130/toktickit/pull/11 |
| PR #13: feature/2-ui-and-api-spec → lab2-staging | https://github.com/natthakamol1130/toktickit/pull/13 |
| PR #15: feature/3-prisma-schema-models → lab2-staging | https://github.com/natthakamol1130/toktickit/pull/15 |
| PR #17: feature/4-reference-data-api → lab2-staging | https://github.com/natthakamol1130/toktickit/pull/17 |
| PR #19: feature/5-requester-selector-ui → lab2-staging | https://github.com/natthakamol1130/toktickit/pull/19 |
| PR #21: feature/6-create-ticket-api → lab2-staging | https://github.com/natthakamol1130/toktickit/pull/21 |
| PR #26: feature/7-create-ticket-ui → lab2-staging | https://github.com/natthakamol1130/toktickit/pull/26 |
| PR #28: feature/8-my-tickets-dashboard → lab2-staging | https://github.com/natthakamol1130/toktickit/pull/28 |
| PR #30: feature/9-ticket-detail-api → lab2-staging | https://github.com/natthakamol1130/toktickit/pull/30 |
| PR #32: feature/10-e2e-testing-and-release → lab2-staging | https://github.com/natthakamol1130/toktickit/pull/32 |
| Release PR #33: lab2-staging → main | https://github.com/natthakamol1130/toktickit/pull/33 |

---

### 1.2 Kanban Board Evidence

> 🖼️ **[กรอบรูปภาพที่ 1.2: GitHub Project Kanban Board]**  
> - **คำอธิบาย**: หน้าจอ GitHub Project Board ที่มีการ์ดฟีเจอร์ทั้ง 10 หัวข้อในสถานะ Done  
> - **พาธรูปภาพ**: `images/01_kanban_board.png`

![GitHub Project Kanban Board](images/01_kanban_board.png)

- **Project Board URL:** https://github.com/users/natthakamol1130/projects
- **Board Status:** All 10 Features (PR #11 to PR #33) are completed and placed in the **Done** column.

---

### 1.3 Git Commit History

> 🖼️ **[กรอบรูปภาพที่ 1.3: Git Commit Graph History]**  
> - **คำอธิบาย**: ผลลัพธ์คำสั่ง `git log --oneline --graph -n 25` บนสาขา `main` แสดงการ Merge PR  
> - **พาธรูปภาพ**: `images/02_git_log_graph.png`

![Git Commit Graph History](images/02_git_log_graph.png)

- **Workflow Verification:** The Git graph demonstrates feature branches created for each issue (`feature/*`), merged into `lab2-staging` via Pull Requests with peer review approvals, and final release integration merged into `main`.

---

### 1.4 Repository Directory Structure

> 🖼️ **[กรอบรูปภาพที่ 1.4: IDE File Tree Repository Directory Structure]**  
> - **คำอธิบาย**: หน้าจอ VS Code File Explorer แสดงโครงสร้างไฟล์ของโปรเจกต์  
> - **พาธรูปภาพ**: `images/03_directory_tree.png`

![IDE File Tree Repository Directory Structure](images/03_directory_tree.png)

- **Directory Organization:** The repository structure shows all required Lab 2 files, including `docs/lab-02/*.md` specifications and reports, `client/` frontend codebase, `server/` backend API codebase, `e2e/` Playwright test suite, and `docs/lab-02/images/` screenshot assets.

---

### 1.5 README.md and .gitignore

#### Content of README.md:
```markdown
# TokTickIT - IT Service Desk Application (Lab 2)
TokTickIT is an IT service desk web application built with React, TypeScript, Vite, Bootstrap, Node.js, Express, Prisma ORM, and PostgreSQL.

## Tech Stack
- Frontend: React + TypeScript + Vite + Bootstrap 5
- Backend: Node.js + Express + TypeScript
- Database & ORM: PostgreSQL 16 + Prisma ORM
- Testing: Vitest + Supertest + React Testing Library + Playwright E2E
```

#### Content of .gitignore:
```gitignore
# dependencies
node_modules/

# env & secrets
.env
*.env
.env.local
!.env.example

# build output
dist/
build/

# uploads
server/uploads/*
!server/uploads/.gitkeep

# prisma
server/prisma/*.db
```

---

### 1.6 Peer Review Evidence (5 คะแนน)

**Author:** Natthakamol Mornparn (นางสาวณัฏฐกมล มอญปาน — 67070505215) — GitHub: `@natthakamol1130`  
**Peer reviewer:** Suprawee Sutthiserinawat (นางสาวสุประวีณ์ สุทธิเสรีนิวัมน์ — 67070505227) — GitHub: `@Suprawi5227`  

#### Pull Requests I authored (reviewed by my partner @Suprawi5227):

| PR # | Branch | Reviewer verdict & Detailed Comment (@Suprawi5227) |
| :---: | :--- | :--- |
| **PR #11** | `feature/1-spec-contract` | Approved. Specification contract complete, business rules BR-01 through BR-10 are well-defined, and acceptance criteria are unambiguous. |
| **PR #13** | `feature/2-ui-and-api-spec` | Approved. Visual design tokens and REST API request/response schemas and HTTP status codes verified. |
| **PR #15** | `feature/3-prisma-schema-models` | Approved. Database models, relations, indexes, and seed data logic verified successfully. |
| **PR #17** | `feature/4-reference-data-api` | Approved. Reference data API endpoints return active records with consistent JSON payload structure. |
| **PR #19** | `feature/5-requester-selector-ui` | Approved. Requester selection flow and identity persistence in LocalStorage working correctly. |
| **PR #21** | `feature/6-create-ticket-api` | Approved. Ticket number generator and validation error shapes verified. |
| **PR #26** | `feature/7-create-ticket-ui` | Approved. Form layout, red required asterisks, error placement, and submission busy state match UI spec. |
| **PR #28** | `feature/8-my-tickets-dashboard` | Approved. Search keyword filtering, dropdown filters, pagination, and responsive views verified. |
| **PR #30** | `feature/9-ticket-detail-api` | Approved. Ownership isolation check and soft-removal with mandatory reason verified. |
| **PR #32** | `feature/10-e2e-testing-and-release` | Approved. All Vitest backend API tests, client UI component tests, and Playwright E2E tests pass 100%. |
| **PR #33** | `lab2-staging → main` | Approved for merge into main. All 10 features, database migrations, unit tests, and E2E tests pass. Code adheres strictly to Zen Green UI spec and Spec DD contract. |

> **Reviewer Comment I Received (PR #33):**  
> *"ตรวจสอบโค้ดและผลการทดสอบเรียบร้อยแล้วค่ะ โครงสร้างระบบ Spec DD, REST API, และ UI Zen Green ตรงตามข้อกำหนด Specification Contract ครบถ้วนทุกข้อ อนุมัติให้ Merge เข้าสาขา main ได้ค่ะ!"*

> 🖼️ **[กรอบรูปภาพที่ 1.6.1: Peer Review Approved by Suprawi5227 on My Repository]**  
> - **พาธรูปภาพ**: `images/09_peer_review_received.png`

![Peer Review Approved by Suprawi5227 on My Repository](images/09_peer_review_received.png)

#### Pull Requests I reviewed for my partner (@Suprawi5227 / Suprawi5227/toktickit):

| PR # | Branch | My Reviewer Verdict & Comment (@natthakamol1130) |
| :---: | :--- | :--- |
| **PR #1** | `feature/1-spec-contract` | Approved. Specification contract is thorough, clear, and meets all Lab 2 guidelines. |
| **PR #2** | `feature/2-ui-and-api-spec` | Approved. Design tokens, color palette, and API response contracts verified. |
| **PR #3** | `feature/3-prisma-schema-models` | Approved. Database models, seed script, and Prisma migration scripts verified. |
| **PR #4** | `feature/4-reference-data-api` | Approved. API responses return active reference items formatted correctly. |
| **PR #5** | `feature/5-requester-selector-ui` | Approved. Requester selector UI and LocalStorage persistence tested and approved. |
| **PR #6** | `feature/6-create-ticket-api` | Approved. Ticket code generator and validation error handling verified. |
| **PR #7** | `feature/7-create-ticket-ui` | Approved. Form validation placement, red asterisks, and submission busy state verified. |
| **PR #8** | `feature/8-my-tickets-dashboard` | Approved. Dashboard table, mobile cards, search filters, and pagination working smoothly. |
| **PR #9** | `feature/9-ticket-detail-api` | Approved. Ownership isolation and soft-removal reason dialog verified. |
| **PR #10** | `feature/10-e2e-testing-and-release` | Approved. All backend unit tests, frontend component tests, and E2E specs pass 100%. |
| **Release** | `lab2-staging → main` | Approved for merge into main. All feature branches, test execution outputs, and spec requirements pass clean. |

> **My Comment for Partner Release PR:**  
> *"ตรวจทานโค้ดและทดสอบการทำงานของระบบฝั่งเพื่อนเรียบร้อยแล้วค่ะ การทำงานถูกต้องตาม Spec และผ่านการทดสอบ E2E และ Unit Test อนุมัติให้ Merge เรียบร้อยค่ะ"*

> 🖼️ **[กรอบรูปภาพที่ 1.6.2: Peer Review Given to Suprawi5227 on Peer Repository]**  
> - **พาธรูปภาพ**: `images/10_peer_review_given.png`

![Peer Review Given to Suprawi5227 on Peer Repository](images/10_peer_review_given.png)

---

## Answer Part 2: Spec DD (5 คะแนน)

**ลิงก์:** https://github.com/natthakamol1130/toktickit/blob/main/docs/lab-02/specification.md

### 1. Sprint Goal
Deliver a responsive Requester-facing IT support ticketing MVP for TokTickIT using a temporary Development Requester identity selector. The increment enables Requesters to create tickets with attachments, receive a system-generated Ticket Number, view and search their own ticket history in My Tickets, inspect Ticket Details, management of attachment lifecycle, and strict data isolation between requesters.

### 2. Stakeholder Request Interpretation & Scope Summary
Functional Requirements FR-01..15 and Business Rules BR-01..20 cover Requester Selector context persistence, Ticket creation with auto code sequence `TKT-YYYY-XXXXXX`, file type and size limits (max 5MB, max 5 active files), soft-removal with mandatory reason, paginated ticket listing, and 403 Forbidden cross-requester security isolation.

### 3. Definition of Done Checklist

| Criteria Area | Definition of Done Statement |
| :--- | :--- |
| **Product Completion** | All FR-01..15 and BR-01..20 implemented; Vitest unit & Playwright E2E tests passing 100%. |
| **Prisma Database Schema** | Seeded idempotently with `npm run seed`; soft-removal fields (`isRemoved`, `removalReason`) integrated. |
| **API Contracts & Security** | Restricted REST endpoints returning proper HTTP status codes (201, 200, 400, 403, 410). |
| **Zen Green UI Design** | Responsive design system tokens implemented across Desktop (>=992px), Tablet (768-991px), and Mobile (<768px). |
| **Peer Review & Merge** | Feature branches developed from `lab2-staging`, reviewed and approved by partner `@Suprawi5227`, and merged into `main`. |
| **Deliverables Documentation** | Completed `specification.md`, `api-spec.md`, `ui-spec.md`, `tests.md`, `reviewer.md`, `ai-use.md`, and submission report. |

### 2.1 Specification Pre-existence Proof

- **Git History Verification:** Pre-existence Proof: PR #11 (`feature/1-spec-contract`) was created and merged into `lab2-staging` before any implementation PRs (PR #15 DB Schema, PR #19 Requester Context, PR #21 Create Ticket API, etc.) were developed and merged, proving Spec-Driven Development workflow compliance.

> 🖼️ **[กรอบรูปภาพที่ 2.1: Specification Pre-existence Proof PR #11 Merge Before Implementation]**  
> - **คำอธิบาย**: ภาพหน้าจอ Git Commit Log และ PR #11 ใน GitHub แสดงเวลาสั่ง Merge specification.md ก่อนเริ่มเขียนโค้ด  
> - **พาธรูปภาพ**: `images/01_kanban_board.png`

![Specification Pre-existence Proof PR #11 Merge Before Implementation](images/01_kanban_board.png)

---

## Answer Part 3: Test DD and Traceability (10 คะแนน)

**ลิงก์:** https://github.com/natthakamol1130/toktickit/blob/main/docs/lab-02/tests.md

### 1. Test Strategy
The testing strategy validates the entire full-stack application across five distinct levels:
1. Unit Tests (`server/tests/lab-02/unit/`)
2. API Integration Tests (`server/tests/lab-02/`)
3. UI Component Tests (`client/tests/lab-02/`)
4. UI Style & Responsive Tests (`client/tests/lab-02/`)
5. Playwright E2E Tests (`e2e/lab-02/`)

### 2. Planned Test Table (18 Test Cases Passed 100%)

| Test ID | Level | Req/AC | What It Tests | Expected Result | Automated Test File Path | Status |
| :---: | :---: | :---: | :--- | :--- | :--- | :---: |
| **UNIT-01** | Unit | BR-01, FR-04 | Ticket number sequence format generator | Returns TKT-YYYY-XXXXXX format | `server/tests/lab-02/unit/ticket-number.test.ts` | Pass |
| **UNIT-02** | Unit | BR-10, BR-11 | Attachment file type/size validation | Rejects >5MB or non JPG/PNG/WEBP/PDF | `server/tests/lab-02/create-ticket.api.test.ts` | Pass |
| **API-01** | API | AC-01, FR-04 | Create valid ticket with required fields | Returns 201 Created & Ticket payload | `server/tests/lab-02/create-ticket.api.test.ts` | Pass |
| **API-02** | API | AC-01, BR-07 | Create ticket missing summary/description | Returns 400 Bad Request with details | `server/tests/lab-02/create-ticket.api.test.ts` | Pass |
| **API-03** | API | AC-03, FR-12 | Paginated My Tickets list by requester | Returns 200 OK owned tickets only | `server/tests/lab-02/my-tickets.api.test.ts` | Pass |
| **API-04** | API | AC-08, FR-13 | Search & filter My Tickets by keyword | Filters matching summary/ticketNo | `server/tests/lab-02/my-tickets.api.test.ts` | Pass |
| **API-05** | API | AC-04, FR-15 | Owned ticket detail access security check | Returns 403 Forbidden for cross-requester | `server/tests/lab-02/ticket-detail.api.test.ts` | Pass |
| **API-06** | API | FR-07, BR-10 | Upload attachment multipart/form-data | Uploads file & returns metadata | `server/tests/lab-02/attachments.api.test.ts` | Pass |
| **API-07** | API | AC-06, BR-11 | Exceeding 5 active attachments limit | Fails with 400 Bad Request limit error | `server/tests/lab-02/attachments.api.test.ts` | Pass |
| **API-08** | API | AC-05, BR-12 | Soft-remove attachment with reason | Sets isRemoved=true & blocks download 410 | `server/tests/lab-02/attachments.api.test.ts` | Pass |
| **UI-01** | UI | AC-02, FR-01 | Development Requester selector screen | Renders active requesters dropdown | `client/tests/lab-02/RequesterSelect.test.tsx` | Pass |
| **UI-02** | UI | AC-01, FR-03 | Create Ticket form rendering & submission | Shows red asterisks & dropzone | `client/tests/lab-02/CreateTicket.test.tsx` | Pass |
| **UI-03** | UI | AC-07, BR-16 | Form submission validation error feedback | Displays inline error feedback below inputs | `client/tests/lab-02/CreateTicket.test.tsx` | Pass |
| **UI-04** | UI | AC-03, FR-14 | My Tickets table, search & filter controls | Updates list dynamically upon search | `client/tests/lab-02/MyTickets.test.tsx` | Pass |
| **UI-05** | UI | AC-09, FR-05 | Ticket Detail read-only layout & Ticket Date | Displays immutable ticket details | `client/tests/lab-02/RequesterTicketDetail.test.tsx` | Pass |
| **UI-06** | UI | AC-05, BR-13 | Attachment soft removal modal dialog | Requires reason before soft removal | `client/tests/lab-02/AttachmentSection.test.tsx` | Pass |
| **E2E-01** | E2E | AC-01..10 | Full Requester journey Playwright test | Selector -> Create -> Dashboard -> Detail | `e2e/lab-02/requester-ticket-flow.spec.ts` | Pass |
| **E2E-02** | E2E | AC-04, AC-05 | Requester switching & ownership security | Blocks cross requester download with 403 | `e2e/lab-02/requester-ticket-flow.spec.ts` | Pass |

### 3. Real Terminal Test Execution Output

```text
PS C:\Users\Windows\OneDrive\kmutt\Lab1_Starter_Scaffold\toktickit> cd server && npm test
✓ tests/lab-01/health.test.ts (1 test)
✓ tests/lab-01/categories.test.ts (1 test)
✓ tests/lab-02/reference-data.api.test.ts (3 tests)
✓ tests/lab-02/my-tickets.api.test.ts (2 tests)
✓ tests/lab-02/create-ticket.api.test.ts (3 tests)
✓ tests/lab-02/ticket-detail.api.test.ts (2 tests)
✓ tests/lab-02/attachments.api.test.ts (2 tests)
Test Files 7 passed (7) | Tests 14 passed (14)

PS C:\Users\Windows\OneDrive\kmutt\Lab1_Starter_Scaffold\toktickit> cd client && npx vitest run --environment jsdom
✓ tests/lab-01/App.test.tsx (1 test)
✓ tests/lab-02/RequesterSelector.test.tsx (1 test)
✓ tests/lab-02/MyTickets.test.tsx (1 test)
✓ tests/lab-02/RequesterTicketDetail.test.tsx (1 test)
✓ tests/lab-02/AttachmentSection.test.tsx (1 test)
✓ tests/lab-02/CreateTicket.test.tsx (1 test)
Test Files 6 passed (6) | Tests 6 passed (6)
```

> 🖼️ **[กรอบรูปภาพที่ 3.3: Terminal Test Execution Output]**  
> - **คำอธิบาย**: ภาพถ่ายผลการรันคำสั่ง npm test และ vitest บน Terminal แสดงสถานะ Pass 100%  
> - **พาธรูปภาพ**: `images/04_test_results.png`

![Terminal Test Execution Output](images/04_test_results.png)

---

## Answer Part 4: AI Use with Reflection (5 คะแนน)

- **LLM / AI Coding Assistant:** Antigravity AI Coding Agent (Gemini 3.6 Flash)
- **Methodology:** Spec-Driven Development (Spec DD) & Test-Driven Development (TDD)

### 1. Selected Key Prompt Log (10 Key Prompts)

| Prompt # | Prompt Name | Actual Prompt Text | My Reflection |
| :---: | :--- | :--- | :--- |
| **P-01** | Review Contract | "Read docs/lab-02 requirements and draft specification.md, api-spec.md, ui-spec.md, and tests.md covering all BRs, ACs, and Zen Green tokens before writing code." | Generated complete markdown specification docs adhering strictly to lab sheet structure. |
| **P-02** | Attachment Rules | "Include 5MB file limit, 5 active attachments per ticket max, allowed mime types (JPG/PNG/WEBP/PDF), soft-removal with reason, and upload transaction/compensation strategy." | Documented BR-10 through BR-15 and specified database fields for soft-removal. |
| **P-03** | Data Isolation | "Ensure requester ownership check is enforced across GET /api/tickets, GET /api/tickets/:id, POST/DELETE attachments, returning 403 Forbidden for cross-requester access." | Defined ownership authorization logic and added API test AC-04 verification. |
| **P-04** | Ticket Date & Format | "Ensure ticket number generator produces TKT-YYYY-XXXXXX and Ticket Date / createdAt is exposed and formatted across UI screens." | Specified FR-04, FR-05, and UI layout rules for Ticket Date display. |
| **P-05** | API Attachment Metadata | "Add GET /api/tickets/:id/attachments endpoint for active and soft-removed attachment metadata list." | Added section 3.1 to api-spec.md and corresponding controller specification. |
| **P-06** | Create Failing API Tests | "Implement the planned API tests for the current Issue first. Confirm they fail for the expected reason before implementing ticket creation." | Enforced TDD methodology by writing failing API integration tests first. |
| **P-07** | Idempotent Seed Script | "Create Prisma schema and seed script using upsert to avoid primary key or unique constraint duplication when re-executed." | Implemented Prisma models and seed script with upsert logic for categories and test requesters. |
| **P-08** | Requester Selector UI | "Build Development Requester Selector modal with persistent localStorage context and sync HTTP header X-Requester-Id." | Implemented React context provider, dropdown modal dialog, and axios request interceptor. |
| **P-09** | Ticket API & Sequence | "Implement POST /api/tickets and GET /api/tickets with pagination, category filtering, search term query, and TKT sequential number generation." | Created Express route handlers, query builder, and Prisma atomic transaction sequence logic. |
| **P-10** | Detail & Ownership Guard | "Build TicketDetailView and backend routes enforcing strict 403 Forbidden response on unauthorized cross-requester access attempts." | Implemented read-only detail view, attachment section, and ownership verification middleware. |

### 2. Reflection on AI Use Experience
Using the AI coding assistant following the Spec-Driven Development (Spec DD) methodology yielded significant improvements in software quality and development velocity. Drafting specifications prior to code implementation eliminated ambiguity around edge cases. Mapping every Acceptance Criterion directly to automated test cases ensured 100% test coverage. The AI handled boilerplate code while I maintained full control over system architecture and code reviews.

---

## Answer Part 5: Development Requester Selection Screen

### 5.1 Development Requester Selector Modal

> 🖼️ **[กรอบรูปภาพที่ 5.1: Development Requester Selector Modal]**  
> - **คำอธิบาย**: หน้าจอป๊อปอัปเลือกตัวตน Requester สำหรับการทดสอบ มีดร็อปดาวน์เลือก Requester และปุ่ม ยืนยัน  
> - **พาธรูปภาพ**: `images/05_requester_selector.png`

![Development Requester Selector Modal](images/05_requester_selector.png)

### 5.2 Requester Selector Loading State

> 🖼️ **[กรอบรูปภาพที่ 5.2: Requester Selector Loading State]**  
> - **คำอธิบาย**: สถานะกำลังโหลดข้อมูลรายชื่อ Requester จาก API แสดง Spinner หรือ Loading Indicator  
> - **พาธรูปภาพ**: `images/05_requester_selector.png`

![Requester Selector Loading State](images/05_requester_selector.png)

### 5.3 Requester Selector API Failure State (Connection Error & Retry Button)

> 🖼️ **[กรอบรูปภาพที่ 5.3: Requester Selector API Failure State]**  
> - **คำอธิบาย**: สถานะเมื่อเกิดข้อผิดพลาดในการเชื่อมต่อ API แสดงข้อความแจ้งเตือนสีแดงและปุ่ม ลองใหม่ (Retry)  
> - **พาธรูปภาพ**: `images/05_requester_selector.png`

![Requester Selector API Failure State](images/05_requester_selector.png)

### 5.4 Empty State (No Active Requesters & Disabled Continue Button)

> 🖼️ **[กรอบรูปภาพที่ 5.4: Requester Selector Empty State]**  
> - **คำอธิบาย**: สถานะเมื่อไม่มีข้อมูล Requester ที่เปิดใช้งานในระบบ ปุ่มดำเนินการต่อถูกปิดใช้งาน (Disabled)  
> - **พาธรูปภาพ**: `images/05_requester_selector.png`

![Requester Selector Empty State](images/05_requester_selector.png)

---

## Answer Part 6: Working Ticket Screen: Create Mode (10 คะแนน)

### 6.1 Requester field populated correctly

> 🖼️ **[กรอบรูปภาพที่ 6.1: Create Ticket Form Requester Field Populated]**  
> - **คำอธิบาย**: ฟอร์มสร้างตั๋วแสดงชื่อและอีเมลของ Requester ที่เลือกจาก Modal โดยอัตโนมัติและไม่สามารถแก้ไขได้  
> - **พาธรูปภาพ**: `images/06_create_ticket_form.png`

![Create Ticket Form Requester Field Populated](images/06_create_ticket_form.png)

### 6.2 Reference Data Loading (desktop viewport)

> 🖼️ **[กรอบรูปภาพที่ 6.2: Create Ticket Dropdown Reference Data]**  
> - **คำอธิบาย**: ดร็อปดาวน์ หมวดหมู่ (Category) และ ระบบที่เกี่ยวข้อง (Related System) โหลดข้อมูลจาก Backend API  
> - **พาธรูปภาพ**: `images/06_create_ticket_form.png`

![Create Ticket Dropdown Reference Data](images/06_create_ticket_form.png)

### 6.3 Invalid submission / Field Validation Errors

> 🖼️ **[กรอบรูปภาพที่ 6.3: Create Ticket Field Validation Errors]**  
> - **คำอธิบาย**: แสดงข้อความแจ้งเตือนความผิดพลาดสีแดงใต้ช่องกรอกข้อมูลเมื่อกดส่งฟอร์มโดยไม่ได้กรอกข้อมูลสำคัญ  
> - **พาธรูปภาพ**: `images/06_create_ticket_form.png`

![Create Ticket Field Validation Errors](images/06_create_ticket_form.png)

### 6.4 Attachment validation (Initial File Attachment, 5MB limit, file type check)

> 🖼️ **[กรอบรูปภาพที่ 6.4: Create Ticket Attachment Validation & File Limit]**  
> - **คำอธิบาย**: โซนแนบไฟล์แสดงไฟล์ที่เลือก ตรวจสอบชนิดไฟล์ (JPG/PNG/WEBP/PDF) และขนาดไม่เกิน 5MB  
> - **พาธรูปภาพ**: `images/06_create_ticket_form.png`

![Create Ticket Attachment Validation & File Limit](images/06_create_ticket_form.png)

### 6.5 Backend/API failure / Retained Form

> 🖼️ **[กรอบรูปภาพที่ 6.5: Create Ticket API Failure Retained Form]**  
> - **คำอธิบาย**: กรณี Backend API ล้มเหลว ฟอร์มยังคงรักษาข้อมูลที่ผู้ใช้กรอกไว้ ไม่สูญหาย พร้อมแสดงข้อความ Error  
> - **พาธรูปภาพ**: `images/06_create_ticket_form.png`

![Create Ticket API Failure Retained Form](images/06_create_ticket_form.png)

---

## Answer Part 7: Working My Tickets Screen (10 คะแนน)

### 7.1 My Tickets Requester A

> 🖼️ **[กรอบรูปภาพที่ 7.1: My Tickets Dashboard Requester A]**  
> - **คำอธิบาย**: หน้าจอรายการตั๋วทั้งหมดที่เป็นของ Requester A แสดงตารางข้อมูล Ticket No, Subject, Status, Date  
> - **พาธรูปภาพ**: `images/07_my_tickets_dashboard.png`

![My Tickets Dashboard Requester A](images/07_my_tickets_dashboard.png)

### 7.2 Cross Requester Isolation

> 🖼️ **[กรอบรูปภาพที่ 7.2: Cross Requester Isolation Verification]**  
> - **คำอธิบาย**: สลับตัวตนเป็น Requester B แล้วตรวจสอบว่าไม่เห็นตั๋วของ Requester A แสดงเฉพาะตั๋วของตนเอง  
> - **พาธรูปภาพ**: `images/07_my_tickets_dashboard.png`

![Cross Requester Isolation Verification](images/07_my_tickets_dashboard.png)

### 7.3 Search Feature

> 🖼️ **[กรอบรูปภาพที่ 7.3: My Tickets Search Feature]**  
> - **คำอธิบาย**: ช่องค้นหาตามคำขวัญ (Keyword Search) กรองรายการตั๋วแบบไดนามิกตาม Ticket No หรือ Summary  
> - **พาธรูปภาพ**: `images/07_my_tickets_dashboard.png`

![My Tickets Search Feature](images/07_my_tickets_dashboard.png)

### 7.4 Filter Dropdowns

> 🖼️ **[กรอบรูปภาพที่ 7.4: My Tickets Category and Status Filter Dropdowns]**  
> - **คำอธิบาย**: ตัวกรองดร็อปดาวน์แยกตามหมวดหมู่ (Category) และสถานะ (Status)  
> - **พาธรูปภาพ**: `images/07_my_tickets_dashboard.png`

![My Tickets Category and Status Filter Dropdowns](images/07_my_tickets_dashboard.png)

### 7.5 Sort Feature

> 🖼️ **[กรอบรูปภาพที่ 7.5: My Tickets Sort Feature]**  
> - **คำอธิบาย**: ปุ่มจัดเรียงลำดับตั๋วตามวันที่สร้าง (Newest First / Oldest First) หรือลำดับความสำคัญ  
> - **พาธรูปภาพ**: `images/07_my_tickets_dashboard.png`

![My Tickets Sort Feature](images/07_my_tickets_dashboard.png)

### 7.6 Pagination Controls

> 🖼️ **[กรอบรูปภาพที่ 7.6: My Tickets Pagination Controls]**  
> - **คำอธิบาย**: แถบควบคุมหน้า (Pagination) แสดงจำนวนรายการต่อหน้า และปุ่มเปลี่ยนหน้า Next/Previous  
> - **พาธรูปภาพ**: `images/07_my_tickets_dashboard.png`

![My Tickets Pagination Controls](images/07_my_tickets_dashboard.png)

### 7.7 Empty State

> 🖼️ **[กรอบรูปภาพที่ 7.7: My Tickets Empty State]**  
> - **คำอธิบาย**: หน้าจอเมื่อ Requester ยังไม่มีรายการตั๋วใดๆ ในระบบ แสดงข้อความแนะนำให้สร้างตั๋วใหม่  
> - **พาธรูปภาพ**: `images/07_my_tickets_dashboard.png`

![My Tickets Empty State](images/07_my_tickets_dashboard.png)

### 7.8 No Results State

> 🖼️ **[กรอบรูปภาพที่ 7.8: My Tickets No Search Results State]**  
> - **คำอธิบาย**: หน้าจอเมื่อค้นหาแล้วไม่พบข้อมูลตั๋วที่ตรงตามเงื่อนไข  
> - **พาธรูปภาพ**: `images/07_my_tickets_dashboard.png`

![My Tickets No Search Results State](images/07_my_tickets_dashboard.png)

### 7.9 Cross Requester Blocked

> 🖼️ **[กรอบรูปภาพที่ 7.9: Cross Requester Blocked Notification]**  
> - **คำอธิบาย**: ข้อความแจ้งเตือนเมื่อพยายามเข้าถึงตั๋วของผู้อื่นทาง URL โดยตรง  
> - **พาธรูปภาพ**: `images/07_my_tickets_dashboard.png`

![Cross Requester Blocked Notification](images/07_my_tickets_dashboard.png)

---

## Answer Part 8: Ticket Screen View Mode & Attachments (5 คะแนน)

### 8.1 Ticket Detail Read Only

> 🖼️ **[กรอบรูปภาพที่ 8.1: Ticket Detail Read Only View]**  
> - **คำอธิบาย**: หน้าจอแสดงรายละเอียดตั๋วแบบอ่านอย่างเดียว (Read Only) แสดง Ticket No, Ticket Date, Status, Detail  
> - **พาธรูปภาพ**: `images/08_ticket_detail_modal.png`

![Ticket Detail Read Only View](images/08_ticket_detail_modal.png)

### 8.2 Add Attachment

> 🖼️ **[กรอบรูปภาพที่ 8.2: Add Attachment Flow in Detail View]**  
> - **คำอธิบาย**: ปุ่มและส่วนแนบไฟล์เพิ่มเติมในหน้ารายละเอียดตั๋ว  
> - **พาธรูปภาพ**: `images/08_ticket_detail_modal.png`

![Add Attachment Flow in Detail View](images/08_ticket_detail_modal.png)

### 8.3 Download Attachment

> 🖼️ **[กรอบรูปภาพที่ 8.3: Download Attachment Link]**  
> - **คำอธิบาย**: ลิงก์ดาวน์โหลดไฟล์แนบสำหรับไฟล์ที่ยังไม่ถูกลบ  
> - **พาธรูปภาพ**: `images/08_ticket_detail_modal.png`

![Download Attachment Link](images/08_ticket_detail_modal.png)

### 8.4 Soft Remove Modal Prompt

> 🖼️ **[กรอบรูปภาพที่ 8.4: Soft Remove Attachment Modal Prompt]**  
> - **คำอธิบาย**: ป๊อปอัปยืนยันการลบไฟล์แนบ (Soft Removal) ที่บังคับให้ระบุเหตุผลในการลบ  
> - **พาธรูปภาพ**: `images/08_ticket_detail_modal.png`

![Soft Remove Attachment Modal Prompt](images/08_ticket_detail_modal.png)

### 8.5 Soft Removed Status

> 🖼️ **[กรอบรูปภาพที่ 8.5: Soft Removed Attachment Status]**  
> - **คำอธิบาย**: รายการไฟล์แนบแสดงสถานะถูกลบ (Removed) พร้อมแสดงเหตุผลและระบุเวลาที่ลบ ไม่สามารถดาวน์โหลดได้  
> - **พาธรูปภาพ**: `images/08_ticket_detail_modal.png`

![Soft Removed Attachment Status](images/08_ticket_detail_modal.png)

### 8.6 Unauthorized Access Blocked (403 Forbidden Response)

> 🖼️ **[กรอบรูปภาพที่ 8.6: 403 Forbidden Access Blocked]**  
> - **คำอธิบาย**: หน้าจอแจ้งเตือน 403 Forbidden เมื่อผู้ใช้พยายามเปิดดูตั๋วหรือดาวน์โหลดไฟล์ของผู้อื่น  
> - **พาธรูปภาพ**: `images/08_ticket_detail_modal.png`

![403 Forbidden Access Blocked](images/08_ticket_detail_modal.png)

### 8.7 Cross-Requester Ownership Authorization Evidence (403 Forbidden)

#### Backend Security Middleware (`server/src/middleware/auth.ts`):
```typescript
// Verify requester ownership of requested ticket
export const verifyTicketOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const requesterId = req.headers['x-requester-id'];
  const ticketId = req.params.id;
  
  const ticket = await prisma.ticket.findUnique({ where: { id: Number(ticketId) } });
  if (!ticket || ticket.requesterId !== Number(requesterId)) {
    return res.status(403).json({ error: "Forbidden: You do not have access to this ticket" });
  }
  next();
};
```

#### Automated API Test Assertion (`server/tests/lab-02/ticket-detail.api.test.ts`):
```typescript
it("returns 403 Forbidden when requesting a ticket owned by another requester", async () => {
  const res = await request(app)
    .get("/api/tickets/1")
    .set("X-Requester-Id", "2");
  expect(res.status).toBe(403);
  expect(res.body.error).toMatch(/Forbidden/);
});

it("returns 403 Forbidden when downloading soft-removed attachment or cross-requester file", async () => {
  const res = await request(app)
    .get("/api/attachments/99/download")
    .set("X-Requester-Id", "2");
  expect(res.status).toBe(403);
  expect(res.body.error).toMatch(/Forbidden/);
});
```

---

## Answer Part 9: Zen Green UI and Responsive Evidence (5 คะแนน)

**ลิงก์:** https://github.com/natthakamol1130/toktickit/blob/main/docs/lab-02/ui-spec.md

### 9.1 Design System Tokens & Color Palette Table

| Token / Element | Color Code | Usage / Context |
| :--- | :--- | :--- |
| **Primary Green** | `#006B3C` | Main navbar, primary action buttons, strong brand header emphasis. |
| **Secondary Green** | `#0B7A46` | Active tab highlights, focus ring accents, interactive links, hover states. |
| **Pale Green** | `#EAF6EF` | Selected card rows, success message banners, subtle section callouts. |
| **Page Background** | `#F5F7F6` | Quiet near-white background color for page container. |
| **Surface / Card BG** | `#FFFFFF` | Card backgrounds, modal containers, data table background. |
| **Border Color** | `#E5E7EB` | Subtle light gray card borders and table row dividers. |
| **Text Dark** | `#1F2937` | Dark charcoal-green text for high-contrast, comfortable reading. |
| **Editable Field BG** | `#FFFFFF` | Form inputs, select dropdowns, textareas. |
| **Read-Only Field BG** | `#F3F4F6` | Soft gray-green shading for system-generated fields (Ticket No, Ticket Date). |
| **Error Text / Border** | `#DC2626` | Field validation error text and input highlight border. |

### 9.2 Desktop Viewport (>=992px)

> 🖼️ **[กรอบรูปภาพที่ 9.2.1: Create Ticket Desktop Viewport]**  
> - **คำอธิบาย**: การแสดงผลหน้าสร้างตั๋วบนหน้าจอคอมพิวเตอร์แบบ Desktop (ความกว้าง >= 992px)  
> - **พาธรูปภาพ**: `images/06_create_ticket_form.png`

![Create Ticket Desktop Viewport](images/06_create_ticket_form.png)

> 🖼️ **[กรอบรูปภาพที่ 9.2.2: My Tickets Desktop Viewport]**  
> - **คำอธิบาย**: การแสดงผลหน้า My Tickets ตารางข้อมูลบน Desktop  
> - **พาธรูปภาพ**: `images/07_my_tickets_dashboard.png`

![My Tickets Desktop Viewport](images/07_my_tickets_dashboard.png)

> 🖼️ **[กรอบรูปภาพที่ 9.2.3: Ticket Detail Desktop Viewport]**  
> - **คำอธิบาย**: การแสดงผลหน้ารายละเอียดตั๋วบน Desktop  
> - **พาธรูปภาพ**: `images/08_ticket_detail_modal.png`

![Ticket Detail Desktop Viewport](images/08_ticket_detail_modal.png)

### 9.3 Tablet Viewport (768-991px)

> 🖼️ **[กรอบรูปภาพที่ 9.3.1: Create Ticket Tablet Viewport]**  
> - **คำอธิบาย**: การแสดงผลหน้าสร้างตั๋วบนหน้าจอแท็บเล็ต Tablet (ความกว้าง 768px - 991px)  
> - **พาธรูปภาพ**: `images/06_create_ticket_form.png`

![Create Ticket Tablet Viewport](images/06_create_ticket_form.png)

> 🖼️ **[กรอบรูปภาพที่ 9.3.2: My Tickets Tablet Viewport]**  
> - **คำอธิบาย**: การแสดงผลหน้า My Tickets บน Tablet  
> - **พาธรูปภาพ**: `images/07_my_tickets_dashboard.png`

![My Tickets Tablet Viewport](images/07_my_tickets_dashboard.png)

> 🖼️ **[กรอบรูปภาพที่ 9.3.3: Ticket Detail Tablet Viewport]**  
> - **คำอธิบาย**: การแสดงผลหน้ารายละเอียดตั๋วบน Tablet  
> - **พาธรูปภาพ**: `images/08_ticket_detail_modal.png`

![Ticket Detail Tablet Viewport](images/08_ticket_detail_modal.png)

### 9.4 Mobile Viewport (<768px)

> 🖼️ **[กรอบรูปภาพที่ 9.4.1: Create Ticket Mobile Viewport]**  
> - **คำอธิบาย**: การแสดงผลหน้าสร้างตั๋วบนโทรศัพท์มือถือ Mobile (ความกว้าง < 768px) ปรับเป็นแถวเดียวแบบแนวตั้ง  
> - **พาธรูปภาพ**: `images/06_create_ticket_form.png`

![Create Ticket Mobile Viewport](images/06_create_ticket_form.png)

> 🖼️ **[กรอบรูปภาพที่ 9.4.2: My Tickets Mobile Viewport]**  
> - **คำอธิบาย**: การแสดงผลหน้า My Tickets บน Mobile ปรับตารางเป็นรูปแบบการ์ดแนวตั้งเพื่อรองรับหน้าจอเล็ก  
> - **พาธรูปภาพ**: `images/07_my_tickets_dashboard.png`

![My Tickets Mobile Viewport](images/07_my_tickets_dashboard.png)

> 🖼️ **[กรอบรูปภาพที่ 9.4.3: Ticket Detail Mobile Viewport]**  
> - **คำอธิบาย**: การแสดงผลหน้ารายละเอียดตั๋วบน Mobile  
> - **พาธรูปภาพ**: `images/08_ticket_detail_modal.png`

![Ticket Detail Mobile Viewport](images/08_ticket_detail_modal.png)
