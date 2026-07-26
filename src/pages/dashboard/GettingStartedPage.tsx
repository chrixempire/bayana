import { useSearchParams } from "react-router-dom"
import { GettingStartedIntroVideo } from "../../components/dashboard/GettingStartedIntroVideo"
import { SetupTaskCard } from "../../components/dashboard/SetupTaskCard"
import { DashboardContent, DashboardLayout } from "../../components/dashboard/DashboardLayout"
import { authBodyTextClassName, pageTitleClassName } from "../../lib/auth-form-styles"
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
          <h1 className={pageTitleClassName}>
            Setup your organization
          </h1>
          <p className={authBodyTextClassName}>
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
