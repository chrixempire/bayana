import { useEffect, useMemo, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import { Textarea } from "../../ui/textarea"
import { Input } from "../../ui/input"
import { CategoryTagPicker } from "../CategoryTagPicker"
import { CreateEventFieldLabel } from "../CreateEventFieldLabel"
import { CreateEventStepHeading } from "../CreateEventStepHeading"
import { CREATE_EVENT_SKILL_SUGGESTIONS } from "../../../data/create-event-options"
import type { CreateEventFormState } from "../../../pages/dashboard/create-event-types"
import type { CreateEventType } from "../../../lib/create-event-paths"
import { Popover, PopoverAnchor, PopoverContent } from "../../ui/popover"
import { ListScrollFadeHint } from "../../ui/list-scroll-fade-hint"
import { SelectedSkillChip } from "../../ui/selected-skill-chip"
import { useAnchorWidth } from "../../../hooks/use-anchor-width"
import { cn } from "../../../lib/utils"

export function CreateEventStepAbout({
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
  const [skillInput, setSkillInput] = useState("")
  const [skillsFocused, setSkillsFocused] = useState(false)
  const [highlightedSkillIndex, setHighlightedSkillIndex] = useState(-1)
  const skillsAnchorRef = useRef<HTMLDivElement>(null)
  const skillsListRef = useRef<HTMLUListElement>(null)
  const skillInputRef = useRef<HTMLInputElement>(null)
  const skillOptionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const noun = eventType === "needs" ? "need" : "cause"

  const skillSuggestions = useMemo(() => {
    const query = skillInput.trim().toLowerCase()
    const pool = CREATE_EVENT_SKILL_SUGGESTIONS.filter((skill) => !form.skills.includes(skill))
    if (!query) return pool
    return pool.filter((skill) => skill.toLowerCase().includes(query))
  }, [form.skills, skillInput])

  const resetSkillHighlight = () => {
    setHighlightedSkillIndex(-1)
    skillOptionRefs.current = []
  }

  const addSkill = (skill: string) => {
    if (form.skills.includes(skill) || form.skills.length >= 10) return
    onChange({ skills: [...form.skills, skill] })
    setSkillInput("")
    resetSkillHighlight()
  }

  const removeSkill = (skill: string) => {
    onChange({ skills: form.skills.filter((item) => item !== skill) })
    resetSkillHighlight()
  }

  const commitSkillInput = () => {
    const value = skillInput.trim()
    if (!value) return
    value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((skill) => addSkill(skill))
    setSkillInput("")
  }

  const showSkillsList = skillsFocused && skillSuggestions.length > 0
  const skillsPanelWidth = useAnchorWidth(showSkillsList, skillsAnchorRef)

  const closeSkillsList = () => {
    setSkillsFocused(false)
    setHighlightedSkillIndex(-1)
  }

  const handleSkillsKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const count = skillSuggestions.length

    if (event.key === "ArrowDown" && showSkillsList) {
      event.preventDefault()
      setHighlightedSkillIndex((index) => Math.min(index + 1, count - 1))
      return
    }

    if (event.key === "ArrowUp" && showSkillsList) {
      event.preventDefault()
      setHighlightedSkillIndex((index) => Math.max(index - 1, -1))
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      if (highlightedSkillIndex >= 0 && skillSuggestions[highlightedSkillIndex]) {
        addSkill(skillSuggestions[highlightedSkillIndex])
        setHighlightedSkillIndex(-1)
        return
      }
      commitSkillInput()
      return
    }

    if (event.key === ",") {
      event.preventDefault()
      commitSkillInput()
      return
    }

    if (event.key === "Escape" && showSkillsList) {
      event.preventDefault()
      closeSkillsList()
    }
  }

  useEffect(() => {
    if (highlightedSkillIndex < 0) return
    skillOptionRefs.current[highlightedSkillIndex]?.scrollIntoView({ block: "nearest" })
  }, [highlightedSkillIndex])

  const activeSkillOptionId =
    highlightedSkillIndex >= 0 && skillSuggestions[highlightedSkillIndex]
      ? `skill-option-${highlightedSkillIndex}`
      : undefined

  return (
    <div className="flex w-full flex-col gap-4">
      <CreateEventStepHeading
        onBack={onBack}
        title={`About this ${noun}`}
        subtitle={`Provide the basic details about this ${noun}`}
      />

      <div className="flex flex-col gap-2">
        <CreateEventFieldLabel label="Description" required />
        <Textarea
          value={form.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder={`Enter what this ${noun} is all about`}
          className="min-h-[120px] rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <CreateEventFieldLabel label="Category" required />
        <CategoryTagPicker value={form.categories} onChange={(categories) => onChange({ categories })} />
      </div>

      <div className="flex flex-col gap-2">
        <CreateEventFieldLabel label="Requirements" required />
        <Textarea
          value={form.requirements}
          onChange={(event) => onChange({ requirements: event.target.value })}
          placeholder={`Enter any requirements to volunteer for this ${noun}`}
          className="min-h-[120px] rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <CreateEventFieldLabel label="Skills needed" required />
        <p className="text-xs leading-5 text-text-table-header">
          Add up to 10 skills needed from volunteers. Use comma to separate skills or choose from list
        </p>

        {form.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <SelectedSkillChip
                key={skill}
                label={skill}
                onRemove={() => removeSkill(skill)}
              />
            ))}
          </div>
        ) : null}

        <Popover open={showSkillsList} onOpenChange={(open) => !open && closeSkillsList()} modal={false}>
          <PopoverAnchor asChild>
            <div ref={skillsAnchorRef} className="w-full">
              <Input
                ref={skillInputRef}
                density="compact"
                value={skillInput}
                onFocus={() => setSkillsFocused(true)}
                onChange={(event) => {
                  setSkillInput(event.target.value)
                  resetSkillHighlight()
                }}
                onKeyDown={handleSkillsKeyDown}
                placeholder="Type skills"
                role="combobox"
                aria-expanded={showSkillsList}
                aria-controls={showSkillsList ? "skills-listbox" : undefined}
                aria-activedescendant={activeSkillOptionId}
                autoComplete="off"
              />
            </div>
          </PopoverAnchor>

          <PopoverContent
            style={skillsPanelWidth ? { width: skillsPanelWidth } : undefined}
            className="overflow-hidden rounded-xl border border-border-default-100 bg-bg-canvas p-0.5 shadow-[0_8px_24px_rgba(44,50,55,0.12)]"
            onOpenAutoFocus={(event) => event.preventDefault()}
            onInteractOutside={(event) => {
              if (skillsAnchorRef.current?.contains(event.target as Node)) {
                event.preventDefault()
              }
            }}
          >
            <ul
              ref={skillsListRef}
              id="skills-listbox"
              role="listbox"
              aria-label="Skill suggestions"
              className="flex max-h-[min(200px,var(--radix-popover-content-available-height))] flex-col gap-1 overflow-y-auto p-0.5 pb-10 pt-0.5"
            >
              {skillSuggestions.map((skill, index) => {
                const highlighted = highlightedSkillIndex === index

                return (
                  <li key={skill} role="presentation">
                    <button
                      ref={(node) => {
                        skillOptionRefs.current[index] = node
                      }}
                      id={`skill-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={false}
                      className={cn(
                        "type-events-tab flex w-full cursor-pointer rounded-lg p-2 text-left text-text-events-strong transition-colors",
                        highlighted ? "bg-[#EDF0F2]" : "hover:bg-[#EDF0F2]",
                      )}
                      onMouseEnter={() => setHighlightedSkillIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        addSkill(skill)
                        setHighlightedSkillIndex(-1)
                        skillInputRef.current?.focus()
                      }}
                    >
                      {skill}
                    </button>
                  </li>
                )
              })}
            </ul>
            <ListScrollFadeHint
              listRef={skillsListRef}
              deps={[skillSuggestions.length, skillInput]}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
