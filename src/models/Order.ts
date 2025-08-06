import { Schema, model, models } from "mongoose";
import { IOrderItem } from "./OrderItem";

// নতুন enum টাইপ
type PaymentMethod = "BKASH" | "NAGAD" | "COD";
type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
type PaymentType = "FULL" | "PARTIAL";

export interface IOrder {
  _id: Schema.Types.ObjectId;
  orderId: string; // Auto generated 3-digit unique string
  user?: Schema.Types.ObjectId;
  fullName: string;
  phone: string;
  address: string;
  city?: string;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  trxId?: string; // Optional for COD
  status: OrderStatus;
  totalAmount: number;
  deliveryCharge: number;
  items: IOrderItem[];
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String },
    paymentMethod: {
      type: String,
      enum: ["BKASH", "NAGAD", "COD"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["FULL", "PARTIAL"],
      default: "FULL",
      required: true,
    },
    trxId: {
      type: String,
      required: function (this: IOrder) {
        return this.paymentMethod !== "COD";
      },
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    totalAmount: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "OrderItem", required: true }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// ✅ Auto-generate 3-digit orderId before saving
orderSchema.pre("validate", async function (next) {
  if (!this.orderId) {
    let isUnique = false;
    while (!isUnique) {
      const generated = Math.floor(100 + Math.random() * 900).toString(); // 3-digit
      const exists = await Order.exists({ orderId: generated });
      if (!exists) {
        this.orderId = generated;
        isUnique = true;
      }
    }
  }
  next();
});

export const Order = models.Order || model<IOrder>("Order", orderSchema);
