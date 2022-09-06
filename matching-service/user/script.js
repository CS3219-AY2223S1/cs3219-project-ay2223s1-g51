const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
    setTimeout(() => {
        const leaveRoom = confirm("Sorry! Connection timed out. Leave the chatroom?");
        if (leaveRoom) {
            window.location = "../index.html";
        }
    }, 30000);
});

// Message submit
chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Get message text
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    // Emit message to server
    socket.emit("chatMessage", msg);

    // Clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

// Get message from server
socket.on("message", (message) => {
    console.log(message);
    displayMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Output message to DOM
function displayMessage(message) {
    console.log(message);
    const div = document.createElement("div");
    div.classList.add("message");
    const p = document.createElement("p");
    p.classList.add("meta");
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement("p");
    para.classList.add("text");
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = "";
    console.log(users);
    users.forEach((user) => {
        console.log(user.username);
        const li = document.createElement("li");
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
    const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
    if (leaveRoom) {
        window.location = "../index.html";
    } else {
    }
});
