# TokTickIT Lab 2 REST API Specification

## 1. Overview & Authentication Header
Lab 2 uses a simulated Requester identity. Every request requiring user context must send the selected Development Requester ID in the `x-requester-id` HTTP header.

```http
x-requester-id: 1
```

---

## 2. Endpoints Summary

| Method | Endpoint Path | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/requesters` | Retrieve active Development Requesters | Public |
| `GET` | `/api/categories` | Retrieve active Ticket Categories | Public |
| `GET` | `/api/related-systems` | Retrieve active Related Systems | Public |
| `POST` | `/api/tickets` | Create a new ticket (with optional attachments) | Requester Header |
| `GET` | `/api/tickets` | List owned tickets (search, filter, sort, paginate) | Requester Header |
| `GET` | `/api/tickets/:id` | Retrieve single owned ticket details | Requester Header |
| `POST` | `/api/tickets/:id/attachments` | Upload an attachment to an existing ticket | Requester Header |
| `GET` | `/api/attachments/:id/download` | Download an active attachment | Requester Header |
| `DELETE` | `/api/attachments/:id` | Soft-remove an attachment with reason | Requester Header |

---

## 3. Detailed Endpoint Contracts

### 3.1 GET `/api/requesters`
Returns active Development Requesters for the selector screen. Inactive requesters are excluded.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Jennifer Anderson",
      "email": "jennifer.anderson@kmutt.ac.th",
      "department": "Computer Engineering"
    },
    {
      "id": 2,
      "name": "Michael Brown",
      "email": "michael.brown@kmutt.ac.th",
      "department": "Information Technology"
    }
  ]
}
```

---

### 3.2 GET `/api/categories`
Returns active categories.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Account and Access" },
    { "id": 2, "name": "Hardware" },
    { "id": 3, "name": "Software" },
    { "id": 4, "name": "Network" }
  ]
}
```

---

### 3.3 GET `/api/related-systems`
Returns active related systems.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Email" },
    { "id": 2, "name": "Campus Wi-Fi" },
    { "id": 3, "name": "VPN" },
    { "id": 4, "name": "LEB2 App" },
    { "id": 5, "name": "Grade Submission App" },
    { "id": 6, "name": "Corporate Laptop" }
  ]
}
```

---

### 3.4 POST `/api/tickets`
Creates a ticket for the selected Requester (`x-requester-id`). Accepts `multipart/form-data` if uploading attachments alongside creation, or `application/json`.

**Headers**:
- `x-requester-id`: `1` (Required)

**Request Body** (`JSON` or `formData`):
```json
{
  "categoryId": 2,
  "relatedSystemId": 6,
  "requestedPriority": "MEDIUM",
  "summary": "Laptop battery drains quickly",
  "description": "My laptop battery is draining much faster than usual even when system is idle."
}
```

**Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "id": 12,
    "ticketNo": "TKT-2026-001234",
    "requesterId": 1,
    "categoryId": 2,
    "relatedSystemId": 6,
    "requestedPriority": "MEDIUM",
    "status": "NEW",
    "summary": "Laptop battery drains quickly",
    "description": "My laptop battery is draining much faster than usual even when system is idle.",
    "createdAt": "2026-09-03T10:00:00.000Z",
    "updatedAt": "2026-09-03T10:00:00.000Z",
    "attachments": []
  }
}
```

**Error Response `400 Bad Request`**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "summary": ["Summary must be at least 5 characters long"],
      "description": ["Description must be at least 10 characters long"]
    }
  }
}
```

---

### 3.5 GET `/api/tickets`
Lists tickets owned by the current Requester (`x-requester-id`).

**Headers**:
- `x-requester-id`: `1` (Required)

**Query Parameters**:
- `search` (string, optional): Search keyword matching `ticketNo` or `summary`.
- `category` (int, optional): Filter by `categoryId`.
- `priority` (string, optional): Filter by `requestedPriority` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
- `status` (string, optional): Filter by `status` (`NEW`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).
- `page` (int, default `1`): Page number.
- `limit` (int, default `10`): Items per page.
- `sortBy` (string, default `createdAt`): Sort field (`createdAt`, `ticketNo`, `requestedPriority`, `status`).
- `sortOrder` (string, default `desc`): `asc` or `desc`.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "ticketNo": "TKT-2026-001234",
      "summary": "Laptop battery drains quickly",
      "category": { "id": 2, "name": "Hardware" },
      "relatedSystem": { "id": 6, "name": "Corporate Laptop" },
      "requestedPriority": "MEDIUM",
      "status": "NEW",
      "attachmentCount": 2,
      "createdAt": "2026-09-03T10:00:00.000Z",
      "updatedAt": "2026-09-03T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

---

### 3.6 GET `/api/tickets/:id`
Retrieves a single owned ticket. Enforces ownership: if ticket does not belong to `x-requester-id`, returns `403 Forbidden`.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": 12,
    "ticketNo": "TKT-2026-001234",
    "requester": { "id": 1, "name": "Jennifer Anderson", "email": "jennifer.anderson@kmutt.ac.th" },
    "category": { "id": 2, "name": "Hardware" },
    "relatedSystem": { "id": 6, "name": "Corporate Laptop" },
    "requestedPriority": "MEDIUM",
    "status": "NEW",
    "summary": "Laptop battery drains quickly",
    "description": "My laptop battery is draining much faster than usual even when system is idle.",
    "createdAt": "2026-09-03T10:00:00.000Z",
    "attachments": [
      {
        "id": 1,
        "fileName": "battery_log.pdf",
        "fileSize": 245000,
        "mimeType": "application/pdf",
        "isRemoved": false,
        "createdAt": "2026-09-03T10:00:00.000Z"
      }
    ]
  }
}
```

**Error Response `403 Forbidden`**:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied: You do not own this ticket"
  }
}
```

---

### 3.7 POST `/api/tickets/:id/attachments`
Uploads an attachment file to an existing ticket (enforces max 5 active attachments limit).

**Headers**:
- `x-requester-id`: `1`
- `Content-Type`: `multipart/form-data`

**Request Body**:
- `file`: (binary file, max 5MB, JPG/PNG/WEBP/PDF)

**Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "ticketId": 12,
    "fileName": "screenshot.png",
    "fileSize": 1048576,
    "mimeType": "image/png",
    "isRemoved": false,
    "createdAt": "2026-09-03T10:05:00.000Z"
  }
}
```

---

### 3.8 DELETE `/api/attachments/:id`
Soft-removes an active attachment. Mandatory `reason` payload.

**Headers**:
- `x-requester-id`: `1`
- `Content-Type`: `application/json`

**Request Body**:
```json
{
  "reason": "Uploaded wrong file by mistake"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "ticketId": 12,
    "fileName": "screenshot.png",
    "isRemoved": true,
    "removalReason": "Uploaded wrong file by mistake",
    "removedAt": "2026-09-03T10:10:00.000Z"
  }
}
```

---

### 3.9 GET `/api/attachments/:id/download`
Downloads an active attachment file. If `isRemoved` is `true`, returns `410 Gone` or `403 Forbidden`.

**Response `200 OK`**:
Binary stream (`Content-Type: image/png` or `application/pdf`, `Content-Disposition: attachment; filename="..."`).

**Error Response `410 Gone`**:
```json
{
  "success": false,
  "error": {
    "code": "ATTACHMENT_REMOVED",
    "message": "This attachment has been soft-removed and cannot be downloaded"
  }
}
```

<!-- Feature 2: REST API Endpoints Contract & Status Codes -->


---

## Comprehensive REST API Endpoint Specification

### 1. Context & Headers
- All API endpoints are served under `http://localhost:3000/api`
- All protected requester operations require the `x-requester-id` header specifying the requester user ID.

### 2. Reference Data API Endpoints
- `GET /api/requesters` - Returns active development requester accounts for context switching.
- `GET /api/categories` - Returns available ticket category options.
- `GET /api/related-systems` - Returns available IT system metadata.

### 3. Ticket Management API Endpoints
- `POST /api/tickets` - Creates a new support ticket. Auto-generates sequence ticket number (`TKT-YYYY-XXXXXX`).
- `GET /api/tickets` - Retrieves tickets filtered by category, priority, status, search keyword, with sorting and pagination.
- `GET /api/tickets/:id` - Retrieves read-only ticket details. Returns `403 Forbidden` if requested by a different user.

### 4. Attachment Management API Endpoints
- `POST /api/tickets/:id/attachments` - Uploads attachment file (max 5MB: JPG, PNG, WEBP, PDF).
- `DELETE /api/attachments/:id` - Soft-removes attachment with mandatory removal reason in payload.
- `GET /api/attachments/:id/download` - Downloads attached file. Returns `410 Gone` if the file has been soft-removed.

### 5. HTTP Error Response Shapes
All error responses follow the standard JSON error shape:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid ticket payload",
    "details": []
  }
}
```
