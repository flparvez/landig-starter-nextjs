// app/api/orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";
import { IOrderItem, OrderItem } from "@/models/OrderItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Types } from "mongoose";
import { CartItem } from "@/hooks/useCart";
import { User, IPushSubscription } from "@/models/User"; // CHANGE: Import IPushSubscription type
import webpush from "web-push";

// Configure web-push with your VAPID keys
if (
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
  process.env.VAPID_PRIVATE_KEY &&
  process.env.VAPID_MAILTO
) {
  webpush.setVapidDetails(
    process.env.VAPID_MAILTO,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

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

    if (!fullName || !phone || !address || !city || !paymentMethod || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectToDatabase();

    const totalProductPrice = cartItems.reduce(
      (sum: number, item: IOrderItem) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: session?.user.id ? new Types.ObjectId(session.user.id) : undefined,
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

    // =========== PUSH NOTIFICATION LOGIC START ===========
    try {
      const admins = await User.find({ role: "ADMIN" }).lean();
      const notificationPayload = JSON.stringify({
        title: "New Order Received!",
        body: `Order #${order._id.toString().slice(-6)} for $${order.totalAmount} placed.`,
      });

      // The `webpush.sendNotification` function expects a `PushSubscription` object. 
      // Our `IPushSubscription` type matches this structure perfectly.
      const notificationPromises = admins.flatMap(admin =>
        // CHANGE: Explicitly type the 'sub' parameter here
        admin.subscriptions?.map((sub: IPushSubscription) => 
          webpush.sendNotification(sub , notificationPayload)
        ) ?? []
      );
      
      await Promise.all(notificationPromises);

    } catch (pushError) {
      console.error("Failed to send push notifications:", pushError);
      // Do not block the order response for a push notification failure
    }
    // =========== PUSH NOTIFICATION LOGIC END ===========
  
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}