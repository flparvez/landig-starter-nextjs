"use client";

import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Image } from "@imagekit/next";
import Link from "next/link";

const CheckoutPage = () => {
  const { cart, total, clearCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "COD",
    paymentType: "FULL", // FULL | PARTIAL
    trxId: "",
  });

  const [loading, setLoading] = useState(false);

  // const deliveryCharge = form.city.trim().toLowerCase() === "dhaka" ? 60 : 120;
  const deliveryCharge = 0; // Assuming free delivery for simplicity
  const totalAmount =
    form.paymentType === "PARTIAL" ? 100  : total ;
 
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { fullName, phone, address } = form;

    if (!fullName || !phone || !address) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    

    if (cart.length === 0) {
      alert("🛒 Cart is empty!");
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
      router.push(`/orders/${data?.order._id}`);
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded space-y-6">
      <Link href="/landing" className="text-blue-600 text-xl hover:underline">
        ← Back to Page
      </Link>
      <h2 className="text-xl sm:text-lg font-bold text-center mb-4 text-blue-700">অর্ডারটি কনফার্ম করতে ফর্মটি সম্পুর্ণ পুরণ করে নিচের Confirm Order বাটনে ক্লিক করুন।</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "fullName", placeholder: "আপনার নাম*", type: "text" },
          { name: "phone", placeholder: "মোবাইল নাম্বার*", type: "text" },
          { name: "address", placeholder: "আপনার ঠিকানা/এলাকার নাম, থানা, জেলা*", type: "text" },
        ].map(({ name, placeholder, type }) => (
          <input
            key={name}
            type={type}
            name={name}
            value={form[name as keyof typeof form] as string}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}

        {/* Payment Method */}
        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="COD">Cash on Delivery</option>
          
        </select>

        
      </div>

      {/* Cart Items */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">🧾 Order Summary</h3>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between border rounded p-3 shadow-sm"
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
                    <p className="text-sm text-gray-600">
                      ৳{item.price} × {item.quantity}
                    </p>
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
      </div>

      {/* Total Summary */}
      <div className="mt-6 text-lg font-medium space-y-1 border-t pt-4">
        <p>Sub  Total: ৳{total}</p>
        <p>🚚 সম্পূর্ণ ডেলিভারি চার্জ ফ্রি</p> 
        

        <p className="text-xl font-bold text-green-700">
           Total Payable: ৳{totalAmount}
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || cart.length === 0}
        className="bg-blue-600 text-white text-lg px-4 py-3 rounded w-full hover:bg-blue-700 transition"
      >
        {loading ? "Placing Order..." : "✅ Confirm Order"}
      </button>
    </div>
  );
};

export default CheckoutPage;
