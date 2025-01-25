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
        console.log("Fetched messages:", data);
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
          console.log("Real-time message received:", payload.new);
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
    if (message.trim()) {
      const { error } = await supabase.from("messages").insert([
        {
          username: username || "Anonymous",
          content: message,
          timestamp: new Date().toISOString(), // Add timestamp to ensure proper ordering
        },
      ]);
      if (error) {
        console.error("Error sending message:", error);
      } else {
        console.log("Message sent successfully");
      }
      setMessage(""); // Clear the input box after sending
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
