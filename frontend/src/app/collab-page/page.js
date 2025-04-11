'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Monaco (SSR-safe)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function CollaborativeMonacoEditor() {
  const [content, setContent] = useState('// Start typing...')
  const socketRef = useRef(null)
  const isUpdating = useRef(false) // Prevent infinite loop on update

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000')
    socketRef.current = socket

    socket.onopen = () => console.log('WebSocket connected')

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        if (message.type === 'init' || message.type === 'update') {
          isUpdating.current = true
          setContent(message.data)
        }
      } catch (err) {
        console.error('Error parsing message:', err)
      }
    }

    socket.onclose = () => console.log('WebSocket closed')
    return () => socket.close()
  }, [])

  const handleEditorChange = (value) => {
    if (!isUpdating.current && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'update', data: value }))
    }
    isUpdating.current = false
    setContent(value || '')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-xl font-semibold mb-4">Collaborative Monaco Editor</h1>
      <div className="bg-white rounded shadow-md">
        <MonacoEditor
          height="600px"
          defaultLanguage="javascript"
          value={content}
          onChange={handleEditorChange}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  )
}
