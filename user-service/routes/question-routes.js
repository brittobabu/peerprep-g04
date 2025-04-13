import express from "express";

import { addQuestion, deteleQuestion, editQuestion, findAllQuestions, getQuestionMeta, filterQuestions, seedQuestions} from "../controller/question-controller.js";

const router = express.Router()

router.post("/add", addQuestion);
router.get("/all", findAllQuestions);
router.delete("/:id", deteleQuestion);
router.put("/:id", editQuestion);
router.get("/meta", getQuestionMeta); // e.g. http://localhost:3001/api/questions/meta
router.get('/filter', filterQuestions);
router.post("/seed", seedQuestions);
router.get("/",(req,res) => {
    console.log("here")
});


export default router;