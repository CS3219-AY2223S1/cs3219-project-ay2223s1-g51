import axios from "axios";
import { Button } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { URL_QUESTION_GETQUESTION_SVC } from "../configs";
import { STATUS_CODE_SUCCESS } from "../constants";

export default function Question(props) {
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("Easy")
  const [title, setTitle] = useState("Two Sum");
  const [desc, setDesc] = useState("");
  const [examples, setExamples] = useState("");
  const [constraints, setConstraints] = useState("");
  const [questionNum, setQuestionNum] = useState(1);

  // useEffect(() => {
  //   const res = axios.get(URL_QUESTION_GETQUESTION_SVC,  props.difficulty )
  //     .catch((err) => {
  //       console.log(err)
  //     })
  //   if (res && res.status === STATUS_CODE_SUCCESS) {
  //     setQuestions(res.data);
  //   }
  // }, []);

  // useEffect(() => {
  //   setQuestion(questions[questionNum]);
  // }, [questions]);

  // useEffect(() => {
  //   setQuestion(questions[questionNum]);    
  // }, [questionNum]) 

  // useEffect(() => {
  //   setTitle(questions[questionNum].title);
  //   setDesc(questions[questionNum].desc);
  //   setExamples(questions[questionNum].examples);
  //   setConstraints(questions[questionNum].constraints);    
  // }, [question])

  const increaseCounter = () => {
    if (questionNum < questions.length) {
      setQuestionNum(questionNum + 1);
    } else {
      console.log('no next question');
    }
  }

  const decreaseCounter = () => {
    if (questionNum > 1) {
      setQuestionNum(questionNum - 1);
    } else {
      console.log('no previous question');
    }
  }

  return (
    <div>
      <Button onClick={decreaseCounter} variant="contained" style={{ margin:"4px", width: "48%" }}>Prev</Button>
      <Button onClick={increaseCounter} variant="contained" style={{ margin:"4px", width: "48%" }}>Next</Button>
      <div 
        className="mr-auto d-flex flex-column border"
        style={{
          minWidth: "60vh",
          width: "100%",
          height: "65vh",
          backgroundColor: "white",
          borderRadius: "20px",
        }}
      >   
        <h1 className="m-2 text-center">{difficulty}: {title}</h1>
        <p className="mt-3 px-4">Problem Description:</p>
        <p className="mt-3 px-4">{desc}</p>
        <p className="mt-3 px-4">Eg:</p>
        <p className="mt-3 px-4">{examples}</p>
        <p className="mt-3 px-4">Constraint</p>
        <p className="mt-3 px-4">{constraints}</p>
      </div>
    </div>
  );
}
