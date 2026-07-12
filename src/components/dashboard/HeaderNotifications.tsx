import { useState } from "react"
import {
  Banknote,
  Bell,
  CheckCircle2,
  Clock,
  Gift,
  MessageSquare,
  Settings,
  Star,
  Users,
  UserPlus,
  X,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "../../lib/utils"
import { NOTIFICATIONS, type NotificationGroup, type NotificationIcon } from "./header-data"

const ICON_MAP: Record<NotificationIcon, { Icon: typeof Bell; tone: string }> = {
  "event-complete": { Icon: CheckCircle2, tone: "bg-bg-success-soft text-text-success" },
  reminder: { Icon: Clock, tone: "bg-bg-accent-soft text-bg-accent" },
  donation: { Icon: Gift, tone: "bg-bg-success-soft text-text-success" },
  volunteer: { Icon: UserPlus, tone: "bg-bg-info-soft text-text-info" },
  collaboration: { Icon: Users, tone: "bg-bg-accent-soft text-bg-accent" },
  message: { Icon: MessageSquare, tone: "bg-bg-info-soft text-text-info" },
  payout: { Icon: Banknote, tone: "bg-bg-success-soft text-text-success" },
  ratings: { Icon: Star, tone: "bg-bg-warning-soft text-text-warning" },
}

const GROUPS: NotificationGroup[] = ["Today", "Yesterday", "Older"]

export function HeaderNotifications() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"all" | "unread">("all")

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length
  const visible = NOTIFICATIONS.filter((n) => (tab === "unread" ? n.unread : true))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label="Notifications"
        className="relative inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-text-on-solid-bg transition-colors hover:bg-bg-on-nav outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <Bell className="size-5" />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-button-negative" aria-hidden />
        ) : null}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={12}
        className="flex max-h-[560px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border-default-100 bg-bg-dropdown-modal p-0 text-text-default-500 shadow-[0_16px_48px_rgba(44,50,55,0.16)]"
      >
        <div className="flex items-center justify-between px-4 pt-4">
          <h3 className="font-display text-lg font-semibold leading-6 text-text-events-strong">Notifications</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="inline-flex size-7 items-center justify-center rounded-full bg-bg-default-100 text-icon-neutral transition-colors hover:bg-bg-active-200"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 border-b border-border-default-100 px-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setTab("all")}
              className={cn(
                "type-events-tab relative flex items-center gap-1.5 pb-2.5 pt-2",
                tab === "all"
                  ? "text-text-events-strong after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-bg-accent"
                  : "text-text-table-header hover:text-text-neutral-400",
              )}
            >
              All notifications
              {unreadCount > 0 ? (
                <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-bg-accent px-1 text-[11px] font-semibold text-text-on-solid-bg">
                  {unreadCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setTab("unread")}
              className={cn(
                "type-events-tab relative pb-2.5 pt-2",
                tab === "unread"
                  ? "text-text-events-strong after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-bg-accent"
                  : "text-text-table-header hover:text-text-neutral-400",
              )}
            >
              Unread
            </button>
          </div>
          <button
            type="button"
            aria-label="Notification settings"
            className="inline-flex size-7 items-center justify-center rounded-lg text-icon-neutral transition-colors hover:bg-bg-default-100"
          >
            <Settings className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto py-1">
          {GROUPS.map((group) => {
            const items = visible.filter((n) => n.group === group)
            if (!items.length) return null
            return (
              <div key={group}>
                <p className="px-4 pb-1 pt-3 text-xs font-medium text-text-table-header">{group}</p>
                {items.map((item) => {
                  const { Icon, tone } = ICON_MAP[item.icon]
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-bg-default-100/60",
                        item.unread && "bg-bg-accent-soft/40",
                      )}
                    >
                      <span className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-full", tone)}>
                        <Icon className="size-4" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-[510] text-text-events-strong">{item.title}</span>
                          <span className="shrink-0 text-xs text-text-table-header">{item.time}</span>
                        </div>
                        <span className="text-xs leading-5 text-text-table-header">{item.description}</span>
                      </div>
                      {item.unread ? (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-bg-accent" aria-hidden />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            )
          })}
          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-1 px-4 py-16 text-center">
              <p className="text-sm font-[510] text-text-events-strong">No notifications</p>
              <p className="text-xs leading-5 text-text-table-header">You&apos;re all caught up</p>
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
