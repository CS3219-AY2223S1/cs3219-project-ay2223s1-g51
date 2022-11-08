import React from "react";
import ReactEmoji from "react-emoji";
import "./css/message.css";

export default function Message(props) {
  const {
    message: { text, sender },
    username,
  } = props;
  let isSentByCurrentUser = false;

  if (sender === username) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd pr-1">
      <p className="sentText pr-10 mb-0 mt-3">{username}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart pl-1">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="sentText pl-10 mb-0 mt-3">{sender}</p>
    </div>
  );
}
