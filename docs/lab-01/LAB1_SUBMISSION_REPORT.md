# CPE 334 — Lab 1 Submission Report

**Student Name:** Natthakamol  
**Student ID:** 67090500411  
**GitHub Username:** @natthakamol1130  
**Peer Reviewer:** Chanya (67090500406, @chanya06)  
**Date:** August 16, 2026  

---

## Answer Part 1: Git Use with Engineering Workflow

### 1. URLs List

- **GitHub Repository:**  
  https://github.com/natthakamol1130/toktickit
- **GitHub Project (Kanban):**  
  https://github.com/users/natthakamol1130/projects
- **GitHub Issues:**  
  - Issue #1 (Project foundation): https://github.com/natthakamol1130/toktickit/issues/1  
  - Issue #2 (API Health check): https://github.com/natthakamol1130/toktickit/issues/2  
  - Issue #3 (Create & seed categories): https://github.com/natthakamol1130/toktickit/issues/3  
  - Issue #4 (Display category list UI): https://github.com/natthakamol1130/toktickit/issues/4  
- **Pull Requests (PRs):**  
  - PR #5 (Feature 1 → lab1-staging): https://github.com/natthakamol1130/toktickit/pull/5  
  - PR #6 (Feature 2 → lab1-staging): https://github.com/natthakamol1130/toktickit/pull/6  
  - PR #7 (Feature 3 → lab1-staging): https://github.com/natthakamol1130/toktickit/pull/7  
  - PR #8 (Feature 4 → lab1-staging): https://github.com/natthakamol1130/toktickit/pull/8  
  - PR #9 (Release lab1-staging → main): https://github.com/natthakamol1130/toktickit/pull/9  

---

### 2. GitHub Project Board Evidence (Kanban)

> **[🖼️ แนบภาพ Screenshot: GitHub Project Kanban Board ที่ทุก Issue #1, #2, #3, #4 อยู่ในสถานะ 'Done']**

---

### 3. Git Workflow Evidence (`git log --oneline --graph --all` on `main`)

```text
*   c03027e Merge pull request #9 from natthakamol1130/lab1-staging
|\  
| *   ae40b84 Merge pull request #8 from natthakamol1130/feature/4-category-list
| |\  
| | * 50e7cec docs: update peer review record in reviewer.md (Issue #4)
| | * 6f90e97 feat: handle empty categories edge case gracefully in UI and tests
| | * b7e2d9b docs: document AI prompts and reflection for Lab 1 (Issue #4)
| | * 0f262cb feat: display IT request category list and system status UI (Issue #4)
| |/  
| *   4bc5182 Merge pull request #7 from natthakamol1130/feature/3-category-seed
| |\  
| | * 79f9d51 feat: create Category model and seed 4 initial categories (Issue #3)
| |/  
| *   69dbaf0 Merge pull request #6 from natthakamol1130/feature/2-health-check
| |\  
| | * eb256e6 feat: implement GET /api/health endpoint (Issue #2)
| |/  
| * f3bbc12 Merge pull request #5 from natthakamol1130/feature/1-project-foundation
|/| 
| * 2dc4643 chore: update .gitignore with IDE and env rules from peer review
| * 440e812 feat: set up TokTickIT project foundation (Issue #1)
|/  
* 101f877 Initial commit
```

> **[🖼️ แนบภาพ Screenshot: Terminal แสดงคำสั่ง `git log --oneline --graph -n 25` บน branch `main`]**

---

### 4. Repository Directory Structure Evidence

> **[🖼️ แนบภาพ Screenshot: แถบ Explorer ของ VS Code/IDE แสดงโครงสร้าง Directory ที่ครบถ้วนตามข้อกำหนด]**

**File Tree Checklist:**
- `toktickit/`
  - `client/`
    - `tests/lab-01/App.test.tsx`
    - `src/`
  - `server/`
    - `prisma/`
    - `src/`
    - `tests/lab-01/health.test.ts`
    - `tests/lab-01/categories.test.ts`
  - `docs/lab-01/`
    - `tests.md`
    - `reviewer.md`
    - `ai_use.md`
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

### 6. Rendered `README.md` Content

```markdown
# TokTickIT - IT Service Desk Application

TokTickIT is an IT service desk web application for Account and Access, Hardware, Software, and Network requests.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Bootstrap
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Testing**: Vitest, Supertest

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- PostgreSQL database

### 1. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update `DATABASE_URL` in `.env` with your PostgreSQL credentials.
4. Run migrations and seed the database:
   ```bash
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 3. Running Automated Tests
- **Backend tests**:
  ```bash
  cd server
  npm test
  ```
- **Frontend tests**:
  ```bash
  cd client
  npm test
  ```
```

---

### 7. Rendered `docs/lab-01/reviewer.md` (Peer Review Record)

# Lab 1 — Peer Review Record

**Author:** Natthakamol — 67090500411 — GitHub: @natthakamol1130  
**Peer reviewer:** Chanya — 67090500406 — GitHub: @chanya06  

#### Pull Requests I authored (reviewed by my partner)
| PR | Branch | Reviewer verdict |
|----|--------|------------------|
| [#5](https://github.com/natthakamol1130/toktickit/pull/5) | `feature/1-project-foundation` | Approved |
| [#6](https://github.com/natthakamol1130/toktickit/pull/6) | `feature/2-health-check` | Approved |
| [#7](https://github.com/natthakamol1130/toktickit/pull/7) | `feature/3-category-seed` | Approved |
| [#8](https://github.com/natthakamol1130/toktickit/pull/8) | `feature/4-category-list` | Approved |

**Reviewer comment I received:**
> โดยรวมทำได้ค่อนข้างครบตาม requirement ทั้ง API, การดึง category มาแสดงใน UI และมีการรองรับ Loading กับ Error state ด้วย แนะนำเพิ่มเติมว่าอาจลองทดสอบกรณี API ตอบข้อมูลว่าง หรือไม่มี category เพื่อดูว่า UI จะแสดงผลอย่างไร จะช่วยให้รองรับ edge case ได้ครบขึ้น

**How I responded:**
> ขอบคุณสำหรับคำแนะนำ ได้อัปเดตไฟล์ `client/src/App.tsx` ให้รองรับกรณี categories เป็นลิสต์ว่าง โดยแสดงผลข้อความ 'No categories found.' พร้อมเพิ่ม Unit Test ตรวจสอบ Edge case นี้ใน `App.test.tsx` และ push ขึ้น GitHub เรียบร้อยแล้ว

#### Pull Requests I reviewed for my partner
**My comment:**
> ตรวจสอบโค้ดและเอกสารใน PR (Issue 4) ทั้งหมดแล้วครับ พัฒนาได้สมบูรณ์แบบมาก Endpoint `GET /api/categories` ดึงข้อมูลและเรียงตาม id ถูกต้อง, หน้าจอ React UI และ Unit Tests ครอบคลุมทั้ง Online, Offline และ Loading, บันทึกผลเทสต์ใน `tests.md` และ Prompts ใน `ai_use.md` ได้ละเอียดครบถ้วน Approved!

**Partner's response:**
> ขอบคุณสำหรับ Review และคำแนะนำครับ ได้ตรวจสอบผลการรันเทสต์และเตรียม Merge เข้า lab1-staging เรียบร้อยครับ

---

## Answer Part 2: Tests

### 1. Test Plan Table (`docs/lab-01/tests.md`)

All test files live under `server/tests/lab-01/` and `client/tests/lab-01/`.

| Test ID | File | Tool | Test Description | Result |
|---|---|---|---|---|
| **API-01** | `server/tests/lab-01/health.test.ts` | Supertest | Health endpoint returns 200 and expected JSON `{ status: "ok", service: "TokTickIT API" }` | **Pass** |
| **API-02** | `server/tests/lab-01/categories.test.ts` | Supertest | Categories endpoint returns the four seeded categories in predictable ID order | **Pass** |
| **UI-01** | `client/tests/lab-01/App.test.tsx` | Vitest | TokTickIT heading renders properly | **Pass** |
| **UI-02** | `client/tests/lab-01/App.test.tsx` | Vitest | Success state shows Online + 4 request category list | **Pass** |
| **UI-03** | `client/tests/lab-01/App.test.tsx` | Vitest | Empty categories shows 'No categories found.' fallback | **Pass** |
| **UI-04** | `client/tests/lab-01/App.test.tsx` | Vitest | API failure displays Offline status + useful error message | **Pass** |

---

### 2. Terminal Test Evidence on `main` Branch

#### Backend Tests (Supertest)
```text
> toktickit-server@1.0.0 test
> vitest run

 RUN  v2.1.9 C:/Users/Windows/OneDrive/kmutt/Lab1_Starter_Scaffold/toktickit/server

 ✓ tests/lab-01/health.test.ts (1 test) 20ms
 ✓ tests/lab-01/categories.test.ts (1 test) 194ms

 Test Files  2 passed (2)
      Tests  2 passed (2)
   Start at  21:33:09
   Duration  10.68s
```

#### Frontend Tests (Vitest)
```text
> toktickit-client@1.0.0 test
> vitest run

 RUN  v2.1.9 C:/Users/Windows/OneDrive/kmutt/Lab1_Starter_Scaffold/toktickit/client

 ✓ tests/lab-01/App.test.tsx (4 tests) 249ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  21:34:04
   Duration  35.21s
```

> **[🖼️ แนบภาพ Screenshot: Terminal แสดงผลการรัน `npm test` ทั้งฝั่ง Server และ Client ผ่าน 100% บน branch `main`]**

---

## Answer Part 3: AI Use and Reflection

**LLM/agent used:** Antigravity (Gemini 3.6 Flash / Medium Thinking)

### Selected Key Prompts (6–10 Prompts)

| # | Prompt Name | Actual Prompt Text (Summarised) | What I did with the result / Reflection |
|---|---|---|---|
| 1 | **Plan Lab 1 Implementation** | Read the enclosed TokTickIT Lab 1 requirements. Summarize the four GitHub Issues, their dependencies, required outputs, and required automated tests. Propose an implementation order, but do not write code yet. | Reviewed the proposed implementation steps and approved the execution plan. |
| 2 | **Set Up Full-Stack Project (Issue 1)** | Setup the TokTickIT project tech stack as given in Lab 1 using React, TypeScript, Vite, and Bootstrap for the frontend, and Node.js, Express, and TypeScript for the backend. Configure PostgreSQL and Prisma. Use the required folder structure. | Verified dependencies, initialized git repository and branch structure, and created PR #5 to lab1-staging. |
| 3 | **Implement Health Check (Issue 2)** | Add GET /api/health to the existing Express backend returning HTTP 200 with `{ status: "ok", service: "TokTickIT API" }` and verify with Supertest. | Verified test passed 100%, committed changes to `feature/2-health-check`, and created PR #6. |
| 4 | **Implement Category DB Feature (Issue 3)** | Define Category model in Prisma schema, run migration, and implement idempotent database seeding using upsert for the 4 required categories. | Ran Prisma migrations against PostgreSQL, verified seed idempotency, and opened PR #7. |
| 5 | **Implement Category List API (Issue 4)** | Implement GET /api/categories endpoint in Express backend returning categories in predictable ID order from PostgreSQL via Prisma. | Verified endpoint with Supertest in `categories.test.ts`. |
| 6 | **Build and Test Check System UI (Issue 4)** | Create a Bootstrap-based page with [Check System] button. When clicked, show a loading state, call backend APIs, and render status badge and category list. | Implemented `App.tsx` and `api.ts`, connected frontend with backend API. |
| 7 | **Write Client Unit Tests (Issue 4)** | Write Vitest test suite for App component covering heading, success state, offline error state, and empty categories edge case. | Ran Vitest in client, confirming all 4 test cases passed. |
| 8 | **Review Peer PRs and Finalize Lab 1** | Review peer partners' pull requests for Issues 1, 2, 3, and 4 with constructive feedback and document peer review records. | Provided review comments, suggested improvements (.gitignore, seed idempotency), and documented review records in `reviewer.md`. |

### Reflection on Experience Improving Prompts
> Providing structured prompt contexts with explicit acceptance criteria, expected JSON response formats, and clear Git branch instructions allowed the agent to implement endpoints and test assertions accurately in one shot. When handling Windows PowerShell syntax nuances and database connection configurations, detailing the local environment parameters ensured that database migrations, seed scripts, and test suites executed reliably without errors.

---

## Answer Part 4: App Demo

### 1. Initial State
เมื่อเปิดหน้าเว็บขึ้นมา จะแสดงชื่อระบบ `TokTickIT IT Service Desk` พร้อมปุ่ม `[Check System]`

> **[🖼️ แนบภาพ Screenshot: หน้าจอเริ่มต้นแสดงหัวข้อ TokTickIT และปุ่ม Check System]**

---

### 2. Success Case (Backend Online & DB Connected)
เมื่อกดปุ่ม `[Check System]` โดยที่ระบบ Backend และ Database ทำงานปกติ หน้าจอจะแสดงสถานะ `System Status: Online` และรายชื่อ 4 หมวดหมู่คำขอที่ดึงมาจากฐานข้อมูล

> **[🖼️ แนบภาพ Screenshot: หน้าจอแสดง System Status: Online พร้อมรายการ 4 หมวดหมู่ (Account and Access, Hardware, Software, Network)]**

---

### 3. Failure Case (Backend Offline / DB Disconnected)
เมื่อกดปุ่ม `[Check System]` ในขณะที่ Backend Server หรือ Database ปิดอยู่ หน้าจอจะแสดงสถานะ `System Status: Offline` พร้อมข้อความแจ้งเตือน `Unable to connect to TokTickIT API`

> **[🖼️ แนบภาพ Screenshot: หน้าจอแสดง System Status: Offline พร้อมข้อความ Unable to connect to TokTickIT API]**
