import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { Button } from "../../ui/button"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"

const ACCEPT_TRAILING_ICON = (
  <EventIcon name="add-circle-fill" size={EVENT_ICON_SIZE.buttonTrailing} />
)

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
    <div className="flex w-full flex-col gap-2 overflow-hidden rounded-[10px] border border-bg-accent bg-bg-canvas p-0.5 pb-3.5 shadow-[0_0_0_2px_rgba(255,116,21,0.08)]">
      <div className="flex h-6 items-center rounded bg-bg-nav-tab-active px-3">
        <div className="flex items-center gap-1">
          <EventIcon name="group-fill" size={EVENT_ICON_SIZE.bannerLabel} />
          <span className="text-xs font-medium leading-5 text-text-nav-tab-active">
            Collaboration request
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-3.5">
        <p className="min-w-0 max-w-[255px] text-sm leading-[22px] text-text-events-strong">
          <span className="font-semibold">{inviterName}</span>
          <span className="font-normal tracking-[-0.1px]">
            {" "}
            has invited you to join this event as a collaborator
          </span>
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="primary"
            className="h-8 min-h-8 gap-1.5 rounded-[10px] px-3 text-sm"
            leftIcon={
              <EventIcon name="check-circle-fill" size={EVENT_ICON_SIZE.buttonLeading} />
            }
            rightIcon={ACCEPT_TRAILING_ICON}
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
                <EventIcon name="more-fill" size={EVENT_ICON_SIZE.buttonLeading} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[11rem]">
              <DropdownMenuItem
                className="text-text-events-strong focus:bg-bg-default-100"
                onSelect={() => onReject?.()}
              >
                <EventIcon
                  name="close-circle-fill"
                  size={EVENT_ICON_SIZE.dropdownItem}
                  className="text-icon-neutral"
                />
                Reject request
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
