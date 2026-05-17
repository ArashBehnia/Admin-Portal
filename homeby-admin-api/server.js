import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend development
app.use(cors());
app.use(express.json());

// ==========================================
// STATEFUL IN-MEMORY SEED DATA
// ==========================================

let sessionTokens = new Set();
let activeMfaSessions = new Map(); // sessionToken -> mfaSessionDetails

// 1. Agencies list state
let agencies = [
  {
    id: '1',
    name: 'LJ Hooker',
    status: 'Active',
    tier: 'Enterprise',
    state: 'NSW',
    listingsCount: 142,
    onboardingStage: 'Live', // Applied -> Approved -> CRM Connected -> Syncing -> Validation -> Live
    notes: 'LJ Hooker key enterprise account. High volume syncing active.',
    crmConnected: true,
    syncing: true,
    validated: true,
    billing: { plan: 'Enterprise', rate: '$2,500/mo', status: 'Paid', nextBilling: '2026-06-01' }
  },
  {
    id: '2',
    name: 'McGrath',
    status: 'Warning',
    tier: 'Pro',
    state: 'VIC',
    listingsCount: 8,
    onboardingStage: 'Validation',
    notes: 'Awaiting feed schema mapping adjustments.',
    crmConnected: true,
    syncing: true,
    validated: false,
    billing: { plan: 'Pro', rate: '$950/mo', status: 'Paid', nextBilling: '2026-06-05' }
  },
  {
    id: '3',
    name: 'Ray White Double Bay',
    status: 'Pending',
    tier: 'Enterprise',
    state: 'NSW',
    listingsCount: 0,
    onboardingStage: 'Applied',
    notes: 'Newly registered agency. Onboarding queue priority.',
    crmConnected: false,
    syncing: false,
    validated: false,
    billing: { plan: 'Enterprise', rate: '$2,500/mo', status: 'Unpaid', nextBilling: 'On Activation' }
  },
  {
    id: '4',
    name: 'Raine & Horne Corporate',
    status: 'Inactive',
    tier: 'Basic',
    state: 'QLD',
    listingsCount: 12,
    onboardingStage: 'CRM Connected',
    notes: 'CRM credentials setup completed. Sync pending feed operations review.',
    crmConnected: true,
    syncing: false,
    validated: false,
    billing: { plan: 'Basic', rate: '$450/mo', status: 'Suspended', nextBilling: 'N/A' }
  }
];

// 2. Agents list state
let agents = [
  {
    id: '1',
    name: 'Alexander Phillips',
    email: 'alexander@ljhooker.com.au',
    role: 'superadmin',
    status: 'Active',
    agencyId: '1',
    agencyName: 'LJ Hooker',
    phone: '+61 400 123 456'
  },
  {
    id: '2',
    name: 'Gavin Rubinstein',
    email: 'gavin@raywhite.com.au',
    role: 'admin',
    status: 'Active',
    agencyId: '3',
    agencyName: 'Ray White Double Bay',
    phone: '+61 411 999 888'
  },
  {
    id: '3',
    name: 'D\'Leanne Lewis',
    email: 'dleanne@mcgrath.com.au',
    role: 'reviewer',
    status: 'Active',
    agencyId: '2',
    agencyName: 'McGrath',
    phone: '+61 405 555 111'
  },
  {
    id: '4',
    name: 'Sarah Ward',
    email: 'sarah.ward@rainehorne.com.au',
    role: 'content-editor',
    status: 'Inactive',
    agencyId: '4',
    agencyName: 'Raine & Horne Corporate',
    phone: '+61 402 777 333'
  }
];

// 3. Applications list state (moderation queue)
let applications = [
  {
    id: '1',
    agentName: 'John McGrath',
    email: 'john@mcgrath.com.au',
    agencyName: 'McGrath Real Estate',
    abn: '32003893321',
    abnStatus: 'Verified',
    status: 'Pending', // Pending / Approved / Rejected / Awaiting info
    requestDate: '2026-05-15T10:30:00Z',
    notes: 'Top tier VIC franchise registration request.'
  },
  {
    id: '2',
    agentName: 'Mathew Campbell',
    email: 'mathew@campbellco.com.au',
    agencyName: 'Campbell & Co.',
    abn: '99123456789',
    abnStatus: 'Unverified',
    status: 'Awaiting info',
    requestDate: '2026-05-14T08:15:00Z',
    notes: 'Awaiting clarification on corporate group structures.'
  },
  {
    id: '3',
    agentName: 'Brooke Patterson',
    email: 'brooke@pattersonproperty.com.au',
    agencyName: 'Patterson Real Estate',
    abn: '88765432109',
    abnStatus: 'Verified',
    status: 'Rejected',
    requestDate: '2026-05-12T14:45:00Z',
    notes: 'Registration rejected: ABN registration address does not match operations scope.'
  }
];

// 4. Email Templates list state
let templates = [
  {
    id: 'welcome-agency',
    name: 'Welcome Agency',
    subject: 'Welcome to HomeBy Admin!',
    category: 'Onboarding',
    body: 'Hi {{agency_name}},\n\nWelcome to HomeBy! Your admin dashboard is now approved and active.\nTemporary credentials: {{temp_password}}.\n\nRegards,\nHomeBy Team',
    variables: ['agency_name', 'temp_password', 'dashboard_url'],
    versions: [
      { id: 'v2', date: '2026-05-10T12:00:00Z', author: 'Arash Behnia', body: 'Hi {{agency_name}},\n\nWelcome to HomeBy! Your admin dashboard is now approved and active.\nTemporary credentials: {{temp_password}}.\n\nRegards,\nHomeBy Team' },
      { id: 'v1', date: '2026-05-01T09:00:00Z', author: 'Hirad Baradaran', body: 'Welcome to HomeBy Admin! Creds: {{temp_password}}.' }
    ]
  },
  {
    id: 'mfa-reset',
    name: 'MFA Reset Confirmation',
    subject: 'MFA Reset Authorized',
    category: 'Security',
    body: 'Hello {{staff_name}},\n\nYour MFA settings have been securely reset. Please log in to configure your new TOTP device.\n\nRegards,\nSecurity Operations',
    variables: ['staff_name', 'support_email'],
    versions: [
      { id: 'v1', date: '2026-05-02T15:30:00Z', author: 'Arash Behnia', body: 'Hello {{staff_name}},\n\nYour MFA settings have been securely reset. Please log in to configure your new TOTP device.\n\nRegards,\nSecurity Operations' }
    ]
  }
];

// 5. Staff list state
let staff = [
  {
    id: 'staff-arash',
    name: 'Arash Behnia',
    email: 'arash@homeby.com.au',
    role: 'superadmin',
    status: 'Active',
    mfaEnabled: true,
    lastActive: '2026-05-17T22:50:00Z'
  },
  {
    id: 'staff-soheil',
    name: 'Soheil Mohseni',
    email: 'soheil@homeby.com.au',
    role: 'admin',
    status: 'Active',
    mfaEnabled: true,
    lastActive: '2026-05-17T21:40:00Z'
  },
  {
    id: 'staff-support',
    name: 'Jane Doe',
    email: 'jane.doe@homeby.com.au',
    role: 'support',
    status: 'Active',
    mfaEnabled: false,
    lastActive: '2026-05-16T18:00:00Z'
  }
];

let feedHistory = [
  { timestamp: '2026-05-17T22:30:00Z', status: 'Success', listingsSynced: 12, duration: '1.2s' },
  { timestamp: '2026-05-17T21:30:00Z', status: 'Success', listingsSynced: 4, duration: '0.8s' },
  { timestamp: '2026-05-17T20:30:00Z', status: 'Failing', error: 'ABN Address Validation Mismatch', listingsSynced: 0, duration: '3.4s' }
];

let feedErrors = [
  { timestamp: '2026-05-17T20:30:00Z', code: 'VAL_043', message: 'ABN Address Validation Mismatch in field: postcode' },
  { timestamp: '2026-05-16T15:00:00Z', code: 'SYS_999', message: 'FTP Connection Timeout' }
];

// ==========================================
// MIDDLEWARES & HELPERS
// ==========================================

// Mock Logger Middleware
app.use((req, res, next) => {
  console.log(`[Demo API] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// POST /auth/login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'arash@homeby.com.au' && password === 'arash@homeby.com.au') {
    const sessionToken = `session-token-${Date.now()}`;
    activeMfaSessions.set(sessionToken, { email, role: 'superadmin', name: 'Arash Behnia', id: 'staff-arash' });
    return res.status(200).json({
      'mfa-required': true,
      'session-token': sessionToken
    });
  } else {
    // Check if it matches other mock staff
    const staffMember = staff.find(s => s.email === email);
    if (staffMember && password === 'password123') {
      const sessionToken = `session-token-${Date.now()}`;
      activeMfaSessions.set(sessionToken, { email, role: staffMember.role, name: staffMember.name, id: staffMember.id });
      return res.status(200).json({
        'mfa-required': true,
        'session-token': sessionToken
      });
    }
  }
  return res.status(401).json({ message: 'Invalid email or password.' });
});

// POST /auth/mfa/verify
app.post('/auth/mfa/verify', (req, res) => {
  const { code, 'session-token': sessionToken } = req.body;
  const mfaDetails = activeMfaSessions.get(sessionToken);

  if (!mfaDetails) {
    return res.status(401).json({ message: 'MFA session expired or invalid.' });
  }

  if (code === '000000') {
    const accessToken = `access-jwt-${Date.now()}`;
    const refreshToken = `refresh-jwt-${Date.now()}`;
    sessionTokens.add(accessToken);
    activeMfaSessions.delete(sessionToken);

    return res.status(200).json({
      'access-token': accessToken,
      'refresh-token': refreshToken,
      role: mfaDetails.role,
      name: mfaDetails.name,
      'staff-id': mfaDetails.id,
      'expires-at': new Date(Date.now() + 3600 * 1000).toISOString() // 1 hour
    });
  }

  return res.status(401).json({ message: 'Invalid verification code.' });
});

// POST /auth/password/reset/request
app.post('/auth/password/reset/request', (req, res) => {
  const { email } = req.body;
  return res.status(200).json({
    message: `Password reset link sent to ${email}`
  });
});

// POST /auth/token/refresh
app.post('/auth/token/refresh', (req, res) => {
  const { 'refresh-token': token } = req.body;
  const newAccessToken = `access-jwt-refreshed-${Date.now()}`;
  const newRefreshToken = `refresh-jwt-refreshed-${Date.now()}`;
  sessionTokens.add(newAccessToken);

  return res.status(200).json({
    'access-token': newAccessToken,
    'refresh-token': newRefreshToken,
    'expires-at': new Date(Date.now() + 3600 * 1000).toISOString()
  });
});

// POST /auth/logout
app.post('/auth/logout', (req, res) => {
  return res.status(200).json({ message: 'Logout successful' });
});

// ==========================================
// DASHBOARD ENDPOINTS
// ==========================================

// GET /dashboard/kpis
app.get('/dashboard/kpis', (req, res) => {
  const feedFailures = agencies.filter(a => a.status === 'Failing').length;
  res.json({
    agencies: agencies.length,
    applications: applications.filter(a => a.status === 'Pending').length,
    feedFailures: feedFailures,
    mrr: '$45,000'
  });
});

// GET /dashboard/alerts
app.get('/dashboard/alerts', (req, res) => {
  res.json([
    { id: '1', type: 'error', message: 'McGrath feed failing: ABN Address Mismatch', link: '/integrations' },
    { id: '2', type: 'pending', message: '3 new agency applications await review', link: '/applications' }
  ]);
});

// GET /dashboard/pipeline
app.get('/dashboard/pipeline', (req, res) => {
  res.json({
    Applied: agencies.filter(a => a.onboardingStage === 'Applied').length,
    Approved: agencies.filter(a => a.onboardingStage === 'Approved').length,
    CRMConnected: agencies.filter(a => a.onboardingStage === 'CRM Connected').length,
    Syncing: agencies.filter(a => a.onboardingStage === 'Syncing').length,
    Validation: agencies.filter(a => a.onboardingStage === 'Validation').length,
    Live: agencies.filter(a => a.onboardingStage === 'Live').length,
    'Blocked >48h': agencies.filter(a => a.status === 'Warning' || a.status === 'Failing').length
  });
});

// GET /dashboard/user-activity
app.get('/dashboard/user-activity', (req, res) => {
  res.json([
    { name: 'Mon', active: 400 },
    { name: 'Tue', active: 300 },
    { name: 'Wed', active: 500 },
    { name: 'Thu', active: 200 },
    { name: 'Fri', active: 600 },
    { name: 'Sat', active: 700 },
    { name: 'Sun', active: 450 }
  ]);
});

// GET /dashboard/demand-hotspots
app.get('/dashboard/demand-hotspots', (req, res) => {
  res.json([
    { rank: 1, suburb: 'Double Bay', searches: 1420, listings: 45 },
    { rank: 2, suburb: 'Richmond', searches: 980, listings: 12 },
    { rank: 3, suburb: 'Surry Hills', searches: 850, listings: 19 }
  ]);
});

// GET /dashboard/system-health
app.get('/dashboard/system-health', (req, res) => {
  res.json({
    ftpStatus: 'Healthy',
    apiLatency: '45ms',
    databaseConnection: 'Connected',
    syncQueueDepth: 0
  });
});

// ==========================================
// INTEGRATIONS & FEEDS ENDPOINTS
// ==========================================

// GET /integrations/feeds
app.get('/integrations/feeds', (req, res) => {
  res.json(agencies.map(a => ({
    id: a.id,
    agencyName: a.name,
    status: a.status,
    lastSync: '2026-05-17T22:30:00Z',
    syncType: 'XML FTP',
    frequency: 'Hourly'
  })));
});

// GET /integrations/feeds/:agencyId
app.get('/integrations/feeds/:agencyId', (req, res) => {
  const agency = agencies.find(a => a.id === req.params.agencyId);
  if (!agency) return res.status(404).json({ message: 'Feed not found' });
  res.json({
    id: agency.id,
    agencyName: agency.name,
    status: agency.status,
    lastSync: '2026-05-17T22:30:00Z',
    syncType: 'XML FTP',
    frequency: 'Hourly',
    recordsCount: agency.listingsCount,
    errorMessage: agency.status === 'Failing' ? 'ABN Address Validation Mismatch' : null
  });
});

// GET /integrations/feeds/:agencyId/sync-history
app.get('/integrations/feeds/:agencyId/sync-history', (req, res) => {
  res.json(feedHistory);
});

// GET /integrations/feeds/:agencyId/errors
app.get('/integrations/feeds/:agencyId/errors', (req, res) => {
  res.json(feedErrors);
});

// GET /integrations/feeds/:agencyId/validation
app.get('/integrations/feeds/:agencyId/validation', (req, res) => {
  const agency = agencies.find(a => a.id === req.params.agencyId);
  res.json({
    id: req.params.agencyId,
    schemaValid: true,
    imagesValidated: agency ? agency.validated : false,
    addressCheck: agency ? agency.crmConnected : false
  });
});

// POST /integrations/feeds/:agencyId/retry
app.post('/integrations/feeds/:agencyId/retry', (req, res) => {
  const agency = agencies.find(a => a.id === req.params.agencyId);
  if (agency) {
    agency.status = 'Active';
    agency.validated = true;
  }
  res.json({ message: 'Sync retry scheduled successfully' });
});

// POST /integrations/feeds/:agencyId/pause
app.post('/integrations/feeds/:agencyId/pause', (req, res) => {
  const agency = agencies.find(a => a.id === req.params.agencyId);
  if (agency) {
    agency.status = 'Inactive';
    agency.syncing = false;
  }
  res.json({ message: 'Sync paused' });
});

// POST /integrations/feeds/:agencyId/resume
app.post('/integrations/feeds/:agencyId/resume', (req, res) => {
  const agency = agencies.find(a => a.id === req.params.agencyId);
  if (agency) {
    agency.status = 'Active';
    agency.syncing = true;
  }
  res.json({ message: 'Sync resumed' });
});

// GET /integrations/distribution
app.get('/integrations/distribution', (req, res) => {
  res.json(agencies.map(a => ({
    id: a.id,
    agencyName: a.name,
    portalsHealthy: '4/4',
    status: 'Healthy',
    failureReason: null
  })));
});

// GET /integrations/distribution/:agencyId
app.get('/integrations/distribution/:agencyId', (req, res) => {
  res.json({
    id: req.params.agencyId,
    domainAu: 'Healthy',
    realestateAu: 'Healthy',
    homebyDirect: 'Healthy',
    juwai: 'Healthy'
  });
});

// POST /integrations/distribution/:agencyId/notify
app.post('/integrations/distribution/:agencyId/notify', (req, res) => {
  res.json({ message: 'Agency integration managers notified' });
});

// ==========================================
// AGENCIES ENDPOINTS
// ==========================================

// GET /agencies
app.get('/agencies', (req, res) => {
  const { search, status, tier } = req.query;
  let filtered = [...agencies];

  if (search) {
    filtered = filtered.filter(a => a.name.toLowerCase().includes(search.toString().toLowerCase()));
  }
  if (status) {
    filtered = filtered.filter(a => a.status.toLowerCase() === status.toString().toLowerCase());
  }
  if (tier) {
    filtered = filtered.filter(a => a.tier.toLowerCase() === tier.toString().toLowerCase());
  }

  res.json(filtered);
});

// GET /agencies/stats
app.get('/agencies/stats', (req, res) => {
  res.json({
    totalAgencies: agencies.length,
    activeAgencies: agencies.filter(a => a.status === 'Active').length,
    pendingAgencies: agencies.filter(a => a.status === 'Pending').length,
    failingFeeds: agencies.filter(a => a.status === 'Failing').length
  });
});

// GET /agencies/:id
app.get('/agencies/:id', (req, res) => {
  const agency = agencies.find(a => a.id === req.params.id);
  if (!agency) return res.status(404).json({ message: 'Agency not found' });
  res.json(agency);
});

// PATCH /agencies/:id
app.patch('/agencies/:id', (req, res) => {
  const agency = agencies.find(a => a.id === req.params.id);
  if (!agency) return res.status(404).json({ message: 'Agency not found' });

  const { status, tier, notes } = req.body;
  if (status) agency.status = status;
  if (tier) agency.tier = tier;
  if (notes) agency.notes = notes;

  res.json(agency);
});

// POST /agencies/:id/approve
app.post('/agencies/:id/approve', (req, res) => {
  const agency = agencies.find(a => a.id === req.params.id);
  if (!agency) return res.status(404).json({ message: 'Agency not found' });

  agency.status = 'Active';
  agency.onboardingStage = 'Approved';
  res.json({ message: 'Agency approved. Welcome email sent with temporary credentials.' });
});

// POST /agencies/:id/suspend
app.post('/agencies/:id/suspend', (req, res) => {
  const agency = agencies.find(a => a.id === req.params.id);
  if (!agency) return res.status(404).json({ message: 'Agency not found' });

  agency.status = 'Inactive';
  res.json({ message: 'Agency account suspended' });
});

// POST /agencies/invite
app.post('/agencies/invite', (req, res) => {
  const { name, email, tier } = req.body;
  const newAgency = {
    id: (agencies.length + 1).toString(),
    name,
    status: 'Pending',
    tier: tier || 'Basic',
    state: 'NSW',
    listingsCount: 0,
    onboardingStage: 'Applied',
    notes: `Invitation sent to ${email}`,
    crmConnected: false,
    syncing: false,
    validated: false,
    billing: { plan: tier || 'Basic', rate: '$450/mo', status: 'Unpaid', nextBilling: 'On Activation' }
  };
  agencies.push(newAgency);
  res.json(newAgency);
});

// GET /agencies/:id/timeline
app.get('/agencies/:id/timeline', (req, res) => {
  res.json([
    { id: '1', date: '2026-05-17T22:30:00Z', title: 'Onboarding step: CRM Connected', description: 'CRM synced successfully.' },
    { id: '2', date: '2026-05-15T09:00:00Z', title: 'Agency Approved', description: 'Superadmin Arash Behnia authorized registration.' }
  ]);
});

// GET /agencies/:id/agents
app.get('/agencies/:id/agents', (req, res) => {
  res.json(agents.filter(a => a.agencyId === req.params.id));
});

// GET /agencies/:id/listings
app.get('/agencies/:id/listings', (req, res) => {
  res.json([
    { id: '1', address: '12 Cooper St, Double Bay', price: '$4,200,000', type: 'Residential Sale', status: 'Live' },
    { id: '2', address: '304/8 Market St, Sydney', price: '$1,850,000', type: 'Residential Sale', status: 'Live' }
  ]);
});

// GET /agencies/:id/billing
app.get('/agencies/:id/billing', (req, res) => {
  const agency = agencies.find(a => a.id === req.params.id);
  if (!agency) return res.status(404).json({ message: 'Agency not found' });
  res.json(agency.billing);
});

// GET /agencies/:id/reviews
app.get('/agencies/:id/reviews', (req, res) => {
  res.json([
    { id: '1', reviewerName: 'Mominul R.', score: 5, comment: 'Exceptional service and quick responses.' },
    { id: '2', reviewerName: 'Alice K.', score: 4, comment: 'Process is smooth. Highly recommended.' }
  ]);
});

// GET /agencies/:id/audit-log
app.get('/agencies/:id/audit-log', (req, res) => {
  res.json([
    { id: '1', timestamp: '2026-05-17T22:00:00Z', action: 'Tier Upgrade', user: 'Arash Behnia', details: 'Upgraded from Pro to Enterprise.' },
    { id: '2', timestamp: '2026-05-15T09:00:00Z', action: 'Status Update', user: 'System', details: 'Approved onboarding application.' }
  ]);
});

// ==========================================
// AGENTS ENDPOINTS
// ==========================================

// GET /agents
app.get('/agents', (req, res) => {
  const { search, agencyId, role, status } = req.query;
  let filtered = [...agents];

  if (search) {
    filtered = filtered.filter(a => a.name.toLowerCase().includes(search.toString().toLowerCase()) || a.email.toLowerCase().includes(search.toString().toLowerCase()));
  }
  if (agencyId) {
    filtered = filtered.filter(a => a.agencyId === agencyId);
  }
  if (role) {
    filtered = filtered.filter(a => a.role === role);
  }
  if (status) {
    filtered = filtered.filter(a => a.status.toLowerCase() === status.toString().toLowerCase());
  }

  res.json(filtered);
});

// GET /agents/:id
app.get('/agents/:id', (req, res) => {
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(444).json({ message: 'Agent not found' });
  res.json(agent);
});

// POST /agents/:id/reset-password
app.post('/agents/:id/reset-password', (req, res) => {
  res.json({ message: 'Secure password reset link dispatched to agent.' });
});

// PATCH /agents/:id/role
app.patch('/agents/:id/role', (req, res) => {
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ message: 'Agent not found' });
  agent.role = req.body.role;
  res.json(agent);
});

// POST /agents/:id/deactivate
app.post('/agents/:id/deactivate', (req, res) => {
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ message: 'Agent not found' });
  agent.status = 'Inactive';
  res.json({ message: 'Agent account deactivated' });
});

// POST /agents/:id/transfer
app.post('/agents/:id/transfer', (req, res) => {
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ message: 'Agent not found' });

  const { 'agency-id': targetAgencyId } = req.body;
  const targetAgency = agencies.find(a => a.id === targetAgencyId);

  if (!targetAgency) return res.status(400).json({ message: 'Target agency does not exist' });
  
  agent.agencyId = targetAgency.id;
  agent.agencyName = targetAgency.name;
  res.json(agent);
});

// ==========================================
// APPLICATIONS ENDPOINTS
// ==========================================

// GET /applications
app.get('/applications', (req, res) => {
  const { status, search } = req.query;
  let filtered = [...applications];

  if (status) {
    filtered = filtered.filter(a => a.status.toLowerCase() === status.toString().toLowerCase());
  }
  if (search) {
    filtered = filtered.filter(a => a.agentName.toLowerCase().includes(search.toString().toLowerCase()) || a.agencyName.toLowerCase().includes(search.toString().toLowerCase()));
  }

  res.json(filtered);
});

// GET /applications/stats
app.get('/applications/stats', (req, res) => {
  res.json({
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === 'Pending').length,
    approvedApplications: applications.filter(a => a.status === 'Approved').length,
    rejectedApplications: applications.filter(a => a.status === 'Rejected').length
  });
});

// GET /applications/:id
app.get('/applications/:id', (req, res) => {
  const appItem = applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ message: 'Application not found' });
  res.json(appItem);
});

// GET /applications/:id/verify-abn
app.get('/applications/:id/verify-abn', (req, res) => {
  const appItem = applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ message: 'Application not found' });
  appItem.abnStatus = 'Verified';
  res.json({
    abn: appItem.abn,
    status: 'Active',
    entityName: appItem.agencyName,
    state: 'NSW'
  });
});

// POST /applications/:id/approve
app.post('/applications/:id/approve', (req, res) => {
  const appItem = applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ message: 'Application not found' });

  appItem.status = 'Approved';

  // Automatically create a new agency and agent in memory!
  const newAgencyId = (agencies.length + 1).toString();
  const newAgency = {
    id: newAgencyId,
    name: appItem.agencyName,
    status: 'Active',
    tier: 'Basic',
    state: 'NSW',
    listingsCount: 0,
    onboardingStage: 'Approved',
    notes: 'Approved via application queue.',
    crmConnected: false,
    syncing: false,
    validated: false,
    billing: { plan: 'Basic', rate: '$450/mo', status: 'Unpaid', nextBilling: 'On Activation' }
  };
  agencies.push(newAgency);

  const newAgentId = (agents.length + 1).toString();
  const newAgent = {
    id: newAgentId,
    name: appItem.agentName,
    email: appItem.email,
    role: 'admin',
    status: 'Active',
    agencyId: newAgencyId,
    agencyName: appItem.agencyName,
    phone: '+61 400 000 000'
  };
  agents.push(newAgent);

  res.json({ message: `Application approved. Account created. Welcome email sent to ${appItem.email}.` });
});

// POST /applications/:id/reject
app.post('/applications/:id/reject', (req, res) => {
  const appItem = applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ message: 'Application not found' });

  appItem.status = 'Rejected';
  appItem.notes = req.body.reason || 'Rejected by moderator';
  res.json({ message: 'Application rejected.' });
});

// POST /applications/:id/request-info
app.post('/applications/:id/request-info', (req, res) => {
  const appItem = applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ message: 'Application not found' });

  appItem.status = 'Awaiting info';
  appItem.notes = `More info requested: ${req.body.message}`;
  res.json({ message: 'Information request dispatch successful.' });
});

// ==========================================
// EMAIL TEMPLATES ENDPOINTS
// ==========================================

// GET /email-templates
app.get('/email-templates', (req, res) => {
  const { category, search } = req.query;
  let filtered = [...templates];

  if (category) {
    filtered = filtered.filter(t => t.category.toLowerCase() === category.toString().toLowerCase());
  }
  if (search) {
    filtered = filtered.filter(t => t.name.toLowerCase().includes(search.toString().toLowerCase()) || t.subject.toLowerCase().includes(search.toString().toLowerCase()));
  }

  res.json(filtered);
});

// GET /email-templates/:id
app.get('/email-templates/:id', (req, res) => {
  const template = templates.find(t => t.id === req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json(template);
});

// PATCH /email-templates/:id
app.patch('/email-templates/:id', (req, res) => {
  const template = templates.find(t => t.id === req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });

  const { subject, body } = req.body;
  if (subject) template.subject = subject;
  if (body) {
    template.body = body;
    // Push version history in-memory
    template.versions.unshift({
      id: `v${template.versions.length + 1}`,
      date: new Date().toISOString(),
      author: 'Arash Behnia',
      body: body
    });
  }

  res.json(template);
});

// POST /email-templates/:id/test
app.post('/email-templates/:id/test', (req, res) => {
  const { 'to-email': toEmail } = req.body;
  res.json({ message: `Test email dispatched to ${toEmail}` });
});

// GET /email-templates/:id/versions
app.get('/email-templates/:id/versions', (req, res) => {
  const template = templates.find(t => t.id === req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json(template.versions);
});

// POST /email-templates/:id/versions/:versionId/restore
app.post('/email-templates/:id/versions/:versionId/restore', (req, res) => {
  const template = templates.find(t => t.id === req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });

  const version = template.versions.find(v => v.id === req.params.versionId);
  if (!version) return res.status(404).json({ message: 'Version not found' });

  template.body = version.body;
  res.json(template);
});

// ==========================================
// STAFF & ROLES ENDPOINTS
// ==========================================

// GET /staff
app.get('/staff', (req, res) => {
  res.json(staff);
});

// GET /staff/stats
app.get('/staff/stats', (req, res) => {
  res.json({
    totalStaff: staff.length,
    activeStaff: staff.filter(s => s.status === 'Active').length,
    mfaConfigured: staff.filter(s => s.mfaEnabled).length
  });
});

// GET /staff/:id
app.get('/staff/:id', (req, res) => {
  const staffMember = staff.find(s => s.id === req.params.id);
  if (!staffMember) return res.status(404).json({ message: 'Staff member not found' });
  res.json(staffMember);
});

// POST /staff
app.post('/staff', (req, res) => {
  const { name, email, role } = req.body;
  const newStaff = {
    id: `staff-${Date.now()}`,
    name,
    email,
    role: role || 'support',
    status: 'Active',
    mfaEnabled: false,
    lastActive: new Date().toISOString()
  };
  staff.push(newStaff);
  res.json(newStaff);
});

// PATCH /staff/:id
app.patch('/staff/:id', (req, res) => {
  const staffMember = staff.find(s => s.id === req.params.id);
  if (!staffMember) return res.status(404).json({ message: 'Staff member not found' });

  const { name, email, role, status } = req.body;
  if (name) staffMember.name = name;
  if (email) staffMember.email = email;
  if (role) staffMember.role = role;
  if (status) staffMember.status = status;

  res.json(staffMember);
});

// POST /staff/:id/reset-mfa
app.post('/staff/:id/reset-mfa', (req, res) => {
  const staffMember = staff.find(s => s.id === req.params.id);
  if (staffMember) {
    staffMember.mfaEnabled = false;
  }
  res.json({ message: 'MFA setup configuration successfully reset.' });
});

// POST /staff/:id/revoke-sessions
app.post('/staff/:id/revoke-sessions', (req, res) => {
  res.json({ message: 'All active sessions for this account revoked successfully.' });
});

// GET /staff/:id/activity
app.get('/staff/:id/activity', (req, res) => {
  res.json([
    { id: '1', timestamp: new Date(Date.now() - 3600 * 1000).toISOString(), event: 'Authorized MFA Device', ip: '124.168.10.43' },
    { id: '2', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), event: 'Password Login Success', ip: '124.168.10.43' }
  ]);
});

// ==========================================
// WEB SERVER SPINUP
// ==========================================
app.listen(PORT, () => {
  console.log(`\n🚀 Stateful Local API server running at: http://localhost:${PORT}`);
  console.log(`👉 CORS enabled. Standard Auth Fallback configured.\n`);
});
