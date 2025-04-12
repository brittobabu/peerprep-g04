import express from "express";

import { addQuestion,deteleQuestion,editQuestion,findAllQuestions } from "../controller/question-controller.js";

import { getQuestionMeta } from "../controller/question-controller.js";

import { filterQuestions } from "../controller/question-controller.js";

const router = express.Router()

router.post("/add", addQuestion);
router.get("/all", findAllQuestions);
router.delete("/:id", deteleQuestion);
router.put("/:id", editQuestion);
router.get("/meta", getQuestionMeta); // e.g. http://localhost:3001/api/questions/meta
router.get('/filter', filterQuestions)
router.get("/",(req,res) => {
    console.log("here")
})


export default router;