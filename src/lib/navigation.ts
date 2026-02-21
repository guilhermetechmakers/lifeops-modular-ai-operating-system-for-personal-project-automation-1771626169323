/**
 * Central route-to-label mapping for breadcrumbs and navigation.
 * Add new routes here to ensure consistent labels across the app.
 */
export const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  'master-dashboard': 'Master Dashboard',
  cronjobs: 'Cronjobs',
  'cronjobs-dashboard': 'Cronjobs Dashboard',
  'cronjob-editor': 'Cronjob Editor',
  agents: 'Agents & Workflows',
  approvals: 'Approvals Queue',
  projects: 'Projects',
  content: 'Content',
  finance: 'Finance',
  health: 'Health',
  settings: 'Settings',
  billing: 'Billing',
  admin: 'Admin',
  profile: 'Profile',
  'user-profile': 'User Profile',
  audit: 'Activity Log',
  help: 'Help',
  privacy: 'Privacy Policy',
  cookies: 'Cookie Policy',
  'terms-of-service': 'Terms of Service',
  'password-reset': 'Reset Password',
  login: 'Sign In',
  signup: 'Create Account',
  'login-/-signup': 'Sign In / Sign Up',
  '404': 'Page Not Found',
}

export interface BreadcrumbItem {
  label: string
  href: string
}

/**
 * Build breadcrumb items from pathname.
 * e.g. /dashboard/cronjobs-dashboard -> [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Cronjobs Dashboard', href: '/dashboard/cronjobs-dashboard' }]
 */
export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return []

  // Dashboard index shows "Master Dashboard"
  if (segments.length === 1 && segments[0] === 'dashboard') {
    return [{ label: 'Master Dashboard', href: '/dashboard' }]
  }

  const items: BreadcrumbItem[] = []
  let currentPath = ''

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    currentPath += `/${segment}`

    // Handle dynamic segments (e.g. :id)
    const label = ROUTE_LABELS[segment] ?? (segment.match(/^[0-9a-f-]{36}$/i) ? 'Details' : formatSegment(segment))
    items.push({ label, href: currentPath })
  }

  return items
}

function formatSegment(segment: string): string {
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}
