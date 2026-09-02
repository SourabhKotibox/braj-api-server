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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHomeTabs = exports.getHomeTabs = exports.editAppSetting = exports.deleteAppSetting = exports.addAppSetting = exports.updateAppSettings = exports.getAppSettings = void 0;
var AppSetting_1 = require("../models/AppSetting");
var Category_1 = require("../models/Category");
var Content_1 = require("../models/Content");
var Genre_1 = require("../models/Genre");
var Language_1 = require("../models/Language");
var Actor_1 = require("../models/Actor");
var Director_1 = require("../models/Director");
var LiveChannel_1 = require("../models/LiveChannel");
var DEFAULT_SETTINGS = [
    { id: 'banner', name: 'Banner', enabled: true, type: 'simple', order: 0 },
    { id: 'continue-watching', name: 'Continue Watching', enabled: true, type: 'simple', order: 1 },
    { id: 'top-10', name: 'Top 10', enabled: true, type: 'select', selectedItems: [], availableItems: [], order: 2 },
    { id: 'advertisement', name: 'Advertisement', enabled: true, type: 'simple', order: 3 },
    { id: 'new-released-movies', name: 'New Released Movies', enabled: true, type: 'select', selectedItems: [], availableItems: [], order: 4 },
    { id: 'popular-language', name: 'Popular Language', enabled: true, type: 'select', selectedItems: [], availableItems: [], order: 5 },
    { id: 'top-channels', name: 'Top Channels', enabled: true, type: 'select', selectedItems: [], availableItems: [], order: 6 },
    { id: 'popular-personalities', name: 'Popular Personalities', enabled: true, type: 'select', selectedItems: [], availableItems: [], order: 7 },
    { id: 'free-movies', name: 'Free Movies', enabled: true, type: 'select', selectedItems: [], availableItems: [], order: 8 },
    { id: 'genres', name: 'Genres', enabled: true, type: 'select', selectedItems: [], availableItems: [], order: 9 },
    { id: 'popular-categories', name: 'Popular Categories', enabled: true, type: 'select', selectedItems: [], availableItems: [], order: 10 },
    { id: 'rate-our-app', name: 'Rate our app', enabled: true, type: 'simple', order: 11 },
    { id: 'popular-tv-show', name: 'Popular TV Show', enabled: true, type: 'select', selectedItems: [], availableItems: [], order: 12 },
    { id: 'most-watched-videos', name: 'Most Watched Videos', enabled: true, type: 'select', selectedItems: [], availableItems: [], order: 13 },
];
var getAppSettings = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var appSetting, settings, resolvedSettings, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, AppSetting_1.AppSettingModel.findOne({ key: 'mobile-settings' })];
            case 1:
                appSetting = _a.sent();
                if (!!appSetting) return [3 /*break*/, 3];
                return [4 /*yield*/, AppSetting_1.AppSettingModel.create({
                        key: 'mobile-settings',
                        value: DEFAULT_SETTINGS,
                    })];
            case 2:
                appSetting = _a.sent();
                _a.label = 3;
            case 3:
                settings = appSetting.value.map(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                    var updatedItem, genres, languages, contents, actors, directors, personalities, channels, categories;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                updatedItem = __assign({}, (item.toObject ? item.toObject() : item));
                                if (!(updatedItem.type === 'select')) return [3 /*break*/, 13];
                                if (!(updatedItem.id === 'genres')) return [3 /*break*/, 2];
                                return [4 /*yield*/, Genre_1.GenreModel.find().lean()];
                            case 1:
                                genres = _a.sent();
                                updatedItem.availableItems = genres.map(function (g) { return g.name; });
                                return [3 /*break*/, 13];
                            case 2:
                                if (!(updatedItem.id === 'popular-language')) return [3 /*break*/, 4];
                                return [4 /*yield*/, Language_1.LanguageModel.find().lean()];
                            case 3:
                                languages = _a.sent();
                                updatedItem.availableItems = languages.map(function (l) { return l.name; });
                                return [3 /*break*/, 13];
                            case 4:
                                if (!['new-released-movies', 'free-movies', 'popular-tv-show', 'most-watched-videos'].includes(updatedItem.id)) return [3 /*break*/, 6];
                                return [4 /*yield*/, Content_1.ContentModel.find().lean()];
                            case 5:
                                contents = _a.sent();
                                updatedItem.availableItems = contents.map(function (c) { return c.title; });
                                return [3 /*break*/, 13];
                            case 6:
                                if (!(updatedItem.id === 'popular-personalities')) return [3 /*break*/, 9];
                                return [4 /*yield*/, Actor_1.ActorModel.find().lean()];
                            case 7:
                                actors = _a.sent();
                                return [4 /*yield*/, Director_1.DirectorModel.find().lean()];
                            case 8:
                                directors = _a.sent();
                                personalities = __spreadArray(__spreadArray([], actors.map(function (a) { return a.name; }), true), directors.map(function (d) { return d.name; }), true);
                                updatedItem.availableItems = personalities;
                                return [3 /*break*/, 13];
                            case 9:
                                if (!(updatedItem.id === 'top-channels')) return [3 /*break*/, 11];
                                return [4 /*yield*/, LiveChannel_1.LiveChannelModel.find().lean()];
                            case 10:
                                channels = _a.sent();
                                updatedItem.availableItems = channels.map(function (c) { return c.name; });
                                return [3 /*break*/, 13];
                            case 11:
                                if (!(updatedItem.id === 'popular-categories')) return [3 /*break*/, 13];
                                return [4 /*yield*/, Category_1.CategoryModel.find().lean()];
                            case 12:
                                categories = _a.sent();
                                updatedItem.availableItems = categories.map(function (c) { return c.name; });
                                _a.label = 13;
                            case 13: return [2 /*return*/, updatedItem];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(settings)];
            case 4:
                resolvedSettings = _a.sent();
                resolvedSettings.sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: resolvedSettings,
                    })];
            case 5:
                error_1 = _a.sent();
                console.error('Error in getAppSettings:', error_1);
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getAppSettings = getAppSettings;
var updateAppSettings = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var settings, appSetting, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                settings = request.body.settings;
                return [4 /*yield*/, AppSetting_1.AppSettingModel.findOneAndUpdate({ key: 'mobile-settings' }, { value: settings }, { returnDocument: 'after', upsert: true })];
            case 1:
                appSetting = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: appSetting.value,
                    })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateAppSettings = updateAppSettings;
var addAppSetting = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, type, appSetting, newSetting, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = request.body, name_1 = _a.name, type = _a.type;
                return [4 /*yield*/, AppSetting_1.AppSettingModel.findOne({ key: 'mobile-settings' })];
            case 1:
                appSetting = _b.sent();
                if (!!appSetting) return [3 /*break*/, 3];
                return [4 /*yield*/, AppSetting_1.AppSettingModel.create({
                        key: 'mobile-settings',
                        value: DEFAULT_SETTINGS,
                    })];
            case 2:
                appSetting = _b.sent();
                _b.label = 3;
            case 3:
                newSetting = {
                    id: name_1.toLowerCase().replace(/\s+/g, '-'),
                    name: name_1,
                    enabled: true,
                    type: type,
                    selectedItems: [],
                    availableItems: [],
                    order: appSetting.value.length,
                };
                appSetting.value.push(newSetting);
                return [4 /*yield*/, appSetting.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: newSetting,
                    })];
            case 5:
                error_3 = _b.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.addAppSetting = addAppSetting;
var deleteAppSetting = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id_1, appSetting, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id_1 = request.params.id;
                return [4 /*yield*/, AppSetting_1.AppSettingModel.findOne({ key: 'mobile-settings' })];
            case 1:
                appSetting = _a.sent();
                if (!appSetting) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'App settings not found' })];
                }
                appSetting.value = appSetting.value.filter(function (item) { return item.id !== id_1; });
                return [4 /*yield*/, appSetting.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, reply.send({ success: true, message: 'Setting deleted' })];
            case 3:
                error_4 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteAppSetting = deleteAppSetting;
var editAppSetting = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id_2, _a, name_2, type, appSetting, settingIndex, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id_2 = request.params.id;
                _a = request.body, name_2 = _a.name, type = _a.type;
                return [4 /*yield*/, AppSetting_1.AppSettingModel.findOne({ key: 'mobile-settings' })];
            case 1:
                appSetting = _b.sent();
                if (!appSetting) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'App settings not found' })];
                }
                settingIndex = appSetting.value.findIndex(function (item) { return item.id === id_2; });
                if (settingIndex === -1) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Setting not found' })];
                }
                if (name_2) {
                    appSetting.value[settingIndex].name = name_2;
                }
                if (type) {
                    appSetting.value[settingIndex].type = type;
                }
                return [4 /*yield*/, appSetting.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: appSetting.value[settingIndex],
                    })];
            case 3:
                error_5 = _b.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.editAppSetting = editAppSetting;
var getHomeTabs = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var appSetting, tabs, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, AppSetting_1.AppSettingModel.findOne({ key: 'home-tabs-config' })];
            case 1:
                appSetting = _a.sent();
                tabs = (appSetting === null || appSetting === void 0 ? void 0 : appSetting.value) || [
                    { id: 'drama', name: 'Short Dramas' },
                    { id: 'movie', name: 'Movies & Series' },
                ];
                return [2 /*return*/, reply.send({ success: true, data: tabs })];
            case 2:
                error_6 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getHomeTabs = getHomeTabs;
var updateHomeTabs = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var tabs, appSetting, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                tabs = request.body.tabs;
                return [4 /*yield*/, AppSetting_1.AppSettingModel.findOneAndUpdate({ key: 'home-tabs-config' }, { value: tabs }, { returnDocument: 'after', upsert: true })];
            case 1:
                appSetting = _a.sent();
                return [2 /*return*/, reply.send({ success: true, data: appSetting.value })];
            case 2:
                error_7 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_7.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateHomeTabs = updateHomeTabs;
