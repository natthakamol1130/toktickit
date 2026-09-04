# Lab 2 UI Specification: Official Zen Green Theme & Layout Breakpoints

## 1. Visual Design Tokens (Official Zen Green Palette)

| Design Token | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| `--zg-primary` | `#006B3C` | Primary action buttons, active navbar links, and main branding headers |
| `--zg-primary-hover` | `#00522E` | Primary button hover and active states |
| `--zg-secondary` | `#0B7A46` | Active focus rings on form controls and accent badges |
| `--zg-pale` | `#EAF6EF` | Light green card backgrounds, priority badges |
| `--zg-bg` | `#F5F7F6` | Page body background color |
| `--zg-surface` | `#FFFFFF` | Card containers, modal backgrounds, input surfaces |
| `--zg-text` | `#1F2925` | Dark charcoal-green text for comfortable reading |
| `--zg-border` | `#D1E7DD` | Card borders, table dividers, input borders |
| `--zg-read-only` | `#F1F5F9` | Read-only input fields (e.g. system metadata, ticket no) |
| `--zg-error` | `#D32F2F` | Mandatory field asterisks (*), validation error messages |

## 2. Layout Breakpoints & Responsive Rules

| Device Breakpoint | Viewport Width | Layout Behavior |
| :--- | :--- | :--- |
| **Desktop** | `>= 992px` | Displays full multi-column data tables, persistent header navbar, and horizontal filters |
| **Tablet** | `768px - 991px` | Displays compact tables with smooth horizontal scrollbars |
| **Mobile** | `< 768px` | Automatically switches from table layout to mobile cards layout with full-width primary buttons |

## 3. Visual Quality Checklist
- [x] Header identity badge with current Requester context display
- [x] Create Ticket form with required field asterisks (*), field-level errors, and busy spinner
- [x] My Tickets dashboard with search, priority/status filters, and pagination
- [x] Read-only Ticket Detail view with requester ownership isolation
- [x] File Attachment dropzone supporting JPG, PNG, WEBP, and PDF up to 5MB
