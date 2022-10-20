import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { IconContext } from "react-icons";
import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate, NavLink } from "react-router-dom";
import { useSnackbar } from "notistack";
import { IconButton } from "@material-ui/core";
import { RiCheckFill } from "react-icons/ri";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import Brightness7RoundedIcon from "@material-ui/icons/Brightness7Rounded";
import Brightness4RoundedIcon from "@material-ui/icons/Brightness4Rounded";
import ShareRoundedIcon from "@material-ui/icons/ShareRounded";
import fileDownload from "js-file-download";

export default function RealTimeEditor(props) {
  const {
    socket,
    username,
    runCode,
    setRoomFontSize,
    setIsDisconnected,
    setRoomTheme,
    setcodeInRoom,
    setlanguageInRoom,
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
  const [valid, setValid] = useState(false);
  const [sendInitialData, setSendInitialData] = useState(false);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState("");

  const [title, setTitle] = useState("Untitled");
  const [titleInfo, setTitleInfo] = useState("Untitled");
  const [titleChange, setTitleChange] = useState(false);
  const [fileExtensionValue, setfileExtensionValue] = useState(0);

  const [fontsize, setFontsize] = useState("16px");

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

  //for copying room code
  const copyRoomCode = () => {
    navigator.clipboard.writeText(room);
    enqueueSnackbar(`Room-code copied! Share this code with your friends and Code with them!🤩`, {
      variant: "success",
    });
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

      // Triggered if new user joins
      socket.on("accept-info", (data) => {
        setTitleInfo(data.title);
        setLanguage(data.language);
        setlanguageInRoom(data.language);
        setValue(data.code);
        setcodeInRoom(data.code);
      });

      // Update participants
      socket.on("joined-users", (data) => {
        setUsers(data.users);
        setRoom(data.room);
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

  const leaveRoom = (e) => {
    if (socket === undefined) {
      setIsDisconnected(true);
      navigate("/");
    } else {
      socket.emit("disconnect");
      socket.disconnect();
      setIsDisconnected(true);
      navigate("/");
    }
  };

  const titleUpdated = (e) => {
    setTitle(titleInfo);
    setTitleChange(false);
  };

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
    <>
      <BrowserView className="w-100">
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow mb-1 py-0">
          <NavLink className="navbar-brand m-2" to="/" onClick={leaveRoom}>
            PeerPrep
          </NavLink>
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

              <li className="nav-item m-2">
                <IconButton color="primary" onClick={copyRoomCode} title="Share the room code">
                  <ShareRoundedIcon />
                </IconButton>
                {/* <span className="nav-link">{id}</span> */}
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

              <li className="nav-item mt-2">
                <IconButton style={{ color: "#dc3545" }} onClick={leaveRoom} title="Leave room">
                  <ExitToAppRoundedIcon />
                </IconButton>
              </li>
            </ul>
          </div>
        </nav>

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
      </BrowserView>
      <MobileView>
        <div
          className="mobile-notValid text-center"
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <h1>Dear user, unfortunately this app is not supported in MobileView.</h1>
          <h1>Kindly use on a Desktop.</h1>
        </div>
      </MobileView>
    </>
  );
}
