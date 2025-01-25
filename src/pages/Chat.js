import React, { useState, useEffect } from "react";
import TimestampPill from "../components/chatComponents/TimestampPill";
import UsernamePill from "../components/chatComponents/UsernamePill";
import MessagePill from "../components/chatComponents/MessagePill";
import "../styles/chat.css";

const Chat = () => {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");

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
      socket.send(`[${timestamp}] ${username || "Anonymous"}: ${message}`);
      setMessage(""); // Clear the input box after sending
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSetUsername = () => {
    if (usernameInput.trim()) {
      setUsername(usernameInput);
    }
  };

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
          <div id="messages">
            {messages.map((msg, index) => {
              const match = msg.match(/^\[(.*?)\] (.*?): (.*)/);
              const timestamp = match ? match[1] : "";
              const username = match ? match[2] : "Anonymous";
              const content = match ? match[3] : msg;

              return (
                <div key={index} className="message">
                  <div className="message-content-wrapper">
                    <UsernamePill username={username} />
                    <MessagePill message={content} />
                  </div>
                  <TimestampPill timestamp={timestamp} />
                  <div className="platform-icons">
                    {/* Example placeholder icons */}
                    <div className="icon facebook-icon"></div>
                    <div className="icon discord-icon"></div>
                    <div className="icon youtube-icon"></div>
                    <div className="icon twitch-icon"></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div id="message-input">
            <textarea
              value={message}
              onChange={handleInputChange}
              placeholder="Type your message"
              rows="1"
              style={{ resize: "none" }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
