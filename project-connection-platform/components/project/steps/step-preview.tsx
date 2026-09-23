'use client'

import Image from 'next/image'
import { Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { ProjectDraft } from '@/components/project/create-project-form'

interface StepPreviewProps {
  data: ProjectDraft
}

export function StepPreview({ data }: StepPreviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Preview & post</h2>
        <p className="text-sm text-muted-foreground mt-1">
          This is how your project will appear in the feed. Make sure everything looks right.
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {/* Cover */}
        {data.coverUrl ? (
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <Image src={data.coverUrl} alt="Project cover" fill className="object-cover" />
          </div>
        ) : (
          <div
            className="w-full flex items-center justify-center bg-muted text-muted-foreground text-sm"
            style={{ aspectRatio: '16/9' }}
          >
            No cover image
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Title & tags */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground leading-tight">
              {data.title || <span className="text-muted-foreground italic">Untitled project</span>}
            </h3>
            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {data.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {data.description || <span className="italic">No description provided.</span>}
          </p>

          {/* Roles */}
          {data.roles.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Users className="h-4 w-4" />
                  <span>Open roles ({data.roles.length})</span>
                </div>
                <ul className="space-y-2">
                  {data.roles.map((role) => (
                    <li key={role.id} className="rounded-lg bg-muted px-3 py-2 space-y-0.5">
                      <p className="text-sm font-medium text-foreground">{role.title}</p>
                      {role.description && (
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
