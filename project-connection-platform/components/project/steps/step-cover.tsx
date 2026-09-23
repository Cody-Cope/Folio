'use client'

import { ImageUploader } from '@/components/project/image-uploader'
import type { ProjectDraft } from '@/components/project/create-project-form'

interface StepCoverProps {
  data: ProjectDraft
  onChange: (patch: Partial<ProjectDraft>) => void
}

export function StepCover({ data, onChange }: StepCoverProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Cover image</h2>
        <p className="text-sm text-muted-foreground mt-1">
          A strong cover image helps your project stand out in the feed. You can skip this and add one later.
        </p>
      </div>
      <ImageUploader
        value={data.coverUrl}
        onChange={(url) => onChange({ coverUrl: url })}
      />
    </div>
  )
}
