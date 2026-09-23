import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <span className="font-heading text-2xl font-bold tracking-tight">
            Collabr
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="font-heading text-2xl font-bold text-card-foreground">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </main>
  )
}
