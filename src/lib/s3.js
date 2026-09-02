"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS3Settings = getS3Settings;
exports.getS3Client = getS3Client;
exports.generatePresignedUrl = generatePresignedUrl;
exports.uploadToS3 = uploadToS3;
exports.deleteFromS3 = deleteFromS3;
exports.isS3Configured = isS3Configured;
exports.getS3PublicUrl = getS3PublicUrl;
exports.getHlsPublicBaseUrl = getHlsPublicBaseUrl;
exports.uploadHlsFolderToS3 = uploadHlsFolderToS3;
var client_s3_1 = require("@aws-sdk/client-s3");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
var logger_1 = require("./logger");
var Settings_1 = require("../models/Settings");
// Helper function to get settings from database
function getS3Settings() {
    return __awaiter(this, void 0, void 0, function () {
        var settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Settings_1.SettingsModel.findOne()];
                case 1:
                    settings = _a.sent();
                    return [2 /*return*/, {
                            accessKeyId: (settings === null || settings === void 0 ? void 0 : settings.awsAccessKeyId) || process.env.AWS_S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
                            secretAccessKey: (settings === null || settings === void 0 ? void 0 : settings.awsSecretAccessKey) || process.env.AWS_S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '',
                            region: (settings === null || settings === void 0 ? void 0 : settings.awsRegion) || process.env.AWS_S3_REGION || process.env.AWS_REGION || 'us-east-1',
                            bucket: (settings === null || settings === void 0 ? void 0 : settings.awsBucket) || process.env.AWS_S3_BUCKET_NAME || process.env.AWS_BUCKET_NAME || 'brajcinema-ott-admin',
                            pathStyle: (settings === null || settings === void 0 ? void 0 : settings.awsPathStyleEndpoint) || false,
                            storageDriver: (settings === null || settings === void 0 ? void 0 : settings.storageDriver) || 'local'
                        }];
            }
        });
    });
}
// Create S3 client dynamically based on settings
function getS3Client() {
    return __awaiter(this, void 0, void 0, function () {
        var settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getS3Settings()];
                case 1:
                    settings = _a.sent();
                    return [2 /*return*/, new client_s3_1.S3Client(__assign({ region: settings.region, credentials: {
                                accessKeyId: settings.accessKeyId,
                                secretAccessKey: settings.secretAccessKey,
                            } }, (settings.pathStyle && {
                            forcePathStyle: true
                        })))];
            }
        });
    });
}
function generatePresignedUrl(key_1, contentType_1) {
    return __awaiter(this, arguments, void 0, function (key, contentType, expiresIn) {
        var settings, s3Client, command, uploadUrl, publicUrl, error_1;
        if (expiresIn === void 0) { expiresIn = 3600; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getS3Settings()];
                case 1:
                    settings = _a.sent();
                    if (!settings.accessKeyId || !settings.secretAccessKey || settings.storageDriver !== 's3') {
                        logger_1.logger.warn('AWS S3 credentials not found or S3 not selected, returning mock URL');
                        return [2 /*return*/, {
                                uploadUrl: "https://mock-storage.local/upload/".concat(key, "?token=dev-placeholder"),
                                publicUrl: "https://mock-storage.local/".concat(key),
                                key: key,
                            }];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, getS3Client()];
                case 3:
                    s3Client = _a.sent();
                    command = new client_s3_1.PutObjectCommand({
                        Bucket: settings.bucket,
                        Key: key,
                        ContentType: contentType,
                    });
                    return [4 /*yield*/, (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: expiresIn })];
                case 4:
                    uploadUrl = _a.sent();
                    publicUrl = settings.pathStyle
                        ? "https://s3.".concat(settings.region, ".amazonaws.com/").concat(settings.bucket, "/").concat(key)
                        : "https://".concat(settings.bucket, ".s3.").concat(settings.region, ".amazonaws.com/").concat(key);
                    return [2 /*return*/, {
                            uploadUrl: uploadUrl,
                            publicUrl: publicUrl,
                            key: key,
                        }];
                case 5:
                    error_1 = _a.sent();
                    logger_1.logger.error(error_1, 'Error generating presigned URL');
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function uploadToS3(key, body, contentType) {
    return __awaiter(this, void 0, void 0, function () {
        var settings, s3Client, command, publicUrl, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getS3Settings()];
                case 1:
                    settings = _a.sent();
                    if (!settings.accessKeyId || !settings.secretAccessKey || settings.storageDriver !== 's3') {
                        logger_1.logger.warn('AWS S3 credentials not found or S3 not selected, skipping upload to S3');
                        throw new Error('AWS S3 credentials not configured');
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, getS3Client()];
                case 3:
                    s3Client = _a.sent();
                    command = new client_s3_1.PutObjectCommand({
                        Bucket: settings.bucket,
                        Key: key,
                        Body: body,
                        ContentType: contentType,
                    });
                    return [4 /*yield*/, s3Client.send(command)];
                case 4:
                    _a.sent();
                    publicUrl = settings.pathStyle
                        ? "https://s3.".concat(settings.region, ".amazonaws.com/").concat(settings.bucket, "/").concat(key)
                        : "https://".concat(settings.bucket, ".s3.").concat(settings.region, ".amazonaws.com/").concat(key);
                    return [2 /*return*/, publicUrl];
                case 5:
                    error_2 = _a.sent();
                    logger_1.logger.error(error_2, 'Error uploading to S3');
                    throw error_2;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function deleteFromS3(key) {
    return __awaiter(this, void 0, void 0, function () {
        var settings, s3Client, command, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getS3Settings()];
                case 1:
                    settings = _a.sent();
                    if (!settings.accessKeyId || !settings.secretAccessKey || settings.storageDriver !== 's3') {
                        logger_1.logger.warn('AWS S3 credentials not found or S3 not selected, skipping delete from S3');
                        return [2 /*return*/];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, getS3Client()];
                case 3:
                    s3Client = _a.sent();
                    command = new client_s3_1.DeleteObjectCommand({
                        Bucket: settings.bucket,
                        Key: key,
                    });
                    return [4 /*yield*/, s3Client.send(command)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    logger_1.logger.error(error_3, 'Error deleting from S3');
                    throw error_3;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function isS3Configured() {
    return __awaiter(this, void 0, void 0, function () {
        var settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getS3Settings()];
                case 1:
                    settings = _a.sent();
                    return [2 /*return*/, !!(settings.accessKeyId && settings.secretAccessKey && settings.storageDriver === 's3')];
            }
        });
    });
}
function getS3PublicUrl(key) {
    return __awaiter(this, void 0, void 0, function () {
        var settings, cleanKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getS3Settings()];
                case 1:
                    settings = _a.sent();
                    if (key.startsWith('http://') || key.startsWith('https://'))
                        return [2 /*return*/, key];
                    cleanKey = key;
                    if (cleanKey.startsWith('/'))
                        cleanKey = cleanKey.slice(1);
                    if (cleanKey.startsWith('uploads/'))
                        cleanKey = cleanKey.replace('uploads/', '');
                    if (cleanKey.startsWith('/uploads/'))
                        cleanKey = cleanKey.replace('/uploads/', '');
                    return [2 /*return*/, settings.pathStyle
                            ? "https://s3.".concat(settings.region, ".amazonaws.com/").concat(settings.bucket, "/").concat(cleanKey)
                            : "https://".concat(settings.bucket, ".s3.").concat(settings.region, ".amazonaws.com/").concat(cleanKey)];
            }
        });
    });
}
/**
 * Returns the base public URL for the S3 bucket (no trailing slash).
 * Used to prefix HLS master.m3u8 and individual playlist URLs.
 */
function getHlsPublicBaseUrl() {
    return __awaiter(this, void 0, void 0, function () {
        var settings, base;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getS3Settings()];
                case 1:
                    settings = _a.sent();
                    base = settings.pathStyle
                        ? "https://s3.".concat(settings.region, ".amazonaws.com/").concat(settings.bucket)
                        : "https://".concat(settings.bucket, ".s3.").concat(settings.region, ".amazonaws.com");
                    return [2 /*return*/, base];
            }
        });
    });
}
/**
 * Recursively uploads an entire local HLS output folder to S3.
 * Preserves the relative directory structure under the given S3 prefix.
 *
 * @param localFolderPath   Absolute path to the local HLS output folder.
 * @param s3Prefix          S3 key prefix, e.g. "hls/movies/abc123".
 * @returns                 Number of files uploaded.
 */
function uploadHlsFolderToS3(localFolderPath, s3Prefix) {
    return __awaiter(this, void 0, void 0, function () {
        var settings, s3Client, uploadCount, getContentType, uploadDir;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getS3Settings()];
                case 1:
                    settings = _a.sent();
                    if (!settings.accessKeyId || !settings.secretAccessKey || settings.storageDriver !== 's3') {
                        throw new Error('S3 is not configured — cannot upload HLS folder');
                    }
                    return [4 /*yield*/, getS3Client()];
                case 2:
                    s3Client = _a.sent();
                    uploadCount = 0;
                    getContentType = function (filePath) {
                        var ext = path_1.default.extname(filePath).toLowerCase();
                        if (ext === '.m3u8')
                            return 'application/x-mpegURL';
                        if (ext === '.ts')
                            return 'video/MP2T';
                        return 'application/octet-stream';
                    };
                    uploadDir = function (dirPath, keyPrefix) { return __awaiter(_this, void 0, void 0, function () {
                        var entries, promises;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    entries = fs_1.default.readdirSync(dirPath, { withFileTypes: true });
                                    promises = entries.map(function (entry) { return __awaiter(_this, void 0, void 0, function () {
                                        var fullPath, s3Key, body, contentType, ext;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    fullPath = path_1.default.join(dirPath, entry.name);
                                                    s3Key = "".concat(keyPrefix, "/").concat(entry.name);
                                                    if (!entry.isDirectory()) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, uploadDir(fullPath, s3Key)];
                                                case 1:
                                                    _a.sent();
                                                    return [3 /*break*/, 4];
                                                case 2:
                                                    if (!entry.isFile()) return [3 /*break*/, 4];
                                                    body = fs_1.default.readFileSync(fullPath);
                                                    contentType = getContentType(entry.name);
                                                    ext = path_1.default.extname(entry.name).toLowerCase();
                                                    return [4 /*yield*/, s3Client.send(new client_s3_1.PutObjectCommand({
                                                            Bucket: settings.bucket,
                                                            Key: s3Key,
                                                            Body: body,
                                                            ContentType: contentType,
                                                            // Ensure .m3u8 files are not cached aggressively by CDN/browser
                                                            CacheControl: ext === '.m3u8' ? 'no-cache' : 'max-age=31536000',
                                                        }))];
                                                case 3:
                                                    _a.sent();
                                                    uploadCount++;
                                                    logger_1.logger.debug("Uploaded HLS file to S3: ".concat(s3Key));
                                                    _a.label = 4;
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [4 /*yield*/, Promise.all(promises)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, uploadDir(localFolderPath, s3Prefix)];
                case 3:
                    _a.sent();
                    logger_1.logger.info({ s3Prefix: s3Prefix, uploadCount: uploadCount }, 'HLS folder uploaded to S3');
                    return [2 /*return*/, uploadCount];
            }
        });
    });
}
