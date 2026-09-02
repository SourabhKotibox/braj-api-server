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
exports.deleteCountry = exports.updateCountry = exports.createCountry = exports.getCountryById = exports.listCountries = void 0;
var Country_1 = require("../models/Country");
var listCountries = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, isAdminView, filter, _a, countries, total, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, parseInt(query.page || '1', 10));
                limit = Math.min(200, Math.max(1, parseInt(query.limit || '200', 10)));
                isAdminView = query.admin === 'true';
                filter = isAdminView ? {} : { active: true };
                return [4 /*yield*/, Promise.all([
                        Country_1.CountryModel.find(filter)
                            .sort({ name: 1 })
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .lean(),
                        Country_1.CountryModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), countries = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: countries.map(function (country) { return ({
                            id: country._id,
                            name: country.name,
                            code: country.code,
                            active: country.active,
                            createdAt: country.createdAt,
                            updatedAt: country.updatedAt,
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
exports.listCountries = listCountries;
var getCountryById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, country, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, Country_1.CountryModel.findById(id).lean()];
            case 1:
                country = _a.sent();
                if (!country) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Country not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: country._id,
                            name: country.name,
                            code: country.code,
                            active: country.active,
                            createdAt: country.createdAt,
                            updatedAt: country.updatedAt,
                        },
                    })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCountryById = getCountryById;
var createCountry = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, code, active, country, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = request.body, name_1 = _a.name, code = _a.code, active = _a.active;
                if (!name_1 || !code) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Name and code are required' })];
                }
                return [4 /*yield*/, Country_1.CountryModel.create({
                        name: name_1,
                        code: code.toUpperCase(),
                        active: active !== undefined ? active : true,
                    })];
            case 1:
                country = _b.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            id: country._id,
                            name: country.name,
                            code: country.code,
                            active: country.active,
                            createdAt: country.createdAt,
                            updatedAt: country.updatedAt,
                        },
                    })];
            case 2:
                error_3 = _b.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createCountry = createCountry;
var updateCountry = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name_2, code, active, existingCountry, updateData, country, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = request.params.id;
                _a = request.body, name_2 = _a.name, code = _a.code, active = _a.active;
                return [4 /*yield*/, Country_1.CountryModel.findById(id)];
            case 1:
                existingCountry = _b.sent();
                if (!existingCountry) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Country not found' })];
                }
                updateData = {};
                if (name_2 !== undefined)
                    updateData.name = name_2;
                if (code !== undefined)
                    updateData.code = code.toUpperCase();
                if (active !== undefined)
                    updateData.active = active;
                return [4 /*yield*/, Country_1.CountryModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after', runValidators: true }).lean()];
            case 2:
                country = _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: country._id,
                            name: country.name,
                            code: country.code,
                            active: country.active,
                            createdAt: country.createdAt,
                            updatedAt: country.updatedAt,
                        },
                    })];
            case 3:
                error_4 = _b.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateCountry = updateCountry;
var deleteCountry = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, country, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, Country_1.CountryModel.findByIdAndDelete(id)];
            case 1:
                country = _a.sent();
                if (!country) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Country not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Country deleted successfully',
                    })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteCountry = deleteCountry;
