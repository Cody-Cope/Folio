'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusIcon, UserIcon, CompassIcon } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            buildon
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <CompassIcon className="h-4 w-4" />
              <span className="text-sm">Discover</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects/create" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <PlusIcon className="h-4 w-4" />
              <span className="text-sm">Post Project</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <UserIcon className="h-4 w-4" />
              <span className="text-sm">Profile</span>
            </Link>
          </Button>
          <Button size="sm" asChild className="ml-2">
            <Link href="/auth">Sign in</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
