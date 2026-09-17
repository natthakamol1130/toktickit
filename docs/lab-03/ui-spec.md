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

## 3. Screen Specifications & UI Visual Layout Mockups

### 3.1 Login Screen Mockup
```text
+-----------------------------------------------------------------------+
|  TokTickIT                                         [ Guest Context ]  |
+-----------------------------------------------------------------------+
|                                                                       |
|                     +---------------------------+                     |
|                     |     Sign in to TokTickIT  |                     |
|                     +---------------------------+                     |
|                     | Email Address             |                     |
|                     | [ jennifer@toktickit.com ]|                     |
|                     | Password                  |                     |
|                     | [ ********************** ]|                     |
|                     |                           |                     |
|                     |  [   Sign In Button   ]   |                     |
|                     +---------------------------+                     |
|                                                                       |
+-----------------------------------------------------------------------+
```

### 3.2 Mandatory First-Login Password Change Mockup
```text
+-----------------------------------------------------------------------+
|  TokTickIT                                     Jennifer Anderson (Req)|
+-----------------------------------------------------------------------+
|                                                                       |
|              +-----------------------------------------+              |
|              |         Change Your Password            |              |
|              | You must change initial password.       |              |
|              +-----------------------------------------+              |
|              | Current (Initial) Password              |              |
|              | [ ********************** ]              |              |
|              | New Password                            |              |
|              | [ ********************** ]              |              |
|              | Confirm New Password                    |              |
|              | [ ********************** ]              |              |
|              | Password Rules:                         |              |
|              | [v] At least 8 characters               |              |
|              | [v] Upper & lower case letters          |              |
|              | [v] Number & special character          |              |
|              |                                         |              |
|              |          [  Save New Password  ]        |              |
|              +-----------------------------------------+              |
|                                                                       |
+-----------------------------------------------------------------------+
```

### 3.3 Requester Ticket Detail & Public Comments Mockup
```text
+-----------------------------------------------------------------------+
|  TokTickIT   My Tickets   Create Ticket        Jennifer Anderson (Req)|
+-----------------------------------------------------------------------+
|  Ticket #TKT-2026-001234  [ IN_PROGRESS ]     [ Problem Appears Resolved ]
|  Summary: Laptop battery drains quickly                              |
|  Category: Hardware | Priority: MEDIUM                                |
|-----------------------------------------------------------------------|
|  Public Comments (Green Border Panel)                                 |
|  +-----------------------------------------------------------------+  |
|  | [JA] Jennifer Anderson (Requester)           May 12, 2026 09:14   |  |
|  | Battery drains fast even when idle.                             |  |
|  |-----------------------------------------------------------------|  |
|  | [KP] Kevin Patel (IT Support)                May 13, 2026 10:30   |  |
|  | We are investigating the battery health on your device.        |  |
|  +-----------------------------------------------------------------+  |
|  | Add Public Comment:                                             |  |
|  | [ Type your message here...                                   ] |  |
|  |                                                [ Post Comment ] |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

### 3.4 IT Staff Ticket Queue Mockup (Desktop & Mobile)
```text
+-----------------------------------------------------------------------+
|  TokTickIT   Ticket Queue   My Queue           Kevin Patel (IT Staff) |
+-----------------------------------------------------------------------+
|  [ Search ticket number or summary... ]  Filters: [Category v] [Status v]
|-----------------------------------------------------------------------|
|  Ticket No     Created      Summary               Status       Owner  |
|  TKT-2026-1234 12 May 09:14 Laptop battery drains IN_PROGRESS Kevin |
|  TKT-2026-1233 12 May 08:02 Cannot connect VPN    OPEN         --     |
|  TKT-2026-1232 11 May 16:45 Email sync mobile     IN_PROGRESS Emily |
|-----------------------------------------------------------------------|
|  < Previous   [1]  2  3  ...  9   Next >                              |
+-----------------------------------------------------------------------+
```

### 3.5 IT Staff Ticket Detail & Internal Notes Mockup
```text
+-----------------------------------------------------------------------+
|  TokTickIT   Ticket Queue                      Kevin Patel (IT Staff) |
+-----------------------------------------------------------------------+
|  Ticket Detail: TKT-2026-001234               | Operational Sidebar   |
|  Summary: Laptop battery drains quickly        | Owner: [ Kevin Patel v|
|  Category: Hardware | Status: [ IN_PROGRESS ] | IT Priority: [ HIGH v |
|-----------------------------------------------+-----------------------|
|  Public Comments                              | Internal Notes (Amber)|
|  +-----------------------------------------+  | +-------------------+ |
|  | [KP] We are investigating your device.  |  | | [KP] Battery wear | |
|  +-----------------------------------------+  | | is at 45%. Order  | |
|                                               | | replacement unit. | |
|                                               | +-------------------+ |
+-----------------------------------------------------------------------+
```

### 3.6 Administrator User Management & Drawer Mockup
```text
+-----------------------------------------------------------------------+
|  TokTickIT   User Management                   John Smith (Admin)     |
+-----------------------------------------------------------------------+
|  [ Search name or email... ]  Role: [ All Roles v ]   [ + Create User ]
|-----------------------------------------------------------------------|
|  Name               Email                     Role       Status Action|
|  Jennifer Anderson  jennifer@toktickit.com    Requester  Active [Edit]|
|  Michael Brown      michael@toktickit.com     Requester  Active [Edit]|
|  Kevin Patel        kevin@toktickit.com       IT_Staff   Active [Edit]|
|  John Smith         john@toktickit.com        Admin      Active [Edit]|
+-----------------------------------------------------------------------+
|  Drawer: Create New User                                              |
|  Full Name: [ Alex Thompson ]                                         |
|  Email:     [ alex@toktickit.com ]                                    |
|  Role:      [ IT_STAFF v ]  Active: [ Yes (Toggle) ]                  |
|  Initial Password: [ InitialPassword123! ]                            |
|  [ Save User ]                                           [ Cancel ]   |
+-----------------------------------------------------------------------+
```

---

## 4. Responsive & Accessibility Rules
- **Desktop ($\ge 992\text{px}$)**: Multi-column grid, full table view, side-by-side detail controls.
- **Tablet ($768\text{px} - 991\text{px}$)**: Reflowed forms, scrollable tables or compact cards.
- **Mobile ($< 768\text{px}$)**: Single-column vertical layout, touch-friendly buttons ($\ge 44\text{px}$ height), zero horizontal window overflow.
