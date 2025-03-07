'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function QuestionsList() {
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:3001/admin/question/all"); // Adjust API route
        setQuestions(response.data.data);
        console.log(response.data.data)
      } catch (error) {
        setMessage("Error: " + error.message);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">All Questions</h1>
      <ul className="space-y-4">
        {questions.map((question) => (
          <li key={question.id} className="p-4 border rounded-lg shadow-md bg-white">
            <h3 className="text-lg font-semibold">{question.title}</h3>
            <p className="text-xl text-gray-600">{question.description}</p>
            <p className="mt-2 text-m">
              <strong>Category:</strong> <span className="text-blue-500">{question.category}</span>
            </p>
            <p className="text-m">
              <strong>Complexity:</strong> 
              <span 
                className={`ml-1 px-2 py-1 rounded text-white ${question.complexity === "Easy" ? "bg-green-500" : question.complexity === "Medium" ? "bg-yellow-500" : "bg-red-500"}`}
              >
                {question.complexity}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
