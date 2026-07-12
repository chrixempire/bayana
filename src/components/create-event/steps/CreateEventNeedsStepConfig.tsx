import { useState, type ReactNode } from "react"
import { ChevronDown, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react"
import { Checkbox } from "../../ui/checkbox"
import { Input } from "../../ui/input"
import { RadioGroup } from "../../ui/radio-group"
import { Switch } from "../../ui/switch"
import { Textarea } from "../../ui/textarea"
import { CreateEventAddItemModal } from "../CreateEventAddItemModal"
import { CreateEventDateRangeField } from "../CreateEventDateRangeField"
import { CreateEventFieldGroup } from "../CreateEventFieldGroup"
import { CreateEventFieldHint } from "../CreateEventFieldHint"
import { CreateEventFieldLabel } from "../CreateEventFieldLabel"
import { CreateEventRadioOption } from "../CreateEventRadioOption"
import { CreateEventStepHeading } from "../CreateEventStepHeading"
import { CreateEventToggleField } from "../CreateEventToggleField"
import { DonationAmountField } from "../DonationAmountField"
import { EventPasscodeField } from "../EventPasscodeField"
import { ProBadge } from "../ProBadge"
import { SearchableSelect } from "../SearchableSelect"
import {
  getDonationAmountError,
  getDonationUsageLine,
} from "../../../lib/create-event-donations"
import {
  CREATE_EVENT_NGO_OPTIONS,
  CREATE_EVENT_ORGANIZERS,
} from "../../../data/create-event-settings"
import type {
  CreateEventFormState,
  InKindItem,
} from "../../../pages/dashboard/create-event-types"
import { cn } from "../../../lib/utils"

/** Bordered donation-type card with a header row (label + description + switch) and optional body. */
function NeedsDonationCard({
  label,
  description,
  checked,
  active,
  onToggle,
  pro,
  children,
}: {
  label: string
  description: string
  checked: boolean
  active?: boolean
  onToggle: () => void
  pro?: ReactNode
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border p-4 transition-colors",
        active ? "border-border-input-active bg-bg-accent-soft/40" : "border-[#EDF0F2]",
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="type-events-tab text-text-events-strong">{label}</p>
            {pro}
          </div>
          <p className="type-create-event-caption">{description}</p>
        </div>
        <Switch checked={checked} onCheckedChange={onToggle} className="mt-0.5 shrink-0" />
      </div>
      {children}
    </div>
  )
}

function InKindItemRow({
  item,
  onEdit,
  onRemove,
}: {
  item: InKindItem
  onEdit: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#EDF0F2] bg-bg-on-canvas p-2.5">
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg-default-100 text-icon-neutral">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="size-full object-cover" />
        ) : (
          <ImageIcon className="size-4" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-[22px] text-text-events-strong">
          {item.name}
        </p>
        <p className="truncate text-xs leading-5 text-text-table-header">{item.description}</p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[11px] leading-4 text-text-table-header">Qty</span>
        <span className="text-sm font-semibold leading-[22px] text-text-events-strong">
          {item.quantity}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          aria-label={`Edit ${item.name}`}
          onClick={onEdit}
          className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-icon-neutral transition-colors hover:bg-bg-default-100"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label={`Remove ${item.name}`}
          onClick={onRemove}
          className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-icon-neutral transition-colors hover:bg-bg-default-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

export function CreateEventNeedsStepConfig({
  form,
  onChange,
  onBack,
  isPremium,
  onRequestUpgrade,
}: {
  form: CreateEventFormState
  onChange: (patch: Partial<CreateEventFormState>) => void
  onBack: () => void
  isPremium: boolean
  onRequestUpgrade: () => void
}) {
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InKindItem | null>(null)
  const [modalNonce, setModalNonce] = useState(0)

  const donationError = form.financialDonations
    ? getDonationAmountError(form.donationAmount, isPremium)
    : null

  const openAddItem = () => {
    setEditingItem(null)
    setModalNonce((nonce) => nonce + 1)
    setItemModalOpen(true)
  }
  const openEditItem = (item: InKindItem) => {
    setEditingItem(item)
    setModalNonce((nonce) => nonce + 1)
    setItemModalOpen(true)
  }
  const submitItem = (item: InKindItem) => {
    const exists = form.inKindItems.some((existing) => existing.id === item.id)
    onChange({
      inKindItems: exists
        ? form.inKindItems.map((existing) => (existing.id === item.id ? item : existing))
        : [...form.inKindItems, item],
    })
    setItemModalOpen(false)
    setEditingItem(null)
  }
  const removeItem = (id: string) => {
    onChange({ inKindItems: form.inKindItems.filter((item) => item.id !== id) })
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <CreateEventStepHeading
        onBack={onBack}
        title="Need type configuration"
        subtitle="Configure the kind of needs donations you would like to receive"
      />

      <NeedsDonationCard
        label="Financial donations"
        description="Receive monetary donations for your needs"
        checked={form.financialDonations}
        active={form.financialDonations}
        onToggle={() =>
          onChange({
            financialDonations: !form.financialDonations,
            ...(form.financialDonations ? { donationAmount: 0, allowOverfunding: false } : {}),
          })
        }
      >
        {form.financialDonations ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <CreateEventFieldGroup label="Target amount" required>
                <DonationAmountField
                  value={form.donationAmount}
                  onChange={(donationAmount) => onChange({ donationAmount })}
                  invalid={Boolean(donationError)}
                />
              </CreateEventFieldGroup>
              {donationError ? (
                <div className="flex flex-col gap-0.5 text-xs leading-5 text-text-negative">
                  <p>{donationError}</p>
                  <p>{getDonationUsageLine(0)}</p>
                </div>
              ) : null}
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="allow-overfunding"
                size="sm"
                checked={form.allowOverfunding}
                onCheckedChange={(allowOverfunding) =>
                  onChange({ allowOverfunding: allowOverfunding === true })
                }
                className="mt-0.5"
              />
              <label
                htmlFor="allow-overfunding"
                className="flex min-w-0 cursor-pointer flex-col gap-1"
              >
                <span className="type-events-tab text-text-events-strong">Allow overfunding</span>
                <span className="type-create-event-caption">
                  Donor are able to keep donating even after the target amount is reached. Free users
                  are only entitled to ₦500,000 per month
                </span>
              </label>
            </div>
          </div>
        ) : null}
      </NeedsDonationCard>

      <NeedsDonationCard
        label="In-kind donations"
        description="Receive tangible items or material for your needs"
        checked={form.inKindDonations}
        pro={<ProBadge />}
        onToggle={() => {
          if (!isPremium) {
            onRequestUpgrade()
            return
          }
          onChange({ inKindDonations: !form.inKindDonations })
        }}
      >
        {isPremium && form.inKindDonations ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <CreateEventFieldLabel label="Items" required />
              <p className="type-create-event-caption">
                Add the items or materials you would like to receive
              </p>
              {form.inKindItems.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {form.inKindItems.map((item) => (
                    <InKindItemRow
                      key={item.id}
                      item={item}
                      onEdit={() => openEditItem(item)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </div>
              ) : null}
              <button
                type="button"
                onClick={openAddItem}
                className="inline-flex h-9 w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-border-default-100 bg-bg-canvas px-3 text-sm font-medium leading-[22px] text-text-events-strong shadow-input-default transition-colors hover:bg-bg-on-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-input-active"
              >
                <Plus className="size-4 text-icon-neutral" />
                Add item
              </button>
            </div>

            <CreateEventFieldGroup
              label="Delivery options"
              required
              description="How you like to receive items"
            >
              <div className="flex flex-wrap items-center gap-x-16 gap-y-3">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <Checkbox
                    size="sm"
                    checked={form.deliveryByDelivery}
                    onCheckedChange={(checked) =>
                      onChange({ deliveryByDelivery: checked === true })
                    }
                  />
                  <span className="text-sm leading-[22px] text-text-events-strong">Delivery</span>
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <Checkbox
                    size="sm"
                    checked={form.deliveryByPickup}
                    onCheckedChange={(checked) => onChange({ deliveryByPickup: checked === true })}
                  />
                  <span className="text-sm leading-[22px] text-text-events-strong">Pickup</span>
                </label>
              </div>
            </CreateEventFieldGroup>

            {form.deliveryByDelivery ? (
              <>
                <CreateEventFieldGroup label="Delivery address" required>
                  <Input
                    density="compact"
                    value={form.deliveryAddress}
                    onChange={(event) => onChange({ deliveryAddress: event.target.value })}
                    placeholder="Enter delivery address"
                  />
                </CreateEventFieldGroup>
                <div className="flex flex-col gap-2">
                  <CreateEventFieldLabel label="Delivery instructions" />
                  <Textarea
                    value={form.deliveryInstructions}
                    onChange={(event) => onChange({ deliveryInstructions: event.target.value })}
                    placeholder="Enter delivery instructions"
                    className="min-h-[96px] rounded-xl"
                  />
                </div>
              </>
            ) : null}

            {form.deliveryByPickup ? (
              <>
                <CreateEventFieldGroup label="Pickup address" required>
                  <Input
                    density="compact"
                    value={form.pickupAddress}
                    onChange={(event) => onChange({ pickupAddress: event.target.value })}
                    placeholder="Enter pickup address"
                  />
                </CreateEventFieldGroup>
                <div className="flex flex-col gap-2">
                  <CreateEventFieldLabel label="Pickup instructions" />
                  <Textarea
                    value={form.pickupInstructions}
                    onChange={(event) => onChange({ pickupInstructions: event.target.value })}
                    placeholder="Enter pickup instructions"
                    className="min-h-[96px] rounded-xl"
                  />
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </NeedsDonationCard>

      <CreateEventFieldGroup label="Date" required>
        <CreateEventDateRangeField
          start={form.dateStart}
          end={form.dateEnd}
          onStartChange={(dateStart) => onChange({ dateStart })}
          onEndChange={(dateEnd) => onChange({ dateEnd })}
        />
        <CreateEventFieldHint>You can select more than one day</CreateEventFieldHint>
      </CreateEventFieldGroup>

      <CreateEventFieldGroup label="Organizer" required>
        <SearchableSelect
          value={form.organizer}
          onChange={(organizer) => onChange({ organizer })}
          options={CREATE_EVENT_ORGANIZERS}
          searchPlaceholder="Search organizer"
          ariaLabel="Organizer"
        />
        <CreateEventFieldHint>
          This person will serve as a contact person for this event
        </CreateEventFieldHint>
      </CreateEventFieldGroup>

      <div className="border-t border-border-default-100 pt-2">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between py-3 text-left text-base font-semibold leading-6 text-text-events-strong"
          onClick={() => onChange({ moreSettingsOpen: !form.moreSettingsOpen })}
        >
          More settings
          <ChevronDown
            className={cn(
              "size-4 text-icon-neutral transition-transform",
              form.moreSettingsOpen && "rotate-180",
            )}
          />
        </button>

        {form.moreSettingsOpen ? (
          <div className="flex flex-col gap-4 pb-2 pt-4">
            <CreateEventFieldGroup
              label="Visibility"
              required
              description="Who has access to donate to this need"
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
                <CreateEventRadioOption value="private" label="Private" />
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

      <CreateEventAddItemModal
        key={modalNonce}
        open={itemModalOpen}
        item={editingItem}
        onClose={() => {
          setItemModalOpen(false)
          setEditingItem(null)
        }}
        onSubmit={submitItem}
      />
    </div>
  )
}
