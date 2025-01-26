import React, { useState, useEffect } from "react";
import supabase from "../services/supabaseClient";
import TimestampPill from "../components/chatComponents/TimestampPill";
import UsernamePill from "../components/chatComponents/UsernamePill";
import MessagePill from "../components/chatComponents/MessagePill";
import "../styles/chat.css";

const Chat = () => {
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState(""); // State for location
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]); // Messages filtered by city
  const [message, setMessage] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [locationInput, setLocationInput] = useState(""); // Input for location

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

  // Filter messages based on the user's city
  useEffect(() => {
    if (location) {
      const userCity = location.trim().toLowerCase();
      const filtered = messages.filter((msg) => {
        const msgCity = msg.location?.trim().toLowerCase();
        return msgCity === userCity;
      });
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages([]);
    }
  }, [location, messages]);

  // Send a new message to Supabase
  const sendMessage = async () => {
    if (message.trim() && username && location) {
      const { error } = await supabase.from("messages").insert([
        {
          username,
          location, // Add location to the message
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

  // Set the username and location
  const handleSetUserInfo = () => {
    if (usernameInput.trim() && locationInput.trim()) {
      setUsername(usernameInput);
      setLocation(locationInput);
    }
  };

  // Handle textarea input and dynamic resizing
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="chat chat-background">
  <h3 className="lato-regular" style={{ color: "White" }}>Welcome to Live Chat</h3>
  <blockquote className="blockquote subtitle">
    <p>Update others about real-time emergency alerts in your area.</p>
  </blockquote>

  {/* Username and Location Input */}
  <div className="username-input">
    {!username || !location ? (
      <>
        <div className="custom-input-group">
          <input
            type="text"
            className="styled-input"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="custom-input-group">
          <input
            type="text"
            className="styled-input"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="City"
          />
        </div>
        <button className="set-user-info-button" onClick={handleSetUserInfo}>
          Set User Info
        </button>
      </>
    ) : (
      <div className="user-info subtitle">
        <p>
          <strong>Username:</strong> {username} | <strong>City:</strong> {location}
        </p>
      </div>
    )}
  </div>

  {/* Chat Messages */}
  <div id="messages">
    {filteredMessages.map((msg) => (
      <div
        key={msg.id}
        className={`message`}
      >
        <div className="message-content-wrapper">
          <UsernamePill username={msg.username} />
          <MessagePill message={msg.content} />
        </div>
        <TimestampPill
          timestamp={new Date(msg.timestamp).toLocaleTimeString()}
        />
      </div>
    ))}
  </div>

  {/* Message Input */}
  <div id="message-input">
    <textarea
      value={message}
      onChange={handleInputChange}
      placeholder={
        username && location
          ? "Type your message"
          : "Set your username and city to chat"
      }
      rows="1"
      style={{ resize: "none" }}
      disabled={!username || !location} // Disable until username and location are set
    />
    <button onClick={sendMessage} disabled={!username || !location || !message.trim()}>
      Send
    </button>
  </div>
</div>

  );
};

export default Chat;