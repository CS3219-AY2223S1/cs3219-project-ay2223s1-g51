import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material";

import SignupPage from "./components/SignupPage";
import Login from "./components/Login";
import ProfilePage from "./components/ProfilePage";
import AboutUs from "./components/AboutUs";

import NavBar from "./components/NavBar";
import Room from "./components/Room";
import SelectRoom from "./components/SelectRoom";
import io from "socket.io-client";
import Editor from "./components/Editor/RealTimeEditor";
import { SnackbarProvider } from "notistack";
import InfoIcon from "@mui/icons-material/Info";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
function App(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roomtype, setRoomType] = useState("");
  const [room, setRoom] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [screenSize, getDimension] = useState({
    dynamicWidth: window.innerWidth,
    dynamicHeight: window.innerHeight,
  });
  const setDimension = () => {
    console.log(window.innerHeight);
    getDimension({
      dynamicWidth: window.innerWidth,
      dynamicHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", setDimension);
  }, []);

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
  const [value, setValue] = useState();
  const [openAboutUs, setOpenAboutUs] = useState(false);

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

  const bodySize = () => {
    return screenSize.dynamicHeight * 0.8;
  };

  const footerSize = () => {
    return screenSize.dynamicHeight * 0.08;
  };

  useEffect(() => {
    console.log("token has changed");
    console.log("token: " + token);
  }, [token]);

  return (
    <SnackbarProvider>
      <Box sx={{ display: "flex", flexDirection: "column", flexFlow: "column", height: screenSize.dynamicHeight }}>
        <NavBar username={username} password={password} setUsername={setUsername} setPassword={setPassword}></NavBar>
        <Box sx={{ display: "flex", flexDirection: "column", padding: "4rem", height: { bodySize } }}>
          <Router>
            <Routes>
              <Route exact path="/" element={<Navigate replace to="/login" />}></Route>
              <Route
                path="/login"
                element={
                  <Login
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    token={token}
                    setToken={setToken}
                  />
                }
              />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/profile"
                element={<ProfilePage username={username} password={password} user={user} setPassword={setPassword} />}
              />
              <Route
                path="/selectroom"
                element={
                  <SelectRoom
                    user={username}
                    roomtype={roomtype}
                    setRoomType={setRoomType}
                    socket={socket}
                    token={token}
                    setToken={setToken}
                  />
                }
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
        <AboutUs openAboutUs={openAboutUs} setOpenAboutUs={setOpenAboutUs} />
        <BottomNavigation
          sx={{ background: "#667aff", height: { footerSize } }}
          showLabels
          value={value}
          onChange={(event, newValue) => {
            if (newValue === "aboutus") {
              setValue(newValue);
              setOpenAboutUs(true);
            }
          }}
        >
          <BottomNavigationAction label="AboutUs" icon={<InfoIcon />} value="aboutus" />
        </BottomNavigation>
      </Box>
    </SnackbarProvider>
  );
}

export default App;
