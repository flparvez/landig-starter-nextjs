"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FileEditUpload from "@/components/FileEditUplaod";
import { toast } from "sonner";
interface IProductImage {
url: string;
fileId?: string;
altText?: string;
}
interface ISpecification {
[key: string]: string;
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
tags: "",
rating: "0",
});

  const [images, setImages] = useState<IProductImage[]>([]);
  const [reviews, setReviews] = useState<IProductImage[]>([]);
const [specifications, setSpecifications] = useState<ISpecification>({});
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
      tags: (product.tags || []).join(", "),
      rating: String(product.rating || 0),
    });

    setImages(product.images || []);
    setReviews(product?.reviews || []);
    setSpecifications(product.specifications || {});
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
const handleSpecChange = (key: string, value: string) => {
setSpecifications((prev) => ({
...prev,
[key]: value,
}));
};

  // --- MODIFICATION START ---

  // Handler for when a new batch of PRODUCT images is uploaded
  const handleProductImageUpload = (newUrls: string[]) => {
    setImages((prevImages) => [
      ...prevImages,
      ...newUrls.map((url) => ({ url })), // Append new images to the existing list
    ]);
    toast.success(`${newUrls.length} new product image(s) added.`);
  };

  // Handler for when a PRODUCT image is removed
  const handleProductImageRemove = (updatedUrls: string[]) => {
    // The child component provides the complete, updated list
    setImages(updatedUrls.map((url) => ({ url })));
  };

  // Handler for when a new batch of REVIEW images is uploaded
  const handleReviewImageUpload = (newUrls: string[]) => {
    setReviews((prevReviews) => [
      ...prevReviews,
      ...newUrls.map((url) => ({ url })), // Append new images to the existing list
    ]);
    toast.success(`${newUrls.length} new review image(s) added.`);
  };

  // Handler for when a REVIEW image is removed
  const handleReviewImageRemove = (updatedUrls: string[]) => {
    // The child component provides the complete, updated list
    setReviews(updatedUrls.map((url) => ({ url })));
  };

  // --- MODIFICATION END ---





const handleSubmit = async () => {
const { name, price, category } = formData;

if (!name || !price || !category || images.length === 0) {
  alert("❗ Please fill all required fields and upload at least one image.");
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
      rating: Number(formData.rating),
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      specifications,
      images,
      reviews,
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
code
Code
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      { name: "name", placeholder: "Product Name*", type: "text" },
      { name: "category", placeholder: "Category*", type: "text" },
      { name: "brand", placeholder: "Brand", type: "text" },
      { name: "video", placeholder: "YouTube/Video URL", type: "text" },
      { name: "price", placeholder: "Price*", type: "number" },
      { name: "mprice", placeholder: "Market Price", type: "number" },
      { name: "stock", placeholder: "Stock Quantity", type: "number" },
      { name: "rating", placeholder: "Rating (0-5)", type: "number" },
      { name: "tags", placeholder: "Tags (comma separated)", type: "text" },
    ].map(({ name, placeholder, type }) => (
      <input
        key={name}
        type={type}
        name={name}
        value={formData[name as keyof typeof formData] as string}
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

  <div className="space-y-2">
    <h3 className="text-lg font-semibold">📋 Specifications</h3>
    {Object.entries(specifications).map(([key, value], index) => (
      <div key={index} className="flex gap-2 mb-2">
        <input
          type="text"
          value={key}
          onChange={(e) => {
            const newKey = e.target.value;
            const newSpecs = { ...specifications };
            const val = newSpecs[key];
            delete newSpecs[key];
            newSpecs[newKey] = val;
            setSpecifications(newSpecs);
          }}
          className="w-1/2 border p-2 rounded"
          placeholder="Title"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleSpecChange(key, e.target.value)}
          className="w-1/2 border p-2 rounded"
          placeholder="Value"
        />
      </div>
    ))}

    <button
      type="button"
      className="bg-gray-200 px-3 py-1 rounded text-sm"
      onClick={() => handleSpecChange("", "")}
    >
      ➕ Add Specification
    </button>
  </div>

 {/* --- MODIFIED FILE UPLOADERS --- */}
      <div>
        <h3 className="text-lg font-medium mb-2">📸 Product Images</h3>
        <FileEditUpload
            defaultImages={images}
            onUploadComplete={handleProductImageUpload}
            onImageRemove={handleProductImageRemove}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">⭐ Review Images</h3>
        <FileEditUpload
            defaultImages={reviews}
            onUploadComplete={handleReviewImageUpload}
            onImageRemove={handleReviewImageRemove}
        />
      </div>
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