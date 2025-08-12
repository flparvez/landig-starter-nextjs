import mongoose, { Schema, model, models, Document } from "mongoose";

// 🎯 Image Schema Interface
export interface IProductImage {
  url: string;
  fileId?: string;
  altText?: string;
}

// 📦 Product Interface
export interface IProduct extends Document {
  name: string;
  slug: string;
  _id: string; // MongoDB ObjectId
  description: string;
  price: number;
  mprice: number;
  stock?: number;
  category: string;
  brand?: string;
  video?: string;
  tags?: string[];
  specifications?: Record<string, string>;
  images: IProductImage[];
  featured?: boolean;
  rating?: number;
}

// 🖼️ Image SubSchema
const productImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    fileId: { type: String },
    altText: { type: String },
  },
  { _id: false }
);

// 🛍️ Product Schema
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    mprice: { type: Number },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true, index: true },
    brand: { type: String },
    video: { type: String },
    images: { type: [productImageSchema], required: true },
    tags: [{ type: String }],
    specifications: { type: Schema.Types.Mixed },
    featured: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  {
    timestamps: true,
  }
);

// 🔁 Auto Slug Generation (from name)
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  }
  next();
});

export const Product = models.Product || model<IProduct>("Product", productSchema);