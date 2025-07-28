import bcrypt from "bcryptjs";
import  mongoose,{ Schema, model, models } from "mongoose";

export interface IUser {
  name :string;
  email: string;
  password: string;
  role : string
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true },

    password: { type: String },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next){

  if (this.isModified("password")) {
     this.password = await bcrypt.hash(this.password, 10)
  }
  next();
})

export const User = models.User || model<IUser>("User", userSchema);