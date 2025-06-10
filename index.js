const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
require('dotenv').config()

const HLS_DIR = path.join(__dirname, 'stream');

// Create stream folder if it doesn't exist
if (!fs.existsSync(HLS_DIR)) {
    fs.mkdirSync(HLS_DIR);
}

function startFFmpeg() {
    const ffmpegArgs = [
        '-re',
        '-i', process.env.VIDEO_PATH,
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-f', 'hls',
        '-hls_time', '4',
        '-hls_list_size', '5',
        '-hls_flags', 'delete_segments',
        path.join(HLS_DIR, 'stream.m3u8'),
    ];

    const ffmpeg = spawn('ffmpeg', ffmpegArgs);

    ffmpeg.stdout.on('data', (data) => {
        console.log(`FFmpeg stdout: ${data}`);
    });

    ffmpeg.stderr.on('data', (data) => {
        console.error(`FFmpeg stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        console.log(`FFmpeg exited with code ${code}`);
    });

    console.log('FFmpeg started...');
}

startFFmpeg();

// Serve HLS files from /stream folder
app.use(cors());
app.use('/stream', express.static(path.join(__dirname, 'stream')));

app.listen(process.env.PORT, () => {
    console.log(`HLS server running at http://localhost:${process.env.PORT}/stream/stream.m3u8`);
});
