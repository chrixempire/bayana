import eventsTableData from "../../data/events-table.json"
import type { EventsPageConfig, EventsScenarioData, EventsTableScenario } from "./events-types"

export function parseEventsTableScenario(value: string | null): EventsTableScenario {
  return value === "filled" ? "filled" : "empty"
}

export function getEventsPageConfig(): EventsPageConfig {
  return eventsTableData.page as EventsPageConfig
}

export function getEventsScenarioData(scenario: EventsTableScenario): EventsScenarioData {
  return eventsTableData.scenarios[scenario] as EventsScenarioData
}
