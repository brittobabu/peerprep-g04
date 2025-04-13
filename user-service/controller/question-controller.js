
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



export async function seedQuestions(req, res) {
  try {
    const defaultQuestions = [
      {
        title: "Reverse a String",
        description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory. Example 1: Input: s = [\"h\",\"e\",\"l\",\"l\",\"o\"] Output: [\"o\",\"l\",\"l\",\"e\",\"h\"] Example 2: Input: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"] Output: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"] Constraints: 1 <= s.length <= 10^5 s[i] is a printable ascii character",
        category: "Strings, Algorithms",
        complexity: "Easy"
      },
      {
        title: "Linked List Cycle Detection",
        description: "Implement a function to detect if a linked list contains a cycle.",
        category: "Data Structures, Algorithms",
        complexity: "Easy"
      },
      {
        title: "Roman to Integer",
        description: "Given a roman numeral, convert it to an integer.",
        category: "Algorithms",
        complexity: "Easy"
      },
      {
        title: "Add Binary",
        description: "Given two binary strings a and b, return their sum as a binary string.",
        category: "Bit Manipulation, Algorithms",
        complexity: "Easy"
      },
      {
        title: "Fibonacci Number",
        description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is, F(0) = 0, F(1) = 1 F(n) = F(n - 1) + F(n - 2), for n > 1. Given n, calculate F(n).",
        category: "Recursion, Algorithms",
        complexity: "Easy"
      },
      {
        title: "Implement Stack using Queues",
        description: "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).",
        category: "Data Structures",
        complexity: "Easy"
      },
      {
        title: "Combine Two Tables",
        description: "Given table Person and Address, write a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead.",
        category: "Databases",
        complexity: "Easy"
      },
      {
        title: "Repeated DNA Sequences",
        description: "Given a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule.",
        category: "Algorithms, Bit Manipulation",
        complexity: "Medium"
      },
      {
        title: "Course Schedule",
        description: "You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.",
        category: "Data Structures, Algorithms",
        complexity: "Medium"
      },
      {
        title: "LRU Cache Design",
        description: "Design and implement an LRU (Least Recently Used) cache.",
        category: "Data Structures",
        complexity: "Medium"
      },
      {
        title: "Longest Common Subsequence",
        description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
        category: "Strings, Algorithms",
        complexity: "Medium"
      },
      {
        title: "Rotate Image",
        description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).",
        category: "Arrays, Algorithms",
        complexity: "Medium"
      },
      {
        title: "Airplane Seat Assignment Probability",
        description: "n passengers board an airplane with exactly n seats. The first passenger has lost the ticket and picks a seat randomly. Return the probability that the nth person gets his own seat.",
        category: "Brainteaser",
        complexity: "Medium"
      },
      {
        title: "Validate Binary Search Tree",
        description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
        category: "Data Structures, Algorithms",
        complexity: "Medium"
      },
      {
        title: "Sliding Window Maximum",
        description: "You are given an array of integers nums, and a sliding window of size k moving from left to right. Return the max value in each window.",
        category: "Arrays, Algorithms",
        complexity: "Hard"
      },
      {
        title: "Test Question",
        description: "Test Description",
        category: "L",
        complexity: "Medium"
      },
      {
        title: "Test Question",
        description: "No",
        category: "Ama",
        complexity: "Hard"
      }
    ];

    const inserted = [];

    for (const q of defaultQuestions) {
      const exists = await QuestionModel.findOne({ title: q.title });
      if (!exists) {
        const newQ = new QuestionModel(q);
        await newQ.save();
        inserted.push(newQ);
      }
    }

    res.status(201).json({
      message: `Seeded ${inserted.length} new question(s)`,
      data: inserted.map(formatQuestionResponse),
    });
  } catch (err) {
    console.error("Seeding questions failed:", err);
    res.status(500).json({ message: "Failed to seed questions", detail: err.message });
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