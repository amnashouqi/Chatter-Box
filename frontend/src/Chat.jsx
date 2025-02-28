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
      <div className="flex-grow p-10 border rounded-lg bg-gray-800 shadow-lg overflow-y-auto">
        <h2 className="text-xl font-bold text-center mb-3">ChatterBox 💬</h2>
        <div className="p-2 space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className={`p-3 rounded-lg w-fit max-w-[75%] sm:max-w-[60%] md:max-w-[50%] lg:max-w-[45%] xl:max-w-[40%] break-words whitespace-pre-wrap overflow-hidden space-y-2
              ${msg.user === username ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-700"}`}
            >
              <div className="text-[10px] text-gray-300">
                <span className="mr-2">{msg.user} •</span>
                <span>{msg.time}</span>
              </div>
              <p className="mt-1">{msg.text}</p>
            </div>
            
          ))}
        </div>
      </div>

      <div className="flex p-14 fixed bottom-0 w-full">
        <input
          type="text"
          className="flex-1 p-2 bg-gray-700 rounded-l focus:outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
