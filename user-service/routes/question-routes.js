import express from "express";

import { addQuestion } from "../controller/question-controller.js";

const router = express.Router()

router.post("/add", addQuestion);

router.get("/",(req,res) => {
    console.log("here")
})


export default router;