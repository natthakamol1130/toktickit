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
