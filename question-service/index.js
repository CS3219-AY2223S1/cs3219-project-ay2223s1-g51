import express from "express";
import cors from "cors";

import "dotenv/config";

const PORT = process.env.PORT || 8002;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());
import { getQuestions } from "./controller/question-controller.js";

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get("/getquestions/:difficulty", getQuestions);

app.use("/api/question", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

app.listen(PORT, () => console.log("user-service listening on port 8002"));
