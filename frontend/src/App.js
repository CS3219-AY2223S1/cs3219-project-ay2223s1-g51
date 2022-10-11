import React, { useState } from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {Box} from "@mui/material";
import SignupPage from './components/SignupPage';
import Login from './components/Login';
import HomePage from "./components/HomePage";
import ProfilePage from './components/ProfilePage';
import NavBar from "./components/NavBar";

function App(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="App">
            <NavBar username={username} password={password} setUsername={setUsername} setPassword={setPassword} ></NavBar>
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/login" />}></Route>
                        <Route path="/login" element={<Login username={username} password={password} setUsername={setUsername} setPassword={setPassword} />}/>
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path="/home" element={<HomePage username={username} password={password} setPassword={setPassword}/>}/>
                        <Route path="/profile" element={<ProfilePage username={username}  password={password} setPassword={setPassword}/>}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
