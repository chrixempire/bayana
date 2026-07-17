/** Organization Impact Report — mirrors the two-page PDF in the Analytics Figma. */

const PERIOD = "1 Mar to 30 Mar 2026"
const PERIOD_LONG = "1 March 2026 to 30 March 2026"
const ORG = "Acme Incorporation"

const SUMMARY = [
  { label: "Total Donations", value: "₦150,215,000.00" },
  { label: "Total Volunteers", value: "1,120" },
  { label: "Total volunteer hours", value: "45" },
  { label: "Fulfilment rate", value: "75%" },
]

const TOP_EVENTS = [
  { event: "Weekend Teaching at Makoko", volunteers: 134, raised: "₦2,350,000.00" },
  { event: "Weekend Teaching at Makoko", volunteers: 58, raised: "₦1,000,000.00" },
  { event: "Weekend Teaching at Makoko", volunteers: 45, raised: "₦850,000.00" },
  { event: "Weekend Teaching at Makoko", volunteers: 21, raised: "₦680,000.00" },
  { event: "Weekend Teaching at Makoko", volunteers: 18, raised: "₦350,000.00" },
  { event: "Weekend Teaching at Makoko", volunteers: 12, raised: "₦200,000.00" },
]

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function exportCsv() {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
  const lines: string[] = []
  lines.push(escape("Organization Impact Report"))
  lines.push(escape(`${ORG} — ${PERIOD}`))
  lines.push("")
  lines.push([escape("Metric"), escape("Value")].join(","))
  SUMMARY.forEach((s) => lines.push([escape(s.label), escape(s.value)].join(",")))
  lines.push("")
  lines.push([escape("Event"), escape("Volunteers"), escape("Amount raised")].join(","))
  TOP_EVENTS.forEach((e) =>
    lines.push([escape(e.event), escape(String(e.volunteers)), escape(e.raised)].join(",")),
  )
  downloadBlob(lines.join("\n"), "impact-report.csv", "text/csv;charset=utf-8;")
}

function exportPdf() {
  const maxVol = Math.max(...TOP_EVENTS.map((e) => e.volunteers))
  const rows = TOP_EVENTS.map(
    (e) => `
    <div class="event">
      <div class="event-head"><span>${e.event}</span><span class="raised">${e.raised}</span></div>
      <div class="track"><div class="fill" style="width:${(e.volunteers / maxVol) * 100}%"></div></div>
      <div class="vol">${e.volunteers} volunteers</div>
    </div>`,
  ).join("")

  const stats = SUMMARY.map(
    (s) => `<div class="stat"><span class="stat-label">${s.label}</span><span class="stat-value">${s.value}</span></div>`,
  ).join("")

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Organization Impact Report</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, "Segoe UI", Roboto, sans-serif; }
    .page { width: 210mm; min-height: 297mm; padding: 24mm 20mm; position: relative; page-break-after: always; }
    .cover { background: #20083a; color: #fff; display: flex; flex-direction: column; justify-content: center; }
    .brand { position: absolute; top: 20mm; left: 20mm; font-weight: 700; letter-spacing: .5px; }
    .period { color: #c9a7ff; font-size: 14px; margin-bottom: 12px; }
    .cover h1 { font-size: 52px; line-height: 1.05; font-weight: 700; max-width: 70%; }
    .cover .for { margin-top: 16px; color: #c9a7ff; font-size: 16px; }
    .dots { position: absolute; right: 18mm; bottom: 18mm; width: 40mm; height: 40mm;
      background: radial-gradient(circle, #ff7415 2px, transparent 2px); background-size: 8px 8px; opacity: .5; }
    .body h2 { font-size: 22px; color: #2c3237; margin-bottom: 8px; }
    .intro { color: #656f78; font-size: 14px; margin-bottom: 24px; }
    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
    .stat { border: 1px solid #ebeef2; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
    .stat-label { color: #656f78; font-size: 13px; }
    .stat-value { color: #2c3237; font-size: 24px; font-weight: 700; }
    .section-title { font-size: 16px; font-weight: 700; color: #2c3237; margin-bottom: 16px; }
    .event { margin-bottom: 18px; }
    .event-head { display: flex; justify-content: space-between; font-size: 14px; color: #2c3237; font-weight: 600; margin-bottom: 6px; }
    .raised { color: #656f78; font-weight: 500; }
    .track { height: 8px; background: #edf0f2; border-radius: 999px; overflow: hidden; }
    .fill { height: 100%; background: #2ea1fe; border-radius: 999px; }
    .vol { font-size: 12px; color: #656f78; margin-top: 4px; }
    .foot { position: absolute; bottom: 14mm; left: 20mm; color: #a0acb6; font-size: 12px; }
    .head-org { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; color: #2c3237; font-weight: 700; }
  </style></head>
  <body>
    <div class="page cover">
      <div class="brand">Bayana</div>
      <div>
        <div class="period">${PERIOD}</div>
        <h1>Organization Impact Report</h1>
        <div class="for">For ${ORG}</div>
      </div>
      <div class="dots"></div>
    </div>
    <div class="page body">
      <div class="head-org">${ORG}</div>
      <div class="intro">This document gives you a brief summary of your organizational impact between ${PERIOD_LONG}</div>
      <div class="stats">${stats}</div>
      <div class="section-title">Top Performing Events</div>
      ${rows}
      <div class="foot">Organization impact report&nbsp;&nbsp;|&nbsp;&nbsp;1</div>
    </div>
    <script>window.onload = function () { window.print(); }</script>
  </body></html>`

  const win = window.open("", "_blank")
  if (win) {
    win.document.write(html)
    win.document.close()
  } else {
    // Popup blocked — fall back to an HTML download the user can open + print.
    downloadBlob(html, "impact-report.html", "text/html")
  }
}

export function downloadImpactReport(type: "pdf" | "csv") {
  if (type === "csv") exportCsv()
  else exportPdf()
}
