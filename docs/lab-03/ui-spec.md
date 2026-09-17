# TokTickIT Lab 3 User Interface Specification

## 1. Design System & Theme Alignment
Lab 3 extends the **Zen Green Design System** established in Lab 2. All new screens, forms, tables, modals, and navigation components adhere strictly to the established visual identity and design tokens.

### Color Tokens
- **Primary Header & Branding**: `#006B3C` (Zen Green Primary)
- **Secondary Accent**: `#0B7A46` (Zen Green Dark)
- **Pale Surface / Active Highlight**: `#EAF6EF` (Zen Light Mint)
- **Background**: `#F5F7F6` (Neutral Warm Gray)
- **Surface**: `#FFFFFF` (Pure White)
- **Text Primary**: `#1F2925` (Dark Slate)
- **Text Muted**: `#64748B` (Slate Gray)
- **Error / Danger**: `#D32F2F` (Deep Red)
- **Warning / Internal Note Accent**: `#D97706` (Amber Gold)
- **Success Badge**: `#059669` (Emerald Green)

---

## 2. Application Shell & Role-Based Navigation

### Header Shell
- **App Branding**: Logo and title "TokTickIT".
- **Role-Based Navigation Links**:
  - **Requester**: `My Tickets`, `Create Ticket`
  - **IT Staff**: `Ticket Queue`, `My Queue`, `Create Ticket`
  - **Administrator**: `User Management`, `Ticket Queue`
- **User Profile Area**:
  - Displays authenticated user's Full Name.
  - Role Badge (`Requester`, `IT Staff`, `Administrator`) with distinct pill styling.
  - Profile Dropdown / Actions: `Change Password`, `Logout`.

---

## 3. Screen Specifications

### 3.1 Login & Mandatory First Password Change
- **Login Screen**:
  - Centered card layout with app logo.
  - Inputs for Email Address and Password.
  - Inline error alert for invalid credentials or inactive accounts.
  - Busy spinner on submit button during API call.
- **Mandatory Password Change Screen**:
  - Displayed automatically if user has `mustChangePassword = true`.
  - Blocks navigation to rest of application.
  - Fields for Current Password, New Password, and Confirm New Password.
  - Real-time password requirement indicators (minimum 8 chars, upper/lower/number/special).

### 3.2 Requester Regression & Public Comments
- **Header Update**: Development Requester Selector removed. User identity comes from authenticated session.
- **Requester Ticket Detail**:
  - Read-only ticket details and attachment section.
  - Added **Public Comments** section:
    - Comment feed displaying author name, role badge, timestamp, and message.
    - Text area for adding new Public Comment with "Post Comment" button.
  - Added **"Problem Appears Resolved"** action button to communicate resolution readiness to IT Staff.

### 3.3 IT Staff Ticket Queue
- **Header & Controls**:
  - Search input (searches Ticket Number and Summary).
  - Dropdown filters for Category, Requested Priority, IT Priority, and Status.
  - Sort dropdown (Creation Date, Ticket Number, Priority, Status) and direction toggle.
  - Active filter chips with "Clear Filters" option.
- **Desktop Table View ($\ge 992\text{px}$)**:
  - Columns: Ticket No, Created Date, Summary, Category, Req. Priority, IT Priority, Status, Owner, Action.
  - Badges for status and priorities using Zen Green palette.
- **Mobile Card View ($< 768\text{px}$)**:
  - Stacked card view displaying key metadata, badges, and "View Detail" button.
- **Pagination Controls**: Page numbers, Previous/Next buttons, page size selector.

### 3.4 IT Staff Ticket Detail
- **Header Information**: Ticket Number, Status badge, Requester name, Created date.
- **Operational Sidebar / Controls**:
  - Ticket Owner selector (Dropdown to Claim or assign to active IT Staff/Admin).
  - IT Priority selector.
  - Status transition dropdown (enforcing valid status transitions).
- **Communication Panels**:
  - **Public Comments Tab / Panel**: Styled with green accent border. Visible to Requester and IT Staff.
  - **Internal Notes Tab / Panel**: Styled with amber accent border and "Internal Only" warning badge. Visible exclusively to IT Staff and Admin.

### 3.5 Administrator User Management
- **User List Table**:
  - Columns: Name, Email, Role badge, Status badge (Active/Inactive), Actions (Edit, Reset Password).
  - Search bar (Name or Email) and Role filter dropdown.
  - "Create User" primary button.
- **Create / Edit User Modal Drawer**:
  - Fields: Full Name, Email Address, Role (Dropdown), Active Status (Toggle switch).
  - Initial Password input (for Create or Reset Password mode).
  - Clear validation feedback for duplicate email or missing fields.

---

## 4. Responsive & Accessibility Rules
- **Desktop ($\ge 992\text{px}$)**: Multi-column grid, full table view, side-by-side detail controls.
- **Tablet ($768\text{px} - 991\text{px}$)**: Reflowed forms, scrollable tables or compact cards.
- **Mobile ($< 768\text{px}$)**: Single-column vertical layout, touch-friendly buttons ($\ge 44\text{px}$ height), zero horizontal window overflow.
