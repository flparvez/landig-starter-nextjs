"use client";

import { useState } from "react";
import FileUpload from "@/components/Fileupload";

interface IProductImage {
  url: string;
  fileId?: string;
}

const CreateProduct = () => {
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
  const [loading, setLoading] = useState(false);

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
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          mprice: Number(formData.mprice),
          stock: Number(formData.stock),
          images,
        }),
      });
console.log("res",res)
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert("Failed: " + data.message);
        return;
      }

      alert("✅ Product created successfully!");
      setFormData({
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
      setImages([]);
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">Create Product</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name*"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category*"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="video"
          value={formData.video}
          onChange={handleChange}
          placeholder="YouTube/Video URL"
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price*"
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="mprice"
          value={formData.mprice}
          onChange={handleChange}
          placeholder="Market Price"
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock Quantity"
          className="w-full border p-2 rounded"
        />

        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="accent-blue-600"
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

      <FileUpload
        onUploadComplete={(urls) => setImages(urls.map((url) => ({ url })))}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Saving..." : "Create Product"}
      </button>
    </div>
  );
};

export default CreateProduct;
