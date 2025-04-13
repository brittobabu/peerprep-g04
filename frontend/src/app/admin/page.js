'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function QuestionsList() {
  const [userId, setUserId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedData, setEditedData] = useState({ title: "", description: "", category: "", complexity: "" });
  const [filterComplexity, setFilterComplexity] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const router = useRouter();


  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserId(parsed.data.username);
      if (!parsed.data?.isAdmin) {
        router.replace("/user-dashboard"); // redirect non-admin
      }
    } else {
      router.replace("/"); // not logged in
    }
  }, []);
  

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/question/all");
      setQuestions(response.data.data);
      setFilteredQuestions(response.data.data);
      const uniqueCategories = [...new Set(response.data.data.map(q => q.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  useEffect(() => {
    let filtered = questions;
    if (filterComplexity) {
      filtered = filtered.filter(q => q.complexity === filterComplexity);
    }
    if (filterCategory) {
      filtered = filtered.filter(q => q.category === filterCategory);
    }
    setFilteredQuestions(filtered);
  }, [filterComplexity, filterCategory, questions]);

  const handleDelete = async (id) => {
    try {
      const deleteQuestion = await axios.delete(`http://localhost:3001/admin/question/${id}`);
      if (deleteQuestion.status === 201) {
        fetchQuestions();
      }
    } catch (error) {
      setMessage("Error deleting question: " + error.message);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question.id);
    setEditedData({ ...question });
  };

  const handleSave = async (id) => {
    try {
      console.log("Saving question:", id, editedData);
      const response = await axios.put(`http://localhost:3001/admin/question/${id}`, editedData);
      console.log("Response from server:", response.data);
      
      if (response.status === 200) {
        setEditingQuestion(null);
        setQuestions(prevQuestions => prevQuestions.map(q => q.id === id ? { ...q, ...editedData } : q));
        setFilteredQuestions(prevQuestions => prevQuestions.map(q => q.id === id ? { ...q, ...editedData } : q));
      } else {
        setMessage("Failed to update question. Please try again.");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      setMessage("Error updating question: " + error.message);
    }
  };

  return (

    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#fbe7d0] p-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-4xl font-bold text-[#1e1e1e]">PEERPREP Admin</h1>
          <p className="text-sm">Manage coding questions and categories</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-full shadow">
            <span role="img" aria-label="user">👤</span>
          </div>
          <p className="font-medium">{userId ?? 'Your name'}</p>
          <button
            onClick={() => {
                localStorage.removeItem("user_data"); // Clear any session storage
                router.push("/"); // Redirect to landing/login page
          }}
            className="ml-4 px-4 py-1 bg-[#e67e22] text-white rounded-lg shadow hover:bg-[#cf711c]"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Questions</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        <div className="flex justify-between mb-4">
          <div>
            <select value={filterComplexity} onChange={(e) => setFilterComplexity(e.target.value === 'all' ? '' : e.target.value)} className="p-2 border rounded bg-gray-800 text-white">
              <option value="" disabled>Filter by Complexity</option>
              <option value="all">Show All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value === 'all' ? '' : e.target.value)} className="p-2 border rounded bg-gray-800 text-white">
              <option value="" disabled>Filter by Category</option>
              <option value="all">Show All</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 shadow-md">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Title</th>
                <th className="border p-3 text-left">Description</th>
                <th className="border p-3 text-left">Category</th>
                <th className="border p-3 text-left">Complexity</th>
                <th className="border p-3 text-center">Edit</th>
                <th className="border p-3 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question, index) => (
                <tr key={question.id} className="border">
                  {editingQuestion === question.id ? (
                    <>
                      <td className="border p-3">{index + 1}</td>
                      <td className="border p-3"><input type="text" value={editedData.title} onChange={(e) => setEditedData({ ...editedData, title: e.target.value })} className="w-full p-1 border rounded" /></td>
                      <td className="border p-3"><textarea value={editedData.description} onChange={(e) => setEditedData({ ...editedData, description: e.target.value })} className="w-full p-1 border rounded" /></td>
                      <td className="border p-3"><input type="text" value={editedData.category} onChange={(e) => setEditedData({ ...editedData, category: e.target.value })} className="w-full p-1 border rounded" /></td>
                      <td className="border p-3">
                        <select value={editedData.complexity} onChange={(e) => setEditedData({ ...editedData, complexity: e.target.value })} className="w-full p-1 border rounded">
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </td>
                      <td className="border p-3 text-center">
                        <button onClick={() => handleSave(question.id)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Save</button>
                        <button onClick={() => setEditingQuestion(null)} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border p-3">{index + 1}</td>
                      <td className="border p-3">{question.title}</td>
                      <td className="border p-3">{question.description}</td>
                      <td className="border p-3">{question.category}</td>
                      <td className="border p-3 text-center">{question.complexity}</td>
                      <td className="border p-3 text-center"><button onClick={() => handleEdit(question)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button></td>
                      <td className="border p-3 text-center"><button onClick={() => handleDelete(question.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {message && <p className="text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function QuestionsList() {
//   const [questions, setQuestions] = useState([]);
//   const [message, setMessage] = useState("");
//   const [editingQuestion, setEditingQuestion] = useState(null);
//   const [editedData, setEditedData] = useState({ title: "", description: "", category: "", complexity: "" });

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/admin/question/all");
//         setQuestions(response.data.data);
//       } catch (error) {
//         setMessage("Error: " + error.message);
//       }
//     };
//     fetchQuestions();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       const deleteQuestion = await axios.delete(`http://localhost:3001/admin/question/${id}`);
//       if (deleteQuestion.status === 201) {
//         setQuestions(questions.filter((q) => q.id !== id));
//       }
//     } catch (error) {
//       setMessage("Error deleting question: " + error.message);
//     }
//   };

//   const handleEdit = (question) => {
//     setEditingQuestion(question.id);
//     setEditedData({
//       title: question.title,
//       description: question.description,
//       category: question.category,
//       complexity: question.complexity
//     });
//   };

//   const handleSave = async (id) => {
//     try {
//       const response = await axios.put(`http://localhost:3001/admin/question/${id}`, editedData);
//       const updatedQuestion = response.data.data;
//       setQuestions(questions.map(q => q.id === id ? updatedQuestion : q));
//       setEditingQuestion(null);
//     } catch (error) {
//       setMessage("Error updating question: " + error.message);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-2xl font-bold text-center mb-6">All Questions</h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full border-collapse border border-gray-200 shadow-md">
//         <thead>
//   <tr className="bg-gray-300 text-black">
//     <th className="border p-3 text-left">Title</th>
//     <th className="border p-3 text-left">Description</th>
//     <th className="border p-3 text-left">Category</th>
//     <th className="border p-3 text-left">Complexity</th>
//     <th className="border p-3 text-center">Edit</th>
//     <th className="border p-3 text-center">Delete</th>
//   </tr>
// </thead>
//           <tbody>
//             {questions.map((question) => (
//               <tr key={question.id} className="border">
//                 {editingQuestion === question.id ? (
//                   <>
//                     <td className="border p-3"><input type="text" value={editedData.title} onChange={(e) => setEditedData({...editedData, title: e.target.value})} className="w-full p-1 border rounded" /></td>
//                     <td className="border p-3"><textarea value={editedData.description} onChange={(e) => setEditedData({...editedData, description: e.target.value})} className="w-full p-1 border rounded"></textarea></td>
//                     <td className="border p-3"><input type="text" value={editedData.category} onChange={(e) => setEditedData({...editedData, category: e.target.value})} className="w-full p-1 border rounded" /></td>
//                     <td className="border p-3">
//                       <select value={editedData.complexity} onChange={(e) => setEditedData({...editedData, complexity: e.target.value})} className="w-full p-1 border rounded">
//                         <option value="Easy">Easy</option>
//                         <option value="Medium">Medium</option>
//                         <option value="Hard">Hard</option>
//                       </select>
//                     </td>
//                     <td className="border p-3 text-center">
//                       <button onClick={() => handleSave(question.id)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Save</button>
//                       <button onClick={() => setEditingQuestion(null)} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
//                     </td>
//                     <td className="border p-3 text-center"></td>
//                   </>
//                 ) : (
//                   <>
//                     <td className="border p-3">{question.title}</td>
//                     <td className="border p-3">{question.description}</td>
//                     <td className="border p-3">{question.category}</td>
//                     <td className="border p-3 text-center">
//                       <span className={`px-2 py-1 rounded text-white ${question.complexity === "Easy" ? "bg-green-500" : question.complexity === "Medium" ? "bg-yellow-500" : "bg-red-500"}`}>{question.complexity}</span>
//                     </td>
//                     <td className="border p-3 text-center">
//                       <button onClick={() => handleEdit(question)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
//                     </td>
//                     <td className="border p-3 text-center">
//                       <button onClick={() => handleDelete(question.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
//                     </td>
//                   </>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {message && <p className="text-red-500 mt-4">{message}</p>}
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function QuestionsList() {
//   const [questions, setQuestions] = useState([]);
//   const [message, setMessage] = useState("");
//   const [editingQuestion, setEditingQuestion] = useState(null);
//   const [editedData, setEditedData] = useState({ title: "", description: "", category: "", complexity: "" });

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/admin/question/all");
//         setQuestions(response.data.data);
//       } catch (error) {
//         setMessage("Error: " + error.message);
//       }
//     };
//     fetchQuestions();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       const deleteQuestion = await axios.delete(`http://localhost:3001/admin/question/${id}`);
//       // console.log(deleteQuestion.status)
//       if(deleteQuestion.status == 201){
//       setQuestions(questions.filter((q) => q.id !== id));

//       }
//     } catch (error) {
//       setMessage("Error deleting question: " + error.message);
//     }
//   };

//   const handleEdit = (question) => {
//     setEditingQuestion(question.id);
//     setEditedData({ title: question.title, description: question.description, category: question.category, complexity: question.complexity });
//   };

//   const handleSave = async (id) => {
//     try {
//       const response = await axios.put(`http://localhost:3001/admin/question/${id}`, {editedData});
//       const updatedQuestion = response.data.data; // Extract updated question from response
//       // console.log(updatedQuestion)
//       setQuestions(questions.map(q => q.id === id ? updatedQuestion : q));
//       setEditingQuestion(null);
//     } catch (error) {
//       setMessage("Error updating question: " + error.message);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold text-center mb-6">All Questions</h1>
//       <ul className="space-y-4">
//         {questions.map((question) => (
//           <li key={question.id} className="p-4 border rounded-lg shadow-md bg-white">
//             {editingQuestion === question.id ? (
//               <div>
//                 <input type="text" value={editedData.title} onChange={(e) => setEditedData({ ...editedData, title: e.target.value })} className="w-full p-2 border rounded mb-2" />
//                 <textarea value={editedData.description} onChange={(e) => setEditedData({ ...editedData, description: e.target.value })} className="w-full p-2 border rounded mb-2"></textarea>
//                 <input type="text" value={editedData.category} onChange={(e) => setEditedData({ ...editedData, category: e.target.value })} className="w-full p-2 border rounded mb-2" />
//                 <select value={editedData.complexity} onChange={(e) => setEditedData({ ...editedData, complexity: e.target.value })} className="w-full p-2 border rounded mb-2">
//                   <option value="Easy">Easy</option>
//                   <option value="Medium">Medium</option>
//                   <option value="Hard">Hard</option>
//                 </select>
//                 <button onClick={() => handleSave(question.id)} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
//                 <button onClick={() => setEditingQuestion(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
//               </div>
//             ) : (
//               <div>
//                 <h3 className="text-lg font-semibold">{question.title}</h3>
//                 <p className="text-xl text-gray-600">{question.description}</p>
//                 <p className="mt-2 text-m"><strong>Category:</strong> <span className="text-blue-500">{question.category}</span></p>
//                 <p className="text-m">
//                   <strong>Complexity:</strong> 
//                   <span className={`ml-1 px-2 py-1 rounded text-white ${question.complexity === "Easy" ? "bg-green-500" : question.complexity === "Medium" ? "bg-yellow-500" : "bg-red-500"}`}>{question.complexity}</span>
//                 </p>
//                 <div className="mt-4">
//                   <button onClick={() => handleEdit(question)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit</button>
//                   <button onClick={() => handleDelete(question.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
//                 </div>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//       {message && <p className="text-red-500 mt-4">{message}</p>}
//     </div>
//   );
// }
