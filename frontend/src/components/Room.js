import React, { useState, Component, useEffect } from "react";
import ChatApp from "./ChatApp";
import Editor from "./RealTimeEditor";

import { Grid } from "@mui/material";

export default function Room(props) {
  const { username, roomtype, room, setRoom, socket } = props;

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          Question
        </Grid>
        <Grid item xs={8}>
          <Editor username={username} room={room} />
        </Grid>
        <Grid item xs={12}>
          <ChatApp username={username} roomtype={roomtype} room={room} setRoom={setRoom} socket={socket} />
        </Grid>
      </Grid>
    </div>
  );
}
