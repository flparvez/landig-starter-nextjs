import {  NextRequest, NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { Product } from '@/models/Product'


export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // ✅ Validation
    if (
      !body.name ||
      !body.price ||
      !body.images ||
      !Array.isArray(body.images) ||
      body.images.length === 0 ||
      !body.category ||
      !body.description
    ) {
      return NextResponse.json(
        { error: 'Missing required fields or images invalid' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const product = new Product({
      name: body.name,
      description: body.description,
      price: Number(body.price),
      mprice: body.mprice ? Number(body.mprice) : undefined,
      stock: body.stock ? Number(body.stock) : 0,
      category: body.category,
      brand: body.brand || '',
      video: body.video || '',
      images: body.images, // Must be array of { url, fileId?, altText? }
      featured: Boolean(body.featured),
      tags: Array.isArray(body.tags) ? body.tags : [],
      specifications: typeof body.specifications === 'object' ? body.specifications : {},
      rating: typeof body.rating === 'number' ? body.rating : 0,
    })

    await product.save()

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}





export async function GET() {
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