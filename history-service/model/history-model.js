import mongoose from "mongoose";

const Schema = mongoose.Schema;
let HistoryModelSchema = new Schema({
  username: {
    type: String,
    unique: false
  },
  buddy: {
    type: String,
    unique: false
  },
  code: {
    type: String,
    unique: false
  },
  progress: {
    type: String,
    unique: false,
    required: true,
  },
  question: {
    type: String,
    unique: false,
    required: true,
  },
  difficulty: {
    type: String,
    unique: false,
    required: true,
  },
  date: {
    type: String,
    unique: false,
    required: true,
  },
});

export default mongoose.model("HistoryModel", HistoryModelSchema);
