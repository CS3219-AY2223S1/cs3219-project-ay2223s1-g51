import express from "express";
import cors from "cors";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());
import {
  createUser,
  logInUser,
  logOutUser,
  deleteCurrUser,
  editPassword,
  verifyUserToken
} from "./controller/user-controller.js";

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get("/", (_, res) => res.send("Hello World from user-service"));
router.post("/", createUser);
router.post("/loginuser", logInUser);
router.post("/logoutuser", logOutUser);
router.get('/verifyusertoken', verifyUserToken); //middleware
router.delete("/deletecurruser", deleteCurrUser);
router.put("/editpassword", editPassword);

app.use("/api/user", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

app.listen(8001, () => console.log("user-service listening on port 8001"));
