import fs from 'fs';
import path from 'path';

export const streamVideo = (req, res) => {
  const filename = req.params.filename;
  const videoPath = path.resolve('assets', filename);

  fs.stat(videoPath, (err, stat) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).send('Video not found');
      }
      console.error('Error getting video file stats:', err);
      return res.status(500).send('Internal Server Error');
    }

    const fileSize = stat.size;
    const range = req.headers.range;

    // Set caching headers
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  });
};