import { deleteRoom, findRoom, getWaitingRooms, updateRoomCount, getEmptyRooms, getRoomCount } from "./repository.js";
import RoomModel from "./room-model.js";

export async function ormFindRoom(roomname) {
  try {
    const newRoom = await findRoom(roomname);
    if (newRoom == null) {
      //Roomname not found in DB
      console.log("ERROR: Cannot find the room in DB");

      return null;
    } else {
      console.log("Room already exists in the database");
      return newRoom;
    }
  } catch (err) {
    console.log("ERROR: Finding the room led to an error");
    return err;
  }
}
//need to separate orm functions from repository to decouple business logic from persistence
export function ormCreateRoom(roomname) {
  var roomType = roomname.split("-")[0];
  var roomMod = new RoomModel({ roomtype: roomType, roomname: roomname, count: "1" }); //Create new user
  roomMod.save();
}

export async function ormDeleteRoom(roomname) {
  try {
    await deleteRoom(roomname);
    console.log("SUCCESS: Deleted Room!");

    return true;
  } catch (err) {
    console.log("ERROR: Could not delete room");
    return { err };
  }
}

export async function ormUpdateRoomCount(roomname, count) {
  try {
    await updateRoomCount(roomname, count);
    console.log("SUCCESS: Updated Room Count");

    return true;
  } catch (err) {
    console.log("ERROR: Could not update room count!");
    return { err };
  }
}

export async function ormGetWaitingRooms(waitingRooms) {
  try {
    const rooms = await getWaitingRooms(waitingRooms);
    return rooms;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

export async function ormGetRoomCount(roomType) {
  try {
    const count = await getRoomCount(roomType);
    return count;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

export async function ormGetEmptyRooms(emptyRooms) {
  try {
    const rooms = await getEmptyRooms(emptyRooms);
    return rooms;
  } catch (err) {
    return { err };
  }
}
