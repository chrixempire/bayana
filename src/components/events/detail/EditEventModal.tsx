import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Modal } from "../../ui/modal"
import { DetailChip } from "./detail-primitives"
import { ImageUploader } from "./ImageUploader"
import type { EventDetail } from "../../../pages/dashboard/event-detail-types"

export type EventEditPatch = {
  title: string
  description: string
  requirements: string[]
  contact: string
  coverImages: string[]
}

type Section = "basic" | "about" | "settings"

const SECTIONS: Array<{ id: Section; label: string }> = [
  { id: "basic", label: "Basic details" },
  { id: "about", label: "About this cause" },
  { id: "settings", label: "Cause settings" },
]

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-[510] leading-[22px] text-input-label">
        {label} {required ? <span className="text-text-negative">*</span> : null}
      </label>
      {children}
    </div>
  )
}

export function EditEventModal({
  open,
  onClose,
  event,
  onSave,
}: {
  open: boolean
  onClose: () => void
  event: EventDetail
  onSave: (patch: EventEditPatch) => void
}) {
  const [section, setSection] = useState<Section>("basic")
  const [title, setTitle] = useState(event.title)
  const [description, setDescription] = useState(event.about.description)
  const [requirements, setRequirements] = useState(event.about.requirements.join("\n"))
  const [contact, setContact] = useState(event.meta.find((row) => row.id === "contact")?.value ?? "")
  const [images, setImages] = useState<string[]>(event.coverImages)
  const [coverIndex, setCoverIndex] = useState(0)
  const [wasOpen, setWasOpen] = useState(open)

  // Re-seed the form whenever a fresh edit session opens (render-time reset).
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setSection("basic")
      setTitle(event.title)
      setDescription(event.about.description)
      setRequirements(event.about.requirements.join("\n"))
      setContact(event.meta.find((row) => row.id === "contact")?.value ?? "")
      setImages(event.coverImages)
      setCoverIndex(0)
    }
  }

  const wordCount = title.trim() ? title.trim().split(/\s+/).length : 0
  const truncatedTitle = event.title.length > 34 ? `${event.title.slice(0, 34)}…` : event.title

  const save = () => {
    const ordered =
      coverIndex > 0 && images[coverIndex]
        ? [images[coverIndex], ...images.filter((_, i) => i !== coverIndex)]
        : images
    onSave({
      title: title.trim() || event.title,
      description,
      requirements: requirements
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      contact,
      coverImages: ordered,
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit event - ${truncatedTitle}`}
      size="full"
      flushBody
      className="max-h-[92vh]"
      footer={
        <>
          <Button variant="neutral" size="sm" className="rounded-[10px]" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" className="rounded-[10px]" onClick={save}>
            Save changes
          </Button>
        </>
      }
    >
      <div className="flex flex-col md:flex-row">
        <div className="flex gap-1 border-b border-border-default-100 p-4 md:w-[220px] md:shrink-0 md:flex-col md:border-b-0 md:border-r">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-[510] transition-colors",
                section === item.id
                  ? "bg-bg-nav-tab-active text-text-nav-tab-active"
                  : "text-text-table-header hover:bg-bg-default-100",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          {section === "basic" ? (
            <>
              <Field label="Title" required>
                <Input density="compact" value={title} onChange={(e) => setTitle(e.target.value)} />
                <span className="flex items-center gap-1 text-xs font-[510] text-text-success">
                  <CheckCircle2 className="size-3.5" />
                  {wordCount}/{wordCount} words
                </span>
              </Field>

              <Field label="Image" required>
                <p className="-mt-0.5 text-xs leading-5 text-text-table-header">
                  This helps volunteers have a visual about this cause. You can upload up to 4 images.
                  One will be your cover image
                </p>
                <ImageUploader
                  images={images}
                  coverIndex={coverIndex}
                  onImagesChange={setImages}
                  onCoverChange={setCoverIndex}
                />
              </Field>
            </>
          ) : null}

          {section === "about" ? (
            <>
              <Field label="Description">
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
              </Field>
              <Field label="Category">
                <div className="flex flex-wrap gap-1.5">
                  {event.about.categories.map((category) => (
                    <DetailChip key={category}>{category}</DetailChip>
                  ))}
                </div>
              </Field>
              <Field label="Requirements">
                <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={4} />
              </Field>
              <Field label="Skills needed">
                <div className="flex flex-wrap gap-1.5">
                  {event.about.skills.map((skill) => (
                    <DetailChip key={skill}>{skill}</DetailChip>
                  ))}
                </div>
              </Field>
            </>
          ) : null}

          {section === "settings" ? (
            <>
              <Field label="Date">
                <Input density="compact" defaultValue={event.meta.find((r) => r.id === "date")?.value} />
              </Field>
              <Field label="Visibility">
                <Input density="compact" defaultValue={event.meta.find((r) => r.id === "visibility")?.value} />
              </Field>
              <Field label="Volunteering type">
                <Input density="compact" defaultValue={event.meta.find((r) => r.id === "type")?.value} />
              </Field>
              <Field label="Contact person">
                <Input density="compact" value={contact} onChange={(e) => setContact(e.target.value)} />
              </Field>
            </>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
