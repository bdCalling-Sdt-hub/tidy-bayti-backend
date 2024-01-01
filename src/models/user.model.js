import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config/index.js";
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "name   is required"],
  },
  phoneNumber: {
    type: Number,
    required: [true, "phone number is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    select: 0,
    required: [true, "password is required"],
  },
  profileImage: {
    publicUrl: {
      type: String,
    },
    path: {
      type: String,
    },
  },
  verified: {
    type: Boolean,
    default: false,
  },
});
userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});
userSchema.statics.isUserExist = async function (email) {
  return await User.findOne({ email: email }).select("+password");
};
userSchema.statics.isPasswordMatched = async function (
  plainPassword,
  hashPassword
) {
  return await bcrypt.compare(plainPassword, hashPassword);
};
export const User = model("User", userSchema);