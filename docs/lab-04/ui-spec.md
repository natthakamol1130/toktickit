# TokTickIT Lab 4 User Interface Specification

## 1. Design System & Theme Alignment
Lab 4 completes the application shell and UI components under the **Zen Green Design System** established in Labs 2 and 3.

### 1.1 Color Tokens
- **Brand Primary**: `#006B3C` (Zen Green Primary Header & Main CTA)
- **Brand Hover**: `#00522E` (Zen Deep Forest Green)
- **Secondary Accent**: `#0B7A46` (Zen Emerald)
- **Surface Active / Mint Tint**: `#EAF6EF` (Zen Mint Surface Highlight)
- **Background**: `#F4F7F5` (Neutral Warm Off-White)
- **Card Surface**: `#FFFFFF` (Pure White Card Background)
- **Text Primary**: `#1E2922` (High-Contrast Charcoal Slate)
- **Text Muted**: `#64748B` (Neutral Cool Gray)
- **Border / Divider**: `#E2E8F0` (Subtle Slate Border)
- **Badge / Status Colors**:
  - `NEW`: Purple (`#8B5CF6`, bg `#F3E8FF`)
  - `OPEN`: Blue (`#2563EB`, bg `#EFF6FF`)
  - `IN_PROGRESS`: Amber (`#D97706`, bg `#FEF3C7`)
  - `WAITING_FOR_REQUESTER`: Orange (`#EA580C`, bg `#FFEDD5`)
  - `RESOLVED`: Emerald (`#059669`, bg `#D1FAE5`)
  - `CLOSED`: Gray (`#64748B`, bg `#F1F5F9`)
  - `CANCELLED`: Red (`#DC2626`, bg `#FEE2E2`)

### 1.2 Responsive Breakpoints
- **Desktop (Large Viewport)**: `>= 1024px` (Full grid layouts, multi-column dashboard cards)
- **Tablet (Medium Viewport)**: `768px – 1023px` (2-column metric cards, responsive tables)
- **Mobile (Small Viewport)**: `< 768px` (Single-column stacked cards, full-width buttons, collapsible menus)

---

## 2. Role-Based Navigation & Shell

### 2.1 Navigation Bar Layout
```text
+-----------------------------------------------------------------------------------------+
| [T] TokTickIT   [Dashboard]  [Ticket Queue / My Tickets]  [Create Ticket]   [Profile (v)]|
+-----------------------------------------------------------------------------------------+
```
- **Active Tab Cue**: An underline in `#006B3C` with bold text indicates the active screen.
- **Requester Links**: `Dashboard`, `My Tickets`, `Create Ticket`
- **IT Staff Links**: `Dashboard`, `Ticket Queue`, `Create Ticket`
- **Administrator Links**: `Dashboard`, `Ticket Queue`, `User Management`, `Create Ticket`

---

## 3. Screen Specifications & Wireframe Mockups

### 3.1 IT Staff Dashboard Screen (Handout Section 8.1)
```text
+-----------------------------------------------------------------------------------------+
| Welcome back, Michael!                                                        [Refresh] |
| Here's what's happening with your queue today.                                          |
|                                                                                         |
| +-------------+ +-------------+ +-------------+ +-------------+ +-------------+         |
| | New         | | Open        | | In Progress | | Waiting...  | | My Assigned |         |
| | 14          | | 23          | | 18          | | 7           | | 16          |         |
| | [View Queue]| | [View Queue]| | [View Queue]| | [View Queue]| | [View Queue]|         |
| +-------------+ +-------------+ +-------------+ +-------------+ +-------------+         |
|                                                                                         |
| +-----------------------------------------------------+  +----------------------------+ |
| | My Recent Tickets                       [View all]  |  | Quick Actions               | |
| |-----------------------------------------------------|  |----------------------------| |
| | TKT-2026-001234  [In Progress]  May 12, 09:14 AM    |  | [+] Create Ticket          | |
| | Laptop battery drains quickly                       |  | [Q] Search Tickets         | |
| |-----------------------------------------------------|  | [*] My Assigned Queue      | |
| | TKT-2026-001230  [Open]         May 10, 02:15 PM    |  +----------------------------+ |
| | Printer keeps showing offline                       |                                 |
| +-----------------------------------------------------+                                 |
+-----------------------------------------------------------------------------------------+
```

#### Key Components & Behaviors:
1. **Metric Cards**:
   - Displays label, bold aggregate count, and accessible drill-down button.
   - Clicking a card navigates to `/staff/tickets?status=<STATUS>` or `?assignedTo=me`.
2. **My Recent Tickets Card**:
   - Displays the 5 most recently updated tickets assigned to or managed by the user.
   - Shows Ticket Number, Status Badge, Summary, and Last Updated timestamp.
3. **Quick Actions Panel**:
   - Direct button links to Create Ticket, Search Tickets, and My Assigned Queue.

---

### 3.2 Requester Dashboard Screen (Handout Section 8.2)
```text
+-----------------------------------------------------------------------------------------+
| Welcome, Jennifer!                                                            [Refresh] |
| Here's the latest on your requests.                                                     |
|                                                                                         |
| +-------------------+ +-------------------+ +-------------------+ +-------------------+ |
| | My Open Tickets   | | In Progress       | | Resolved          | | Closed            | |
| | 3                 | | 2                 | | 5                 | | 12                | |
| | [View all]        | | [View all]        | | [View all]        | | [View all]        | |
| +-------------------+ +-------------------+ +-------------------+ +-------------------+ |
|                                                                                         |
| +-----------------------------------------------------+  +----------------------------+ |
| | My Recent Tickets                       [View all]  |  | Quick Actions               | |
| |-----------------------------------------------------|  |----------------------------| |
| | TKT-2026-001234  [In Progress]  May 12, 09:14 AM    |  | [+] Create Ticket          | |
| | Laptop battery drains quickly                       |  |     Submit a new request   | |
| |-----------------------------------------------------|  | [=] View My Tickets        | |
| | TKT-2026-001222  [Resolved]     May 11, 02:30 PM    |  |     Track existing requests| |
| | Request software access                             |  +----------------------------+ |
| +-----------------------------------------------------+                                 |
+-----------------------------------------------------------------------------------------+
```

#### Key Components & Behaviors:
1. **Ownership Isolation**:
   - Only counts and tickets belonging to `user.id` are shown.
2. **Accessible Drill-Downs**:
   - Clicking "View all" on "My Open Tickets" navigates to `/my-tickets?filter=open`.
   - Clicking on "Resolved" navigates to `/my-tickets?filter=resolved`.

---

### 3.3 Actions Taken on Ticket Detail (Handout Section 8.3)
```text
+-----------------------------------------------------------------------------------------+
| [<- Back to Queue] Ticket: TKT-2026-001234                                              |
| Summary: Laptop battery drains quickly                         Status: [ In Progress ]  |
+-----------------------------------------------------------------------------------------+
| [ Details Tab ]  [ Public Comments ]  [ Internal Notes ]  [ Actions Taken (3) ]         |
+-----------------------------------------------------------------------------------------+
| Actions Taken History                                     [ + Record Action Taken ]     |
|                                                                                         |
| +-------------------------------------------------------------------------------------+ |
| | Action Performed by: Michael IT                      Oct 31, 2026, 09:30 AM         |
| | Description: Inspected internal battery connection and tested adapter voltage.      |
| | Result: Battery voltage below operational threshold. Hardware replacement required. |
| | Follow-Up Required: [ YES ] - Order replacement battery pack SKU-BAT-882.           |
| | Attachment Notes: See battery_diagnostic_report.png                                 |
| |                                                                     [Edit Action]   |
| +-------------------------------------------------------------------------------------+ |
| +-------------------------------------------------------------------------------------+ |
| | Action Performed by: Sarah Tech                      Oct 30, 2026, 02:15 PM         |
| | Description: Ran battery calibration diagnostic cycle.                              |
| | Result: Diagnostic completed with cell wear level at 68%.                           |
| | Follow-Up Required: [ NO ]                                                          |
| +-------------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

#### Add / Edit Action Taken Modal or Drawer:
- **Action Date/Time**: Pre-populated with current time; editable by staff.
- **Description Field**: Multiline text area (minimum 5 characters, mandatory).
- **Result Field**: Multiline text area (minimum 2 characters, mandatory).
- **Performed By**: Read-only display of current authenticated user.
- **Follow-Up Required Toggle**: Checkbox or switch (`true` / `false`).
- **Follow-Up Note**: Text input; dynamically displays required asterisk `*` and validation error if toggle is `true` and field is empty.
- **Attachment Notes**: Text input for filenames/notes.
- **Action Buttons**: `Save Action Taken` (Zen Green Primary), `Cancel`.

---

### 3.4 Ticket Workflow Controls & Resolution Feedback (Handout Section 8.4)

#### Advisory Resolution Cue:
When the Requester has indicated problem resolution (`requesterResolvedInd = true`), the IT Staff Ticket Detail header renders a prominent banner:
```text
+-----------------------------------------------------------------------------------------+
| (i) Notice: The Requester has indicated that the problem appears resolved.             |
| Please verify the Actions Taken and formally update the ticket status to Resolved.     |
+-----------------------------------------------------------------------------------------+
```

#### Status Transition Selector:
- Dropdown menu showing **only permitted transitions** based on current status.
- Example for `IN_PROGRESS`: Options are `In Progress`, `Waiting for Requester`, `Resolved`, `Cancelled`. Disallowed options (`New`, `Open`, `Closed`) are disabled or omitted.
- When changing status, the form sends `expectedUpdatedAt`. If another user changed the ticket in the background, a modal appears:
  ```text
  +-----------------------------------------------------------------------+
  | Conflict Detected                                                     |
  | Another staff member updated this ticket while you were working.      |
  | [ Refresh Ticket Details ]                                            |
  +-----------------------------------------------------------------------+
  ```

---

## 4. Accessibility & Responsive Polish Checklist

- [ ] **Keyboard Navigation**: All interactive elements (metric cards, tabs, modal controls) are focusable via `Tab` with visible focus rings (`focus-visible: ring-2 ring-emerald-500`).
- [ ] **Contrast & Typography**: All text meets WCAG AA 4.5:1 contrast against `#FFFFFF` and `#F4F7F5` backgrounds.
- [ ] **Semantic Roles**: Cards have `role="button"` or `<a>` with meaningful `aria-label`s.
- [ ] **No Content Clipping / Overlap**: Responsive containers flex dynamically without horizontal scrollbars on viewports down to 320px width.
- [ ] **Error Announcement**: Form validation errors render with `aria-live="polite"` and clear iconography.
