import mongoose from "mongoose";

const Schema = mongoose.Schema;
let HistoryModelSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  buddy: {
    type: String,
  },
  code: {
    type: String,
    required: true,
  },
  progress: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
});

export default mongoose.model("HistoryModel", HistoryModelSchema);
