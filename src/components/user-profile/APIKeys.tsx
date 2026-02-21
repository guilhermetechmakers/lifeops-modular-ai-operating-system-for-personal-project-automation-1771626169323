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
import { toast } from 'sonner'
import { Key, Plus, Trash2, RotateCw, Loader2, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ApiKey } from '@/types/user-profile'

export interface APIKeysProps {
  apiKeys: ApiKey[]
  onCreate: (name: string, scope: string[]) => Promise<{ key: string; apiKey: ApiKey }>
  onRevoke: (id: string) => Promise<void>
  onRotate: (id: string) => Promise<{ key: string }>
  isLoading?: boolean
  className?: string
}

const SCOPES = ['read', 'write', 'admin', 'billing']

export function APIKeys({
  apiKeys,
  onCreate,
  onRevoke,
  onRotate,
  isLoading,
  className,
}: APIKeysProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyScope, setNewKeyScope] = useState<string[]>(['read'])
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [rotatedKey, setRotatedKey] = useState<string | null>(null)
  const [rotatedId, setRotatedId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!newKeyName.trim()) {
      toast.error('Enter a name for the API key')
      return
    }
    setIsCreating(true)
    try {
      const { key } = await onCreate(newKeyName.trim(), newKeyScope)
      setCreatedKey(key)
      toast.success('API key created. Copy it now — it won\'t be shown again.')
    } catch {
      toast.error('Failed to create API key')
    } finally {
      setIsCreating(false)
    }
  }

  const handleCloseCreate = () => {
    setCreateOpen(false)
    setNewKeyName('')
    setNewKeyScope(['read'])
    setCreatedKey(null)
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this API key? It will stop working immediately.')) return
    try {
      await onRevoke(id)
      toast.success('API key revoked')
    } catch {
      toast.error('Failed to revoke API key')
    }
  }

  const handleRotate = async (id: string) => {
    try {
      const { key } = await onRotate(id)
      setRotatedKey(key)
      setRotatedId(id)
      toast.success('API key rotated. Copy the new key now.')
    } catch {
      toast.error('Failed to rotate API key')
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card
        className={cn(
          'transition-all duration-300 hover:shadow-card-hover',
          'border border-border hover:border-accent/20',
          className
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>Create, revoke, scope, and rotate API keys</CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setCreateOpen(true)}
              aria-label="Create new API key"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Create
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary mb-4">
                <Key className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">No API keys yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Create an API key to use LifeOps programmatically.
              </p>
              <Button className="mt-4" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Create API key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-all duration-200 hover:border-accent/20 hover:bg-secondary/30"
                >
                  <div>
                    <p className="font-medium text-foreground">{k.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {rotatedId === k.id && rotatedKey ? rotatedKey : k.prefix}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Scope: {k.scope.join(', ')} · Created {new Date(k.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(rotatedId === k.id && rotatedKey) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(rotatedKey, k.id)}
                        aria-label={copiedId === k.id ? 'Copied' : 'Copy rotated API key'}
                      >
                        {copiedId === k.id ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRotate(k.id)}
                      aria-label={`Rotate API key ${k.name}`}
                    >
                      <RotateCw className="h-4 w-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRevoke(k.id)}
                      aria-label={`Revoke API key ${k.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={(open) => !open && handleCloseCreate()}>
        <DialogContent showClose={true}>
          <DialogHeader>
            <DialogTitle>{createdKey ? 'API key created' : 'Create API key'}</DialogTitle>
            <DialogDescription>
              {createdKey
                ? 'Copy your API key now. You won\'t be able to see it again.'
                : 'Create a new API key with a name and scope.'}
            </DialogDescription>
          </DialogHeader>
          {createdKey ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Input value={createdKey} readOnly className="font-mono text-sm" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(createdKey, 'new')}
                  aria-label={copiedId === 'new' ? 'Copied to clipboard' : 'Copy API key'}
                >
                  {copiedId === 'new' ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Name</Label>
                <Input
                  id="key-name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production API"
                />
              </div>
              <div className="space-y-2">
                <Label>Scope</Label>
                <div className="flex flex-wrap gap-2">
                  {SCOPES.map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant={newKeyScope.includes(s) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        setNewKeyScope((prev) =>
                          prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                        )
                      }
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCreate}>
              {createdKey ? 'Done' : 'Cancel'}
            </Button>
            {!createdKey && (
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
