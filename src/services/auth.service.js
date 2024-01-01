import { User } from "../models/user.model.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";
import otpServices from "./otp.service.js";
import { createToken, verifyToken } from "../utils/auth.utils.js";
import config from "../config/index.js";
const signUpIntoDB = async (payload) => {
  const { email } = payload;
  const user = await User.isUserExist(email);
  if (user && user?.verified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "user already exist with the same email!"
    );
  }
  if (!user?.verified) {
    const deleteUser = await User.deleteOne({ email });
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "someting went wrong!");
    }
  }

  const result = await User.create(payload);
  if (!result) {
    throw new AppError(
      httpStatus.UNPROCESSABLE_ENTITY,
      "something went wrong! please try again later"
    );
  }
  await otpServices.createAnOtpIntoDB(result._id, email, "signupVerification");

  return result;
};

const SignInUser = async (payload) => {
  const { email, password } = payload;
  const user = await User.isUserExist(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not exist with this email!");
  }
  const { password: hasedPassword, verified } = user;
  const isPasswordMatched = await User.isPasswordMatched(
    password,
    hasedPassword
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "password do not match!");
  }
  if (!verified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "please verify your account first!"
    );
  }
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    verfied: user.verfied,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token) => {
  const decodeToken = verifyToken(token, config.jwt_refresh_secret);
  if (!verifyToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorized");
  }
  const { userId, email, verified } = decodeToken;
  const jwtPayload = {
    userId,
    email,
    verified,
  };
  const accessToken = createToken(
    jwtPayload,
    jwt_access_secret,
    jwt_access_expires_in
  );
  return {
    accessToken,
  };
};

const authServices = {
  signUpIntoDB,
  SignInUser,
  refreshToken,
};
export default authServices;