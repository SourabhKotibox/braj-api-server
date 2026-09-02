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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeletePages = exports.deletePage = exports.updatePage = exports.createPage = exports.getPageById = exports.listPages = void 0;
var Page_1 = require("../models/Page");
var mongoose_1 = __importDefault(require("mongoose"));
var listPages = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, isAdminView, filter, _a, pages, total, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, parseInt(query.page || '1', 10));
                limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
                isAdminView = query.admin === 'true';
                filter = isAdminView ? {} : { status: 'published' };
                return [4 /*yield*/, Promise.all([
                        Page_1.PageModel.find(filter)
                            .sort({ order: 1, createdAt: -1 })
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .lean(),
                        Page_1.PageModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), pages = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: pages.map(function (page) { return ({
                            _id: page._id,
                            title: page.title,
                            slug: page.slug,
                            status: page.status,
                            order: page.order,
                            createdAt: page.createdAt,
                            updatedAt: page.updatedAt,
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
exports.listPages = listPages;
var getPageById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, pageId, slug, identifier, page, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = request.params, pageId = _a.pageId, slug = _a.slug;
                identifier = pageId || slug;
                if (!identifier) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Identifier (pageId or slug) is required' })];
                }
                page = void 0;
                if (!mongoose_1.default.Types.ObjectId.isValid(identifier)) return [3 /*break*/, 2];
                return [4 /*yield*/, Page_1.PageModel.findById(identifier).lean()];
            case 1:
                page = _b.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, Page_1.PageModel.findOne({ slug: identifier, status: 'published' }).lean()];
            case 3:
                page = _b.sent();
                _b.label = 4;
            case 4:
                if (!page) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Page not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            _id: page._id,
                            title: page.title,
                            slug: page.slug,
                            content: page.content,
                            status: page.status,
                            order: page.order,
                            metaTitle: page.metaTitle,
                            metaDescription: page.metaDescription,
                            createdAt: page.createdAt,
                            updatedAt: page.updatedAt,
                        },
                    })];
            case 5:
                error_2 = _b.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getPageById = getPageById;
var createPage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, page, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                body = request.body;
                if (!body.title || !body.slug) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Title and slug are required' })];
                }
                return [4 /*yield*/, Page_1.PageModel.create({
                        title: body.title,
                        slug: body.slug,
                        content: body.content,
                        status: body.status || 'draft',
                        order: body.order || 0,
                        metaTitle: body.metaTitle,
                        metaDescription: body.metaDescription,
                    })];
            case 1:
                page = _a.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            _id: page._id,
                            title: page.title,
                            slug: page.slug,
                            content: page.content,
                            status: page.status,
                            order: page.order,
                            metaTitle: page.metaTitle,
                            metaDescription: page.metaDescription,
                            createdAt: page.createdAt,
                            updatedAt: page.updatedAt,
                        },
                    })];
            case 2:
                error_3 = _a.sent();
                if (error_3.code === 11000) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Slug already exists' })];
                }
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createPage = createPage;
var updatePage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var pageId, body, page, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                pageId = request.params.pageId;
                body = request.body;
                return [4 /*yield*/, Page_1.PageModel.findByIdAndUpdate(pageId, { $set: body }, { returnDocument: 'after', runValidators: true }).lean()];
            case 1:
                page = _a.sent();
                if (!page) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Page not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            _id: page._id,
                            title: page.title,
                            slug: page.slug,
                            content: page.content,
                            status: page.status,
                            order: page.order,
                            metaTitle: page.metaTitle,
                            metaDescription: page.metaDescription,
                            createdAt: page.createdAt,
                            updatedAt: page.updatedAt,
                        },
                    })];
            case 2:
                error_4 = _a.sent();
                if (error_4.code === 11000) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Slug already exists' })];
                }
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updatePage = updatePage;
var deletePage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var pageId, page, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                pageId = request.params.pageId;
                return [4 /*yield*/, Page_1.PageModel.findByIdAndDelete(pageId)];
            case 1:
                page = _a.sent();
                if (!page) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Page not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Page deleted successfully',
                    })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deletePage = deletePage;
var bulkDeletePages = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid or empty ids array' })];
                }
                return [4 /*yield*/, Page_1.PageModel.deleteMany({ _id: { $in: ids } })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, {
                        success: true,
                        message: "".concat(result.deletedCount, " pages deleted successfully"),
                        deletedCount: result.deletedCount,
                    }];
            case 2:
                error_6 = _a.sent();
                console.error('Error bulk deleting pages:', error_6);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_6.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.bulkDeletePages = bulkDeletePages;
