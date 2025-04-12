'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCollaboration, socketRef } from './collab-socket.js';
import MonacoEditorWrapper from './monocoeditor.js';

export default function CollaborativeMonacoEditor() {
  const searchParams = useSearchParams();
  const user1 = searchParams.get('user1');
  const user2 = searchParams.get('user2');
  const topic = searchParams.get('topic');
  const complexity = searchParams.get('complexity');

  const [roomId] = useState(user1 + user2);
  const [username] = useState(user1);
  const [isStarted, setIsStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { content, handleEditorChange, handleLogout } = useCollaboration(roomId, '// Start typing...');

  // Detect when socket is ready
  useEffect(() => {
    const initialize = async () => {
      if (!socketRef.current) return;
  
      const socket = socketRef.current;
  
      if (socket.readyState === WebSocket.OPEN) {
        setIsSocketReady(true);
      } else {
        const onOpen = () => {
          console.log('✅ WebSocket connection is now open');
          setIsSocketReady(true);
          socket.removeEventListener('open', onOpen);
        };
        socket.addEventListener('open', onOpen);
      }
  
      try {
        const res = await fetch(`http://localhost:3000/admin/question/filter?topic=${encodeURIComponent(topic)}&complexity=${encodeURIComponent(complexity)}`);
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('❌ Failed to fetch questions:', err);
        setQuestions([]);
      }
    };
  
    initialize();
  }, []);
  

  // Listen for suggestion from partner
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    
    const handler = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'receive-suggestion') {
          if (parsed.suggestedBy !== username) {
            alert(`💡 ${parsed.suggestedBy} suggests:\n"${parsed.question.title}"\n\n${parsed.question.description}`);
          }
        }
      } catch (err) {
        console.error('❌ Failed to parse message:', err);
      }
    };

    socket.addEventListener('message', handler);
    return () => socket.removeEventListener('message', handler);
  }, [username]);

  // Fetch questions on start
  const handleStart = async () => {
    if (!roomId) return;
    setIsStarted(true);

  
  };

  // Suggest a question to partner
  const suggestQuestion = (question) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'suggest-question',
        roomId,
        suggestedBy: username,
        question
      }));
      console.log("✅ Sent suggestion:", question.title);
    } else {
      console.warn("❌ Socket not open");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-xl font-semibold mb-4">Collaborative Monaco Editor</h1>


      {isStarted ? (
        questions.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                🧠 Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <div className="p-4 border rounded bg-white shadow">
                <h3 className="font-semibold text-gray-800">{questions[currentQuestionIndex].title}</h3>
                <p className="text-sm text-gray-700 mt-1">{questions[currentQuestionIndex].description}</p>
              </div>
              <button
                onClick={() => suggestQuestion(questions[currentQuestionIndex])}
                className="mt-3 bg-green-500 text-white px-3 py-1 rounded"
              >
                Suggest to Partner
              </button>
            </div>

            <MonacoEditorWrapper content={content} handleEditorChange={handleEditorChange} />

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white p-2 rounded"
              >
                Logout
              </button>
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))
                }
                className="bg-blue-500 text-white p-2 rounded"
                disabled={currentQuestionIndex >= questions.length - 1}
              >
                Next Question
              </button>
            </div>
          </>
        ) : (
          <p>No questions loaded.</p>
        )
      ) : (
        <>
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Start Collaboration
          </button>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2"> Available Questions on {topic} ({complexity})</h2>
            {questions.length === 0 ? (
              <p className="text-sm text-gray-600">Loading questions...</p>
            ) : (
              <ul className="space-y-2">
                {questions.map((q, i) => (
                  <li
                    key={i}
                    className="p-3 border rounded shadow-sm bg-white"
                  >
                    <h3 className="font-semibold text-gray-800">{q.title}</h3>
                    <p className="text-sm text-gray-700 mt-1">{q.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

        
        </>
      )}

    </div>
  );
}
