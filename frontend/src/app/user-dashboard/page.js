'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { registerSocket, disconnectSocket, sendMatchRequest } from './matching_socket.js';

export default function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [topic, setTopic] = useState('');
  const [complexity, setDifficulty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [timer, setTimer] = useState(0);
  const [categories, setCategories] = useState([]);
  const [complexities, setComplexities] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserId(parsed.data.username);

      if (parsed.data.isAdmin) {
        setIsAdmin(true);
      }
    } else {
      router.replace("/"); // not logged in
    }
  }, []);

  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch("http://localhost:3000/admin/question/meta");
        const data = await res.json();
        setCategories(data.categories || []);
        setComplexities(data.complexities || []);
        // Set default selected values
        if (data.categories.length > 0) setTopic(data.categories[0]);
        if (data.complexities.length > 0) setDifficulty(data.complexities[0]);
      } catch (err) {
        console.error("Failed to load question metadata", err);
      }
    }

    fetchMeta();
  }, []);

  useEffect(() => {
    if (!userId || !topic || !complexity) return;
  
    registerSocket(userId, (data) => {
      setResponseMessage(`✅ Match found with user: ${
        data.partner.user1.userId === userId
          ? data.partner.user2.userId
          : data.partner.user1.userId
      }`);
      setIsLoading(false);
      setTimer(0);
  
      // Capture current topic and complexity safely
      const chosenTopic = topic && topic !== '' ? topic : (categories[0] || 'Algorithms');
      const chosenComplexity = complexity && complexity !== '' ? complexity : (complexities[0] || 'Easy');
  
      console.log("Redirecting with topic:", chosenTopic);
      console.log("Redirecting with complexity:", chosenComplexity);
  
      router.push(`/collab-page?user1=${data.partner.user1.userId}&user2=${data.partner.user2.userId}&topic=${encodeURIComponent(chosenTopic)}&complexity=${encodeURIComponent(chosenComplexity)}`);
    });
  
    return () => {
      disconnectSocket();
    };
  }, [userId, topic, complexity]); // ✅ watch all three

  useEffect(() => {
    console.log("🔥 Topic changed to:", topic);
  }, [topic]);

  useEffect(() => {
    let interval;

    if (isLoading) {
      setTimer(30);
      interval = setInterval(() => {
        setTimer((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            clearInterval(interval);
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
    router.push('/'); // Redirect to login page
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
           onClick={() => {
               localStorage.removeItem("user_data"); // Clear any session storage
               disconnectSocket(); //clean up socket connection
                router.push("/"); // Redirect to landing/login page
          }}
           className="ml-4 px-4 py-1 bg-[#e67e22] text-white rounded-lg shadow hover:bg-[#cf711c]"
          >
           Logout
          </button>
        </div>
      </div>

      {/* Main Sections */}      
      <div className="flex justify-center items-start gap-12 mt-16 flex-wrap">
        {/* Back to admin dashboard for admin user only */}
        {isAdmin && (
          <div className="absolute top-8 mt-20 left-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
            >
              ⬅ Back to Admin Dashboard
            </button>
          </div>
        )}
        {/* Practice Card */}
        <div className="bg-[#fff3e6] border rounded-xl p-6 w-80 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Practice</h2>

          <div className="mb-4">
            <label className="block mb-2">Choose Topic *</label>
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
                
              ))}
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
              {complexities.map((lvl, idx) => (
                <option key={idx} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-[#f48c42] text-white px-4 py-2 rounded-full hover:bg-[#e67e22]"
            >
             {isLoading ? `Searching... (${timer}s)` : 'Start'}
            </button>
            {/* <button className="bg-[#da00e7] text-white text-sm px-3 py-1 rounded-full hover:opacity-90">
              View Library
            </button> */}
            {/* user should not prepare for the questions before hand. */}
          </div>

          {responseMessage && (
            <p className="mt-4 text-green-700 text-center">{responseMessage}</p>
          )}
        </div>

        {/* Past Sessions Card */}
        <div className="bg-[#ffe8cd] border rounded-xl p-6 w-80 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Past sessions</h2>

          <div className="mb-4">
            <label className="block mb-2">Choose Topic *</label>
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
                
              ))}
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
