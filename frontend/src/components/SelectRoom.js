import React, { useState, Component, useEffect } from "react";
import { Box, Button, Container, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SelectRoom(props) {
  const { user, roomtype, setRoomType, socket } = props;
  const navigate = useNavigate();

  const handleChange = (event) => {
    event.preventDefault();
    setRoomType(event.target.value);

    console.log(event);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(roomtype);
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
            marginTop: 8,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            PeerPrep
          </Typography>

          <Container>
            <FormControl fullWidth>
              <InputLabel id="room-id">Room</InputLabel>
              <Select labelId="room-id" id="roomId" value={roomtype} label="room-id" onChange={handleChange}>
                <MenuItem value="Easy"> Easy </MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={handleSubmit}>Join Chat</Button>
          </Container>
        </Box>
      </Container>
    </div>
  );
}
