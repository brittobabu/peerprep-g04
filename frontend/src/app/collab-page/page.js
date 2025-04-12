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

  const { content, handleEditorChange, handleLogout } = useCollaboration(roomId, '// Start typing...');

  // Detect when socket is ready
  useEffect(() => {
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

    try {
      const res = await fetch(`http://localhost:3000/admin/question/filter?topic=${encodeURIComponent(topic)}&complexity=${encodeURIComponent(complexity)}`);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Failed to fetch questions:', err);
      setQuestions([]);
    }
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

      {!isStarted && roomId && (
        <button
          onClick={handleStart}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Start Collaboration
        </button>
      )}

      {isStarted && (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">🧠 Questions for: {topic} - {complexity}</h2>
            {questions.length === 0 ? (
              <p className="text-sm text-gray-600">No matching questions found.</p>
            ) : (
              <ul className="space-y-2">
                {questions.map((q, i) => (
                  <li
                    key={i}
                    onClick={() => isSocketReady && suggestQuestion(q)}
                    className={`p-3 border rounded shadow-sm transition-all duration-150 ${
                      isSocketReady
                        ? 'bg-white cursor-pointer hover:bg-gray-100'
                        : 'bg-gray-200 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800">{q.title}</h3>
                    <p className="text-sm text-gray-700 mt-1">{q.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <MonacoEditorWrapper content={content} handleEditorChange={handleEditorChange} />

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded mt-4"
          >
            Logout from Collaboration
          </button>
        </>
      )}
    </div>
  );
}
