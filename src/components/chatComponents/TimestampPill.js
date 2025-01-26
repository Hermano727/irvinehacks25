import React from "react";
import "../../styles/chat.css";

const TimestampPill = ({ timestamp }) => {
  return <div className="timestamp-pill">{timestamp}</div>;
};

export default TimestampPill;