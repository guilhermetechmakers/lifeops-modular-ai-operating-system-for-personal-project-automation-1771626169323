import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, Bell, User } from 'lucide-react'
import { Sidebar } from './sidebar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const isMasterDashboard = (path: string) =>
  path === '/dashboard' || path === '/dashboard/' || path === '/master-dashboard'

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const onMasterDashboard = isMasterDashboard(location.pathname)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar - hidden on Master Dashboard (page has its own TopNav) */}
        {!onMasterDashboard && (
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/60 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="User menu" asChild>
                <Link to="/dashboard/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </header>
        )}

        {/* Page content - no padding on Master Dashboard (TopNav is full-width) */}
        <main className={cn('flex-1', onMasterDashboard ? '' : 'p-4 lg:p-8')}>
          <div className={cn('mx-auto max-w-7xl', onMasterDashboard ? 'px-4 lg:px-8' : 'animate-fade-in')}>
            <Outlet context={{ mobileOpen, setMobileOpen }} />
          </div>
        </main>
      </div>
    </div>
  )
}
