import { EventIcon } from "../../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../events/icons/event-icon-sizes"
import { RadioGroup } from "../../ui/radio-group"
import { Input } from "../../ui/input"
import { CreateEventDateRangeField } from "../CreateEventDateRangeField"
import { CreateEventFieldGroup } from "../CreateEventFieldGroup"
import { CreateEventStepHeading } from "../CreateEventStepHeading"
import { CreateEventFieldHint } from "../CreateEventFieldHint"
import { SearchableSelect } from "../SearchableSelect"
import { CreateEventRadioOption } from "../CreateEventRadioOption"
import { BreakdownCapacityCard } from "../BreakdownCapacityCard"
import { BreakdownCapacityPanel } from "../BreakdownCapacityPanel"
import { CreateEventToggleField } from "../CreateEventToggleField"
import { LocationAutocomplete } from "../LocationAutocomplete"
import { EventPasscodeField } from "../EventPasscodeField"
import { VirtualGoogleMeetCallout } from "../VirtualGoogleMeetCallout"
import { ProLockedField } from "../ProLockedField"
import { DonationAmountField } from "../DonationAmountField"
import { DisableOverfundingField } from "../DisableOverfundingField"
import { ReliabilityScoreSlider } from "../ReliabilityScoreSlider"
import {
  getDonationAmountError,
  getDonationUsageLine,
} from "../../../lib/create-event-donations"
import {
  formatCapacityInputValue,
  parseCapacityInputValue,
  selectCapacityInputOnFocus,
} from "../../../lib/capacity-input"
import { getCapacityError } from "../../../lib/create-event-validation"
import { syncSkillCapacities } from "../../../lib/create-event-breakdown"
import {
  CREATE_EVENT_NOTIFY_OPTIONS,
  CREATE_EVENT_NGO_OPTIONS,
  CREATE_EVENT_ORGANIZERS,
} from "../../../data/create-event-settings"
import type { CreateEventFormState } from "../../../pages/dashboard/create-event-types"
import type { CreateEventType } from "../../../lib/create-event-paths"
import { cn } from "../../../lib/utils"

export function CreateEventStepSettings({
  eventType,
  form,
  onChange,
  onBack,
  isPremium,
  onRequestUpgrade,
}: {
  eventType: CreateEventType
  form: CreateEventFormState
  onChange: (patch: Partial<CreateEventFormState>) => void
  onBack: () => void
  isPremium: boolean
  onRequestUpgrade: () => void
}) {
  const noun = eventType === "needs" ? "need" : "cause"
  const isVirtual = form.volunteeringType === "virtual"
  const capacityError = getCapacityError(form.capacity, form.hasCapacityLimit, isPremium)
  const showCapacityUpgrade =
    !isPremium && form.hasCapacityLimit && form.capacity > 10
  const donationError = form.receiveDonations
    ? getDonationAmountError(form.donationAmount, isPremium)
    : null

  const handleBreakdownToggle = (breakdownCapacity: boolean) => {
    if (!isPremium) {
      onRequestUpgrade()
      return
    }
    onChange({
      breakdownCapacity,
      skillCapacities: breakdownCapacity
        ? syncSkillCapacities(form.skills, form.skillCapacities)
        : form.skillCapacities,
    })
  }

  const handleSkillCapacityChange = (skill: string, value: number) => {
    onChange({
      skillCapacities: { ...form.skillCapacities, [skill]: value },
    })
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <CreateEventStepHeading
        onBack={onBack}
        title={`${eventType === "needs" ? "Need" : "Cause"} settings`}
        subtitle={`More information about this ${noun}`}
      />

      <CreateEventFieldGroup
        label="Volunteering type"
        required
        description="Choose how you would like volunteers to participate"
      >
        <div className="flex flex-col gap-3">
          <RadioGroup
            value={form.volunteeringType}
            onValueChange={(value) => {
              const volunteeringType = value as CreateEventFormState["volunteeringType"]
              if (volunteeringType === "in-person" && form.visibility === "private") {
                onChange({ volunteeringType, visibility: "public", eventPasscode: "" })
                return
              }
              onChange({ volunteeringType })
            }}
            className="flex flex-row flex-wrap items-center gap-6"
          >
            <CreateEventRadioOption value="in-person" label="In-person" />
            <CreateEventRadioOption value="virtual" label="Virtual" />
          </RadioGroup>

          {form.volunteeringType === "virtual" ? <VirtualGoogleMeetCallout /> : null}
        </div>
      </CreateEventFieldGroup>

      {form.volunteeringType === "in-person" ? (
        <CreateEventFieldGroup label="Location" required>
          <LocationAutocomplete value={form.location} onChange={(location) => onChange({ location })} />
        </CreateEventFieldGroup>
      ) : null}

      <CreateEventToggleField
        label="Volunteering capacity"
        description="Limit the number of volunteers who can join this cause"
        checked={form.hasCapacityLimit}
        onCheckedChange={(hasCapacityLimit) => onChange({ hasCapacityLimit })}
      />

      {form.hasCapacityLimit ? (
        <div className="flex flex-col gap-3">
          <CreateEventFieldGroup label="Capacity" required>
            <Input
              density="compact"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={formatCapacityInputValue(form.capacity)}
              onChange={(event) =>
                onChange({ capacity: parseCapacityInputValue(event.target.value) })
              }
              onFocus={selectCapacityInputOnFocus}
              onBlur={() => {
                if (form.capacity < 1) onChange({ capacity: 1 })
              }}
              invalid={Boolean(capacityError)}
            />
            {capacityError ? (
              <p className="text-xs leading-5 text-text-negative">
                ⚠️{" "}
                {showCapacityUpgrade ? (
                  <>
                    Free plan does not accommodate more than 10 volunteers.{" "}
                    <button
                      type="button"
                      className="cursor-pointer font-medium text-text-nav-tab-active underline"
                      onClick={onRequestUpgrade}
                    >
                      Upgrade
                    </button>
                  </>
                ) : (
                  capacityError
                )}
              </p>
            ) : null}
          </CreateEventFieldGroup>

          {isPremium ? (
            <BreakdownCapacityPanel
              skills={form.skills}
              skillCapacities={form.skillCapacities}
              totalCapacity={form.capacity}
              checked={form.breakdownCapacity}
              onCheckedChange={handleBreakdownToggle}
              onSkillCapacityChange={handleSkillCapacityChange}
            />
          ) : (
            <ProLockedField locked onRequestUpgrade={onRequestUpgrade}>
              <BreakdownCapacityCard
                checked={form.breakdownCapacity}
                onCheckedChange={handleBreakdownToggle}
                disabled
              />
            </ProLockedField>
          )}
        </div>
      ) : null}

      <CreateEventToggleField
        label="Vetting volunteers"
        description="Choose volunteers you would like to join this cause"
        checked={form.vettingVolunteers}
        onCheckedChange={(vettingVolunteers) => onChange({ vettingVolunteers })}
      />

      <CreateEventToggleField
        label="Receive donations"
        description="Receive monetary contributions to support your cause"
        checked={form.receiveDonations}
        onCheckedChange={(receiveDonations) =>
          onChange({
            receiveDonations,
            ...(receiveDonations ? {} : { donationAmount: 0, disableOverfunding: false }),
          })
        }
        pro={!isPremium}
      />

      {form.receiveDonations ? (
        <div className="flex flex-col gap-4">
          <CreateEventFieldGroup label="Amount" required>
            <DonationAmountField
              value={form.donationAmount}
              onChange={(donationAmount) => onChange({ donationAmount })}
              invalid={Boolean(donationError)}
            />
            {donationError ? (
              <div className="flex flex-col gap-0.5 text-xs leading-5 text-text-negative">
                <p>{donationError}</p>
                <p>{getDonationUsageLine(0)}</p>
              </div>
            ) : null}
          </CreateEventFieldGroup>

          <DisableOverfundingField
            checked={form.disableOverfunding}
            onChange={(disableOverfunding) => onChange({ disableOverfunding })}
          />
        </div>
      ) : null}

      <CreateEventFieldGroup label="Date(s) of event" required>
        <CreateEventDateRangeField
          start={form.dateStart}
          end={form.dateEnd}
          onStartChange={(dateStart) => onChange({ dateStart })}
          onEndChange={(dateEnd) => onChange({ dateEnd })}
        />
        <CreateEventFieldHint>You can select more than one day</CreateEventFieldHint>
      </CreateEventFieldGroup>

      <CreateEventFieldGroup label="Time" required>
        <div className="flex items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Input
              density="compact"
              type="time"
              value={form.timeStart}
              onChange={(event) => onChange({ timeStart: event.target.value })}
              className="pr-10"
            />
            <EventIcon name="time-fill" size={EVENT_ICON_SIZE.meta} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <span className="shrink-0 text-sm leading-[22px] text-text-table-header">to</span>
          <div className="relative min-w-0 flex-1">
            <Input
              density="compact"
              type="time"
              value={form.timeEnd}
              onChange={(event) => onChange({ timeEnd: event.target.value })}
              className="pr-10"
            />
            <EventIcon name="time-fill" size={EVENT_ICON_SIZE.meta} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </CreateEventFieldGroup>

      <CreateEventFieldGroup label="Organizer" required>
        <SearchableSelect
          value={form.organizer}
          onChange={(organizer) => onChange({ organizer })}
          options={CREATE_EVENT_ORGANIZERS}
          searchPlaceholder="Search organizer"
          ariaLabel="Organizer"
        />
        <CreateEventFieldHint>This person will serve as a contact person for this event</CreateEventFieldHint>
      </CreateEventFieldGroup>

      <div className="border-t border-border-default-100 pt-2">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between py-3 text-left text-sm font-semibold leading-[22px] text-text-events-strong"
          onClick={() => onChange({ moreSettingsOpen: !form.moreSettingsOpen })}
        >
          More settings
          <EventIcon
            name="down-fill"
            size={EVENT_ICON_SIZE.meta}
            className={cn("transition-transform", form.moreSettingsOpen && "rotate-180")}
          />
        </button>

        {form.moreSettingsOpen ? (
          <div className="flex flex-col gap-4 pb-2 pt-4">
            <CreateEventFieldGroup
              label="Visibility"
              required
              description="Who has access to join this cause"
            >
              <RadioGroup
                value={form.visibility}
                onValueChange={(value) => {
                  const visibility = value as CreateEventFormState["visibility"]
                  onChange({
                    visibility,
                    ...(visibility === "public" ? { eventPasscode: "" } : {}),
                  })
                }}
                className="flex flex-row flex-wrap items-center gap-6"
              >
                <CreateEventRadioOption value="public" label="Public" />
                <CreateEventRadioOption
                  value="private"
                  label="Private"
                  pro={!isPremium && !isVirtual}
                  proLocked={!isPremium && !isVirtual}
                  disabled={!isPremium && !isVirtual}
                  onProInteract={onRequestUpgrade}
                />
              </RadioGroup>
            </CreateEventFieldGroup>

            {form.visibility === "private" ? (
              <CreateEventFieldGroup label="Event passcode" required>
                <EventPasscodeField
                  value={form.eventPasscode}
                  onChange={(eventPasscode) => onChange({ eventPasscode })}
                />
              </CreateEventFieldGroup>
            ) : null}

            <CreateEventFieldGroup
              label="Certificate"
              required
              description="Who can access the certificate upon cause completion"
            >
              <RadioGroup
                value={form.certificateAccess}
                onValueChange={(value) => {
                  const certificateAccess = value as CreateEventFormState["certificateAccess"]
                  if (certificateAccess === "automated" && !isPremium) {
                    onRequestUpgrade()
                    return
                  }
                  onChange({ certificateAccess })
                }}
                className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6"
              >
                <CreateEventRadioOption value="all" label="All volunteers" />
                <CreateEventRadioOption
                  value="automated"
                  label="Automated"
                  pro={!isPremium}
                  proLocked={!isPremium}
                  disabled={!isPremium}
                  onProInteract={onRequestUpgrade}
                />
                <CreateEventRadioOption value="manual" label="Manual access" />
              </RadioGroup>
            </CreateEventFieldGroup>

            {form.certificateAccess === "automated" && isPremium ? (
              <CreateEventFieldGroup label="Reliability score" required>
                <ReliabilityScoreSlider
                  value={form.reliabilityScore}
                  onChange={(reliabilityScore) => onChange({ reliabilityScore })}
                />
              </CreateEventFieldGroup>
            ) : null}

            <CreateEventToggleField
              label="Event reminder notification"
              checked={form.eventReminder}
              onCheckedChange={(eventReminder) => onChange({ eventReminder })}
            />

            {form.eventReminder ? (
              <CreateEventFieldGroup label="Notify" required>
                <SearchableSelect
                  value={form.notifyBefore}
                  onChange={(notifyBefore) => onChange({ notifyBefore })}
                  options={CREATE_EVENT_NOTIFY_OPTIONS}
                  searchPlaceholder="Search notify time"
                  ariaLabel="Notify"
                />
                <CreateEventFieldHint>
                  An email notification will be sent to volunteers
                </CreateEventFieldHint>
              </CreateEventFieldGroup>
            ) : null}

            <CreateEventToggleField
              label="NGO collaboration"
              description="Collaborate with other NGOs to expand your reach"
              checked={form.ngoCollaboration}
              onCheckedChange={(ngoCollaboration) =>
                onChange({
                  ngoCollaboration,
                  ...(ngoCollaboration ? {} : { ngoOrganization: "" }),
                })
              }
              pro={!isPremium}
              proLocked={!isPremium}
              onProInteract={onRequestUpgrade}
            />

            {form.ngoCollaboration && isPremium ? (
              <CreateEventFieldGroup label="Non-governmental organization" required>
                <SearchableSelect
                  value={form.ngoOrganization}
                  onChange={(ngoOrganization) => onChange({ ngoOrganization })}
                  options={CREATE_EVENT_NGO_OPTIONS}
                  placeholder="Select organization"
                  searchPlaceholder="Search organization"
                  ariaLabel="Non-governmental organization"
                />
                <CreateEventFieldHint>
                  A request would be sent to the collaborating organization to approve collaboration
                </CreateEventFieldHint>
              </CreateEventFieldGroup>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
