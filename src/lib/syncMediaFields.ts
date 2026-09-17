import { MediaFileModel } from '../models/MediaFile';
import { transcodeToHls } from './hlsTranscoder';

export async function syncHlsFromMediaFile(videoData: Record<string, any>, urlField: string = 'videoUrl', sourceName: string = 'video') {
  const url = videoData[urlField];
  if (!url) return;

  const cleanUrl = url.replace(/^\/+/, '');
  let mediaFile = await MediaFileModel.findOne({
    $or: [
      { url: url },
      { filePath: url },
      { filePath: '/' + cleanUrl },
      { url: { $regex: new RegExp(cleanUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$') } }
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
      const field = urlField === 'audioUrl' ? 'audioQualities' : 'videoQualities';
      videoData[field] = mediaFile.hlsQualities.map((q: any) => ({
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
    const isRawLocal = url && !url.startsWith('http://') && !url.startsWith('https://');
    if (isRawLocal) {
      try {
        const fileType = urlField === 'audioUrl' ? 'audio/mp3' : 'video/mp4';
        const newMedia = await MediaFileModel.create({
           name: url.split('/').pop() || sourceName,
           url: url,
           filePath: url,
           fileSize: 0,
           fileType: fileType,
           source: sourceName,
           storageType: 'local'
        });
        if (urlField !== 'audioUrl') {
          transcodeToHls(newMedia._id.toString(), url, url).catch(console.error);
          videoData.processingStatus = 'processing';
        }
      } catch (err) {
        console.error('Failed to trigger HLS on add', err);
      }
    }
  }
}
