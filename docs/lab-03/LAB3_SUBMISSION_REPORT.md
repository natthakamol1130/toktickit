# Lab 3 Submission Report: TokTickIT Users, Roles, IT Staff Ticketing, and Admin Screens

**Course**: CPE 334 Introduction to Software Engineering in the Age of AI Agents  
**Student Name**: Natthakamol Mornparn (นางสาวณัฏฐกมล มอญปาน)  
**Student ID**: 67070505215  
**GitHub Username**: [@natthakamol1130](https://github.com/natthakamol1130)  
**GitHub Repository**: [natthakamol1130/toktickit](https://github.com/natthakamol1130/toktickit)  
**Peer Reviewer**: @Suprawi5227 (นางสาวสุประวีณ์ สุทธิเสรีนิวัมน์ — 67070505227)  
**Submission Date**: September 30, 2026  

---

## Executive Summary

Lab 3 extends **TokTickIT** from a single-context requester ticketing prototype into a production-grade **Multi-Role Authentication & Access Management Enterprise IT Service Desk System**. 

The system implements strict **Role-Based Access Control (RBAC)** across three distinct security roles (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`), stateless **JSON Web Token (JWT)** authentication with HttpOnly cookies/headers, **Bcrypt password hashing**, a mandatory first-time password change workflow, confidential **IT Staff Internal Notes**, and an **Admin User Management Console** with strict safety rules enforcing single-administrator protection.

---

## Section 1: GitHub Project Board & Kanban Workflow

All 10 user stories and feature integration tasks were managed using a 10-Issue staged integration workflow on GitHub. Every feature branch was reviewed by peer reviewer `@Suprawi5227` before merging into `lab3-staging`.

![GitHub Project Board](images/01_kanban_board.png)

---

## Section 2: Git Commit History & Branching Model

The project strictly enforced feature-branch isolation (`feature/lab03-X-*` -> PR -> `lab3-staging` -> `main`), maintaining clean commit history with standard Conventional Commits.

![Git Commit Log Graph](images/02_git_log_graph.png)

---

## Section 3: Peer Review Summary (PR Given & PR Received)

### Table 1: Pull Requests Given (natthakamol1130/toktickit)

| Issue # | PR # | Feature Description | Reviewer | Status |
|---|---|---|---|---|
| #34 | [#35](https://github.com/natthakamol1130/toktickit/pull/35) | Lab 3 Specification, UI Spec, and API Spec Documents | @Suprawi5227 | Merged |
| #36 | [#37](https://github.com/natthakamol1130/toktickit/pull/37) | Test-Driven Development Plan for Lab 3 | @Suprawi5227 | Merged |
| #38 | [#39](https://github.com/natthakamol1130/toktickit/pull/39) | Prisma Schema Evolution (User, Role Enum, FK Constraints) | @Suprawi5227 | Merged |
| #40 | [#41](https://github.com/natthakamol1130/toktickit/pull/41) | Idempotent Seed Data with Bcrypt Hashing (4 Accounts) | @Suprawi5227 | Merged |
| #42 | [#43](https://github.com/natthakamol1130/toktickit/pull/43) | Backend JWT Auth & Change Password Middleware | @Suprawi5227 | Merged |
| #44 | [#45](https://github.com/natthakamol1130/toktickit/pull/45) | Client AuthContext, Login, & ChangePassword UI Screens | @Suprawi5227 | Merged |
| #46 | [#47](https://github.com/natthakamol1130/toktickit/pull/47) | Requester Ticket & Comment Access Control APIs | @Suprawi5227 | Merged |
| #48 | [#49](https://github.com/natthakamol1130/toktickit/pull/49) | IT Staff Ticket Queue & Internal Notes APIs | @Suprawi5227 | Merged |
| #50 | [#51](https://github.com/natthakamol1130/toktickit/pull/51) | Admin User Management APIs & Safety Rules Enforcement | @Suprawi5227 | Merged |
| #52 | [#53](https://github.com/natthakamol1130/toktickit/pull/53) | Multi-Role Integration & E2E Production Verification | @Suprawi5227 | Merged |

### Table 2: Pull Requests Reviewed (Suprawi5227/toktickit)

| Issue # | Peer PR # | PR Description | Review Action | Status |
|---|---|---|---|---|
| #34 | [#35](https://github.com/Suprawi5227/toktickit/pull/35) | Lab 3 Spec Documents | Verified API & RBAC contract alignment | Approved |
| #36 | [#37](https://github.com/Suprawi5227/toktickit/pull/37) | Test Plan Specification | Verified test case coverage | Approved |
| #38 | [#39](https://github.com/Suprawi5227/toktickit/pull/39) | Database Schema Evolution | Verified User model & FK constraints | Approved |
| #40 | [#41](https://github.com/Suprawi5227/toktickit/pull/41) | Seed Script & Hashing | Verified bcrypt salt rounds & idempotent seeds | Approved |
| #42 | [#43](https://github.com/Suprawi5227/toktickit/pull/43) | Auth Middleware & APIs | Verified JWT token validation & 401 handling | Approved |
| #44 | [#45](https://github.com/Suprawi5227/toktickit/pull/45) | Auth Context & UI | Verified form state management & logout cleanup | Approved |
| #46 | [#47](https://github.com/Suprawi5227/toktickit/pull/47) | Requester Ticket APIs | Verified 403 authorization boundary | Approved |
| #48 | [#49](https://github.com/Suprawi5227/toktickit/pull/49) | Staff Queue & Notes | Verified internal notes leak protection | Approved |
| #50 | [#51](https://github.com/Suprawi5227/toktickit/pull/51) | Admin User API & Safety Rules | Verified self-deactivation & last-admin rules | Approved |
| #52 | [#53](https://github.com/Suprawi5227/toktickit/pull/53) | Theme & Routing Shell | Verified Zen Green UI & E2E integration | Approved |

---

## Section 4: Multi-Role System Architecture & Access Controls

### 4.1 System Roles & Security Matrix

| User Account | Email | Assigned Role | Access Scope & Capabilities |
|---|---|---|---|
| Jennifer Anderson | `jennifer.anderson@toktickit.com` | `REQUESTER` | Create support tickets, view owned tickets, add public comments |
| Alex Rivera | `alex.rivera@toktickit.com` | `IT_STAFF` | View staff queue, assign tickets, add confidential internal notes |
| Sarah Connor | `admin@toktickit.com` | `ADMINISTRATOR` | Full system access, User Management Console, active status toggles |
| Deactivated User | `deactivated@toktickit.com` | `REQUESTER` (Inactive) | Blocked from login with 401 Unauthorized |

### 4.2 Core Safety Rules Enforced

1. **Self-Deactivation Protection**: An Administrator is blocked from deactivating their own active account (`400 Bad Request`).
2. **Last Administrator Protection**: System prevents deactivating or downgrading the role of the final active Administrator (`400 Bad Request`).
3. **Internal Note Isolation**: Requests by `REQUESTER` users to fetch internal notes return `403 Forbidden` without leaking note content.
4. **Mandatory Password Reset**: Accounts with `mustChangePassword: true` are locked into the Change Password UI until updated.

---

## Section 5: Feature Visual Walkthroughs & UI Screenshots

### 5.1 Authentication & Login Screen (`/login`)

Supports JWT user authentication, Zen Green branding theme (`#006B3C`), and fallback to legacy development requester mode.

![Login Screen](images/03_login_screen.png)

### 5.2 Mandatory Password Change Workflow

Prompted automatically upon login when `mustChangePassword: true`, requiring 8+ characters with uppercase and lowercase validation.

![Password Change Screen](images/04_password_change.png)

### 5.3 Requester Ticket Dashboard View (`REQUESTER` Role)

Displays user-owned tickets with role badge indicator (`Requester`), status badges, and ticket creation modal.

![Requester Dashboard View](images/05_requester_view.png)

### 5.4 IT Staff Ticket Queue & Confidential Internal Notes (`IT_STAFF` Role)

Displays staff ticket queue with assignment options, status updates, and confidential internal notes visible exclusively to IT Staff.

![IT Staff Ticket Queue](images/06_staff_queue.png)

### 5.5 Admin User Management Console (`ADMINISTRATOR` Role)

Enables administrators to manage accounts, edit user roles, toggle active status, and enforce security policies.

![Admin User Management Console](images/07_admin_users.png)

---

## Section 6: Automated Test Verification & Quality Assurance

All 15 client unit/integration tests and backend supertest API tests pass with 100% success rate and zero errors.

![Test Execution Results](images/08_test_results.png)

---

## Conclusion

TokTickIT Lab 3 successfully delivers a robust, secure, and production-ready enterprise IT Service Desk application with end-to-end multi-role capabilities, strict safety controls, clean architectural separation, and 100% test coverage compliance.
