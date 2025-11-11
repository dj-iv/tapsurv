const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const inputPath = path.resolve(__dirname, '..', 'images', 'SurveyVideo.mp4');
const outputMp4 = path.resolve(__dirname, '..', 'images', 'SurveyVideo-small.mp4');
const outputMobile = path.resolve(__dirname, '..', 'images', 'SurveyVideo-mobile.mp4');
const outputWebm = path.resolve(__dirname, '..', 'images', 'SurveyVideo-small.webm');

if (!fs.existsSync(inputPath)) {
  console.error('Input file does not exist:', inputPath);
  process.exit(1);
}

console.log('Compressing video (desktop) to', outputMp4);
ffmpeg(inputPath)
  .outputOptions(['-c:v libx264', '-crf 28', '-preset medium', '-movflags +faststart', '-c:a aac', '-b:a 96k'])
  .size('?x720')
  .save(outputMp4)
  .on('end', () => {
    console.log('Desktop MP4 compressed. Now creating mobile version...');
    ffmpeg(inputPath)
      .outputOptions(['-c:v libx264', '-crf 30', '-preset fast', '-movflags +faststart', '-c:a aac', '-b:a 64k'])
      .size('640x?')
      .save(outputMobile)
      .on('end', () => {
        console.log('Mobile MP4 compressed. Now creating webm version...');
        ffmpeg(inputPath)
          .outputOptions(['-c:v libvpx-vp9', '-b:v 0', '-crf 35', '-deadline good', '-c:a libopus', '-b:a 64k'])
          .size('?x720')
          .save(outputWebm)
          .on('end', () => {
            console.log('WebM compressed. All done.');
          })
          .on('error', (err) => console.error('Error creating webm:', err));
      })
      .on('error', (err) => console.error('Error creating mobile mp4:', err));
  })
  .on('error', (err) => console.error('Error creating desktop mp4:', err));
