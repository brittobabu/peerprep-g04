'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AddQuestionPage = () => {
  const [userId, setUserId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [complexity, setComplexity] = useState('Easy');
  const [message, setMessage] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const questionData = { title, description, category, complexity };

    try {
      const response = await axios.post("http://localhost:3000/admin/question/add", { questionData });

      if (response.status === 201) {
        setMessage('✅ Question added successfully!');
        setTitle('');
        setDescription('');
        setCategory('');
        setComplexity('Easy');
      } else {
        setMessage('❌ Failed to add question.');
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
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

      <div className="max-w-2xl mx-auto px-4">

        {/* Back to admin dashboard */}
        <div className="absolute top-8 mt-20 left-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        {/* 🧾 Form box */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h1 className="text-2xl font-semibold text-center mb-6">Add a New Question</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="complexity" className="block text-sm font-medium text-gray-700">Complexity</label>
              <select
                id="complexity"
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Add Question
            </button>

            {message && (
              <p className="text-center mt-4 text-sm font-semibold text-red-500">{message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionPage;
