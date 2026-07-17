import { useSearchParams } from "react-router-dom"
import { GettingStartedIntroVideo } from "../../components/dashboard/GettingStartedIntroVideo"
import { SetupTaskCard } from "../../components/dashboard/SetupTaskCard"
import { DashboardContent, DashboardLayout } from "../../components/dashboard/DashboardLayout"
import {
  buildSetupTasks,
  parseGettingStartedScenario,
  shouldShowOnboardingBanner,
} from "./getting-started-scenarios"

export function GettingStartedPage() {
  const [searchParams] = useSearchParams()
  const scenario = parseGettingStartedScenario(searchParams.get("scenario"))
  const tasks = buildSetupTasks(scenario)
  const showBanner = shouldShowOnboardingBanner(scenario)

  return (
    <DashboardLayout activeTab="getting-started" showOnboardingBanner={showBanner}>
      <DashboardContent className="flex flex-col gap-8">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="font-display text-2xl font-semibold leading-8 tracking-[-0.2px] text-text-default-500">
            Setup your organization
          </h1>
          <p className="text-sm leading-[22px] text-text-neutral-400">
            Get ready to start managing your Non-governmental organization with us. Here are some action your need to
            perform to get the most out of Bayana
          </p>
        </div>

        <GettingStartedIntroVideo />

        <section className="flex flex-col gap-3" aria-label="Setup tasks">
          {tasks.map((task) => (
            <SetupTaskCard key={task.id} task={task} />
          ))}
        </section>
      </DashboardContent>
    </DashboardLayout>
  )
}
