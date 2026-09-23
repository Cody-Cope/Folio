'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectCard } from '@/components/project/project-card'
import {
  CalendarIcon,
  LinkIcon,
  MapPinIcon,
  UsersIcon,
  BriefcaseIcon,
  Settings2Icon,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Mock data — replace with real fetched data once auth + DB are wired up
// ---------------------------------------------------------------------------
const MOCK_USER = {
  id: 'user-1',
  name: 'Alex Rivera',
  avatar: '',
  bio: 'Full-stack developer building at the intersection of AI and productivity. Open to collaborating on ambitious projects.',
  location: 'San Francisco, CA',
  website: 'https://alexrivera.dev',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML'],
  joinedAt: new Date('2024-01-15'),
  stats: { projects: 4, joined: 7, requests: 12 },
  isOwnProfile: true,
}

const MOCK_PROJECTS = [
  {
    id: 'proj-1',
    title: 'AI Recipe Planner',
    description: 'Smart meal planning using AI to suggest recipes from your pantry ingredients.',
    tags: ['AI', 'Food', 'React'],
    memberCount: 3,
    createdAt: '2024-11-01',
    author: { name: 'Alex Rivera', avatar: '' },
  },
  {
    id: 'proj-2',
    title: 'Open Source Habit Tracker',
    description: 'A minimal, privacy-first habit tracking app with no account required.',
    tags: ['Open Source', 'Productivity', 'TypeScript'],
    memberCount: 5,
    createdAt: '2024-10-15',
    author: { name: 'Alex Rivera', avatar: '' },
  },
]

const MOCK_JOINED = [
  {
    id: 'proj-3',
    title: 'Dev Portfolio Builder',
    description: 'Drag-and-drop portfolio builder specifically designed for software developers.',
    tags: ['Design', 'React', 'SaaS'],
    memberCount: 4,
    createdAt: '2024-09-20',
    author: { name: 'Jordan Kim', avatar: '' },
  },
]

// ---------------------------------------------------------------------------

function formatJoinDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UserProfile() {
  const user = MOCK_USER

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar className="h-24 w-24 ring-2 ring-border">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-2xl font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            </div>
            {user.isOwnProfile ? (
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings" className="flex items-center gap-1.5">
                  <Settings2Icon className="h-3.5 w-3.5" />
                  Edit profile
                </Link>
              </Button>
            ) : (
              <Button size="sm">Connect</Button>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{user.bio}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {user.location && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPinIcon className="h-3.5 w-3.5" />
                {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <LinkIcon className="h-3.5 w-3.5" />
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarIcon className="h-3.5 w-3.5" />
              Joined {formatJoinDate(user.joinedAt)}
            </span>
          </div>

          {/* Skills */}
          {user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-xs font-normal rounded-full px-2.5"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Stats bar                                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="mt-8 grid grid-cols-3 divide-x divide-border rounded-xl border border-border">
        <div className="flex flex-col items-center gap-0.5 py-4">
          <span className="text-xl font-bold text-foreground">{user.stats.projects}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <BriefcaseIcon className="h-3 w-3" /> Projects posted
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5 py-4">
          <span className="text-xl font-bold text-foreground">{user.stats.joined}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <UsersIcon className="h-3 w-3" /> Projects joined
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5 py-4">
          <span className="text-xl font-bold text-foreground">{user.stats.requests}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <LinkIcon className="h-3 w-3" /> Connections
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tabs                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="mt-8">
        <Tabs defaultValue="posted">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-auto gap-0">
            <TabsTrigger
              value="posted"
              className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 text-sm font-medium text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent"
            >
              Posted ({user.stats.projects})
            </TabsTrigger>
            <TabsTrigger
              value="joined"
              className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 text-sm font-medium text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent"
            >
              Joined ({MOCK_JOINED.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posted" className="mt-6">
            {MOCK_PROJECTS.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <BriefcaseIcon className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No projects posted yet.</p>
                <Button size="sm" asChild>
                  <Link href="/projects/create">Post your first project</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {MOCK_PROJECTS.map((p) => (
                  <ProjectCard key={p.id} {...p} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="joined" className="mt-6">
            {MOCK_JOINED.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <UsersIcon className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No projects joined yet.</p>
                <Button size="sm" asChild>
                  <Link href="/">Browse projects</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {MOCK_JOINED.map((p) => (
                  <ProjectCard key={p.id} {...p} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
