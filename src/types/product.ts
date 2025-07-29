
import { IUser } from "@/models/User"


export interface Product {
  id: string
  name: string
  description: string
  price: number
  mprice?: number
  stock: number
  category: string
  brand?: string
  featured: boolean
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export type ProductColumn = {
  _id: string
  name: string
  price: number
  stock: number
  featured: boolean
  createdAt: string
}

export interface IIOrder {
  _id: string;
  user: IUser;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: "BKASH" | "NAGAD" | "COD";
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  deliveryCharge: number;
  items: IDisplayOrderItem[];
  createdAt : Date
}


export interface IDisplayOrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: { url: string }[];
  };
  quantity: number;
  price: number;
}

