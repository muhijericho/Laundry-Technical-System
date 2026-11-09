import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { clients } = await request.json()
    
    // Create clients one by one to avoid duplicate issues
    let successCount = 0
    
    for (const client of clients) {
      try {
        await prisma.client.create({
          data: client
        })
        successCount++
      } catch (error) {
        // Skip if duplicate or error
        console.log('Skipping duplicate or error:', client.name)
      }
    }

    return NextResponse.json({ success: true, count: successCount })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to import clients' }, { status: 500 })
  }
}