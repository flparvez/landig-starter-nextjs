import { Schema, model, models, Document } from "mongoose";

export interface IOrderItem extends Document {
  order: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

const orderItemSchema = new Schema<IOrderItem>({
  order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

export const OrderItem =
  models.OrderItem || model<IOrderItem>("OrderItem", orderItemSchema);