import React, { useState, Component, useEffect } from "react";

export default function ChatApp(props) {
  const { username, roomtype, room, setRoom, socket } = props;

  useEffect(() => {
    // Get message from server
    socket.on("message", (message) => {
      displayMessage(message);
      console.log(message);

      // Scroll down
      //   chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on("roomUsers", ({ room, users }) => {
      console.log("results: " + room + ", " + users);
      outputRoomName(room);
      outputUsers(users);
        setTimeout(() => {
          const leaveRoom = window.confirm("Sorry! Connection timed out. Leave the chatroom?");
          if (leaveRoom) {
            window.location = "./selectroom";
          }
        }, 30000);
    });
  }, []);

  // Add room name to DOM
  function outputRoomName(room) {
    setRoom(room);
  }

  // Add users to DOM
  function outputUsers(users) {
    // console.log(users);
    const newList = [];
    users.forEach((user) => {
      // console.log(user.username);
      newList.push(user);
    });
    console.log(newList);
    setUsers(newList);
  }

  // Output message to DOM
  function displayMessage(message) {
    setMsgs((msgs) => [...msgs, message]);
  }

  const handleSendMsg = (e) => {
    e.preventDefault();
    // Get message text
    let msg = e.target.msg.value;
    msg = msg.trim();

    if (!msg) {
      return false;
    }

    // Emit message to server
    socket.emit("chatMessage", msg);

    // Clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
  };

  const handleLeaveRoom = (e) => {
    e.preventDefault();
    // Get message text
    const leaveRoom = window.confirm("Do you want to leave room?");
    if (leaveRoom) {
      window.location = "./selectroom";
    }
  };

  const [userList, setUsers] = useState([]);
  const [msgs, setMsgs] = useState([]);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>
          <i className="fas fa-smile"></i> PeerPrep
        </h1>
        <a id="leave-btn" className="btn" onClick={handleLeaveRoom}>
          Leave Room
        </a>
      </header>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>
            <i className="fas fa-comments"></i> Room Name:
          </h3>
          <h2 id="room-name">{room}</h2>
          <h3>
            <i className="fas fa-users"></i> Users
          </h3>
          <ul id="users">
            {userList.map((user) => (
              <div className="row">
                <li key={user.id}>{user.username}</li>
              </div>
            ))}
          </ul>
        </div>
        <div className="chat-messages">
          {msgs.map((msg) => (
            <div className="message">
              <p className="meta">
                {msg.username} <span> {msg.time}</span>
              </p>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
      </main>
      <div className="chat-form-container">
        <form id="chat-form" onSubmit={handleSendMsg}>
          <input id="msg" type="text" placeholder="Enter Message" required autocomplete="off" />
          <button className="btn">
            <i className="fas fa-paper-plane"></i> Send
          </button>
        </form>
      </div>
    </div>
  );
}
