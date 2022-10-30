import "dotenv/config";
//Set up mongoose connection
import mongoose from "mongoose";

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function getHistory(username) {
  const result = [];
  await db
    .collection("historymodels")
    .find({ username: username })
    .forEach((history) => {
      result.push(history);
    });
  return result;
}
