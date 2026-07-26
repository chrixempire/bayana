import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"
import { PersonAvatar } from "../../components/events/detail/PersonAvatar"
import { EventIcon, type EventIconName } from "../../components/events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../components/events/icons/event-icon-sizes"
import { CreateMessageModal } from "../../components/messages/CreateMessageModal"
import { EmptyMessagesIllustration } from "../../components/messages/EmptyMessagesIllustration"
import { MessageActionButton } from "../../components/messages/MessageActionButton"
import { MessageComposeBar } from "../../components/messages/MessageComposeBar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { toast } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"
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

type NavItem = {
  id: Section
  label: string
  icon: EventIconName
  activeIcon?: EventIconName
  count?: number
}

const NAV: NavItem[] = [
  { id: "inbox", label: "Inbox", icon: "inbox-fill-neutral", activeIcon: "inbox-fill", count: 5 },
  { id: "volunteers", label: "Volunteers", icon: "user-3-fill" },
  { id: "team", label: "Team members", icon: "user-group-fill" },
  { id: "broadcast", label: "Broadcast message", icon: "horn-fill-neutral", activeIcon: "horn-fill" },
  { id: "scheduled", label: "Scheduled", icon: "calendar-fill" },
]

const SECTION_META: Record<Section, { title: string; search: string; showUnread: boolean }> = {
  inbox: { title: "Inbox", search: "Search messages", showUnread: true },
  volunteers: { title: "Volunteers", search: "Search volunteer", showUnread: true },
  team: { title: "Team members", search: "Search team member", showUnread: true },
  broadcast: { title: "Broadcast messages", search: "Search messages", showUnread: true },
  scheduled: { title: "Scheduled", search: "Search messages", showUnread: false },
}

function menuIcon(name: EventIconName, destructive = false) {
  return (
    <EventIcon
      name={name}
      size={EVENT_ICON_SIZE.dropdownItem}
      className={destructive ? "text-icon-negative" : undefined}
    />
  )
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
        className="relative block w-[320px] max-w-full cursor-pointer overflow-hidden rounded-2xl bg-bg-default-100 text-left"
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
          <EventIcon name="arrow-right-fill" size={EVENT_ICON_SIZE.nav} inverted />
        </span>
      </button>
    )
  }
  const mine = bubble.from === "me"
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-xl px-4 py-2.5 text-sm font-[510] leading-[22px] shadow-button-neutral",
          mine ? "bg-bg-canvas text-text-events-strong" : "bg-bg-default-100 text-text-events-strong",
        )}
      >
        {bubble.text}
      </div>
    </div>
  )
}

function ThreadView({ conversation, onViewProfile }: { conversation: Conversation; onViewProfile: () => void }) {
  const [draft, setDraft] = useState("")
  const [messages, setMessages] = useState<MessageBubble[]>(() => conversation.messages)

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: `sent-${prev.length}-${text.length}`, from: "me", kind: "text", text },
    ])
    setDraft("")
  }

  const attachFile = (file: File) => {
    setMessages((prev) => [
      ...prev,
      { id: `file-${prev.length}`, from: "me", kind: "text", text: `📎 ${file.name}` },
    ])
  }

  return (
    <div className="flex size-full flex-col bg-bg-on-canvas">
      <div className="flex h-24 items-center gap-2 border-b border-border-default-100 bg-bg-canvas px-6 py-6">
        <PersonAvatar name={conversation.name} tone={conversation.avatarTone} imageUrl={conversation.avatarImage} size={40} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-2xl font-display font-semibold leading-8 tracking-[-0.1px] text-text-events-strong">
            {conversation.name}
          </p>
          <p className="text-xs leading-5 text-text-table-header">{conversation.role}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MessageActionButton leadingIcon={menuIcon("more-1-fill")}>View profile</MessageActionButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[11rem]">
            <DropdownMenuItem onSelect={onViewProfile}>
              {menuIcon("eye-fill")}
              View profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-6 py-4">
        <div className="mb-1 flex items-center gap-2">
          <PersonAvatar name={conversation.name} tone={conversation.avatarTone} imageUrl={conversation.avatarImage} size={24} />
          <span className="text-xs font-[510] text-text-events-strong">{conversation.name}</span>
          <span className="text-xs text-text-table-header">{conversation.messages[0]?.time ?? ""}</span>
        </div>
        {messages.map((bubble) => (
          <Bubble key={bubble.id} bubble={bubble} />
        ))}
      </div>

      <div className="px-6 pb-6 pt-4">
        <MessageComposeBar
          value={draft}
          onChange={setDraft}
          onSend={send}
          onAttach={attachFile}
          placeholder="Send a message"
        />
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
  const title = group.members.map((m) => m.name).join(", ")

  return (
    <div className="flex size-full flex-col bg-bg-on-canvas">
      <div className="flex h-24 items-center gap-2 border-b border-border-default-100 bg-bg-canvas px-6 py-6">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-0.5 truncate text-2xl font-display font-semibold leading-8 tracking-[-0.1px] text-text-events-strong">
            <span className="truncate">{title}</span>
            <EventIcon name="down-fill" size={EVENT_ICON_SIZE.nav} className="shrink-0" />
          </p>
          <p className="text-xs leading-5 text-text-table-header">{subtitle}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MessageActionButton leadingIcon={menuIcon("more-1-fill")}>
              {mode === "broadcast" ? "View profile" : "Actions"}
            </MessageActionButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[11rem]">
            {mode === "scheduled" ? (
              <DropdownMenuItem onSelect={onSendInstantly}>
                {menuIcon("arrow-up-fill-neutral")}
                Send instantly
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem className="text-text-negative focus:bg-bg-negative-soft" onSelect={onDelete}>
              {menuIcon("delete-fill", true)}
              {mode === "broadcast" ? "Delete broadcast" : "Delete message"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-6 py-4">
        <div className="mb-1 flex items-center justify-end gap-2">
          <span className="text-xs font-[510] text-text-events-strong">You</span>
          <span className="text-xs text-text-table-header">{group.time}</span>
          <PersonAvatar name={MESSAGES_USER.name} tone={MESSAGES_USER.tone} size={24} />
        </div>
        <div className="flex justify-end">
          <div className="max-w-[70%] whitespace-pre-line rounded-xl bg-bg-canvas px-4 py-2.5 text-sm font-[510] leading-[22px] text-text-events-strong shadow-button-neutral">
            {group.body}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        <MessageComposeBar readOnly placeholder="Send a message" />
      </div>
    </div>
  )
}

function PersonRow({ person, onClick }: { person: MessagePerson; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 border-b border-border-default-100/70 px-6 py-3 text-left transition-colors hover:bg-bg-default-100/60"
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
        "flex w-full cursor-pointer items-start gap-3 px-6 py-3 text-left transition-colors",
        active ? "bg-bg-nav-tab-active" : "hover:bg-bg-default-100/60",
      )}
    >
      <AvatarStack members={group.members} extra={group.extra} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-[510] text-text-events-strong">{group.title}</span>
          <span className="flex shrink-0 items-center gap-1 text-xs text-text-table-header">
            {scheduled ? <EventIcon name="time-fill" size={EVENT_ICON_SIZE.composeAction} /> : null}
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
          <PersonRow
            key={p.id}
            person={p}
            onClick={() => toast({ title: "Coming soon", description: `Start a conversation with ${p.name}.` })}
          />
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
    if (filteredConversations.length === 0) {
      return q || tab === "unread" ? (
        <NoResult />
      ) : (
        <div className="flex flex-col items-center gap-1 px-6 pt-24 text-center">
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
            "flex w-full cursor-pointer items-start gap-3 px-6 py-3 text-left transition-colors",
            active ? "bg-bg-nav-tab-active" : "hover:bg-bg-default-100/60",
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
                <span className="inline-flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-bg-accent px-1 text-[11px] font-semibold text-text-on-solid-bg">
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
        {/* Left sidebar — Figma 300px */}
        <aside className="flex w-[300px] shrink-0 flex-col border-r border-border-default-100 bg-bg-canvas pt-6">
          <div className="flex flex-col gap-6 pl-8 pr-5">
            <div className="flex flex-col gap-4 px-2">
              <div className="flex items-center gap-2">
                <PersonAvatar name={MESSAGES_USER.name} tone={MESSAGES_USER.tone} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-[22px] text-text-events-strong">
                    {MESSAGES_USER.name}
                  </p>
                  <p className="text-sm leading-[22px] text-text-table-header">{MESSAGES_USER.role}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex h-8 w-fit cursor-pointer items-center justify-center rounded-[10px] bg-button-primary px-3 text-sm font-semibold leading-[22px] text-text-on-solid-bg shadow-button-primary transition-opacity hover:opacity-90"
              >
                Create message
              </button>
            </div>

            <div className="px-2">
              <div className="h-px bg-border-default-100" />
            </div>

            <div className="flex flex-col gap-3">
              <p className="px-2 text-xs font-[510] leading-5 text-text-table-header">General</p>
              <nav className="flex flex-col gap-1">
                {NAV.map((item) => {
                  const active = item.id === section
                  const iconName = active && item.activeIcon ? item.activeIcon : item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goToSection(item.id)}
                      className={cn(
                        "flex h-8 cursor-pointer items-center gap-1 rounded-lg p-2 text-sm transition-colors",
                        active
                          ? "bg-bg-nav-tab-active font-semibold text-text-nav-tab-active"
                          : "font-[510] text-text-events-strong hover:bg-bg-default-100",
                      )}
                    >
                      <EventIcon name={iconName} size={EVENT_ICON_SIZE.nav} />
                      <span className="flex-1 truncate px-1 text-left">{item.label}</span>
                      {item.count ? (
                        <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-bg-accent px-1 text-[11px] font-semibold text-text-on-solid-bg">
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 px-10">
            <p className="px-2 text-xs font-[510] leading-5 text-text-table-header">Recent messages</p>
            <div className="flex flex-col gap-1">
              {RECENT_MESSAGES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSection("inbox")
                    setSelectedId(r.id)
                  }}
                  className="flex h-8 w-full cursor-pointer items-center gap-1 rounded-lg p-2 text-left text-sm font-[510] text-text-events-strong transition-colors hover:bg-bg-default-100"
                >
                  <PersonAvatar
                    name={r.name}
                    tone={r.avatarTone}
                    imageUrl={r.avatarImage}
                    size={20}
                    className="cursor-pointer"
                  />
                  <span className="cursor-pointer truncate px-1">{r.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Middle list — Figma 340px */}
        <section className="flex w-[340px] shrink-0 flex-col border-r border-border-default-100 bg-bg-canvas">
          <div className="flex flex-col">
            <div className="flex h-14 items-end px-6 pb-2 pt-6">
              <h2 className="text-base font-semibold leading-6 text-text-events-strong">{meta.title}</h2>
            </div>
            <div className="flex h-10 items-center gap-4 border-b border-border-default-100 px-6">
              <button
                type="button"
                onClick={() => setTab("all")}
                className={cn(
                  "relative flex h-10 cursor-pointer items-center py-2 text-sm font-[510] leading-[22px]",
                  tab === "all"
                    ? "border-b-2 border-border-input-active text-text-events-strong"
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
                    "relative flex h-10 cursor-pointer items-center gap-2 py-2 text-sm font-[510] leading-[22px]",
                    tab === "unread"
                      ? "border-b-2 border-border-input-active text-text-events-strong"
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
            <div className="px-6 py-4">
              <div className="flex h-8 items-center gap-2 rounded-[10px] bg-bg-default-100 px-3">
                <EventIcon name="search-line" size={EVENT_ICON_SIZE.search} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={meta.search}
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm leading-[22px] text-text-events-strong outline-none placeholder:text-input-placeholder"
                />
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">{renderList()}</div>
        </section>

        {/* Right thread pane */}
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
    <div className="flex flex-col items-center gap-1 px-6 pt-24 text-center">
      <p className="text-sm font-[510] text-text-events-strong">No result found</p>
      <p className="text-xs leading-5 text-text-table-header">We couldn&apos;t find any result based on the filter</p>
    </div>
  )
}
