# TokTickIT Lab 3 REST API Specification

## 1. Overview & Authentication Mechanism
Lab 3 replaces header-based identity simulation (`x-requester-id`) with secure JWT Authorization bearer tokens or HTTP-only session cookies. All protected endpoints require valid authenticated user context and strictly enforce backend role permissions (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`).

---

## 2. Endpoints Summary Table

| Method | Endpoint Path | Description | Permitted Roles | Handled Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user credentials | Public | `200`, `400`, `401`, `500` |
| `POST` | `/api/auth/logout` | Invalidate authenticated session | Authenticated | `200`, `401`, `500` |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile & role | Authenticated | `200`, `401`, `500` |
| `POST` | `/api/auth/change-password` | Mandatory or voluntary password update | Authenticated | `200`, `400`, `401`, `500` |
| `GET` | `/api/requesters/tickets` | List tickets owned by authenticated Requester | Requester | `200`, `401`, `403`, `500` |
| `POST` | `/api/requesters/tickets` | Create ticket under authenticated Requester | Requester | `201`, `400`, `401`, `403`, `500` |
| `GET` | `/api/staff/tickets` | Query IT Staff Ticket Queue with search/filter/sort | IT Staff, Admin | `200`, `401`, `403`, `500` |
| `GET` | `/api/staff/tickets/:id` | Retrieve single ticket details for IT Staff | IT Staff, Admin | `200`, `401`, `403`, `404`, `500` |
| `PATCH` | `/api/staff/tickets/:id/assign` | Claim or reassign ticket primary owner | IT Staff, Admin | `200`, `400`, `401`, `403`, `404`, `500` |
| `PATCH` | `/api/staff/tickets/:id/workflow` | Update IT Priority and/or Ticket Status | IT Staff, Admin | `200`, `400`, `401`, `403`, `404`, `500` |
| `GET` | `/api/tickets/:id/comments` | List Public Comments on a ticket | All Roles | `200`, `401`, `403`, `404`, `500` |
| `POST` | `/api/tickets/:id/comments` | Post a Public Comment on a ticket | All Roles | `201`, `400`, `401`, `403`, `404`, `500` |
| `GET` | `/api/tickets/:id/notes` | List Internal Notes on a ticket | IT Staff, Admin ONLY | `200`, `401`, `403`, `404`, `500` |
| `POST` | `/api/tickets/:id/notes` | Create an Internal Note on a ticket | IT Staff, Admin ONLY | `201`, `400`, `401`, `403`, `404`, `500` |
| `GET` | `/api/admin/users` | List users with search & role filter | Admin ONLY | `200`, `401`, `403`, `500` |
| `POST` | `/api/admin/users` | Create user with initial password | Admin ONLY | `201`, `400`, `401`, `403`, `409`, `500` |
| `PATCH` | `/api/admin/users/:id` | Edit user profile or activation status | Admin ONLY | `200`, `400`, `401`, `403`, `404`, `409`, `500` |
| `POST` | `/api/admin/users/:id/reset-password` | Set new initial password for user | Admin ONLY | `200`, `400`, `401`, `403`, `404`, `500` |

---

## 3. Detailed Endpoint Specifications

### 3.1 Authentication APIs

#### `POST /api/auth/login`
Authenticates user credentials and returns session token and user identity.

- **`curl` Example**:
  ```bash
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"jennifer.anderson@toktickit.com","password":"InitialPassword123!"}'
  ```

- **Request Body**:
  ```json
  {
    "email": "jennifer.anderson@toktickit.com",
    "password": "InitialPassword123!"
  }
  ```

- **HTTP Responses**:
  - `200 OK`: Login successful.
    ```json
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "email": "jennifer.anderson@toktickit.com",
        "name": "Jennifer Anderson",
        "role": "REQUESTER",
        "mustChangePassword": true
      }
    }
    ```
  - `400 Bad Request`: Email or password field missing.
  - `401 Unauthorized`: Invalid credentials or account deactivated (`isActive = false`).

---

#### `POST /api/auth/change-password`
Updates user password and clears `mustChangePassword` flag.

- **`curl` Example**:
  ```bash
  curl -X POST http://localhost:3001/api/auth/change-password \
    -H "Authorization: Bearer <TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"currentPassword":"InitialPassword123!","newPassword":"NewSecurePassword456!"}'
  ```

- **HTTP Responses**:
  - `200 OK`: Password updated successfully; `mustChangePassword` is set to `false`.
  - `400 Bad Request`: New password does not meet strength rules or confirmation mismatch.
  - `401 Unauthorized`: Invalid current password or expired token.

---

### 3.2 IT Staff Ticket Queue API

#### `GET /api/staff/tickets`
Retrieves paginated ticket queue for IT Staff and Administrator users.

- **`curl` Example**:
  ```bash
  curl -X GET "http://localhost:3001/api/staff/tickets?search=battery&status=IN_PROGRESS&page=1&limit=10" \
    -H "Authorization: Bearer <STAFF_TOKEN>"
  ```

- **HTTP Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 12,
          "ticketNo": "TKT-2026-001234",
          "createdAt": "2026-09-15T08:14:00Z",
          "summary": "Laptop battery drains quickly",
          "category": "Hardware",
          "requestedPriority": "MEDIUM",
          "itPriority": "MEDIUM",
          "status": "IN_PROGRESS",
          "owner": { "id": 5, "name": "Michael Brown" }
        }
      ],
      "pagination": {
        "totalItems": 87,
        "totalPages": 9,
        "currentPage": 1,
        "pageSize": 10
      }
    }
    ```
  - `401 Unauthorized`: Missing or invalid authentication.
  - `403 Forbidden`: User role is `REQUESTER` (access restricted to IT Staff/Admin).

---

### 3.3 IT Staff Ticket Operations

#### `PATCH /api/staff/tickets/:id/assign`
Claim or reassign primary ticket ownership.

- **HTTP Responses**:
  - `200 OK`: Ticket owner updated.
  - `400 Bad Request`: Owner ID does not belong to an active IT Staff or Admin user.
  - `404 Not Found`: Ticket ID does not exist.

#### `PATCH /api/staff/tickets/:id/workflow`
Update IT Priority and Ticket Status.

- **HTTP Responses**:
  - `200 OK`: Status or IT Priority updated.
  - `400 Bad Request`: Invalid status transition attempted.
  - `404 Not Found`: Ticket ID not found.

---

### 3.4 Comments & Notes APIs

#### `POST /api/tickets/:id/comments` (Public Comment)
- **`curl` Example**:
  ```bash
  curl -X POST http://localhost:3001/api/tickets/12/comments \
    -H "Authorization: Bearer <TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"content":"We are investigating the issue on your device."}'
  ```
- **HTTP Responses**:
  - `201 Created`: Public comment saved.
  - `400 Bad Request`: Content empty or whitespace-only.

#### `POST /api/tickets/:id/notes` (Internal Note)
- **`curl` Example**:
  ```bash
  curl -X POST http://localhost:3001/api/tickets/12/notes \
    -H "Authorization: Bearer <STAFF_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"content":"Ordered battery replacement part."}'
  ```
- **HTTP Responses**:
  - `201 Created`: Internal note saved.
  - `403 Forbidden`: Requester user requested endpoint (Internal notes are restricted to IT Staff & Admin only).

---

### 3.5 Administrator User Management APIs

#### `POST /api/admin/users`
- **`curl` Example**:
  ```bash
  curl -X POST http://localhost:3001/api/admin/users \
    -H "Authorization: Bearer <ADMIN_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"name":"Alex Thompson","email":"alex.thompson@toktickit.com","role":"IT_STAFF","isActive":true,"initialPassword":"InitialPassword123!"}'
  ```
- **HTTP Responses**:
  - `201 Created`: User created with `mustChangePassword = true`.
  - `409 Conflict`: User email already exists.
  - `403 Forbidden`: Non-admin user requested endpoint.

#### `PATCH /api/admin/users/:id`
- **HTTP Responses**:
  - `200 OK`: User updated.
  - `400 Bad Request`: Attempted self-deactivation or deactivation of the last active Administrator account.
  - `404 Not Found`: User ID not found.
