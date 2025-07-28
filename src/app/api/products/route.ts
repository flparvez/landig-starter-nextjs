import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/db'
import { Product } from '@/models/Product'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Authorization check
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    
    // Input validation
    if (!body.name || !body.price || !body.images) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Create product
    const product = new Product({
      name: body.name,
      description: body.description || '',
      price: parseFloat(body.price),
      mprice: body.mprice ? parseFloat(body.mprice) : undefined,
      stock: body.stock ? parseInt(body.stock) : 0,
      category: body.category || '',
      brand: body.brand || '',
      video: body.video || '',
      images: body.images,
      featured: body.featured || false
    })

    await product.save()

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}