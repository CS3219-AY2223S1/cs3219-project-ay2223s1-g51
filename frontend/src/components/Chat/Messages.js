import React from "react";

import ScrollToBottom from "react-scroll-to-bottom";

import Message from "./Message";

import "./css/messages.css";

export default function Messages(props) {
  const { messages, username } = props;
  return (
    <ScrollToBottom className="messages" style={{ minHeight: "70vh" }}>
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message} username={username} />
        </div>
      ))}
    </ScrollToBottom>
  );
}
