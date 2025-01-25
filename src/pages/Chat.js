import React, { useState, useEffect } from "react";
import Username from "./Username";
import "../styles/chat.css";

const Chat = () => {
  const [username, setUsername] = useState("");

  return (
    <div className="chat">
      {!username ? (
        <Username setUsername={setUsername} />
      ) : (
        <ChatMessages username={username} />
      )}
    </div>
  );
};

const ChatMessages = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

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

  const sendMessage = () => {
    if (message.trim() && socket) {
      const timestamp = new Date().toLocaleTimeString();
      socket.send(`[${timestamp}] ${username}: ${message}`);
      setMessage("");
    }
  };

  return (
    <div>
      <div id="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">{msg}</div>
        ))}
      </div>
      <div id="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
