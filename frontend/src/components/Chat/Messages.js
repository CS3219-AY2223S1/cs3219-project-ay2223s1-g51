import React from "react";
import { Box } from "@mui/material";

import Message from "./Message";

import "./css/messages.css";

export default function Messages(props) {
  const { messages, username } = props;
  return (
    <Box
      sx={{
        overflow: "hidden",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        height: 250,
      }}
    >
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message} username={username} />
        </div>
      ))}
    </Box>
  );
}
