# HomeBy Admin Portal - API Routes by Page

This document organizes all backend API endpoints by their corresponding frontend pages for easier integration and development.

> **⚠️ IMPORTANT NOTE:** This documentation is based on the API docs provided at `https://st1.homeby.com.au/api/admin-portal-api-help-json`. 
> 
> **Authentication routes are NOT included in the OpenAPI spec.** You'll need to check with your backend team for the actual login, logout, and token management endpoints.

---

## Dashboard Page
**Path:** `/dashboard`

### Overview & KPI Metrics
- **GET** `/api/admin/dashboard/overview` - Cockpit dashboard KPI overview (active agencies, pending applications, feed failures, attention items)

### Onboarding Pipeline
- **GET** `/api/admin/dashboard/onboarding-pipeline` - Agency onboarding pipeline counts and blocked agencies

### User Activity Analytics
- **GET** `/api/admin/dashboard/user-activity` - Daily active/new user activity series (supports `days` query parameter, default 30)

### Demand Hotspots
- **GET** `/api/admin/dashboard/demand-hotspots` - Top suburb demand hotspots (supports `days` and `limit` query parameters)

### Attention Alerts
- **GET** `/api/admin/dashboard/attention-alerts` - Dashboard attention-required alert counts

### Quick Stats Cards (Integrations, Agencies, Agents, Applications, Email Templates, Staff)
- **GET** `/api/admin/integrations/summary` - Integration/feed operations summary cards
- **GET** `/api/admin/agencies/summary` - Agency summary cards
- **GET** `/api/admin/agents/summary` - Agent summary cards
- **GET** `/api/admin/applications/summary` - Agent portal application summary cards
- **GET** `/api/admin/email-templates/summary` - Email template summary cards
- **GET** `/api/admin/staff/summary` - Internal admin staff summary cards

### System Roles & Permissions
- **GET** `/api/admin/roles` - Backend roles currently supported
- **GET** `/api/admin/permissions` - Backend role/group permission matrix

---

## Agencies Page
**Path:** `/agencies`

### List & Search Operations
- **GET** `/api/admin/agency/page` - Paginated list of agencies (with filters, sorting)
- **GET** `/api/admin/agency/query` - Query agencies with keywords
- **GET** `/api/admin/agency/all` - Get all agencies without pagination
- **GET** `/api/admin/agency/count` - Get total count of agencies

### CRUD Operations
- **POST** `/api/admin/agency` - Create new agency
- **GET** `/api/admin/agency` - Get agency details (bulk or single)
- **PUT** `/api/admin/agency` - Edit agency
- **PUT** `/api/admin/agency/{id}` - Edit specific agency by ID
- **DELETE** `/api/admin/agency` - Delete agency
- **DELETE** `/api/admin/agency/{id}` - Delete specific agency by ID

### Bulk Operations
- **POST** `/api/admin/agency/import` - Import agencies from Excel
- **GET** `/api/admin/agency/import-columns` - Get available import columns for agency entity
- **GET** `/api/admin/agency/export` - Export agencies to Excel

### Special Operations
- **PUT** `/api/admin/agency/change` - Change agency field (using composite key)
- **GET** `/api/admin/agency/own` - Get agencies owned by current user
- **GET** `/api/admin/agency/helper/refresh-view` - Refresh agency materialized view

### Agency Detail Page
**Path:** `/agencies/[id]`

- **GET** `/api/admin/agencies/{id}/overview` - Agency detail overview (name, status, email, phone, website, staff, listings, sales, last activity)
- **GET** `/api/admin/agencies/{id}/onboarding` - Onboarding checklist status for agency
- **POST** `/api/admin/agencies/{id}/suspend` - Suspend an agency (requires reason in body)

---

## Agents Page
**Path:** `/agents`

### List & Search Operations
- **GET** `/api/admin/agency-staff/page` - Paginated list of agents/staff
- **GET** `/api/admin/agency-staff/query` - Query agents with keywords
- **GET** `/api/admin/agency-staff` - Get agent details
- **GET** `/api/admin/agency-staff/count` - Get total count of agents
- **GET** `/api/admin/agency-staff/own` - Get agents owned by current user

### CRUD Operations
- **POST** `/api/admin/agency-staff` - Create new agent/staff member
- **PUT** `/api/admin/agency-staff` - Edit agent
- **PUT** `/api/admin/agency-staff/{id}` - Edit specific agent by ID
- **DELETE** `/api/admin/agency-staff` - Delete agent
- **DELETE** `/api/admin/agency-staff/{id}` - Delete specific agent by ID

### Bulk Operations
- **POST** `/api/admin/agency-staff/import` - Import agents from Excel
- **GET** `/api/admin/agency-staff/import-columns` - Get available import columns for agent entity
- **GET** `/api/admin/agency-staff/export` - Export agents to Excel

### Special Operations
- **PUT** `/api/admin/agency-staff/change` - Change agent field (using composite key)

### Agent Detail View
- **GET** `/api/admin/agents/{id}/overview` - Agent detail overview (email, mobile, role, status, active, name, agency, listings, sales, performance, views)
- **GET** `/api/admin/agents/{id}/activity` - Recent activity for one agent (supports `limit` query parameter, default 20)

### Agent Reviews
- **GET** `/api/admin/agent-reviews/page` - Paginated list of agent reviews
- **GET** `/api/admin/agent-reviews/query` - Query agent reviews
- **GET** `/api/admin/agent-reviews` - Get agent review details
- **GET** `/api/admin/agent-reviews/count` - Get total count of reviews
- **GET** `/api/admin/agent-reviews/own` - Get reviews for current user's agents
- **GET** `/api/admin/agent-reviews/all` - Get all reviews

### Agent Review CRUD
- **POST** `/api/admin/agent-reviews` - Create review
- **PUT** `/api/admin/agent-reviews` - Edit review
- **PUT** `/api/admin/agent-reviews/{id}` - Edit specific review by ID
- **DELETE** `/api/admin/agent-reviews` - Delete review
- **DELETE** `/api/admin/agent-reviews/{id}` - Delete specific review by ID

### Agent Review Bulk
- **POST** `/api/admin/agent-reviews/import` - Import reviews from Excel
- **GET** `/api/admin/agent-reviews/import-columns` - Get import columns for reviews
- **GET** `/api/admin/agent-reviews/export` - Export reviews to Excel

### Agent Review Special
- **PUT** `/api/admin/agent-reviews/change` - Change review field

### FTP/SFTP Requests (Sub-section or Modal)
- **GET** `/api/admin/agency-staff-ftp-requests` - Get all FTP requests
- **GET** `/api/admin/agency-staff-ftp-requests/query` - Query FTP requests
- **GET** `/api/admin/agency-staff-ftp-requests/page` - Paginated FTP requests
- **POST** `/api/admin/agency-staff-ftp-requests/{id}/approve` - Approve FTP request
- **POST** `/api/admin/agency-staff-ftp-requests/{id}/reject` - Reject FTP request (requires reason in body)
- **POST** `/api/admin/agency-staff-ftp-requests/{id}/change-password` - Change FTP password (requires new password in body)

---

## Applications Page
**Path:** `/applications`

### List & Search Operations
- **GET** `/api/admin/agent-portal/page` - Paginated list of applications
- **GET** `/api/admin/agent-portal/query` - Query applications with keywords
- **GET** `/api/admin/agent-portal` - Get application details
- **GET** `/api/admin/agent-portal/count` - Get total count of applications
- **GET** `/api/admin/agent-portal/own` - Get applications assigned to current user
- **GET** `/api/admin/agent-portal/all` - Get all applications

### CRUD Operations
- **POST** `/api/admin/agent-portal` - Create application
- **PUT** `/api/admin/agent-portal` - Edit application
- **PUT** `/api/admin/agent-portal/{id}` - Edit specific application by ID
- **DELETE** `/api/admin/agent-portal` - Delete application
- **DELETE** `/api/admin/agent-portal/{id}` - Delete specific application by ID

### Bulk Operations
- **POST** `/api/admin/agent-portal/import` - Import applications from Excel
- **GET** `/api/admin/agent-portal/import-columns` - Get available import columns
- **GET** `/api/admin/agent-portal/export` - Export applications to Excel

### Special Operations
- **PUT** `/api/admin/agent-portal/change` - Change application field
- **POST** `/api/admin/agent-portal/{id}/generate` - Create agency and activate applicant as owner
- **POST** `/api/admin/agent-portal/{id}/reject` - Reject an application

### Application Detail View / Modal
- **POST** `/api/admin/applications/{id}/assign` - Assign application to an admin reviewer (requires reviewerId in body)
- **POST** `/api/admin/applications/{id}/notes` - Add internal note to application (requires note in body)
- **GET** `/api/admin/applications/{id}/timeline` - Get application audit-style timeline

---

## Email Templates Page
**Path:** `/email-templates`

### List & Search Operations
- **GET** `/api/admin/template/page` - Paginated list of email/SMS templates
- **GET** `/api/admin/template/query` - Query templates with keywords
- **GET** `/api/admin/template` - Get template details
- **GET** `/api/admin/template/count` - Get total count of templates
- **GET** `/api/admin/template/own` - Get templates created by current user
- **GET** `/api/admin/template/all` - Get all templates

### CRUD Operations
- **POST** `/api/admin/template` - Create template
- **PUT** `/api/admin/template` - Edit template
- **PUT** `/api/admin/template/{id}` - Edit specific template by ID
- **DELETE** `/api/admin/template` - Delete template
- **DELETE** `/api/admin/template/{id}` - Delete specific template by ID

### Bulk Operations
- **POST** `/api/admin/template/import` - Import templates from Excel
- **GET** `/api/admin/template/import-columns` - Get available import columns
- **GET** `/api/admin/template/export` - Export templates to Excel

### Special Operations
- **PUT** `/api/admin/template/change` - Change template field

### Template Detail Page
**Path:** `/email-templates/[templateName]`

- Uses the same CRUD endpoints as above with specific template ID

---

## Integrations Page
**Path:** `/integrations`

### Summary & List
- **GET** `/api/admin/integrations/summary` - Integration/feed operations summary cards (connected, feed errors, syncing feeds)
- **GET** `/api/admin/integrations/page` - Paginated list of integrations/feeds (supports `offset`, `limit`, `keywords` query parameters)

### Integration Detail View
- **GET** `/api/admin/integrations/{id}` - Integration/feed detail for one agency (name, status, crm, webhook, connection status, feeds, errors, sync time, contact info, IP allowlists)
- **GET** `/api/admin/integrations/{id}/errors` - Recent integration/feed errors for one agency (supports `limit` query parameter, default 20)

---

## Staff & Roles Page
**Path:** `/staff`

### Staff Members List & Search
- **GET** `/api/admin/user/page` - Paginated list of staff members
- **GET** `/api/admin/user/query` - Query staff with keywords
- **GET** `/api/admin/user` - Get staff details
- **GET** `/api/admin/user/count` - Get total count of staff
- **GET** `/api/admin/user/own` - Get staff profile for current user
- **GET** `/api/admin/user/all` - Get all staff members

### Staff CRUD Operations
- **POST** `/api/admin/user` - Create new staff member (201 Created)
- **PUT** `/api/admin/user` - Edit staff member
- **PUT** `/api/admin/user/{id}` - Edit specific staff member by ID
- **DELETE** `/api/admin/user` - Delete staff member
- **DELETE** `/api/admin/user/{id}` - Delete specific staff member by ID

### Staff Bulk Operations
- **POST** `/api/admin/user/import` - Import staff from Excel
- **GET** `/api/admin/user/import-columns` - Get available import columns
- **GET** `/api/admin/user/export` - Export staff to Excel

### Staff Special Operations
- **PUT** `/api/admin/user/change` - Change staff field
- **POST** `/api/admin/user/admin-create-otp` - Request admin-created OTP for user account (201 Created)

### Staff Activity & Login History
- **GET** `/api/admin/staff/{id}/login-activity` - Last-login activity for one staff user (email, role, status, lastLoggedIn, IP)

### Roles Management
- **GET** `/api/admin/roles` - Get all backend roles with capabilities (key, label, backendRole, portal, capabilities)

### Groups/Workgroups Management
- **GET** `/api/admin/groups/page` - Paginated list of groups
- **GET** `/api/admin/groups/query` - Query groups with keywords
- **GET** `/api/admin/groups` - Get group details
- **GET** `/api/admin/groups/count` - Get total count of groups
- **GET** `/api/admin/groups/own` - Get groups owned by current user
- **GET** `/api/admin/groups/all` - Get all groups

### Groups CRUD
- **POST** `/api/admin/groups` - Create new group
- **PUT** `/api/admin/groups` - Edit group
- **PUT** `/api/admin/groups/{id}` - Edit specific group by ID
- **DELETE** `/api/admin/groups` - Delete group
- **DELETE** `/api/admin/groups/{id}` - Delete specific group by ID

### Groups Bulk Operations
- **POST** `/api/admin/groups/import` - Import groups from Excel
- **GET** `/api/admin/groups/import-columns` - Get available import columns
- **GET** `/api/admin/groups/export` - Export groups to Excel

### Groups Special Operations
- **PUT** `/api/admin/groups/change` - Change group field

### Permissions Matrix
- **GET** `/api/admin/permissions` - Get role/group permission matrix (roles, groups, permissionMatrixAvailable, note)

---

## Data Management Pages (Not yet visible in UI)

### Property Reports
**Endpoints for managing property data/reports:**
- **POST/PUT/DELETE/GET** `/api/admin/property-reports`
- **PUT** `/api/admin/property-reports/change`
- **PUT/DELETE** `/api/admin/property-reports/{id}`
- **POST** `/api/admin/property-reports/import`
- **GET** `/api/admin/property-reports/import-columns`
- **GET** `/api/admin/property-reports/all`
- **GET** `/api/admin/property-reports/export`
- **GET** `/api/admin/property-reports/query`
- **GET** `/api/admin/property-reports/page`
- **GET** `/api/admin/property-reports/own`
- **GET** `/api/admin/property-reports/count`

### Property Transaction History Reports
**Endpoints for managing transaction data:**
- **POST/PUT/DELETE/GET** `/api/admin/property-transaction-history-reports`
- **PUT** `/api/admin/property-transaction-history-reports/change`
- **PUT/DELETE** `/api/admin/property-transaction-history-reports/{id}`
- **POST** `/api/admin/property-transaction-history-reports/import`
- **GET** `/api/admin/property-transaction-history-reports/import-columns`
- **GET** `/api/admin/property-transaction-history-reports/all`
- **GET** `/api/admin/property-transaction-history-reports/export`
- **GET** `/api/admin/property-transaction-history-reports/query`
- **GET** `/api/admin/property-transaction-history-reports/page`
- **GET** `/api/admin/property-transaction-history-reports/own`
- **GET** `/api/admin/property-transaction-history-reports/count`

---

## Settings & Security (Admin Only)

### Configuration Management
- **GET** `/api/admin/config/keys` - Get available configuration keys
- **GET** `/api/admin/config/page` - Paginated list of configurations
- **GET** `/api/admin/config/query` - Query configurations
- **GET** `/api/admin/config` - Get configuration details
- **GET** `/api/admin/config/count` - Get total count
- **GET** `/api/admin/config/own` - Get configurations for current user
- **GET** `/api/admin/config/all` - Get all configurations

### Configuration CRUD
- **POST** `/api/admin/config` - Create configuration
- **PUT** `/api/admin/config` - Edit configuration
- **PUT** `/api/admin/config/{id}` - Edit specific configuration by ID
- **DELETE** `/api/admin/config` - Delete configuration
- **DELETE** `/api/admin/config/{id}` - Delete specific configuration by ID

### Configuration Bulk
- **POST** `/api/admin/config/import` - Import configurations
- **GET** `/api/admin/config/import-columns` - Get import columns
- **GET** `/api/admin/config/export` - Export configurations

### Configuration Special
- **PUT** `/api/admin/config/change` - Change configuration field

### Security - IP Blocklist
- **GET** `/api/admin/security/ip-blocklist/page` - Paginated IP blocklist (supports `offset`, `limit`, `filter` query parameters)
- **POST** `/api/admin/security/ip-blocklist/remove` - Remove IP from blocklist (requires ip in body)
- **POST** `/api/admin/security/ip-blocklist/block` - Block an IP (requires ip, optional ttlSeconds and reason in body)

---

## Missing / Undocumented Routes

⚠️ **Authentication Routes** - NOT included in OpenAPI spec but likely exist:
- **POST** `/api/auth/login` or `/api/admin/auth/login` - Login endpoint
- **POST** `/api/auth/logout` - Logout endpoint  
- **POST** `/api/auth/refresh-token` - Token refresh
- **GET** `/api/auth/me` - Current user profile
- **POST** `/api/auth/forgot-password` - Password reset request
- **POST** `/api/auth/reset-password` - Reset password with token
- **POST** `/api/auth/request-otp` - Request OTP
- **POST** `/api/auth/verify-otp` - Verify OTP code

**Action items:**
1. Ask backend team for authentication endpoint paths
2. Get login/logout response structures
3. Confirm token refresh mechanism
4. Understand OTP flow and MFA setup

---

## API Route Patterns

### Standard CRUD Patterns
All main entities follow this pattern:

```
GET    /api/admin/{resource}          # Get bulk details
POST   /api/admin/{resource}          # Create
PUT    /api/admin/{resource}          # Edit (bulk)
DELETE /api/admin/{resource}          # Delete (bulk)

GET    /api/admin/{resource}/{id}     # Get by ID (if supported)
PUT    /api/admin/{resource}/{id}     # Edit by ID
DELETE /api/admin/{resource}/{id}     # Delete by ID

PUT    /api/admin/{resource}/change   # Change field using composite key

GET    /api/admin/{resource}/page     # Paginated list
GET    /api/admin/{resource}/query    # Query with keywords
GET    /api/admin/{resource}/all      # All records (no pagination)
GET    /api/admin/{resource}/own      # User's own records
GET    /api/admin/{resource}/count    # Total count

POST   /api/admin/{resource}/import   # Import from Excel
GET    /api/admin/{resource}/import-columns  # Available columns
GET    /api/admin/{resource}/export   # Export to Excel
```

### Common Query Parameters
- `offset` - Pagination offset (default: 0)
- `limit` - Records per page (default: 20, max: 100)
- `keywords` / `filter` - Search filter string
- `days` - Time range for analytics (e.g., 7, 30, 90)
- `entity` - Entity type for import columns

### Common Headers
- `x-lang` - Language for responses (optional)
- `Authorization: Bearer {JWT}` - Required for secure endpoints

### Response Status Codes
- `200` - Success (GET, PUT, DELETE, POST)
- `201` - Created (POST operations like import, create OTP, generate)
- `400` - Bad request (validation errors, missing required fields)
- `404` - Not found (entity doesn't exist)

---

## Notes for Implementation

1. **Authentication**: Most endpoints require Bearer JWT token in Authorization header
2. **Bulk vs. ID-based Operations**: Use `PUT /api/admin/{resource}/{id}` for single updates and `PUT /api/admin/{resource}` for bulk updates
3. **Composite Keys**: The `/change` endpoints use matrix-style query parameters for composite key updates
4. **Pagination**: Default limit is usually 20, with max of 100 for security/performance
5. **Error Handling**: All endpoints return standard error responses with status codes and messages
6. **Rate Limiting**: Not specified in API docs but should be implemented for `/import` and `/export` endpoints
7. **File Uploads**: `/import` endpoints likely accept multipart form data with Excel files
8. **Export Formats**: `/export` endpoints likely return downloadable files (CSV or Excel)

---

## Quick Reference by HTTP Method

### GET Requests (Read-only)
- Dashboard analytics: `/dashboard/*`
- List views: `/{resource}/page`, `/{resource}/query`, `/{resource}/all`
- Details: `/{resource}/{id}`, `/{resource}/{id}/overview`, `/{resource}/{id}/activity`
- Metadata: `/roles`, `/permissions`, `/config/keys`
- Export: `/{resource}/export`, `/{resource}/import-columns`

### POST Requests (Create)
- Create records: `/api/admin/{resource}`
- Special actions: `/{resource}/{id}/approve`, `/{resource}/{id}/reject`, `/{resource}/{id}/generate`
- Bulk import: `/{resource}/import`
- Add data: `/{resource}/{id}/notes`, `/{resource}/{id}/assign`

### PUT Requests (Update)
- Update records: `/api/admin/{resource}`, `/api/admin/{resource}/{id}`
- Field changes: `/{resource}/change`
- Password changes: `/{resource}/{id}/change-password`

### DELETE Requests (Remove)
- Delete records: `/api/admin/{resource}`, `/api/admin/{resource}/{id}`
- Remove from list: `/security/ip-blocklist/remove`
