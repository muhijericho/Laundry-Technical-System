import ExcelJS from 'exceljs'
import { detectType, type ReportInput } from './reports'

const text = (v: ExcelJS.CellValue): string => {
  if (v == null || v instanceof Date) return ''
  if (typeof v === 'object') {
    const o = v as any
    if (Array.isArray(o.richText)) return o.richText.map((t: any) => t.text).join('').trim()
    if (o.text != null) return String(o.text).trim()
    if (o.result != null && !(o.result instanceof Date)) return String(o.result).trim()
    return ''
  }
  return String(v).trim()
}

const asDate = (v: ExcelJS.CellValue): Date | null => {
  if (v instanceof Date) return new Date(Date.UTC(v.getUTCFullYear(), v.getUTCMonth(), v.getUTCDate()))
  if (typeof v === 'string' && v.trim()) {
    const d = new Date(v)
    if (!Number.isNaN(d.getTime())) return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  }
  return null
}

export async function parseReportsWorkbook(file: string | Buffer): Promise<ReportInput[]> {
  const wb = new ExcelJS.Workbook()
  if (typeof file === 'string') await wb.xlsx.readFile(file)
  else await wb.xlsx.load(file as any)
  const ws = wb.worksheets[0]

  const visits: ReportInput[] = []
  let current: ReportInput | null = null
  let currentDate: Date | null = null
  const techs = new Set<string>()

  const flush = () => {
    if (current && (current.steps.length || current.concern)) {
      current.technicians = [...techs].join(', ') || null
      current.type = detectType(current.shopName, current.concern ?? '', current.steps)
      if (!current.steps.length) current.steps.push(current.concern!)
      visits.push(current)
    }
    current = null
    techs.clear()
  }

  ws.eachRow({ includeEmpty: false }, (row, n) => {
    if (n === 1) return
    const a = asDate(row.getCell(1).value)
    const b = text(row.getCell(2).value)
    const c = text(row.getCell(3).value)
    const d = text(row.getCell(4).value)
    const e = text(row.getCell(5).value)
    const f = text(row.getCell(6).value)
    const g = text(row.getCell(7).value)

    if (a) currentDate = a
    if (a || b || c || !current) {
      flush()
      if (!currentDate) return
      current = {
        date: currentDate, shopName: b || '(No name)', address: c || null,
        concern: null, type: 'REPAIR', technicians: null, contactName: null, steps: [],
      }
    }
    const v = current as ReportInput | null
    if (!v) return
    if (d) v.concern = v.concern ? `${v.concern} / ${d}` : d
    if (e) v.steps.push(e)
    if (f) techs.add(f)
    if (g) v.contactName = g
  })
  flush()
  return visits
}