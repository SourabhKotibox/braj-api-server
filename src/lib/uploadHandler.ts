import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import type { FastifyRequest } from 'fastify';
import { MediaFileModel } from '../models/MediaFile';
import { MediaFolderModel } from '../models/MediaFolder';
import { Types } from 'mongoose';
import { transcodeToHls } from './hlsTranscoder';
import { logger } from './logger';
import { isS3Configured, uploadToS3, deleteFromS3, getS3Settings, normalizeObjectKey } from './s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_ROOT = path.join(__dirname, '../../uploads');

export const UPLOAD_TYPES = {
  IMAGE: {
    name: 'image',
    allowedExts: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'],
    defaultDir: ''
  },
  VIDEO: {
    name: 'video',
    allowedExts: ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv'],
    defaultDir: 'videos'
  },
  AUDIO: {
    name: 'audio',
    allowedExts: ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma'],
    defaultDir: 'audio'
  },
  VIDEO_MUSIC: {
    name: 'video-music',
    allowedExts: ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv'],
    defaultDir: 'video-music'
  },
  DOCUMENT: {
    name: 'document',
    allowedExts: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
    defaultDir: 'documents'
  },
  CATEGORY_THUMBNAIL: {
    name: 'category-thumbnail',
    allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
    defaultDir: 'categories'
  },
  CATEGORY_BANNER: {
    name: 'category-banner',
    allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
    defaultDir: 'categories'
  },
  CATEGORY_ICON: {
    name: 'category-icon',
    allowedExts: ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
    defaultDir: 'categories'
  },
  GENRE: {
    name: 'genre',
    allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
    defaultDir: 'genres'
  },
  ACTOR: {
    name: 'actor',
    allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
    defaultDir: 'actors'
  },
  DIRECTOR: {
    name: 'director',
    allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
    defaultDir: 'directors'
  },
  LANGUAGE: {
    name: 'language',
    allowedExts: ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
    defaultDir: 'languages'
  },
  MEDIA_LIBRARY: {
    name: 'media-library',
    allowedExts: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm', '.mov', '.mkv', '.avi', '.flv', '.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'],
    defaultDir: 'media'
  },
  BANNER: {
    name: 'banner',
    allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
    defaultDir: 'banners'
  },
  PROMOTION: {
    name: 'promotion',
    allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
    defaultDir: 'promotions'
  },
  ALBUM: {
    name: 'album',
    allowedExts: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    defaultDir: 'albums'
  },
  ARTIST: {
    name: 'artist',
    allowedExts: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    defaultDir: 'artists'
  }
} as const;

export type UploadType = keyof typeof UPLOAD_TYPES;

export interface UploadedFileInfo {
  originalName: string;
  fileName: string;
  filePath: string;
  url: string;
  fileSize: number;
  mimeType: string;
  uploadType: UploadType;
  storageType?: 'local' | 's3' | 'spaces';
  s3Key?: string;
}

export const ensureUploadDir = (dirPath: string) => {
  const fullPath = path.join(UPLOADS_ROOT, dirPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  return fullPath;
};

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const ext = path.extname(originalName).toLowerCase();
  const baseName = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${timestamp}-${randomString}${baseName ? `-${baseName}` : ''}${ext}`;
};

export const validateFileType = (fileName: string, uploadType: UploadType): boolean => {
  const typeConfig = UPLOAD_TYPES[uploadType];
  const ext = path.extname(fileName).toLowerCase();
  return (typeConfig.allowedExts as readonly string[]).includes(ext);
};

// Helper to check if a file is a video based on file extension or mimetype
const isVideoFile = (fileName: string, mimeType: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.m4v', '.mpeg', '.mpg'];
  const ext = path.extname(fileName).toLowerCase();
  return videoExtensions.includes(ext) || mimeType.startsWith('video/');
};

type SaveFileOptions = {
  trackInMediaLibrary?: boolean;
  source?: string;
  sourceId?: string;
  folderId?: string;
  contentName?: string;
  contentType?: string;
};

const savePartDirectToSpaces = async (
  part: any,
  uploadType: UploadType,
  fileName: string,
  targetDir: string,
  resolvedFolderId: string | undefined,
  options?: SaveFileOptions
): Promise<UploadedFileInfo> => {
  const mimeType = part.mimetype || 'application/octet-stream';
  const prefix = (targetDir || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  const s3Key = `${prefix ? `${prefix}/` : ''}${fileName}`;
  const spacesUrl = await uploadToS3(s3Key, part.file, mimeType);
  const fileSize = Number(part.file?.bytesRead || 0);
  const storageType = (await getS3Settings()).isSpaces ? 'spaces' : 's3';

  const fileInfo: UploadedFileInfo = {
    originalName: part.filename,
    fileName,
    filePath: spacesUrl,
    url: spacesUrl,
    fileSize,
    mimeType,
    uploadType,
    storageType,
    s3Key,
  };

  if (options?.trackInMediaLibrary !== false) {
    try {
      const mediaFile = await MediaFileModel.create({
        name: part.filename,
        url: spacesUrl,
        filePath: spacesUrl,
        fileSize,
        fileType: mimeType,
        folder: resolvedFolderId ? new Types.ObjectId(resolvedFolderId) : undefined,
        source: options?.source || uploadType.toLowerCase(),
        sourceId: options?.sourceId ? new Types.ObjectId(options.sourceId) : undefined,
        contentName: options?.contentName,
        contentType: options?.contentType,
        storageType,
        s3Key,
      });

      if (isVideoFile(part.filename, mimeType)) {
        transcodeToHls(mediaFile._id.toString(), spacesUrl, spacesUrl).catch((err) => {
          logger.error({ err, mediaFileId: mediaFile._id }, 'Failed to transcode video to HLS (Spaces)');
        });
      }
    } catch (error) {
      console.error('Failed to track file in media library:', error);
    }
  }

  return fileInfo;
};

export const saveFileFromPart = async (
  part: any,
  request: FastifyRequest,
  uploadType: UploadType,
  customDir?: string,
  options?: {
    trackInMediaLibrary?: boolean;
    source?: string;
    sourceId?: string;
    folderId?: string;
    contentName?: string;
    contentType?: string;
  }
): Promise<UploadedFileInfo> => {
  const typeConfig = UPLOAD_TYPES[uploadType];
  if (!typeConfig) {
    throw new Error(`Unknown upload type: ${String(uploadType)}`);
  }
  const targetDir = customDir || typeConfig.defaultDir;

  if (!validateFileType(part.filename, uploadType)) {
    throw new Error(
      `Invalid file type for ${typeConfig.name}. Allowed types: ${typeConfig.allowedExts.join(', ')}`
    );
  }

  // Auto-resolve folder ID if not provided
  let resolvedFolderId = options?.folderId;
  if (!resolvedFolderId && typeConfig.defaultDir) {
    try {
      const folderMatch = await MediaFolderModel.findOne({ name: { $regex: new RegExp(`^${typeConfig.defaultDir}$`, 'i') } });
      if (folderMatch) {
        resolvedFolderId = folderMatch._id.toString();
      }
    } catch (error) {
      console.error('Error resolving folder ID:', error);
    }
  }

  const fileName = generateUniqueFileName(part.filename);
  if (await isS3Configured()) {
    return savePartDirectToSpaces(part, uploadType, fileName, targetDir, resolvedFolderId, options);
  }

  ensureUploadDir(targetDir);
  const relativeFilePath = path.join(targetDir, fileName);
  const fullFilePath = path.join(UPLOADS_ROOT, relativeFilePath);

  return new Promise(async (resolve, reject) => {
    const writeStream = fs.createWriteStream(fullFilePath);
    part.file.pipe(writeStream);

    writeStream.on('finish', async () => {
      const stats = fs.statSync(fullFilePath);

      const computeFileHash = (filePath: string): Promise<string> => {
        return new Promise((res, rej) => {
          const h = crypto.createHash('sha256');
          const stream = fs.createReadStream(filePath);
          stream.on('data', (chunk) => h.update(chunk));
          stream.on('end', () => res(h.digest('hex')));
          stream.on('error', (err) => rej(err));
        });
      };

      const contentHash = await computeFileHash(fullFilePath).catch(() => '');

      const existingFile = await MediaFileModel.findOne({
        $or: [
          { contentHash },
          { name: part.filename, fileSize: stats.size }
        ]
      });

      if (existingFile) {
        fs.unlinkSync(fullFilePath);

        let needsUpdate = false;
        if (!existingFile.contentHash && contentHash) {
          existingFile.contentHash = contentHash;
          needsUpdate = true;
        }
        if (options?.contentName && !existingFile.contentName) {
          existingFile.contentName = options.contentName;
          needsUpdate = true;
        }
        if (options?.contentType && !existingFile.contentType) {
          existingFile.contentType = options.contentType;
          needsUpdate = true;
        }
        if (needsUpdate) {
          await existingFile.save().catch(err => console.error("Error updating existing local file metadata:", err));
        }

        return resolve({
          originalName: existingFile.name,
          fileName: path.basename(existingFile.filePath || existingFile.url),
          filePath: existingFile.filePath || existingFile.url,
          url: existingFile.url,
          fileSize: existingFile.fileSize,
          mimeType: existingFile.fileType,
          uploadType,
          storageType: existingFile.storageType as 'local' | 's3' | 'spaces',
          s3Key: existingFile.s3Key,
        });
      }

      const protocol = request.protocol;
      const host = request.headers.host;
      const baseUrl = `${protocol}://${host}`;

      const fileInfo: UploadedFileInfo = {
        originalName: part.filename,
        fileName,
        filePath: `/uploads/${relativeFilePath.replace(/\\/g, '/')}`,
        url: `${baseUrl}/uploads/${relativeFilePath.replace(/\\/g, '/')}`,
        fileSize: stats.size,
        mimeType: part.mimetype || 'application/octet-stream',
        uploadType,
        storageType: 'local'
      };

      // Local-only fallback. Spaces uploads are handled before this write stream.

      if (options?.trackInMediaLibrary !== false) {
        try {
          const mediaFile = await MediaFileModel.create({
            name: part.filename,
            url: fileInfo.url,
            filePath: fileInfo.filePath,
            fileSize: stats.size,
            fileType: part.mimetype || 'application/octet-stream',
            folder: resolvedFolderId ? new Types.ObjectId(resolvedFolderId) : undefined,
            source: options?.source || uploadType.toLowerCase(),
            sourceId: options?.sourceId ? new Types.ObjectId(options.sourceId) : undefined,
            contentHash,
            contentName: options?.contentName,
            contentType: options?.contentType,
            storageType: fileInfo.storageType
          });

          if (isVideoFile(part.filename, part.mimetype || '')) {
            transcodeToHls(mediaFile._id.toString(), fullFilePath, baseUrl).catch(err => {
              logger.error({ err, mediaFileId: mediaFile._id }, 'Failed to transcode video to HLS (local)');
            });
          }
        } catch (error) {
          console.error('Failed to track file in media library:', error);
        }
      }

      resolve(fileInfo);
    });

    writeStream.on('error', reject);
  });
};

export const deleteUploadedFile = async (relativeFilePath: string, storageType?: 'local' | 's3' | 'spaces') => {
  if (!relativeFilePath) return;

  if (
    relativeFilePath.startsWith('http://') ||
    relativeFilePath.startsWith('https://') ||
    storageType === 's3' ||
    storageType === 'spaces'
  ) {
    try {
      const s3Settings = await getS3Settings();
      await deleteFromS3(normalizeObjectKey(relativeFilePath, s3Settings.bucket));
      return;
    } catch (err) {
      logger.error(err, 'Failed to delete file from S3/Spaces');
      return;
    }
  }

  const fullPath = path.join(UPLOADS_ROOT, relativeFilePath.replace(/^\/*uploads\//, '').replace(/^\/+/, ''));
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default {
  UPLOAD_TYPES,
  ensureUploadDir,
  generateUniqueFileName,
  validateFileType,
  saveFileFromPart,
  deleteUploadedFile,
  formatFileSize
};
