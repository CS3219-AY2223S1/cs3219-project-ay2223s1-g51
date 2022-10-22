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
  } = props;

  const navigate = useNavigate();

  const [theme, setTheme] = useState("vs-dark");

  const [language, setLanguage] = useState("cpp");
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

  const [fontsize, setFontsize] = useState("16px");

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
    const history = {
      question: question.title,
      code: editorCode,
      username: username,
      progress: progress,
      buddy: buddyName,
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
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow mb-1 py-0">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <form class="d-flex">
          <input
            class="form-control me-2"
            type="text"
            placeholder="Enter file name here"
            aria-label="Search"
            value={titleInfo}
            onChange={titleUpdating}
          />
          {titleChange === true && (
            <button className="btn ml-2 btn-outline-success">
              <IconContext.Provider value={{ size: "1.4em" }}>
                <RiCheckFill className="checkIcon" onClick={titleUpdated} disabled={!isEditorReady}></RiCheckFill>
              </IconContext.Provider>
            </button>
          )}
        </form>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item m-2">
              <IconButton color="primary" title="Run code" onClick={runCode}>
                <PlayArrowRoundedIcon />
              </IconButton>
            </li>

            <li className="nav-item m-2">
              <IconButton color="primary" title="Download the code" onClick={downloadCode}>
                <GetAppRoundedIcon />
              </IconButton>
            </li>
            <li className="nav-item m-2">
              <IconButton color="primary" title="Upload the code" onClick={handleUpload}>
                <PublishRoundedIcon />
              </IconButton>
              {/* <input type="file" onChange={(e) => showFile(e)}></input> */}
              <input type="file" ref={hiddenFileInput} onChange={(e) => showFile(e)} style={{ display: "none" }} />
            </li>

            <li className="nav-item m-2">
              {theme === "vs-dark" ? (
                <IconButton color="primary" onClick={toggleTheme} title="Change to Light theme">
                  <Brightness7RoundedIcon />
                </IconButton>
              ) : (
                <IconButton color="primary" onClick={toggleTheme} title="Change to Dark theme">
                  <Brightness4RoundedIcon />
                </IconButton>
              )}
            </li>

            <li className="nav-item">
              <span className="nav-link mt-1">Participants:</span>
              <div id="users">
                {users.map((user) => (
                  <div className="row">
                    <li key={user.id}>{user.username}</li>
                  </div>
                ))}
              </div>
            </li>
            <li className="nav-item mt-1">
              <span className="nav-link mt-1">Room: {room}</span>
            </li>

            <li className="nav-item m-3">
              <select className="custom-select mt-1" title="change font size" onChange={changeFontSize}>
                <option value="0">10px</option>
                <option value="1">12px</option>
                <option value="2">14px</option>
                <option value="3" selected>
                  16px
                </option>
                <option value="4">18px</option>
                <option value="5">20px</option>
                <option value="6">22px</option>
                <option value="7">24px</option>
                <option value="8">26px</option>
                <option value="9">28px</option>
                <option value="10">30px</option>
              </select>
            </li>

            <li className="nav-item mt-3">
              <select className="custom-select mt-1" title="Select Language" onChange={changeLanguage}>
                <option value="0">C++</option>
                <option value="1">Python</option>
                <option value="2">Javascript</option>
                <option value="3">C</option>
                <option value="4">Java</option>
                <option value="5">Go</option>
              </select>
            </li>

            <li className="nav-item mt-3">
              <Button variant="outlined" onClick={toggleSave}>
                Outlined
              </Button>
            </li>

            <li className="nav-item mt-2">
              <IconButton style={{ color: "#dc3545" }} onClick={leaveRoom} title="Leave room">
                <ExitToAppRoundedIcon />
              </IconButton>
            </li>
          </ul>
        </div>
      </nav>
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
          language={language}
          value={value}
          editorDidMount={handleEditorDidMount}
          onChange={handleEditorChange}
          loading={"Loading..."}
          options={{ fontSize: fontsize }}
        />
      </div>
    </div>
  );
}
