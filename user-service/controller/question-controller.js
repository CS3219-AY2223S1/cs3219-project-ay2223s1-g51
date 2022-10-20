import { ormGetQuestions as _getQuestions } from "../model/question-orm.js";

export async function getQuestions(req, res) {
  try {
    const roomtype = req.params.difficulty;
    if (roomtype) {
      const resp = await _getQuestions(roomtype);
      if (resp == null) {
        console.log("res is null");
        return res.status(404).json({ resp });
      } else if (resp) {
        console.log("success");
        console.log(resp.questions);
        return res.status(200).json({ resp });
      }
    } else {
      return res.status(400).json({ message: "Difficulty not selected!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Database failure when getting question!" });
  }
}
