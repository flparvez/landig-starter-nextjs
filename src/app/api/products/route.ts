import { NextRequest, NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { Product } from '@/models/Product'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Required fields চেক
    if (
      !body.name ||
      !body.price ||
      !body.images ||
      !Array.isArray(body.images) ||
      body.images.length === 0
    ) {
      return NextResponse.json(
        { error: 'Missing required fields or images array empty' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Create product instance
    const product = new Product({
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      mprice: body.mprice !== undefined ? Number(body.mprice) : undefined,
      stock: body.stock !== undefined ? parseInt(body.stock, 10) : 0,
      category: body.category || '',
      brand: body.brand || '',
      video: body.video || '',
      images: body.images, // Must be array of { url, fileId?, altText? }
      featured: Boolean(body.featured),
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


export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    const products = await Product.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, products }, { status: 200 })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}