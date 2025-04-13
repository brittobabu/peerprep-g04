'use client'

import dynamic from 'next/dynamic';

// Dynamically import Monaco (SSR-safe)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const MonacoEditorWrapper = ({ content, handleEditorChange }) => {
  return (
    <div className="bg-white rounded shadow-md mb-4">
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
  );
};

export default MonacoEditorWrapper;
