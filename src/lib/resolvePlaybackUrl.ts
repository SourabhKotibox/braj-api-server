/** True when URL is an HLS playlist (may be partial while transcoding). */
export function isHlsUrl(url?: string | null): boolean {
  return !!url && url.includes('.m3u8');
}

/** Fix double-prefixed media URLs like `/uploads/https://spaces...` or `site/uploads/https://...`. */
export function normalizeMediaUrl(url?: string | null): string {
  if (!url) return '';
  let value = String(url).trim();

  if (/example\.com\/playlist\.m3u8/i.test(value)) return '';

  const matches = value.match(/https?:\/\/[^\s"']+/gi);
  if (matches && matches.length > 1) {
    value = matches[matches.length - 1];
  } else if (matches && matches.length === 1 && !value.startsWith('http')) {
    value = matches[0];
  }

  value = value.replace(/^https?:\/\/[^/]+\/uploads\/(https?:\/\/)/i, '$1');
  value = value.replace(/^\/?uploads\/(https?:\/\/)/i, '$1');

  return value;
}

/**
 * Ordered playback candidates: prefer full direct uploads (MP4 etc.) over HLS.
 * HLS is only used when no direct file is available.
 */
export function getVideoPlaybackUrls(video: {
  videoUrl?: string;
  hlsUrl?: string;
  originalVideoUrl?: string;
  videoQualities?: Array<{ quality?: string; url?: string }>;
}): string[] {
  const urls: string[] = [];
  const add = (u?: string | null) => {
    const cleaned = normalizeMediaUrl(u);
    if (!cleaned || urls.includes(cleaned)) return;
    urls.push(cleaned);
  };

  // 1. Original uploaded file (full length)
  if (video.originalVideoUrl && !isHlsUrl(video.originalVideoUrl)) add(video.originalVideoUrl);
  if (video.videoUrl && !isHlsUrl(video.videoUrl)) add(video.videoUrl);

  // 2. Direct (non-HLS) quality entries
  for (const q of video.videoQualities || []) {
    if (q?.url && !isHlsUrl(q.url)) add(q.url);
  }

  // 3. HLS master playlist
  add(video.hlsUrl);

  // 4. HLS quality playlists (720p/1080p first)
  const hlsQualities = (video.videoQualities || []).filter((q) => q?.url && isHlsUrl(q.url));
  for (const quality of ['1080p', '720p', '480p', '360p', '240p', '144p']) {
    const match = hlsQualities.find((q) => q.quality === quality);
    if (match?.url) add(match.url);
  }
  for (const q of hlsQualities) add(q.url);

  // 5. Last resort — videoUrl even if HLS
  add(video.videoUrl);

  return urls;
}

export function getVideoPlaybackUrl(video: Parameters<typeof getVideoPlaybackUrls>[0]): string {
  return getVideoPlaybackUrls(video)[0] || '';
}

export function getAudioPlaybackUrls(audio: {
  audioUrl?: string;
  hlsUrl?: string;
  audioQualities?: Array<{ quality?: string; url?: string }>;
}): string[] {
  const urls: string[] = [];
  const add = (u?: string | null) => {
    const cleaned = normalizeMediaUrl(u);
    if (!cleaned || urls.includes(cleaned)) return;
    urls.push(cleaned);
  };

  if (audio.audioUrl && !isHlsUrl(audio.audioUrl)) add(audio.audioUrl);

  for (const q of audio.audioQualities || []) {
    if (q?.url && !isHlsUrl(q.url)) add(q.url);
  }

  add(audio.hlsUrl);

  for (const quality of ['high', 'medium', 'low', 'lossless']) {
    const match = (audio.audioQualities || []).find((q) => q.quality === quality && q.url);
    if (match?.url) add(match.url);
  }

  for (const q of audio.audioQualities || []) {
    if (q?.url) add(q.url);
  }

  add(audio.audioUrl);
  return urls;
}

export function getAudioPlaybackUrl(audio: Parameters<typeof getAudioPlaybackUrls>[0]): string {
  return getAudioPlaybackUrls(audio)[0] || '';
}
