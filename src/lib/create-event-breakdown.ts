export function syncSkillCapacities(
  skills: string[],
  existing: Record<string, number>,
): Record<string, number> {
  const next: Record<string, number> = {}
  for (const skill of skills) {
    next[skill] = existing[skill] ?? 0
  }
  return next
}

export function sumSkillCapacities(skillCapacities: Record<string, number>): number {
  return Object.values(skillCapacities).reduce((total, value) => total + value, 0)
}
