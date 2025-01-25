import React from "react";
import "../../styles/chat.css";

const UsernamePill = ({ username }) => {
  return <div className="username-pill">{username}</div>;
};

export default UsernamePill;