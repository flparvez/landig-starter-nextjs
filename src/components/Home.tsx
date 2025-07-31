"use client"
import { useCart } from '@/hooks/useCart';
import { IProduct } from '@/models/Product'
import { Image } from '@imagekit/next';

import React from 'react'
import { toast } from 'sonner';

const Home =  ({products}: {products: IProduct[]}) => {
  const { addToCart } = useCart();
const handleClick = (product: IProduct) => {
    addToCart({
      productId: product._id.toString(),
      name: product.name,
      image: product.images[0]?.url,
      price: product.price,
      quantity: 1,
    });
    toast.success("✅ Added to cart");
  };

  return (
    <div>
      <h2>test products</h2>
      {
        products?.map((product: IProduct) => (
          <div key={product.price}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
  <button
      onClick={() => handleClick(product)}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Add to Cart
    </button>
            <Image
      src={product.images[0].url}
      alt="Next.js logo"
      width={400}
      height={400}
      loading="eager"
transformation={[{   
                
                
             overlay: { 
              type: "text", 
              text: "Unique Store Bd", 
              transformation: [
                { fontSize: 40, fontColor: "orange", fontFamily: "Arial",   } // Specify font size and color of the text
              ] 
            } 


}]}
    />
 
          </div>
        ))
      }
      <h2>Home</h2>
    </div>
  )
}

export default Home
