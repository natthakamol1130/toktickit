# TokTickIT Lab 2 Sakura Rose Pink UI Specification

## 1. Sakura Rose Pink Design System Tokens

The application follows the official **Sakura Rose Pink Theme** visual design system across desktop, tablet, and mobile views.

> **Note**: The CSS custom properties retain the `--zg-` prefix to maintain 100% architectural compatibility with the base component framework and test assertions.

| Token / Element | Color Code / Style | Usage |
| :--- | :--- | :--- |
| **Primary Rose/Pink** | `#D81B60` | App header bar, primary action buttons, main heading accents |
| **Secondary Pink** | `#E91E63` | Active tab highlights, focus ring accents, interactive links, hover states |
| **Pale Pink** | `#FCE4EC` | Selected item backgrounds, subtle section emphasis |
| **Page Background** | `#FFF5F8` | Quiet, comfortable off-white blush application background |
| **Surface / Cards** | `#FFFFFF` | Card containers with subtle rose border (`#F8BBD0`) and shadow |
| **Text Primary** | `#2D1B24` | Dark charcoal berry text for comfortable reading |
| **Editable Field** | `#FFFFFF` | White background with neutral/rose border, 8px border-radius |
| **Read-Only Field** | `#FDF2F5` | Soft rose-ivory shading clearly distinct from editable fields |
| **Error Indicator** | `#D32F2F` | Dark red text and border; validation message directly below control |
| **Warning Callout** | `#F59E0B` | Amber callout badge or notification banner |
| **Success Banner** | `#E91E63` | Rose pink confirmation banner with check icon |

---

## 2. Global Navigation & Header Shell

- **Title**: "TokTickIT" with brand logo icon in primary rose header.
- **Navigation Tabs**:
  - `My Tickets` (Icon: List)
  - `Create Ticket` (Icon: Plus Circle)
- **Active Tab Highlight**: Underlined or filled with `#D81B60` and `#FCE4EC` badge background.
- **Requester Identity Badge**: Shows current user icon, user name (e.g. `Jennifer Anderson`), and a clear **"Change Requester"** action button.

---

## 3. Screen Specifications

### 3.1 Development Requester Selection Screen
- **Title**: "Select Development Requester"
- **Subtitle Banner**: "Choose a development requester to simulate the current requester context for Lab 2. This is for testing only and is not a login screen."
- **Controls**:
  - Requester Dropdown (populated with active seeded requesters from database).
  - Info Callout: "Authentication coming in Lab 3".
  - Actions: "Cancel" (neutral outline) and "Continue" (primary rose filled).
- **States**: Loading skeleton while fetching requesters, empty state if no active requesters exist, API failure alert banner.

### 3.2 Create Ticket Screen
- **Section 1: Read-Only System Fields** (styled with `#FDF2F5` shading):
  - Ticket Number: `Auto-generated after submission`
  - Ticket Date: `Current Date/Time`
  - Requester: `Selected Development Requester Name`
- **Section 2: Classification Fields**:
  - Category Dropdown (Required `*`)
  - Related System Dropdown (Required `*`)
  - Requested Priority Badges/Select: `LOW` (Pink), `MEDIUM` (Amber), `HIGH` (Orange), `URGENT` (Red)
- **Section 3: Content Fields**:
  - Ticket Summary Input (Required `*`, character counter: e.g. `28 / 150`)
  - Description Textarea (Required `*`, min-height 120px, character counter: e.g. `120 / 2000`)
- **Section 4: Attachment Uploader**:
  - Drag-and-drop zone supporting file picker.
  - Allowed types badge: `JPG, PNG, WEBP, PDF (Max 5MB per file, Max 5 files)`.
  - Selected files preview list with size, type icon, and remove file button.
- **Section 5: Form Actions**:
  - "Cancel" button -> navigates back to My Tickets.
  - "Submit Ticket" button -> Primary rose filled; shows spinning indicator + "Submitting..." in busy state and is disabled during request.

### 3.3 My Tickets Screen Layout
- **Header Action**: Title "My Tickets" + "Create Ticket" primary button top-right.
- **Control Toolbar**:
  - Search Input: "Search by ticket number or summary..." with clear icon.
  - Filter Dropdowns: Category, Requested Priority, Status.
  - Sort Select: Sort By (Date, Priority, Status) & Direction (Desc, Asc).
  - "Clear Filters" button (visible when filters are active).
- **Desktop Table View (>= 992px)**:
  - Columns: Ticket No, Created Date, Summary, Category, Requested Priority, Current Status, Actions.
  - Hover row effect with pale pink tint (`#FCE4EC`).
- **Mobile Card View (< 768px)**:
  - Responsive stacked cards with priority/status badges at top right, bold Ticket No, summary text, and timestamp.
- **Pagination Bar**: Showing "Showing 1 to 10 of 42 tickets", Previous button, Page numbers, Next button.
- **States**:
  - Loading State: Skeleton shimmer rows.
  - Empty State (No tickets owned): Friendly illustration + "You haven't submitted any IT support tickets yet" + "Create First Ticket" button.
  - No-Results State (Search/Filter yields 0 matches): "No tickets match your filter criteria" + "Clear Filters" button.

### 3.4 Ticket Detail Screen Layout
- **Header Bar**: Back button `← Back to My Tickets`, Ticket No header (`TKT-2026-001234`), Status badge (`NEW`, `IN_PROGRESS`, etc.).
- **Read-Only Fields Grid**: Category, Related System, Requester Name, Requested Priority, Creation Timestamp.
- **Summary & Description Card**: Displayed in readable dark charcoal text (`#2D1B24`).
- **Attachments Management Section**:
  - Active Attachments list with file type icon, file name, size, download button (`↓`), and soft-remove button (`🗑️`).
  - Soft-Removed Attachments list with strike-through styling, "Removed" badge, removal reason tooltip, and disabled download button.
  - "Add Attachment" button opening a upload modal (validating 5-active limit).
  - Soft-removal confirmation modal prompting for mandatory "Reason for removal".

---

## 4. Responsive Breakpoint Specification

```
+-----------------------------------------------------------------------+
| Desktop (>= 992px)                                                     |
| - Multi-column form layout & grid                                     |
| - Full data table with all columns visible                            |
| - Max container width: 1140px centered                                |
+-----------------------------------------------------------------------+
| Tablet (768px - 991px)                                                |
| - 2-column stacked form fields                                        |
| - Responsive table with priority/status columns                       |
+-----------------------------------------------------------------------+
| Mobile (< 768px)                                                      |
| - 1-column single stacked vertical fields                             |
| - Card-based ticket list representation                               |
| - Touch-friendly buttons (min height 44px)                            |
| - Zero horizontal scrollbar                                           |
+-----------------------------------------------------------------------+
```

---

## 5. Visual Inspection Checklist

- [x] Header uses Primary Rose `#D81B60` with crisp white logo text.
- [x] Required fields display a red asterisk (`*`) next to the label.
- [x] Field validation errors appear in red text directly below the affected control.
- [x] Submit button displays busy spinning indicator and disables click when submitting.
- [x] Read-only fields have soft rose shading `#FDF2F5`.
- [x] Priority badges use distinct colors: Low (Pink), Medium (Amber), High (Orange), Urgent (Red).
- [x] Mobile viewport (< 768px) contains no clipped text or horizontal overflow.
- [x] Keyboard focus states show visible `#E91E63` focus ring outline.
