import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { SnackbarProvider } from "notistack";
import NavBar from "./components/NavBar";
import AboutUs from "./components/AboutUs";
import SignupPage from "./components/SignupPage";
import Login from "./components/Login";
import ProfilePage from "./components/ProfilePage";
import HistoryPage from "./components/HistoryPage";
import SelectRoom from "./components/SelectRoom";
import Room from "./components/Room";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Editor from "./components/Editor/RealTimeEditor";
import InfoIcon from "@mui/icons-material/Info";
import io from "socket.io-client";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";

function App(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roomtype, setRoomType] = useState("");
  const [showFooter, setShowFooter] = useState(true);
  const [room, setRoom] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [screenSize, getDimension] = useState({
    dynamicWidth: window.innerWidth,
    dynamicHeight: window.innerHeight,
  });
  const setDimension = () => {
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
    // console.log(s);
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
      const s = io("http://localhost:8000");
      // console.log(s);
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

  useEffect(() => {
    console.log("user has changed");
    console.log("user: " + user);
  }, [user]);

  return (
    <SnackbarProvider>
      <Box sx={{ display: "flex", flexDirection: "column", flexFlow: "column", height: screenSize.dynamicHeight }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Router>
            <NavBar user={user} setUser={setUser} room={room} socket={socket}></NavBar>
            <Routes>
              <Route exact path="/" element={<Navigate replace to="/login" />}></Route>
              <Route
                path="/login"
                element={
                  <Login
                    username={username}
                    password={password}
                    token={token}
                    user={user}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    setToken={setToken}
                    setUser={setUser}
                  />
                }
              />
              <Route path="/signup" element={<SignupPage />} />
              <Route element={<ProtectedRoutes token={token} />}>
                <Route
                  path="/profile"
                  element={
                    <ProfilePage
                      username={username}
                      password={password}
                      user={user}
                      setUser={setUser}
                      setPassword={setPassword}
                    />
                  }
                />
                <Route
                  path="/history"
                  element={<HistoryPage username={username} password={password} setPassword={setPassword} />}
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
                      setShowFooter={setShowFooter}
                      currentRoom={room}
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
              </Route>
            </Routes>
          </Router>
        </Box>
        <AboutUs openAboutUs={openAboutUs} setOpenAboutUs={setOpenAboutUs} />
        {showFooter && (
          <BottomNavigation
            sx={{ background: "#667aff", height: { footerSize }, width: "100%", bottom: "0", position: "fixed" }}
            showLabels
            value={value}
            onChange={(event, newValue) => {
              if (newValue === "aboutus") {
                setValue(newValue);
                setOpenAboutUs(true);
              }
            }}
          >
            <BottomNavigationAction style={{ color: "white" }} label="AboutUs" icon={<InfoIcon />} value="aboutus" />
          </BottomNavigation>
        )}
      </Box>
    </SnackbarProvider>
  );
}

export default App;
