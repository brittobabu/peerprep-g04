
import { isValidObjectId } from "mongoose";
import { addQuestion as _addQuestion, findQuestionByDescription, findQuestionById, findQuestionByTitle, updateQuestion } from "../model/question.js";
import { findAllQuestions as _findAllQuestions } from "../model/question.js";
import { deleteQuestionById as _deleteQuestionById } from "../model/question.js";
import QuestionModel from "../model/question-model.js";

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

export async function deteleQuestion(req,res){
    try{
        const id = req.params.id
        console.log(id);
        
        await _deleteQuestionById(id)
        
        return res.status(201).json({message: `Question delete successfull id : ${id}`})

    }catch(err){
        console.log(err)
    }
}


export async function getQuestionMeta(req, res) {
    try {
      const rawCategories = await QuestionModel.distinct("category");
      const complexities = await QuestionModel.distinct("complexity");
  
      // Flatten and deduplicate category strings
      const categorySet = new Set();
      rawCategories.forEach(cat => {
        cat.split(',').forEach(c => categorySet.add(c.trim()));
      });
  
      const categories = Array.from(categorySet);
  
      res.json({ categories, complexities });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  export async function filterQuestions(req, res) {
    try {
      const topic = req.query.topic;
      const complexity = req.query.complexity;
  
      if (!topic || !complexity) {
        return res.status(400).json({ error: "Missing topic or complexity" });
      }
  
      // Find all matching by complexity first
      const allQuestions = await QuestionModel.find({ complexity });
  
      // Then check if the topic exists in the comma-separated category string
      const matching = allQuestions.filter(q =>
        q.category
          .split(',')
          .map(c => c.trim().toLowerCase())
          .includes(topic.toLowerCase())
      );
  
      res.json(matching);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
// export async function editQuestion(req,res){
 

//     try {
//         const id =  req.params.id
//         const { title, description, category, complexity } = req.body.editedData;

//         const updatedQuestion = await updateQuestion(id,title,description,category,complexity)
//         // console.log(updatedQuestion)
//         res.status(201).json({message:"Question updated successfully", data: (formatQuestionResponse(updatedQuestion))})

//     } catch (err) {
//         console.log(err)
//     }
// }

export async function editQuestion(req, res) {
    try {
        const id = req.params.id;
        const { title, description, category, complexity } = req.body; // Expecting `req.body` directly

        if (!(title && description && category && complexity)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const updatedQuestion = await updateQuestion(id, title, description, category, complexity);
        res.status(200).json({ message: "Question updated successfully", data: formatQuestionResponse(updatedQuestion) });

    } catch (err) {
        console.error("Error updating question:", err);
        res.status(500).json({ message: "Failed to update question" });
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