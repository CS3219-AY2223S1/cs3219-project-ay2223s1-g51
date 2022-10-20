import React, { useState, Component, useEffect } from "react";
import { Box, Button, Container, Typography, Select, MenuItem, FormControl, InputLabel, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { STATUS_CODE_FAIL, STATUS_CODE_DATABASE_ERROR } from "../constants";
import { URL_USER_CHECKUSERJWT_SVC } from "../configs";

export default function SelectRoom(props) {
  const { user, roomtype, setRoomType, socket, token, setToken } = props;
  const navigate = useNavigate();

  useEffect(() => {
    console.log("token in selectroom: " + token);
    try {
      if (token != "") {
        const checkJwt = async () => {
          return await axios.post(URL_USER_CHECKUSERJWT_SVC, { token }).catch((err) => {
            if (err.response.status === STATUS_CODE_FAIL || STATUS_CODE_DATABASE_ERROR) {
              window.location = "http://localhost:3000/login";
            } else {
              window.location = "http://localhost:3000/login";
            }
          });
        };
        checkJwt();
      } else {
        window.location = "http://localhost:3000/login";
      }

    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleChange = (event) => {
    event.preventDefault();
    setRoomType(event.target.value);

    // console.log(event);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(roomtype);
    const room = roomtype;
    const username = user;
    socket.emit("join-room", { username, room });
    navigate(`/room/${room}`);
  };

  return (
    <div>
      <Container component="main">
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
            minHeight: 300,
            gap: 100,
            alignItems: "center",
          }}
        >
          <Stack spacing={5}>
            <Box sx={{ textAlign: "center" }}>
              <Typography component="h1" variant="h5">
                PeerPrep
              </Typography>
            </Box>
            <Container>
              <FormControl fullWidth>
                <InputLabel id="room-id">Room</InputLabel>
                <Select labelId="room-id" id="roomId" value={roomtype} label="room-id" onChange={handleChange}>
                  <MenuItem value="Easy"> Easy </MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Container>
            <Box sx={{ textAlign: "center" }}>
              <Button
                sx={{
                  width: 1 / 4,
                }}
                onClick={handleSubmit}
              >
                Join Chat
              </Button>
            </Box>
          </Stack>
        </Box>
      </Container>
    </div>
  );
}
