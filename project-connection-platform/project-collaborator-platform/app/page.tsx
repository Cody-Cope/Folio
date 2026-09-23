import { Suspense } from 'react'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { CategoryFilter } from '@/components/category-filter'
import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { getFeed } from '@/app/actions/projects'
import { getSessionUser } from '@/lib/session'
import { CATEGORY_ALL } from '@/lib/constants'
import { Compass, Plus } from 'lucide-react'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q, category } = await searchParams
  const [projects, user] = await Promise.all([
    getFeed({ search: q, category }),
    getSessionUser(),
  ])

  const activeCategory = category ?? CATEGORY_ALL
  const isFiltering = Boolean(q || (category && category !== CATEGORY_ALL))

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {!isFiltering && (
          <section className="mb-8 flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <Compass className="size-3.5" />
              Discover projects
            </div>
            <h1 className="max-w-2xl font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Find your next project, or your next collaborator.
            </h1>
            <p className="max-w-xl text-muted-foreground text-pretty">
              Browse ideas from builders, makers, and creators. See something
              you love? Ask to join. Have your own idea? Post it and gather your
              team.
            </p>
            <Button asChild size="lg" className="gap-1.5">
              <Link href={user ? '/new' : '/sign-up'}>
                <Plus className="size-4" />
                {user ? 'Post your idea' : 'Get started'}
              </Link>
            </Button>
          </section>
        )}

        <div className="mb-6">
          <Suspense fallback={<div className="h-9" />}>
            <CategoryFilter active={activeCategory} />
          </Suspense>
        </div>

        {q && (
          <p className="mb-4 text-sm text-muted-foreground">
            {projects.length} result{projects.length === 1 ? '' : 's'} for{' '}
            <span className="font-medium text-foreground">
              &ldquo;{q}&rdquo;
            </span>
          </p>
        )}

        {projects.length === 0 ? (
          <EmptyState isFiltering={isFiltering} loggedIn={Boolean(user)} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function EmptyState({
  isFiltering,
  loggedIn,
}: {
  isFiltering: boolean
  loggedIn: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Compass className="size-6" />
      </div>
      <h2 className="font-heading text-xl font-semibold">
        {isFiltering ? 'No projects match your search' : 'No projects yet'}
      </h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">
        {isFiltering
          ? 'Try a different category or search term.'
          : 'Be the first to share a project idea and start finding collaborators.'}
      </p>
      {!isFiltering && (
        <Button asChild className="mt-5 gap-1.5">
          <Link href={loggedIn ? '/new' : '/sign-up'}>
            <Plus className="size-4" />
            {loggedIn ? 'Post the first idea' : 'Get started'}
          </Link>
        </Button>
      )}
    </div>
  )
}
