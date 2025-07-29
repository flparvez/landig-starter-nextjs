"use client";

import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const { cart, total, clearCart } = useCart();
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded space-y-6">
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
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default CheckoutPage;
