import { getHistory } from "./repository.js";
import HistoryModel from "./history-model.js";

export async function ormGetHistory(username) {
  try {
    const history = await getHistory(username);
    if (history) {
      console.log("history retrieved");
      return history;
    }
    if (history == null) {
      console.log("No history found");
      return null;
    }
  } catch (err) {
    console.log("ERROR: Getting the history led to an error");
    return err;
  }
}

export async function ormPostHistory(history) {
  let historyMod = new HistoryModel(history); //Create new history
  historyMod.save();
  return true;
}
