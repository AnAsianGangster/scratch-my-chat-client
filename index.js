require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

// static mock front end
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.CHAT_CLIENT_PORT;

app.listen(PORT, () => {
    console.log(`Chat client server running on ${PORT}`);
});
