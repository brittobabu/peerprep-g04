'use client'

import { useState } from 'react';
import { useCollaboration } from './collab-socket.js'; 
import MonacoEditorWrapper from './monocoeditor.js';

export default function CollaborativeMonacoEditor() {
  const [roomId, setRoomId] = useState('');
  const [isStarted, setIsStarted] = useState(false); // Track if collaboration is started
  const { content, handleEditorChange, handleLogout } = useCollaboration(roomId, '// Start typing...');

  const handleStart = () => {
    if (roomId) {
      setIsStarted(true);
      
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-xl font-semibold mb-4">Collaborative Monaco Editor</h1>

      <div>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="mb-4 p-2 border border-gray-400 rounded"
        />
      </div>

      {/* Show "Start" button if Room ID is entered and collaboration hasn't started */}
      {!isStarted && roomId && (
        <div>
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white p-2 rounded mt-4"
          >
            Start Collaboration
          </button>
        </div>
      )}

      {/* Show Monaco Editor only after clicking "Start" */}
      {isStarted && (
        <>
          <MonacoEditorWrapper content={content} handleEditorChange={handleEditorChange} />

          <div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white p-2 rounded mt-4"
            >
              Logout from Collaboration
            </button>
          </div>
        </>
      )}
    </div>
  );
}
