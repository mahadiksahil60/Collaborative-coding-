"use client";
import toast from "react-hot-toast";
import Editor from "@monaco-editor/react";
import Modal from "@/components/Modal.jsx";
import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { UserContextProvider } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import MainNavbar from "@/components/MainNavbar";

export default function Homepage() {
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modaloading, setModalLoading] = useState(false);

  //states for socket connection
  const [socket, setSocket] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [cursorPosition, setCursorPosition] = useState({
    lineNumber: 1,
    column: 1,
  });
  const editorRef = useRef(null);

  //error states
  const [roomerror, setRoomError] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);
    socket.on("roomCreated", (data) => {
      console.log(`Room created: ${data.roomName}`);
      setCurrentRoom(data.roomName);
    });

    socket.on("roomJoined", (data) => {
      console.log(`Room joined: ${data.roomName}`);
      setCurrentRoom(data.roomName);
    });

    socket.on("changedcode", (data) => {
      setCode(data.message);
      console.log("code changes are", data.message);
    });

    socket.on("newinput", (data) => {
      setInput(data.message);
      console.log("the input changes are", data.message);
    });

    socket.on("newoutput", (data) => {
      setOutput(data.message);
      console.log("the output changes are", data.message);
    });

    socket.on("roomcreateerror", (data) => {
      setRoomError(data.message);
      toast.error(data.message);
    });

    socket.on("roomjoinerror", (data) => {
      setRoomError(data.message);
      toast.error(data.message);
    });

    socket.on("roomLeft", (data) => {
      console.log("roomLeft");
      setCurrentRoom("");
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("codeChange");
      socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    setModalLoading(true);
    socket.emit("joinRoom", roomName);
    setModalLoading(false);
    setIsModalOpen(false);
  };

  const createRoom = () => {
    setModalLoading(true);
    socket.emit("createRoom", roomName);
    setModalLoading(false);
    setIsModalOpen(false);
  };

  const handleEditorChange = (value, event) => {
    //transfer oode and input and output as well
    setCode(value);
    if (currentRoom) {
      //object combining all of the data --> code/input/output

      socket.emit("codeChange", { roomName: currentRoom, message: value });
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    //transfer oode and input and output as well
    if (currentRoom) {
      //object combining all of the data --> code/input/output
      console.log("Emmitting input change", value);
      socket.emit("inputChange", { roomName: currentRoom, message: value });
    }
  };
  // const handleOutputChange = (value, event) => {
  //   //transfer oode and input and output as well
  //   if (currentRoom) {
  //     //object combining all of the data --> code/input/output

  //     socket.emit('outputChange', { roomName: currentRoom, message: value })

  //   }
  // }

  //functions for modal
  const collaborate = () => {
    setIsModalOpen(true);
  };

  const leaveRoom = async () => {
    setLoading(true);
    await socket.emit("leaveRoom", roomName);
    console.log("room left");
    setCode("");
    setInput("");
    setOutput("");
    setCurrentRoom("");
    setLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRunCode = async () => {
    setLoading(true);
    setOutput("");
    setError("");
    try {
      const response = await fetch(`/api/user/executecode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, selectedLanguage, input }),
      });
      const result = await response.json();
      console.log(result);
      console.log(result.output);
      setOutput(result.output);
      if (currentRoom) {
        console.log("the current output is :", output);

        socket.emit("outputChange", {
          roomName: currentRoom,
          message: result.output,
        });
      }
      if (result.status == 200) {
        toast.success("Code Execution successful");
      } else if (result.status === 404) {
        setError(result.error.message);
        toast.error(result.error);

        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setCode("");
  };

  const generateRoomName = () => {
    let r = (Math.random() + 1).toString(36).substring(7);
    console.log("random", r);
    setRoomName(r);
  };

  return (
    <div className="flex flex-col h-screen">
      <MainNavbar />
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white border-b-2 border-gray-700">
        {/* <h1 className="text-lg font-bold">{userData.data.username}</h1> */}

        <button className="bg-blue-700 p-3 rounded-xl" onClick={collaborate}>
          Connect
        </button>
        {currentRoom !== "" && (
          <button className="bg-red-700 p-3 rounded-xl" onClick={leaveRoom}>
            {loading ? "leaving..." : "Disconnect"}
          </button>
        )}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="flex flex-col ">
            <h2 className="text-white text-3xl text-center font-bold mb-6">
              Collaborate
            </h2>
            <br />
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="border-2 border-black bg-slate-800 p-3 m-2 text-white"
              placeholder="Enter room name"
            />
            <button
              className="text-black bg-red-200 font-bold p-3 rounded-lg m-2"
              onClick={generateRoomName}
            >
              Generate Unique Room Name
            </button>
            <button
              className="text-black bg-green-200 font-bold p-3 rounded-lg m-2"
              onClick={createRoom}
            >
              {modaloading ? "creating..." : "Create a room"}
            </button>
            <button
              className="text-white bg-blue-700 font-bold p-3 rounded-lg m-2"
              onClick={joinRoom}
            >
              {modaloading ? "joining..." : "Join"}
            </button>
            {/* <button className='text-white bg-slate-700 font-bold p-3 rounded-lg m-2' onClick={closeModal}>close</button> */}
          </div>
        </Modal>
        {currentRoom !== "" && <p>Room Joined : 🏠{currentRoom}</p>}
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

            <option value="cpp">C++</option>
            <option value="java">Java</option>
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
            theme="vs-dark"
            height="100%"
            width="100%"
            language={
              selectedLanguage === "nodejs" ? "javascript" : selectedLanguage
            }
            defaultValue={``}
          />
        </div>

        {/* Input and Output Section */}
        <div className="w-1/2 h-full flex flex-col bg-gray-800 p-2">
          {/* Input Section */}
          <div className="mb-4">
            <input
              className="w-full p-2 bg-gray-900 text-white rounded h-32 resize-none"
              value={input || ""}
              onChange={handleInputChange}
              placeholder="Enter input here..."
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
