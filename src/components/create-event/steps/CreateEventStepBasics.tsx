import { Input } from "../../ui/input"
import { CauseImageUpload } from "../CauseImageUpload"
import { CreateEventFieldLabel } from "../CreateEventFieldLabel"
import { CreateEventStepHeading } from "../CreateEventStepHeading"
import { CREATE_EVENT_TITLE_MAX_WORDS } from "../../../pages/dashboard/create-event-types"
import type { CreateEventFormState } from "../../../pages/dashboard/create-event-types"
import type { CreateEventType } from "../../../lib/create-event-paths"

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function CreateEventStepBasics({
  eventType,
  form,
  onChange,
  onBack,
}: {
  eventType: CreateEventType
  form: CreateEventFormState
  onChange: (patch: Partial<CreateEventFormState>) => void
  onBack: () => void
}) {
  const wordCount = countWords(form.title)
  const titleOverLimit = wordCount > CREATE_EVENT_TITLE_MAX_WORDS
  const titleValid = wordCount > 0 && !titleOverLimit
  const noun = eventType === "needs" ? "need" : "cause"

  return (
    <div className="flex w-full flex-col gap-4">
      <CreateEventStepHeading
        onBack={onBack}
        title="First of all..."
        subtitle={`Provide the title and cover image of this ${noun}`}
      />

      <div className="flex flex-col gap-2">
        <CreateEventFieldLabel label="Title" required />
        <Input
          density="compact"
          value={form.title}
          invalid={titleOverLimit}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder={`Enter ${noun} title`}
        />
        {titleOverLimit ? (
          <p className="text-xs leading-5 text-text-negative">
            Title must be {CREATE_EVENT_TITLE_MAX_WORDS} words or fewer
          </p>
        ) : titleValid ? (
          <p className="text-xs leading-5 text-[#36b55c]">
            {wordCount}/{CREATE_EVENT_TITLE_MAX_WORDS} words
          </p>
        ) : (
          <p className="type-create-event-caption">
            {wordCount}/{CREATE_EVENT_TITLE_MAX_WORDS} words
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <CreateEventFieldLabel label="Image" required />
        <p className="type-create-event-caption">
          This helps volunteers have a visual about this {noun}. You can upload up to 4 images. One will be your
          cover image.
        </p>
        <CauseImageUpload images={form.images} onChange={(images) => onChange({ images })} />
      </div>
    </div>
  )
}
