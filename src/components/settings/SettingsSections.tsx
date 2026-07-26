import { useRef, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Checkbox } from "../ui/checkbox"
import { SelectableChip } from "../ui/selectable-chip"
import { FilterDropdown, DataTablePagination, TableActionsCell, TableActionsHead, TableNavCell, TableSelectCell, TableSelectHead } from "../data-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, tableHeaderRowClassName } from "../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Modal } from "../ui/modal"
import { ConfirmModal } from "../ui/confirm-modal"
import { PersonAvatar } from "../events/detail/PersonAvatar"
import { elevatedCardSurfaceClassName } from "../events/detail/detail-primitives"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { SettingsSearchIcon, SettingsUploadButton, settingsTableCardClassName } from "./settings-primitives"
import { toast } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"
import { tableSurfaceClassName } from "../../lib/table-styles"
import {
  InviteMemberModal,
  EditMemberModal,
  LogDetailsModal,
  PayoutDetailsModal,
  AddBankModal,
} from "./SettingsModals"
import {
  AUDIT_LOGS,
  BANK_ACCOUNTS,
  CAUSE_AREAS,
  NOTIFICATION_ALERTS,
  PAYOUT_HISTORY,
  PLAN_FEATURES,
  TEAM_MEMBERS,
  type AuditLog,
  type BankAccount,
  type PayoutRow,
  type TeamMember,
} from "../../pages/dashboard/settings-data"

export function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-display text-2xl font-semibold leading-8 tracking-[-0.2px] text-text-events-strong">{title}</h1>
      <p className="text-sm leading-[22px] text-text-table-header">{subtitle}</p>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium leading-[22px] text-text-events-strong">{children}</span>
}

function ToggleRow({
  label,
  helper,
  checked,
  onChange,
}: {
  label: string
  helper: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium leading-[22px] text-text-events-strong">{label}</span>
        <span className="text-sm leading-[22px] text-text-table-header">{helper}</span>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function CheckboxRow({
  label,
  helper,
  checked,
  onChange,
}: {
  label: string
  helper: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <Checkbox size="sm" checked={checked} onCheckedChange={onChange} className="mt-0.5" />
      <div className="flex flex-col">
        <span className="text-sm font-medium leading-[22px] text-text-events-strong">{label}</span>
        <span className="text-sm leading-[22px] text-text-table-header">{helper}</span>
      </div>
    </label>
  )
}

const FORM_WIDTH = "w-full"

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

/** Wires a hidden file input to an upload trigger and returns a preview URL. */
function useImageUpload(maxLabel: string) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const open = () => inputRef.current?.click()
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({ variant: "destructive", title: "Unsupported file", description: "Please choose a JPG, PNG or GIF image." })
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast({ variant: "destructive", title: "File too large", description: `Image must be under ${maxLabel}.` })
      return
    }
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    toast({ variant: "success", title: "Image uploaded", description: file.name })
  }

  const input = (
    <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/gif" className="sr-only" onChange={onChange} />
  )
  return { preview, open, input }
}

// ─────────────────────────────────────────────────────────── Profile
export function ProfileSection() {
  const [first, setFirst] = useState("Daniel")
  const [last, setLast] = useState("Osonuga")
  const [phone, setPhone] = useState("901 234 5678")
  const [email, setEmail] = useState("")
  const [emailEditable, setEmailEditable] = useState(false)
  const photo = useImageUpload("2MB")

  return (
    <div className={cn("flex flex-col gap-6", FORM_WIDTH)}>
      <SectionHeader title="Profile" subtitle="Manage your personal information" />
      <div className="flex items-center gap-4">
        {photo.preview ? (
          <img src={photo.preview} alt="Profile" className="size-16 shrink-0 rounded-full object-cover" />
        ) : (
          <PersonAvatar name="Daniel Osonuga" tone="orange" size={64} />
        )}
        <div className="flex flex-col items-start gap-1.5">
          <SettingsUploadButton onClick={photo.open}>Upload photo</SettingsUploadButton>
          {photo.input}
          <span className="text-xs text-text-table-header">JPG, PNG & GIF file up to 2MB at least 400px by 400px</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <FieldLabel>First name</FieldLabel>
          <Input density="compact" value={first} onChange={(e) => setFirst(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Last name</FieldLabel>
          <Input density="compact" value={last} onChange={(e) => setLast(e.target.value)} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Email address</FieldLabel>
        <Input
          density="compact"
          disabled={!emailEditable}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.doe@bayana.com"
          rightIcon={
            <button
              type="button"
              aria-label={emailEditable ? "Save email" : "Edit email"}
              onClick={() => {
                if (emailEditable && email.trim()) toast({ variant: "success", title: "Email updated" })
                setEmailEditable((v) => !v)
              }}
              className="pointer-events-auto cursor-pointer text-icon-neutral hover:text-text-events-strong"
            >
              <EventIcon name="pen-fill" size={EVENT_ICON_SIZE.meta} />
            </button>
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Phone number</FieldLabel>
        <div className="flex items-stretch gap-2">
          <span className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border-input-default-200 bg-input-surface px-3 text-sm text-text-events-strong">
            🇳🇬 +234
          </span>
          <Input density="compact" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Role</FieldLabel>
        <Input density="compact" disabled placeholder="Administrator" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────── NGO Profile
// lucide (this version) ships no brand marks — small inline SVG glyphs instead.
function IgIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function FbIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14V9.5c0-.3.2-.5.5-.5z" />
    </svg>
  )
}
function LiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.3 8.65 21 10.6 21 13.4V21h-4v-6.7c0-1.6-.03-3.67-2.24-3.67-2.24 0-2.58 1.75-2.58 3.55V21H9z" />
    </svg>
  )
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.7-6-5.4 6H2.6l7-8L2.3 3h6.1l4.2 5.6zM16.4 19.2h1.7L7.7 4.7H5.9z" />
    </svg>
  )
}

const SOCIALS = [
  { label: "Instagram", icon: IgIcon, placeholder: "instagram.com" },
  { label: "Facebook", icon: FbIcon, placeholder: "facebook.com" },
  { label: "LinkedIn", icon: LiIcon, placeholder: "linkedIn.com" },
  { label: "Twitter", icon: XIcon, placeholder: "x.com" },
]

export function NgoProfileSection() {
  const [causes, setCauses] = useState(() => CAUSE_AREAS)
  const [mission, setMission] = useState(
    "We are committed to helping people access job opportunities by providing guidance, support, and training that strengthens communities and transforms lives.",
  )
  const [address, setAddress] = useState("Plot 4, Ayaba street, lekki,100356, Lagos")
  const logo = useImageUpload("5MB")
  const banner = useImageUpload("1MB")

  const toggleCause = (label: string) =>
    setCauses((prev) => prev.map((c) => (c.label === label ? { ...c, selected: !c.selected } : c)))

  return (
    <div className={cn("flex flex-col gap-6", FORM_WIDTH)}>
      <SectionHeader title="NGO Profile" subtitle="Manage your organisation information" />

      <div className="flex flex-col gap-2">
        <FieldLabel>Business logo</FieldLabel>
        <div className="flex items-center gap-4">
          {logo.preview ? (
            <img src={logo.preview} alt="Logo" className="size-16 shrink-0 rounded-xl object-cover" />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-xl bg-bg-default-100 text-icon-neutral">
              <EventIcon name="pic-fill" size={24} />
            </span>
          )}
          <div className="flex flex-col items-start gap-1.5">
            <SettingsUploadButton onClick={logo.open}>Upload logo</SettingsUploadButton>
            {logo.input}
            <span className="text-xs text-text-table-header">JPG, PNG & GIF file up to 5MB at least 400px by 400px</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Profile Banner</FieldLabel>
        <button
          type="button"
          onClick={banner.open}
          className="relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-border-input-default-200 bg-bg-canvas px-4 py-8 text-center transition-colors hover:bg-bg-default-100/50"
        >
          {banner.preview ? (
            <img src={banner.preview} alt="Banner" className="absolute inset-0 size-full object-cover" />
          ) : (
            <>
              <span className="flex size-9 items-center justify-center rounded-lg bg-bg-default-100 text-icon-neutral">
                <EventIcon name="upload-2-fill" size={EVENT_ICON_SIZE.meta} />
              </span>
              <span className="text-sm font-medium text-text-events-strong">Drag & drop or choose file</span>
              <span className="text-xs text-text-table-header">JPG, PNG, Max file size: 1MB at least 390px by 140px</span>
            </>
          )}
        </button>
        {banner.input}
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>NGO registered name</FieldLabel>
        <Input density="compact" disabled placeholder="Acme Incorporation" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Registration number</FieldLabel>
        <Input density="compact" disabled placeholder="1234567890" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Business address</FieldLabel>
        <Input
          density="compact"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rightIcon={<span className="text-sm font-bold text-[#4285F4]">G</span>}
        />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Mission</FieldLabel>
        <Textarea value={mission} onChange={(e) => setMission(e.target.value)} className="min-h-[96px] rounded-xl" />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Cause areas</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {causes.map((c) => (
            <SelectableChip key={c.label} label={c.label} selected={c.selected} onClick={() => toggleCause(c.label)} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Past activities</FieldLabel>
        <div className={cn(elevatedCardSurfaceClassName, "max-h-[140px] overflow-hidden p-4 text-sm leading-[22px] text-text-events-strong")}>
          <p className="font-medium">1. Job Readiness Workshops</p>
          <p className="mt-2 text-text-table-header">Hosted monthly training sessions covering:</p>
          <ul className="mt-1 list-disc pl-5 text-text-table-header">
            <li>CV and cover-letter writing</li>
            <li>Interview preparation</li>
            <li>Workplace communication skills</li>
          </ul>
        </div>
      </div>

      <h2 className="font-display text-lg font-semibold leading-6 text-text-events-strong">Social links</h2>
      {SOCIALS.map((s) => {
        const Icon = s.icon
        return (
          <div key={s.label} className="flex flex-col gap-2">
            <FieldLabel>{s.label}</FieldLabel>
            <Input
              density="compact"
              placeholder={s.placeholder}
              leftIcon={
                <span className="flex items-center gap-1.5 text-icon-neutral">
                  <Icon className="size-4" />
                  <span className="text-sm text-text-table-header">https://</span>
                </span>
              }
              className="[&_input]:pl-[5.5rem]"
            />
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────── Notifications
export function NotificationsSection() {
  const [email, setEmail] = useState(true)
  const [inApp, setInApp] = useState(true)
  const [alerts, setAlerts] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_ALERTS.map((a) => [a.key, true])),
  )

  return (
    <div className={cn("flex flex-col gap-6", FORM_WIDTH)}>
      <SectionHeader title="Notifications" subtitle="Manage how you receive notifications" />
      <div className="flex flex-col gap-5">
        <ToggleRow label="Email notifications" helper="Get updates sent to your email" checked={email} onChange={setEmail} />
        <ToggleRow label="In-app notifications" helper="Get updates sent to your notification box" checked={inApp} onChange={setInApp} />
      </div>
      <div className="border-t border-border-default-100" />
      <h2 className="font-display text-lg font-semibold leading-6 text-text-events-strong">Alerts & notifications</h2>
      <div className="flex flex-col gap-5">
        {NOTIFICATION_ALERTS.map((a) => (
          <CheckboxRow
            key={a.key}
            label={a.label}
            helper={a.helper}
            checked={alerts[a.key]}
            onChange={() => setAlerts((prev) => ({ ...prev, [a.key]: !prev[a.key] }))}
          />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────── Privacy & security
export function PrivacySecuritySection() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(true)
  const [c, setC] = useState(true)
  return (
    <div className={cn("flex flex-col gap-6", FORM_WIDTH)}>
      <SectionHeader title="Privacy & security" subtitle="Manage your privacy and security settings" />
      <div className="flex flex-col gap-5">
        <ToggleRow label="Allow events messages" helper="Enable events participants to contact you" checked={a} onChange={setA} />
        <ToggleRow label="Allow direct message" helper="Enable direct messages from other team members" checked={b} onChange={setB} />
        <ToggleRow
          label="Allow collaboration requests"
          helper="Enable other organisations to send you a collaboration request"
          checked={c}
          onChange={setC}
        />
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: "active" | "pending" }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center rounded-lg px-2 text-xs font-medium",
        status === "active" ? "bg-bg-success-soft text-text-success" : "bg-bg-warning-soft text-text-warning",
      )}
    >
      {status === "active" ? "Active" : "Pending"}
    </span>
  )
}

// ─────────────────────────────────────────────────────────── Team members
export function TeamMembersSection() {
  const [rows, setRows] = useState<TeamMember[]>(TEAM_MEMBERS)
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = rows.filter((r) => {
    if (roleFilter !== "All" && r.role !== roleFilter) return false
    if (query.trim() && !`${r.name} ${r.email}`.toLowerCase().includes(query.trim().toLowerCase())) return false
    return true
  })
  const total = filtered.length

  const removeMember = (id: string, message: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    toast({ variant: "success", title: message })
  }
  const allSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id))

  return (
    <div className="flex w-full max-w-[968px] flex-col gap-6">
      <SectionHeader title="Team members" subtitle="Manage your team members and their roles" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="w-full sm:w-[400px]">
            <Input
              density="compact"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members"
              leftIcon={<SettingsSearchIcon />}
            />
          </div>
          <FilterDropdown
            appearance="events"
            showLeadingIcon={false}
            label="All"
            options={["All", ...new Set(rows.map((r) => r.role))]}
            value={roleFilter}
            onValueChange={setRoleFilter}
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          className="w-fit rounded-lg"
          onClick={() => setInviteOpen(true)}
        >
          Invite member
        </Button>
      </div>

      <div className={settingsTableCardClassName}>
        <Table contained={false} className="w-full">
          <TableHeader>
            <TableRow className={tableHeaderRowClassName}>
              <TableSelectHead>
                <Checkbox
                  size="sm"
                  checked={allSelected ? true : selected.size > 0 ? "indeterminate" : false}
                  onCheckedChange={() =>
                    setSelected(allSelected ? new Set() : new Set(filtered.map((r) => r.id)))
                  }
                  aria-label="Select all"
                />
              </TableSelectHead>
              <TableHead>Team member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date joined</TableHead>
              <TableActionsHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id} className="hover:bg-transparent">
                <TableSelectCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    size="sm"
                    checked={selected.has(row.id)}
                    onCheckedChange={() =>
                      setSelected((prev) => {
                        const next = new Set(prev)
                        if (next.has(row.id)) next.delete(row.id)
                        else next.add(row.id)
                        return next
                      })
                    }
                    aria-label={`Select ${row.name}`}
                  />
                </TableSelectCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <PersonAvatar name={row.name} tone={row.avatarTone} imageUrl={row.avatarImage} size={40} />
                    <div className="flex min-w-0 flex-col">
                      <span className="flex items-center gap-1.5 type-table-cell-primary">
                        {row.name}
                        {row.isYou ? (
                          <span className="inline-flex h-5 items-center rounded-md bg-bg-nav-tab-active px-1.5 text-[11px] font-medium text-text-nav-tab-active">
                            You
                          </span>
                        ) : null}
                      </span>
                      <span className="type-table-cell-secondary truncate">{row.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="type-table-cell-primary">{row.role}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell className="type-table-cell-secondary">{row.dateJoined}</TableCell>
                <TableActionsCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Actions for ${row.name}`}
                        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-icon-neutral transition-colors hover:bg-bg-default-100 data-[state=open]:border data-[state=open]:border-border-input-active"
                      >
                        <EventIcon name="more-1-fill" size={EVENT_ICON_SIZE.tableMore} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[11rem]">
                      {row.status === "pending" ? (
                        <>
                          <DropdownMenuItem onSelect={() => setEditing(row)}>
                            <EventIcon name="pen-fill" size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-neutral" />
                            Edit invite
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-text-negative focus:bg-bg-negative-soft"
                            onSelect={() => removeMember(row.id, "Invite revoked")}
                          >
                            <EventIcon name="close-fill" size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-negative" />
                            Revoke invite
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem onSelect={() => setEditing(row)}>
                            <EventIcon name="pen-fill" size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-neutral" />
                            Edit member
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-text-negative focus:bg-bg-negative-soft"
                            onSelect={() => removeMember(row.id, `${row.name} deactivated`)}
                          >
                            <EventIcon name="close-circle-fill" size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-negative" />
                            Deactivate member
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableActionsCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DataTablePagination
          className="border-t border-border-default-100 px-4 pb-4"
          from={total === 0 ? 0 : 1}
          to={total}
          total={total}
          page={1}
          pageSize={10}
          totalPages={1}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
        />
      </div>

      <InviteMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={(data) => {
          setInviteOpen(false)
          setRows((prev) => [
            ...prev,
            {
              id: `tm-new-${prev.length}-${data.email}`,
              name: `${data.first} ${data.last}`.trim(),
              email: data.email,
              avatarTone: "orange",
              role: data.role,
              status: "pending",
              dateJoined: "--",
            },
          ])
          toast({ variant: "success", title: "Invite sent", description: `${data.first} ${data.last} was invited.` })
        }}
      />
      {editing ? (
        <EditMemberModal
          key={editing.id}
          open={editing !== null}
          member={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            setRows((prev) =>
              prev.map((r) =>
                r.id === editing.id
                  ? { ...r, name: `${data.first} ${data.last}`.trim(), email: data.email, role: data.role }
                  : r,
              ),
            )
            setEditing(null)
            toast({ variant: "success", title: "Changes saved" })
          }}
        />
      ) : null}
    </div>
  )
}

// ─────────────────────────────────────────────────────────── Audit logs
export function AuditLogsSection() {
  const [query, setQuery] = useState("")
  const [member, setMember] = useState("Member")
  const [dateFilter, setDateFilter] = useState("Date")
  const [detail, setDetail] = useState<AuditLog | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = AUDIT_LOGS.filter((l) => {
    if (member !== "Member" && l.member !== member) return false
    if (query.trim() && !`${l.member} ${l.fullLog}`.toLowerCase().includes(query.trim().toLowerCase())) return false
    return true
  })
  const allSelected = filtered.length > 0 && filtered.every((log) => selected.has(log.id))

  return (
    <div className="flex w-full max-w-[968px] flex-col gap-6">
      <SectionHeader title="Audit logs" subtitle="Manage and monitor team activity" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <FilterDropdown
            appearance="events"
            showLeadingIcon={false}
            label="Member"
            options={["Member", ...new Set(AUDIT_LOGS.map((l) => l.member))]}
            value={member}
            onValueChange={setMember}
          />
          <FilterDropdown
            appearance="events"
            showLeadingIcon={false}
            label="Date"
            options={["Date", "Today", "This week", "This month"]}
            value={dateFilter}
            onValueChange={setDateFilter}
          />
        </div>
        <div className="w-full sm:w-[400px]">
          <Input
            density="compact"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logs"
            leftIcon={<SettingsSearchIcon />}
          />
        </div>
      </div>

      <div className={tableSurfaceClassName}>
        <Table contained={false} className="w-full">
          <TableHeader>
            <TableRow className={tableHeaderRowClassName}>
              <TableSelectHead>
                <Checkbox
                  size="sm"
                  checked={allSelected ? true : selected.size > 0 ? "indeterminate" : false}
                  onCheckedChange={() =>
                    setSelected(allSelected ? new Set() : new Set(filtered.map((log) => log.id)))
                  }
                  aria-label="Select all"
                />
              </TableSelectHead>
              <TableHead>Member</TableHead>
              <TableHead>Log</TableHead>
              <TableHead>Date</TableHead>
              <TableActionsHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((log) => (
              <TableRow key={log.id} className="cursor-pointer" onClick={() => setDetail(log)}>
                <TableSelectCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    size="sm"
                    checked={selected.has(log.id)}
                    onCheckedChange={() =>
                      setSelected((prev) => {
                        const next = new Set(prev)
                        if (next.has(log.id)) next.delete(log.id)
                        else next.add(log.id)
                        return next
                      })
                    }
                    aria-label={`Select ${log.member}`}
                  />
                </TableSelectCell>
                <TableCell>
                  <span className="flex items-center gap-3 type-table-cell-primary">
                    <PersonAvatar name={log.member} tone={log.avatarTone} size={36} />
                    {log.member}
                  </span>
                </TableCell>
                <TableCell className="type-table-cell-secondary">{log.log}</TableCell>
                <TableCell className="type-table-cell-primary">{log.date}</TableCell>
                <TableNavCell>
                  <EventIcon name="arrow-right-fill" size={EVENT_ICON_SIZE.meta} className="text-icon-neutral" />
                </TableNavCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DataTablePagination
          from={filtered.length === 0 ? 0 : 1}
          to={filtered.length}
          total={filtered.length}
          page={1}
          pageSize={10}
          totalPages={1}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
        />
      </div>

      <LogDetailsModal open={detail !== null} log={detail} onClose={() => setDetail(null)} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────── Payouts
export function PayoutsSection() {
  const [subTab, setSubTab] = useState<"history" | "settings">("settings")
  const [accounts, setAccounts] = useState<BankAccount[]>(BANK_ACCOUNTS)
  const [autoSettle, setAutoSettle] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [removeId, setRemoveId] = useState<string | null>(null)
  const [detail, setDetail] = useState<PayoutRow | null>(null)
  const [query, setQuery] = useState("")

  const history = PAYOUT_HISTORY.filter((p) => !query.trim() || p.title.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="flex w-full max-w-[968px] flex-col gap-6">
      <SectionHeader title="Payouts & settlement" subtitle="Manage how you receive payout and settlement" />

      <div className="flex gap-6 border-b border-border-default-100">
        {(["history", "settings"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSubTab(t)}
            className={cn(
              "type-events-tab relative cursor-pointer pb-3",
              subTab === t
                ? "text-text-events-strong after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-bg-accent"
                : "text-text-table-header hover:text-text-neutral-400",
            )}
          >
            {t === "history" ? "Payout history" : "Payout settings"}
          </button>
        ))}
      </div>

      {subTab === "settings" ? (
        <>
          {accounts.length === 0 ? (
            <div className={cn(elevatedCardSurfaceClassName, "flex flex-col items-center gap-3 px-4 py-12 text-center")}>
              <span className="flex size-11 items-center justify-center rounded-full bg-bg-default-100 text-icon-neutral">
                <EventIcon name="bank-fill" size={24} />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-text-events-strong">No payout account yet</p>
                <p className="text-xs text-text-table-header">
                  Add your bank account. Once your bank account is added, it will appear here
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-fit rounded-lg"
                onClick={() => setAddOpen(true)}
              >
                Add account
              </Button>
            </div>
          ) : (
          <div className={settingsTableCardClassName}>
            {accounts.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between gap-3 border-b border-border-default-100 px-4 py-3 last:border-b-0">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-bg-default-100 text-icon-neutral">
                    <EventIcon name="bank-fill" size={EVENT_ICON_SIZE.meta} />
                  </span>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-text-events-strong">
                      {acc.name}
                      {acc.primary ? (
                        <span className="inline-flex h-5 items-center rounded-md bg-bg-nav-tab-active px-1.5 text-[11px] font-medium text-text-nav-tab-active">
                          Primary
                        </span>
                      ) : null}
                    </span>
                    <span className="text-xs text-text-table-header">
                      {acc.number} · {acc.bank}
                    </span>
                  </div>
                </div>
                {!acc.primary ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="neutral"
                      size="sm"
                      className="rounded-lg"
                      leftIcon={<EventIcon name="star-fill-accent" size={EVENT_ICON_SIZE.buttonLeading} />}
                      onClick={() => {
                        setAccounts((prev) => prev.map((a) => ({ ...a, primary: a.id === acc.id })))
                        toast({ variant: "success", title: "Primary account updated" })
                      }}
                    >
                      Set as primary
                    </Button>
                    <Button
                      variant="neutral"
                      size="sm"
                      className="rounded-lg"
                      leftIcon={<EventIcon name="delete-fill" size={EVENT_ICON_SIZE.buttonLeading} />}
                      onClick={() => setRemoveId(acc.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}
            <div className="px-4 py-3">
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-text-events-strong transition-colors hover:text-text-neutral-400"
              >
                Add account
              </button>
            </div>
          </div>
          )}

          <h2 className="font-display text-lg font-semibold leading-6 text-text-events-strong">Payout settings</h2>
          <ToggleRow
            label="Auto-settlement"
            helper="Donations receive with be automatically sent to your bank account"
            checked={autoSettle}
            onChange={setAutoSettle}
          />
        </>
      ) : (
        <>
          <div className="w-full sm:w-[300px]">
            <Input
              density="compact"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search payouts"
              leftIcon={<SettingsSearchIcon />}
            />
          </div>
          <div className={settingsTableCardClassName}>
            <Table contained={false} className="w-full">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12 px-0 text-center">
                    <Checkbox size="sm" checked={false} aria-label="Select all" />
                  </TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12 px-0 text-center" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((p) => (
                  <TableRow key={p.id} className="cursor-pointer" onClick={() => setDetail(p)}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox size="sm" checked={false} aria-label={`Select ${p.title}`} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="type-table-cell-primary">{p.title}</span>
                        <span className="type-table-cell-secondary">{p.date}</span>
                      </div>
                    </TableCell>
                    <TableCell className="type-table-cell-primary">{p.amount}</TableCell>
                    <TableCell>
                      <span className="inline-flex h-6 w-fit items-center rounded-lg bg-bg-success-soft px-2 text-xs font-medium text-text-success">
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <EventIcon name="arrow-right-fill" size={EVENT_ICON_SIZE.meta} className="ml-auto text-icon-neutral" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DataTablePagination
              className="border-t border-border-default-100 px-4 pb-4"
              from={history.length === 0 ? 0 : 1}
              to={history.length}
              total={history.length}
              page={1}
              pageSize={10}
              totalPages={1}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
            />
          </div>
        </>
      )}

      <AddBankModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(data) => {
          setAddOpen(false)
          setAccounts((prev) => [
            ...prev,
            { id: `ba-new-${prev.length}`, name: data.name, number: data.number, bank: data.bank, primary: prev.length === 0 },
          ])
          toast({ variant: "success", title: "Bank account added" })
        }}
      />
      <ConfirmModal
        open={removeId !== null}
        onClose={() => setRemoveId(null)}
        title="Remove account"
        description="You're about to remove this account . This means that you no longer want this account as an option of your payout accounts."
        confirmLabel="Remove account"
        variant="destructive"
        onConfirm={() => {
          setAccounts((prev) => prev.filter((a) => a.id !== removeId))
          setRemoveId(null)
          toast({ variant: "success", title: "Account removed" })
        }}
      />
      <PayoutDetailsModal open={detail !== null} payout={detail} onClose={() => setDetail(null)} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────── Billing
function UsageStat({ icon, label, value, left }: { icon: React.ReactNode; label: string; value: string; left: string }) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <span className="flex items-center gap-1.5 text-sm text-text-table-header">
        {icon}
        {label}
      </span>
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-semibold text-text-events-strong">{value}</span>
        <span className="text-xs text-text-table-header">{left}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-default-100">
        <div className="h-full w-0 rounded-full bg-bg-accent" />
      </div>
    </div>
  )
}

function UpgradeModal({ open, onClose, onUpgrade }: { open: boolean; onClose: () => void; onUpgrade: () => void }) {
  const [period, setPeriod] = useState<"Monthly" | "Quarterly" | "Yearly">("Monthly")
  return (
    <Modal open={open} onClose={onClose} size="full" flushBody className="max-w-[940px]">
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
        <div className="relative hidden flex-col justify-start gap-3 bg-bg-nav p-8 text-text-on-solid-bg md:flex">
          <div className="size-9 rounded-full border-2 border-bg-accent/60" />
          <h2 className="mt-4 font-display text-2xl font-semibold">Upgrade to Premium</h2>
          <p className="text-sm text-white/70">To unlock access to our premium features, upgrade your plan now</p>
        </div>
        <div className="flex flex-col gap-5 bg-bg-canvas p-6">
          <div className="flex items-center gap-1 rounded-xl bg-bg-default-100 p-1">
            {(["Monthly", "Quarterly", "Yearly"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors",
                  period === p ? "bg-bg-canvas text-text-events-strong shadow-input-default" : "text-text-table-header",
                )}
              >
                {p}
                {p !== "Monthly" ? (
                  <span className="rounded-md bg-bg-accent-soft px-1.5 text-[11px] font-semibold text-bg-accent">Save 20%</span>
                ) : null}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className={cn(elevatedCardSurfaceClassName, "flex flex-col gap-3 p-4")}>
              <span className="flex items-center gap-1.5 text-sm font-medium text-text-events-strong">
                <EventIcon name="rocket-2-fill" size={EVENT_ICON_SIZE.meta} className="text-icon-neutral" /> Free
              </span>
              <span className="text-xs text-text-table-header">Enjoy our basic features</span>
              <span className="font-display text-2xl font-semibold text-text-events-strong">₦0</span>
              <span className="-mt-2 text-xs text-text-table-header">per month</span>
              <Button variant="neutral" size="sm" disabled className="rounded-lg">
                Current plan
              </Button>
              <ul className="flex flex-col gap-2 pt-1">
                {PLAN_FEATURES.free.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-events-strong">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-bg-success-soft text-text-success">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn(elevatedCardSurfaceClassName, "flex flex-col gap-3 border border-border-input-active p-4")}>
              <span className="flex items-center gap-1.5 text-sm font-medium text-text-events-strong">
                <EventIcon name="rocket-2-fill" size={EVENT_ICON_SIZE.meta} className="text-bg-accent" /> Premium
              </span>
              <span className="text-xs text-text-table-header">Enjoy our full features</span>
              <span className="font-display text-2xl font-semibold text-text-events-strong">₦20,000</span>
              <span className="-mt-2 text-xs text-text-table-header">per month</span>
              <Button variant="primary" size="sm" className="rounded-lg" onClick={onUpgrade}>
                Upgrade
              </Button>
              <ul className="flex flex-col gap-2 pt-1">
                {PLAN_FEATURES.premium.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-events-strong">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-bg-accent-soft text-bg-accent">✓</span>
                    {f}
                    {f === "NGO collaborators" ? (
                      <span className="rounded-md bg-bg-default-100 px-1.5 text-[11px] font-medium text-text-table-header">Soon</span>
                    ) : null}
                  </li>
                ))}
                <li className="pl-6 text-sm font-medium text-bg-accent">…and more</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const PREMIUM_INVOICES = [
  { id: "inv-1", title: "Premium plan", date: "17 May 2026", amount: "₦20,000", status: "Upcoming" as const },
  { id: "inv-2", title: "Premium plan", date: "17 Apr 2026", amount: "₦20,000", status: "Paid" as const },
  { id: "inv-3", title: "Capacity increase", date: "12 Mar 2026", amount: "₦12,000", status: "Paid" as const },
]

export function BillingSection({ initialPlan = "free" }: { initialPlan?: "free" | "premium" }) {
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [plan, setPlan] = useState<"free" | "premium">(initialPlan)
  const premium = plan === "premium"

  return (
    <div className="flex w-full max-w-[968px] flex-col gap-6">
      <SectionHeader title="Billing & plans" subtitle="Manage your billing information and subscription" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={cn(elevatedCardSurfaceClassName, "flex min-h-[174px] flex-col gap-3 p-4")}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm text-text-table-header">
              <EventIcon name="rocket-2-fill" size={EVENT_ICON_SIZE.meta} className="text-icon-neutral" /> Current plan
            </span>
            <span className="text-xs text-text-table-header">
              {premium ? "Auto-renews on 17 May 2026" : "Renews on 17 May 2026"}
            </span>
          </div>
          <span className="font-display text-xl font-semibold text-text-events-strong">{premium ? "Premium" : "Free"}</span>
          <span className="text-sm text-text-table-header">{premium ? "₦20,000 per month" : "₦0 per month"}</span>
          {premium ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="neutral" size="sm" className="w-fit rounded-lg" onClick={() => setUpgradeOpen(true)}>
                Manage plan
              </Button>
              <Button
                variant="neutral"
                size="sm"
                className="w-fit rounded-lg"
                onClick={() => {
                  setPlan("free")
                  toast({ variant: "success", title: "Subscription cancelled" })
                }}
              >
                Cancel subscription
              </Button>
            </div>
          ) : (
            <Button variant="neutral" size="sm" className="w-fit rounded-lg" onClick={() => setUpgradeOpen(true)}>
              Upgrade plan
            </Button>
          )}
        </div>
        <div className={cn(elevatedCardSurfaceClassName, "flex min-h-[174px] flex-col gap-3 p-4")}>
          <span className="text-sm text-text-table-header">Card information</span>
          {premium ? (
            <div className="flex items-center gap-3 rounded-xl border border-border-default-100 p-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-bg-default-100 text-icon-neutral">
                <EventIcon name="bank-card-fill" size={EVENT_ICON_SIZE.meta} />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-events-strong">•••• •••• •••• 0977</span>
                <span className="text-xs text-text-table-header">Visa · 07 / 21</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-bg-default-100 p-3">
              <p className="text-sm font-medium text-text-events-strong">No card added yet</p>
              <p className="text-xs text-text-table-header">Once you&apos;ve used a card, it will appear here</p>
            </div>
          )}
          <Button
            variant="neutral"
            size="sm"
            disabled={!premium}
            className="w-fit rounded-lg"
            onClick={() => toast({ title: "Coming soon", description: "Card management will be available after API integration." })}
          >
            Manage card
          </Button>
        </div>
      </div>

      <div className={cn(elevatedCardSurfaceClassName, "flex flex-col gap-4 p-4")}>
        <div className="flex flex-col gap-6 sm:flex-row sm:divide-x sm:divide-border-default-100">
          <div className="flex-1 sm:pr-6">
            <UsageStat
              icon={<EventIcon name="flag-2-fill" size={EVENT_ICON_SIZE.meta} className="text-bg-accent" />}
              label="Active cause"
              value="0 / 3"
              left="3 left"
            />
          </div>
          <div className="flex-1 sm:px-6">
            <UsageStat
              icon={<EventIcon name="award-fill" size={EVENT_ICON_SIZE.meta} className="text-text-success" />}
              label="Active needs"
              value="0 / 1"
              left="1 left"
            />
          </div>
          <div className="flex-1 sm:pl-6">
            <UsageStat icon={<span className="text-sm">₦</span>} label="Donations" value="₦0 / 500,000" left="₦ 500,000 left" />
          </div>
        </div>
        <Button variant="neutral" size="sm" className="w-fit rounded-lg" onClick={() => toast({ title: "Coming soon", description: "Capacity upgrades will be available after API integration." })}>
          Add capacity
        </Button>
      </div>

      <div className={settingsTableCardClassName}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="w-full sm:w-[400px]">
            <Input density="compact" placeholder="Search invoices" leftIcon={<SettingsSearchIcon />} disabled={!premium} />
          </div>
        </div>
        <Table contained={false} className="w-full">
          <TableHeader>
            <TableRow className={tableHeaderRowClassName}>
              <TableSelectHead>
                <Checkbox size="sm" checked={false} disabled={!premium} aria-label="Select all" />
              </TableSelectHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableActionsHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {premium ? (
              PREMIUM_INVOICES.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-transparent">
                  <TableSelectCell>
                    <Checkbox size="sm" checked={false} aria-label={`Select ${inv.title}`} />
                  </TableSelectCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="type-table-cell-primary">{inv.title}</span>
                      <span className="type-table-cell-secondary">{inv.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="type-table-cell-primary">{inv.amount}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex h-6 w-fit items-center rounded-lg px-2 text-xs font-medium",
                        inv.status === "Paid" ? "bg-bg-success-soft text-text-success" : "bg-bg-default-100 text-text-table-header",
                      )}
                    >
                      {inv.status}
                    </span>
                  </TableCell>
                  <TableNavCell>
                    <EventIcon name="arrow-right-fill" size={EVENT_ICON_SIZE.meta} className="text-icon-neutral" />
                  </TableNavCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-20 text-center">
                  <p className="text-sm font-medium text-text-events-strong">No invoice yet</p>
                  <p className="text-xs text-text-table-header">Once there&apos;s an invoice, it will appear here</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        onUpgrade={() => {
          setUpgradeOpen(false)
          setPlan("premium")
          toast({ variant: "success", title: "Upgraded to Premium" })
        }}
      />
    </div>
  )
}
