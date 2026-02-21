import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, User, Settings, LogOut, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface TopNavProps {
  searchQuery?: string
  onSearchChange?: (value: string) => void
  onGlobalCreate?: () => void
  onMenuClick?: () => void
  showMenuButton?: boolean
  className?: string
}

const SEARCH_MAX_LENGTH = 200

export function TopNav({
  searchQuery: controlledSearch,
  onSearchChange,
  onGlobalCreate,
  onMenuClick,
  showMenuButton = false,
  className,
}: TopNavProps) {
  const [internalSearch, setInternalSearch] = useState('')
  const [searchError, setSearchError] = useState<string | null>(null)
  const searchQuery = controlledSearch ?? internalSearch
  const setSearchQuery = onSearchChange ?? setInternalSearch

  const handleSearchChange = (value: string) => {
    if (value.length > SEARCH_MAX_LENGTH) {
      setSearchError(`Search must be ${SEARCH_MAX_LENGTH} characters or less`)
      setSearchQuery(value.slice(0, SEARCH_MAX_LENGTH))
    } else {
      setSearchError(null)
      setSearchQuery(value)
    }
  }

  return (
    <header
      className={cn(
        'flex h-14 items-center gap-4 border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/60 lg:px-6',
        className
      )}
    >
      <div className="flex flex-1 items-center gap-4">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            placeholder="Search agents, cronjobs, runs..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={cn(
              'h-10 pl-9 pr-4 transition-all duration-200 focus:border-accent/50 focus:ring-accent/20',
              searchError && 'border-destructive focus:border-destructive focus:ring-destructive/20'
            )}
            aria-label="Search agents, cronjobs, and runs"
            aria-invalid={!!searchError}
            aria-errormessage={searchError ? 'search-error' : undefined}
          />
          {searchError && (
            <p
              id="search-error"
              className="mt-1 text-xs text-destructive"
              role="alert"
            >
              {searchError}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={onGlobalCreate}
          className="bg-gradient-to-r from-accent to-primary shadow-accent-glow transition-all duration-200 hover:scale-[1.02] hover:opacity-90 hover:shadow-accent-glow"
          aria-label="Quick create agent, workflow, or cronjob"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full transition-all duration-200 hover:scale-[1.02]"
              aria-label="Open user account menu"
            >
              <Avatar className="h-8 w-8 border-2 border-border">
                <AvatarFallback className="bg-accent/20 text-accent text-sm font-medium">
                  U
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Account</p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/profile" className="flex cursor-pointer items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings" className="flex cursor-pointer items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              aria-label="Sign out of your account"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
