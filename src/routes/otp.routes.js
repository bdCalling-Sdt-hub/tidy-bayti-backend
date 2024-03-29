import express from "express";
import otpControllers from "../controllers/otp.controller.js";
const router = express.Router();
router.post("/verify-otp/:email", otpControllers.verifyOtp);

const otpRoutes = router;
export default otpRoutes;
