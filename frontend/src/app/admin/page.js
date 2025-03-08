'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function QuestionsList() {
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedData, setEditedData] = useState({ title: "", description: "", category: "", complexity: "" });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:3001/admin/question/all");
        setQuestions(response.data.data);
      } catch (error) {
        setMessage("Error: " + error.message);
      }
    };
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    try {
      const deleteQuestion = await axios.delete(`http://localhost:3001/admin/question/${id}`);
      // console.log(deleteQuestion.status)
      if(deleteQuestion.status == 201){
      setQuestions(questions.filter((q) => q.id !== id));

      }
    } catch (error) {
      setMessage("Error deleting question: " + error.message);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question.id);
    setEditedData({ title: question.title, description: question.description, category: question.category, complexity: question.complexity });
  };

  const handleSave = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3001/admin/question/${id}`, {editedData});
      const updatedQuestion = response.data.data; // Extract updated question from response
      // console.log(updatedQuestion)
      setQuestions(questions.map(q => q.id === id ? updatedQuestion : q));
      setEditingQuestion(null);
    } catch (error) {
      setMessage("Error updating question: " + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">All Questions</h1>
      <ul className="space-y-4">
        {questions.map((question) => (
          <li key={question.id} className="p-4 border rounded-lg shadow-md bg-white">
            {editingQuestion === question.id ? (
              <div>
                <input type="text" value={editedData.title} onChange={(e) => setEditedData({ ...editedData, title: e.target.value })} className="w-full p-2 border rounded mb-2" />
                <textarea value={editedData.description} onChange={(e) => setEditedData({ ...editedData, description: e.target.value })} className="w-full p-2 border rounded mb-2"></textarea>
                <input type="text" value={editedData.category} onChange={(e) => setEditedData({ ...editedData, category: e.target.value })} className="w-full p-2 border rounded mb-2" />
                <select value={editedData.complexity} onChange={(e) => setEditedData({ ...editedData, complexity: e.target.value })} className="w-full p-2 border rounded mb-2">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <button onClick={() => handleSave(question.id)} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
                <button onClick={() => setEditingQuestion(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold">{question.title}</h3>
                <p className="text-xl text-gray-600">{question.description}</p>
                <p className="mt-2 text-m"><strong>Category:</strong> <span className="text-blue-500">{question.category}</span></p>
                <p className="text-m">
                  <strong>Complexity:</strong> 
                  <span className={`ml-1 px-2 py-1 rounded text-white ${question.complexity === "Easy" ? "bg-green-500" : question.complexity === "Medium" ? "bg-yellow-500" : "bg-red-500"}`}>{question.complexity}</span>
                </p>
                <div className="mt-4">
                  <button onClick={() => handleEdit(question)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(question.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
}
