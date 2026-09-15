import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, PutBucketCorsCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from './logger';
import { SettingsModel } from '../models/Settings';

export type UploadBody = Buffer | Uint8Array | string | Readable | fs.ReadStream;

const trimSlash = (value?: string | null) => (value || '').replace(/\/+$/, '');

export function normalizeDoRegion(region?: string | null): string {
  const raw = (region || process.env.DO_SPACES_REGION || 'nyc3').trim().toLowerCase();
  return raw.replace(/[^a-z0-9]/g, '') || 'nyc3';
}

/** Spaces API host is always https://{region}.digitaloceanspaces.com — never the CDN or bucket host. */
export function getSpacesApiEndpoint(region?: string | null): string {
  return `https://${normalizeDoRegion(region)}.digitaloceanspaces.com`;
}

export interface S3Settings {
  isSpaces: boolean;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  cdnUrl: string;
  pathStyle: boolean;
  storageDriver: string;
  endpoint?: string;
}

export async function getS3Settings(): Promise<S3Settings> {
  const settings = await SettingsModel.findOne().lean();
  const accessKey = String(settings?.doSpacesAccessKey || process.env.DO_SPACES_ACCESS_KEY || '').trim();
  const secretKey = String(settings?.doSpacesSecretKey || process.env.DO_SPACES_SECRET_KEY || '').trim();
  const bucket = String(settings?.doSpacesBucket || process.env.DO_SPACES_BUCKET || '').trim();
  const hasSpacesCreds = !!(accessKey && secretKey && bucket);
  const envDriver = String(process.env.STORAGE_DRIVER || '').toLowerCase();
  const wantSpaces =
    settings?.storageDriver === 'spaces' ||
    settings?.doSpacesEnabled === true ||
    envDriver === 'spaces' ||
    hasSpacesCreds;

  const region = wantSpaces
    ? normalizeDoRegion(settings?.doSpacesRegion || process.env.DO_SPACES_REGION)
    : (settings?.awsRegion || process.env.AWS_S3_REGION || process.env.AWS_REGION || 'us-east-1');

  return {
    isSpaces: wantSpaces && hasSpacesCreds,
    accessKeyId: wantSpaces
      ? accessKey
      : (settings?.awsAccessKeyId || process.env.AWS_S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || ''),
    secretAccessKey: wantSpaces
      ? secretKey
      : (settings?.awsSecretAccessKey || process.env.AWS_S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || ''),
    region,
    bucket: wantSpaces
      ? bucket
      : (settings?.awsBucket || process.env.AWS_S3_BUCKET_NAME || process.env.AWS_BUCKET_NAME || ''),
    cdnUrl: trimSlash(settings?.doSpacesCdnUrl || process.env.DO_SPACES_CDN_URL || ''),
    pathStyle: wantSpaces ? false : !!(settings?.awsPathStyleEndpoint),
    storageDriver: wantSpaces && hasSpacesCreds ? 'spaces' : (settings?.storageDriver || 'local'),
    endpoint: wantSpaces ? getSpacesApiEndpoint(region) : undefined,
  };
}

export async function getS3Client() {
  const settings = await getS3Settings();
  return new S3Client({
    region: settings.isSpaces ? 'us-east-1' : settings.region,
    credentials: {
      accessKeyId: settings.accessKeyId,
      secretAccessKey: settings.secretAccessKey,
    },
    ...(settings.endpoint ? { endpoint: settings.endpoint } : {}),
    forcePathStyle: settings.pathStyle,
    // AWS SDK v3 checksum headers cause AccessDenied on DigitalOcean Spaces.
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  } as any);
}

export interface PresignedUrlResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

export function getPublicUrlBase(settings: S3Settings): string {
  if (settings.isSpaces && settings.cdnUrl) {
    return trimSlash(settings.cdnUrl);
  }
  if (settings.isSpaces) {
    const region = normalizeDoRegion(settings.region);
    if (settings.pathStyle) {
      return `https://${region}.digitaloceanspaces.com/${settings.bucket}`;
    }
    return `https://${settings.bucket}.${region}.digitaloceanspaces.com`;
  }
  if (settings.pathStyle) {
    return `https://s3.${settings.region}.amazonaws.com/${settings.bucket}`;
  }
  return `https://${settings.bucket}.s3.${settings.region}.amazonaws.com`;
}

export function normalizeObjectKey(key: string, bucket?: string): string {
  let normalized = (key || '').trim();
  if (!normalized) return '';

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    try {
      normalized = decodeURIComponent(new URL(normalized).pathname);
    } catch {
      return key;
    }
  }

  normalized = normalized.replace(/^\/+/, '').replace(/^uploads\//, '');
  if (bucket && normalized.startsWith(`${bucket}/`)) {
    normalized = normalized.slice(bucket.length + 1);
  }
  return normalized;
}

function objectPublicUrl(settings: S3Settings, key: string): string {
  if (key.startsWith('http://') || key.startsWith('https://')) return key;
  const cleanKey = normalizeObjectKey(key, settings.bucket);
  return `${getPublicUrlBase(settings)}/${cleanKey}`;
}

export async function generatePresignedUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<PresignedUrlResult> {
  const settings = await getS3Settings();

  if (!await isS3Configured()) {
    logger.warn('S3/Spaces credentials not found or not selected, returning mock URL');
    return {
      uploadUrl: `https://mock-storage.local/upload/${key}?token=dev-placeholder`,
      publicUrl: `https://mock-storage.local/${key}`,
      key,
    };
  }

  try {
    const s3Client = await getS3Client();
    const command = new PutObjectCommand({
      Bucket: settings.bucket,
      Key: normalizeObjectKey(key, settings.bucket),
      ContentType: contentType,
      ACL: 'public-read',
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return {
      uploadUrl,
      publicUrl: objectPublicUrl(settings, key),
      key,
    };
  } catch (error) {
    logger.error(error, 'Error generating presigned URL');
    throw error;
  }
}

export async function uploadToS3(
  key: string,
  body: UploadBody,
  contentType: string,
  cacheControl?: string
): Promise<string> {
  const settings = await getS3Settings();

  if (!await isS3Configured()) {
    logger.warn('S3/Spaces credentials not found or not selected, skipping upload');
    throw new Error('DigitalOcean Spaces is not configured');
  }

  const objectKey = normalizeObjectKey(key, settings.bucket);

  try {
    const s3Client = await getS3Client();
    const parallelUpload = new Upload({
      client: s3Client,
      params: {
        Bucket: settings.bucket,
        Key: objectKey,
        Body: body,
        ContentType: contentType,
        ACL: 'public-read',
        ...(cacheControl ? { CacheControl: cacheControl } : {}),
      },
      queueSize: 4,
      partSize: 16 * 1024 * 1024,
      leavePartsOnError: false,
    });

    await parallelUpload.done();
    return objectPublicUrl(settings, objectKey);
  } catch (error) {
    logger.error(error, 'Error uploading to S3/Spaces');
    throw error;
  }
}

export async function deleteFromS3(key: string): Promise<void> {
  const settings = await getS3Settings();

  if (!await isS3Configured()) {
    logger.warn('S3/Spaces credentials not found or not selected, skipping delete');
    return;
  }

  try {
    const s3Client = await getS3Client();
    await s3Client.send(new DeleteObjectCommand({
      Bucket: settings.bucket,
      Key: normalizeObjectKey(key, settings.bucket),
    }));
  } catch (error) {
    logger.error(error, 'Error deleting from S3/Spaces');
    throw error;
  }
}

export async function isS3Configured(): Promise<boolean> {
  const settings = await getS3Settings();
  return !!(
    settings.accessKeyId &&
    settings.secretAccessKey &&
    settings.bucket &&
    (settings.storageDriver === 's3' || settings.storageDriver === 'spaces' || settings.isSpaces)
  );
}

export async function getS3PublicUrl(key: string): Promise<string> {
  const settings = await getS3Settings();
  return objectPublicUrl(settings, key);
}

export async function getHlsPublicBaseUrl(): Promise<string> {
  const settings = await getS3Settings();
  return getPublicUrlBase(settings);
}

export async function uploadHlsFolderToS3(localFolderPath: string, s3Prefix: string): Promise<number> {
  const settings = await getS3Settings();
  if (!await isS3Configured()) {
    throw new Error('DigitalOcean Spaces is not configured — cannot upload HLS folder');
  }

  const s3Client = await getS3Client();
  let uploadCount = 0;

  const getContentType = (filePath: string): string => {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.m3u8') return 'application/x-mpegURL';
    if (ext === '.ts') return 'video/MP2T';
    return 'application/octet-stream';
  };

  const uploadDir = async (dirPath: string, keyPrefix: string) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);
      const s3Key = `${keyPrefix}/${entry.name}`;
      if (entry.isDirectory()) {
        await uploadDir(fullPath, s3Key);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        await s3Client.send(new PutObjectCommand({
          Bucket: settings.bucket,
          Key: s3Key,
          Body: fs.createReadStream(fullPath),
          ContentType: getContentType(entry.name),
          ACL: 'public-read',
          CacheControl: ext === '.m3u8' ? 'no-cache' : 'max-age=31536000',
        }));
        uploadCount++;
        logger.debug(`Uploaded HLS file to Spaces: ${s3Key}`);
      }
    }));
  };

  await uploadDir(localFolderPath, s3Prefix);
  logger.info({ s3Prefix, uploadCount }, 'HLS folder uploaded to DigitalOcean Spaces');
  return uploadCount;
}

export async function applySpacesCors(origins: string[] = ['*']): Promise<void> {
  const settings = await getS3Settings();
  if (!settings.isSpaces || !settings.bucket) return;

  const allowed = origins.filter(Boolean);
  if (!allowed.length) allowed.push('*');

  const client = await getS3Client();
  await client.send(new PutBucketCorsCommand({
    Bucket: settings.bucket,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET', 'PUT', 'POST', 'HEAD', 'DELETE'],
          AllowedOrigins: allowed,
          ExposeHeaders: ['ETag', 'x-amz-request-id'],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  }));
  logger.info({ bucket: settings.bucket }, 'Applied CORS to DigitalOcean Space');
}

export async function testSpacesConnection(): Promise<{
  ok: boolean;
  configured: boolean;
  bucket?: string;
  region?: string;
  endpoint?: string;
  publicBase?: string;
  error?: string;
}> {
  const settings = await getS3Settings();
  if (!settings.accessKeyId || !settings.secretAccessKey || !settings.bucket) {
    return {
      ok: false,
      configured: false,
      error: 'DigitalOcean Spaces keys or bucket are missing. Add them in Settings → Storage (or DO_SPACES_* in .env).',
    };
  }

  try {
    const client = await getS3Client();
    await client.send(new ListObjectsV2Command({
      Bucket: settings.bucket,
      MaxKeys: 1,
    }));

    const probeKey = `.brajcinema-health/${Date.now()}.txt`;
    await uploadToS3(probeKey, Buffer.from('ok'), 'text/plain', 'no-cache');
    await deleteFromS3(probeKey);

    return {
      ok: true,
      configured: true,
      bucket: settings.bucket,
      region: settings.region,
      endpoint: settings.endpoint,
      publicBase: getPublicUrlBase(settings),
    };
  } catch (error: any) {
    return {
      ok: false,
      configured: true,
      bucket: settings.bucket,
      region: settings.region,
      endpoint: settings.endpoint,
      error: error?.message || String(error),
    };
  }
}

export async function ensureSpacesStorage(): Promise<void> {
  const envKey = String(process.env.DO_SPACES_ACCESS_KEY || '').trim();
  const envSecret = String(process.env.DO_SPACES_SECRET_KEY || '').trim();
  const envBucket = String(process.env.DO_SPACES_BUCKET || '').trim();
  const envRegion = normalizeDoRegion(process.env.DO_SPACES_REGION);
  const envCdn = trimSlash(process.env.DO_SPACES_CDN_URL);

  let settings = await SettingsModel.findOne();
  if (!settings) {
    settings = await SettingsModel.create({});
  }

  const accessKey = String(settings.doSpacesAccessKey || envKey).trim();
  const secretKey = String(settings.doSpacesSecretKey || envSecret).trim();
  const bucket = String(settings.doSpacesBucket || envBucket).trim();

  const patch: Record<string, any> = {};
  if (envKey && !settings.doSpacesAccessKey) patch.doSpacesAccessKey = envKey;
  if (envSecret && !settings.doSpacesSecretKey) patch.doSpacesSecretKey = envSecret;
  if (envBucket && !settings.doSpacesBucket) patch.doSpacesBucket = envBucket;
  if (!settings.doSpacesRegion) patch.doSpacesRegion = settings.doSpacesRegion || envRegion;
  if (envCdn && !settings.doSpacesCdnUrl) patch.doSpacesCdnUrl = envCdn;

  if (accessKey && secretKey && bucket) {
    patch.doSpacesEnabled = true;
    patch.storageDriver = 'spaces';
    patch.doSpacesPathStyleEndpoint = false;
    patch.doSpacesBrowserDirectUpload = true;
  }

  if (Object.keys(patch).length > 0) {
    await SettingsModel.updateOne({}, { $set: patch }, { upsert: true });
  }

  const result = await testSpacesConnection();
  if (result.ok) {
    logger.info({
      bucket: result.bucket,
      region: result.region,
      publicBase: result.publicBase,
    }, 'DigitalOcean Spaces is live — all media uploads will use Spaces');
    try {
      const origins = Array.from(new Set(['*', process.env.FRONTEND_URL, process.env.API_URL].filter(Boolean) as string[]));
      await applySpacesCors(origins);
    } catch (corsError: any) {
      logger.warn({ error: corsError?.message }, 'Could not auto-apply Spaces CORS');
    }
  } else {
    logger.warn({ error: result.error, configured: result.configured }, 'DigitalOcean Spaces is not live');
  }
}
