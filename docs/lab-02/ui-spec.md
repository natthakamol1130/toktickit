# TokTickIT Lab 2 Zen Green UI Specification

## 1. Zen Green Design System Tokens

The application follows the official **Zen Green Theme** visual design system across desktop, tablet, and mobile views.

| Token / Element | Color Code / Style | Usage |
| :--- | :--- | :--- |
| **Primary Green** | `#006B3C` | App header bar, primary action buttons, main heading accents |
| **Secondary Green** | `#0B7A46` | Active tab highlights, focus ring accents, interactive links, hover states |
| **Pale Green** | `#EAF6EF` | Selected item backgrounds, success banner bg, section subtle callouts |
| **Page Background** | `#F5F7F6` | Quiet, comfortable off-white application background |
| **Surface / Cards** | `#FFFFFF` | Card containers with subtle border (`#E2E8F0`) and 2px blur drop shadow |
| **Text Primary** | `#1F2925` | Dark charcoal-green text for optimal readability (not pure black) |
| **Editable Field** | `#FFFFFF` | White background with neutral 1px border (`#CBD5E1`), 8px border-radius |
| **Read-Only Field** | `#F1F5F9` | Soft gray-green shading clearly distinct from editable fields |
| **Error Indicator** | `#D32F2F` | Dark red text and 1px border; validation message directly below control |
| **Warning Callout** | `#F59E0B` | Amber callout badge or notification banner |
| **Success Banner** | `#10B981` | Green confirmation banner with check icon and readable dark text |

---

## 2. Global Navigation & Header Shell

- **Title**: "TokTickIT" with brand logo icon in primary green header.
- **Navigation Tabs**:
  - `My Tickets` (Icon: List)
  - `Create Ticket` (Icon: Plus Circle)
- **Active Tab Highlight**: Underlined or filled with `#0B7A46` and `#EAF6EF` badge background.
- **Requester Identity Badge**: Shows current user icon, user name (e.g. `Jennifer Anderson`), and a clear **"Change Requester"** action button.

---

## 3. Screen Specifications

### 3.1 Development Requester Selection Screen
- **Title**: "Select Development Requester"
- **Subtitle Banner**: "Choose a development requester to simulate the current requester context for Lab 2. This is for testing only and is not a login screen."
- **Controls**:
  - Requester Dropdown (populated with active seeded requesters from database).
  - Info Callout: "Authentication coming in Lab 3".
  - Actions: "Cancel" (neutral outline) and "Continue" (primary green filled).
- **States**: Loading skeleton while fetching requesters, empty state if no active requesters exist, API failure alert banner.

### 3.2 Create Ticket Screen
- **Section 1: Read-Only System Fields** (styled with `#F1F5F9` shading):
  - Ticket Number: `Auto-generated after submission`
  - Ticket Date: `Current Date/Time`
  - Requester: `Selected Development Requester Name`
- **Section 2: Classification Fields**:
  - Category Dropdown (Required `*`)
  - Related System Dropdown (Required `*`)
  - Requested Priority Badges/Select: `LOW` (Green), `MEDIUM` (Amber), `HIGH` (Orange), `URGENT` (Red)
- **Section 3: Content Fields**:
  - Ticket Summary Input (Required `*`, character counter: e.g. `28 / 150`)
  - Description Textarea (Required `*`, min-height 120px, character counter: e.g. `120 / 2000`)
- **Section 4: Attachment Uploader**:
  - Drag-and-drop zone supporting file picker.
  - Allowed types badge: `JPG, PNG, WEBP, PDF (Max 5MB per file, Max 5 files)`.
  - Selected files preview list with size, type icon, and remove file button.
- **Section 5: Form Actions**:
  - "Cancel" button -> navigates back to My Tickets.
  - "Submit Ticket" button -> Primary green filled; shows spinning indicator + "Submitting..." in busy state and is disabled during request.

### 3.3 My Tickets Screen Layout
- **Header Action**: Title "My Tickets" + "Create Ticket" primary button top-right.
- **Control Toolbar**:
  - Search Input: "Search by ticket number or summary..." with clear icon.
  - Filter Dropdowns: Category, Requested Priority, Status.
  - Sort Select: Sort By (Date, Priority, Status) & Direction (Desc, Asc).
  - "Clear Filters" button (visible when filters are active).
- **Desktop Table View ($\ge 992\text{px}$)**:
  - Columns: Ticket No, Created Date, Summary, Category, Requested Priority, Current Status, Actions.
  - Hover row effect with pale green tint (`#EAF6EF`).
- **Mobile Card View ($< 768\text{px}$)**:
  - Responsive stacked cards with priority/status badges at top right, bold Ticket No, summary text, and timestamp.
- **Pagination Bar**: Showing "Showing 1 to 10 of 42 tickets", Previous button, Page numbers, Next button.
- **States**:
  - Loading State: Skeleton shimmer rows.
  - Empty State (No tickets owned): Friendly illustration + "You haven't submitted any IT support tickets yet" + "Create First Ticket" button.
  - No-Results State (Search/Filter yields 0 matches): "No tickets match your filter criteria" + "Clear Filters" button.

### 3.4 Ticket Detail Screen Layout
- **Header Bar**: Back button `← Back to My Tickets`, Ticket No header (`TKT-2026-001234`), Status badge (`NEW`, `IN_PROGRESS`, etc.).
- **Read-Only Fields Grid**: Category, Related System, Requester Name, Requested Priority, Creation Timestamp.
- **Summary & Description Card**: Displayed in readable dark charcoal text (`#1F2925`).
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

- [ ] Header uses Primary Green `#006B3C` with crisp white logo text.
- [ ] Required fields display a red asterisk (`*`) next to the label.
- [ ] Field validation errors appear in red text directly below the affected control.
- [ ] Submit button displays busy spinning indicator and disables click when submitting.
- [ ] Read-only fields have soft gray-green shading `#F1F5F9`.
- [ ] Priority badges use distinct colors: Low (Green), Medium (Amber), High (Orange), Urgent (Red).
- [ ] Mobile viewport (< 768px) contains no clipped text or horizontal overflow.
- [ ] Keyboard focus states show visible `#0B7A46` focus ring outline.
