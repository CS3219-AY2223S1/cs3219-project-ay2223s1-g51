import React, { useEffect, useState } from "react";
import Editor from "./Editor/RealTimeEditor";
import EditorBox from "./Editor/EditorBox";
import axios from "axios";
import InputBox from "./Editor/Input";
import { useSnackbar } from "notistack";
import Messages from "./Chat/Messages";
import Input from "./Chat/Input";
import { Grid, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Question from "./Question";
import { URL_EXECUTE_API } from "../configs/matching-service";
import "react-reflex/styles.css";

export default function Room(props) {
  const { username, socket, setIsDisconnected, roomtype, room, setRoom } = props;

  const getLanguageVersion = {
    cpp17: "0", // g++ 17 GCC 9.10
    java: "3", // JDK 11.0.4
    python3: "3", // 3.7.4
    go: "3", // 1.13.1
    nodejs: "3", // 12.11.1
  };
  const getLanguage = {
    cpp: "cpp17",
    java: "java",
    python: "python3",
    go: "go",
    javascript: "nodejs",
  };
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [input, setInput] = useState("");
  const [languageInRoom, setlanguageInRoom] = useState("cpp");
  const [output, setOutput] = useState("");
  const [codeInRoom, setcodeInRoom] = useState("");
  const [stats, setStats] = useState("");
  const [RoomFontSize, setRoomFontSize] = useState("");
  const [RoomTheme, setRoomTheme] = useState("vs-dark");
  const [isError, setisError] = useState(false);
  const [users, setUsers] = useState([]);
  const [timeoutId, setTimeoutId] = useState(-1);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const runCode = async () => {
    const script = codeInRoom;
    const language = getLanguage[languageInRoom];
    const versionIndex = getLanguageVersion[language];
    const stdin = input;

    const response = await axios({
      method: "POST",
      url: URL_EXECUTE_API,
      data: {
        script: script,
        language: language,
        stdin: stdin,
        versionIndex: versionIndex,
      },
      responseType: "json",
    });

    if (response.status === 200) {
      const data = response.data;
      if (data.memory === null || data.cpu === null) {
        setisError(true);
        enqueueSnackbar("Compilation Error", {
          variant: "warning",
        });
        setOutput(data.output.substr(1));
      } else {
        setisError(false);
        enqueueSnackbar("Code executed successfully", {
          variant: "success",
        });
        setOutput(data.output);
      }
      const statement1 = `Memory used: ${data.memory} kilobyte(s).\n`;
      const statement2 = `CPU time: ${data.cpuTime} sec(s).`;
      var sta = statement1.concat(statement2);
      setStats(sta);
    } else {
      enqueueSnackbar("Some Error occurred", {
        variant: "error",
      });
    }
  };

  const handleEmptyRoom = () => {
    enqueueSnackbar("timed out!", {
      variant: "warning",
    });
    // console.log("disconnect from room");
    socket.emit("leave-room", room);
    navigate("/selectroom");
  };

  useEffect(() => {
    if (users.length === 1) {
      const id = setTimeout(handleEmptyRoom, 30000);
      setTimeoutId(id);
    }
    if (users.length === 2) {
      clearTimeout(timeoutId);
      setTimeoutId(-1);
    }
  }, [users]);

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("output-update", (output) => {
      setOutput(output);
    });

    socket.on("stats-update", (stats) => {
      setStats(stats);
    });

    socket.on("input-update", (input) => {
      setInput(input);
    });

    // Update participants
    socket.on("joined-users", (data) => {
      setUsers(data.users);
      setRoom(data.room);
    });
  }, []);

  // If there is a input box change on a socket, emit to all other
  useEffect(() => {
    if (socket === undefined) {
      navigate("/");
    } else {
      socket.emit("input-change", input);
    }
  }, [input]);

  // If there is a output box change on a socket, emit to all other
  useEffect(() => {
    if (socket === undefined) {
      navigate("/");
    } else {
      // console.log("someone typed input!");
      socket.emit("output-change", output);
    }
  }, [output]);

  // If there is a stats box change on a socket, emit to all other
  useEffect(() => {
    if (socket === undefined) {
      navigate("/");
    } else {
      socket.emit("stats-change", stats);
    }
  }, [stats]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", `${username} : ${message}`);
      setMessage("");
    }
  };

  return (
    <Stack>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Editor
            socket={socket}
            username={username}
            setIsDisconnected={setIsDisconnected}
            setRoomTheme={setRoomTheme}
            setRoomFontSize={setRoomFontSize}
            runCode={runCode}
            users={users}
            room={room}
            setcodeInRoom={setcodeInRoom}
            setlanguageInRoom={setlanguageInRoom}
            question={question}
            roomtype={roomtype}
          />
        </Grid>
        <Grid item xs={4} direction="column">
          <Stack>
            <Question roomtype={roomtype} setQuestion={setQuestion}></Question>
            <div style={{ height: "2vh" }}></div>
            <Box sx={{ mb: 2, p: 2.5 }}>
              <Messages messages={messages} username={username}></Messages>
              <Input message={message} setMessage={setMessage} sendMessage={sendMessage}></Input>
              <div style={{ height: "vh" }}></div>
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <Grid
        sx={{
          display: "flex",
        }}
        container
        spacing={1}
      >
        <Grid item xs={4}>
          <InputBox feature="Input" value={input} theme={RoomTheme} setProperty={setInput} fontSize={RoomFontSize} />
        </Grid>
        <Grid item xs={4}>
          <EditorBox feature={isError ? "Error" : "Output"} theme={RoomTheme} value={output} fontSize={RoomFontSize} />
        </Grid>
        <Grid item xs={4}>
          <EditorBox feature="Stats" value={stats} theme={RoomTheme} fontSize={RoomFontSize} />
        </Grid>
      </Grid>
      <div style={{ height: "7vh" }}></div>
    </Stack>
  );
}
