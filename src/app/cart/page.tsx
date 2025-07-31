"use client";

import { useCart } from "@/hooks/useCart";
import { Image } from "@imagekit/next";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, total } = useCart();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="cart">🛒</span> Your Cart
      </h2>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p className="mb-4">Your cart is empty.</p>
          <Link
            href="/shop"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row items-center gap-4 border rounded-lg p-4 bg-white shadow-sm"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded object-cover border"
                />
                <div className="flex-1 w-full">
                  <h4 className="font-semibold text-lg">{item.name}</h4>
                  <p className="text-gray-500 text-sm mb-2">৳{item.price}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Qty:</span>
                    <button
                      aria-label="Decrease quantity"
                      onClick={() =>
                        updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                      }
                      className="p-1 rounded border hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) =>
                        updateQuantity(item.productId, Math.max(1, Number(e.target.value)))
                      }
                      className="w-12 text-center border rounded p-1"
                    />
                    <button
                      aria-label="Increase quantity"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-1 rounded border hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} /> Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-6 mt-4 gap-4">
            <div className="flex items-center gap-4">
              <p className="font-bold text-lg">
                Total: <span className="text-blue-600">৳{total}</span>
              </p>
              <button
                onClick={clearCart}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm underline"
              >
                <Trash2 size={16} /> Clear Cart
              </button>
            </div>
            <Link
              href="/checkout"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
