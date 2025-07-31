"use client";

import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Image } from "@imagekit/next";


const CheckoutPage = () => {
  const { cart, total, clearCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "COD",
  });

  const [loading, setLoading] = useState(false);

  const deliveryCharge = form.city.toLowerCase() === "dhaka" ? 60 : 120;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone || !form.address || !form.city) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cartItems: cart,
          deliveryCharge,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert("❌ Order failed: " + data.error);
        return;
      }

      alert("✅ Order placed successfully!");
      clearCart();
      router.push("/thank-you");
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded space-y-6">

      <h2 className="text-2xl font-bold">Checkout</h2>

      <input
        type="text"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Full Name*"
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Mobile Number*"
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Full Address*"
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City (e.g., Dhaka)*"
        className="w-full border p-2 rounded"
      />

      <h2 className="text-xl font-bold mb-4">  Items</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between border rounded p-3"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-600">৳{item.price} × {item.quantity}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                  }
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="ml-4 text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="my-6" />


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

      <div className="mt-4">
        <p>🧾 Product Total: <strong>৳{total}</strong></p>
        <p>🚚 Delivery Charge: <strong>৳{deliveryCharge}</strong></p>
        <p className="text-lg mt-2">💰 Total Payable: <strong>৳{total + deliveryCharge}</strong></p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || cart.length === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default CheckoutPage;
