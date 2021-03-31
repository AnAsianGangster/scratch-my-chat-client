const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

// get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// set up script will use sed to replace these to ip or domain
const CHAT_SERVER_IP = 'CHAT_SERVER_IP_PLACEHOLDER';
const socket = io(CHAT_SERVER_IP);

console.log(username, room);
socket.emit('joinRoom', { username, room });

// get room and users
socket.on('roomUsers', ({ room, users }) => {
    roomNameGenerator(room);
    usersListGenerator(users);
});

// handle --> message <-- from server
socket.on('message', (message) => {
    console.log(message);
    messageCardGenerator(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message to socket
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = event.target.elements.msg.value;

    console.log(message);

    // emit message to server
    socket.emit('chatMessage', message);

    // clear input
    event.target.elements.msg.value = '';
    event.target.elements.msg.focus();
});

// add message card to dom
function messageCardGenerator(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.content}
        </p>
    `;

    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to dom
function roomNameGenerator(room) {
    roomName.innerText = room;
}

// add usersList to dom
function usersListGenerator(users) {
    usersList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join('')}
    `;
}
