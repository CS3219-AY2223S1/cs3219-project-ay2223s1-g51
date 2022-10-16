import React, { useState } from "react";
import Editor from "./Editor/RealTimeEditor";
import Box from "./Editor/Box";
import axios from "axios";
import InputBox from "./Editor/Input";
import { useSnackbar } from "notistack";

import "react-reflex/styles.css";

export default function Room(props) {
  const { username, socket, setIsDisconnected } = props;

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

  const [input, setInput] = useState("");
  const [languageInRoom, setlanguageInRoom] = useState("cpp");
  const [output, setoutput] = useState("");
  const [codeInRoom, setcodeInRoom] = useState("");
  const [stats, setstats] = useState("");
  const [RoomFontSize, setRoomFontSize] = useState("");
  const [RoomTheme, setRoomTheme] = useState("vs-dark");
  const [isError, setisError] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const runCode = async () => {
    const script = codeInRoom;
    console.log("script:" + script);
    console.log("language in room-->" + languageInRoom);
    const language = getLanguage[languageInRoom];
    const versionIndex = getLanguageVersion[language];
    const stdin = input;
    console.log("languageinRunCode" + language);
    console.log("versionIndexinRunCode" + versionIndex);
    console.log("stdininRunCode" + stdin);

    const response = await axios({
      method: "POST",
      url: `http://localhost:8000/execute`,
      data: {
        script: script,
        language: language,
        stdin: stdin,
        versionIndex: versionIndex,
      },
      responseType: "json",
    });

    if (response.status === 200) {
      console.log(response);
      console.log(response.data);
      const data = response.data;
      if (data.memory === null || data.cpu === null) {
        console.log("in true");
        setisError(true);
        enqueueSnackbar("Compilation Error", {
          variant: "warning",
        });
        setoutput(data.output.substr(1));
      } else {
        console.log("in false");
        setisError(false);
        enqueueSnackbar("Code executed successfully", {
          variant: "success",
        });
        setoutput(data.output);
      }
      const statement1 = `Memory used: ${data.memory} kilobyte(s).\n`;
      const statement2 = `CPU time: ${data.cpuTime} sec(s).`;
      var sta = statement1.concat(statement2);
      console.log(isError + "--");
      setstats(sta);
    } else {
      enqueueSnackbar("Some Error occurred", {
        variant: "error",
      });
    }
  };

  return (
    <div>
      <div className="d-flex">
        <Editor
          socket={socket}
          username={username}
          setIsDisconnected={setIsDisconnected}
          setRoomTheme={setRoomTheme}
          setRoomFontSize={setRoomFontSize}
          runCode={runCode}
          setcodeInRoom={setcodeInRoom}
          setlanguageInRoom={setlanguageInRoom}
        ></Editor>
      </div>

      <div className="d-flex">
        <div className="border mr-auto ml-1" style={{ width: "37.5%" }}>
          <InputBox feature="Input" theme={RoomTheme} setProperty={setInput} fontSize={RoomFontSize} />
        </div>
        <div className="border" style={{ width: "37.5%" }}>
          <Box feature={isError ? "Error" : "Output"} theme={RoomTheme} value={output} fontSize={RoomFontSize} />
        </div>
        <div className="border ml-auto mr-1" style={{ width: "24%" }}>
          <Box feature="Stats" theme={RoomTheme} value={stats} fontSize={RoomFontSize} />
        </div>
      </div>
    </div>
  );
}
