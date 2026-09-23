export const CATEGORIES = [
  'Web App',
  'Mobile App',
  'Game',
  'AI / ML',
  'Hardware',
  'Design',
  'Music',
  'Film / Video',
  'Writing',
  'Open Source',
  'Startup',
  'Research',
  'Community',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_ALL = 'All'
