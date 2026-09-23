'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { AvatarUploader } from '@/components/profile/avatar-uploader'
import { CheckIcon, Loader2Icon, XIcon } from 'lucide-react'

// ---------------------------------------------------------------------------
// Mock user — replace with real session data once auth is wired up
// ---------------------------------------------------------------------------
const INITIAL_PROFILE = {
  name: 'Alex Rivera',
  email: 'alex@example.com',
  bio: 'Full-stack developer building at the intersection of AI and productivity.',
  location: 'San Francisco, CA',
  website: 'https://alexrivera.dev',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML'],
  avatar: '',
}

// ---------------------------------------------------------------------------

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

function useSaveStatus() {
  const [status, setStatus] = useState<SaveStatus>('idle')

  async function save(fn: () => Promise<void>) {
    setStatus('saving')
    try {
      await fn()
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return { status, save }
}

function SaveButton({ status }: { status: SaveStatus }) {
  return (
    <Button type="submit" size="sm" disabled={status === 'saving'} className="min-w-[100px]">
      {status === 'saving' ? (
        <><Loader2Icon className="h-3.5 w-3.5 animate-spin mr-1.5" /> Saving…</>
      ) : status === 'saved' ? (
        <><CheckIcon className="h-3.5 w-3.5 mr-1.5" /> Saved</>
      ) : status === 'error' ? (
        'Try again'
      ) : (
        'Save changes'
      )}
    </Button>
  )
}

// ---------------------------------------------------------------------------
// Profile tab
// ---------------------------------------------------------------------------
function ProfileTab() {
  const [form, setForm] = useState(INITIAL_PROFILE)
  const [skillInput, setSkillInput] = useState('')
  const { status, save } = useSaveStatus()

  function addSkill(raw: string) {
    const skill = raw.trim()
    if (skill && !form.skills.includes(skill) && form.skills.length < 10) {
      setForm((f) => ({ ...f, skills: [...f.skills, skill] }))
    }
    setSkillInput('')
  }

  function removeSkill(skill: string) {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await save(async () => {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-lg">
      {/* Avatar */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Profile photo</Label>
        <AvatarUploader
          name={form.name}
          currentUrl={form.avatar}
          onUpload={(url) => setForm((f) => ({ ...f, avatar: url }))}
        />
      </div>

      <Separator />

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Display name</Label>
        <Input
          id="name"
          value={form.name}
          maxLength={60}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={form.bio}
          maxLength={200}
          rows={3}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">{form.bio.length}/200</p>
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={form.location}
          maxLength={80}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
        />
      </div>

      {/* Website */}
      <div className="space-y-1.5">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={form.website}
          onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
        />
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <Input
          id="skills"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              addSkill(skillInput)
            }
          }}
          disabled={form.skills.length >= 10}
        />
        <p className="text-xs text-muted-foreground">
          Press Enter or comma to add · {form.skills.length}/10
        </p>
        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {form.skills.map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full text-xs font-normal"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="ml-0.5 rounded-full hover:text-destructive transition-colors"
                  aria-label={`Remove ${s}`}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <SaveButton status={status} />
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Account tab
// ---------------------------------------------------------------------------
function AccountTab() {
  const [email, setEmail] = useState(INITIAL_PROFILE.email)
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const { status: emailStatus, save: saveEmail } = useSaveStatus()
  const { status: pwStatus, save: savePw } = useSaveStatus()
  const [pwError, setPwError] = useState<string | null>(null)

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    await saveEmail(async () => {
      const res = await fetch('/api/user/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
    })
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPwError(null)
    if (passwords.next.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }
    if (passwords.next !== passwords.confirm) {
      setPwError('Passwords do not match.')
      return
    }
    await savePw(async () => {
      const res = await fetch('/api/user/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.next }),
      })
      if (!res.ok) throw new Error()
      setPasswords({ current: '', next: '', confirm: '' })
    })
  }

  return (
    <div className="space-y-10 max-w-lg">
      {/* Email */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Email address</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            We'll send account notifications here.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <SaveButton status={emailStatus} />
        </div>
      </form>

      <Separator />

      {/* Password */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Change password</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Use a strong password you don&apos;t use elsewhere.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="current-pw">Current password</Label>
          <Input
            id="current-pw"
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            autoComplete="current-password"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-pw">New password</Label>
          <Input
            id="new-pw"
            type="password"
            value={passwords.next}
            onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
            autoComplete="new-password"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm-pw">Confirm new password</Label>
          <Input
            id="confirm-pw"
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            autoComplete="new-password"
            required
          />
        </div>
        {pwError && <p className="text-xs text-destructive">{pwError}</p>}
        <div className="flex justify-end">
          <SaveButton status={pwStatus} />
        </div>
      </form>

      <Separator />

      {/* Danger zone */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Deleting your account is permanent and cannot be undone.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
              // TODO: call DELETE /api/user/account when auth is wired
            }
          }}
        >
          Delete account
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Root export
// ---------------------------------------------------------------------------
export function SettingsForm() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile and account preferences.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-auto gap-0 mb-8">
          <TabsTrigger
            value="profile"
            className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 text-sm font-medium text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 text-sm font-medium text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent"
          >
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="account">
          <AccountTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
