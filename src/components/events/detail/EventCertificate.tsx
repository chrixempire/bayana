import type { EventDetail } from "../../../pages/dashboard/event-detail-types"

const BADGE_SRC = "/events/certificate-badge.svg"

export function EventCertificate({
  certificate,
}: {
  certificate: EventDetail["certificate"]
}) {
  return (
    <div className="rounded-xl bg-[#ebd9ff] p-6">
      <div className="relative overflow-hidden rounded-2xl bg-bg-canvas p-9">
        <img
          src={BADGE_SRC}
          alt=""
          aria-hidden
          className="absolute right-9 top-9 h-[126px] w-[88px]"
        />

        <div className="flex max-w-[432px] flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="inline-flex h-5 w-fit items-center rounded-full bg-[#ca2efe] px-2 py-1 text-[10px] font-[510] leading-[18px] tracking-[0.1px] text-text-on-solid-bg">
              {certificate.kindLabel}
            </span>
            <p className="font-display text-[32px] font-semibold leading-9 tracking-[-0.2px] text-[#20083a]">
              {certificate.heading}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-[510] uppercase leading-[18px] tracking-[2px] text-[#513a69]">
              {certificate.presentedTo}
            </p>
            <div className="flex flex-col">
              <p className="font-display text-[32px] font-semibold leading-9 tracking-[-0.2px] text-text-events-strong">
                {certificate.recipientName}
              </p>
              <span className="mt-1 h-px w-full bg-[#c9b4e6]" />
            </div>
          </div>

          <p className="text-sm font-[510] leading-[22px] text-[#513a69]">{certificate.body}</p>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div className="flex w-[124px] flex-col gap-1">
            <span className="h-px w-full bg-[#c9b4e6]" />
            <div className="flex flex-col">
              <p className="text-xs font-[510] leading-5 text-[#140425]">
                {certificate.signatureName}
              </p>
              <p className="text-[10px] font-[510] leading-[18px] tracking-[0.1px] text-[#513a69]">
                {certificate.signatureRole}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end text-[10px] font-[510] leading-[18px] tracking-[0.1px] text-[#513a69]">
            <p>DATE ISSUED:</p>
            <p>[DATE]</p>
          </div>
        </div>
      </div>
    </div>
  )
}
