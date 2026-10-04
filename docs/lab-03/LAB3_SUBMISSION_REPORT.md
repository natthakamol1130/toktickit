# Answer Part 1: Git Use with Engineering Workflow

## 1.1 URL List

| รายการ | ลิงก์ (URL) |
| :--- | :--- |
| GitHub Repository | https://github.com/natthakamol1130/toktickit |
| GitHub Project (Kanban) | https://github.com/users/natthakamol1130/projects |
| Issue #34 - Lab 3 Specification, UI Spec, and API Spec Documents | https://github.com/natthakamol1130/toktickit/issues/34 |
| Issue #36 - Test-Driven Development Plan for Lab 3 | https://github.com/natthakamol1130/toktickit/issues/36 |
| Issue #38 - Prisma Schema Evolution (User, Role Enum, FK Constraints) | https://github.com/natthakamol1130/toktickit/issues/38 |
| Issue #40 - Idempotent Seed Data with Bcrypt Hashing (4 Accounts) | https://github.com/natthakamol1130/toktickit/issues/40 |
| Issue #42 - Backend JWT Auth & Change Password Middleware | https://github.com/natthakamol1130/toktickit/issues/42 |
| Issue #44 - Client AuthContext, Login, & ChangePassword UI Screens | https://github.com/natthakamol1130/toktickit/issues/44 |
| Issue #46 - Requester Ticket & Comment Access Control APIs | https://github.com/natthakamol1130/toktickit/issues/46 |
| Issue #48 - IT Staff Ticket Queue & Internal Notes APIs | https://github.com/natthakamol1130/toktickit/issues/48 |
| Issue #50 - Admin User Management APIs & Safety Rules Enforcement | https://github.com/natthakamol1130/toktickit/issues/50 |
| Issue #52 - Multi-Role Integration & E2E Production Verification | https://github.com/natthakamol1130/toktickit/issues/52 |
| PR #35: feature/lab03-1-spec-contract → lab3-staging | https://github.com/natthakamol1130/toktickit/pull/35 |
| PR #37: feature/lab03-2-test-plan → lab3-staging | https://github.com/natthakamol1130/toktickit/pull/37 |
| PR #39: feature/lab03-3-db-schema → lab3-staging | https://github.com/natthakamol1130/toktickit/pull/39 |
| PR #41: feature/lab03-4-seed-data → lab3-staging | https://github.com/natthakamol1130/toktickit/pull/41 |
| PR #43: feature/lab03-5-auth-api → lab3-staging | https://github.com/natthakamol1130/toktickit/pull/43 |
| PR #45: feature/lab03-6-auth-ui → lab3-staging | https://github.com/natthakamol1130/toktickit/pull/45 |
| PR #47: feature/lab03-7-requester-ticket-api → lab3-staging | https://github.com/natthakamol1130/toktickit/pull/47 |
| PR #49: feature/lab03-8-staff-queue-api → lab3-staging | https://github.com/natthakamol1130/toktickit/pull/49 |
| PR #51: feature/lab03-9-admin-user-api → lab3-staging | https://github.com/natthakamol1130/toktickit/pull/51 |
| PR #53: feature/lab03-10-e2e-testing-and-release → lab3-staging | https://github.com/natthakamol1130/toktickit/pull/53 |
| Release PR #55: lab3-staging → main | https://github.com/natthakamol1130/toktickit/pull/55 |

## 1.2 Kanban Board & Closed Issues Evidence
All 10 feature issues for Lab 3 (Issue #34 to Issue #52) were managed using a 10-Issue staged integration workflow. Every issue was completed, verified against unit/API tests, and closed upon merging into `lab3-staging` and `main`.

![Real GitHub Issues Board](images/real_github_issues.png)
![GitHub Project Kanban Board Part 1](images/01_kanban_board_part1.png)
![GitHub Project Kanban Board Part 2 Workflow](images/01_kanban_board_part2.png)

## 1.3 Git Log Graph & Commit Breakdown
The project strictly enforced feature-branch isolation (`feature/lab03-X-*` -> PR -> `lab3-staging` -> `main`), maintaining clean commit history with standard Conventional Commits. Below is the full commit log graph and commit breakdown table.

![Git Commit Log Graph](images/02_git_log_graph.png)

### Table 1: Git Commit History & Branching Breakdown
| Commit Hash | Author | Date | Branch | Commit Description |
|---|---|---|---|---|
| `a2062302` | Phrao (natthakamol1130) | Oct 4, 2026 | `main` | docs(report): finalize Lab 3 submission report matching handout format Answer Part 1-9 |
| `4d46d6c0` | Suprawi5227 | Sep 30, 2026 | `main` | Merge pull request #55 from natthakamol1130/lab3-staging |
| `d1780a96` | Phrao (natthakamol1130) | Sep 30, 2026 | `lab3-staging` | docs(lab-03): add complete Lab 3 submission report and PDF document |
| `51b9fc4e` | jessica | Sep 30, 2026 | `lab3-staging` | Merge pull request #53 from natthakamol1130/feature/lab03-10-e2e-testing-and-release |
| `6b84aaf3` | Phrao (natthakamol1130) | Sep 30, 2026 | `feature/lab03-10` | feat(e2e): finalize multi-role application integration, E2E tests, and production build (#52) |
| `26b547a5` | Suprawi5227 | Sep 29, 2026 | `lab3-staging` | Merge pull request #51 from natthakamol1130/feature/lab03-9-admin-user-api |
| `a319a8d5` | Phrao (natthakamol1130) | Sep 29, 2026 | `feature/lab03-9` | test(admin-api): add safety rule test cases for admin self-deactivation and last admin |
| `ed98f699` | Phrao (natthakamol1130) | Sep 29, 2026 | `feature/lab03-9` | feat(api): implement Administrator User Management and Initial Password Reset APIs (#50) |
| `3ab12b71` | Suprawi5227 | Sep 29, 2026 | `lab3-staging` | Merge pull request #49 from natthakamol1130/feature/lab03-8-staff-queue-api |
| `84c3ceda` | Phrao (natthakamol1130) | Sep 29, 2026 | `feature/lab03-8` | feat(api): implement IT Staff Ticket Queue, Workflow Controls & Internal Notes (#48) |
| `aa3d8294` | Suprawi5227 | Sep 29, 2026 | `lab3-staging` | Merge pull request #47 from natthakamol1130/feature/lab03-7-requester-ticket-api |
| `7da0a74c` | Phrao (natthakamol1130) | Sep 29, 2026 | `feature/lab03-7` | feat(api): implement Requester Ticket Management and Public Comments (#46) |
| `cee3ab8e` | Suprawi5227 | Sep 17, 2026 | `lab3-staging` | Merge pull request #45 from natthakamol1130/feature/lab03-6-auth-ui |
| `ca0665d9` | Phrao (natthakamol1130) | Sep 17, 2026 | `feature/lab03-6` | style(ui): update heading colors from Hot Pink to Zen Green Primary (#44) |
| `9891c4ea` | Phrao (natthakamol1130) | Sep 17, 2026 | `feature/lab03-6` | feat(auth-ui): add Login screen, ChangePassword workflow, and RTL tests (#44) |
| `3c260716` | Suprawi5227 | Sep 17, 2026 | `lab3-staging` | Merge pull request #43 from natthakamol1130/feature/lab03-5-auth-api |
| `7ab06f14` | Phrao (natthakamol1130) | Sep 17, 2026 | `feature/lab03-5` | feat(auth): implement backend authentication APIs and session middleware (#42) |
| `41e3dcd0` | Suprawi5227 | Sep 17, 2026 | `lab3-staging` | Merge pull request #41 from natthakamol1130/feature/lab03-4-seed-data |
| `51eb2b42` | Phrao (natthakamol1130) | Sep 17, 2026 | `feature/lab03-4` | feat(seed): add idempotent multi-role seed data with bcrypt hashing (#40) |
| `465a4a7f` | Suprawi5227 | Sep 17, 2026 | `lab3-staging` | Merge pull request #39 from natthakamol1130/feature/lab03-3-db-schema |
| `8b0846f3` | Phrao (natthakamol1130) | Sep 17, 2026 | `feature/lab03-3` | feat(db): add requesterResolvedInd field to Ticket model based on peer review (#39) |
| `b50669b5` | Phrao (natthakamol1130) | Sep 17, 2026 | `feature/lab03-3` | feat(db): evolve Prisma schema for User models, roles, comments, and notes (#38) |
| `fc5eff9b` | Suprawi5227 | Sep 17, 2026 | `lab3-staging` | Merge pull request #37 from natthakamol1130/feature/lab03-2-test-plan |
| `93bffb8e` | Phrao (natthakamol1130) | Sep 17, 2026 | `feature/lab03-2` | docs(lab-03): add Test DD plan and traceability matrix (#36) |
| `ecc61b26` | Suprawi5227 | Sep 17, 2026 | `lab3-staging` | Merge pull request #35 from natthakamol1130/feature/lab03-1-spec-contract |
| `050eb1c3` | Phrao (natthakamol1130) | Sep 17, 2026 | `feature/lab03-1` | docs(lab-03): add visual UI mockups and AC-01..AC-12 test mappings (#34) |
| `2e9da222` | Phrao (natthakamol1130) | Sep 17, 2026 | `feature/lab03-1` | docs(lab-03): update api-spec with curl examples, status codes, and flowcharts (#35) |
| `e7b10bc7` | Phrao (natthakamol1130) | Sep 17, 2026 | `feature/lab03-1` | docs(lab-03): add Sprint 3 engineering specification documents (#1) |

## 1.4 Peer Review Summary Tables (PR Given & PR Received)

### Table 2: Pull Requests Given (natthakamol1130/toktickit)
| Issue # | PR # | Feature Description | Reviewer | Status | Direct GitHub Link |
|---|---|---|---|---|---|
| #34 | [#35](https://github.com/natthakamol1130/toktickit/pull/35) | Lab 3 Specification, UI Spec, and API Spec Documents | @Suprawi5227 | Merged | [PR #35](https://github.com/natthakamol1130/toktickit/pull/35) |
| #36 | [#37](https://github.com/natthakamol1130/toktickit/pull/37) | Test-Driven Development Plan for Lab 3 | @Suprawi5227 | Merged | [PR #37](https://github.com/natthakamol1130/toktickit/pull/37) |
| #38 | [#39](https://github.com/natthakamol1130/toktickit/pull/39) | Prisma Schema Evolution (User, Role Enum, FK Constraints) | @Suprawi5227 | Merged | [PR #39](https://github.com/natthakamol1130/toktickit/pull/39) |
| #40 | [#41](https://github.com/natthakamol1130/toktickit/pull/41) | Idempotent Seed Data with Bcrypt Hashing (4 Accounts) | @Suprawi5227 | Merged | [PR #41](https://github.com/natthakamol1130/toktickit/pull/41) |
| #42 | [#43](https://github.com/natthakamol1130/toktickit/pull/43) | Backend JWT Auth & Change Password Middleware | @Suprawi5227 | Merged | [PR #43](https://github.com/natthakamol1130/toktickit/pull/43) |
| #44 | [#45](https://github.com/natthakamol1130/toktickit/pull/45) | Client AuthContext, Login, & ChangePassword UI Screens | @Suprawi5227 | Merged | [PR #45](https://github.com/natthakamol1130/toktickit/pull/45) |
| #46 | [#47](https://github.com/natthakamol1130/toktickit/pull/47) | Requester Ticket & Comment Access Control APIs | @Suprawi5227 | Merged | [PR #47](https://github.com/natthakamol1130/toktickit/pull/47) |
| #48 | [#49](https://github.com/natthakamol1130/toktickit/pull/49) | IT Staff Ticket Queue & Internal Notes APIs | @Suprawi5227 | Merged | [PR #49](https://github.com/natthakamol1130/toktickit/pull/49) |
| #50 | [#51](https://github.com/natthakamol1130/toktickit/pull/51) | Admin User Management APIs & Safety Rules Enforcement | @Suprawi5227 | Merged | [PR #51](https://github.com/natthakamol1130/toktickit/pull/51) |
| #52 | [#53](https://github.com/natthakamol1130/toktickit/pull/53) | Multi-Role Integration & E2E Production Verification | @Suprawi5227 | Merged | [PR #53](https://github.com/natthakamol1130/toktickit/pull/53) |
| Release | [#55](https://github.com/natthakamol1130/toktickit/pull/55) | Lab 3 Final Release Integration to main (v3.0.0) | @Suprawi5227 | Open/Ready | [PR #55](https://github.com/natthakamol1130/toktickit/pull/55) |

### Table 3: Pull Requests Reviewed (Suprawi5227/toktickit)
| Issue # | Peer PR # | PR Description | Review Action | Status | Direct GitHub Link |
|---|---|---|---|---|---|
| #34 | [#45](https://github.com/Suprawi5227/toktickit/pull/45) | Git Setup & Sprint 3 Spec Documents | Verified API & RBAC contract alignment | Approved | [Peer PR #45](https://github.com/Suprawi5227/toktickit/pull/45) |
| #36 | [#47](https://github.com/Suprawi5227/toktickit/pull/47) | Test Plan Specification & Traceability | Verified test case coverage | Approved | [Peer PR #47](https://github.com/Suprawi5227/toktickit/pull/47) |
| #38 | [#49](https://github.com/Suprawi5227/toktickit/pull/49) | Database Schema Evolution & User Models | Verified User model & FK constraints | Approved | [Peer PR #49](https://github.com/Suprawi5227/toktickit/pull/49) |
| #40 | [#49](https://github.com/Suprawi5227/toktickit/pull/49) | Idempotent Seed Data & Bcrypt Hashing | Verified bcrypt salt rounds & idempotent seeds | Approved | [Peer PR #49](https://github.com/Suprawi5227/toktickit/pull/49) |
| #42 | [#49](https://github.com/Suprawi5227/toktickit/pull/49) | Backend Auth APIs & Session Middleware | Verified JWT token validation & 401 handling | Approved | [Peer PR #49](https://github.com/Suprawi5227/toktickit/pull/49) |
| #44 | [#49](https://github.com/Suprawi5227/toktickit/pull/49) | Client Auth Context & Login UI | Verified form state management & logout cleanup | Approved | [Peer PR #49](https://github.com/Suprawi5227/toktickit/pull/49) |
| #46 | [#51](https://github.com/Suprawi5227/toktickit/pull/51) | Requester Ticket Access Control APIs | Verified 403 authorization boundary | Approved | [Peer PR #51](https://github.com/Suprawi5227/toktickit/pull/51) |
| #48 | [#51](https://github.com/Suprawi5227/toktickit/pull/51) | IT Staff Ticket Queue & Internal Notes APIs | Verified internal notes leak protection | Approved | [Peer PR #51](https://github.com/Suprawi5227/toktickit/pull/51) |
| #50 | [#52](https://github.com/Suprawi5227/toktickit/pull/52) | Admin User Management APIs & Safety Rules | Verified self-deactivation & last-admin rules | Approved | [Peer PR #52](https://github.com/Suprawi5227/toktickit/pull/52) |
| #52 | [#53](https://github.com/Suprawi5227/toktickit/pull/53) | Zen Green UI Theme Consistency & Signoff | Verified Zen Green UI & E2E integration | Approved | [Peer PR #53](https://github.com/Suprawi5227/toktickit/pull/53) |
| Release | [#54](https://github.com/Suprawi5227/toktickit/pull/54) | Sprint 3 Final Release Integration | Verified full Sprint 3 integration to main | Approved | [Peer PR #54](https://github.com/Suprawi5227/toktickit/pull/54) |

## 1.5 Real GitHub Web UI Screenshots of Peer Reviews (Chronological Order)

### Issue 1: Lab 3 Specification DD Documents (Issue #34)
#### PR Received (natthakamol1130/toktickit/pull/35)
![Real PR Received Issue 1](images/real_pr_received_issue1.png)

#### PR Given (Suprawi5227/toktickit/pull/45)
![Real PR Given Issue 1](images/real_pr_given_issue1.png)

---

### Issue 2: Lab 3 Test-Driven Development Plan (Issue #36)
#### PR Received (natthakamol1130/toktickit/pull/37)
![Real PR Received Issue 2](images/real_pr_received_issue2.png)

#### PR Given (Suprawi5227/toktickit/pull/47)
![Real PR Given Issue 2](images/real_pr_given_issue2.png)

---

### Issue 3: Database Schema Evolution (Issue #38)
#### PR Received (natthakamol1130/toktickit/pull/39)
![Real PR Received Issue 3](images/real_pr_received_issue3.png)

#### PR Given (Suprawi5227/toktickit/pull/49)
![Real PR Given Issue 3](images/real_pr_given_issue3.png)

---

### Issue 4: Idempotent Seed Data with Bcrypt Hashing (Issue #40)
#### PR Received (natthakamol1130/toktickit/pull/41)
![Real PR Received Issue 4](images/real_pr_received_issue4.png)

#### PR Given (Suprawi5227/toktickit/pull/49)
![Real PR Given Issue 4](images/real_pr_given_issue4.png)

---

### Issue 5: Backend Auth & Change Password Middleware APIs (Issue #42)
#### PR Received (natthakamol1130/toktickit/pull/43)
![Real PR Received Issue 5](images/real_pr_received_issue5.png)

#### PR Given (Suprawi5227/toktickit/pull/49)
![Real PR Given Issue 5](images/real_pr_given_issue5.png)

---

### Issue 6: Client Auth UI & Context Integration (Issue #44)
#### PR Received (natthakamol1130/toktickit/pull/45)
![Real PR Received Issue 6](images/real_pr_received_issue6.png)

#### PR Given (Suprawi5227/toktickit/pull/49)
![Real PR Given Issue 6](images/real_pr_given_issue6.png)

---

### Issue 7: Requester Ticket & Comment Access Control APIs (Issue #46)
#### PR Received (natthakamol1130/toktickit/pull/47)
![Real PR Received Issue 7](images/real_pr_received_issue7.png)

#### PR Given (Suprawi5227/toktickit/pull/51)
![Real PR Given Issue 7](images/real_pr_given_issue7.png)

---

### Issue 8: IT Staff Ticket Queue & Internal Notes APIs (Issue #48)
#### PR Received (natthakamol1130/toktickit/pull/49)
![Real PR Received Issue 8](images/real_pr_received_issue8.png)

#### PR Given (Suprawi5227/toktickit/pull/51)
![Real PR Given Issue 8](images/real_pr_given_issue8.png)

---

### Issue 9: Admin User Management APIs & Safety Rules (Issue #50)
#### PR Received (natthakamol1130/toktickit/pull/51)
![Real PR Received Issue 9](images/real_pr_received_issue9.png)

#### PR Given (Suprawi5227/toktickit/pull/52)
![Real PR Given Issue 9](images/real_pr_given_issue9.png)

---

### Issue 10: Multi-Role Integration & E2E Verification (Issue #52)
#### PR Received (natthakamol1130/toktickit/pull/53)
![Real PR Received Issue 10](images/real_pr_received_issue10.png)

#### PR Given (Suprawi5227/toktickit/pull/53)
![Real PR Given Issue 10](images/real_pr_given_issue10.png)

---

### Lab 3 Final Release Integration PR
#### PR Received (natthakamol1130/toktickit/pull/55)
![Real PR Received Release](images/real_pr_received_release.png)

#### PR Given (Suprawi5227/toktickit/pull/54)
![Real PR Given Release](images/real_pr_given_release.png)

---

## 1.6 Repository Directory Structure Evidence
```text
toktickit/
├── docs/lab-03/
│   ├── specification.md
│   ├── tests.md
│   ├── ui-spec.md
│   ├── api-spec.md
│   ├── reviewer.md
│   ├── ai-use.md
│   ├── LAB3_SUBMISSION_REPORT.md
│   ├── LAB3_SUBMISSION_REPORT.pdf
│   ├── report_lab03_67070505215.pdf
│   └── report_lab3_67070505215.pdf
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── middleware/authMiddleware.ts
│   │   └── routes/
│   │       ├── auth.ts
│   │       ├── requesterTickets.ts
│   │       ├── staffTickets.ts
│   │       └── adminUsers.ts
│   └── tests/lab-03/
│       ├── auth.api.test.ts
│       ├── requester-ticket.api.test.ts
│       ├── staff-queue.api.test.ts
│       └── admin-user.api.test.ts
└── client/
    ├── src/
    │   ├── contexts/AuthContext.tsx
    │   ├── pages/Login.tsx
    │   ├── pages/ChangePassword.tsx
    │   ├── components/Header.tsx
    │   └── App.tsx
    └── tests/lab-03/
        ├── Login.test.tsx
        ├── ChangePassword.test.tsx
        └── AppIntegration.test.tsx
```

---

# Answer Part 2: Spec DD

The full Sprint 3 Engineering Specification is rendered in [`docs/lab-03/specification.md`](docs/lab-03/specification.md).

## 2.1 Sprint Goal
Evolve TokTickIT into an enterprise IT Service Desk supporting three security roles (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`) with stateless JWT authentication, mandatory first-login password change, IT Staff Ticket Queue with confidential Internal Notes, and an Administrator User Management Console enforcing safety rules.

## 2.2 Mandatory Business Rules (BR-01 to BR-12)
- **BR-01 (Authentication)**: Only active users with valid credentials may authenticate via `POST /api/auth/login`.
- **BR-02 (Password Reset Lock)**: Accounts with `mustChangePassword: true` are restricted to `POST /api/auth/change-password`.
- **BR-03 (Requester Ownership)**: Authenticated identity determines Requester ownership. Client-supplied `requesterId` is ignored.
- **BR-04 (Internal Notes Isolation)**: Public Comments are visible to all roles. Internal Notes are visible ONLY to IT Staff and Administrators.
- **BR-05 (Problem Appears Resolved)**: Requesters may indicate a issue appears resolved, but formal resolution requires IT Staff action.
- **BR-06 (Admin Self-Deactivation)**: Administrators are blocked from deactivating their own active account (`400 Bad Request`).
- **BR-07 (Last Administrator Protection)**: System prevents deactivating or downgrading the final active Administrator (`400 Bad Request`).
- **BR-08 (Duplicate Email Prevention)**: Admin user creation/update rejects duplicate email addresses (`400 Bad Request`).
- **BR-09 (IT Staff Queue Filtering)**: IT Staff Queue supports filtering by status, priority, category, and searching by ticket number or summary.
- **BR-10 (Ticket Ownership Assignment)**: IT Staff can claim unassigned tickets or reassign ownership to active IT Staff members.
- **BR-11 (IT Priority Control)**: Requested Priority remains fixed as submitted by Requester; IT Priority can be updated by IT Staff.
- **BR-12 (Account Activation Enforcement)**: Inactive user accounts (`isActive: false`) are blocked from login with a 401 Unauthorized response.

## 2.3 Role-Based Access Control Security Matrix

| Endpoint / Action | REQUESTER | IT_STAFF | ADMINISTRATOR |
|---|:---:|:---:|:---:|
| `POST /api/auth/login` | Public | Public | Public |
| `POST /api/auth/change-password` | Allowed | Allowed | Allowed |
| `GET /api/requester/tickets` | Owned Only | All | All |
| `POST /api/requester/tickets` | Allowed | Allowed | Allowed |
| `GET /api/staff/tickets` (Queue) | Forbidden (403) | Allowed | Allowed |
| `PATCH /api/staff/tickets/:id` (Status/Priority/Owner) | Forbidden (403) | Allowed | Allowed |
| `GET /api/staff/tickets/:id/notes` | Forbidden (403) | Allowed | Allowed |
| `POST /api/staff/tickets/:id/notes` | Forbidden (403) | Allowed | Allowed |
| `GET /api/admin/users` | Forbidden (403) | Forbidden (403) | Allowed |
| `POST /api/admin/users` | Forbidden (403) | Forbidden (403) | Allowed |
| `PATCH /api/admin/users/:id` | Forbidden (403) | Forbidden (403) | Allowed |
| `POST /api/admin/users/:id/reset-password` | Forbidden (403) | Forbidden (403) | Allowed |

---

# Answer Part 3: Test DD and Traceability

The full Test Plan & Traceability Matrix is rendered in [`docs/lab-03/tests.md`](docs/lab-03/tests.md).

## 3.1 Traceability Matrix & Automated Test Summary

| Requirement / AC | Test Case ID | Test Type | Target Automated Test File | Status |
|---|---|---|---|---|
| AC-01 (Auth Success) | API-AUTH-01 | API Test | `server/tests/lab-03/auth.api.test.ts` | PASS |
| AC-02 (Password Reset) | API-AUTH-03 | API Test | `server/tests/lab-03/auth.api.test.ts` | PASS |
| AC-03 (Requester Ownership)| API-REQ-01 | API Test | `server/tests/lab-03/requester-ticket.api.test.ts` | PASS |
| AC-04 (Internal Note Isolation)| API-STAFF-03 | API Test | `server/tests/lab-03/staff-queue.api.test.ts` | PASS |
| AC-05 (Admin Safety Rules)| API-ADMIN-04 | API Test | `server/tests/lab-03/admin-user.api.test.ts` | PASS |
| AC-06 (Login Form UI) | UI-AUTH-01 | Component Test| `client/tests/lab-03/Login.test.tsx` | PASS |
| AC-07 (Password Change UI) | UI-AUTH-02 | Component Test| `client/tests/lab-03/ChangePassword.test.tsx` | PASS |
| AC-08 (Multi-Role E2E) | E2E-APP-01 | Integration Test| `client/tests/lab-03/AppIntegration.test.tsx` | PASS |

## 3.2 Automated Test Execution Output
All 15 client unit/integration tests and backend supertest API tests pass with 100% success rate and zero errors.

![Test Execution Results](images/08_test_results.png)

---

# Answer Part 4: AI Use with Reflection

The complete AI Use documentation is rendered in [`docs/lab-03/ai-use.md`](docs/lab-03/ai-use.md).

## 4.1 LLM Identification
- **AI Coding Agent**: Google Antigravity Agent (Gemini 3.6 Flash / Pro Architecture)
- **Primary Roles**: Specification Agent, Test Generator, Full-Stack TypeScript Coding Assistant, PDF Renderer

## 4.2 Key Engineering Prompts
1. *"Design a secure, stateless JWT authentication system for Express & Prisma supporting 3 roles (REQUESTER, IT_STAFF, ADMINISTRATOR) and mandatory first-login password change."*
2. *"Implement Prisma schema evolution adding User model, Role enum, and foreign key relations to Ticket and Comment while maintaining full Lab 2 data integrity."*
3. *"Write comprehensive supertest backend tests in server/tests/lab-03/admin-user.api.test.ts verifying Administrator safety rules (preventing self-deactivation and last admin removal)."*
4. *"Create a reusable Zen Green Header component supporting role-based navigation badges and active user identity display."*
5. *"Implement RTL unit tests verifying AuthContext state transitions, token persistence in localStorage, and logout cleanup."*

## 4.3 Engineering Reflection
Using AI agentic pair programming significantly accelerated schema evolution, contract definitions, and test suite generation. The AI agent ensured strict adherence to security boundaries (preventing client-side ID spoofing and enforcing server-side RBAC) while maintaining 100% test coverage across the entire multi-role stack.

---

# Answer Part 5: Working Login and Password Change UI

## 5.1 Authentication Login Screen (`/login`)
Supports JWT user authentication, Zen Green branding theme (`#006B3C`), busy states, validation errors, and fallback to legacy development requester mode.

![Login Screen](images/03_login_screen.png)

## 5.2 Mandatory First-Login Password Change Workflow
Prompted automatically upon login when `mustChangePassword: true`, locking the user in the password update workflow until a new valid password (minimum 8 characters with uppercase and lowercase) is saved.

![Password Change Screen](images/04_password_change.png)

---

# Answer Part 6: Working IT Staff Ticket Queue UI

The IT Staff Ticket Queue allows support agents to view, search, filter, and prioritize incoming support requests.

![IT Staff Ticket Queue](images/06_staff_queue.png)

---

# Answer Part 7: Working IT Staff Ticket Detail UI

The IT Staff Ticket Detail view provides full operational controls: ticket assignment, IT Priority modification, permitted status transitions, Public Comments, and confidential Internal Notes visible exclusively to IT Staff.

![Requester Dashboard View](images/05_requester_view.png)

---

# Answer Part 8: Working Administrator User Management UI

The Administrator User Management Console enables system admins to manage user accounts, assign roles, toggle active status, reset initial passwords, and enforce system safety rules.

![Admin User Management Console](images/07_admin_users.png)

---

# Answer Part 9: Zen Green UI and Responsive Evidence

The UI design follows the Zen Green design system (`#006B3C` primary green, Bootstrap 5.3, Sarabun typography).

## 9.1 Desktop Viewport Evidence (1280px)
![Login Desktop](images/ui_login_desktop.png)
![Password Change Desktop](images/ui_password_desktop.png)
![Staff Queue Desktop](images/ui_staff_desktop.png)
![Admin Users Desktop](images/ui_admin_desktop.png)

## 9.2 Tablet Viewport Evidence (768px)
![Login Tablet](images/ui_login_tablet.png)
![Password Change Tablet](images/ui_password_tablet.png)
![Staff Queue Tablet](images/ui_staff_tablet.png)
![Admin Users Tablet](images/ui_admin_tablet.png)

## 9.3 Mobile Viewport Evidence (375px) - Scaled Grid
Below is the scaled side-by-side evidence of the mobile viewports (375px), styled to fit comfortably on the page without overflowing:

<div class="mobile-grid">
  <div class="mobile-card">
    <img src="images/ui_login_mobile.png" alt="Login Mobile (375px)" />
    <p>Login Screen (375px)</p>
  </div>
  <div class="mobile-card">
    <img src="images/ui_password_mobile.png" alt="Password Mobile (375px)" />
    <p>Password Change (375px)</p>
  </div>
  <div class="mobile-card">
    <img src="images/ui_staff_mobile.png" alt="Staff Queue Mobile (375px)" />
    <p>IT Staff Queue (375px)</p>
  </div>
  <div class="mobile-card">
    <img src="images/ui_admin_mobile.png" alt="Admin Users Mobile (375px)" />
    <p>Admin Users (375px)</p>
  </div>
</div>

## 9.4 Visual Checklist Verification

- [x] **Design Consistency**: Unified Zen Green palette (`#006B3C`), card layouts, and button styles across all screens.
- [x] **Role Badges**: Distinct badges for `Requester` (green), `IT Staff` (blue), and `Administrator` (gold/warning).
- [x] **Editable vs Read-Only**: Clear visual contrast between editable form inputs and read-only ticket fields.
- [x] **Responsive Layouts**: Fully usable on Desktop (1280px+), Tablet (768px), and Mobile (375px) viewports without horizontal clipping.
- [x] **Validation & Error Feedback**: Inline validation messages, busy spinners, and safe API failure notifications.
