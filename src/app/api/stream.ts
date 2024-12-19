// import { NextApiRequest, NextApiResponse } from 'next';
// import ffmpeg from 'fluent-ffmpeg';

// // This is your RTSP source URL (replace it with your RTSP stream URL)
// const rtspUrl = 'rtsp://192.168.51.82:8554/mjpeg/1';

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   res.setHeader('Content-Type', 'application/x-mpegURL');
//   res.setHeader('Cache-Control', 'no-store');

//   // Start the FFmpeg process to convert RTSP to HLS
//   ffmpeg(rtspUrl)
//     .addOptions([
//       '-c:v libx264',   // Video codec
//       '-preset fast',    // Encoding preset
//       '-f hls',          // Output format
//       '-hls_time 10',     // Segment duration (10 seconds)
//       '-hls_list_size 0', // Keep all segments
//       '-hls_flags delete_segments', // Delete old segments
//     ])
//     .output(res) // Stream the output to the client
//     .on('start', (commandLine) => {
//       console.log('FFmpeg process started:', commandLine);
//     })
//     .on('end', () => {
//       console.log('Stream finished.');
//     })
//     .on('error', (err: Error) => {
//       console.error('FFmpeg error:', err);
//       res.status(500).send('Error processing the stream');
//     })
//     .run();
// }
