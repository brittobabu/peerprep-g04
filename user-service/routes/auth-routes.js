import express from "express";

import { handleLogin, handleVerifyToken, handleVerifyCode } from "../controller/auth-controller.js";
import { createUser } from "../controller/user-controller.js"
import { verifyAccessToken } from "../middleware/basic-access-control.js";
import { sendOTP, verifyOTP } from "../controller/otp-controller.js";

const router = express.Router();

router.post("/login", handleLogin);
router.post("/signup", createUser);

router.post("/forgot-password", handleVerifyCode);

router.post('/sendOTP', sendOTP);
router.post('/verifyOTP', verifyOTP);


router.get("/verify-token", verifyAccessToken, handleVerifyToken);

export default router;
