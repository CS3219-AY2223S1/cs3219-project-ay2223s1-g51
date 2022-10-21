import {
  ormCreateRoom as _createRoom,
  ormDeleteRoom as _deleteRoom,
  ormGetWaitingRooms as _getWaitingRooms,
  ormGetEmptyRooms as _getEmptyRooms,
  ormGetRoomCount as _getRoomCount,
  ormFindRoom as _findRoom,
  ormUpdateRoomCount as _updateRoomCount,
  ormRemoveRoomUser as _removeRoomUser,
  ormAddRoomUser as _addRoomUser,
  ormGetUsers as _getUsers,
} from "../model/room-orm.js";

let waitingRooms = await _getWaitingRooms({
  Easy: [],
  Medium: [],
  Hard: [],
});

let emptyRooms = await _getEmptyRooms({
  Easy: [],
  Medium: [],
  Hard: [],
});

// users = [];

let users = await _getUsers([]);

// console.log("initialized waiting room: ", waitingRooms);
// console.log("initialized empty room: ", emptyRooms);

let easyRoomCount = await _getRoomCount("Easy"),
  mediumRoomCount = await _getRoomCount("Medium"),
  hardRoomCount = await _getRoomCount("Hard");

async function updateRoomCount(room, v) {
  const r = await _findRoom(room);
  const count = r.count + v;

  console.log("update roomname, count: " + room + ", " + count);

  _updateRoomCount(room, count);
}

export function locateRoom(roomType) {
  let currentRoom = "";
  //   console.log("current waiting room: ", waitingRooms);
  //   console.log("current empty room: ", emptyRooms);

  if (waitingRooms[roomType].length > 0) {
    currentRoom = waitingRooms[roomType][0];
    // console.log("Theres already a waiting room: ", currentRoom);
    const removedRoom = waitingRooms[roomType].shift();
  } else if (emptyRooms[roomType].length > 0) {
    currentRoom = emptyRooms[roomType][0];
    // console.log("Theres already a empty room: ", currentRoom);
    const removedRoom = emptyRooms[roomType].shift();
    waitingRooms[roomType].push(removedRoom);
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
  let roomname = "";
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

export async function leaveRoom(username, roomname) {
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
  _removeRoomUser(roomname, username);
  //   console.log(
  //     "after leave room, waiting rooms: " + waitingRooms["Easy"] + waitingRooms["Medium"] + waitingRooms["Hard"]
  //   );
}

// Join user to chat
export function userJoin(id, username, room) {
  const user = { id, username, room };
  _addRoomUser(room, username);
  users.push(user);
  console.log("userlist: " + users);
  return user;
}

// User leaves chat
export function userLeave(id) {
  const index = users.findIndex((user) => user.id == id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
export function getRoomUsers(room) {
  // console.log(users.filter((user) => user.room === room));
  return users.filter((user) => user.room === room);
}

// Get current user by username
export function getCurrentUserByName(username) {
  console.log(`retrieving user list: ${username}`);
  return users.find((user) => user.username === username);
}

// Get current user by id
export function getCurrentUserById(id) {
  // console.log(users);
  return users.find((user) => user.id === id);
}

// Get update user id
export function updateUserId(username, id) {
  users.forEach((user) => {
    if (user.username === username) {
      user.id = id;
      return true;
    }
  });
}
