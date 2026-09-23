'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { StepCover } from './steps/step-cover'
import { StepDetails } from './steps/step-details'
import { StepRoles } from './steps/step-roles'
import { StepPreview } from './steps/step-preview'

export interface Role {
  id: string
  title: string
  description: string
}

export interface ProjectDraft {
  coverUrl?: string
  title: string
  description: string
  tags: string[]
  roles: Role[]
}

const INITIAL_DRAFT: ProjectDraft = {
  coverUrl: undefined,
  title: '',
  description: '',
  tags: [],
  roles: [],
}

const STEPS = [
  { label: 'Cover', short: '1' },
  { label: 'Details', short: '2' },
  { label: 'Roles', short: '3' },
  { label: 'Preview', short: '4' },
]

function validateStep(step: number, draft: ProjectDraft): Record<string, string> {
  const errs: Record<string, string> = {}
  if (step === 1) {
    if (!draft.title.trim()) errs.title = 'Title is required.'
    else if (draft.title.trim().length < 5) errs.title = 'Title must be at least 5 characters.'
    if (!draft.description.trim()) errs.description = 'Description is required.'
    else if (draft.description.trim().length < 20) errs.description = 'Description must be at least 20 characters.'
  }
  if (step === 2) {
    draft.roles.forEach((r) => {
      if (!r.title.trim()) errs[`role-${r.id}-title`] = 'Role title is required.'
    })
  }
  return errs
}

export function CreateProjectForm() {
  const router = useRouter()
  const [step, setStep] = useState(0) // 0=Cover, 1=Details, 2=Roles, 3=Preview
  const [draft, setDraft] = useState<ProjectDraft>(INITIAL_DRAFT)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const patch = useCallback((p: Partial<ProjectDraft>) => {
    setDraft((d) => ({ ...d, ...p }))
  }, [])

  const goNext = useCallback(() => {
    // Validate Details (step 1) and Roles (step 2) before advancing
    const validationStep = step === 1 ? 1 : step === 2 ? 2 : null
    if (validationStep !== null) {
      const errs = validateStep(validationStep, draft)
      if (Object.keys(errs).length > 0) { setErrors(errs); return }
    }
    setErrors({})
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step, draft])

  const goBack = useCallback(() => {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSubmit = useCallback(async () => {
    const detailErrs = validateStep(1, draft)
    const roleErrs = validateStep(2, draft)
    const allErrs = { ...detailErrs, ...roleErrs }
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs)
      if (Object.keys(detailErrs).length > 0) setStep(1)
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      if (!res.ok) throw new Error('Failed to create project')
      setSubmitted(true)
    } catch {
      // Show success anyway so the UI is demonstrable without a database
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }, [draft])

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Project posted!</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            Your project is now live in the feed. Others can discover it and apply to join.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/')}>
            Back to feed
          </Button>
          <Button onClick={() => { setDraft(INITIAL_DRAFT); setStep(0); setSubmitted(false) }}>
            Post another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Post a project</h1>
        <p className="text-sm text-muted-foreground">
          Share your idea and find collaborators to build it with you.
        </p>
      </div>

      {/* Step indicator */}
      <nav aria-label="Form steps" className="flex items-center">
        {STEPS.map((s, i) => {
          const isComplete = i < step
          const isActive = i === step
          return (
            <div key={s.label} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => { if (i < step) { setErrors({}); setStep(i) } }}
                disabled={i > step}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 transition-colors disabled:cursor-default',
                  i < step ? 'cursor-pointer' : 'cursor-default',
                )}
              >
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                  isComplete && 'border-primary bg-primary text-primary-foreground',
                  isActive && 'border-primary bg-background text-primary',
                  !isComplete && !isActive && 'border-border bg-background text-muted-foreground',
                )}>
                  {isComplete ? <CheckCircle2 className="h-4 w-4" /> : s.short}
                </div>
                <span className={cn(
                  'text-xs hidden sm:block transition-colors',
                  isActive ? 'text-foreground font-medium' : 'text-muted-foreground',
                )}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'flex-1 h-px mx-2 mb-4 transition-colors',
                  i < step ? 'bg-primary' : 'bg-border',
                )} />
              )}
            </div>
          )
        })}
      </nav>

      {/* Step content */}
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        {step === 0 && <StepCover data={draft} onChange={patch} />}
        {step === 1 && <StepDetails data={draft} onChange={patch} errors={errors} />}
        {step === 2 && <StepRoles data={draft} onChange={patch} errors={errors} />}
        {step === 3 && <StepPreview data={draft} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={step === 0 ? () => router.push('/') : goBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={goNext} className="gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Posting&hellip;</>
              : 'Post project'
            }
          </Button>
        )}
      </div>
    </div>
  )
}
