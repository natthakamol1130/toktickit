# Lab 2 UI Specification: Sakura Rose Pink Theme & Layout Breakpoints

## 1. Visual Design Tokens (Sakura Rose Pink Palette)

| Design Token | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| `--zg-primary` | `#D81B60` | Primary action buttons, active navbar links, and main branding headers |
| `--zg-primary-hover` | `#AD1457` | Primary button hover and active states |
| `--zg-secondary` | `#E91E63` | Active focus rings on form controls and accent badges |
| `--zg-pale` | `#FCE4EC` | Light pink card backgrounds, priority badges |
| `--zg-bg` | `#FFF5F8` | Page body background color |
| `--zg-surface` | `#FFFFFF` | Card containers, modal backgrounds, input surfaces |
| `--zg-text` | `#2D1B24` | Primary text color with high contrast accessibility |
| `--zg-border` | `#F8BBD0` | Card borders, table dividers, input borders |
| `--zg-read-only` | `#FDF2F5` | Read-only input fields (e.g. system metadata, ticket no) |
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
