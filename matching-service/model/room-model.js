import mongoose from "mongoose";

const Schema = mongoose.Schema;
let RoomModelSchema = new Schema({
  roomtype: {
    type: String,
    required: true,
  },
  roomname: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
});

export default mongoose.model("RoomModel", RoomModelSchema);
