import express from "express";

import { handleLogin, handleVerifyToken } from "../controller/auth-controller.js";
import { createUser } from "../controller/user-controller.js"
import { verifyAccessToken } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/login", handleLogin);
router.post("/signup", createUser);

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

export default router;
