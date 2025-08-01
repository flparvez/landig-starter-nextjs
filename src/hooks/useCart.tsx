"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// 1. Define types
export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

// 2. Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "cart";

// 3. Create Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[] | undefined>(undefined);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      setCart(JSON.parse(stored));
    } else {
      setCart([]);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (cart !== undefined) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  // Cart actions
  const addToCart = (item: CartItem) => {
    setCart((prev = []) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev = []) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev = []) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const total =
    cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart: cart ?? [],
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 4. Custom Hook for Access
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
