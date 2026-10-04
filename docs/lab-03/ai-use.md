# Lab 3 AI Use with Reflection (ai-use.md)

- **Student Name:** Natthakamol Katippatee (Student ID: 67070505215)
- **Repository:** [`natthakamol1130/toktickit`](https://github.com/natthakamol1130/toktickit)
- **LLM Used:** Google Antigravity Agent (Gemini 3.6 Pro / Flash Architecture)
- **Lab Increment:** Lab 3 (Sprint 3 Enterprise Security & Multi-Role Ticketing)

---

## 1. Selected Key Engineering Prompts

### Prompt 1: Specification & Contract Design
> *"Design a secure, stateless JWT authentication system for Express & Prisma supporting 3 roles (REQUESTER, IT_STAFF, ADMINISTRATOR) and mandatory first-login password change. Document all business rules BR-01 to BR-12 in docs/lab-03/specification.md."*

### Prompt 2: Database Evolution
> *"Implement Prisma schema evolution adding User model, Role enum, and foreign key relations to Ticket and Comment while maintaining full Lab 2 data integrity."*

### Prompt 3: Backend Auth Middleware
> *"Create Express authentication middleware validating Bearer JWT tokens, loading user role, enforcing mandatory password reset restrictions, and returning 401 Unauthorized for expired or missing tokens."*

### Prompt 4: Idempotent Seed Data
> *"Write an idempotent seed script in server/prisma/seed.ts populating at least 4 active Requesters, 3 active IT Staff, 1 active Administrator, and inactive accounts with bcrypt password hashes."*

### Prompt 5: Admin User Management APIs
> *"Implement Administrator User Management APIs in server/src/routes/adminUsers.ts enforcing safety rules: preventing self-deactivation and preventing deactivation of the last active Administrator."*

### Prompt 6: Client Auth Context Integration
> *"Create AuthContext in client/src/contexts/AuthContext.tsx managing JWT tokens in localStorage, user state, and providing login/logout actions across all components."*

### Prompt 7: Login & Change Password UI
> *"Design Zen Green Login and ChangePassword components with inline validation, busy states, and redirection upon successful password reset."*

### Prompt 8: IT Staff Queue & Confidential Internal Notes
> *"Implement IT Staff Ticket Queue with search, filtering, sorting, pagination, and confidential Internal Notes visible strictly to IT Staff and Administrators."*

### Prompt 9: Automated Test Suites
> *"Write supertest backend tests in server/tests/lab-03/ verifying all AC criteria (auth, password reset, requester ownership, internal note isolation, admin safety rules)."*

### Prompt 10: PDF Submission Report Generation
> *"Write a script generating the complete Lab 3 Submission Report matching Handout Section 14 headings Answer Part 1 to Answer Part 9 with real GitHub web browser screenshots."*

---

## 2. My Engineering Reflection
Using AI agentic pair programming during Sprint 3 allowed for seamless transformation of complex stakeholder requirements into precise engineering contracts, database schemas, and automated test suites. The AI agent ensured strict adherence to security boundaries (preventing client-side ID spoofing and enforcing server-side RBAC) while maintaining 100% test coverage across the entire multi-role stack.
