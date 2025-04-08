'use client';

import { useEffect, useState } from "react";
import io from 'socket.io-client';
import axios from "axios";

let socket;


export default function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [topic, setTopic] = useState('OOP');
  const [complexity, setDifficulty] = useState('Easy');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');



  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsed = JSON.parse(userData);
      console.log(parsed)
      setUserId(parsed.data.username);
    }
  }, []);



  useEffect(() => {
    if (!userId) return;

    socket = io('http://localhost:5000');

    socket.emit('register', userId);

    socket.on('matchFound', (data) => {
      setResponseMessage(`✅ Match found with user: ${data.partner.user1.userId === userId
        ? data.partner.user2.userId
        : data.partner.user1.userId
        }`);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseMessage('');

    try {
      setResponseMessage('Searching for match...');
      await axios.post('http://localhost:5000/api/match', {
        userId,
        topic,
        complexity
      });
    } catch (err) {
      setResponseMessage('Failed to send match request');
      console.error(err);
    } finally {
      setIsLoading(false);
    }

    if (!userId) {
      return <p1>You must be logged in to access the dashboard.</p1>;
    }

  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#fbe7d0] p-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-4xl font-bold text-[#1e1e1e]">PEERPREP</h1>
          <p className="text-sm">Practice coding interviews live with peers!</p>
        </div>

        <div className="flex items-center gap-3">
          {/* <FaUserCircle className="text-3xl" /> */}
          <p>Your name</p>
          <button className="ml-4 px-4 py-1 bg-[#e67e22] text-white rounded-lg shadow hover:bg-[#cf711c]">
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex justify-center items-start gap-12 mt-16">
        {/* Practice Box */}
        <div className="bg-[#fcebd5] border-2 border-blue-400 rounded-xl p-6 w-80 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Practice</h2>

          <div className="mb-4">
            <label className="block mb-2">Choose Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option>OOP</option>
              <option>DSA</option>
              <option>System Design</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2">Difficulty Level</label>
            <select
              value={complexity}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <button
            onClick={handleSubmit}
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-[#e67e22] text-white px-4 py-2 rounded-lg shadow hover:bg-[#cf711c]"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          
            {responseMessage && <p className="mt-4 text-green-500">{responseMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

