import {
  ormCreateRoom as _createRoom,
  ormDeleteRoom as _deleteRoom,
  ormGetWaitingRooms as _getWaitingRooms,
  ormGetEmptyRooms as _getEmptyRooms,
  ormGetRoomCount as _getRoomCount,
  ormFindRoom as _findRoom,
  ormUpdateRoomCount as _updateRoomCount,
} from "../model/room-orm.js";

var waitingRooms = await _getWaitingRooms({
  Easy: [],
  Medium: [],
  Hard: [],
});

var emptyRooms = await _getEmptyRooms({
  Easy: [],
  Medium: [],
  Hard: [],
});

// console.log("initialized waiting room: ", waitingRooms);
// console.log("initialized empty room: ", emptyRooms);

var easyRoomCount = await _getRoomCount("Easy"),
  mediumRoomCount = await _getRoomCount("Medium"),
  hardRoomCount = await _getRoomCount("Hard");

async function updateRoomCount(room, v) {
  const r = await _findRoom(room);
  const count = r.count + v;

  //   console.log("update roomname, count: " + room + ", " + count);
  _updateRoomCount(room, count);
}

export function locateRoom(roomType) {
  var currentRoom = "";
  //   console.log("current waiting room: ", waitingRooms);
  //   console.log("current empty room: ", emptyRooms);

  if (waitingRooms[roomType].length > 0) {
    currentRoom = waitingRooms[roomType][0];
    // console.log("Theres already a waiting room: ", currentRoom);
    const removedRoom = waitingRooms[roomType].shift();

    updateRoomCount(removedRoom, 1);
  } else if (emptyRooms[roomType].length > 0) {
    currentRoom = emptyRooms[roomType][0];
    // console.log("Theres already a empty room: ", currentRoom);
    const removedRoom = emptyRooms[roomType].shift();
    waitingRooms[roomType].push(removedRoom);
    updateRoomCount(removedRoom, 1);
  } else {
    currentRoom = createRoom(roomType);
  }

  // console.log("room status: " + rooms[currentRoom]);
  // console.log(
  //     "after add user, waiting rooms: " + waitingRooms["Easy"] + waitingRooms["Medium"] + waitingRooms["Hard"]
  // );
  return currentRoom;
}

export function createRoom(room) {
  var roomname = "";
  if (room === "Easy") {
    waitingRooms[room].push(room + "-" + easyRoomCount);
    roomname = room + "-" + easyRoomCount;
    easyRoomCount++;
  } else if (room === "Medium") {
    waitingRooms[room].push(room + "-" + mediumRoomCount);
    roomname = room + "-" + mediumRoomCount;
    mediumRoomCount++;
  } else {
    console.log(room);
    waitingRooms[room].push(room + "-" + hardRoomCount);
    roomname = room + "-" + hardRoomCount;
    hardRoomCount++;
  }
  console.log("created room: ", roomname);
  _createRoom(roomname);
  // console.log(
  //     "after creating new room, waiting rooms: " +
  //         waitingRooms["Easy"] +
  //         waitingRooms["Medium"] +
  //         waitingRooms["Hard"]
  // );
  return roomname;
}

export async function leaveRoom(roomname) {
  // Update room status
  const room = await _findRoom(roomname);

  //   console.log("leave room: ", room);
  const count = room.count - 1;

  // console.log("count before remove: " + count);
  const roomType = room.roomname.split("-")[0];
  if (count === 1) {
    waitingRooms[roomType].push(room.roomname);
  }
  if (count === 0) {
    const index = waitingRooms[roomType].indexOf(room.roomname);
    if (index > -1) {
      // only splice array when item is found
      waitingRooms[roomType].splice(index, 1);
    }
    // _deleteRoom(roomname);
    emptyRooms[roomType].push(room.roomname);
  }
  _updateRoomCount(roomname, count);
  //   console.log(
  //     "after leave room, waiting rooms: " + waitingRooms["Easy"] + waitingRooms["Medium"] + waitingRooms["Hard"]
  //   );
}
