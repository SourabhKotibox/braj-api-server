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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaLinkerPlugin = void 0;
var MediaFile_1 = require("../models/MediaFile");
var extractUploadPath = function (value) {
    if (typeof value !== 'string')
        return null;
    // Match path containing /uploads/
    var match = value.match(/(\/uploads\/[^\s\?#]+)/);
    return match ? match[1] : null;
};
var isPlainObject = function (value) {
    if (!value || typeof value !== 'object')
        return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
};
var findUploadPaths = function (obj, paths, visited) {
    if (paths === void 0) { paths = new Set(); }
    if (visited === void 0) { visited = new WeakSet(); }
    if (!obj)
        return paths;
    if (typeof obj === 'string') {
        var p = extractUploadPath(obj);
        if (p)
            paths.add(p);
    }
    else if (Array.isArray(obj)) {
        if (visited.has(obj))
            return paths;
        visited.add(obj);
        for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
            var item = obj_1[_i];
            findUploadPaths(item, paths, visited);
        }
    }
    else if (typeof obj === 'object') {
        if (visited.has(obj))
            return paths;
        visited.add(obj);
        if (!isPlainObject(obj))
            return paths;
        for (var _a = 0, _b = Object.entries(obj); _a < _b.length; _a++) {
            var _c = _b[_a], key = _c[0], val = _c[1];
            if (key !== '_id' && key !== '__v') {
                findUploadPaths(val, paths, visited);
            }
        }
    }
    return paths;
};
var docToObject = function (doc) {
    if (!doc)
        return doc;
    return doc.toObject ? doc.toObject({ virtuals: false, getters: false }) : doc;
};
var linkMediaFiles = function (doc) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, paths, modelName, contentName, contentType, _i, paths_1, filePath, cleanPath, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!doc)
                    return [2 /*return*/];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                obj = docToObject(doc);
                paths = Array.from(findUploadPaths(obj));
                if (paths.length === 0)
                    return [2 /*return*/];
                modelName = doc.constructor.modelName || 'Document';
                contentName = doc.title || doc.name || doc.email || doc.phone || ((_a = doc._id) === null || _a === void 0 ? void 0 : _a.toString());
                contentType = modelName.toLowerCase();
                if (modelName === 'Movie')
                    contentType = 'movie';
                else if (modelName === 'Content') {
                    contentType = doc.contentType === 'drama' ? 'drama' : 'tvshow';
                }
                else if (modelName === 'Episode') {
                    contentType = 'episode';
                }
                _i = 0, paths_1 = paths;
                _b.label = 2;
            case 2:
                if (!(_i < paths_1.length)) return [3 /*break*/, 5];
                filePath = paths_1[_i];
                cleanPath = filePath.replace(/^\/+/, '');
                return [4 /*yield*/, MediaFile_1.MediaFileModel.updateMany({
                        $or: [
                            { filePath: filePath },
                            { filePath: '/' + cleanPath },
                            { filePath: cleanPath },
                            { url: { $regex: new RegExp(cleanPath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$') } }
                        ]
                    }, {
                        $set: {
                            sourceId: doc._id,
                            source: contentType,
                            contentType: contentType,
                            contentName: contentName
                        }
                    })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                console.error('mediaLinkerPlugin error in linkMediaFiles:', err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
var mediaLinkerPlugin = function (schema) {
    schema.post('save', function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, linkMediaFiles(doc)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    schema.post('findOneAndUpdate', function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!doc) return [3 /*break*/, 2];
                        return [4 /*yield*/, linkMediaFiles(doc)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    });
};
exports.mediaLinkerPlugin = mediaLinkerPlugin;
