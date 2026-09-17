# TokTickIT - IT Service Desk Application

TokTickIT is an IT service desk web application for Account and Access, Hardware, Software, and Network requests.

## Documentation & Engineering Specifications

### Sprint 3 (Lab 3)
- [Sprint 3 Engineering Specification](docs/lab-03/specification.md)
- [Zen Green UI Specification](docs/lab-03/ui-spec.md)
- [REST API Contract Specification](docs/lab-03/api-spec.md)
- [Test Plan & Traceability Matrix](docs/lab-03/tests.md)

### Sprint 2 (Lab 2)
- [Sprint 2 Engineering Specification](docs/lab-02/specification.md)
- [Zen Green UI Specification](docs/lab-02/ui-spec.md)
- [REST API Contract Specification](docs/lab-02/api-spec.md)

---

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Bootstrap
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Testing**: Vitest, Supertest, Playwright

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
   npx prisma db push
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
- **End-to-End tests**:
  ```bash
  npx playwright test
  ```
