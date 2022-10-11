import React, { useRef, useEffect, useState } from "react";

import Editor from "@monaco-editor/react";

import firebaseConfig from "../firebaseConfig";

import firebase from "firebase/app";
import { fromMonaco } from "@hackerrank/firepad";

export default function RealTimeEditor(props) {
  const { username, room } = props;
  const editorRef = useRef(null);
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    if (!firebase.apps.length) {
      // Make sure initialization happens only once
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app();
    }
  }, []);

  useEffect(() => {
    if (!editorLoaded) {
      // If editor is not loaded return
      return;
    }

    const dbRef = firebase.database().ref("editor").child(room); // Can be anything in param, use unique string for unique code session

    const firepad = fromMonaco(dbRef, editorRef.current);

    // const name = prompt("Enter your Name :");
    // firepad.setUserName(name);
    if (username) {
      firepad.setUserName(username);
    }
    editorRef.current.updateOptions({ readOnly: false, domReadOnly: false });
  }, [editorLoaded]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    setEditorLoaded(true);
  }

  return (
    <div>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        theme="vs-dark"
        defaultValue="// PeerPrep collaboration"
        readOnly={{ readOnly: false, domReadOnly: false }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
