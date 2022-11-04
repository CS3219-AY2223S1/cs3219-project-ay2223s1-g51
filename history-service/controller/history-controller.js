import { ormGetHistory as _getHistory, ormPostHistory as _postHistory } from "../model/history-orm.js";

export async function getHistory(req, res) {
  try {
    const username = req.params.username;
    if (username) {
      const resp = await _getHistory(username);
      if (resp == null) {
        // console.log("res is null");
        return res.status(404).json({ resp });
      } else if (resp) {
        // console.log("success");
        return res.status(200).json({ resp });
      }
    } else {
      return res.status(400).json({ message: "User not found!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Database failure when getting history!" });
  }
}

export async function postHistory(req, res) {
  try {
    const history = req.body;
    if (history) {
      const resp = await _postHistory(history);
      if (resp == null) {
        console.log("res is null");
        return res.status(404).json({ resp });
      } else if (resp) {
        console.log("success");
        return res.status(200).json({ resp });
      }
    } else {
      return res.status(400).json({ message: "Invalid history!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Database failure when posting history!" });
  }
}
