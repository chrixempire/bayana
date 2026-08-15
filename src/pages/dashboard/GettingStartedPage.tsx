import { useSearchParams } from "react-router-dom"
import { GettingStartedIntroVideo } from "../../components/dashboard/GettingStartedIntroVideo"
import { SetupTaskCard } from "../../components/dashboard/SetupTaskCard"
import { DashboardContent, DashboardLayout } from "../../components/dashboard/DashboardLayout"
import { AnimatedPageTitle } from "../../components/ui/AnimatedPageTitle"
import { authBodyTextClassName } from "../../lib/auth-form-styles"
import { cn } from "../../lib/utils"
import { useSettlementAccount } from "../../hooks/use-settlement-account"
import {
  buildSetupTasks,
  parseGettingStartedScenario,
  shouldShowOnboardingBanner,
} from "./getting-started-scenarios"

export function GettingStartedPage() {
  const [searchParams] = useSearchParams()
  const scenario = parseGettingStartedScenario(searchParams.get("scenario"))
  const { hasSettlementAccount } = useSettlementAccount()
  const baseTasks = buildSetupTasks(scenario)
  // Reflect the real settlement account: once one exists, the bank step is done.
  const tasks = hasSettlementAccount
    ? baseTasks.map((task) =>
        task.id === "bank"
          ? { ...task, action: { kind: "completed" as const, label: "Done" as const } }
          : task,
      )
    : baseTasks
  const showBanner = shouldShowOnboardingBanner(scenario)

  return (
    <DashboardLayout activeTab="getting-started" showOnboardingBanner={showBanner}>
      <DashboardContent className="flex flex-col gap-8">
        <AnimatedPageTitle
          align="center"
          subtitle={
            <p className={cn(authBodyTextClassName, "text-text-table-header")}>
              Get ready to start managing your Non-governmental organization with us. Here are some
              actions you need to perform to get the most out of Bayana
            </p>
          }
        >
          Setup your organization
        </AnimatedPageTitle>

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
