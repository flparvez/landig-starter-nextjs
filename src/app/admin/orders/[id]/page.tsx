"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { generateInvoicePdf } from "@/hooks/invoiceGenerator";
import { Image } from "@imagekit/next";
import { IIOrder } from "@/types/product";

// Interfaces




const AdminOrderDetailsPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [order, setOrder] = useState<IIOrder>({} as IIOrder);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    status: "",
    paymentMethod: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      // const res = await fetch(`http://localhost:3000/api/orders/${id}`);
      const res = await fetch(`https://landig-starter-nextjs.vercel.app/api/orders/${id}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
        setForm({
          status: data.order.status,
          paymentMethod: data.order.paymentMethod,
        });
      } else {
        alert("❌ Failed to fetch order");
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      alert("❌ Update failed");
    } else {
      alert("✅ Order updated successfully");
      router.refresh(); // reload data
    }
  };

  if (!order) return <div>Loading order...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold">Order Details</h1>

      {/* Order Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><strong>Order ID:</strong> {order?._id?.toString().slice(-6)}</p>
          <p><strong>User:</strong> {order.fullName}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Address:</strong> {order.address}, {order.city}</p>
          <p><strong>Total:</strong> ৳{order.totalAmount}</p>
          <p><strong>Delivery Charge:</strong> ৳{order.deliveryCharge}</p>
          <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <div>
          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
          >
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="BKASH">Bkash</option>
            <option value="NAGAD">Nagad</option>
          </select>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Order"}
          </button>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h2 className="text-xl font-semibold mt-8 mb-2">Ordered Products</h2>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div key={item._id} className="flex items-center gap-4 border p-3 rounded">
              <Image
                src={item.product?.images?.[0]?.url || "/placeholder.jpg"}
                alt={item.product?.name}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.product?.name}</p>
                <p>Price: ৳{item.price} × {item.quantity}</p>
                <p>Total: ৳{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => generateInvoicePdf(order)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        📄 Download Invoice
      </button>
    </div>
  );
};

export default AdminOrderDetailsPage;
