import { useEffect, useState } from "react"
import { getCauseAreas } from "../lib/api/public"
import { getSkills } from "../lib/api/public"
import type { CauseFormLookups } from "../lib/api/cause-types"

type CauseLookupsState = {
  lookups: CauseFormLookups
  categoryOptions: string[]
  skillOptions: string[]
  isLoading: boolean
  error: string | null
}

const EMPTY_LOOKUPS: CauseFormLookups = {
  categoryIdByName: {},
  skillIdByName: {},
}

export function useCauseLookups(enabled = true): CauseLookupsState {
  const [lookups, setLookups] = useState<CauseFormLookups>(EMPTY_LOOKUPS)
  const [categoryOptions, setCategoryOptions] = useState<string[]>([])
  const [skillOptions, setSkillOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    void (async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [causeAreasResponse, skillsResponse] = await Promise.all([getCauseAreas(), getSkills()])

        if (cancelled) return

        const categoryIdByName = Object.fromEntries(
          causeAreasResponse.data.map((area) => [area.name, area.id] as const),
        )
        const skillIdByName = Object.fromEntries(
          skillsResponse.data.map((skill) => [skill.name, skill.id] as const),
        )

        setLookups({ categoryIdByName, skillIdByName })
        setCategoryOptions(causeAreasResponse.data.map((area) => area.name))
        setSkillOptions(skillsResponse.data.map((skill) => skill.name))
      } catch {
        if (cancelled) return
        setLookups(EMPTY_LOOKUPS)
        setCategoryOptions([])
        setSkillOptions([])
        setError("Unable to load categories and skills.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [enabled])

  return { lookups, categoryOptions, skillOptions, isLoading, error }
}
