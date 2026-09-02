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
exports.reorderSections = exports.deleteSection = exports.updateSection = exports.createSection = exports.getSectionById = exports.getSections = void 0;
var Section_1 = require("../models/Section");
var Content_1 = require("../models/Content");
var Movie_1 = require("../models/Movie");
var syncManualContent = function (section) { return __awaiter(void 0, void 0, void 0, function () {
    var sectionIdStr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sectionIdStr = section._id.toString();
                if (!(section.contentType === 'movie')) return [3 /*break*/, 2];
                return [4 /*yield*/, Movie_1.MovieModel.updateMany({ sections: sectionIdStr }, { $pull: { sections: sectionIdStr } })];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, Content_1.ContentModel.updateMany({ sections: sectionIdStr }, { $pull: { sections: sectionIdStr } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!(section.manualContentIds && section.manualContentIds.length > 0)) return [3 /*break*/, 8];
                if (!(section.contentType === 'movie')) return [3 /*break*/, 6];
                return [4 /*yield*/, Movie_1.MovieModel.updateMany({ _id: { $in: section.manualContentIds } }, { $addToSet: { sections: sectionIdStr } })];
            case 5:
                _a.sent();
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, Content_1.ContentModel.updateMany({ _id: { $in: section.manualContentIds } }, { $addToSet: { sections: sectionIdStr } })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
var getSections = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, filter, sections, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = request.query;
                filter = {};
                if (query.contentType)
                    filter.contentType = query.contentType;
                if (query.activeOnly === 'true')
                    filter.isActive = true;
                return [4 /*yield*/, Section_1.SectionModel.find(filter).sort({ position: 1 })];
            case 1:
                sections = _a.sent();
                reply.send({ success: true, data: sections });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                request.log.error(error_1);
                reply.status(500).send({ success: false, error: 'Failed to fetch sections' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSections = getSections;
var getSectionById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var params, section, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                params = request.params;
                return [4 /*yield*/, Section_1.SectionModel.findById(params.id)];
            case 1:
                section = _a.sent();
                if (!section) {
                    reply.status(404).send({ success: false, error: 'Section not found' });
                    return [2 /*return*/];
                }
                reply.send({ success: true, data: section });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                request.log.error(error_2);
                reply.status(500).send({ success: false, error: 'Failed to fetch section' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSectionById = getSectionById;
var createSection = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, section, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                body = request.body;
                return [4 /*yield*/, Section_1.SectionModel.create(body)];
            case 1:
                section = _a.sent();
                return [4 /*yield*/, syncManualContent(section)];
            case 2:
                _a.sent();
                reply.status(201).send({ success: true, data: section });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                request.log.error(error_3);
                reply.status(500).send({ success: false, error: 'Failed to create section' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createSection = createSection;
var updateSection = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var params, body, section, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                params = request.params;
                body = request.body;
                return [4 /*yield*/, Section_1.SectionModel.findByIdAndUpdate(params.id, body, { returnDocument: 'after' })];
            case 1:
                section = _a.sent();
                if (!section) {
                    reply.status(404).send({ success: false, error: 'Section not found' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, syncManualContent(section)];
            case 2:
                _a.sent();
                reply.send({ success: true, data: section });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                request.log.error(error_4);
                reply.status(500).send({ success: false, error: 'Failed to update section' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateSection = updateSection;
var deleteSection = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var params, section, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                params = request.params;
                return [4 /*yield*/, Section_1.SectionModel.findByIdAndDelete(params.id)];
            case 1:
                section = _a.sent();
                if (!section) {
                    reply.status(404).send({ success: false, error: 'Section not found' });
                    return [2 /*return*/];
                }
                if (!(section.contentType === 'movie')) return [3 /*break*/, 3];
                return [4 /*yield*/, Movie_1.MovieModel.updateMany({ sections: section._id.toString() }, { $pull: { sections: section._id.toString() } })];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, Content_1.ContentModel.updateMany({ sections: section._id.toString() }, { $pull: { sections: section._id.toString() } })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                reply.send({ success: true, message: 'Section deleted successfully' });
                return [3 /*break*/, 7];
            case 6:
                error_5 = _a.sent();
                request.log.error(error_5);
                reply.status(500).send({ success: false, error: 'Failed to delete section' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.deleteSection = deleteSection;
var reorderSections = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, operations, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                updates = request.body.updates;
                operations = updates.map(function (update) { return ({
                    updateOne: {
                        filter: { _id: update.id },
                        update: { $set: { position: update.position } }
                    }
                }); });
                if (!(operations.length > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, Section_1.SectionModel.bulkWrite(operations)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                reply.send({ success: true, message: 'Sections reordered successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                request.log.error(error_6);
                reply.status(500).send({ success: false, error: 'Failed to reorder sections' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.reorderSections = reorderSections;
