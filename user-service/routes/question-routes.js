import express from "express";

import { addQuestion,findAllQuestions } from "../controller/question-controller.js";

const router = express.Router()

router.post("/add", addQuestion);
router.get("/all", findAllQuestions);

router.get("/",(req,res) => {
    console.log("here")
})


export default router;