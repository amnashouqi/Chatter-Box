import { useState, useEffect } from "react";
import io from "socket.io-client";
import './index.css'; // Make sure this import exists!

const socket = io.connect("http://localhost:3001"); // Connect to backend

const Chat = () => {
  const [username, setUsername] = useState("User" + Math.floor(Math.random() * 1000)); // Assign random username
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  // Send message to server
  const sendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = { user: username, text: message, time: new Date().toLocaleTimeString() };
      socket.emit("send_message", newMessage);
      setMessage("");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-center">ChatterBox 💬</h2>
      </div>

      {/* Scrollable Message Container */}
      <div className="flex-grow overflow-y-auto pb-28 p-6">
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.user === username ? "items-end" : "items-start"}`}
            >
              {/* Message Box */}
              <div
                className={`p-3 rounded-lg w-fit max-w-[75%] sm:max-w-[60%] md:max-w-[50%] lg:max-w-[45%] xl:max-w-[40%] break-words whitespace-pre-wrap overflow-hidden ${
                  msg.user === username ? "bg-cyan-600 text-white" : "bg-teal-600"
                }`}
              >
                <p className="mt-1">{msg.text}</p>
              </div>

              {/* User ID and Timestamp */}
              <div className="text-[10px] text-gray-300 mt-1">
                <span className="mr-2">{msg.user} •</span>
                <span>{msg.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Input Field */}
      <div className="p-6 pb-8 bg-gray-900 fixed bottom-0 w-full">
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-3 bg-gray-700 rounded-l focus:outline-none"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 rounded-r hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;