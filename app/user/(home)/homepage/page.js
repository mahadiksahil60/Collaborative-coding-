
"use client"
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import React, { useState } from "react";

export default function Homepage() {
  const [code, setCode] = useState("// Start coding here...");
  const [selectedLanguage, setSelectedLanguage] = useState("python");

  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRunCode = async () => {
    setLoading(true);
    setOutput('');
    setError('');
    try {
      const response = await fetch(`/api/user/executecode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, selectedLanguage, input })
      });
      const result = await response.json();
      setOutput(result.output);
      if (result.status == 200) {
        toast.success("Code Execution successful");
      } else if (result.status === 401) {
        setError(result.error);
        toast.error("Error executing code");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Error submitting code");
    }
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setCode("// Start coding here..."); // Reset code when language changes if needed
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white border-b-2 border-gray-700">
        <h1 className="text-lg font-bold">Collaborative Code Editor</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleRunCode} 
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
          >
            Run Code
          </button>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="p-2 rounded-lg bg-gray-700 text-white"
          >
            <option value="nodejs">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Section */}
        <div className="w-1/2 h-full bg-gray-900 border-r-2 border-gray-700 p-2">
          <Editor
            value={code}
            onChange={(value, e) => setCode(value)}
            theme='vs-dark'
            height="100%"
            width="100%"
            language={selectedLanguage === 'nodejs' ? 'javascript' : selectedLanguage}
            defaultValue={`// Start by including necessary headers for ${selectedLanguage}`}
          />
        </div>

        {/* Input and Output Section */}
        <div className="w-1/2 h-full flex flex-col bg-gray-800 p-2">
          {/* Input Section */}
          <div className="mb-4">
            <textarea
              className="w-full p-2 bg-gray-900 text-white rounded h-32 resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Enter input here...'
            />
          </div>

          {/* Output Section */}
          <div className="flex-1 bg-gray-900 text-white p-2 rounded overflow-y-auto">
            <h3 className="text-center mb-2 font-bold">Output:</h3>
            <pre className="whitespace-pre-wrap">{output || error}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

