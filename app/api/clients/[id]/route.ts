import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({ where: { id: params.id } })
  return NextResponse.json(client)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()
  const client = await prisma.client.update({ where: { id: params.id }, data })
  return NextResponse.json(client)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.client.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}