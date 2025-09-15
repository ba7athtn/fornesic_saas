// src/auth/rbac.js
const ROLE_SCOPES = {
  guest: [],
  user: [
    'account:read',
    'account:write',
    'analysis:create',
    'analysis:read:self',
    'analysis:export'
  ],
  forensic_analyst: [
    'analysis:read:org',
    'analysis:annotate',
    'report:generate'
  ],
  senior_analyst: [
    'report:publish',
    'report:template:manage',
    'audit:read:org'
  ],
  admin: [
    'org:member:list',
    'org:member:invite',
    'org:member:role:update',
    'org:quota:update',
    'billing:view'
  ],
  superadmin: [
    'platform:settings:*',
    'platform:audit:read',
    'platform:feature:toggle'
  ],
  apiclient: [
    'api:ingest',
    'api:status',
    'api:usage:read'
  ]
};

function scopesFromRoles(roles = []) {
  const set = new Set();
  for (const r of roles) {
    const list = ROLE_SCOPES[String(r)] || [];
    for (const s of list) set.add(s);
  }
  return Array.from(set);
}

module.exports = { ROLE_SCOPES, scopesFromRoles };
