import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { CauseImageUpload } from "../CauseImageUpload"
import { CategoryTagPicker } from "../CategoryTagPicker"
import { CreateEventFieldLabel } from "../CreateEventFieldLabel"
import { CREATE_EVENT_TITLE_MAX_WORDS } from "../../../pages/dashboard/create-event-types"
import type { CreateEventFormState } from "../../../pages/dashboard/create-event-types"

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function CreateEventNeedsStepBasics({
  form,
  onChange,
}: {
  form: CreateEventFormState
  onChange: (patch: Partial<CreateEventFormState>) => void
}) {
  const wordCount = countWords(form.title)
  const titleOverLimit = wordCount > CREATE_EVENT_TITLE_MAX_WORDS
  const titleValid = wordCount > 0 && !titleOverLimit

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold leading-8 tracking-[-0.2px] text-text-events-strong">
          Basic information
        </h2>
        <p className="type-create-event-subtitle">
          Provide the basic information required for this need
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <CreateEventFieldLabel label="Title" required />
        <Input
          density="compact"
          value={form.title}
          invalid={titleOverLimit}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="Enter need title"
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
        <CreateEventFieldLabel label="Description" required />
        <Textarea
          value={form.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="Enter description"
          className="min-h-[120px] rounded-xl"
        />
        <p className="type-create-event-caption">Problems, Beneficiaries, Intended impact</p>
      </div>

      <div className="flex flex-col gap-2">
        <CreateEventFieldLabel label="Category" required />
        <CategoryTagPicker value={form.categories} onChange={(categories) => onChange({ categories })} />
      </div>

      <div className="flex flex-col gap-2">
        <CreateEventFieldLabel label="Visibility image" required />
        <p className="type-create-event-caption">
          This helps donors have a visual about this need. You can upload up to 4 images. One will be
          your cover image
        </p>
        <CauseImageUpload images={form.images} onChange={(images) => onChange({ images })} />
      </div>
    </div>
  )
}
