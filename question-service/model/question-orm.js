import { getQuestions } from "./repository.js";

export async function ormGetQuestions(roomtype) {
  try {
    const questions = await getQuestions(roomtype);
    if (questions) {
      console.log("Questions retrieved");
      return questions;
    }
    if (questions == null) {
      console.log("No questions found");
      return null;
    }
  } catch (err) {
    console.log("ERROR: Getting the questions led to an error");
    return err;
  }
}
