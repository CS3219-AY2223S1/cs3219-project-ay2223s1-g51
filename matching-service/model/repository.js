import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

await mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function findRoom(roomname) {
  //create a promise object which resolves to either an error or a user object from the DB
  return db.collection("roommodels").findOne({ roomname: roomname });
}

export async function deleteRoom(roomname) {
  var myquery = { roomname: { $eq: roomname } };
  db.collection("roommodels").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
  });
}

export async function updateRoomCount(roomname, newCount) {
  var myquery = { roomname: { $eq: roomname } };
  var newvalues = { $set: { count: newCount } };
  // console.log("query: ", myquery);
  // console.log("value: ", newvalues);
  db.collection("roommodels").updateOne(myquery, newvalues, function (err, obj) {
    if (err) throw err;
  });
}

export async function getWaitingRooms(waitingRooms) {
  await db
    .collection("roommodels")
    .find({ count: 1 })
    .forEach(function (data) {
      const roomname = data.roomname.split("-");
      const roomtype = roomname[0];
      waitingRooms[roomtype].push(data.roomname);
    });
  return waitingRooms;
}

export async function getRoomCount(roomType) {
  const count = await db.collection("roommodels").countDocuments({ roomtype: { $eq: roomType } });
  // console.log("room count :" + roomType + " " + count);
  return count;
}

export async function getEmptyRooms(emptyRooms) {
  await db
    .collection("roommodels")
    .find({ count: 0 })
    .forEach(function (data) {
      const roomname = data.roomname.split("-");
      const roomtype = roomname[0];
      emptyRooms[roomtype].push(data.roomname);
    });
  return emptyRooms;
}
