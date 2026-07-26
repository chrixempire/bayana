import { useState } from "react"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { FormDropdown } from "../ui/form-dropdown"
import { PersonAvatar } from "../events/detail/PersonAvatar"
import { cn } from "../../lib/utils"
import { ROLE_OPTIONS, BANK_OPTIONS, type PayoutRow, type AuditLog, type TeamMember } from "../../pages/dashboard/settings-data"

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="type-create-event-field-label text-text-events-strong">{children}</span>
}

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-table-header">{label}</span>
      {children}
    </div>
  )
}

const ROLE_DROPDOWN = ROLE_OPTIONS.map((r) => ({ value: r, label: r }))
const BANK_DROPDOWN = BANK_OPTIONS.map((b) => ({ value: b, label: b }))

export type MemberFormData = { first: string; last: string; email: string; role: string }

export function InviteMemberModal({
  open,
  onClose,
  onInvite,
}: {
  open: boolean
  onClose: () => void
  onInvite: (data: MemberFormData) => void
}) {
  const [first, setFirst] = useState("")
  const [last, setLast] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")

  const reset = () => {
    setFirst("")
    setLast("")
    setEmail("")
    setRole("")
  }
  const canSend = first.trim() && last.trim() && email.trim() && role

  return (
    <Modal
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
      title="Invite member"
      size="md"
      footer={
        <>
          <Button type="button" variant="neutral" className="rounded-xl" onClick={() => { reset(); onClose() }}>
            Close
          </Button>
          <Button
            type="button"
            variant="primary"
            className="rounded-xl"
            disabled={!canSend}
            onClick={() => { onInvite({ first, last, email, role }); reset() }}
          >
            Send invite
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 pb-2">
        <div className="flex flex-col gap-2">
          <FieldLabel>First name</FieldLabel>
          <Input density="compact" value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Enter first name" />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Last name</FieldLabel>
          <Input density="compact" value={last} onChange={(e) => setLast(e.target.value)} placeholder="Enter last name" />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Email</FieldLabel>
          <Input density="compact" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Role</FieldLabel>
          <FormDropdown
            value={role}
            onValueChange={setRole}
            options={ROLE_DROPDOWN}
            ariaLabel="Select a role"
            renderValue={(s) => <span className={cn(!s && "text-input-placeholder")}>{s?.label ?? "Select a role"}</span>}
          />
        </div>
      </div>
    </Modal>
  )
}

export function EditMemberModal({
  open,
  member,
  onClose,
  onSave,
}: {
  open: boolean
  member: TeamMember | null
  onClose: () => void
  onSave: (data: MemberFormData) => void
}) {
  // Parent remounts this via key={member.id}, so lazy initializers seed the form.
  const [first, setFirst] = useState(() => member?.name.split(" ")[0] ?? "")
  const [last, setLast] = useState(() => member?.name.split(" ").slice(1).join(" ") ?? "")
  const [email, setEmail] = useState(() => member?.email ?? "")
  const [role, setRole] = useState(() => member?.role ?? "")

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit member"
      size="md"
      footer={
        <>
          <Button type="button" variant="neutral" className="rounded-xl" onClick={onClose}>
            Close
          </Button>
          <Button type="button" variant="primary" className="rounded-xl" onClick={() => onSave({ first, last, email, role })}>
            Save changes
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 pb-2">
        <div className="flex flex-col gap-2">
          <FieldLabel>First name</FieldLabel>
          <Input density="compact" value={first} onChange={(e) => setFirst(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Last name</FieldLabel>
          <Input density="compact" value={last} onChange={(e) => setLast(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Email</FieldLabel>
          <Input density="compact" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Role</FieldLabel>
          <FormDropdown value={role} onValueChange={setRole} options={ROLE_DROPDOWN} ariaLabel="Select a role" />
        </div>
      </div>
    </Modal>
  )
}

export function LogDetailsModal({ open, log, onClose }: { open: boolean; log: AuditLog | null; onClose: () => void }) {
  return (
    <Modal
      open={open && log !== null}
      onClose={onClose}
      title="Log details"
      size="md"
      footer={
        <Button type="button" variant="neutral" className="rounded-xl" onClick={onClose}>
          Close
        </Button>
      }
    >
      {log ? (
        <div className="flex flex-col gap-4 pb-2">
          <DetailField label="Member">
            <span className="flex items-center gap-2 text-sm text-text-events-strong">
              <PersonAvatar name={log.member} tone={log.avatarTone} size={24} />
              {log.member}
            </span>
          </DetailField>
          <DetailField label="Log">
            <span className="text-sm text-text-events-strong">{log.fullLog}</span>
          </DetailField>
          <DetailField label="Date">
            <span className="text-sm text-text-events-strong">{log.dateAdded}</span>
          </DetailField>
        </div>
      ) : null}
    </Modal>
  )
}

export function PayoutDetailsModal({ open, payout, onClose }: { open: boolean; payout: PayoutRow | null; onClose: () => void }) {
  return (
    <Modal
      open={open && payout !== null}
      onClose={onClose}
      title="Payout details"
      size="md"
      footer={
        <Button type="button" variant="neutral" className="rounded-xl" onClick={onClose}>
          Close
        </Button>
      }
    >
      {payout ? (
        <div className="flex flex-col gap-4 pb-2">
          <DetailField label="Account Name">
            <span className="text-sm text-text-events-strong">{payout.accountName}</span>
          </DetailField>
          <div className="grid grid-cols-2 gap-4">
            <DetailField label="Account Number">
              <span className="text-sm text-text-events-strong">{payout.accountNumber}</span>
            </DetailField>
            <DetailField label="Bank">
              <span className="text-sm text-text-events-strong">{payout.bank}</span>
            </DetailField>
          </div>
          <DetailField label="Payout date">
            <span className="text-sm text-text-events-strong">{payout.date}</span>
          </DetailField>
          <DetailField label="Transaction ID">
            <span className="text-sm text-text-events-strong">{payout.transactionId}</span>
          </DetailField>
          <DetailField label="Status">
            <span className="inline-flex h-6 w-fit items-center rounded-lg bg-bg-success-soft px-2 text-xs font-medium text-text-success">
              {payout.status}
            </span>
          </DetailField>
        </div>
      ) : null}
    </Modal>
  )
}

export type BankFormData = { name: string; number: string; bank: string }

export function AddBankModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (data: BankFormData) => void
}) {
  const [name, setName] = useState("")
  const [number, setNumber] = useState("")
  const [bank, setBank] = useState("")

  const reset = () => {
    setName("")
    setNumber("")
    setBank("")
  }
  const canAdd = name.trim() && number.trim() && bank

  return (
    <Modal
      open={open}
      onClose={() => { reset(); onClose() }}
      title="Add a bank account"
      size="md"
      footer={
        <>
          <Button type="button" variant="neutral" className="rounded-xl" onClick={() => { reset(); onClose() }}>
            Close
          </Button>
          <Button type="button" variant="primary" className="rounded-xl" disabled={!canAdd} onClick={() => { onAdd({ name, number, bank }); reset() }}>
            Add account
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 pb-2">
        <div className="flex flex-col gap-2">
          <FieldLabel>Account name</FieldLabel>
          <Input density="compact" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter account name" />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Account number</FieldLabel>
          <Input density="compact" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Enter account number" />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Bank</FieldLabel>
          <FormDropdown
            value={bank}
            onValueChange={setBank}
            options={BANK_DROPDOWN}
            ariaLabel="Select a bank"
            renderValue={(s) => <span className={cn(!s && "text-input-placeholder")}>{s?.label ?? "Select a bank"}</span>}
          />
        </div>
      </div>
    </Modal>
  )
}
