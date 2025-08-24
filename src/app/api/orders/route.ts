import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";
import { IOrderItem, OrderItem } from "@/models/OrderItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Types } from "mongoose";
import { CartItem } from "@/hooks/useCart";
import { User, IPushSubscription } from "@/models/User";
import webpush from "web-push";

// Configure web-push
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
      paymentType,
      trxId,
      cartItems,
      deliveryCharge,
    } = body;

    if (
      !fullName ||
      !phone ||
      !address ||
      !paymentMethod ||
      !paymentType ||
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
      user: session?.user.id ? new Types.ObjectId(session.user.id) : undefined,
  
      fullName,
      phone,
      address,
      city,
      paymentMethod,
      paymentType,
      trxId: paymentMethod !== "COD" ? trxId : undefined,
      deliveryCharge,
      totalAmount:
        paymentType === "PARTIAL" ? 100 + deliveryCharge : totalProductPrice + deliveryCharge,
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

    // ===== PUSH NOTIFICATION LOGIC =====
    try {
      const admins = await User.find({ role: "ADMIN" }).lean();
      const notificationPayload = JSON.stringify({
        title: "New Order Received!",
        body: `Order #${order.orderId} for ৳${order.totalAmount} placed.`,
      });

      const notificationPromises = admins.flatMap((admin) =>
        admin.subscriptions?.map((sub: IPushSubscription) =>
          webpush.sendNotification(sub, notificationPayload)
        ) ?? []
      );

      await Promise.all(notificationPromises);
    } catch (pushError) {
      console.error("Push notification failed:", pushError);
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}







// This is the sales analytics function you provided
async function getSalesAnalytics() {
  // Last 30 days sales data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesData = await Order.aggregate([
    {
      // Filter for delivered orders in the last 30 days
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
        status: 'DELIVERED' // Ensure you only count completed sales
      }
    },
    {
      // Group by date
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalSales: { $sum: { $add: ['$totalAmount', '$deliveryCharge'] } },
        orderCount: { $sum: 1 },
        averageOrderValue: { $avg: { $add: ['$totalAmount', '$deliveryCharge'] } }
      }
    },
    { 
      // Sort the results by date in ascending order for charting
      $sort: { _id: 1 } 
    }
  ]);

  return salesData;
}



// --- MODIFIED GET HANDLER ---
export async function GET(request: NextRequest) {
  try {
    // --- Authentication (optional but recommended) ---
    // const session = await getServerSession(authOptions);
    // if (!session?.user.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    await connectToDatabase();

    // Check for the '?view=analytics' query parameter
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view');

    // If the client is requesting analytics data
    if (view === 'analytics') {
      const analyticsData = await getSalesAnalytics();
      return NextResponse.json({ success: true, analytics: analyticsData });
    }

    // --- Default behavior: Get all orders ---
    const orders = await Order.find({})
      // Note: Populating items on a list of all orders can be memory-intensive.
      // Consider populating only when fetching a single order.
      .populate("items.product") // Assuming 'product' is the ref in your items array
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });

  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}