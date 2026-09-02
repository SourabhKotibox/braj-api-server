"use strict";
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEpisodeSlices = exports.mapEpisode = exports.mapCategory = exports.mapContent = exports.getVideoDurationSeconds = exports.toLocalUploadPath = exports.ensureDefaultImage = exports.parsePositiveNumber = exports.parseBool = exports.parseList = exports.bulkDeleteCategories = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.listCategories = void 0;
var Category_1 = require("../models/Category");
var Episode_1 = require("../models/Episode");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var url_1 = require("url");
var child_process_1 = require("child_process");
var uploadHandler_1 = __importDefault(require("../lib/uploadHandler"));
var videoProcessor_1 = require("../services/videoProcessor");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var uploadsRoot = path_1.default.join(__dirname, '../../uploads');
var readCategoryMultipart = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _a, _b, _c, part, e_1_1;
    var _d, e_1, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                data = {};
                _g.label = 1;
            case 1:
                _g.trys.push([1, 6, 7, 12]);
                _a = true, _b = __asyncValues(request.parts());
                _g.label = 2;
            case 2: return [4 /*yield*/, _b.next()];
            case 3:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                _f = _c.value;
                _a = false;
                part = _f;
                if (part.type === 'field') {
                    if (part.fieldname === 'name')
                        data.name = part.value;
                    if (part.fieldname === 'slug')
                        data.slug = part.value;
                    if (part.fieldname === 'description')
                        data.description = part.value;
                    if (part.fieldname === 'thumbnail')
                        data.thumbnail = part.value;
                    if (part.fieldname === 'bannerImage')
                        data.bannerImage = part.value;
                    if (part.fieldname === 'icon')
                        data.icon = part.value;
                    if (part.fieldname === 'color')
                        data.color = part.value;
                    if (part.fieldname === 'isActive')
                        data.isActive = part.value === 'true';
                    if (part.fieldname === 'isFeatured')
                        data.isFeatured = part.value === 'true';
                    if (part.fieldname === 'order')
                        data.order = parseInt(part.value, 10);
                    if (part.fieldname === 'parentCategory')
                        data.parentCategory = part.value;
                }
                else if (part.type === 'file') {
                    if (part.fieldname === 'thumbnailFile') {
                        data.thumbnailFile = part;
                    }
                    if (part.fieldname === 'bannerFile') {
                        data.bannerFile = part;
                    }
                    if (part.fieldname === 'iconFile') {
                        data.iconFile = part;
                    }
                }
                _g.label = 4;
            case 4:
                _a = true;
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 12];
            case 6:
                e_1_1 = _g.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 7:
                _g.trys.push([7, , 10, 11]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                return [4 /*yield*/, _e.call(_b)];
            case 8:
                _g.sent();
                _g.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 11: return [7 /*endfinally*/];
            case 12:
                console.log("readCategoryMultipart returning data: ", data);
                return [2 /*return*/, data];
        }
    });
}); };
var listCategories = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, isAdminView, filter, _a, categories, total, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, parseInt(query.page || '1', 10));
                limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
                isAdminView = query.admin === 'true';
                filter = isAdminView ? {} : { isActive: true };
                return [4 /*yield*/, Promise.all([
                        Category_1.CategoryModel.find(filter)
                            .sort({ order: 1, createdAt: -1 })
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .lean(),
                        Category_1.CategoryModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), categories = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: categories.map(function (category) { return ({
                            id: category._id,
                            name: category.name,
                            slug: category.slug,
                            description: category.description,
                            thumbnail: category.thumbnail,
                            bannerImage: category.bannerImage,
                            icon: category.icon,
                            color: category.color,
                            contentCount: category.contentCount,
                            isActive: category.isActive,
                            isFeatured: category.isFeatured,
                            order: category.order,
                            parentCategory: category.parentCategory,
                            createdAt: category.createdAt,
                            updatedAt: category.updatedAt,
                        }); }),
                        pagination: {
                            page: page,
                            limit: limit,
                            total: total,
                            pages: Math.ceil(total / limit),
                        },
                    })];
            case 2:
                error_1 = _b.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.listCategories = listCategories;
var getCategoryById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, category, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                categoryId = request.params.categoryId;
                return [4 /*yield*/, Category_1.CategoryModel.findById(categoryId).lean()];
            case 1:
                category = _a.sent();
                if (!category) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Category not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: category._id,
                            name: category.name,
                            slug: category.slug,
                            description: category.description,
                            thumbnail: category.thumbnail,
                            bannerImage: category.bannerImage,
                            icon: category.icon,
                            color: category.color,
                            contentCount: category.contentCount,
                            isActive: category.isActive,
                            isFeatured: category.isFeatured,
                            order: category.order,
                            parentCategory: category.parentCategory,
                            createdAt: category.createdAt,
                            updatedAt: category.updatedAt,
                        },
                    })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCategoryById = getCategoryById;
var createCategory = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var data, slug, thumbnail, bannerImage, icon, uploadedFile, uploadedFile, uploadedFile, category, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                console.log("createCategory called!");
                return [4 /*yield*/, readCategoryMultipart(request)];
            case 1:
                data = _a.sent();
                console.log("Received data: ", data);
                if (!data.name) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: "Name is required" })];
                }
                slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                thumbnail = data.thumbnail;
                bannerImage = data.bannerImage;
                icon = data.icon;
                if (!data.thumbnailFile) return [3 /*break*/, 3];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(data.thumbnailFile, request, 'CATEGORY_THUMBNAIL')];
            case 2:
                uploadedFile = _a.sent();
                thumbnail = uploadedFile.filePath;
                _a.label = 3;
            case 3:
                if (!data.bannerFile) return [3 /*break*/, 5];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(data.bannerFile, request, 'CATEGORY_BANNER')];
            case 4:
                uploadedFile = _a.sent();
                bannerImage = uploadedFile.filePath;
                _a.label = 5;
            case 5:
                if (!data.iconFile) return [3 /*break*/, 7];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(data.iconFile, request, 'CATEGORY_ICON')];
            case 6:
                uploadedFile = _a.sent();
                icon = uploadedFile.filePath;
                _a.label = 7;
            case 7: return [4 /*yield*/, Category_1.CategoryModel.create({
                    name: data.name,
                    slug: slug,
                    description: data.description,
                    thumbnail: thumbnail,
                    bannerImage: bannerImage,
                    icon: icon,
                    color: data.color || '#e50914',
                    isActive: (0, exports.parseBool)(data.isActive, true),
                    isFeatured: (0, exports.parseBool)(data.isFeatured, false),
                    order: data.order || 0,
                    parentCategory: data.parentCategory,
                })];
            case 8:
                category = _a.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            id: category._id,
                            name: category.name,
                            slug: category.slug,
                            description: category.description,
                            thumbnail: category.thumbnail,
                            bannerImage: category.bannerImage,
                            icon: category.icon,
                            color: category.color,
                            contentCount: category.contentCount,
                            isActive: category.isActive,
                            isFeatured: category.isFeatured,
                            order: category.order,
                            parentCategory: category.parentCategory,
                            createdAt: category.createdAt,
                            updatedAt: category.updatedAt,
                        },
                    })];
            case 9:
                error_3 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.createCategory = createCategory;
var updateCategory = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, data, existingCategory, thumbnail, bannerImage, icon, uploadedFile, uploadedFile, uploadedFile, updateData, category, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                categoryId = request.params.categoryId;
                return [4 /*yield*/, readCategoryMultipart(request)];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, Category_1.CategoryModel.findById(categoryId).lean()];
            case 2:
                existingCategory = _a.sent();
                if (!existingCategory) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Category not found' })];
                }
                thumbnail = data.thumbnail;
                bannerImage = data.bannerImage;
                icon = data.icon;
                if (!data.thumbnailFile) return [3 /*break*/, 4];
                if (existingCategory.thumbnail) {
                    uploadHandler_1.default.deleteUploadedFile(existingCategory.thumbnail);
                }
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(data.thumbnailFile, request, 'CATEGORY_THUMBNAIL')];
            case 3:
                uploadedFile = _a.sent();
                thumbnail = uploadedFile.filePath;
                _a.label = 4;
            case 4:
                if (!data.bannerFile) return [3 /*break*/, 6];
                if (existingCategory.bannerImage) {
                    uploadHandler_1.default.deleteUploadedFile(existingCategory.bannerImage);
                }
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(data.bannerFile, request, 'CATEGORY_BANNER')];
            case 5:
                uploadedFile = _a.sent();
                bannerImage = uploadedFile.filePath;
                _a.label = 6;
            case 6:
                if (!data.iconFile) return [3 /*break*/, 8];
                if (existingCategory.icon) {
                    uploadHandler_1.default.deleteUploadedFile(existingCategory.icon);
                }
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(data.iconFile, request, 'CATEGORY_ICON')];
            case 7:
                uploadedFile = _a.sent();
                icon = uploadedFile.filePath;
                _a.label = 8;
            case 8:
                updateData = {};
                if (data.name !== undefined)
                    updateData.name = data.name;
                if (data.slug !== undefined)
                    updateData.slug = data.slug;
                if (data.description !== undefined)
                    updateData.description = data.description;
                if (thumbnail !== undefined)
                    updateData.thumbnail = thumbnail;
                if (bannerImage !== undefined)
                    updateData.bannerImage = bannerImage;
                if (icon !== undefined)
                    updateData.icon = icon;
                if (data.color !== undefined)
                    updateData.color = data.color;
                if (data.isActive !== undefined)
                    updateData.isActive = (0, exports.parseBool)(data.isActive, true);
                if (data.isFeatured !== undefined)
                    updateData.isFeatured = (0, exports.parseBool)(data.isFeatured, false);
                if (data.order !== undefined)
                    updateData.order = data.order || 0;
                if (data.parentCategory !== undefined)
                    updateData.parentCategory = data.parentCategory;
                return [4 /*yield*/, Category_1.CategoryModel.findByIdAndUpdate(categoryId, { $set: updateData }, { returnDocument: 'after', runValidators: true }).lean()];
            case 9:
                category = _a.sent();
                if (!category) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Category not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: category._id,
                            name: category.name,
                            slug: category.slug,
                            description: category.description,
                            thumbnail: category.thumbnail,
                            bannerImage: category.bannerImage,
                            icon: category.icon,
                            color: category.color,
                            contentCount: category.contentCount,
                            isActive: category.isActive,
                            isFeatured: category.isFeatured,
                            order: category.order,
                            parentCategory: category.parentCategory,
                            createdAt: category.createdAt,
                            updatedAt: category.updatedAt,
                        },
                    })];
            case 10:
                error_4 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.updateCategory = updateCategory;
var deleteCategory = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, category, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                categoryId = request.params.categoryId;
                return [4 /*yield*/, Category_1.CategoryModel.findByIdAndDelete(categoryId)];
            case 1:
                category = _a.sent();
                if (!category) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Category not found' })];
                }
                // Delete associated files
                if (category.thumbnail)
                    uploadHandler_1.default.deleteUploadedFile(category.thumbnail);
                if (category.bannerImage)
                    uploadHandler_1.default.deleteUploadedFile(category.bannerImage);
                if (category.icon)
                    uploadHandler_1.default.deleteUploadedFile(category.icon);
                return [2 /*return*/, reply.send({ success: true, message: 'Category deleted successfully' })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteCategory = deleteCategory;
var bulkDeleteCategories = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, categories, _i, categories_1, category, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Invalid or empty ids array' })];
                }
                return [4 /*yield*/, Category_1.CategoryModel.find({ _id: { $in: ids } })];
            case 1:
                categories = _a.sent();
                for (_i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
                    category = categories_1[_i];
                    if (category.thumbnail)
                        uploadHandler_1.default.deleteUploadedFile(category.thumbnail);
                    if (category.bannerImage)
                        uploadHandler_1.default.deleteUploadedFile(category.bannerImage);
                    if (category.icon)
                        uploadHandler_1.default.deleteUploadedFile(category.icon);
                }
                return [4 /*yield*/, Category_1.CategoryModel.deleteMany({ _id: { $in: ids } })];
            case 2:
                result = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: "".concat(result.deletedCount, " categories deleted successfully"),
                        deletedCount: result.deletedCount,
                    })];
            case 3:
                error_6 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.bulkDeleteCategories = bulkDeleteCategories;
// Utility functions needed by contentController
var parseList = function (value) {
    if (Array.isArray(value))
        return value.map(String).filter(Boolean);
    if (typeof value !== 'string')
        return [];
    return value
        .split(',')
        .map(function (item) { return item.trim(); })
        .filter(Boolean);
};
exports.parseList = parseList;
var parseBool = function (value, fallback) {
    if (fallback === void 0) { fallback = false; }
    if (value === undefined || value === null || value === '')
        return fallback;
    return value === true || value === 'true' || value === '1' || value === 'yes';
};
exports.parseBool = parseBool;
var parsePositiveNumber = function (value, fallback) {
    var parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0)
        return fallback;
    return parsed;
};
exports.parsePositiveNumber = parsePositiveNumber;
var ensureDir = function (dir) {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
var ensureDefaultImage = function () {
    var folder = path_1.default.join(uploadsRoot, 'thumbnails');
    var fileName = 'default-thumbnail.svg';
    var filePath = path_1.default.join(folder, fileName);
    ensureDir(folder);
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.writeFileSync(filePath, "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1280\" height=\"720\" viewBox=\"0 0 1280 720\">\n  <rect width=\"1280\" height=\"720\" fill=\"#0b1217\"/>\n  <rect x=\"64\" y=\"64\" width=\"1152\" height=\"592\" rx=\"28\" fill=\"#141d23\" stroke=\"#2a343c\" stroke-width=\"4\"/>\n  <circle cx=\"640\" cy=\"360\" r=\"92\" fill=\"#e50914\"/>\n  <path d=\"M615 312v96l84-48z\" fill=\"#fff\"/>\n  <text x=\"640\" y=\"515\" text-anchor=\"middle\" fill=\"#d7dde2\" font-family=\"Arial, sans-serif\" font-size=\"42\" font-weight=\"700\">Video Upload</text>\n</svg>");
    }
    return "/uploads/thumbnails/".concat(fileName);
};
exports.ensureDefaultImage = ensureDefaultImage;
var toLocalUploadPath = function (fileUrl) {
    if (!fileUrl.startsWith('/uploads/'))
        return undefined;
    return path_1.default.join(__dirname, '../..', fileUrl);
};
exports.toLocalUploadPath = toLocalUploadPath;
var runCommand = function (command, args) {
    return new Promise(function (resolve, reject) {
        var child = (0, child_process_1.spawn)(command, args);
        var stdout = '';
        var stderr = '';
        child.stdout.on('data', function (chunk) {
            stdout += chunk.toString();
        });
        child.stderr.on('data', function (chunk) {
            stderr += chunk.toString();
        });
        child.on('error', reject);
        child.on('close', function (code) {
            if (code === 0) {
                resolve(stdout.trim());
            }
            else {
                reject(new Error(stderr.trim() || "".concat(command, " exited with code ").concat(code)));
            }
        });
    });
};
var getVideoDurationSeconds = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var output, duration, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, runCommand('ffprobe', [
                        '-v',
                        'error',
                        '-show_entries',
                        'format=duration',
                        '-of',
                        'default=noprint_wrappers=1:nokey=1',
                        filePath,
                    ])];
            case 1:
                output = _a.sent();
                duration = Number(output);
                return [2 /*return*/, Number.isFinite(duration) && duration > 0 ? duration : undefined];
            case 2:
                error_7 = _a.sent();
                console.warn('ffprobe unavailable or failed:', error_7);
                return [2 /*return*/, undefined];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getVideoDurationSeconds = getVideoDurationSeconds;
var mapContent = function (content, episodeCount) {
    if (episodeCount === void 0) { episodeCount = 0; }
    return ({
        id: content._id.toString(),
        title: content.title,
        subtitle: content.shortDescription,
        description: content.description,
        thumbnail: content.thumbnail,
        bannerImage: content.bannerImage,
        genres: content.genres,
        languages: content.languages,
        views: content.views,
        likes: content.likes,
        shares: content.shares,
        episodeCount: episodeCount,
        status: content.status,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
    });
};
exports.mapContent = mapContent;
var mapCategory = function (category) { return ({
    id: category._id.toString(),
    name: category.name,
    description: category.description,
    active: category.active !== undefined ? category.active : true,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
}); };
exports.mapCategory = mapCategory;
var mapEpisode = function (episode) { return ({
    id: episode._id.toString(),
    contentId: episode.contentId.toString(),
    episode: episode.episode,
    season: episode.season,
    title: episode.title,
    heading: episode.heading,
    description: episode.description,
    thumbnail: episode.thumbnail,
    hlsUrl: episode.hlsUrl,
    sourceVideoUrl: episode.sourceVideoUrl,
    sourceStartSeconds: episode.sourceStartSeconds,
    sourceEndSeconds: episode.sourceEndSeconds,
    duration: episode.duration,
    views: episode.views,
    isFree: episode.isFree,
    isLocked: episode.isLocked,
    categories: episode.categories ? episode.categories.map(exports.mapCategory) : [],
    processingStatus: episode.processingStatus,
    processingError: episode.processingError,
}); };
exports.mapEpisode = mapEpisode;
var createEpisodeSlices = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var duration, _c, episodeCount, lastEpisode, startEpisodeNum, episodes, i, start, end, isFree, createdEpisodes;
    var contentId = _b.contentId, sourceVideoUrl = _b.sourceVideoUrl, sourceVideoPath = _b.sourceVideoPath, _d = _b.reelDurationMinutes, reelDurationMinutes = _d === void 0 ? 3 : _d, totalDurationMinutes = _b.totalDurationMinutes, freeEpisodeCount = _b.freeEpisodeCount, _e = _b.lockEpisodes, lockEpisodes = _e === void 0 ? true : _e, _f = _b.seasonNumber, seasonNumber = _f === void 0 ? 1 : _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                if (!totalDurationMinutes) return [3 /*break*/, 1];
                _c = totalDurationMinutes * 60;
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, (0, exports.getVideoDurationSeconds)(sourceVideoPath)];
            case 2:
                _c = (_g.sent()) || reelDurationMinutes * 60;
                _g.label = 3;
            case 3:
                duration = _c;
                episodeCount = Math.floor(duration / (reelDurationMinutes * 60));
                return [4 /*yield*/, Episode_1.EpisodeModel.findOne({ contentId: contentId, season: seasonNumber })
                        .sort({ episode: -1 })
                        .lean()];
            case 4:
                lastEpisode = _g.sent();
                startEpisodeNum = lastEpisode ? lastEpisode.episode + 1 : 1;
                episodes = [];
                for (i = 0; i < episodeCount; i++) {
                    start = i * reelDurationMinutes * 60;
                    end = Math.min(start + reelDurationMinutes * 60, duration);
                    isFree = freeEpisodeCount !== undefined && i < freeEpisodeCount;
                    episodes.push({
                        contentId: contentId,
                        season: seasonNumber,
                        episode: startEpisodeNum + i,
                        title: "Episode ".concat(i + 1),
                        thumbnail: '',
                        sourceVideoUrl: sourceVideoUrl,
                        sourceStartSeconds: start,
                        sourceEndSeconds: end,
                        duration: end - start,
                        hlsUrl: '',
                        isFree: isFree,
                        isLocked: !isFree,
                        processingStatus: 'queued',
                    });
                }
                return [4 /*yield*/, Episode_1.EpisodeModel.insertMany(episodes)];
            case 5:
                createdEpisodes = _g.sent();
                (0, videoProcessor_1.processEpisodesInBackground)(createdEpisodes.map(function (episode) { return episode._id; }), sourceVideoUrl);
                return [2 /*return*/, createdEpisodes];
        }
    });
}); };
exports.createEpisodeSlices = createEpisodeSlices;
