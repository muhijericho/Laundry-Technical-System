import ExcelJS from 'exceljs'
import type { ReportDTO } from './reports'

export async function buildReportsWorkbook(reports: ReportDTO[]): Promise<Buffer> {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Sheet1', { views: [{ state: 'frozen', ySplit: 1 }] })

  ws.columns = [
    { header: 'Date', key: 'date', width: 17.25 },
    { header: 'Laundry Shop', key: 'shop', width: 36.5 },
    { header: 'Address', key: 'address', width: 30.25 },
    { header: 'Concern', key: 'concern', width: 33.25 },
    { header: 'Report', key: 'report', width: 52.5 },
    { header: 'Technician', key: 'tech', width: 14.25 },
    { header: 'Owner/Staff Name', key: 'owner', width: 16.25 },
  ]

  const head = ws.getRow(1)
  head.font = { bold: true }
  head.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } }

  const sorted = [...reports].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id
  )

  let lastDay = ''
  for (const r of sorted) {
    const day = new Date(r.date).toISOString().slice(0, 10)
    const steps = r.steps.length ? [...r.steps].sort((a, b) => a.order - b.order) : [{ text: '' }]

    steps.forEach((s, i) => {
      const isFirst = i === 0
      const isLast = i === steps.length - 1
      const row = ws.addRow({
        date: isFirst && day !== lastDay ? new Date(`${day}T00:00:00.000Z`) : undefined,
        shop: isFirst ? r.shopName : undefined,
        address: isFirst ? r.address ?? undefined : undefined,
        concern: isFirst ? r.concern ?? undefined : undefined,
        report: s.text,
        tech: isLast ? r.technicians ?? undefined : undefined,
        owner: isLast ? r.contactName ?? undefined : undefined,
      })
      row.getCell('date').numFmt = 'yyyy-mm-dd'
      row.alignment = { vertical: 'top', wrapText: true }
    })
    lastDay = day
  }

  return Buffer.from((await wb.xlsx.writeBuffer()) as ArrayBuffer)
}