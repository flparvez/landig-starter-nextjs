"use client";


import { useCart } from "@/hooks/useCart";
import { Image } from "@imagekit/next";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, total } = useCart();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 border p-3 rounded">
              <Image src={item.image} alt={item.name} width={80} height={80} />
              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <p>Price: ৳{item.price}</p>
                <div className="flex items-center gap-2">
                  <label>Qty:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      updateQuantity(item.productId, Number(e.target.value))
                    }
                    className="w-16 border p-1 rounded"
                  />
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500 text-sm"
              >
                ❌ Remove
              </button>
            </div>
          ))}

          <div className="text-right mt-4">
            <p className="font-bold text-lg">Total: ৳{total}</p>
            <button
              onClick={clearCart}
              className="text-sm text-red-500 mt-2 underline"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
