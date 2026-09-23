'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { UsersIcon } from 'lucide-react'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  image?: string
  author: {
    name: string
    avatar?: string
  }
  tags: string[]
  memberCount: number
  createdAt: string
}

export function ProjectCard({
  id,
  title,
  description,
  image,
  author,
  tags,
  memberCount,
  createdAt,
}: ProjectCardProps) {
  const initials = author.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link href={`/projects/${id}`} className="group block">
      <article className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/20 hover:shadow-lg hover:shadow-black/20">
        {/* Cover image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center">
                <span className="text-muted-foreground text-xl font-light">{title[0]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Author row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{author.name}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <UsersIcon className="h-3 w-3" />
              <span className="text-xs">{memberCount}</span>
            </div>
          </div>

          {/* Title & description */}
          <div>
            <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-1 group-hover:text-foreground transition-colors">
              {title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] px-2 py-0 h-5 font-normal rounded-full"
                >
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0 h-5 font-normal rounded-full"
                >
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
