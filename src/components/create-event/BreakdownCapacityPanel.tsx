import { Input } from "../ui/input"
import { Switch } from "../ui/switch"
import { sumSkillCapacities } from "../../lib/create-event-breakdown"
import {
  formatCapacityInputValue,
  parseCapacityInputValue,
  selectCapacityInputOnFocus,
} from "../../lib/capacity-input"
import { BreakdownCapacityCompleteIcon } from "./icons/BreakdownCapacityCompleteIcon"
import { BreakdownCapacityIncompleteIcon } from "./icons/BreakdownCapacityIncompleteIcon"
import {
  CREATE_EVENT_BREAKDOWN_PANEL_CLASS,
  CREATE_EVENT_INSET_PANEL_PADDING,
} from "./create-event-surface-styles"
import { cn } from "../../lib/utils"

export function BreakdownCapacityPanel({
  skills,
  skillCapacities,
  totalCapacity,
  checked,
  onCheckedChange,
  onSkillCapacityChange,
}: {
  skills: string[]
  skillCapacities: Record<string, number>
  totalCapacity: number
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  onSkillCapacityChange: (skill: string, value: number) => void
}) {
  const allocated = sumSkillCapacities(skillCapacities)
  const isComplete = allocated === totalCapacity && totalCapacity > 0
  const isOver = allocated > totalCapacity

  return (
    <div className={cn("flex w-full flex-col", CREATE_EVENT_BREAKDOWN_PANEL_CLASS)}>
      <div
        className={cn(
          "flex items-start justify-between gap-4",
          CREATE_EVENT_INSET_PANEL_PADDING,
          checked && skills.length > 0 && "pb-3",
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="type-events-tab text-text-events-strong">Breakdown capacity</p>
          <p className="type-create-event-caption">
            Specify the number of capacity you need per skills needed
          </p>
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} className="mt-0.5 shrink-0" />
      </div>

      {checked ? (
        <div className="flex flex-col gap-3 px-4 pb-3">
          {skills.length > 0 ? (
            <>
              <ul className="flex flex-col gap-2">
                {skills.map((skill) => (
                  <li key={skill} className="flex items-center justify-between gap-3">
                    <span className="type-events-tab min-w-0 flex-1 truncate text-text-events-strong">
                      {skill}
                    </span>
                    <Input
                      density="compact"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={formatCapacityInputValue(skillCapacities[skill] ?? 0)}
                      onChange={(event) =>
                        onSkillCapacityChange(skill, parseCapacityInputValue(event.target.value))
                      }
                      onFocus={selectCapacityInputOnFocus}
                      className="h-10 w-[140px] shrink-0 rounded-lg border-[#EDF0F2] bg-bg-canvas shadow-none [&_input]:px-3 [&_input]:text-left"
                      onClick={(event) => event.stopPropagation()}
                    />
                  </li>
                ))}
              </ul>

              <p
                className={cn(
                  "flex items-center gap-1.5 text-xs font-normal leading-5",
                  isComplete && "text-[#36b55c]",
                  isOver && "text-text-negative",
                  !isComplete && !isOver && "text-text-table-header",
                )}
              >
                {isComplete ? (
                  <BreakdownCapacityCompleteIcon className="size-3 shrink-0" />
                ) : (
                  <BreakdownCapacityIncompleteIcon className="size-3 shrink-0" />
                )}
                <span>
                  {allocated} of {totalCapacity} capacity specified
                </span>
              </p>
            </>
          ) : (
            <p className="text-xs leading-5 text-text-table-header">
              Add skills in the About step to breakdown capacity by skill.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
