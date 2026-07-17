/** Build and download a CSV file from headers + row values. */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`
  const lines = [headers.map(escape).join(","), ...rows.map((row) => row.map(escape).join(","))]
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  anchor.click()
  URL.revokeObjectURL(url)
}
