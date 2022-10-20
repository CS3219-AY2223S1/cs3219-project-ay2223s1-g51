const users = [];
const waitingUsers = {
  Easy: [],
  Medium: [],
  Hard: [],
};

// Join user to chat
export function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);
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
  //   console.log(users.filter((user) => user.room === room));
  return users.filter((user) => user.room === room);
}

// Get current user
export function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// Add waiting user
export function addWaiting(id, username, room) {
  const user = { id, username, room };
  waitingUsers[room].push(user);
  // console.log("current waiting users: " + waitingUsers);
}

// Remove waiting and return waiting user
export function removeWaiting(room) {
  const roomType = room.split("-")[0];
  const user = waitingUsers[roomType].shift();
  // console.log("remove waiting user: " + user);
  return user.username, user.room;
}
