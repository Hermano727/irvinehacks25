import React, { useState } from "react";

export default function ZIPSearch() {
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    // Only allow numeric input
    const value = event.target.value.replace(/\D/g, '');
    setZip(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Validate ZIP code
    if (zip.length === 5) {
      setError(""); // Valid ZIP code
      // Proceed with further actions (e.g., API call)
    } else {
      setError("Error: Please input a valid 5-digit ZIP code.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={zip}
          onChange={handleInputChange}
          placeholder="Enter ZIP code"
          maxLength={5}
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}