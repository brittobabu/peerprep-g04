
import { isValidObjectId } from "mongoose";
import { addQuestion as _addQuestion, findQuestionByDescription, findQuestionByTitle } from "../model/question.js";
import { findAllQuestions as _findAllQuestions } from "../model/question.js";


export async function addQuestion(req, res) {
    try {
        const { title, description, category, complexity } = req.body.questionData;

        if (!(title && description && category && complexity)) {
            res.status(500).json({ message: 'Missing input fields.' });
        }
        const existingQuestion1 = await findQuestionByTitle(title)
        const existingQuestion2 = await findQuestionByDescription(description)

        if(existingQuestion1 || existingQuestion2){
            res.status(500).json({ message: 'Question already exist.' });
        }

        const newQuestion =  await _addQuestion(title, description, category, complexity)

        console.log("Question added")

        res.status(201).json({ message: 'Question added successfully!',data : newQuestion });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to add question.' });
    }
}


export async function findAllQuestions(req,res){
    try {
        const questions = await _findAllQuestions();
        return res.status(200).json({ message: `Found Questions`, data: questions.map(formatQuestionResponse) });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Unknown error when getting all questions!" });
      }
} 

export function formatQuestionResponse(question) {
    return {
      id: question.questionId,
      title: question.title,
      description: question.description,
      category: question.category,
      complexity: question.complexity,
    };
  }