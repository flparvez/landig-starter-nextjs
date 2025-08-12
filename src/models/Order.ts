import { Schema, model, models, Document } from "mongoose";
import { IOrderItem } from "./OrderItem";

type PaymentMethod = "BKASH" | "NAGAD" | "COD";
type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
type PaymentType = "FULL" | "PARTIAL";

export interface IOrder extends Document {
  orderId: string;
  user?: Schema.Types.ObjectId;
  fullName: string;
  phone: string;
  address: string;
  city?: string;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  trxId?: string;
  status: OrderStatus;
  totalAmount: number;
  deliveryCharge: number;
  items: Schema.Types.ObjectId[] | IOrderItem[]; // Can be populated
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      index: true,
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

// Auto-generate 3-digit orderId before saving
orderSchema.pre("validate", async function (next) {
  if (this.isNew && !this.orderId) {
    let isUnique = false;
    let generatedId;
    while (!isUnique) {
      generatedId = Math.floor(100 + Math.random() * 900).toString();
      const exists = await models.Order.exists({ orderId: generatedId });
      if (!exists) {
        isUnique = true;
      }
    }
    this.orderId = generatedId as string;
  }
  next();
});

export const Order = models.Order || model<IOrder>("Order", orderSchema);