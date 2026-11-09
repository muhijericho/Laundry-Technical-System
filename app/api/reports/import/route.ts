import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseReportsWorkbook } from '@/lib/reports-parse'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('file')

  if (!(file instanceof File) || !file.name.toLowerCase().endsWith('.xlsx')) {
    return NextResponse.json({ error: 'Please choose an .xlsx file' }, { status: 400 })
  }

  let visits
  try {
    visits = await parseReportsWorkbook(Buffer.from(await file.arrayBuffer()))
  } catch {
    return NextResponse.json({ error: 'Could not read that Excel file' }, { status: 400 })
  }

  let imported = 0
  let skipped = 0

  for (const v of visits) {
    const { steps, ...rest } = v

    // skip if the same visit (date + shop + first report line) already exists
    const exists = await prisma.serviceReport.findFirst({
      where: {
        date: v.date,
        shopName: v.shopName,
        steps: { some: { order: 0, text: steps[0] } },
      },
      select: { id: true },
    })
    if (exists) {
      skipped++
      continue
    }

    await prisma.serviceReport.create({
      data: { ...rest, steps: { create: steps.map((text, order) => ({ order, text })) } },
    })
    imported++
  }

  return NextResponse.json({ imported, skipped })
}