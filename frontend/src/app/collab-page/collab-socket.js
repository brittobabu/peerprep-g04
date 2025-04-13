import { useEffect, useRef, useState } from 'react';

export const socketRef = { current: null }; // ✅ Move to module scope



export const useCollaboration = (roomId, initialContent) => {
  const [content, setContent] = useState(initialContent);
  const isUpdating = useRef(false); // Prevent feedback loops

  useEffect(() => {
    if (!roomId) return;

    let retries = 0;
    const maxRetries = 2;

    const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:8000');
      socketRef.current = socket;
  
      socket.onopen = () => {
        console.log('✅ WebSocket connected');
        retries = 0;
        socket.send(JSON.stringify({ type: 'join', roomId }));
      };
  
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'init' || message.type === 'update') {
            isUpdating.current = true;
            setContent(message.data);
          }
        } catch (err) {
          console.log('❌ Error parsing message:', err);
        }
      };
  
      socket.onclose = () => {
        console.log('🔌 WebSocket closed');
        socketRef.current = null;
  
        if (retries < maxRetries) {
          const retryDelay = 1000 * 2 ** retries;
          console.log(`🔄 Reconnecting in ${retryDelay / 1000}s... (attempt ${retries + 1})`);
          setTimeout(() => {
            retries++;
            connectWebSocket();
          }, retryDelay);
        } else {
          console.log("❌ Max retries reached. Cannot reconnect.");
        }
      };
  
      socket.onerror = (err) => {
        console.log('❌ WebSocket error:', err.message);
        socket.close(); // Triggers the retry logic in onclose
      };
    };
  
    connectWebSocket();
  
    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [roomId]);

  const handleEditorChange = (value) => {
    if (!isUpdating.current && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'update', data: value }));
    }
    isUpdating.current = false;
    setContent(value || '');
  };

  const handleLogout = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setContent(initialContent);
  };

  return { content, handleEditorChange, handleLogout };
};



export const disconnectSocket = () => {
  if (socketRef.current) {
    socketRef.current.close();
    socketRef.current = null;
    console.log('🔌 Socket manually disconnected');
  }
};