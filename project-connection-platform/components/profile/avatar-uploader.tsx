'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CameraIcon, Loader2Icon, XIcon } from 'lucide-react'

interface AvatarUploaderProps {
  name: string
  currentUrl?: string
  onUpload: (url: string) => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function AvatarUploader({ name, currentUrl, onUpload }: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('Image must be under 3 MB.')
      return
    }

    setError(null)
    setUploading(true)

    // Local preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      onUpload(url)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-5">
      {/* Avatar preview */}
      <div className="relative">
        <Avatar className="h-20 w-20 ring-2 ring-border">
          <AvatarImage src={preview ?? undefined} alt={name} />
          <AvatarFallback className="text-xl font-semibold">{getInitials(name)}</AvatarFallback>
        </Avatar>

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <Loader2Icon className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5"
          >
            <CameraIcon className="h-3.5 w-3.5" />
            {preview ? 'Change photo' : 'Upload photo'}
          </Button>

          {preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={uploading}
              onClick={() => {
                setPreview(null)
                onUpload('')
              }}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <XIcon className="h-3.5 w-3.5" />
              Remove
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">JPG, PNG or WebP · max 3 MB</p>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
