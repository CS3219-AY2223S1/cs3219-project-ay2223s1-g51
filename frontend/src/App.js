import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./components/SignupPage";
import Login from "./components/Login";
import { Box } from "@mui/material";
import HomePage from "./components/HomePage";
import ChatApp from "./components/ChatApp";
import SelectRoom from "./components/SelectRoom";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

function App(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roomtype, setRoomType] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="App">
      <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Navigate replace to="/login" />}></Route>
            <Route
              path="/login"
              element={
                <Login username={username} password={password} setUsername={setUsername} setPassword={setPassword} />
              }
            />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/home"
              element={<HomePage username={username} password={password} setPassword={setPassword} />}
            />
            <Route
              path="/selectroom"
              element={<SelectRoom username={username} roomtype={roomtype} setRoomType={setRoomType} socket={socket} />}
            />
            <Route
              path="/chatapp"
              element={
                <ChatApp username={username} roomtype={roomtype} room={room} setRoom={setRoom} socket={socket} />
              }
            />
          </Routes>
        </Router>
      </Box>
    </div>
  );
}

export default App;
