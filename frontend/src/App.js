import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./components/SignupPage";
import Login from "./components/Login";
import { Box } from "@mui/material";
import HomePage from "./components/HomePage";
import Room from "./components/Room";
import SelectRoom from "./components/SelectRoom";
import io from "socket.io-client";
import Editor from "./components/Editor/RealTimeEditor";
import { SnackbarProvider } from "notistack";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";

function App(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roomtype, setRoomType] = useState("");
  const [room, setRoom] = useState("");

  const [socket, setSocket] = useState();

  useEffect(() => {
    const s = io("http://localhost:8000");
    console.log(s);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const [isDisconnected, setIsDisconnected] = useState(false);

  useEffect(() => {
    if (isDisconnected === true) {
      const s = io("http://localhost:5000");
      console.log(s);
      setSocket(s);
      console.log("USEEFFECT");
      window.location.reload();
      setIsDisconnected(false);

      return () => {
        s.disconnect();
      };
    }
  }, [isDisconnected]);

  return (
    <SnackbarProvider>
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
                element={<SelectRoom user={username} roomtype={roomtype} setRoomType={setRoomType} socket={socket} />}
              />
              <Route
                path="/room/:id"
                element={
                  <Room
                    username={username}
                    roomtype={roomtype}
                    room={room}
                    setRoom={setRoom}
                    socket={socket}
                    setIsDisconnected={setIsDisconnected}
                  />
                }
              />
              <Route
                path="/editor"
                element={<Editor username={username} room={room} setIsDisconnected={setIsDisconnected} />}
              />
            </Routes>
          </Router>
        </Box>
      </div>
    </SnackbarProvider>
  );
}

export default App;
