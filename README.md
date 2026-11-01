# TokTickIT - IT Service Desk Application

TokTickIT is a full-stack enterprise IT service-desk web application for Account and Access, Hardware, Software, and Network support requests, featuring multi-role RBAC (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`), structured **Actions Taken** work logs, formal **Ticket Workflow & Resolution Gates**, **Optimistic Concurrency Control (`409 Conflict`)**, and **Role-Specific Operational Dashboards** under the **Zen Green** design system.

---

## Documentation & Engineering Specifications

### Sprint 4 (Lab 4 — Actions Taken, Role Dashboards & Final Regression)
- [Sprint 4 Engineering Specification](docs/lab-04/specification.md)
- [Zen Green UI Specification](docs/lab-04/ui-spec.md)
- [REST API Contract Specification](docs/lab-04/api-spec.md)
- [Test Plan & Traceability Matrix](docs/lab-04/tests.md)
- [Verification & Regression Report](docs/lab-04/verification.md)
- [Peer Review Log](docs/lab-04/reviewer.md)
- [AI Usage & Engineering Reflection](docs/lab-04/ai-usage.md)

### Sprint 3 (Lab 3 — Authentication, RBAC, Staff Queue & User Administration)
- [Sprint 3 Engineering Specification](docs/lab-03/specification.md)
- [Zen Green UI Specification](docs/lab-03/ui-spec.md)
- [REST API Contract Specification](docs/lab-03/api-spec.md)
- [Test Plan & Traceability Matrix](docs/lab-03/tests.md)

### Sprint 2 (Lab 2 — Requester Ticket Submission & Attachments)
- [Sprint 2 Engineering Specification](docs/lab-02/specification.md)
- [Zen Green UI Specification](docs/lab-02/ui-spec.md)
- [REST API Contract Specification](docs/lab-02/api-spec.md)

---

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Bootstrap 5 (Zen Green Theme)
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, JWT Authentication
- **Database**: PostgreSQL
- **Testing**: Vitest, Supertest, React Testing Library, Playwright

---

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
   npx prisma migrate deploy
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
- **Backend API & Regression Suite (`15/15` suites, `63/63` tests)**:
  ```bash
  npm --prefix server test
  ```
- **Frontend UI & Regression Suite (`13/13` suites, `26/26` tests)**:
  ```bash
  npm --prefix client test
  ```
- **End-to-End Playwright Suite**:
  ```bash
  npx playwright test e2e/lab-04/
  ```
