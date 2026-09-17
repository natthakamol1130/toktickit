# TokTickIT Lab 3 REST API Specification

## 1. Overview & Authentication Mechanism
Lab 3 replaces header-based identity simulation (`x-requester-id`) with HTTP-only session cookies or JWT Authorization bearer tokens. Protected endpoints require valid authenticated user context and check backend role permissions.

---

## 2. Endpoints Summary Table

| Method | Endpoint Path | Description | Permitted Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user credentials | Public |
| `POST` | `/api/auth/logout` | Invalidate authenticated session | Authenticated |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile & role | Authenticated |
| `POST` | `/api/auth/change-password` | Mandatory or voluntary password update | Authenticated |
| `GET` | `/api/requesters/tickets` | List tickets owned by authenticated Requester | Requester |
| `POST` | `/api/requesters/tickets` | Create ticket under authenticated Requester | Requester |
| `GET` | `/api/staff/tickets` | Query IT Staff Ticket Queue with search/filter/sort | IT Staff, Admin |
| `GET` | `/api/staff/tickets/:id` | Retrieve single ticket details for IT Staff | IT Staff, Admin |
| `PATCH` | `/api/staff/tickets/:id/assign` | Claim or reassign ticket primary owner | IT Staff, Admin |
| `PATCH` | `/api/staff/tickets/:id/workflow` | Update IT Priority and/or Ticket Status | IT Staff, Admin |
| `GET` | `/api/tickets/:id/comments` | List Public Comments on a ticket | All Roles |
| `POST` | `/api/tickets/:id/comments` | Post a Public Comment on a ticket | All Roles |
| `GET` | `/api/tickets/:id/notes` | List Internal Notes on a ticket | IT Staff, Admin ONLY |
| `POST` | `/api/tickets/:id/notes` | Create an Internal Note on a ticket | IT Staff, Admin ONLY |
| `GET` | `/api/admin/users` | List users with search & role filter | Admin ONLY |
| `POST` | `/api/admin/users` | Create user with initial password | Admin ONLY |
| `PATCH` | `/api/admin/users/:id` | Edit user profile or activation status | Admin ONLY |
| `POST` | `/api/admin/users/:id/reset-password` | Set new initial password for user | Admin ONLY |

---

## 3. Detailed Endpoint Specifications

### 3.1 Authentication APIs

#### `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "jennifer.anderson@toktickit.com",
    "password": "InitialPassword123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "email": "jennifer.anderson@toktickit.com",
      "name": "Jennifer Anderson",
      "role": "REQUESTER",
      "mustChangePassword": true
    }
  }
  ```
- **Response `401 Unauthorized`**: Invalid credentials or inactive account.

#### `POST /api/auth/change-password`
- **Request Body**:
  ```json
  {
    "currentPassword": "InitialPassword123!",
    "newPassword": "NewSecurePassword456!"
  }
  ```
- **Response `200 OK`**: Passwords updated, `mustChangePassword` set to `false`.

---

### 3.2 IT Staff Ticket Queue API

#### `GET /api/staff/tickets`
- **Query Parameters**:
  - `search`: string (Ticket Number or Summary keyword)
  - `category`: string/number
  - `requestedPriority`: `LOW` | `MEDIUM` | `HIGH` | `URGENT`
  - `itPriority`: `LOW` | `MEDIUM` | `HIGH` | `URGENT`
  - `status`: `NEW` | `OPEN` | `IN_PROGRESS` | `WAITING_FOR_REQUESTER` | `RESOLVED` | `CLOSED` | `REOPENED` | `CANCELLED`
  - `sortBy`: `createdAt` | `ticketNo` | `itPriority` | `status` (default: `createdAt`)
  - `sortOrder`: `asc` | `desc` (default: `desc`)
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
- **Response `200 OK`**:
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

---

### 3.3 IT Staff Ticket Operations

#### `PATCH /api/staff/tickets/:id/assign`
- **Request Body**:
  ```json
  {
    "ownerId": 5
  }
  ```
- **Response `200 OK`**: Ticket owner updated to specified IT Staff / Admin user ID.

#### `PATCH /api/staff/tickets/:id/workflow`
- **Request Body**:
  ```json
  {
    "itPriority": "HIGH",
    "status": "IN_PROGRESS"
  }
  ```
- **Response `200 OK`**: Updated ticket metadata returned.

---

### 3.4 Comments & Notes APIs

#### `POST /api/tickets/:id/comments` (Public Comment)
- **Request Body**: `{ "content": "We are investigating the issue." }`
- **Response `201 Created`**: Returns created comment with author name, role, timestamp.

#### `POST /api/tickets/:id/notes` (Internal Note)
- **Access**: IT Staff & Admin ONLY.
- **Request Body**: `{ "content": "Vendor contacted for replacement battery." }`
- **Response `201 Created`**: Internal note saved.
- **Response `403 Forbidden`**: Returned if Requester attempts access.

---

### 3.5 Administrator APIs

#### `GET /api/admin/users`
- **Query Parameters**: `search` (name or email), `role` (`REQUESTER` | `IT_STAFF` | `ADMINISTRATOR`)
- **Response `200 OK`**: List of all users matching filter criteria.

#### `POST /api/admin/users`
- **Request Body**:
  ```json
  {
    "name": "Alex Thompson",
    "email": "alex.thompson@toktickit.com",
    "role": "IT_STAFF",
    "isActive": true,
    "initialPassword": "InitialPassword123!"
  }
  ```
- **Response `201 Created`**: User created with `mustChangePassword = true`.

#### `PATCH /api/admin/users/:id`
- **Request Body**:
  ```json
  {
    "name": "Alex Thompson",
    "email": "alex.thompson@toktickit.com",
    "role": "IT_STAFF",
    "isActive": false
  }
  ```
- **Response `400 Bad Request`**: Returned if attempting self-deactivation or deactivating last active Admin.
