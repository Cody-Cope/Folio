import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { blobSrc } from '@/lib/blob'
import { cn } from '@/lib/utils'

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function UserAvatar({
  name,
  avatarUrl,
  className,
}: {
  name: string
  avatarUrl?: string | null
  className?: string
}) {
  const src = blobSrc(avatarUrl)
  return (
    <Avatar className={cn('size-8', className)}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback className="bg-accent text-accent-foreground text-xs font-medium">
        {initials(name || '?')}
      </AvatarFallback>
    </Avatar>
  )
}
