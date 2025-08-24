import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

// Update a product
export async function PUT(req: NextRequest, 
  
{params}: {params : Promise<{id: string}>} 
) {
const {id} = (await params)
  try {
    const body = await req.json();

    if (!body.name || !body.price || !body.images || body.images.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields or images empty" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        mprice: Number(body.mprice),
        stock: Number(body.stock),
        category: body.category,
        brand: body.brand,
        video: body.video,
        images: body.images,
        reviews: body.reviews,
        featured: Boolean(body.featured),
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// Get a single product by ID
export async function GET(req: NextRequest,
{params}: {params : Promise<{id: string}>} 
) {
 const {id} = (await params)
  try {
    await connectToDatabase();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, 
  
{params}: {params : Promise<{id: string}>} 
) {
const {id} = (await params)
  try {
    await connectToDatabase();
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: deletedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}