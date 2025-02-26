import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001"); // Connect to backend

const Chat = () => {
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
      socket.emit("send_message", message);
      setMessage("");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-96 p-4 border rounded-lg bg-gray-800">
        <h2 className="text-lg font-bold mb-3">Chat Room</h2>
        <div className="h-60 overflow-y-auto p-2 border-b border-gray-600">
          {messages.map((msg, index) => (
            <div key={index} className="p-2 bg-gray-700 rounded my-1">
              {msg}
            </div>
          ))}
        </div>
        <div className="mt-3 flex">
          <input
            type="text"
            className="flex-1 p-2 bg-gray-700 rounded focus:outline-none"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
