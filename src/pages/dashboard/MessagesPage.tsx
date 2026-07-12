import { useRef, useState, type ComponentType } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  CalendarClock,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  Megaphone,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  SendHorizontal,
  Trash2,
  User,
  Users,
} from "lucide-react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"
import { PersonAvatar } from "../../components/events/detail/PersonAvatar"
import { CreateMessageModal } from "../../components/messages/CreateMessageModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { toast } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"
import { InboxIcon } from "../../components/messages/InboxIcon"
import { EmptyMessagesIllustration } from "../../components/messages/EmptyMessagesIllustration"
import {
  BROADCASTS,
  CONVERSATIONS,
  MESSAGES_USER,
  RECENT_MESSAGES,
  SCHEDULED,
  TEAM_MEMBERS_LIST,
  UNREAD_COUNT,
  VOLUNTEERS_LIST,
  type Conversation,
  type MessageBubble,
  type MessageGroup,
  type MessagePerson,
} from "./messages-data"

type Section = "inbox" | "volunteers" | "team" | "broadcast" | "scheduled"

const NAV: { id: Section; label: string; icon: ComponentType<{ className?: string }>; count?: number }[] = [
  { id: "inbox", label: "Inbox", icon: InboxIcon, count: 5 },
  { id: "volunteers", label: "Volunteers", icon: User },
  { id: "team", label: "Team members", icon: Users },
  { id: "broadcast", label: "Broadcast message", icon: Megaphone },
  { id: "scheduled", label: "Scheduled", icon: CalendarClock },
]

const SECTION_META: Record<Section, { title: string; search: string; showUnread: boolean }> = {
  inbox: { title: "Inbox", search: "Search messages", showUnread: true },
  volunteers: { title: "Volunteers", search: "Search volunteer", showUnread: true },
  team: { title: "Team members", search: "Search team member", showUnread: true },
  broadcast: { title: "Broadcast messages", search: "Search messages", showUnread: true },
  scheduled: { title: "Scheduled", search: "Search messages", showUnread: false },
}

function AvatarStack({ members, extra }: { members: MessageGroup["members"]; extra: number }) {
  return (
    <div className="relative flex shrink-0 items-center">
      {members.slice(0, 2).map((m, index) => (
        <span key={index} className={cn("rounded-full ring-2 ring-bg-canvas", index > 0 && "-ml-3")}>
          <PersonAvatar name={m.name} tone={m.avatarTone} imageUrl={m.avatarImage} size={28} />
        </span>
      ))}
      {extra > 0 ? (
        <span className="-ml-3 inline-flex size-5 items-center justify-center rounded-full bg-bg-accent text-[10px] font-semibold text-text-on-solid-bg ring-2 ring-bg-canvas">
          +{extra}
        </span>
      ) : null}
    </div>
  )
}

function Bubble({ bubble }: { bubble: MessageBubble }) {
  if (bubble.kind === "event") {
    return (
      <button
        type="button"
        className="relative block w-[320px] max-w-full overflow-hidden rounded-2xl bg-bg-default-100 text-left"
      >
        <span className="block aspect-[320/168] w-full overflow-hidden">
          <img
            src={bubble.eventThumb}
            alt=""
            className="size-full object-cover"
            onError={(e) => (e.currentTarget.style.visibility = "hidden")}
          />
        </span>
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-6">
          <span className="truncate text-sm font-[510] text-white">{bubble.eventTitle}</span>
          <ChevronRight className="size-4 shrink-0 text-white" />
        </span>
      </button>
    )
  }
  const mine = bubble.from === "me"
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm leading-[22px]",
          mine ? "bg-bg-accent text-text-on-solid-bg" : "bg-bg-default-100 text-text-events-strong",
        )}
      >
        {bubble.text}
      </div>
    </div>
  )
}

function ThreadView({ conversation, onViewProfile }: { conversation: Conversation; onViewProfile: () => void }) {
  // Parent remounts this via key={conversation.id}, so a lazy initializer is enough.
  const [draft, setDraft] = useState("")
  const [messages, setMessages] = useState<MessageBubble[]>(() => conversation.messages)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
  }

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: `sent-${prev.length}-${text.length}`, from: "me", kind: "text", text },
    ])
    setDraft("")
    scrollToEnd()
  }

  const attachFile = (file: File | undefined) => {
    if (!file) return
    setMessages((prev) => [
      ...prev,
      { id: `file-${prev.length}`, from: "me", kind: "text", text: `📎 ${file.name}` },
    ])
    scrollToEnd()
  }

  return (
    <div className="flex size-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border-default-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <PersonAvatar name={conversation.name} tone={conversation.avatarTone} imageUrl={conversation.avatarImage} size={40} />
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-6 text-text-events-strong">{conversation.name}</span>
            <span className="text-sm leading-5 text-text-table-header">{conversation.role}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Conversation actions"
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-border-default-100 text-icon-neutral transition-colors hover:bg-bg-default-100 data-[state=open]:border-border-input-active"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[11rem]">
            <DropdownMenuItem onSelect={onViewProfile}>
              <Eye className="size-4 text-icon-neutral" />
              View profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-6 py-5">
        <div className="mb-1 flex items-center gap-2">
          <PersonAvatar name={conversation.name} tone={conversation.avatarTone} imageUrl={conversation.avatarImage} size={24} />
          <span className="text-xs font-[510] text-text-events-strong">{conversation.name}</span>
          <span className="text-xs text-text-table-header">{conversation.messages[0]?.time ?? ""}</span>
        </div>
        {messages.map((bubble) => (
          <Bubble key={bubble.id} bubble={bubble} />
        ))}
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 rounded-2xl border border-border-input-active bg-bg-canvas py-2 pl-4 pr-2 shadow-input-default">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                send()
              }
            }}
            rows={1}
            placeholder="Type a message..."
            className="max-h-32 min-h-6 flex-1 resize-none self-center border-0 bg-transparent text-sm leading-[22px] text-text-events-strong outline-none placeholder:text-input-placeholder"
          />
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            onChange={(event) => {
              attachFile(event.target.files?.[0])
              event.target.value = ""
            }}
          />
          <button
            type="button"
            aria-label="Attach file"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border-default-100 text-icon-neutral transition-colors hover:bg-bg-default-100"
          >
            <Paperclip className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Send message"
            disabled={!draft.trim()}
            onClick={send}
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-bg-accent text-text-on-solid-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendHorizontal className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function GroupThreadView({
  group,
  mode,
  onDelete,
  onSendInstantly,
}: {
  group: MessageGroup
  mode: "broadcast" | "scheduled"
  onDelete: () => void
  onSendInstantly: () => void
}) {
  const subtitle = mode === "broadcast" ? "Broadcast message" : "Scheduled for 24th April, 2026"
  return (
    <div className="flex size-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border-default-100 px-6 py-4">
        <div className="flex min-w-0 flex-col">
          <span className="flex items-center gap-1.5 text-lg font-semibold leading-6 text-text-events-strong">
            <span className="truncate">{group.members.map((m) => m.name).join(", ")}</span>
            <ChevronDown className="size-4 shrink-0 text-icon-neutral" />
          </span>
          <span className="text-sm leading-5 text-text-table-header">{subtitle}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Message actions"
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-border-default-100 text-icon-neutral transition-colors hover:bg-bg-default-100 data-[state=open]:border-border-input-active"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[11rem]">
            {mode === "scheduled" ? (
              <DropdownMenuItem onSelect={onSendInstantly}>
                <Send className="size-4 text-icon-neutral" />
                Send instantly
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              className="text-text-negative focus:bg-bg-negative-soft"
              onSelect={onDelete}
            >
              <Trash2 className="size-4 text-icon-negative" />
              {mode === "broadcast" ? "Delete broadcast" : "Delete message"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-6 py-5">
        <div className="mb-1 flex items-center justify-end gap-2">
          <span className="text-xs font-[510] text-text-events-strong">You</span>
          <span className="text-xs text-text-table-header">{group.time}</span>
          <PersonAvatar name={MESSAGES_USER.name} tone={MESSAGES_USER.tone} size={24} />
        </div>
        <div className="flex justify-end">
          <div className="max-w-[70%] whitespace-pre-line rounded-2xl bg-bg-default-100 px-3.5 py-2.5 text-sm leading-[22px] text-text-events-strong">
            {group.body}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 rounded-2xl border border-border-default-100 bg-bg-canvas py-2 pl-4 pr-2 shadow-input-default">
          <span className="flex-1 text-sm leading-[22px] text-input-placeholder">Send a message</span>
          <button
            type="button"
            aria-label="Attach file"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border-default-100 text-icon-neutral"
          >
            <Paperclip className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Send message"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-accent text-text-on-solid-bg"
          >
            <SendHorizontal className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function PersonRow({ person, onClick }: { person: MessagePerson; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-border-default-100/70 px-4 py-3 text-left transition-colors hover:bg-bg-default-100/60"
    >
      <PersonAvatar name={person.name} tone={person.avatarTone} imageUrl={person.avatarImage} size={40} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-[510] text-text-events-strong">{person.name}</span>
        <span className="text-xs leading-5 text-text-table-header">Start a conversation</span>
      </div>
    </button>
  )
}

function GroupRow({
  group,
  scheduled,
  active,
  onClick,
}: {
  group: MessageGroup
  scheduled?: boolean
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors",
        active ? "border-bg-accent bg-bg-accent-soft/40" : "border-transparent hover:bg-bg-default-100/60",
      )}
    >
      <AvatarStack members={group.members} extra={group.extra} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-[510] text-text-events-strong">{group.title}</span>
          <span className="flex shrink-0 items-center gap-1 text-xs text-text-table-header">
            {scheduled ? <Clock className="size-3" /> : null}
            {group.time}
          </span>
        </div>
        <span className="truncate text-xs leading-5 text-text-table-header">{group.preview}</span>
      </div>
    </button>
  )
}

export function MessagesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEmpty = searchParams.get("scenario") === "empty"
  const [conversations, setConversations] = useState<Conversation[]>(isEmpty ? [] : CONVERSATIONS)

  const [section, setSection] = useState<Section>("inbox")
  const [tab, setTab] = useState<"all" | "unread">("all")
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [broadcasts, setBroadcasts] = useState<MessageGroup[]>(isEmpty ? [] : BROADCASTS)
  const [scheduledList, setScheduledList] = useState<MessageGroup[]>(isEmpty ? [] : SCHEDULED)

  const meta = SECTION_META[section]
  const q = query.trim().toLowerCase()

  const filteredConversations = conversations.filter((c) => {
    if (tab === "unread" && c.unread === 0) return false
    if (q && !c.name.toLowerCase().includes(q)) return false
    return true
  })
  const filterPeople = (people: MessagePerson[]) =>
    people.filter((p) => !q || p.name.toLowerCase().includes(q))
  const selected = conversations.find((c) => c.id === selectedId) ?? null

  const goToSection = (next: Section) => {
    setSection(next)
    setTab("all")
    setQuery("")
    setSelectedGroupId(null)
    if (next !== "inbox") setSelectedId(null)
  }

  const selectedGroup =
    section === "broadcast"
      ? broadcasts.find((g) => g.id === selectedGroupId)
      : section === "scheduled"
        ? scheduledList.find((g) => g.id === selectedGroupId)
        : undefined

  const deleteGroup = () => {
    if (section === "broadcast") {
      setBroadcasts((prev) => prev.filter((g) => g.id !== selectedGroupId))
      toast({ variant: "success", title: "Broadcast deleted" })
    } else {
      setScheduledList((prev) => prev.filter((g) => g.id !== selectedGroupId))
      toast({ variant: "success", title: "Scheduled message deleted" })
    }
    setSelectedGroupId(null)
  }

  const sendInstantly = () => {
    setScheduledList((prev) => prev.filter((g) => g.id !== selectedGroupId))
    setSelectedGroupId(null)
    toast({ variant: "success", title: "Message sent" })
  }

  const renderList = () => {
    if (section === "volunteers" || section === "team") {
      const people = filterPeople(section === "volunteers" ? VOLUNTEERS_LIST : TEAM_MEMBERS_LIST)
      return people.length === 0 ? (
        <NoResult />
      ) : (
        people.map((p) => (
          <PersonRow key={p.id} person={p} onClick={() => toast({ title: "Coming soon", description: `Start a conversation with ${p.name}.` })} />
        ))
      )
    }
    if (section === "broadcast" || section === "scheduled") {
      const groups = (section === "broadcast" ? broadcasts : scheduledList).filter(
        (g) => !q || g.title.toLowerCase().includes(q),
      )
      return groups.length === 0 ? (
        <NoResult />
      ) : (
        groups.map((g) => (
          <GroupRow
            key={g.id}
            group={g}
            scheduled={section === "scheduled"}
            active={g.id === selectedGroupId}
            onClick={() => setSelectedGroupId(g.id)}
          />
        ))
      )
    }
    // inbox
    if (filteredConversations.length === 0) {
      return q || tab === "unread" ? (
        <NoResult />
      ) : (
        <div className="flex flex-col items-center gap-1 px-4 pt-24 text-center">
          <p className="text-sm font-[510] text-text-events-strong">No inbox yet</p>
          <p className="text-xs leading-5 text-text-table-header">Once there&apos;s an inbox, it will appear here</p>
        </div>
      )
    }
    return filteredConversations.map((c) => {
      const active = c.id === selectedId
      return (
        <button
          key={c.id}
          type="button"
          onClick={() => setSelectedId(c.id)}
          className={cn(
            "flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors",
            active ? "border-bg-accent bg-bg-accent-soft/40" : "border-transparent hover:bg-bg-default-100/60",
          )}
        >
          <PersonAvatar name={c.name} tone={c.avatarTone} imageUrl={c.avatarImage} size={40} />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-[510] text-text-events-strong">{c.name}</span>
              <span className="shrink-0 text-xs text-text-table-header">{c.time}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs leading-5 text-text-table-header">{c.preview}</span>
              {c.unread > 0 ? (
                <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-bg-accent text-[10px] font-semibold text-text-on-solid-bg">
                  {c.unread}
                </span>
              ) : null}
            </div>
          </div>
        </button>
      )
    })
  }

  return (
    <DashboardLayout activeTab="messages" mainClassName="!overflow-hidden">
      <div className="flex h-full w-full">
        {/* Left sidebar */}
        <aside className="flex w-[250px] shrink-0 flex-col border-r border-border-default-100 bg-bg-canvas px-4 py-5">
          <div className="flex items-center gap-3">
            <PersonAvatar name={MESSAGES_USER.name} tone={MESSAGES_USER.tone} size={40} />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold leading-[22px] text-text-events-strong">
                {MESSAGES_USER.name}
              </span>
              <span className="text-xs leading-5 text-text-table-header">{MESSAGES_USER.role}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="mt-4 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-button-primary text-sm font-semibold text-text-on-solid-bg transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            Create message
          </button>

          <p className="mt-6 px-1 text-xs font-[510] uppercase tracking-[0.4px] text-text-table-header">General</p>
          <nav className="mt-2 flex flex-col gap-1">
            {NAV.map((item) => {
              const active = item.id === section
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToSection(item.id)}
                  className={cn(
                    "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-[510] transition-colors",
                    active ? "bg-bg-nav-tab-active text-text-nav-tab-active" : "text-text-events-strong hover:bg-bg-default-100",
                  )}
                >
                  <Icon className={cn("size-4", active ? "text-text-nav-tab-active" : "text-icon-neutral")} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-bg-accent px-1 text-[11px] font-semibold text-text-on-solid-bg">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </nav>

          <div className="my-5 border-t border-border-default-100" />

          <p className="px-1 text-xs font-[510] uppercase tracking-[0.4px] text-text-table-header">Recent messages</p>
          <div className="mt-2 flex flex-col gap-1">
            {RECENT_MESSAGES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSection("inbox")
                  setSelectedId(r.id)
                }}
                className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-[510] text-text-events-strong transition-colors hover:bg-bg-default-100"
              >
                <PersonAvatar name={r.name} tone={r.avatarTone} imageUrl={r.avatarImage} size={20} />
                <span className="truncate">{r.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Middle: list */}
        <section className="flex w-[300px] shrink-0 flex-col border-r border-border-default-100 bg-bg-canvas">
          <div className="flex flex-col gap-3 px-4 pt-5">
            <h2 className="text-lg font-semibold leading-7 text-text-events-strong">{meta.title}</h2>
            <div className="flex gap-4 border-b border-border-default-100">
              <button
                type="button"
                onClick={() => setTab("all")}
                className={cn(
                  "type-events-tab relative cursor-pointer pb-2.5",
                  tab === "all"
                    ? "text-text-events-strong after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-bg-accent"
                    : "text-text-table-header hover:text-text-neutral-400",
                )}
              >
                All messages
              </button>
              {meta.showUnread ? (
                <button
                  type="button"
                  onClick={() => setTab("unread")}
                  className={cn(
                    "type-events-tab relative flex cursor-pointer items-center gap-1.5 pb-2.5",
                    tab === "unread"
                      ? "text-text-events-strong after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-bg-accent"
                      : "text-text-table-header hover:text-text-neutral-400",
                  )}
                >
                  Unread
                  {section === "inbox" && UNREAD_COUNT > 0 ? (
                    <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-bg-accent px-1 text-[11px] font-semibold text-text-on-solid-bg">
                      {UNREAD_COUNT}
                    </span>
                  ) : null}
                </button>
              ) : null}
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-icon-neutral" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={meta.search}
                className="h-9 w-full rounded-lg bg-bg-default-100 pl-9 pr-3 text-sm leading-[22px] text-text-events-strong outline-none placeholder:text-input-placeholder"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">{renderList()}</div>
        </section>

        {/* Right: thread */}
        <section className="min-w-0 flex-1 bg-bg-on-canvas">
          {section === "inbox" && selected ? (
            <ThreadView
              key={selected.id}
              conversation={selected}
              onViewProfile={() => navigate(`/volunteers/${selected.id}`)}
            />
          ) : (section === "broadcast" || section === "scheduled") && selectedGroup ? (
            <GroupThreadView
              key={selectedGroup.id}
              group={selectedGroup}
              mode={section === "broadcast" ? "broadcast" : "scheduled"}
              onDelete={deleteGroup}
              onSendInstantly={sendInstantly}
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center">
              <EmptyMessagesIllustration />
            </div>
          )}
        </section>
      </div>

      <CreateMessageModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={({ recipients, message, scheduled, date }) => {
          setCreateOpen(false)
          const stamp = `${conversations.length}-${message.length}`
          if (scheduled) {
            const group: MessageGroup = {
              id: `s-new-${stamp}`,
              title:
                recipients.length > 2
                  ? `${recipients[0].split(" ")[0]} and ${recipients.length - 1} others`
                  : recipients.join(", "),
              members: recipients.slice(0, 2).map((name) => ({ name, avatarTone: "orange" as const })),
              extra: Math.max(0, recipients.length - 2),
              preview: `You: ${message}`,
              time: date || "Scheduled",
              body: message,
            }
            setScheduledList((prev) => [group, ...prev])
            goToSection("scheduled")
            setSelectedGroupId(group.id)
            toast({ variant: "success", title: "Message scheduled" })
            return
          }
          const newConversations: Conversation[] = recipients.map((name, index) => ({
            id: `new-${stamp}-${index}`,
            name,
            role: "Volunteer",
            avatarTone: "orange",
            time: "Just now",
            preview: `You: ${message}`,
            unread: 0,
            messages: [{ id: "m1", from: "me", kind: "text", text: message }],
          }))
          setConversations((prev) => [...newConversations, ...prev])
          goToSection("inbox")
          setSelectedId(newConversations[0]?.id ?? null)
          toast({ variant: "success", title: "Message sent" })
        }}
      />
    </DashboardLayout>
  )
}

function NoResult() {
  return (
    <div className="flex flex-col items-center gap-1 px-4 pt-24 text-center">
      <p className="text-sm font-[510] text-text-events-strong">No result found</p>
      <p className="text-xs leading-5 text-text-table-header">We couldn&apos;t find any result based on the filter</p>
    </div>
  )
}
