import  { Schema, model, models } from "mongoose";
import { IOrderItem } from "./OrderItem";

export interface IOrder {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: "BKASH" | "NAGAD" | "COD";
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  deliveryCharge: number;
  items: IOrderItem[];
  createdAt : Date
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["BKASH", "NAGAD", "COD"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    totalAmount: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Order = models.Order || model<IOrder>("Order", orderSchema);
