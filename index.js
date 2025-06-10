// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
require('dotenv').config()

// Serve HLS files from /stream folder
app.use(cors());
app.use('/stream', express.static(path.join(__dirname, 'stream')));

app.listen(process.env.PORT, () => {
  console.log(`HLS server running at http://localhost:${process.env.PORT}/stream/stream.m3u8`);
});
