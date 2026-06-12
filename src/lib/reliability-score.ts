export const RELIABILITY_SCORE_MIN = 10
export const RELIABILITY_SCORE_MAX = 95

export function clampReliabilityScore(value: number): number {
  return Math.min(RELIABILITY_SCORE_MAX, Math.max(RELIABILITY_SCORE_MIN, Math.round(value)))
}
