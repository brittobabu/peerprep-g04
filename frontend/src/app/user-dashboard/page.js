'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { registerSocket, disconnectSocket, sendMatchRequest } from './matching_socket.js';

export default function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [topic, setTopic] = useState('OOP');
  const [complexity, setDifficulty] = useState('Easy');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [timer, setTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserId(parsed.data.username);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    registerSocket(userId, (data) => {
      setResponseMessage(`✅ Match found with user: ${
        data.partner.user1.userId === userId
          ? data.partner.user2.userId
          : data.partner.user1.userId
      }`);
      setIsLoading(false);
      setTimer(0);
    });

    return () => {
      disconnectSocket();
    };
  }, [userId]);

  useEffect(() => {
    let interval;

  if (isLoading) {
    // Start the timer from 30
    setTimer(30);

    interval = setInterval(() => {
      setTimer((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval); // Stop the interval when the timer reaches 0
          setIsLoading(false);
          setResponseMessage('No match found. Please try again later.');
        }
        return next;
      });
    }, 1000);

  } else {
    clearInterval(interval);
    setTimer(0);
  }
  
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setResponseMessage('You must be logged in to search for a match.');
      return;
    }

    setIsLoading(true);
    setResponseMessage('Searching for match...');

    try {
      await sendMatchRequest(userId, topic, complexity);
    } catch (err) {
      setResponseMessage('❌ Failed to send match request');
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_data");
    disconnectSocket();
    setUserId(null);
    router.push('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      {/* Header */}
      <div className="bg-[#fdebd2] p-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-4xl font-bold text-[#1e1e1e]">PEERPREP</h1>
          <p className="text-sm text-gray-700">Practice coding interviews live with peers!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-full shadow">
            <span role="img" aria-label="user">👤</span>
          </div>
          <p className="font-medium">{userId ?? 'Your name'}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-[#f48c42] text-white rounded-full shadow hover:bg-[#e67e22]"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Sections */}
      <div className="flex justify-center items-start gap-12 mt-16 flex-wrap">
        {/* Practice Card */}
        <div className="bg-[#fff3e6] border rounded-xl p-6 w-80 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Practice</h2>

          <div className="mb-4">
            <label htmlFor="topic" className="block mb-2">Choose Topic</label>
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option>OOP</option>
              <option>DSA</option>
              <option>System Design</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="difficulty" className="block mb-2">Difficulty Level</label>
            <select
              id="difficulty"
              value={complexity}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#f48c42] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#e67e22]"
            >
             {isLoading ? `Searching... (${timer}s)` : 'Start'}
            </button>
            <button className="bg-[#da00e7] text-white text-sm px-3 py-1 rounded-full hover:opacity-90">
              View Library
            </button>
          </div>

          {responseMessage && (
            <p className="mt-4 text-green-700 text-center">{responseMessage}</p>
          )}
        </div>

        {/* Past Sessions Card */}
        <div className="bg-[#ffe8cd] border rounded-xl p-6 w-80 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Past sessions</h2>

          <div className="mb-4">
            <label className="block mb-2">Choose Topic</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>DSA</option>
              <option>OOP</option>
              <option>System Design</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2">Select Time Range</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Last Week</option>
              <option>Last Month</option>
              <option>All Time</option>
            </select>
          </div>

          <button className="w-full bg-[#f48c42] text-white px-4 py-2 rounded-full hover:bg-[#e67e22]">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
