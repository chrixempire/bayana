import { MoreHorizontal, UserPlus, X } from "lucide-react"
import { Button } from "../../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"

export function CollaborationRequestBanner({
  inviterName,
  onAccept,
  onReject,
}: {
  inviterName: string
  onAccept?: () => void
  onReject?: () => void
}) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-dashed border-border-input-active bg-bg-accent-soft/40 p-3">
      <div className="flex items-center gap-1.5 text-text-nav-tab-active">
        <UserPlus className="size-3.5" aria-hidden />
        <span className="text-xs font-[510] leading-4">Collaboration request</span>
      </div>
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 flex-1 text-sm leading-[22px] text-text-events-strong">
          <span className="font-semibold">{inviterName}</span> has invited you to join this event as
          a collaborator
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            variant="primary"
            className="h-8 min-h-8 gap-1.5 rounded-[10px] px-3 text-sm"
            leftIcon={<span className="text-base leading-none">✓</span>}
            onClick={onAccept}
          >
            Accept
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="neutral"
                className="h-8 min-h-8 w-9 rounded-[10px] px-0"
                aria-label="Collaboration request actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[11rem]">
              <DropdownMenuItem
                className="text-text-negative focus:bg-bg-negative-soft"
                onSelect={() => onReject?.()}
              >
                <X className="size-4 text-icon-negative" />
                Reject request
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
