import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Shield, Monitor, Loader2, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActiveSession } from '@/types/user-profile'

export interface SecurityProps {
  twoFactorEnabled?: boolean
  sessions: ActiveSession[]
  onChangePassword: (current: string, newPassword: string) => Promise<void>
  onEnable2FA: () => Promise<void>
  onRevokeSession: (id: string) => Promise<void>
  onRevokeTokens: () => Promise<void>
  isLoading?: boolean
  className?: string
}

export function Security({
  twoFactorEnabled = false,
  sessions,
  onChangePassword,
  onEnable2FA,
  onRevokeSession,
  onRevokeTokens,
  isLoading,
  className,
}: SecurityProps) {
  const [changePwdOpen, setChangePwdOpen] = useState(false)
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [isChangingPwd, setIsChangingPwd] = useState(false)
  const [isEnabling2FA, setIsEnabling2FA] = useState(false)
  const [isRevokingTokens, setIsRevokingTokens] = useState(false)

  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) {
      toast.error('Passwords do not match')
      return
    }
    if (newPwd.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setIsChangingPwd(true)
    try {
      await onChangePassword(currentPwd, newPwd)
      toast.success('Password updated')
      setChangePwdOpen(false)
      setCurrentPwd('')
      setNewPwd('')
      setConfirmPwd('')
    } catch {
      toast.error('Failed to change password')
    } finally {
      setIsChangingPwd(false)
    }
  }

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true)
    try {
      await onEnable2FA()
      toast.success('2FA setup initiated. Check your email for instructions.')
    } catch {
      toast.error('Failed to enable 2FA')
    } finally {
      setIsEnabling2FA(false)
    }
  }

  const handleRevokeTokens = async () => {
    if (!confirm('This will sign you out from all devices. Continue?')) return
    setIsRevokingTokens(true)
    try {
      await onRevokeTokens()
      toast.success('All sessions revoked')
    } catch {
      toast.error('Failed to revoke tokens')
    } finally {
      setIsRevokingTokens(false)
    }
  }

  if (isLoading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className={cn('transition-all duration-300 hover:shadow-card-hover', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Change password, 2FA, active sessions, and revoke tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">Change password</p>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setChangePwdOpen(true)}>
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">Two-factor authentication</p>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled ? 'Enabled' : 'Not enabled'}
              </p>
            </div>
            {!twoFactorEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEnable2FA}
                disabled={isEnabling2FA}
              >
                {isEnabling2FA ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enable'}
              </Button>
            )}
          </div>

          <div className="rounded-lg border border-border">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Active sessions</span>
            </div>
            <div className="divide-y divide-border max-h-48 overflow-y-auto">
              {sessions.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">No active sessions</div>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">{s.device}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.location} · Last active {new Date(s.last_active).toLocaleDateString()}
                      </p>
                    </div>
                    {!s.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onRevokeSession(s.id)}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                    {s.current && (
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">Revoke all tokens</p>
              <p className="text-sm text-muted-foreground">Sign out from all devices</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeTokens}
              disabled={isRevokingTokens}
            >
              {isRevokingTokens ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Revoke all'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={changePwdOpen} onOpenChange={setChangePwdOpen}>
        <DialogContent showClose={true}>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-pwd">Current password</Label>
              <Input
                id="current-pwd"
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pwd">New password</Label>
              <Input
                id="new-pwd"
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pwd">Confirm new password</Label>
              <Input
                id="confirm-pwd"
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePwdOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword} disabled={isChangingPwd}>
              {isChangingPwd ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
