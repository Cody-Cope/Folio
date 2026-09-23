'use client'

import { useCallback, useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ProjectDraft } from '@/components/project/create-project-form'

const MAX_TAGS = 8

interface StepDetailsProps {
  data: ProjectDraft
  onChange: (patch: Partial<ProjectDraft>) => void
  errors: Record<string, string>
}

export function StepDetails({ data, onChange, errors }: StepDetailsProps) {
  const [tagInput, setTagInput] = useState('')

  const addTag = useCallback((raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, '-')
    if (!tag || data.tags.includes(tag) || data.tags.length >= MAX_TAGS) return
    onChange({ tags: [...data.tags, tag] })
    setTagInput('')
  }, [data.tags, onChange])

  const removeTag = useCallback((tag: string) => {
    onChange({ tags: data.tags.filter((t) => t !== tag) })
  }, [data.tags, onChange])

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === 'Backspace' && !tagInput && data.tags.length > 0) {
      removeTag(data.tags[data.tags.length - 1])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Project details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell people what you&apos;re building and why it matters.
        </p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label htmlFor="project-title" className="text-sm font-medium text-foreground">
            Title <span className="text-destructive">*</span>
          </label>
          <Input
            id="project-title"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            maxLength={80}
            className={cn(errors.title && 'border-destructive')}
          />
          <div className="flex justify-between">
            {errors.title
              ? <p className="text-xs text-destructive">{errors.title}</p>
              : <span />
            }
            <span className="text-xs text-muted-foreground ml-auto">{data.title.length}/80</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label htmlFor="project-desc" className="text-sm font-medium text-foreground">
            Description <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="project-desc"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            maxLength={1000}
            rows={5}
            className={cn('resize-none', errors.description && 'border-destructive')}
          />
          <div className="flex justify-between">
            {errors.description
              ? <p className="text-xs text-destructive">{errors.description}</p>
              : <span />
            }
            <span className="text-xs text-muted-foreground ml-auto">{data.description.length}/1000</span>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label htmlFor="project-tags" className="text-sm font-medium text-foreground">
            Tags
          </label>
          <div
            className={cn(
              'flex flex-wrap gap-2 min-h-[42px] rounded-md border border-input bg-transparent px-3 py-2 text-sm',
              'focus-within:outline-none focus-within:ring-1 focus-within:ring-ring',
            )}
          >
            {data.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 pl-2 pr-1 py-0.5">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  className="rounded-full hover:text-foreground text-muted-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {data.tags.length < MAX_TAGS && (
              <input
                id="project-tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => addTag(tagInput)}
                className="flex-1 min-w-[140px] bg-transparent outline-none text-sm"
                aria-label="Add a tag"
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{data.tags.length}/{MAX_TAGS} tags</p>
        </div>
      </div>
    </div>
  )
}
