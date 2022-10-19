import axios from "axios";
import { Button, containerClasses } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { URL_QUESTION_GETQUESTION_SVC } from "../configs";
import { STATUS_CODE_SUCCESS } from "../constants";

export default function Question(props) {
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [examples, setExamples] = useState("");
  const [constraints, setConstraints] = useState("");
  const [questionNum, setQuestionNum] = useState(0);
  const { roomtype } = props;

  const handleQuestions = (data) => {
    setQuestions(data);
    setQuestion(data[0]);
    setTitle(data[questionNum].title);

    setDesc(data[questionNum].desc);
    setExamples(data[questionNum].examples);
    setConstraints(data[questionNum].constraints);
    console.log("done setting");
  };

  const handleQuestion = () => {
    setQuestion(questions[questionNum]);
    setTitle(questions[questionNum].title);
    setDesc(questions[questionNum].desc);
    setExamples(questions[questionNum].examples);
    setConstraints(questions[questionNum].constraints);
    console.log("here monkey");
  };

  useEffect(() => {
    try {
      const getQuestions = async () => {
        return await axios.get(URL_QUESTION_GETQUESTION_SVC + roomtype);
      };
      const res = getQuestions();
      res.then((obj) => {
        console.log(obj.data.resp.questions);
        setDifficulty(obj.data.resp.difficulty);
        handleQuestions(obj.data.resp.questions);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (questions != null) {
      console.log(questions[questionNum]);
      handleQuestion();
    } else {
      console.log('questions is empty'); 
    }
  }, [questionNum]);

  const increaseCounter = () => {
    if (questionNum < questions.length - 1) {
      console.log(questionNum + 1);
      setQuestionNum(questionNum + 1);
    } else {
      console.log("no next question");
    }
  };

  const decreaseCounter = () => {
    if (questionNum > 0) {
      console.log(questionNum - 1);
      setQuestionNum(questionNum - 1);
    } else {
      console.log("no previous question");
    }
  };

  return (
    <div>
      <Button onClick={decreaseCounter} variant="contained" style={{ margin: "4px", width: "48%" }}>
        Prev
      </Button>
      <Button onClick={increaseCounter} variant="contained" style={{ margin: "4px", width: "48%" }}>
        Next
      </Button>
      <div
        className="mr-auto d-flex flex-column border"
        style={{
          minWidth: "60vh",
          width: "100%",
          height: "65vh",
          backgroundColor: "white",
          borderRadius: "20px",
          overflowY: "scroll"
        }}
      >
        <h1 className="m-2 text-center">
          {difficulty}: {title}
        </h1>
        <div className="mt-3 px-4" style={{ whiteSpace: "pre-line"}}>{desc}</div>
        <div className="mt-3 px-4" style={{ whiteSpace: "pre-line"}}>{examples}</div>
        <div className="mt-3 px-4" style={{ whiteSpace: "pre-line"}}>{constraints}</div>
      </div>
    </div>
  );
}
