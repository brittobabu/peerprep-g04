
import { isValidObjectId } from "mongoose";
import { addQuestion as _addQuestion } from "../model/question.js";


export async function addQuestion(req, res) {
    try {
        const { title, description, category, complexity } = req.body;
        // if (username && email && password) {
        //     const existingUser = await _findUserByUsernameOrEmail(username, email);
        //     if (existingUser) {
        //         return res.status(409).json({ message: "username or email already exists" });
        //     }
        // }
        console.log("qeveav")
        const newQuestion =  await _addQuestion(title, description, category, complexity)

        res.status(201).json({ message: 'Question added successfully!',data : newQuestion });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add question.' });
    }
    
}

