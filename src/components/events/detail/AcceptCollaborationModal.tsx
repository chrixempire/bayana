import { useState } from "react"
import { Modal } from "../../ui/modal"
import { Button } from "../../ui/button"
import { SearchableSelect } from "../../create-event/SearchableSelect"
import { CREATE_EVENT_ORGANIZERS } from "../../../data/create-event-settings"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"

export function AcceptCollaborationModal({
  open,
  onClose,
  onAccept,
}: {
  open: boolean
  onClose: () => void
  onAccept: (organizer: string) => void
}) {
  const [organizer, setOrganizer] = useState<string>(CREATE_EVENT_ORGANIZERS[0])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Accept collaboration request"
      size="sm"
      footer={
        <>
          <Button type="button" variant="neutral" className="rounded-xl" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            variant="primary"
            className="rounded-xl"
            disabled={!organizer.trim()}
            onClick={() => onAccept(organizer)}
          >
            Accept request
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 pb-2">
        <p className="text-sm leading-[22px] text-text-table-header">
          You&apos;re about to accept this collaboration request. This means that you are going to
          join this event as a collaborator.
        </p>
        <p className="text-sm leading-[22px] text-text-table-header">
          Choose someone to serve as a contact person for your organization on this event
        </p>
        <div className="flex flex-col gap-2">
          <label className="type-create-event-field-label text-text-events-strong">
            Organizer <span className="text-text-negative">*</span>
          </label>
          <SearchableSelect
            value={organizer}
            onChange={setOrganizer}
            options={CREATE_EVENT_ORGANIZERS}
            searchPlaceholder="Search organizer"
            ariaLabel="Organizer"
          />
          <p className="flex items-start gap-1.5 text-xs leading-5 text-text-table-header">
            <EventIcon name="info-fill" size={EVENT_ICON_SIZE.fieldHint} className="mt-0.5" />
            This person will serve as a contact person for this event
          </p>
        </div>
      </div>
    </Modal>
  )
}
