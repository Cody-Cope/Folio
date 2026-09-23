'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { JoinRequestDialog } from '@/components/project/join-request-dialog'
import type { Project } from '@/lib/types'
import { ArrowLeftIcon, UsersIcon, CalendarIcon, BriefcaseIcon } from 'lucide-react'

// ---------------------------------------------------------------------------
// Mock data — swap out with real API fetch once the database is wired up
// ---------------------------------------------------------------------------
const MOCK_PROJECT: Project = {
  id: 'mock-1',
  title: 'AI-powered recipe planner',
  description:
    "A smart meal planning app that uses AI to suggest recipes based on what ingredients you already have at home. The goal is to reduce food waste and make healthy eating effortless for busy people.\n\nWe're building a mobile-first web app with a conversational interface — you tell it what's in your fridge and it generates a full week of personalised recipes with shopping lists.",
  coverUrl: undefined,
  authorId: 'user-1',
  author: {
    id: 'user-1',
    email: 'alex@example.com',
    name: 'Alex Rivera',
    bio: 'Full-stack developer passionate about food tech.',
    createdAt: new Date('2024-11-01'),
  },
  tags: ['ai', 'food', 'mobile', 'react'],
  roles: [
    {
      id: 'role-1',
      title: 'Frontend Developer',
      description: 'Build the React/Next.js UI, own the mobile-first responsive experience.',
    },
    {
      id: 'role-2',
      title: 'UI/UX Designer',
      description: 'Design the conversational interface and overall visual language.',
    },
    {
      id: 'role-3',
      title: 'ML Engineer',
      description: 'Fine-tune the recipe recommendation model and API integration.',
      filled: true,
    },
  ],
  memberCount: 2,
  members: [
    {
      id: 'user-1',
      email: 'alex@example.com',
      name: 'Alex Rivera',
      createdAt: new Date('2024-11-01'),
    },
    {
      id: 'user-2',
      email: 'sam@example.com',
      name: 'Sam Chen',
      createdAt: new Date('2024-12-15'),
    },
  ],
  createdAt: new Date('2025-01-10'),
  updatedAt: new Date('2025-07-20'),
}

// ---------------------------------------------------------------------------

interface ProjectDetailProps {
  projectId: string
  project?: Project
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ProjectDetail({ projectId, project: propProject }: ProjectDetailProps) {
  const project = propProject ?? MOCK_PROJECT
  const [dialogOpen, setDialogOpen] = useState(false)

  const coverSrc = project.coverUrl ?? (project as { image?: string }).image
  const openRoles = project.roles?.filter((r) => !r.filled) ?? []
  const filledRoles = project.roles?.filter((r) => r.filled) ?? []

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to feed
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* ----------------------------------------------------------------
              Left column — main content
          ---------------------------------------------------------------- */}
          <div className="space-y-8">
            {/* Cover image */}
            {coverSrc ? (
              <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl border border-border bg-muted">
                <Image src={coverSrc} alt={project.title} fill className="object-cover" />
              </div>
            ) : (
              <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center">
                <span className="text-5xl font-semibold text-muted-foreground/30 select-none">
                  {project.title[0]}
                </span>
              </div>
            )}

            {/* Title + tags */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-balance">{project.title}</h1>
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                About
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                {project.description}
              </div>
            </div>

            {/* Roles */}
            {project.roles && project.roles.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Open roles
                  </h2>

                  {openRoles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      All roles are currently filled.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {openRoles.map((role) => (
                        <div
                          key={role.id}
                          className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <BriefcaseIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{role.title}</p>
                            {role.description && (
                              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                                {role.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {filledRoles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Filled</p>
                      <div className="space-y-2">
                        {filledRoles.map((role) => (
                          <div
                            key={role.id}
                            className="flex items-center gap-3 rounded-lg border border-border bg-card/50 px-4 py-3 opacity-60"
                          >
                            <BriefcaseIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <p className="text-sm text-muted-foreground line-through">
                              {role.title}
                            </p>
                            <Badge
                              variant="secondary"
                              className="ml-auto text-[10px] rounded-full shrink-0"
                            >
                              Filled
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ----------------------------------------------------------------
              Right column — sidebar
          ---------------------------------------------------------------- */}
          <aside className="space-y-6">
            {/* CTA card */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Interested in joining?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Send a request to the project owner and introduce yourself.
                </p>
              </div>
              <Button className="w-full" onClick={() => setDialogOpen(true)}>
                Request to join
              </Button>
            </div>

            {/* Meta */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <p className="text-sm font-semibold">Details</p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5 text-muted-foreground">
                  <UsersIcon className="h-4 w-4 shrink-0" />
                  <span>
                    <span className="font-medium text-foreground">{project.memberCount}</span>{' '}
                    member{project.memberCount !== 1 ? 's' : ''}
                  </span>
                </li>
                <li className="flex items-center gap-2.5 text-muted-foreground">
                  <BriefcaseIcon className="h-4 w-4 shrink-0" />
                  <span>
                    <span className="font-medium text-foreground">{openRoles.length}</span> open
                    role{openRoles.length !== 1 ? 's' : ''}
                  </span>
                </li>
                <li className="flex items-center gap-2.5 text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 shrink-0" />
                  <span>Posted {formatDate(project.createdAt)}</span>
                </li>
              </ul>
            </div>

            {/* Author */}
            {project.author && (
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <p className="text-sm font-semibold">Project owner</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={project.author.avatar} alt={project.author.name} />
                    <AvatarFallback>{initials(project.author.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{project.author.name}</p>
                    {project.author.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {project.author.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Members */}
            {project.members && project.members.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <p className="text-sm font-semibold">Team</p>
                <ul className="space-y-2.5">
                  {project.members.map((member) => (
                    <li key={member.id} className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-[10px]">
                          {initials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground truncate">{member.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>

      <JoinRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectTitle={project.title}
        projectId={project.id}
        roles={project.roles ?? []}
      />
    </>
  )
}
