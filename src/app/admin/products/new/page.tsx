 "use client";
import FileEditUpload from "@/components/FileEditUplaod";
import FileUpload from "@/components/Fileupload";
import { useState } from "react";

import { toast } from "sonner";
interface IProductImage {
url: string;
fileId?: string;
altText?: string;
}
interface ISpecification {
[key: string]: string;
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
tags: "",
rating: "0",
});
const [specifications, setSpecifications] = useState<ISpecification>({});
  const [images, setImages] = useState<IProductImage[]>([]);
  const [reviews, setReviews] = useState<IProductImage[]>([]);
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
const handleSpecChange = (key: string, value: string) => {
setSpecifications((prev) => ({ ...prev, [key]: value }));
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
if (
!formData.name ||
!formData.description ||
!formData.price ||
!formData.category ||
images.length === 0
) {
alert("❗ সমস্ত প্রয়োজনীয় ফিল্ড পূরণ করুন এবং অন্তত একটি ছবি যুক্ত করুন।");
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
      rating: Number(formData.rating),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      specifications,
      images,
      reviews
    }),
  });

  const data = await res.json();
  setLoading(false);

  if (!res.ok) {
    alert("❌ Failed: " + data.message);
    return;
  }

  toast.success("✅ Product created successfully!");
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
    tags: "",
    rating: "0",
  });
  setImages([]);
  setReviews([])
  setSpecifications({});
} catch (error) {
  console.error(error);
  alert("❌ Something went wrong!");
  setLoading(false);
}
};
return (
<div className="max-w-3xl mx-auto p-6 space-y-6 bg-white shadow rounded">
<h1 className="text-2xl font-bold">Create Product</h1>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      { name: "name", placeholder: "Product Name*", type: "text" },
      { name: "category", placeholder: "Category*", type: "text" },
      { name: "brand", placeholder: "Brand", type: "text" },
      { name: "video", placeholder: "YouTube/Video URL", type: "text" },
      { name: "price", placeholder: "Price*", type: "number" },
      { name: "mprice", placeholder: "Market Price", type: "number" },
      { name: "stock", placeholder: "Stock Quantity", type: "number" },
      { name: "rating", placeholder: "Initial Rating (0-5)", type: "number" },
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

  <div className="space-y-2">
    <h3 className="text-lg font-medium">🧾 Specifications</h3>
    {Object.entries(specifications).map(([key, value], index) => (
      <div key={index} className="flex gap-2">
        <input
          type="text"
          value={key}
          onChange={(e) => {
            const newKey = e.target.value;
            const val = specifications[key];
            const updated = { ...specifications };
            delete updated[key];
            updated[newKey] = val;
            setSpecifications(updated);
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
        <FileUpload
            defaultImages={images}
            onUploadComplete={handleProductImageUpload}
            onImageRemove={handleProductImageRemove}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">⭐ Review Images</h3>
        <FileUpload
            defaultImages={reviews}
            onUploadComplete={handleReviewImageUpload}
            onImageRemove={handleReviewImageRemove}
        />
      </div>

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