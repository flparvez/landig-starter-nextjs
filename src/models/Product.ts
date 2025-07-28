import mongoose, { Schema, model, models } from "mongoose"; 
 export interface IProductImage {
  url: string;
  fileId?: string;
  altText?: string;
}

export interface IProduct {
  name: string;
  _id: mongoose.Types.ObjectId;
  slug: string;
  description: string;
  price: number;
  mprice: number;
  stock?: number;
  category: string;
  brand?: string;
  video? : string;
  images: IProductImage[];
  featured?: boolean;
}
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    mprice: { type: Number },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
    brand: { type: String },
    video: { type: String },
    images: { type: [String], },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre("save", async function (next){
  if (this.isModified("name")){
    this.slug = this.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  }
  next();
})

export const Product = models.Product || model<IProduct>("Product", productSchema);