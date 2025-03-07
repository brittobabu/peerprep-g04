
import { isValidObjectId } from "mongoose";
import { addQuestion as _addQuestion } from "../model/question.js";


export async function addQuestion(req, res) {
    try {
        const { title, description, category, complexity } = req.body.questionData;


        const newQuestion =  await _addQuestion(title, description, category, complexity)

        console.log("Question added")
        res.status(201).json({ message: 'Question added successfully!',data : newQuestion });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to add question.' });
    }
}


