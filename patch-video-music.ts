import fs from 'fs';

const controllerFile = './src/controllers/videoMusicController.ts';
let code = fs.readFileSync(controllerFile, 'utf8');

if (!code.includes('MediaFileModel')) {
  code = `import { MediaFileModel } from '../models/MediaFile';\nimport { transcodeToHls } from '../lib/hlsTranscoder';\n` + code;
}

const syncFunction = `
async function syncHlsFromMediaFile(videoData: Record<string, any>) {
  if (!videoData.videoUrl) return;

  const cleanUrl = videoData.videoUrl.replace(/^\\/+/, '');
  let mediaFile = await MediaFileModel.findOne({
    $or: [
      { url: videoData.videoUrl },
      { filePath: videoData.videoUrl },
      { filePath: '/' + cleanUrl },
      { url: { $regex: new RegExp(cleanUrl.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&') + '$') } }
    ]
  }).lean();

  if (mediaFile) {
    if (mediaFile.isHls && mediaFile.hlsMasterPlaylistUrl) {
      videoData.hlsUrl = mediaFile.hlsMasterPlaylistUrl;
      videoData.processingStatus = 'ready';
    } else if (mediaFile.hlsStatus === 'processing' || mediaFile.hlsStatus === 'pending') {
      videoData.processingStatus = 'processing';
    } else if (mediaFile.hlsStatus === 'failed') {
      videoData.processingStatus = 'failed';
    }

    if (mediaFile.hlsQualities && mediaFile.hlsQualities.length > 0) {
      videoData.videoQualities = mediaFile.hlsQualities.map((q: any) => ({
        quality: q.quality,
        url: q.url || q.filePath,
        size: 0
      }));
    }
    
    if (mediaFile.duration && !videoData.duration) {
      videoData.duration = mediaFile.duration;
    }
  } else {
    // If no media file is found and it's a local upload, we can create a MediaFile and trigger HLS
    const isRawLocalVideo = videoData.videoUrl && !videoData.videoUrl.startsWith('http://') && !videoData.videoUrl.startsWith('https://');
    if (isRawLocalVideo) {
      try {
        const newMedia = await MediaFileModel.create({
           name: videoData.videoUrl.split('/').pop() || 'Video',
           url: videoData.videoUrl,
           filePath: videoData.videoUrl,
           fileSize: 0,
           fileType: 'video/mp4',
           source: 'video-music',
           storageType: 'local'
        });
        transcodeToHls(newMedia._id.toString(), videoData.videoUrl, videoData.videoUrl).catch(console.error);
        videoData.processingStatus = 'processing';
      } catch (err) {
        console.error('Failed to trigger HLS on add', err);
      }
    }
  }
}
`;

if (!code.includes('syncHlsFromMediaFile')) {
  code = code.replace('export const getAllVideoMusics', syncFunction + '\nexport const getAllVideoMusics');
}

// update createVideoMusic
code = code.replace(
  /const isRawLocalVideo =.*?(?=if \(\(\!videoData\.videoQualities)/s,
  `await syncHlsFromMediaFile(videoData);

    const isRawLocalVideo = videoData.videoUrl && !videoData.videoUrl.startsWith('http://') && !videoData.videoUrl.startsWith('https://');

    if (!videoData.processingStatus) {
      if (isRawLocalVideo) {
        videoData.processingStatus = 'queued';
      } else {
        videoData.processingStatus = 'ready';
      }
    }

    `
);

// update updateVideoMusic
code = code.replace(
  /if \(update\.\$set\) sanitizeVideoMediaFields\(update\.\$set\);/g,
  `if (update.$set) {
      sanitizeVideoMediaFields(update.$set);
      await syncHlsFromMediaFile(update.$set);
    }`
);

fs.writeFileSync(controllerFile, code);
