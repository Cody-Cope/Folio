/**
 * Build a browser-usable src for a stored blob pathname. Cover images and
 * avatars are stored as private-blob pathnames and served through /api/file.
 * Returns null for empty input so callers can fall back to a placeholder.
 */
export function blobSrc(pathname?: string | null): string | null {
  if (!pathname) return null
  // Already an absolute URL (e.g. an external avatar) — use as-is.
  if (/^https?:\/\//.test(pathname)) return pathname
  return `/api/file?pathname=${encodeURIComponent(pathname)}`
}
