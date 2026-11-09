import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(clients)
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  const client = await prisma.client.create({ data })
  return NextResponse.json(client, { status: 201 })
}