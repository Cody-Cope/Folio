import Link from 'next/link'
import { Suspense } from 'react'
import { Sparkles, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/search-bar'
import { UserMenu } from '@/components/user-menu'
import { getSessionUser, getProfileByUserId } from '@/lib/session'
import { getIncomingRequestCount } from '@/app/actions/projects'

export async function SiteHeader() {
  const user = await getSessionUser()
  const profile = user ? await getProfileByUserId(user.id) : null
  const requestCount = user ? await getIncomingRequestCount() : 0

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="hidden font-heading text-lg font-bold tracking-tight sm:inline">
            Collabr
          </span>
        </Link>

        <Suspense fallback={<div className="h-9 flex-1" />}>
          <SearchBar className="flex-1 max-w-md" />
        </Suspense>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <Button asChild size="sm" className="gap-1.5">
                <Link href="/new">
                  <Plus className="size-4" />
                  <span className="hidden sm:inline">Post idea</span>
                </Link>
              </Button>
              <Link
                href="/requests"
                className="relative hidden rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
              >
                Requests
                {requestCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {requestCount}
                  </span>
                )}
              </Link>
              {profile && (
                <UserMenu
                  displayName={profile.displayName}
                  username={profile.username}
                  avatarUrl={profile.avatarUrl}
                  email={user.email}
                />
              )}
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
