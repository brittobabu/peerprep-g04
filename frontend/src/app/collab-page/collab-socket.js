import { useEffect, useRef, useState } from 'react';

// Custom hook for WebSocket-based collaboration
export const useCollaboration = (roomId, initialContent) => {
  const [content, setContent] = useState(initialContent);
  const socketRef = useRef(null);
  const isUpdating = useRef(false); // Prevent infinite loop on update

  useEffect(() => {
    if (!roomId) return; // Don't connect if no roomId is provided
    
    const socket = new WebSocket('ws://localhost:8000');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({ type: 'join', roomId }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'init' || message.type === 'update') {
          isUpdating.current = true;
          setContent(message.data);
          // console.log(message.data)
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
      socketRef.current = null;
    };

    // Cleanup WebSocket on roomId change or component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [roomId]);

  // Handle editor changes and send updates through WebSocket
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
    setContent(initialContent); // Reset the content in the editor
  };

  return { content, handleEditorChange, handleLogout };
};
