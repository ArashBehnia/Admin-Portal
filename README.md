# HomeBy Admin Portal

A production-grade administrative dashboard for managing the HomeBy real estate platform. Built with Next.js 16, React 19, and TypeScript, this portal provides comprehensive tools for agency management, agent oversight, application moderation, email templating, and system administration.

## Project Overview

HomeBy Admin Portal is the internal operations dashboard for HomeBy, an Australian real estate platform. It serves as the central control panel for platform administrators, support staff, and content editors to manage agencies, agents, property listings, and system operations.

## Features

### Authentication
- Multi-step login (password → TOTP MFA)
- Forgot password flow with email reset link
- HttpOnly cookie-based token management (access-token, refresh-token, otp-token)
- Automatic token refresh on 401 responses
- Role-based UI visibility (admin)
- Session management with secure logout

### Dashboard
- KPI cards (Active Agencies, Pending Applications, Feed Failures, MRR)
- Attention required alerts with action links
- Agency onboarding pipeline visualization
- User activity trend chart (Recharts line chart)
- Demand hotspots table (suburb-level search activity)
- System health tiles (API status, queue depth, failed jobs, stale feeds)
- Timeframe selector (7d, 30d, 90d, YTD)
- Auto-refresh capability

### Agencies
- Paginated agency list with search and status filters
- Agency summary statistics
- Agency detail page with tabbed interface:
  - Overview (profile, stats, onboarding pipeline)
  - Agents (linked agent list)
  - Listings (property listing overview)
  - Subscription & Billing (plan details, MRR)
  - Reviews (agency reviews)
  - Notes (internal admin notes)
  - Audit (activity log)
- Create agency with send invitation
- Edit agency (status, tier, notes)
- Suspend agency with confirmation
- Delete agency with confirmation
- Onboarding stage pipeline visualization (Applied → Approved → CRM Connected → Syncing → Validation → Live)
- Listing distribution portal status

### Agents
- Paginated agent directory with search
- Agent detail drawer (profile, activity, actions)
- Create new agent
- Role-based filtering

### Applications
- Moderation queue for agent registration requests
- Paginated list with status filters (Pending, Approved, Rejected)
- Application detail drawer with timeline
- Approve application (creates agent account, sends welcome email)
- Reject application with reason
- Request more information
- ABN verification

### Staff & Roles
- Staff member management (CRUD)
- Add staff with OTP verification flow
- Edit staff profile
- Reset MFA for staff members
- Revoke all sessions
- Roles list with permission matrix
- Permissions modal (role-based access control view)
- Staff activity log
- Groups management (CRUD)

### Email Templates
- Template list with category filters and search
- Create new template
- Template editor with:
  - Plain textarea body editor (monospace styling)
  - Variable insertion pills (clickable tags)
  - Live preview with sample data substitution
  - Version history
  - Restore previous versions
  - Send test email modal

### Integrations & Feed Operations
- Inbound feeds monitoring table
- Feed detail panel with tabs:
  - Overview
  - Sync history
  - Errors
  - Validation
- Retry sync action
- Pause/Resume feed actions
- Distribution tab (portal health status)
- Add integration modal

### Blocked IPs
- Paginated blocked IP list
- Create IP block with confirmation
- Remove IP block with confirmation

### FTP Requests
- Paginated FTP request list
- FTP request detail drawer
- Approve/Reject requests
- Change FTP password

### Property Reports
- Paginated property reports list
- Report detail drawer
- Type and date filters

### Shared Components
- Sidebar navigation with role-based item visibility
- Topbar with breadcrumbs, global search (Cmd+K), notification bell, profile dropdown
- Toast notifications (success, info, error)
- Responsive layout with mobile sidebar overlay
- Status badges (Active, Warning, Danger, Inactive, Internal)
- Pagination components
- Empty states
- Loading skeletons
- Confirmation modals

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.2.6 |
| Language | TypeScript | ^5.0.0 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | 4.3.0 |
| State Management | TanStack React Query | ^5.100.14 |
| State Management | React Context | Built-in |
| HTTP Client | Axios | ^1.16.1 |
| HTTP Client | Native Fetch | Built-in |
| Icons | Lucide React | ^1.17.0 |
| Charts | Recharts | ^3.8.1 |
| Utilities | clsx | ^2.1.1 |
| Build Tool | Next.js (Webpack/Turbopack) | 16.2.6 |
| Linting | ESLint | ^9.0.0 |
| PostCSS | @tailwindcss/postcss | ^4.3.0 |
| Font | Inter (Google Fonts) | Variable |

## Folder Structure

```
homeby-admin-next/
├── src/
│   ├── app/                          # Next.js App Router pages and API routes
│   │   ├── layout.tsx                # Root layout (Inter font, Providers, AppLayout)
│   │   ├── page.tsx                  # Root redirect to /dashboard
│   │   ├── not-found.tsx             # 404 page
│   │   ├── favicon.ico                 # Favicon
│   │   ├── globals.css               # Global styles and Tailwind theme tokens
│   │   ├── login/
│   │   │   └── page.tsx              # Login with MFA and forgot password
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard with server prefetch
│   │   ├── agencies/
│   │   │   ├── page.tsx              # Agency list (server component)
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Agency detail (server component)
│   │   ├── agents/
│   │   │   └── page.tsx              # Agent directory (server component)
│   │   ├── applications/
│   │   │   └── page.tsx              # Application moderation (server component)
│   │   ├── staff/
│   │   │   └── page.tsx              # Staff management (server component)
│   │   ├── email-templates/
│   │   │   ├── page.tsx              # Template list (server component)
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Create template
│   │   │   └── [templateName]/
│   │   │       └── page.tsx          # Template editor (server component)
│   │   ├── integrations/
│   │   │   └── page.tsx              # Integrations (server component)
│   │   ├── blocked-ips/
│   │   │   └── page.tsx              # Blocked IPs (server component)
│   │   ├── ftp-requests/
│   │   │   └── page.tsx              # FTP requests (server component)
│   │   ├── property-reports/
│   │   │   └── page.tsx              # Property reports (server component)
│   │   └── api/                      # Next.js API routes (BFF layer)
│   │       ├── auth/                 # Authentication endpoints
│   │       │   ├── admin/login/      # POST: admin login
│   │       │   ├── verify-2fa/       # POST: verify 2FA code
│   │       │   ├── refresh/          # POST: refresh tokens
│   │       │   ├── logout/           # POST: logout
│   │       │   ├── me/               # GET: current user info
│   │       │   └── forgot-password/  # POST: send reset email
│   │       ├── dashboard/            # Dashboard data endpoints
│   │       ├── agencies/             # Agency CRUD endpoints
│   │       ├── agency/               # Agency create/update endpoints
│   │       ├── agents/               # Agent endpoints
│   │       ├── applications/         # Application endpoints
│   │       ├── staff/                # Staff management endpoints
│   │       ├── email-templates/      # Email template endpoints
│   │       ├── integrations/         # Integration endpoints
│   │       ├── ftp-requests/         # FTP request endpoints
│   │       ├── blocked-ips/          # Blocked IP endpoints
│   │       └── property-reports/     # Property report endpoints
│   │
│   ├── components/                   # React components
│   │   ├── Shared/                   # Shared layout and UI components
│   │   │   ├── AppLayout.tsx         # Main app layout (sidebar + topbar + content)
│   │   │   ├── Sidebar.tsx           # Left sidebar navigation
│   │   │   ├── Topbar.tsx            # Top navigation bar
│   │   │   ├── Providers.tsx         # QueryClient + User + Breadcrumb providers
│   │   │   └── Toast.tsx             # Toast notification component
│   │   ├── Dashboard/                # Dashboard components
│   │   │   ├── DashboardPageClient.tsx
│   │   │   ├── KPICards.tsx
│   │   │   ├── AttentionAlerts.tsx
│   │   │   ├── OnboardingPipeline.tsx
│   │   │   ├── UserActivityChart.tsx
│   │   │   ├── DemandHotspots.tsx
│   │   │   └── SystemHealth.tsx
│   │   ├── Agencies/                 # Agency management components
│   │   ├── AgencyDetail/             # Agency detail page components
│   │   ├── Agents/                   # Agent management components
│   │   ├── StaffAndRoles/            # Staff & roles components
│   │   ├── Applications/             # Application moderation components
│   │   ├── Integrations/             # Integration monitoring components
│   │   ├── EmailTemplates/           # Email template components
│   │   ├── BlockedIps/               # Blocked IP components
│   │   ├── FtpRequests/              # FTP request components
│   │   └── PropertyReports/          # Property report components
│   │
│   ├── contexts/                     # React Context providers
│   │   ├── UserContext.tsx            # User authentication state
│   │   └── BreadcrumbContext.tsx      # Dynamic breadcrumb state
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useDashboard.ts           # Dashboard data fetching
│   │   ├── useAgencies.ts            # Agency list management
│   │   ├── useAgencyDetail.ts        # Agency detail management
│   │   ├── useAgents.ts              # Agent list management
│   │   ├── useApplications.ts        # Application management
│   │   ├── useStaffAndRoles.ts       # Staff & roles management
│   │   ├── useEmailTemplates.ts      # Email template management
│   │   ├── useIntegrations.ts        # Integration management
│   │   ├── useBlockedIps.ts          # Blocked IP management
│   │   ├── useFtpRequests.ts         # FTP request management
│   │   ├── usePropertyReports.ts     # Property report management
│   │   └── useTemplateEditor.tsx     # Template editor logic
│   │
│   ├── lib/                          # Utility libraries and services
│   │   ├── api.ts                    # Server-side backend fetch helper
│   │   ├── auth.ts                   # Server-side authentication (getUser via /admin/me)
│   │   ├── axios.ts                  # Client-side Axios instance with interceptors
│   │   ├── dashboard-service.ts      # Dashboard API service
│   │   ├── agency-service.ts         # Agency API service
│   │   ├── agent-service.ts          # Agent API service
│   │   ├── application-service.ts    # Application API service
│   │   ├── staff-service.ts          # Staff & Groups API service
│   │   ├── email-templates-service.ts # Email template API service
│   │   ├── integration-service.ts    # Integration API service
│   │   ├── blocked-ip-service.ts     # Blocked IP API service
│   │   ├── ftp-request-service.ts    # FTP request API service
│   │   └── property-report-service.ts # Property report API service
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── agencyTypes.ts            # Agency DTOs and frontend types
│   │   ├── agentTypes.ts             # Agent DTOs and frontend types
│   │   ├── applicationTypes.ts       # Application DTOs and frontend types
│   │   ├── permissionTypes.ts        # Permission matrix types
│   │   ├── integrationTypes.ts       # Integration DTOs and frontend types
│   │   ├── blockedIpTypes.ts         # Blocked IP DTOs and frontend types
│   │   ├── ftpRequestTypes.ts        # FTP request DTOs and frontend types
│   │   └── propertyReportTypes.ts    # Property report DTOs and frontend types
│   │
│   ├── actions/                      # Server actions and data fetching
│   │   ├── agenciesActions.ts        # Agency server actions
│   │   ├── agenciesListActions.ts    # Agency list server actions
│   │   ├── agentsActions.ts          # Agent server actions
│   │   ├── applicationsActions.ts    # Application server actions
│   │   ├── dashboardActions.ts       # Dashboard type definitions
│   │   ├── emailTemplatesActions.ts  # Email template server actions
│   │   ├── staffAndRolesActions.ts   # Staff & roles server actions
│   │   ├── integrationsActions.ts    # Integration server actions
│   │   ├── blockedIpsActions.ts      # Blocked IP server actions
│   │   ├── ftpRequestsActions.ts     # FTP request server actions
│   │   └── propertyReportsActions.ts # Property report server actions
│   │
│   └── middleware.ts                  # Next.js middleware (route protection)
│
├── public/                            # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── next.config.ts                     # Next.js configuration
├── tailwind.config.ts                 # Tailwind CSS configuration
├── tsconfig.json                      # TypeScript configuration
├── postcss.config.mjs                 # PostCSS configuration
├── eslint.config.mjs                  # ESLint configuration
├── package.json                       # Dependencies and scripts
└── bun.lock                           # Bun lockfile
```

## Application Architecture

### Folder Organization

The project follows Next.js App Router conventions with clear separation of concerns:

- **`app/`** — Pages and API routes organized by feature domain
- **`components/`** — Reusable UI components grouped by feature module
- **`contexts/`** — React Context providers for global client state
- **`hooks/`** — Custom hooks encapsulating business logic and data fetching
- **`lib/`** — Utility functions, API services, and authentication helpers
- **`types/`** — TypeScript interfaces and type definitions
- **`actions/`** — Server actions for data fetching and mutations

### Component Architecture

Components follow a layered architecture:

1. **Page Components** (Server Components) — Fetch data server-side, pass to client components
2. **Client Components** (`"use client"`) — Interactive UI with state management
3. **Shared Components** — Layout, navigation, and reusable UI elements
4. **Feature Components** — Domain-specific components (Dashboard, Agencies, etc.)

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Server Side                               │
├─────────────────────────────────────────────────────────────────┤
│  Page Component (Server)                                         │
│    ↓ calls                                                       │
│  Server Action / Service (lib/*-service.ts)                      │
│    ↓ fetches from                                                │
│  Backend API (ADMIN_API_URL)                                     │
│    ↓ reads from                                                  │
│  HttpOnly Cookies (access-token)                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Client Side                               │
├─────────────────────────────────────────────────────────────────┤
│  Client Component ("use client")                                 │
│    ↓ uses                                                        │
│  Custom Hook (hooks/use*.ts)                                     │
│    ↓ fetches via                                                 │
│  Axios / Fetch → Next.js API Routes (/api/*)                     │
│    ↓ reads from                                                  │
│  HttpOnly Cookies (access-token, refresh-token)                  │
│    ↓ manages                                                     │
│  TanStack React Query (server state)                             │
│  React Context (user state, breadcrumbs)                         │
└─────────────────────────────────────────────────────────────────┘
```

### API Communication

The application uses a Backend-for-Frontend (BFF) pattern:

1. **Server-side:** Direct `fetch()` calls to the admin backend API with Bearer token from cookies
2. **Client-side:** Axios instance with interceptors that routes through Next.js API routes (`/api/*`)
3. **API Routes:** Next.js serverless functions that proxy requests to the admin backend, handling token injection and cookie management

### Routing Strategy

- **File-based routing** via Next.js App Router
- **Server Components** for initial data fetching (SEO-friendly, faster initial load)
- **Client Components** for interactive features
- **Middleware** for route protection (checks `access-token` cookie)
- **Public routes:** `/login`, `/api/auth/*`
- **Protected routes:** All other routes require valid `access-token`

## Installation

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, pnpm, or bun
- Access to the HomeBy admin backend API

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd homeby-admin-next

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## Running the Project

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Opens at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

### Preview

```bash
npm run build
npm run start
```

## Available Scripts

| Script | Description |
|---|---|
| `dev` | Start Next.js development server with hot reload |
| `build` | Build the application for production |
| `start` | Start the production server |
| `lint` | Run ESLint to check for code quality issues |

## Routing

### Public Routes

| Route | Component | Description |
|---|---|---|
| `/login` | `app/login/page.tsx` | Login page with password and MFA steps |

### Protected Routes

| Route | Component | Description |
|---|---|---|
| `/` | `app/page.tsx` | Redirects to `/dashboard` |
| `/dashboard` | `app/dashboard/page.tsx` | Platform overview and metrics |
| `/agencies` | `app/agencies/page.tsx` | Agency list management |
| `/agencies/[id]` | `app/agencies/[id]/page.tsx` | Agency detail with tabs |
| `/agents` | `app/agents/page.tsx` | Agent directory |
| `/applications` | `app/applications/page.tsx` | Application moderation queue |
| `/staff` | `app/staff/page.tsx` | Staff & roles management |
| `/email-templates` | `app/email-templates/page.tsx` | Email template list |
| `/email-templates/new` | `app/email-templates/new/page.tsx` | Create new template |
| `/email-templates/[templateName]` | `app/email-templates/[templateName]/page.tsx` | Template editor |
| `/integrations` | `app/integrations/page.tsx` | Feed operations monitoring |
| `/blocked-ips` | `app/blocked-ips/page.tsx` | IP block management |
| `/ftp-requests` | `app/ftp-requests/page.tsx` | FTP request management |
| `/property-reports` | `app/property-reports/page.tsx` | Property report management |

### API Routes

| Route | Methods | Description |
|---|---|---|
| `/api/auth/admin/login` | POST | Admin login (returns OTP token) |
| `/api/auth/verify-2fa` | POST | Verify 2FA code (returns tokens) |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/auth/logout` | POST | Logout and clear cookies |
| `/api/auth/me` | GET | Get current user info |
| `/api/auth/forgot-password` | POST | Send password reset email |
| `/api/dashboard/*` | GET | Dashboard data endpoints |
| `/api/agencies/*` | GET, POST, PUT, DELETE | Agency CRUD endpoints |
| `/api/agents/*` | GET, POST, PUT | Agent management endpoints |
| `/api/applications/*` | GET, POST | Application management endpoints |
| `/api/staff/*` | GET, POST, PUT, DELETE | Staff management endpoints |
| `/api/email-templates/*` | GET, POST, PUT, DELETE | Email template endpoints |
| `/api/integrations/*` | GET, POST | Integration endpoints |
| `/api/blocked-ips/*` | GET, POST | Blocked IP endpoints |
| `/api/ftp-requests/*` | GET, POST | FTP request endpoints |
| `/api/property-reports/*` | GET | Property report endpoints |

### Route Protection

Middleware-based route protection:
- Public paths: `/login`, `/api/auth/*`
- Authenticated users on `/login` are redirected to `/dashboard`
- All other paths require `access-token` cookie
- Redirects to `/login` if no token found
- Matches all paths except static files (`_next/static`, `_next/image`, `favicon.ico`, `*.*`)

## API Integration

### Client-Side (Axios)

```typescript
// src/lib/axios.ts
const api = axios.create({
  baseURL: "",
});

// Request interceptor: cookies handled by Next.js API routes
// Response interceptor: 401 → refresh token → retry → redirect to /login
```

### Server-Side (Fetch)

```typescript
// src/lib/api.ts
export async function backendFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access-token")?.value;
  
  const response = await fetch(`${BACKEND_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  
  // Handle errors, parse JSON, return data
}
```

### API Route Pattern

All client-side API calls route through Next.js API routes (`/api/*`), which:
1. Read tokens from HttpOnly cookies
2. Forward requests to the admin backend
3. Set/update cookies as needed
4. Return responses to the client

### Error Handling

| Status Code | Behavior |
|---|---|
| 401 Unauthorized | Attempt token refresh once. If refresh fails, redirect to `/login` |
| 403 Forbidden | Show inline error: "You do not have permission to perform this action" |
| 404 Not Found | Show empty state with "Record not found" message |
| 500 Server Error | Show toast: "Something went wrong. Try again or contact support" |
| Network timeout | Show toast with retry button |

### Token Management

- **Access Token:** HttpOnly cookie, 1-hour expiry
- **Refresh Token:** HttpOnly cookie, 7-day expiry
- **OTP Token:** HttpOnly cookie, 5-minute expiry (temporary, cleared after 2FA verification)
- **Storage:** HttpOnly, Secure, SameSite=Lax cookies

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Login Page                                                  │
│     User enters email + password                                │
│     ↓                                                           │
│  2. POST /api/auth/admin/login                                  │
│     Backend validates credentials                               │
│     Returns: { token } (OTP token)                              │
│     Sets: otp-token cookie (5 min TTL)                          │
│     ↓                                                           │
│  3. MFA Verification                                            │
│     User enters 6-digit TOTP code                               │
│     ↓                                                           │
│  4. POST /api/auth/verify-2fa                                   │
│     Backend validates OTP code + token                          │
│     Returns: { accessToken, refreshToken, user }                │
│     Sets: access-token (1hr), refresh-token (7d)                │
│     Clears: otp-token                                           │
│     ↓                                                           │
│  5. Redirect to /dashboard                                      │
│     ↓                                                           │
│  6. Protected Routes                                            │
│     Middleware checks access-token cookie                       │
│     Server-side reads token for API calls                       │
│     ↓                                                           │
│  7. Token Refresh (automatic)                                   │
│     On 401 response → POST /api/auth/refresh                    │
│     Updates access-token and refresh-token cookies               │
│     Retries original request                                    │
│     ↓                                                           │
│  8. Logout                                                      │
│     POST /api/auth/logout                                       │
│     Backend invalidates server-side session                     │
│     Clears all auth cookies                                     │
│     Redirect to /login                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Forms

### Form Handling

- **Library:** Native React forms (no external form library)
- **Validation:** Inline validation with custom error messages
- **State:** Local component state (`useState` for each field)

### Reusable Form Patterns

| Pattern | Components | Description |
|---|---|---|
| Login Form | `LoginPage` | Email + password with show/hide toggle |
| MFA Form | `LoginPage` | 6-digit OTP input with auto-focus and paste support |
| Forgot Password | `LoginPage` | Email input with success state |
| Add Staff | `AddStaffModal` | First name, last name, email, mobile, role, status, MFA |
| Edit Staff | `EditStaffDrawer` | Profile editing with OTP verification |
| Create Agency | `CreateAgencySidebar` | Agency creation form |
| Send Invitation | `SendInvitationModal` | Agency invitation form |
| Create Agent | `CreateAgentDrawer` | Agent creation form |
| Reject Application | `RejectModal` | Reason + notification toggle |
| Request Info | `ApplicationDrawer` | Message input |
| Test Email | `TestEmailModal` | Email address input |
| Create IP Block | `ConfirmBlockModal` | IP address + reason |
| Change Password | `ChangePasswordDrawer` | New password input |

### Validation Strategy

- Required field validation (empty check)
- Email format validation
- Numeric validation (OTP codes)
- Character length limits
- Real-time inline error display below each field
- Red border on invalid fields
- Error text in danger color (`#DC2626`)

## UI Components

### Layout Components

| Component | File | Purpose |
|---|---|---|
| `AppLayout` | `Shared/AppLayout.tsx` | Main layout wrapper (sidebar + topbar + content) |
| `Sidebar` | `Shared/Sidebar.tsx` | Left navigation with role-based filtering |
| `Topbar` | `Shared/Topbar.tsx` | Top bar with breadcrumbs, search, profile |
| `Providers` | `Shared/Providers.tsx` | QueryClient + User + Breadcrumb providers |

### Shared UI Components

| Component | File | Purpose |
|---|---|---|
| `Toast` | `Shared/Toast.tsx` | Success/info/error notifications |

### Dashboard Components

| Component | File | Purpose |
|---|---|---|
| `DashboardPageClient` | `Dashboard/DashboardPageClient.tsx` | Dashboard orchestrator with skeleton loading |
| `KPICards` | `Dashboard/KPICards.tsx` | Metric cards (agencies, applications, feeds, MRR) |
| `AttentionAlerts` | `Dashboard/AttentionAlerts.tsx` | Alert pills with action links |
| `OnboardingPipeline` | `Dashboard/OnboardingPipeline.tsx` | Pipeline stage visualization |
| `UserActivityChart` | `Dashboard/UserActivityChart.tsx` | Line chart (Recharts) |
| `DemandHotspots` | `Dashboard/DemandHotspots.tsx` | Suburb demand table |
| `SystemHealth` | `Dashboard/SystemHealth.tsx` | Health status tiles |

### Agency Components

| Component | File | Purpose |
|---|---|---|
| `AgenciesPageClient` | `Agencies/AgenciesPageClient.tsx` | Agency list page orchestrator |
| `AgenciesTable` | `Agencies/AgenciesTable.tsx` | Agency data table |
| `AgenciesPagination` | `Agencies/AgenciesPagination.tsx` | Pagination controls |
| `AgenciesStats` | `Agencies/AgenciesStats.tsx` | Summary statistics cards |
| `AgencyBadges` | `Agencies/AgencyBadges.tsx` | Status badge components |
| `CreateAgencySidebar` | `Agencies/CreateAgencySidebar.tsx` | Create agency slide-out panel |
| `SendInvitationModal` | `Agencies/SendInvitationModal.tsx` | Send invitation modal |

### Agency Detail Components

| Component | File | Purpose |
|---|---|---|
| `AgencyDetailClient` | `AgencyDetail/AgencyDetailClient.tsx` | Detail page orchestrator |
| `AgencyHeader` | `AgencyDetail/AgencyHeader.tsx` | Agency profile header |
| `AgencyTabs` | `AgencyDetail/AgencyTabs.tsx` | Tab navigation |
| `OverviewTab` | `AgencyDetail/OverviewTab.tsx` | Overview content |
| `AgentsTab` | `AgencyDetail/AgentsTab.tsx` | Linked agents list |
| `ListingsTab` | `AgencyDetail/ListingsTab.tsx` | Listing overview |
| `BillingTab` | `AgencyDetail/BillingTab.tsx` | Subscription & billing |
| `ReviewsTab` | `AgencyDetail/ReviewsTab.tsx` | Agency reviews |
| `NotesTab` | `AgencyDetail/NotesTab.tsx` | Internal notes |
| `AuditTab` | `AgencyDetail/AuditTab.tsx` | Activity audit log |
| `EditAgencySidebar` | `AgencyDetail/EditAgencySidebar.tsx` | Edit agency panel |
| `DeleteAgencyModal` | `AgencyDetail/DeleteAgencyModal.tsx` | Delete confirmation |
| `SuspendAgencyModal` | `AgencyDetail/SuspendAgencyModal.tsx` | Suspend confirmation |
| `ComingSoon` | `AgencyDetail/ComingSoon.tsx` | Placeholder for unbuilt tabs |

### Agent Components

| Component | File | Purpose |
|---|---|---|
| `AgentsPageClient` | `Agents/AgentsPageClient.tsx` | Agent list page orchestrator |
| `AgentsTable` | `Agents/AgentsTable.tsx` | Agent data table |
| `AgentsPagination` | `Agents/AgentsPagination.tsx` | Pagination controls |
| `AgentDrawer` | `Agents/AgentDrawer.tsx` | Agent detail slide-out panel |
| `CreateAgentDrawer` | `Agents/CreateAgentDrawer.tsx` | Create agent panel |

### Staff & Roles Components

| Component | File | Purpose |
|---|---|---|
| `StaffPageClient` | `StaffAndRoles/StaffPageClient.tsx` | Staff page orchestrator |
| `StaffTable` | `StaffAndRoles/StaffTable.tsx` | Staff data table |
| `StaffTabs` | `StaffAndRoles/StaffTabs.tsx` | Staff/Roles tab navigation |
| `StaffStats` | `StaffAndRoles/StaffStats.tsx` | Summary statistics |
| `StaffPagination` | `StaffAndRoles/StaffPagination.tsx` | Pagination controls |
| `RolesList` | `StaffAndRoles/RolesList.tsx` | Roles list view |
| `PermissionsModal` | `StaffAndRoles/PermissionsModal.tsx` | Permission matrix modal |
| `EditStaffDrawer` | `StaffAndRoles/EditStaffDrawer.tsx` | Edit staff panel |
| `AddStaffModal` | `StaffAndRoles/AddStaffModal.tsx` | Add staff modal |
| `ConfirmModal` | `StaffAndRoles/ConfirmModal.tsx` | Confirmation dialogs |

### Application Components

| Component | File | Purpose |
|---|---|---|
| `ApplicationsPageClient` | `Applications/ApplicationsPageClient.tsx` | Applications page orchestrator |
| `ApplicationsTable` | `Applications/ApplicationsTable.tsx` | Applications data table |
| `ApplicationsPagination` | `Applications/ApplicationsPagination.tsx` | Pagination controls |
| `ApplicationStats` | `Applications/ApplicationStats.tsx` | Summary statistics |
| `ApplicationDrawer` | `Applications/ApplicationDrawer.tsx` | Application detail panel |
| `StatusBadge` | `Applications/StatusBadge.tsx` | Status badge component |
| `ApproveModal` | `Applications/ApproveModal.tsx` | Approve confirmation |
| `RejectModal` | `Applications/RejectModal.tsx` | Reject with reason modal |

### Integration Components

| Component | File | Purpose |
|---|---|---|
| `IntegrationsPageClient` | `Integrations/IntegrationsPageClient.tsx` | Integrations page orchestrator |
| `FeedsTable` | `Integrations/FeedsTable.tsx` | Feeds data table |
| `FeedsMobileList` | `Integrations/FeedsMobileList.tsx` | Mobile-optimized feed list |
| `FeedsPagination` | `Integrations/FeedsPagination.tsx` | Pagination controls |
| `FeedStats` | `Integrations/FeedStats.tsx` | Summary statistics |
| `StatusBadge` | `Integrations/StatusBadge.tsx` | Feed status badge |
| `DistributionTab` | `Integrations/DistributionTab.tsx` | Distribution portal status |
| `IntegrationDetailsPanel` | `Integrations/IntegrationDetailsPanel.tsx` | Detail slide-out panel |
| `AddIntegrationModal` | `Integrations/AddIntegrationModal.tsx` | Add integration modal |

### Email Template Components

| Component | File | Purpose |
|---|---|---|
| `EmailTemplatesPageClient` | `EmailTemplates/EmailTemplatesPageClient.tsx` | Templates page orchestrator |
| `EmailTemplatesTable` | `EmailTemplates/EmailTemplatesTable.tsx` | Templates data table |
| `EmailTemplatesPagination` | `EmailTemplates/EmailTemplatesPagination.tsx` | Pagination controls |
| `EmailTemplatesStats` | `EmailTemplates/EmailTemplatesStats.tsx` | Summary statistics |
| `CreateTemplateClient` | `EmailTemplates/CreateTemplateClient.tsx` | Create template page |
| `TemplateEditorClient` | `EmailTemplates/TemplateName/TemplateEditorClient.tsx` | Template editor orchestrator |
| `EditorForm` | `EmailTemplates/TemplateName/EditorForm.tsx` | Template body editor |
| `PreviewPanel` | `EmailTemplates/TemplateName/PreviewPanel.tsx` | Live preview panel |
| `VersionHistory` | `EmailTemplates/TemplateName/VersionHistory.tsx` | Version history list |
| `TestEmailModal` | `EmailTemplates/TemplateName/TestEmailModal.tsx` | Send test email modal |
| `ConfirmModal` | `EmailTemplates/TemplateName/ConfirmModal.tsx` | Confirmation dialogs |

### Blocked IP Components

| Component | File | Purpose |
|---|---|---|
| `BlockedIpsPageClient` | `BlockedIps/BlockedIpsPageClient.tsx` | Blocked IPs page orchestrator |
| `BlockedIpsTable` | `BlockedIps/BlockedIpsTable.tsx` | Blocked IPs data table |
| `BlockedIpsPagination` | `BlockedIps/BlockedIpsPagination.tsx` | Pagination controls |
| `CreateBlockPanel` | `BlockedIps/CreateBlockPanel.tsx` | Create block slide-out panel |
| `ConfirmBlockModal` | `BlockedIps/ConfirmBlockModal.tsx` | Block confirmation modal |
| `ConfirmDeleteModal` | `BlockedIps/ConfirmDeleteModal.tsx` | Delete confirmation modal |

### FTP Request Components

| Component | File | Purpose |
|---|---|---|
| `FtpRequestsPageClient` | `FtpRequests/FtpRequestsPageClient.tsx` | FTP requests page orchestrator |
| `FtpRequestsTable` | `FtpRequests/FtpRequestsTable.tsx` | FTP requests data table |
| `FtpRequestsPagination` | `FtpRequests/FtpRequestsPagination.tsx` | Pagination controls |
| `FtpRequestDrawer` | `FtpRequests/FtpRequestDrawer.tsx` | FTP request detail panel |
| `ChangePasswordDrawer` | `FtpRequests/ChangePasswordDrawer.tsx` | Change password panel |

### Property Report Components

| Component | File | Purpose |
|---|---|---|
| `PropertyReportsPageClient` | `PropertyReports/PropertyReportsPageClient.tsx` | Property reports page orchestrator |
| `PropertyReportsTable` | `PropertyReports/PropertyReportsTable.tsx` | Property reports data table |
| `PropertyReportsPagination` | `PropertyReports/PropertyReportsPagination.tsx` | Pagination controls |
| `PropertyReportDrawer` | `PropertyReports/PropertyReportDrawer.tsx` | Report detail panel |

## Custom Hooks

### `useDashboard`
- **Purpose:** Fetches and manages all dashboard data
- **Returns:** overview, attention, pipeline, userActivity, hotspots, isLoading, isError, timeframe, setTimeframe, TIMEFRAMES, getTrendClass, getAttentionLink
- **Data:** KPIs, alerts, pipeline stages, user activity chart, demand hotspots

### `useAgencies`
- **Purpose:** Manages agency list with pagination, search, and filters
- **Parameters:** initialAgencies, initialStats, initialTotal
- **Returns:** agencies, stats, total, currentPage, pageSize, searchQuery, statusFilter, isLoading, handlePageChange, etc.

### `useAgencyDetail`
- **Purpose:** Manages agency detail page with tabs and actions
- **Parameters:** agencyId, initialDetail
- **Returns:** detail, activeTab, onboarding, agents, notes, isLoading, handleSuspend, handleDelete, etc.

### `useAgents`
- **Purpose:** Manages agent directory with search and pagination
- **Parameters:** initialAgents, initialTotal
- **Returns:** agents, total, currentPage, pageSize, searchQuery, isLoading, handlePageChange, etc.

### `useApplications`
- **Purpose:** Manages application moderation queue
- **Parameters:** initialApplications, initialStats, initialTotal
- **Returns:** applications, stats, total, statusFilter, isLoading, handleApprove, handleReject, etc.

### `useStaffAndRoles`
- **Purpose:** Manages staff and roles with CRUD operations
- **Parameters:** initialStaff, initialRoles, initialSummary
- **Returns:** staff, roles, summary, isLoading, handleAdd, handleEdit, handleResetMfa, etc.

### `useEmailTemplates`
- **Purpose:** Manages email template list with search and pagination
- **Parameters:** initialTemplates, initialTotal
- **Returns:** templates, total, searchQuery, isLoading, handlePageChange, etc.

### `useIntegrations`
- **Purpose:** Manages integrations and feed operations
- **Parameters:** initialFeeds, initialStats, initialTotal
- **Returns:** feeds, stats, total, statusFilter, isLoading, handleRetry, handlePause, etc.

### `useBlockedIps`
- **Purpose:** Manages blocked IP list with CRUD operations
- **Parameters:** initialBlockedIps, initialTotal
- **Returns:** blockedIps, total, isLoading, handleBlock, handleRemove, etc.

### `useFtpRequests`
- **Purpose:** Manages FTP request list with approval/rejection
- **Parameters:** initialRequests, initialTotal
- **Returns:** requests, total, isLoading, handleApprove, handleReject, etc.

### `usePropertyReports`
- **Purpose:** Manages property reports list with filters
- **Parameters:** initialReports, initialTotal
- **Returns:** reports, total, isLoading, typeFilter, dateFilter, etc.

### `useTemplateEditor`
- **Purpose:** Manages template editor form, save, and preview
- **Parameters:** initialTemplate
- **Returns:** formState, handleSave, handlePreview, handleTestEmail, etc.

## Styling

### Tailwind CSS Configuration

The project uses Tailwind CSS 4 with custom semantic tokens defined in `globals.css`:

```css
@theme {
    --color-page: #f7f8fa;       /* Page background */
    --color-card: #ffffff;       /* Card surface */
    --color-text: #0f1115;       /* Primary text */
    --color-muted: #5a6068;      /* Secondary text */
    --color-border: #e4e6ea;     /* Borders */
    --color-accent: #2563eb;     /* Buttons, links, focus rings */
    --color-success: #16a34a;    /* Success states */
    --color-warning: #d97706;    /* Warning states */
    --color-danger: #dc2626;     /* Error/danger states */
}
```

### Typography

- **Font Family:** Inter (Google Fonts)
- **Base Font Size:** 14px
- **Table Font Size:** 13px
- **Metadata Font Size:** 12px

### Spacing

- **Table Row Height:** 44px
- **Form Row Height:** 56px
- **Sidebar Width:** 300px (280px on smaller screens)
- **Content Max Width:** 1620px

### Transitions

- **Default Duration:** 150ms
- **Applied to:** hover/focus states only
- **No animations:** No slide-ins, no skeletons (except loading states)

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `page` | `#F7F8FA` | Page background |
| `card` | `#FFFFFF` | Card surfaces |
| `text` | `#0F1115` | Primary text |
| `muted` | `#5A6068` | Secondary text |
| `border` | `#E4E6EA` | Borders and dividers |
| `accent` | `#2563EB` | Buttons, links, focus rings |
| `success` | `#16A34A` | Active, approved, healthy |
| `warning` | `#D97706` | Pending, warning |
| `danger` | `#DC2626` | Rejected, suspended, error |

### Responsive Breakpoints

- **Mobile:** < 1024px (sidebar hidden, hamburger menu)
- **Tablet:** 1024px - 1280px (sidebar 200px)
- **Desktop:** 1280px+ (sidebar 300px, full layout)

## Responsive Design

### Layout Strategy

- **Desktop-first** design optimized for 1440px+
- **Mobile sidebar:** Overlay with backdrop, toggled via hamburger menu
- **Responsive sidebar width:** 200px (lg) → 300px (xl)
- **Content max-width:** 1620px with responsive padding

### Mobile Adaptations

- Sidebar becomes overlay on mobile (< 1024px)
- Hamburger menu in topbar for sidebar toggle
- Tables scroll horizontally on small screens
- Grid layouts stack vertically on mobile
- Search bar collapses to icon on smaller screens

### Breakpoint Classes Used

- `lg:` — 1024px (sidebar visibility)
- `xl:` — 1280px (sidebar width, search bar visibility)
- `sm:` — 640px (responsive padding, grid columns)

## Performance Optimizations

### Server-Side Rendering

- Page components are Server Components by default
- Data fetched server-side reduces client-side waterfalls
- React Query HydrationBoundary for server-to-client data transfer

### Caching

- TanStack React Query with 60-second stale time
- `cache: "no-store"` on server-side fetches (real-time data)
- Next.js built-in caching for static assets

### Code Organization

- Feature-based component grouping
- Shared components extracted for reuse
- Custom hooks encapsulate business logic
- Server-side services separate from client-side logic

### Bundle Optimization

- Next.js automatic code splitting
- Dynamic imports for client components
- Tree shaking for unused Lucide icons
- Tailwind CSS purging unused styles

## Error Handling

### Client-Side Error Handling

| Error Type | Handling |
|---|---|
| API 401 | Automatic token refresh → retry → redirect to `/login` |
| API 403 | Inline error message |
| API 404 | Empty state with "Record not found" |
| API 500 | Toast notification with retry option |
| Network error | Toast notification with retry option |
| Form validation | Inline field errors with red borders |

### Server-Side Error Handling

| Error Type | Handling |
|---|---|
| Backend fetch failure | Throws `BackendError` with status code |
| Missing access token | Throws `BackendError(401)` |
| JSON parse error | Returns raw text or empty object |

### Error Boundaries

Not implemented. No React Error Boundary components found in the codebase.

## Loading States

### Skeleton Loaders

Dashboard page includes a `DashboardSkeleton` component with:
- Pulsing card placeholders
- Grid layout matching final content structure
- Animated with `animate-pulse` Tailwind utility

### Inline Loading

- Button loading spinners (border animation)
- Table loading states
- Drawer/panel loading indicators
- Page-level loading via React Query `isLoading` states

## Accessibility

### Implemented

- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<form>`, `<label>`)
- ARIA labels on icon-only buttons (`aria-label`)
- Keyboard navigation for OTP inputs
- Focus management on modal open
- Color contrast compliant with WCAG AA (text on card backgrounds)
- Form labels associated with inputs
- Alt text on images (where applicable)

### Not Implemented

- ARIA live regions for dynamic content
- Skip navigation links
- Focus trapping in modals
- Screen reader announcements for route changes

## Browser Support

| Browser | Version | Status |
|---|---|---|
| Chrome | 90+ | Supported |
| Firefox | 90+ | Supported |
| Safari | 14+ | Supported |
| Edge | 90+ | Supported |
| Mobile Chrome | 90+ | Supported |
| Mobile Safari | 14+ | Supported |

**Note:** Desktop-first design. Mobile experience is functional but not the primary target.

## Dependencies

### Core

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.6 | React framework |
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | React DOM renderer |
| `typescript` | ^5.0.0 | Type system |

### UI & Styling

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | 4.3.0 | Utility-first CSS framework |
| `@tailwindcss/postcss` | ^4.3.0 | PostCSS integration |
| `lucide-react` | ^1.17.0 | Icon library |
| `clsx` | ^2.1.1 | Conditional classnames |

### State Management

| Package | Version | Purpose |
|---|---|---|
| `@tanstack/react-query` | ^5.100.14 | Server state management |

### HTTP & Data

| Package | Version | Purpose |
|---|---|---|
| `axios` | ^1.16.1 | HTTP client (client-side) |

### Charts

| Package | Version | Purpose |
|---|---|---|
| `recharts` | ^3.8.1 | Chart library (line charts) |

### Developer Tools

| Package | Version | Purpose |
|---|---|---|
| `eslint` | ^9.0.0 | Code linting |
| `eslint-config-next` | 16.2.6 | Next.js ESLint config |
| `autoprefixer` | ^10.5.0 | CSS vendor prefixing |

## Code Quality

### ESLint

Configuration: `eslint.config.mjs`

- Extends `eslint-config-next/core-web-vitals`
- TypeScript support via `typescript-eslint`
- Rules enforced:
  - React Hooks rules
  - Next.js best practices
  - Unused variable warnings
  - Import ordering

### TypeScript

Configuration: `tsconfig.json`

- Target: ES2017
- Module resolution: Bundler
- Strict mode enabled
- Path alias: `@/*` → `./src/*`

### Code Style

- **Indentation:** 4 spaces
- **Quotes:** Double quotes for strings
- **Semicolons:** Required
- **Trailing commas:** All
- **Line length:** No explicit limit
- **Component naming:** PascalCase
- **File naming:** PascalCase for components, camelCase for hooks/services
- **Type naming:** PascalCase with `Dto` suffix for API types

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `AgenciesTable.tsx` |
| Hooks | camelCase with `use` prefix | `useAgencies.ts` |
| Services | camelCase with `-service` suffix | `agency-service.ts` |
| Types | PascalCase with `Dto` suffix | `AgencyListItemDto` |
| API Routes | kebab-case | `/api/agencies/[id]/overview` |
| CSS Classes | Tailwind utilities | `bg-card text-text` |

## Testing

### Current Status

**Not Implemented.** No testing framework, test files, or test configuration found in the codebase.

### Recommended Setup

If testing is added in the future:

- **Unit Testing:** Vitest
- **Component Testing:** React Testing Library
- **E2E Testing:** Playwright
- **Coverage:** V8 provider

## Project Statistics

| Metric | Count |
|---|---|
| Total Pages | 15 |
| Total Components | 90 |
| Shared Components | 5 |
| Feature Components | 85 |
| Layouts | 1 (AppLayout) |
| Routes | 15 page routes + 47 API routes |
| Feature Modules | 12 |
| Custom Hooks | 12 |
| Contexts | 2 (User, Breadcrumb) |
| Services | 13 |
| Type Files | 8 |
| Server Actions | 11 |

## Known Limitations

1. **No Dark Mode:** Desktop-only light theme as per specification
2. **No Mobile Optimization:** Designed for 1440px+ screens, mobile experience is basic
3. **No Error Boundaries:** Unhandled errors may crash the entire app
4. **No Unit Tests:** No test coverage or testing framework configured
5. **No E2E Tests:** No end-to-end testing setup
6. **No Offline Support:** No service worker or offline functionality
7. **No i18n:** English-only interface
8. **No Animation System:** Minimal transitions (150ms only)
9. **Notification Bell Disabled:** Placeholder UI only, not connected to backend

## Future Improvements

Based on the existing codebase, realistic improvements include:

1. **Error Boundaries** — Add React Error Boundary components for graceful error recovery
2. **Unit Testing** — Implement Vitest + React Testing Library for component testing
3. **E2E Testing** — Add Playwright for critical user flows
4. **Dark Mode** — Extend Tailwind theme with dark mode tokens
5. **i18n** — Add internationalization support for multi-language
6. **Form Library** — Integrate React Hook Form or Formik for complex form management
7. **Toast System** — Implement a global toast context instead of per-component state
8. **Virtual Scrolling** — Add virtualization for large data tables
9. **Offline Support** — Implement service worker for offline capability
10. **Analytics** — Add usage tracking and performance monitoring
11. **Accessibility Audit** — Comprehensive WCAG 2.1 AA compliance review
12. **Performance Monitoring** — Add Lighthouse CI and Core Web Vitals tracking

## Contributing

### Development Setup

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Install dependencies: `npm install`
5. Start dev server: `npm run dev`
6. Make your changes
7. Run linter: `npm run lint`
8. Commit with conventional commits: `git commit -m "feat: add new feature"`
9. Push to your fork: `git push origin feature/your-feature`
10. Create a Pull Request

### Code Standards

- Follow existing code style and naming conventions
- Add TypeScript types for new data structures
- Use semantic Tailwind classes (no hardcoded hex values)
- Extract reusable components to `Shared/` directory
- Create custom hooks for business logic
- Add server actions in `actions/` for data fetching
- Update this README if adding new features or pages

### Commit Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes (formatting, etc.)
refactor: Code refactoring
test:     Adding or updating tests
chore:    Build process or auxiliary tool changes
```

## License

This project is proprietary software. All rights reserved by HomeBy / ARKAI Solutions.

---

**Version:** 0.1.0
**Last Updated:** June 2026
**Maintained by:** HomeBy Engineering Team
