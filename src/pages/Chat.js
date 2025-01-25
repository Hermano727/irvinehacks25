import React, { useState, useEffect } from "react";
import "../styles/chat.css";

const Chat = () => {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");

  // Initialize WebSocket
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => console.log("Connected to WebSocket server");
    ws.onmessage = async (event) => {
      const data = event.data instanceof Blob ? await event.data.text() : event.data;
      setMessages((prev) => [...prev, data]);
    };
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("Disconnected from WebSocket server");

    setSocket(ws);
    return () => ws.close();
  }, []);

  // Send message
  const sendMessage = () => {
    if (message.trim() && socket) {
      const timestamp = new Date().toLocaleTimeString();
      socket.send(`[${timestamp}] ${username || "Anonymous"}: ${message}`);
      setMessage(""); // Clear the input box after sending
    }
  };

  // Handle input change and adjust textarea height
  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Adjust the height dynamically
    e.target.style.height = "auto"; // Reset height to calculate new height
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Set the username
  const handleSetUsername = () => {
    if (usernameInput.trim()) {
      setUsername(usernameInput); // Set the username
    }
  };

  // Conditionally render the username input or the chat interface
  return (
    <div className="chat">
      {!username ? (
        <div className="username-input">
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Enter your username"
          />
          <button onClick={handleSetUsername}>Set Username</button>
        </div>
      ) : (
        <>
          {/* Display messages */}
          <div id="messages">
            {messages.map((msg, index) => (
              <div key={index} className="message">{msg}</div>
            ))}
          </div>

          {/* Input section */}
          <div id="message-input">
            <textarea
              value={message}
              onChange={handleInputChange}
              placeholder="Type your message"
              rows="1" // Start with one row
              style={{ resize: "none" }} // Prevent manual resizing
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
