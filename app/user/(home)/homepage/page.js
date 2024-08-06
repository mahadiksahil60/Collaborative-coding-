
"use client";
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import Modal from '@/components/Modal.jsx';
import React, { useState, useEffect, useRef } from "react";
import { io } from 'socket.io-client'




export default function Homepage() {
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modaloading, setModalLoading] = useState(false);
  //states for socket connection
  const [socket, setSocket] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const editorRef = useRef(null)
  
  
  
  
  useEffect(() => {
    const socket = io('http://localhost:3001');
    setSocket(socket) 
    socket.on('roomCreated', (data) => {
      console.log(`Room created: ${data.roomName}`);
      setCurrentRoom(data.roomName);
    });

    socket.on('roomJoined', (data) => {
      console.log(`Room joined: ${data.roomName}`);
      setCurrentRoom(data.roomName);
    });

    socket.on('codeChange', (data) => {
      setCode(data.message);
      console.log("the code is ", data.message);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('codeChange');
      socket.disconnect(); 
    };
  }, []);

 const createRoom = () => {
  setModalLoading(true);
  socket.emit('createRoom', roomName);
  setModalLoading(false);
  setIsModalOpen(false);
 }

 const joinRoom = () => {
  setModalLoading(true);
  socket.emit('joinRoom', roomName);
  setModalLoading(false);
  setIsModalOpen(false);
 }

  const handleEditorChange = (value, event) => {
    
    if (currentRoom) {
      
      
      socket.emit('codeChange',{ roomName: currentRoom, message : value})
     



    }
  }

//functions for modal
const collaborate = ()=> {
  setIsModalOpen(true);
}

const closeModal = () => {
  setIsModalOpen(false);
}

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
    setCode(""); 
  };

 

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white border-b-2 border-gray-700">
        <h1 className="text-lg font-bold">Collaborative Code Editor</h1>
        <button className='bg-blue-700 p-3 rounded-xl'  onClick={collaborate}>Connect</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className='flex flex-col '>
        <h2 className='text-black text-2xl text-center font-bold mb-6'>Collaborate</h2>
        <input value={roomName} onChange={(e)=>setRoomName(e.target.value)} className='border-2 border-black bg-white p-3 m-2 text-black' placeholder='Enter room name'/>
        <button className='text-black bg-green-200 font-bold p-3 rounded-lg m-2' onClick={createRoom}>{modaloading ? 'creating...' :'Create a room'}</button>
        <button className='text-white bg-blue-700 font-bold p-3 rounded-lg m-2' onClick={joinRoom}>{modaloading ? 'joining...' : 'Join a room'}</button>
        <button className='text-white bg-slate-700 font-bold p-3 rounded-lg m-2' onClick={closeModal}>close</button>
        </div>
      </Modal>
      <p>Currently in  {currentRoom}</p>
        <div className="flex items-center space-x-4">
          <button
          
            onClick={handleRunCode}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
          >
            {loading === true ? "loading..." : "Run Code"}
          </button>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="p-2 rounded-lg bg-gray-700 text-white"
          >
            <option value="nodejs">JavaScript</option>
            <option value="python">Python</option>

            <option value="cpp">Cpp (coming soon...)</option>
            {/* <option value="Java">Java (coming soon...)</option> */}

          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Section */}
        <div className="w-1/2 h-full bg-gray-900 border-r-2 border-gray-700 p-2">
          <Editor
            
            value={code}
            onChange={handleEditorChange}
           
            theme='vs-dark'
            height="100%"
            width="100%"
            language={selectedLanguage === 'nodejs' ? 'javascript' : selectedLanguage}
            defaultValue={``}
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
            <h3 className="text-center mb-2 font-bold">Output : </h3>
            <pre className="whitespace-pre-wrap">{output || error}</pre>
          </div>
        </div>
      </div>
    </div>
  );
} 

