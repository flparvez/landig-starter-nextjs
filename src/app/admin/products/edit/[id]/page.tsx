"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FileEditUpload from "@/components/FileEditUplaod"; // Corrected the typo from Uplaod to Upload if necessary
import { toast } from "sonner"; // Using toast for better UX than alerts

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
  const [fetching, setFetching] = useState(true); // State to track initial data load

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
      setFetching(true);
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
        setReviews(product.reviews || []);
        setSpecifications(product.specifications || {});
      } catch (error) {
        console.error(error);
        toast.error("❌ Could not load product data.");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    if (type === "checkbox" && target instanceof HTMLInputElement) {
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.name || !formData.price || !formData.category || images.length === 0) {
      toast.error("❗ Please fill required fields and ensure there's at least one product image.");
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
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
          specifications,
          images, // This state is now always correct
          reviews, // This state is also always correct
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error("❌ Update failed: " + data.message);
        return;
      }
      toast.success("✅ Product updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("❌ An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-6 text-center">Loading product data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">Edit Product</h1>

      {/* --- Form fields (unchanged) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ...inputs... */}
      </div>
      <textarea /* ... */ />
      <div className="space-y-2">
        {/* ...specifications... */}
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
        className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
      >
        {loading ? "Updating..." : "Update Product"}
      </button>
    </div>
  );
};

export default EditProduct;