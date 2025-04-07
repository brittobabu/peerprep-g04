'use client';

import { useEffect, useState } from "react";
import io from 'socket.io-client';
import axios from "axios";

let socket;


export default function Dashboard() {
    const [userId, setUserId] = useState(null);
    const [topic, setTopic] = useState('');
    const [complexity, setComplexity] = useState('');
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
        setResponseMessage(`✅ Match found with user: ${
        data.partner.user1.userId === userId
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
          }  finally {
            setIsLoading(false);
        }

        if (!userId) {
            return <p1>You must be logged in to access the dashboard.</p1>;
        }
    
    };

    return (
        <div className="w-full px-4 py-2 border border-gray-300 rounded">
            <h1 className="text-xl font-semibold mb-4">Welcome to the Dashboard</h1>
            <p className="mb-4">Id: {userId}</p>
            <div className="w-full px-4 py-2 border border-gray-300 rounded">
                <h1 className="text-xl font-semibold mb-4">Submit Details</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="topic" className="block text-sm font-medium mb-2">Topic</label>
                        <input
                            type="text"
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="complexity" className="block text-sm font-medium mb-2">Complexity</label>
                        <input
                            type="text"
                            id="complexity"
                            value={complexity}
                            onChange={(e) => setComplexity(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 border border-gray-300 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
                {responseMessage && <p className="mt-4 text-green-500">{responseMessage}</p>}
            </div>
        </div>


    );
}

