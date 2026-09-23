import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/user-avatar'
import { blobSrc } from '@/lib/blob'
import type { FeedProject } from '@/app/actions/projects'
import { Users } from 'lucide-react'

export function ProjectCard({ project }: { project: FeedProject }) {
  const cover = blobSrc(project.coverImageUrl)

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover || '/placeholder.svg'}
            alt={`${project.title} cover`}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground hover:bg-background/90">
          {project.category}
        </Badge>
        {project.status === 'closed' && (
          <Badge className="absolute right-3 top-3 bg-foreground/85 text-background hover:bg-foreground/85">
            Closed
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading text-lg font-semibold leading-tight text-card-foreground text-balance">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground text-pretty">
          {project.summary}
        </p>

        {project.lookingFor && (
          <div className="mt-1 flex items-start gap-1.5 text-xs text-primary">
            <Users className="mt-0.5 size-3.5 shrink-0" />
            <span className="line-clamp-1">Looking for {project.lookingFor}</span>
          </div>
        )}

        {project.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 pt-3">
          <UserAvatar
            name={project.authorName}
            avatarUrl={project.authorAvatarUrl}
            className="size-6"
          />
          <span className="text-xs text-muted-foreground">
            {project.authorName}
          </span>
        </div>
      </div>
    </Link>
  )
}
