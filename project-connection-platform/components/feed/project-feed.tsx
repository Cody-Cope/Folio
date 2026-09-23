'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/project/project-card'
import { SearchIcon, XIcon, SlidersHorizontalIcon } from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'Open-source AI code review tool',
    description: 'Building a GitHub bot that reviews PRs using LLMs and suggests improvements with detailed explanations.',
    author: { name: 'Alex Chen', avatar: '' },
    tags: ['AI', 'Open Source', 'Dev Tools'],
    memberCount: 4,
    createdAt: '2026-07-20',
  },
  {
    id: '2',
    title: 'Community recipe sharing platform',
    description: 'A platform where home cooks can share recipes, scale ingredients, and discover seasonal meals from their community.',
    author: { name: 'Maria Santos', avatar: '' },
    tags: ['Web App', 'Community', 'Food'],
    memberCount: 2,
    createdAt: '2026-07-22',
  },
  {
    id: '3',
    title: 'Indie game: pixel dungeon roguelike',
    description: 'Procedurally generated dungeon crawler with hand-crafted pixel art, published on Steam and itch.io.',
    author: { name: 'Jordan Kim', avatar: '' },
    tags: ['Game Dev', 'Pixel Art', 'Indie'],
    memberCount: 3,
    createdAt: '2026-07-18',
  },
  {
    id: '4',
    title: 'Decentralised task marketplace',
    description: 'Smart-contract powered gig platform that connects freelancers with clients and settles payments on-chain.',
    author: { name: 'Priya Nair', avatar: '' },
    tags: ['Web3', 'Solidity', 'Marketplace'],
    memberCount: 5,
    createdAt: '2026-07-25',
  },
  {
    id: '5',
    title: 'Local business discovery app',
    description: 'Help people find hidden-gem local businesses through curated neighbourhood maps and community reviews.',
    author: { name: 'Tom Walker', avatar: '' },
    tags: ['Mobile', 'Community', 'Maps'],
    memberCount: 2,
    createdAt: '2026-07-15',
  },
  {
    id: '6',
    title: 'Real-time collaborative whiteboard',
    description: 'An infinite canvas for remote teams with multiplayer cursors, sticky notes, shapes, and voice chat built in.',
    author: { name: 'Ines Müller', avatar: '' },
    tags: ['Real-time', 'Collaboration', 'SaaS'],
    memberCount: 6,
    createdAt: '2026-07-28',
  },
  {
    id: '7',
    title: 'Sustainable fashion tracker',
    description: 'Track the environmental impact of your wardrobe, swap clothes with others, and discover ethical brands.',
    author: { name: 'Yuki Tanaka', avatar: '' },
    tags: ['Sustainability', 'Fashion', 'Mobile'],
    memberCount: 3,
    createdAt: '2026-07-10',
  },
  {
    id: '8',
    title: 'Language learning through stories',
    description: 'Learn a new language by reading short interactive stories, with inline vocabulary hints and spaced repetition.',
    author: { name: 'Carlos Reyes', avatar: '' },
    tags: ['EdTech', 'Language', 'AI'],
    memberCount: 4,
    createdAt: '2026-07-30',
  },
  {
    id: '9',
    title: 'Mental health journaling app',
    description: 'Private guided journaling with mood tracking, CBT prompts, and gentle weekly insights — no data ever sold.',
    author: { name: 'Amara Osei', avatar: '' },
    tags: ['Health', 'Mobile', 'Privacy'],
    memberCount: 2,
    createdAt: '2026-08-01',
  },
]

const ALL_TAGS = Array.from(new Set(MOCK_PROJECTS.flatMap((p) => p.tags))).sort()

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'popular', label: 'Most Members' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectFeed() {
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [sort, setSort] = useState<SortValue>('newest')

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearAll = () => {
    setQuery('')
    setActiveTags([])
    setSort('newest')
  }

  const filtered = useMemo(() => {
    let results = MOCK_PROJECTS

    if (query.trim()) {
      const q = query.toLowerCase()
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (activeTags.length > 0) {
      results = results.filter((p) =>
        activeTags.every((t) => p.tags.includes(t))
      )
    }

    if (sort === 'newest') {
      results = [...results].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } else if (sort === 'oldest') {
      results = [...results].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    } else if (sort === 'popular') {
      results = [...results].sort((a, b) => b.memberCount - a.memberCount)
    }

    return results
  }, [query, activeTags, sort])

  const hasFilters = query.trim() || activeTags.length > 0 || sort !== 'newest'

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Discover Projects</h1>
        <p className="text-sm text-muted-foreground">Find projects looking for collaborators.</p>
      </div>

      {/* Search + Sort row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-muted/40 border-border focus-visible:ring-ring"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 shrink-0">
          <SlidersHorizontalIcon className="h-3.5 w-3.5 text-muted-foreground" />
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sort === opt.value
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap items-center gap-2">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              activeTags.includes(tag)
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground'
            }`}
          >
            {tag}
          </button>
        ))}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <XIcon className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'project' : 'projects'} found
        {activeTags.length > 0 && (
          <span> in {activeTags.join(', ')}</span>
        )}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No projects match your filters.</p>
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
