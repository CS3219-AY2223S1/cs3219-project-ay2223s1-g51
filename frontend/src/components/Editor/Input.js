import React from "react";
import Editor from "@monaco-editor/react";

export default function Input(props) {
  const handleEditorChange = (value, event) => {
    console.log("here is the current model value:", value);
    props.setProperty(value);
  };
  return (
    <>
      <div className={props.theme === "vs-dark" ? "text-center bg-light" : "text-center bg-dark text-light"}>
        <strong>{props.feature}</strong>
      </div>
      <section>
        <Editor
          defaultLanguage="plaintext"
          height="30vh"
          theme={props.theme}
          defaultValue=""
          onChange={handleEditorChange}
          options={{ fontSize: props.fontSize }}
        />
      </section>
    </>
  );
}
