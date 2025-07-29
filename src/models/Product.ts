import mongoose, { Schema, model, models } from "mongoose";

export interface IProductImage {
  url: string;
  fileId?: string;
  altText?: string;
}

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  mprice: number;
  stock?: number;
  category: string;
  brand?: string;
  video?: string;
  images: IProductImage[];
  featured?: boolean;
}

const productImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    fileId: { type: String },
    altText: { type: String },
  },
  { _id: false } // Don't create _id for subdocs
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    mprice: { type: Number },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
    brand: { type: String },
    video: { type: String },
    images: { type: [productImageSchema], required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate slug from name
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  }
  next();
});

export const Product = models.Product || model<IProduct>("Product", productSchema);
