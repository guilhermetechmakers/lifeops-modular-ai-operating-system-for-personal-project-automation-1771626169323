import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Clock,
  Bot,
  FolderKanban,
  FileText,
  Wallet,
  Heart,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3,
  Users,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const SIDEBAR_STORAGE_KEY = 'lifeops-sidebar-collapsed'

const mainNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Master Dashboard' },
  { to: '/dashboard/cronjobs', icon: Clock, label: 'Cronjobs Dashboard' },
  { to: '/dashboard/agents', icon: Bot, label: 'Agents & Workflows' },
  { to: '/dashboard/approvals', icon: CheckSquare, label: 'Approvals Queue' },
]

const moduleNavItems = [
  { to: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/dashboard/content', icon: FileText, label: 'Content' },
  { to: '/dashboard/finance', icon: Wallet, label: 'Finance' },
  { to: '/dashboard/health', icon: Heart, label: 'Health' },
]

const bottomNavItems = [
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  { to: '/dashboard/billing', icon: BarChart3, label: 'Billing' },
  { to: '/dashboard/admin', icon: Users, label: 'Admin' },
  { to: '/help', icon: HelpCircle, label: 'Help' },
]

function NavItem({
  to,
  icon: Icon,
  label,
  collapsed,
}: {
  to: string
  icon: React.ElementType
  label: string
  collapsed: boolean
}) {
  const location = useLocation()
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`)

  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        'hover:bg-secondary hover:text-foreground',
        isActive
          ? 'bg-accent/10 text-accent border-l-2 border-accent -ml-[2px] pl-[14px]'
          : 'text-muted-foreground'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed))
    } catch {
      // Ignore
    }
  }, [collapsed])

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Zap className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="font-bold text-foreground">LifeOps</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} />
          ))}
        </div>

        {!collapsed && (
          <div className="my-2 px-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Modules
            </span>
          </div>
        )}
        <div className="space-y-1">
          {moduleNavItems.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} />
          ))}
        </div>

        <div className="mt-auto pt-4">
          {!collapsed && (
            <div className="mb-2 px-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                System
              </span>
            </div>
          )}
          <div className="space-y-1">
            {bottomNavItems.map((item) => (
              <NavItem key={item.to} {...item} collapsed={collapsed} />
            ))}
          </div>
        </div>
      </nav>
    </aside>
  )
}
