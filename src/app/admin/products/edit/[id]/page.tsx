"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FileEditUpload from "@/components/FileEditUplaod";

interface IProductImage {
  url: string;
  fileId?: string;
}

const EditProduct = () => {
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    mprice: "",
    stock: "",
    category: "",
    brand: "",
    video: "",
    featured: false,
  });

  const [images, setImages] = useState<IProductImage[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch product");

        const product = data.product;

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: String(product.price || ""),
          mprice: String(product.mprice || ""),
          stock: String(product.stock || ""),
          category: product.category || "",
          brand: product.brand || "",
          video: product.video || "",
          featured: product.featured || false,
        });

        setImages(product.images || []);
      } catch (error) {
        console.error(error);
        alert("❌ Could not load product.");
      }
    };

    fetchProduct();
  }, [id]);

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const target = e.target;

  if (target instanceof HTMLInputElement && target.type === "checkbox") {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.checked,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  }
};

  const handleSubmit = async () => {
    const { name, price, category } = formData;
    if (!name || !price || !category || images.length === 0) {
      alert("Please fill all required fields and add at least one image.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          mprice: Number(formData.mprice),
          stock: Number(formData.stock),
          images,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert("❌ Update failed: " + data.message);
        return;
      }

      alert("✅ Product updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">Edit Product</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "name", placeholder: "Product Name*", type: "text" },
          { name: "category", placeholder: "Category*", type: "text" },
          { name: "brand", placeholder: "Brand", type: "text" },
          { name: "video", placeholder: "YouTube/Video URL", type: "text" },
          { name: "price", placeholder: "Price*", type: "number" },
          { name: "mprice", placeholder: "Market Price", type: "number" },
          { name: "stock", placeholder: "Stock Quantity", type: "number" },
        ].map(({ name, placeholder, type }) => (
          <input
            key={name}
            type={type}
            name={name}
         value={(formData as unknown as Record<string, string>)[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full border p-2 rounded"
          />
        ))}

        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          Featured
        </label>
      </div>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Product Description*"
        rows={4}
        className="w-full border p-2 rounded"
      />

      <FileEditUpload
        defaultImages={images}
        onUploadComplete={(urls: string[]) => setImages(urls.map((url) => ({ url })))}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Updating..." : "Update Product"}
      </button>
    </div>
  );
};

export default EditProduct;
