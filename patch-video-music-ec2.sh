#!/bin/bash

CONTROLLER_FILE="src/controllers/videoMusicController.ts"
if [ ! -f "$CONTROLLER_FILE" ]; then
  echo "File not found: $CONTROLLER_FILE"
  exit 1
fi

if grep -q "syncHlsFromMediaFile" "$CONTROLLER_FILE"; then
  echo "Already patched!"
  exit 0
fi

# We use perl for safe multi-line replacement on EC2 Amazon Linux
perl -i -pe 's/export const getAllVideoMusics/import { MediaFileModel } from "..\/models\/MediaFile";\nimport { transcodeToHls } from "..\/lib\/hlsTranscoder";\n\nasync function syncHlsFromMediaFile(videoData: Record<string, any>) {\n  if (!videoData.videoUrl) return;\n  const cleanUrl = videoData.videoUrl.replace(\/^\/+\/, "");\n  let mediaFile = await MediaFileModel.findOne({ \$or: [ { url: videoData.videoUrl }, { filePath: videoData.videoUrl }, { filePath: "\/" + cleanUrl }, { url: { \$regex: new RegExp(cleanUrl.replace(\/[-\/\\\\^$*+?.()|[\\]{}]\/g, "\\\\$&") + "\$") } } ] }).lean();\n  if (mediaFile) {\n    if (mediaFile.isHls && mediaFile.hlsMasterPlaylistUrl) {\n      videoData.hlsUrl = mediaFile.hlsMasterPlaylistUrl;\n      videoData.processingStatus = "ready";\n    } else if (mediaFile.hlsStatus === "processing" || mediaFile.hlsStatus === "pending") {\n      videoData.processingStatus = "processing";\n    } else if (mediaFile.hlsStatus === "failed") {\n      videoData.processingStatus = "failed";\n    }\n    if (mediaFile.hlsQualities && mediaFile.hlsQualities.length > 0) {\n      videoData.videoQualities = mediaFile.hlsQualities.map((q: any) => ({ quality: q.quality, url: q.url || q.filePath, size: 0 }));\n    }\n    if (mediaFile.duration && !videoData.duration) videoData.duration = mediaFile.duration;\n  } else {\n    const isRawLocalVideo = videoData.videoUrl && !videoData.videoUrl.startsWith("http:\/\/") && !videoData.videoUrl.startsWith("https:\/\/");\n    if (isRawLocalVideo) {\n      try {\n        const newMedia = await MediaFileModel.create({ name: videoData.videoUrl.split("\/").pop() || "Video", url: videoData.videoUrl, filePath: videoData.videoUrl, fileSize: 0, fileType: "video\/mp4", source: "video-music", storageType: "local" });\n        transcodeToHls(newMedia._id.toString(), videoData.videoUrl, videoData.videoUrl).catch(console.error);\n        videoData.processingStatus = "processing";\n      } catch (err) { console.error("Failed HLS trigger", err); }\n    }\n  }\n}\n\nexport const getAllVideoMusics/g' $CONTROLLER_FILE

perl -0777 -i -pe 's/(const isRawLocalVideo =.*?(?=if \(\(!videoData\.videoQualities)))/await syncHlsFromMediaFile(videoData);\n\n    $1/s' $CONTROLLER_FILE

perl -i -pe 's/if \(update\.\$set\) sanitizeVideoMediaFields\(update\.\$set\);/if (update.\$set) {\n      sanitizeVideoMediaFields(update.\$set);\n      await syncHlsFromMediaFile(update.\$set);\n    }/g' $CONTROLLER_FILE

echo "Patched successfully"
