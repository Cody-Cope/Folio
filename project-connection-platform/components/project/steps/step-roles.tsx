'use client'

import { useCallback } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { ProjectDraft, Role } from '@/components/project/create-project-form'

interface StepRolesProps {
  data: ProjectDraft
  onChange: (patch: Partial<ProjectDraft>) => void
  errors: Record<string, string>
}

function generateId() {
  return Math.random().toString(36).slice(2)
}

export function StepRoles({ data, onChange, errors }: StepRolesProps) {
  const updateRole = useCallback((id: string, patch: Partial<Role>) => {
    onChange({
      roles: data.roles.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })
  }, [data.roles, onChange])

  const addRole = useCallback(() => {
    onChange({
      roles: [...data.roles, { id: generateId(), title: '', description: '' }],
    })
  }, [data.roles, onChange])

  const removeRole = useCallback((id: string) => {
    onChange({ roles: data.roles.filter((r) => r.id !== id) })
  }, [data.roles, onChange])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Roles needed</h2>
        <p className="text-sm text-muted-foreground mt-1">
          What kind of collaborators are you looking for? Add up to 6 open roles.
        </p>
      </div>

      <div className="space-y-4">
        {data.roles.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center text-muted-foreground">
            <p className="text-sm font-medium">No roles added yet</p>
            <p className="text-xs mt-1">You can post without roles and add them later.</p>
          </div>
        )}

        {data.roles.map((role, idx) => (
          <div key={role.id} className="space-y-3 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Role {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeRole(role.id)}
                aria-label={`Remove role ${idx + 1}`}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor={`role-title-${role.id}`} className="text-sm font-medium text-foreground">
                  Role title <span className="text-destructive">*</span>
                </label>
                <Input
                  id={`role-title-${role.id}`}
                  value={role.title}
                  onChange={(e) => updateRole(role.id, { title: e.target.value })}
                  maxLength={60}
                  className={cn(errors[`role-${role.id}-title`] && 'border-destructive')}
                />
                {errors[`role-${role.id}-title`] && (
                  <p className="text-xs text-destructive">{errors[`role-${role.id}-title`]}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor={`role-desc-${role.id}`} className="text-sm font-medium text-foreground">
                  What will they do?
                </label>
                <Textarea
                  id={`role-desc-${role.id}`}
                  value={role.description}
                  onChange={(e) => updateRole(role.id, { description: e.target.value })}
                  maxLength={300}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        ))}

        {data.roles.length < 6 && (
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={addRole}
          >
            <Plus className="h-4 w-4" />
            Add a role
          </Button>
        )}
      </div>
    </div>
  )
}
