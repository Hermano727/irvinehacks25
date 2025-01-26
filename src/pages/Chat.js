import React, { useState, useEffect } from "react";
import supabase from "../services/supabaseClient";
import TimestampPill from "../components/chatComponents/TimestampPill";
import UsernamePill from "../components/chatComponents/UsernamePill";
import MessagePill from "../components/chatComponents/MessagePill";
import "../styles/chat.css";

const Chat = () => {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  // Fetch initial messages and set up real-time subscription
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("timestamp", { ascending: true });
      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Send a new message to Supabase
  const sendMessage = async () => {
    if (message.trim() && username) {
      const { error } = await supabase.from("messages").insert([
        {
          username,
          content: message,
          timestamp: new Date().toISOString(),
        },
      ]);
      if (error) {
        console.error("Error sending message:", error);
      }
      setMessage("");
    }
  };

  // Handle textarea input and dynamic resizing
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Set the username
  const handleSetUsername = () => {
    if (usernameInput.trim()) {
      setUsername(usernameInput);
    }
  };

  return (
    <div className="chat">
      <h1 className="modern-title">Welcome to Live Chat</h1>

      {/* Username Input */}
      <div class="message-input">
        <input
          type="text"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="Enter your username"
          disabled={!!username} // Disable input if username is set
        />
        <button onClick={handleSetUsername} disabled={!!username}>
          {username ? "Username Set" : "Set Username"}
        </button>
      </div>

      {/* Chat Messages and Input */}
      <div id="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <div className="message-content-wrapper">
              <UsernamePill username={msg.username} />
              <MessagePill message={msg.content} />
            </div>
            <TimestampPill timestamp={new Date(msg.timestamp).toLocaleTimeString()} />
          </div>
        ))}
      </div>

      <div id="message-input">
        <textarea
          value={message}
          onChange={handleInputChange}
          placeholder={username ? "Type your message" : "Set your username to chat"}
          rows="1"
          style={{ resize: "none" }}
          disabled={!username} // Disable message input until username is set
        />
        <button onClick={sendMessage} disabled={!username || !message.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
