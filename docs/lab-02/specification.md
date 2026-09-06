# Lab 2 Sprint Engineering Specification

## 1. Sprint Goal
Deliver a professional, responsive, end-user (Requester) ticketing application increment for TokTickIT. The increment enables Requesters to select a temporary testing identity, create IT support tickets with attachments, view and manage their submitted tickets through search, filter, sort, and pagination, and inspect ticket details with soft-removal capabilities for attachments, all adhering to the Zen Green visual design system.

## 2. Stakeholder Request Interpretation
The IT department needs a functional Requester-facing portal to capture and track IT support requests cleanly. Requesters must be able to describe an issue, select its category and impacted system, assign a priority, upload supporting files (images or PDFs), and submit the ticket. Upon creation, the system must assign a unique Ticket Number. Requesters need a dashboard ("My Tickets") to manage their tickets without seeing other users' tickets. Since authentication is deferred to Lab 3, a Development Requester selector will simulate user sessions.

## 3. Scope

### Included
- **Development Requester Selector**: Simulated login context allowing switching between active seeded Requesters.
- **Create Ticket Workflow**: Form with classification, summary, description, attachment upload, validation, and system-generated Ticket Number display.
- **My Tickets Workflow**: Requester-owned ticket list supporting keyword search, category/priority/status filters, sorting, pagination, empty states, and no-results states.
- **Requester Ticket Detail Workflow**: Read-only view of owned tickets, capability to upload additional attachments, and soft-remove existing attachments with a required reason.
- **Data & Security Rules**: Requester ownership isolation, attachment constraints (max 5MB, JPG/PNG/WEBP/PDF, max 5 active attachments), soft-removal preservation.
- **UI Design**: Zen Green theme components, responsive layouts (Desktop, Tablet, Mobile), accessibility compliance.

### Excluded
- Real user authentication (login, logout, password hashing, sessions, JWT, RBAC).
- IT Staff workflow (dashboard, ticket claiming, reassigning, changing IT priority, workflow status transitions beyond `New`).
- Ticket communication features (Public Comments, Internal Notes, Actions Taken).
- Ticket lifecycle actions after creation (resolving, closing, reopening, cancelling).
- Administrative functions for user/system reference management.

## 4. Functional Requirements
- **FR-01**: The system shall provide a Development Requester selection mechanism to set the active testing identity.
- **FR-02**: The system shall display active categories and active related systems for ticket creation.
- **FR-03**: The system shall allow a Requester to submit a ticket with Summary, Description, Category, Related System, Requested Priority, and optional Attachments.
- **FR-04**: The system shall generate a unique official Ticket Number (format: `TKT-YYYY-XXXXXX`) upon successful ticket submission.
- **FR-05**: The system shall set the initial status of newly created tickets to `New`.
- **FR-06**: The system shall list tickets owned exclusively by the currently selected Development Requester.
- **FR-07**: The system shall allow searching tickets by Ticket Number or Summary keyword.
- **FR-08**: The system shall allow filtering tickets by Category, Requested Priority, and Status.
- **FR-09**: The system shall support sorting tickets by Creation Date, Ticket Number, Priority, or Status in ascending/descending order.
- **FR-10**: The system shall paginate ticket lists with configurable page sizes (default 10).
- **FR-11**: The system shall display read-only Ticket Detail for an owned ticket.
- **FR-12**: The system shall support adding permitted attachments to an existing ticket up to the maximum limit of 5 active attachments.
- **FR-13**: The system shall allow soft-removing an active attachment by the owner after capturing a mandatory removal reason.
- **FR-14**: The system shall prevent downloading or previewing soft-removed attachments while preserving metadata display.

## 5. Business Rules
- **BR-01**: Ticket Numbers are server-generated, immutable, and strictly unique across the system (`TKT-YYYY-XXXXXX`).
- **BR-02**: All newly created tickets begin with Current Status `New`.
- **BR-03**: The Development Requester Selector is a testing context mechanism, not secure authentication.
- **BR-04**: Inactive Requesters shall not appear in the Development Requester Selector and cannot create or view tickets.
- **BR-05**: Requester Ownership Isolation: A Requester can only query, view, or modify tickets and attachments that they own (`requesterId` match). Accessing another Requester's ticket shall return HTTP 403 Forbidden.
- **BR-06**: Attachment Constraints:
  - Allowed file types: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`.
  - Maximum file size: 5 MB (5,242,880 bytes) per file.
  - Maximum active attachments: 5 files per ticket.
- **BR-07**: Attachment Removal: Soft-removal only (`isRemoved = true`, recording `removalReason` and `removedAt`). Soft-removed files cannot be downloaded or previewed.
- **BR-08**: Field Validation:
  - `summary`: Required, trimmed, length 5 to 150 characters.
  - `description`: Required, trimmed, length 10 to 2000 characters.
  - `categoryId`: Required, must exist and be active.
  - `relatedSystemId`: Required, must exist and be active.
  - `requestedPriority`: Required, allowed values: `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
- **BR-09**: Default Ticket List Sorting: Primary sort `createdAt` descending, secondary sort `id` descending.
- **BR-10**: Error State Preservation: If ticket creation fails (API or validation error), entered form data must be preserved in the frontend UI.

## 6. UI Specification Summary
The UI implements the **Zen Green Design System**:
- **Palette**: Primary (`#006B3C`), Secondary (`#0B7A46`), Pale Green (`#EAF6EF`), Background (`#F5F7F6`), Surface (`#FFFFFF`), Text (`#1F2925`), Error (`#D32F2F`), Warning (`#F59E0B`).
- **Header Shell**: App title "TokTickIT", active tab highlight, current Requester profile display, "Change Requester" action button.
- **Create Ticket Screen**: Card layout with clear sectioning, system-generated fields styled read-only, red asterisks (`*`) for required fields, field-level error messages below inputs, file drop zone with badge indicators.
- **My Tickets Screen**: Search bar, category/priority/status filter dropdowns, sort controls, responsive table for desktop, responsive cards for mobile, clear pagination controls, distinct empty and no-results feedback states.
- **Ticket Detail Screen**: Two-column desktop layout (header info + detail card), attachments list with active/removed status badges, upload file modal, soft-removal confirmation modal.
- **Responsive Layout**: Desktop ($\ge 992\text{px}$), Tablet ($768\text{px} - 991\text{px}$), Mobile ($< 768\text{px}$) with zero horizontal scroll.

## 7. Data Changes

### Models & Schema Updates (Prisma)
- **`RequesterUser`**: `id` (Int PK), `name` (String), `email` (String Unique), `department` (String), `isActive` (Boolean default true), `createdAt`, `updatedAt`.
- **`Category`**: `id` (Int PK), `name` (String Unique), `isActive` (Boolean default true), `createdAt`.
- **`RelatedSystem`**: `id` (Int PK), `name` (String Unique), `isActive` (Boolean default true), `createdAt`.
- **`Ticket`**: `id` (Int PK), `ticketNo` (String Unique), `requesterId` (Int FK -> RequesterUser), `categoryId` (Int FK -> Category), `relatedSystemId` (Int FK -> RelatedSystem), `requestedPriority` (Enum: LOW, MEDIUM, HIGH, URGENT), `status` (Enum: NEW, IN_PROGRESS, RESOLVED, CLOSED default NEW), `summary` (String), `description` (Text), `createdAt`, `updatedAt`.
- **`Attachment`**: `id` (Int PK), `ticketId` (Int FK -> Ticket), `fileName` (String), `fileKey` (String), `fileSize` (Int), `mimeType` (String), `isRemoved` (Boolean default false), `removalReason` (String nullable), `removedAt` (DateTime nullable), `createdAt`.

### Indexes & Constraints
- Index on `Ticket(requesterId, createdAt)` for ownership queries and default sorting.
- Index on `Ticket(status)` and `Ticket(categoryId)` for filtering.
- Index on `Attachment(ticketId)` for attachment listing.

## 8. API Contract Summary
- `GET /api/requesters` - List active Requesters.
- `GET /api/categories` - List active ticket categories.
- `GET /api/related-systems` - List active related systems.
- `POST /api/tickets` - Create new ticket (Headers: `x-requester-id`).
- `GET /api/tickets` - Search, filter, sort, paginate tickets owned by active Requester (Headers: `x-requester-id`).
- `GET /api/tickets/:id` - Get detail of owned ticket (Headers: `x-requester-id`).
- `POST /api/tickets/:id/attachments` - Upload attachment to owned ticket (Headers: `x-requester-id`).
- `GET /api/attachments/:id/download` - Download active attachment (Headers: `x-requester-id`).
- `DELETE /api/attachments/:id` - Soft-remove attachment with reason (Headers: `x-requester-id`).

## 9. Acceptance Criteria
- **AC-01**: Given valid ticket data and attachments, when the Requester submits the form, then a ticket is saved in the database with a unique `TKT-YYYY-XXXXXX` Ticket Number and status `NEW`.
- **AC-02**: Given no Development Requester is selected, when attempting to open ticket screens, then the Requester Selection screen is displayed.
- **AC-03**: Given Requester A is selected, when Requester A views My Tickets, then only Requester A's tickets are returned.
- **AC-04**: Given Requester B is selected, when Requester B attempts to access a ticket belonging to Requester A, then an HTTP 403 Forbidden error is returned.
- **AC-05**: Given an invalid submission (empty summary or description < 10 chars), when submitted, then field-level red validation messages appear and no API call is dispatched.
- **AC-06**: Given an invalid file attachment (> 5MB or unpermitted MIME type), when selected, then an explicit error message is displayed and upload is blocked.
- **AC-07**: Given a ticket with 5 active attachments, when attempting to upload a 6th file, then the upload is rejected with a maximum limit error message.
- **AC-08**: Given an active attachment on an owned ticket, when the user provides a removal reason and confirms soft-removal, then `isRemoved` is set to `true` and the download action becomes disabled.
- **AC-09**: Given a ticket list with 25 tickets, when navigating pages with page size 10, then pagination controls correctly display pages 1, 2, 3 and update items accordingly.
- **AC-10**: Given a search query "battery", when applied in My Tickets, then only tickets matching "battery" in Ticket Number or Summary are displayed.
- **AC-11**: Given a server failure during ticket creation, when submitted, then a clear error banner appears and user-entered form data remains preserved.
- **AC-12**: Given a tablet or mobile viewport, when accessing any screen, then all fields stack cleanly without horizontal scrollbars or clipped text.

## 10. Definition of Done
- [ ] All functional requirements (`FR-01` to `FR-14`) and business rules (`BR-01` to `BR-10`) implemented.
- [ ] All acceptance criteria (`AC-01` to `AC-12`) satisfied and verified by passing automated unit, API, UI, and E2E tests.
- [ ] Database schema updated, migrated, and seeded with required Categories, Related Systems, Active Requesters, and Inactive Requester.
- [ ] Zen Green design system implemented consistently across all 4 screens with responsive support for Desktop, Tablet, and Mobile.
- [ ] Peer review completed and merged into `lab2-staging` and subsequently `main` via PRs.
- [ ] Documentation (`specification.md`, `api-spec.md`, `ui-spec.md`, `tests.md`, `reviewer.md`, `ai-use.md`) complete and updated.
- [ ] Final PDF submission report compiled with all 9 required Answer Parts.

## 11. Assumptions and Decisions
- **Identity Simulation**: `x-requester-id` HTTP header is used to pass the active Development Requester ID from client to backend.
- **Storage Strategy**: Attachments are stored locally on the server file system in `server/uploads/` with UUID file keys to prevent collision.
- **Soft-Removal Strategy**: Files are not physically deleted from disk during soft-removal to allow audit compliance, but API blocks retrieval when `isRemoved = true`.
