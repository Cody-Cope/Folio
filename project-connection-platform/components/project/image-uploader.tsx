'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string | undefined) => void
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File) => {
    setError(null)
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }, [upload])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }, [upload])

  const handleRemove = useCallback(() => {
    onChange(undefined)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [onChange])

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        aria-label="Upload cover image"
        onChange={handleChange}
      />

      {value ? (
        <div className="relative w-full overflow-hidden rounded-xl border border-border" style={{ aspectRatio: '16/9' }}>
          <Image src={value} alt="Project cover" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              aria-label="Replace image"
            >
              <Upload className="h-4 w-4 mr-1.5" />
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          disabled={isUploading}
          aria-label="Upload cover image dropzone"
          className={cn(
            'w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors cursor-pointer',
            'text-muted-foreground hover:text-foreground hover:border-foreground/40',
            isDragging ? 'border-primary bg-primary/5 text-primary' : 'border-border',
            isUploading && 'pointer-events-none opacity-60',
          )}
          style={{ aspectRatio: '16/9' }}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-sm font-medium">Uploading…</span>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <ImageIcon className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {isDragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-xs mt-1">JPEG, PNG, WebP or GIF &mdash; max 5MB</p>
              </div>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-xs text-destructive" role="alert">{error}</p>
      )}
    </div>
  )
}
