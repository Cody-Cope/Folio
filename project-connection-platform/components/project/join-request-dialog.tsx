'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import type { Role } from '@/lib/types'
import { CheckIcon } from 'lucide-react'

interface JoinRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectTitle: string
  projectId: string
  roles: Role[]
}

type Step = 'role' | 'message' | 'success'

export function JoinRequestDialog({
  open,
  onOpenChange,
  projectTitle,
  projectId,
  roles,
}: JoinRequestDialogProps) {
  const [step, setStep] = useState<Step>(roles.length > 0 ? 'role' : 'message')
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openRoles = roles.filter((r) => !r.filled)
  const selectedRole = roles.find((r) => r.id === selectedRoleId)

  const canAdvanceFromRole = openRoles.length === 0 || selectedRoleId !== null
  const canSubmit = message.trim().length >= 10

  function handleOpenChange(val: boolean) {
    if (!val) {
      // Reset state on close unless success (so success reads cleanly)
      setTimeout(() => {
        setStep(roles.length > 0 ? 'role' : 'message')
        setSelectedRoleId(null)
        setMessage('')
        setError(null)
      }, 300)
    }
    onOpenChange(val)
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleId: selectedRoleId,
          message: message.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Something went wrong.')
      setStep('success')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        {step === 'success' ? (
          <>
            <DialogHeader>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckIcon className="h-6 w-6 text-primary" />
              </div>
              <DialogTitle className="text-center">Request sent</DialogTitle>
              <DialogDescription className="text-center">
                The project owner will review your request and get back to you.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : step === 'role' ? (
          <>
            <DialogHeader>
              <DialogTitle>Apply to join</DialogTitle>
              <DialogDescription>
                Choose a role you&apos;d like to fill on{' '}
                <span className="font-medium text-foreground">{projectTitle}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-2">
              {openRoles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                    selectedRoleId === role.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-foreground/20 hover:bg-accent'
                  }`}
                >
                  <p className="text-sm font-medium">{role.title}</p>
                  {role.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {role.description}
                    </p>
                  )}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setSelectedRoleId(null)}
                className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                  selectedRoleId === null
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-foreground/20 hover:bg-accent'
                }`}
              >
                <p className="text-sm font-medium">General interest</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  No specific role — just want to contribute
                </p>
              </button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button disabled={!canAdvanceFromRole} onClick={() => setStep('message')}>
                Continue
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Introduce yourself</DialogTitle>
              <DialogDescription>
                Tell the owner why you&apos;re a good fit
                {selectedRole ? (
                  <>
                    {' '}
                    for the{' '}
                    <Badge variant="secondary" className="text-xs font-normal">
                      {selectedRole.title}
                    </Badge>{' '}
                    role
                  </>
                ) : null}
                .
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5 py-1">
              <Textarea
                className="min-h-[120px] resize-none"
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex items-center justify-between">
                {error && <p className="text-xs text-destructive">{error}</p>}
                <p className="ml-auto text-xs text-muted-foreground">{message.length}/500</p>
              </div>
            </div>

            <DialogFooter>
              {roles.length > 0 && (
                <Button variant="outline" onClick={() => setStep('role')} disabled={loading}>
                  Back
                </Button>
              )}
              <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
                {loading ? 'Sending…' : 'Send request'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
