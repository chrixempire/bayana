import { useState } from "react"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"
import { Switch } from "../ui/switch"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ProBadge } from "../create-event/ProBadge"
import { CreateEventFieldLabel } from "../create-event/CreateEventFieldLabel"
import { PersonAvatar } from "../events/detail/PersonAvatar"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { cn } from "../../lib/utils"

function startOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
}

export function CreateMessageModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (payload: { recipients: string[]; message: string; scheduled: boolean; date: string }) => void
}) {
  const [recipients, setRecipients] = useState<string[]>([])
  const [toInput, setToInput] = useState("")
  const [message, setMessage] = useState("")
  const [scheduled, setScheduled] = useState(false)
  const [date, setDate] = useState("")
  const [dateOpen, setDateOpen] = useState(false)
  const [dateValue, setDateValue] = useState<Date | undefined>()

  const addRecipient = () => {
    const value = toInput.trim()
    if (value && !recipients.includes(value)) setRecipients((prev) => [...prev, value])
    setToInput("")
  }
  const removeRecipient = (name: string) => setRecipients((prev) => prev.filter((r) => r !== name))

  const canCreate =
    recipients.length > 0 && message.trim().length > 0 && (!scheduled || date.trim().length > 0)

  const reset = () => {
    setRecipients([])
    setToInput("")
    setMessage("")
    setScheduled(false)
    setDate("")
    setDateValue(undefined)
    setDateOpen(false)
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
      title="New message"
      size="md"
      footer={
        <>
          <Button
            type="button"
            variant="neutral"
            className="rounded-xl"
            onClick={() => {
              reset()
              onClose()
            }}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="primary"
            className="rounded-xl"
            disabled={!canCreate}
            onClick={() => {
              onCreate({ recipients, message, scheduled, date })
              reset()
            }}
          >
            Create message
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 pb-2">
        <div className="flex flex-col gap-2">
          <CreateEventFieldLabel label="To" />
          <Input
            density="compact"
            value={toInput}
            onChange={(event) => setToInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault()
                addRecipient()
              }
            }}
            onBlur={addRecipient}
            placeholder="Volunteers and Team members"
          />
          {recipients.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {recipients.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-default-100 bg-bg-canvas py-1 pl-1 pr-2 text-sm font-medium text-text-events-strong shadow-input-default"
                >
                  <PersonAvatar name={name} tone="orange" size={20} />
                  {name}
                  <button
                    type="button"
                    aria-label={`Remove ${name}`}
                    onClick={() => removeRecipient(name)}
                    className="cursor-pointer text-icon-neutral hover:text-text-events-strong"
                  >
                    <EventIcon name="close-fill" size={EVENT_ICON_SIZE.composeAction} />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <CreateEventFieldLabel label="Message" />
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Enter message"
            className="min-h-[120px] rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={scheduled} onCheckedChange={setScheduled} />
          <span className="type-events-tab text-text-events-strong">Schedule message</span>
          <ProBadge />
        </div>

        {scheduled ? (
          <div className="flex flex-col gap-2">
            <CreateEventFieldLabel label="Date" />
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger
                className={cn(
                  "inline-flex h-10 w-full items-center justify-between gap-2 rounded-xl border bg-input-surface px-3 text-sm leading-[22px] shadow-input-default outline-none transition-colors hover:bg-bg-on-canvas focus-visible:border-border-input-active data-[state=open]:border-border-input-active",
                  date ? "border-border-input-default-200 text-text-events-strong" : "border-border-input-default-200 text-input-placeholder",
                )}
              >
                <span>{date || "DD / MM / YYYY"}</span>
                <EventIcon name="calendar-fill" size={EVENT_ICON_SIZE.nav} />
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-auto rounded-xl border border-border-default-100 bg-bg-dropdown-modal p-2 text-text-default-500 shadow-[0_8px_24px_rgba(44,50,55,0.12)]"
              >
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={(day) => {
                    setDateValue(day)
                    if (day) {
                      setDate(formatDate(day))
                      setDateOpen(false)
                    }
                  }}
                  numberOfMonths={1}
                  captionLayout="dropdown"
                  disabled={{ before: startOfToday() }}
                />
              </PopoverContent>
            </Popover>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}
