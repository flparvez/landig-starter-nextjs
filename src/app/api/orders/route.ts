import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";
import { IOrderItem, OrderItem } from "@/models/OrderItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Types } from "mongoose";
import { CartItem } from "@/hooks/useCart";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
 

    const body = await req.json();
    const {
      fullName,
      phone,
      address,
      city,
      paymentMethod,
      cartItems,
      deliveryCharge,
    } = body;

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !paymentMethod ||
      !cartItems ||
      cartItems.length === 0
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectToDatabase();

    const totalProductPrice = cartItems.reduce(
      (sum: number, item: IOrderItem) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: new Types.ObjectId(session?.user.id) || "",
      fullName,
      phone,
      address,
      city,
      paymentMethod,
      deliveryCharge,
      totalAmount: totalProductPrice + deliveryCharge,
      items: [],
    });

    const orderItemIds = await Promise.all(
      cartItems.map(async (item: CartItem) => {
        const orderItem = await OrderItem.create({
          order: order._id,
          product: new Types.ObjectId(item.productId),
          quantity: item.quantity,
          price: item.price,
        });
        return orderItem._id;
      })
    );

    order.items = orderItemIds;
    await order.save();

    // ✅ Send Push Notification to Admin via OneSignal
    await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.ONESIGNAL_API_KEY!}`,
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        headings: { en: "🛍️ New Order Placed!" },
        contents: {
          en: `New Order from ${fullName}. Amount ৳${order.totalAmount}`,
        },
        filters: [
          {
            field: "tag",
            key: "role",
            relation: "=",
            value: "admin",
          },
        ],
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders/${order._id}`,
      }),
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
