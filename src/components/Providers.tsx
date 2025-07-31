"use client";
import { CartProvider } from "@/hooks/useCart";
import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider> 
    <ImageKitProvider urlEndpoint={urlEndpoint} transformationPosition="path">
<CartProvider>
      {children}
      </CartProvider>
    </ImageKitProvider>
    </SessionProvider>
  );
}