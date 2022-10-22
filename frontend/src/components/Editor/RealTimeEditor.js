import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { IconContext } from "react-icons";
import { useNavigate, NavLink } from "react-router-dom";
import { useSnackbar } from "notistack";
import { IconButton } from "@material-ui/core";
import { RiCheckFill } from "react-icons/ri";
import { URL_POSTHISTORY_SVC } from "../../configs/history-service";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  AppBar,
  Toolbar,
  Container,
  Typography,
  Grid,
} from "@mui/material";

import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import Brightness7RoundedIcon from "@material-ui/icons/Brightness7Rounded";
import Brightness4RoundedIcon from "@material-ui/icons/Brightness4Rounded";

import fileDownload from "js-file-download";
import { Stack } from "@mui/system";

export default function RealTimeEditor(props) {
  const {
    socket,
    username,
    room,
    runCode,
    setRoomFontSize,
    setIsDisconnected,
    setRoomTheme,
    setcodeInRoom,
    setlanguageInRoom,
    users,
    question,
    roomtype,
  } = props;

  const navigate = useNavigate();

  const [theme, setTheme] = useState("vs-dark");

  const [language, setLanguage] = useState(0);
  // Check if editor is ready
  const [isEditorReady, setIsEditorReady] = useState(false);
  // Send chunks of code on change
  const [editorCode, seteditorCode] = useState("");
  // Set value of editor
  const [value, setValue] = useState("");
  const [sendInitialData, setSendInitialData] = useState(false);
  const [title, setTitle] = useState("Untitled");
  const [titleInfo, setTitleInfo] = useState("Untitled");
  const [titleChange, setTitleChange] = useState(false);
  const [fileExtensionValue, setfileExtensionValue] = useState(0);

  const [fontsize, setFontsize] = useState(3);

  // Save function
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [progress, setProgress] = useState("");

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // Ref for editor
  const editorRef = useRef();

  // Called on initialization, adds ref
  const handleEditorDidMount = (_, editor) => {
    setIsEditorReady(true);
    editorRef.current = editor;
  };

  // Called whenever there is a change in the editor
  const handleEditorChange = (value, event) => {
    seteditorCode(value);
    setcodeInRoom(value);
  };

  // For theme of code editor
  const toggleTheme = () => {
    if (theme === "light") {
      enqueueSnackbar("Changed to Dark mode", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Changed to Light mode", {
        variant: "success",
      });
    }
    setTheme(theme === "light" ? "vs-dark" : "light");
    setRoomTheme(theme === "light" ? "vs-dark" : "light");
  };

  // If language changes on one socket, emit to all other
  useEffect(() => {
    if (socket === undefined) {
      setIsDisconnected(true);
      navigate("/");
    } else {
      socket.emit("language-change", language);
    }
  }, [language]);

  // If there is a code change on a socket, emit to all other
  useEffect(() => {
    if (socket === undefined) {
      navigate("/");
    } else {
      // console.log("someone typed!");
      socket.emit("code-change", editorCode);
    }
  }, [editorCode]);

  // If there is a title change on a socket, emit to all other
  useEffect(() => {
    if (socket === undefined) {
      setIsDisconnected(true);
      navigate("/");
    } else {
      socket.emit("title-change", title);
    }
  }, [title]);

  // Recieve code, title and language changes
  useEffect(() => {
    if (socket === undefined) {
      setIsDisconnected(true);
      navigate("/");
    } else {
      socket.on("code-update", (data) => {
        // console.log("receive code update!");
        setValue(data);
        setcodeInRoom(data.code);
      });
      socket.on("language-update", (data) => {
        setLanguage(data);
        setlanguageInRoom(data);
      });

      socket.on("title-update", (data) => {
        setTitleInfo(data);
      });

      socket.on("request-info", (data) => {
        setSendInitialData(true);
      });
    }
  }, []);

  // If a new user join, send him current language and title used by other sockets.
  useEffect(() => {
    if (socket === undefined) {
      setIsDisconnected(true);
      navigate("/");
    } else {
      if (sendInitialData === true) {
        socket.emit("user-join", { code: editorCode, title: title, language: language });
        setSendInitialData(false);
      }
    }
  }, [sendInitialData]);

  const languages = ["cpp", "python", "javascript", "c", "java", "go"];
  const languageExtension = ["cpp", "py", "js", "c", "java", "go"];
  const fontSizes = ["10px", "12px", "14px", "16px", "18px", "20px", "22px", "24px", "26px", "28px", "30px"];

  const changeLanguage = (e) => {
    setLanguage(languages[e.target.value]);
    setlanguageInRoom(languages[e.target.value]);
    setfileExtensionValue(e.target.value);
  };

  const changeFontSize = (e) => {
    setFontsize(fontSizes[e.target.value]);
    setRoomFontSize(fontSizes[e.target.value]);
  };

  const titleUpdating = (e) => {
    setTitleInfo(e.target.value);
    setTitleChange(true);
  };

  // Nav Bar buttons
  const leaveRoom = (e) => {
    if (socket === undefined) {
      setIsDisconnected(true);
      navigate("/");
    } else {
      console.log("disconnect");
      socket.disconnect();
      setIsDisconnected(true);
      navigate("/selectroom");
    }
  };

  const titleUpdated = (e) => {
    setTitle(titleInfo);
    setTitleChange(false);
  };

  const toggleSave = () => {
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    console.log("current progress:" + progress);
    console.log("current code:" + editorCode);
    const buddy = users.find((user) => user.username !== username);
    const buddyName = buddy ? buddy.username : "";
    const date = new Date().toLocaleDateString();
    const history = {
      question: question.title,
      code: editorCode,
      username: username,
      progress: progress,
      buddy: buddyName,
      difficulty: roomtype,
      date: date,
    };

    console.log(history);
    axios.post(URL_POSTHISTORY_SVC, history).catch((err) => {
      console.log(err);
    });
    closeDialog();
  };

  const handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setProgress(e.target.value);
  };

  const closeDialog = () => setIsDialogOpen(false);

  const downloadCode = (e) => {
    e.preventDefault();
    fileDownload(editorCode, `${title}.${languageExtension[fileExtensionValue]}`);
  };

  const showFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      setValue(text);
      setcodeInRoom(text);
      seteditorCode(text);
      //   alert(text)
    };
    reader.readAsText(e.target.files[0]);
  };

  const hiddenFileInput = React.useRef(null);

  const handleUpload = (event) => {
    hiddenFileInput.current.click();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "background.paper" }}>
        <Toolbar>
          <Grid container direction="row" spacing={1}>
            <Grid item xs={6}>
              <Box display="flex" flexDirection="row" alignContent="space-between" alignItems="center">
                <IconButton color="primary" title="Run code" onClick={runCode}>
                  <PlayArrowRoundedIcon />
                </IconButton>

                <IconButton color="primary" title="Download the code" onClick={downloadCode}>
                  <GetAppRoundedIcon />
                </IconButton>
                <IconButton color="primary" title="Upload the code" onClick={handleUpload}>
                  <PublishRoundedIcon />
                </IconButton>
                {/* <input type="file" onChange={(e) => showFile(e)}></input> */}
                <input type="file" ref={hiddenFileInput} onChange={(e) => showFile(e)} style={{ display: "none" }} />

                {theme === "vs-dark" ? (
                  <IconButton color="primary" onClick={toggleTheme} title="Change to Light theme">
                    <Brightness7RoundedIcon />
                  </IconButton>
                ) : (
                  <IconButton color="primary" onClick={toggleTheme} title="Change to Dark theme">
                    <Brightness4RoundedIcon />
                  </IconButton>
                )}

                <FormControl fullWidth>
                  <InputLabel id="select-fontsize-label">Fontsize</InputLabel>
                  <Select
                    labelId="select-fontsize-label"
                    id="select-fontsize"
                    value={fontsize}
                    label="Select Fontsize"
                    onChange={(e) => {
                      setFontsize(e.target.value);
                    }}
                  >
                    <MenuItem value={0}>10px</MenuItem>
                    <MenuItem value={1}>12px</MenuItem>
                    <MenuItem value={2}>14px</MenuItem>
                    <MenuItem value={3}>16px</MenuItem>
                    <MenuItem value={4}>18px</MenuItem>
                    <MenuItem value={5}>20px</MenuItem>
                    <MenuItem value={6}>22px</MenuItem>
                    <MenuItem value={7}>24px</MenuItem>
                    <MenuItem value={8}>26px</MenuItem>
                    <MenuItem value={9}>28px</MenuItem>
                    <MenuItem value={10}>30px</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="select-language-label">Language</InputLabel>
                  <Select
                    labelId="select-language-label"
                    id="select-language"
                    value={language}
                    label="Select Language"
                    onChange={(e) => {
                      setLanguage(e.target.value);
                    }}
                  >
                    <MenuItem value={0}>C++</MenuItem>
                    <MenuItem value={1}>Python</MenuItem>
                    <MenuItem value={2}>Javascript</MenuItem>
                    <MenuItem value={3}>C</MenuItem>
                    <MenuItem value={4}>Java</MenuItem>
                    <MenuItem value={5}>Go</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography color="black">Participants:</Typography>
                <Box display="flex">
                  {users.map((user) => (
                    <Typography>{user.username}</Typography>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box justifyContent="flex-end" display="flex">
                <Button variant="outlined" onClick={toggleSave}>
                  Save Progress
                </Button>
                <IconButton style={{ color: "#dc3545" }} onClick={leaveRoom} title="Leave room">
                  <ExitToAppRoundedIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Saving current progress...</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>What state is your current progress?</DialogContentText>
            <FormControl fullWidth>
              <InputLabel id="save-progress-label">Progress</InputLabel>
              <Select
                labelId="save-progress-label"
                id="save-progress"
                label="Progress"
                value={progress}
                onChange={handleChange}
              >
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Incompleted">Incomplete</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={closeDialog}>cancel</Button>
        </DialogActions>
      </Dialog>
      <div className="d-flex">
        <Editor
          height="90vh"
          width="100%"
          theme={theme}
          language={languages[language]}
          value={value}
          editorDidMount={handleEditorDidMount}
          onChange={handleEditorChange}
          loading={"Loading..."}
          options={{ fontSize: fontSizes[fontsize] }}
        />
      </div>
    </Box>
  );
}
