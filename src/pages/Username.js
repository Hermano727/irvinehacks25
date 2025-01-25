import React, { useState } from "react";

const Username = ({ setUsername }) => {
  const [input, setInput] = useState("");

  const handleSetUsername = () => {
    if (input.trim()) {
      setUsername(input);
    } else {
      alert("Please enter a username!");
    }
  };

  return (
    <div id="username-section">
      <input
        type="text"
        placeholder="Enter your username"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSetUsername}>Set Username</button>
    </div>
  );
};

export default Username;
