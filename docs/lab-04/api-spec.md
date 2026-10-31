# TokTickIT Lab 4 REST API Specification

## 1. Overview & Authentication Mechanism
Sprint 4 extends the TokTickIT REST API with endpoints for **Actions Taken**, **Requester Dashboard**, **IT Staff Dashboard**, and **Hardened Ticket Workflow Lifecycle**.

All protected endpoints enforce JSON Web Token (JWT) Bearer authentication or session validation via `Authorization: Bearer <token>` header, strictly checking user roles (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`) and data ownership boundaries.

---

## 2. Endpoints Summary Table

| Method | Endpoint Path | Description | Permitted Roles | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tickets/:ticketId/actions-taken` | List all Actions Taken for a Ticket | Requester (Owned), IT Staff, Admin | `200`, `401`, `403`, `404`, `500` |
| `POST` | `/api/tickets/:ticketId/actions-taken` | Record a new Action Taken under Ticket | IT Staff, Admin | `201`, `400`, `401`, `403`, `404`, `409`, `500` |
| `GET` | `/api/tickets/:ticketId/actions-taken/:actionId` | Retrieve single Action Taken details | Requester (Owned), IT Staff, Admin | `200`, `401`, `403`, `404`, `500` |
| `PATCH` | `/api/tickets/:ticketId/actions-taken/:actionId` | Update an existing Action Taken | IT Staff, Admin | `200`, `400`, `401`, `403`, `404`, `409`, `500` |
| `GET` | `/api/requesters/dashboard` | Authoritative Requester metrics & recent tickets | Requester ONLY | `200`, `401`, `403`, `500` |
| `GET` | `/api/staff/dashboard` | Authoritative IT Staff queue metrics & summary | IT Staff, Admin | `200`, `401`, `403`, `500` |
| `PATCH` | `/api/staff/tickets/:ticketId/workflow` | Update Ticket Status / IT Priority with Concurrency | IT Staff, Admin | `200`, `400`, `401`, `403`, `404`, `409`, `500` |

---

## 3. Detailed Endpoint Specifications

### 3.1 Actions Taken APIs

#### `GET /api/tickets/:ticketId/actions-taken`
Retrieves all Actions Taken for a specific ticket in reverse chronological order (`actionDateTime DESC`).

- **Permissions**:
  - Requesters can only access Actions Taken for tickets they own (`requesterId == user.id`). Accessing other tickets returns `403 Forbidden`.
  - IT Staff and Administrators can access Actions Taken for any accessible ticket.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "act_cm1234567890",
      "ticketId": "tkt_001",
      "performerId": "usr_staff_01",
      "performer": {
        "id": "usr_staff_01",
        "name": "Michael IT",
        "email": "michael.it@toktickit.com"
      },
      "actionDateTime": "2026-10-31T09:30:00.000Z",
      "description": "Inspected internal battery connection and tested power adapter voltage.",
      "result": "Battery voltage is below operational threshold. Hardware replacement required.",
      "followUpRequired": true,
      "followUpNote": "Order replacement battery pack SKU-BAT-882 from approved supplier.",
      "attachmentNotes": "Refer to battery_diagnostic_report.png attached to ticket.",
      "createdAt": "2026-10-31T09:32:00.000Z",
      "updatedAt": "2026-10-31T09:32:00.000Z"
    }
  ]
}
```

---

#### `POST /api/tickets/:ticketId/actions-taken`
Records a new Action Taken. The system automatically populates `performerId` with the ID of the authenticated user.

- **Permissions**: IT Staff, Administrator. Requesters receive `403 Forbidden`.
- **Validation Rules**:
  - `description`: String, required, minimum 5 characters.
  - `result`: String, required, minimum 2 characters.
  - `actionDateTime`: ISO date string, optional (defaults to current server timestamp).
  - `followUpRequired`: Boolean, required.
  - `followUpNote`: String. **Mandatory (non-empty)** if `followUpRequired` is `true`. Optional if `false`.
  - `attachmentNotes`: String, optional.
- **Request Body**:
```json
{
  "actionDateTime": "2026-10-31T09:30:00.000Z",
  "description": "Inspected internal battery connection and tested power adapter voltage.",
  "result": "Battery voltage is below operational threshold. Hardware replacement required.",
  "followUpRequired": true,
  "followUpNote": "Order replacement battery pack SKU-BAT-882 from approved supplier.",
  "attachmentNotes": "Refer to battery_diagnostic_report.png attached to ticket."
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Action Taken recorded successfully.",
  "data": {
    "id": "act_cm1234567890",
    "ticketId": "tkt_001",
    "performerId": "usr_staff_01",
    "actionDateTime": "2026-10-31T09:30:00.000Z",
    "description": "Inspected internal battery connection and tested power adapter voltage.",
    "result": "Battery voltage is below operational threshold. Hardware replacement required.",
    "followUpRequired": true,
    "followUpNote": "Order replacement battery pack SKU-BAT-882 from approved supplier.",
    "attachmentNotes": "Refer to battery_diagnostic_report.png attached to ticket.",
    "createdAt": "2026-10-31T09:32:00.000Z",
    "updatedAt": "2026-10-31T09:32:00.000Z"
  }
}
```
- **Response `400 Bad Request`** (Validation Failure):
```json
{
  "success": false,
  "error": "Validation Error",
  "details": "Follow-up note is strictly required when follow-up is needed."
}
```

#### `GET /api/tickets/:ticketId/actions-taken/:actionId`
Retrieves details of a single Action Taken by ID.

- **Permissions**:
  - Requesters can only access Actions Taken for tickets they own (`requesterId == user.id`). Accessing other tickets returns `403 Forbidden`.
  - IT Staff and Administrators can access any Action Taken on accessible tickets.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "act_cm1234567890",
    "ticketId": "tkt_001",
    "performerId": "usr_staff_01",
    "performer": {
      "id": "usr_staff_01",
      "name": "Michael IT",
      "email": "michael.it@toktickit.com"
    },
    "actionDateTime": "2026-10-31T09:30:00.000Z",
    "description": "Inspected internal battery connection and tested power adapter voltage.",
    "result": "Battery voltage is below operational threshold. Hardware replacement required.",
    "followUpRequired": true,
    "followUpNote": "Order replacement battery pack SKU-BAT-882 from approved supplier.",
    "attachmentNotes": "Refer to battery_diagnostic_report.png attached to ticket.",
    "createdAt": "2026-10-31T09:32:00.000Z",
    "updatedAt": "2026-10-31T09:32:00.000Z"
  }
}
```
- **Response `404 Not Found`**:
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Action Taken record not found under this ticket."
}
```

---

#### `PATCH /api/tickets/:ticketId/actions-taken/:actionId`
Updates an existing Action Taken record.

- **Permissions**: IT Staff, Administrator.
- **Concurrency Check**: Client must pass `expectedUpdatedAt` in body. If record has been modified by someone else in the interim, returns `409 Conflict`.
- **Request Body**:
```json
{
  "description": "Updated diagnostic summary and completed power supply test.",
  "result": "Battery pack ordered and scheduled for installation tomorrow morning.",
  "followUpRequired": true,
  "followUpNote": "Notify user upon delivery of part.",
  "attachmentNotes": "battery_diagnostic_report.png",
  "expectedUpdatedAt": "2026-10-31T09:32:00.000Z"
}
```
- **Response `200 OK`**: Updated record.
- **Response `409 Conflict`**:
```json
{
  "success": false,
  "error": "Conflict",
  "message": "This Action Taken was updated by another user. Please refresh and review before saving."
}
```

---

#### Action Taken Immutability & Audit Trail Note
> **Note on Deletion:** The TokTickIT REST API intentionally **does not provide a `DELETE` endpoint** for Actions Taken records. In accordance with enterprise IT service-desk compliance and business rule **BR-13**, all logged actions serve as an immutable historical audit trail of troubleshooting and remediation steps. Staff may correct details via `PATCH`, but historical operational records cannot be purged.

---

### 3.2 Role Dashboard APIs

#### `GET /api/requesters/dashboard`
Returns authoritative summary metrics and recent tickets strictly scoped to the authenticated Requester.

- **Permissions**: Requester ONLY. IT Staff and Admin receive `403 Forbidden` (they use `/api/staff/dashboard`).
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalOpen": 3,
      "inProgress": 2,
      "resolved": 5,
      "closed": 12
    },
    "recentTickets": [
      {
        "id": "tkt_001",
        "ticketNumber": "TKT-2026-001234",
        "summary": "Laptop battery drains quickly",
        "category": { "name": "Hardware" },
        "status": "IN_PROGRESS",
        "updatedAt": "2026-10-31T09:32:00.000Z"
      },
      {
        "id": "tkt_002",
        "ticketNumber": "TKT-2026-001222",
        "summary": "Request software access for Figma",
        "category": { "name": "Software" },
        "status": "RESOLVED",
        "updatedAt": "2026-10-30T14:20:00.000Z"
      }
    ],
    "quickActions": [
      { "label": "Create Ticket", "path": "/create-ticket" },
      { "label": "View My Tickets", "path": "/my-tickets" }
    ]
  }
}
```

---

#### `GET /api/staff/dashboard`
Returns operational metrics for the IT Staff command center calculated from the database.

- **Permissions**: IT Staff, Administrator.
- **Query Parameters**:
  - `days`: Optional integer (defaults to `30`) for recent activity filtering.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "metrics": {
      "newTickets": 14,
      "openTickets": 23,
      "inProgress": 18,
      "waitingForRequester": 7,
      "myAssigned": 16,
      "unassigned": 9
    },
    "byPriority": {
      "URGENT": 4,
      "HIGH": 12,
      "MEDIUM": 28,
      "LOW": 18
    },
    "recentTickets": [
      {
        "id": "tkt_001",
        "ticketNumber": "TKT-2026-001234",
        "summary": "Laptop battery drains quickly",
        "requester": { "name": "Jennifer Anderson" },
        "status": "IN_PROGRESS",
        "itPriority": "HIGH",
        "owner": { "id": "usr_staff_01", "name": "Michael IT" },
        "updatedAt": "2026-10-31T09:32:00.000Z"
      }
    ],
    "userSummary": {
      "totalUsers": 25,
      "activeRequesters": 18,
      "activeStaff": 5,
      "activeAdmins": 2
    }
  }
}
```

---

### 3.3 Hardened Ticket Workflow API with Concurrency

#### `PATCH /api/staff/tickets/:ticketId/workflow`
Updates status, IT Priority, and enforces resolution gates and stale-update detection.

- **Permissions**: IT Staff, Administrator.
- **Request Body**:
```json
{
  "status": "RESOLVED",
  "itPriority": "HIGH",
  "expectedUpdatedAt": "2026-10-31T09:32:00.000Z"
}
```
- **Resolution Gate Rule**:
  - If Requester has set `requesterResolvedInd: true`, the ticket remains in current status until IT Staff explicitly calls this endpoint with `"status": "RESOLVED"`.
- **Concurrency Conflict `409 Conflict`**:
  - Returned if `ticket.updatedAt != expectedUpdatedAt`.
```json
{
  "success": false,
  "error": "Conflict",
  "message": "The ticket was modified by another user since you loaded it. Please refresh and try again.",
  "currentTicket": {
    "id": "tkt_001",
    "status": "IN_PROGRESS",
    "updatedAt": "2026-10-31T09:40:00.000Z"
  }
}
```
