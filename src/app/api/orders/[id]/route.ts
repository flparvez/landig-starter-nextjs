import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest,  {params}: {params : Promise<{id: string}>} 
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

export async function GET(
    request: NextRequest,
    {params}: {params : Promise<{id: string}>} 
) {
  try {
    await connectToDatabase();
    const {id} = (await params)
    const order = await Order.findById(id)
      .populate({
        path: "items",
        populate: { path: "product" },
      });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}