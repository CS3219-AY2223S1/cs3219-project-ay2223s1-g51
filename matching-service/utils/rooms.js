const rooms = {};
const waitingRooms = {
    Easy: [],
    Medium: [],
    Hard: [],
};

var roomCount = 0;

export function locateRoom(room) {
    var currentRoom = "";
    if (waitingRooms[room].length > 0) {
        currentRoom = waitingRooms[room][0];
        const removedRoom = waitingRooms[room].shift();
        rooms[removedRoom] += 1;
    } else {
        currentRoom = createRoom(room);
    }

    // console.log("room status: " + rooms[currentRoom]);
    // console.log(
    //     "after add user, waiting rooms: " + waitingRooms["Easy"] + waitingRooms["Medium"] + waitingRooms["Hard"]
    // );
    return currentRoom;
}

export function createRoom(room) {
    const newRoom = room + "-" + roomCount;
    waitingRooms[room].push(newRoom);
    roomCount += 1;
    rooms[newRoom] = 1;
    // console.log(
    //     "after creating new room, waiting rooms: " +
    //         waitingRooms["Easy"] +
    //         waitingRooms["Medium"] +
    //         waitingRooms["Hard"]
    // );
    return newRoom;
}

export function leaveRoom(room) {
    // Update room status
    rooms[room] -= 1;
    const count = rooms[room];
    // console.log("count before remove: " + count);
    const roomType = room.split("-")[0];

    if (count === 1) {
        waitingRooms[roomType].push(room);
    }
    if (count === 0) {
        const index = waitingRooms[roomType].indexOf(room);
        if (index > -1) {
            // only splice array when item is found
            waitingRooms[roomType].splice(index, 1);
        }
    }
    // console.log(
    //     "after leave room, waiting rooms: " + waitingRooms["Easy"] + waitingRooms["Medium"] + waitingRooms["Hard"]
    // );
}
