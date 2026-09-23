'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORIES, CATEGORY_ALL } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function CategoryFilter({ active }: { active: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function select(category: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (category === CATEGORY_ALL) params.delete('category')
    else params.set('category', category)
    router.push(`/?${params.toString()}`)
  }

  const options = [CATEGORY_ALL, ...CATEGORIES]

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map((category) => {
        const isActive =
          active === category || (category === CATEGORY_ALL && !active)
        return (
          <button
            key={category}
            type="button"
            onClick={() => select(category)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
