import express from "express";

import { handleLogin, handleVerifyToken } from "../controller/auth-controller.js";
import { createUser, updateUserPassword, findUserByEmail, seedDefaultUser } from "../controller/user-controller.js"
import { verifyAccessToken } from "../middleware/basic-access-control.js";
import { sendOTP, verifyOTP } from "../controller/otp-controller.js";

console.log("auth-routes loaded");

const router = express.Router();

router.post("/login", handleLogin);
router.post("/signup", createUser);
router.post("/seed", seedDefaultUser);

router.post('/sendOTP', sendOTP);
router.post('/verifyOTP', verifyOTP);

router.post("/forgot-password/verification/reset-password", updateUserPassword);

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

router.get("/findUserByEmail", findUserByEmail);

export default router;


