'use client';

import { useEffect, useState } from "react";
import { registerSocket, disconnectSocket, sendMatchRequest } from './matching_socket.js';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [topic, setTopic] = useState('');
  const [complexity, setDifficulty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [timer, setTimer] = useState(0);
  const [categories, setCategories] = useState([]);
  const [complexities, setComplexities] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserId(parsed.data.username);
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

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-[#fbe7d0] p-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-4xl font-bold text-[#1e1e1e]">PEERPREP</h1>
          <p className="text-sm">Practice coding interviews live with peers!</p>
        </div>
        <div className="flex items-center gap-3">
          <p>{userId ?? 'Your name'}</p>
          <button className="ml-4 px-4 py-1 bg-[#e67e22] text-white rounded-lg shadow hover:bg-[#cf711c]">
            Logout
          </button>
        </div>
      </div>

      <div className="flex justify-center items-start gap-12 mt-16">
        <div className="bg-[#fcebd5] border-2 border-blue-400 rounded-xl p-6 w-80 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Practice</h2>

          <div className="mb-4">
            <label className="block mb-2">Choose Topic *</label>
            <select
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
            <label className="block mb-2">Difficulty Level</label>
            <select
              value={complexity}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {complexities.map((lvl, idx) => (
                <option key={idx} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#e67e22] text-white px-4 py-2 rounded-lg shadow hover:bg-[#cf711c]"
            >
              {isLoading ? `Searching... (${timer}s)` : 'Search'}
            </button>

            {responseMessage && (
              <p className="mt-2 text-green-700 text-center">{responseMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
