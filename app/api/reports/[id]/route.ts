import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseReportInput } from '@/lib/reports'
import { resolveClientId, syncLinkedRecord } from '@/lib/report-sync'

type Ctx = { params: Promise<{ id: string }> | { id: string } }

async function getId(ctx: Ctx) {
  const { id } = await ctx.params
  const n = Number(id)
  return Number.isInteger(n) ? n : null
}

export async function PUT(req: Request, ctx: Ctx) {
  const id = await getId(ctx)
  if (id === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body = await req.json().catch(() => null)
  const parsed = parseReportInput(body)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
  const { steps, ...rest } = parsed.data
  const clientId = await resolveClientId(
    typeof body.clientId === 'string' && body.clientId ? body.clientId : null,
    parsed.data.shopName
  )

  const existing = await prisma.serviceReport.findUnique({ where: { id }, select: { linkedId: true } })
  const linkedId = await syncLinkedRecord(parsed.data, clientId, existing?.linkedId ?? null)

  const updated = await prisma.$transaction(async (tx) => {
    await tx.reportStep.deleteMany({ where: { reportId: id } })
    return tx.serviceReport.update({
      where: { id },
      data: { ...rest, clientId, linkedId, steps: { create: steps.map((text, order) => ({ order, text })) } },
      include: { steps: { orderBy: { order: 'asc' } } },
    })
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const id = await getId(ctx)
  if (id === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  await prisma.serviceReport.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}