import React from "react";
import Editor from "@monaco-editor/react";

export default function Input(props) {
  const { setProperty, value, theme, fontSize, feature } = props;
  const handleEditorChange = (value, event) => {
    setProperty(value);
  };
  return (
    <>
      <div className={theme === "vs-dark" ? "text-center bg-light" : "text-center bg-dark text-light"}>
        <strong>{feature}</strong>
      </div>
      <section>
        <Editor
          defaultLanguage="plaintext"
          height="21vh"
          theme={theme}
          value={value}
          onChange={handleEditorChange}
          options={{ fontSize: fontSize }}
        />
      </section>
    </>
  );
}
