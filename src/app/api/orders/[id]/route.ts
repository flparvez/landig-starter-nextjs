import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";
import { OrderItem } from "@/models/OrderItem";
import { Product } from "@/models/Product";

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, 
  
{params}: {params : Promise<{id: string}>} 
) {

 const {id} = (await params)
  try {
    // const session = await getServerSession(authOptions);

    // if (!session || session.user.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();
    const { status, paymentMethod } = body;

    
    await connectToDatabase();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(paymentMethod && { paymentMethod }),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}






// GET: Retrieve a single order by its ID
export async function GET(req: NextRequest, 
  
{params}: {params : Promise<{id: string}>} 
){
  await connectToDatabase();
  try {
    const {id} = (await params)

    const order = await Order.findById(id)
      .populate({
        path: "items",
        model: OrderItem,
        populate: {
          path: "product",
          model: Product,
          select: "name price images", // Select the fields you want to show from the product
        },
      })
      // .populate("user", "name email")
    

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve order:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}