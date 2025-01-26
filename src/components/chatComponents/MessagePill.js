import React from "react";
import "../../styles/chat.css";

const MessagePill = ({ message }) => {
  return <div className="message-pill">{message}</div>;
};

export default MessagePill;