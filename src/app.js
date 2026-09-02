"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = __importDefault(require("fastify"));
var cors_1 = __importDefault(require("@fastify/cors"));
var jwt_1 = __importDefault(require("@fastify/jwt"));
var multipart_1 = __importDefault(require("@fastify/multipart"));
var static_1 = __importDefault(require("@fastify/static"));
var compress_1 = __importDefault(require("@fastify/compress"));
var path_1 = __importDefault(require("path"));
var url_1 = require("url");
var routes_1 = __importDefault(require("./routes"));
var context_1 = require("./lib/context");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var fastify = (0, fastify_1.default)({
    logger: true,
    bodyLimit: 2000 * 1024 * 1024 // 2GB
});
// Register request context lifecycle hook
fastify.addHook('onRequest', function (request, reply, done) {
    var _a;
    var authHeader = request.headers.authorization;
    var user = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            var token = authHeader.substring(7);
            var decoded = (_a = request.server.jwt) === null || _a === void 0 ? void 0 : _a.decode(token);
            if (decoded) {
                user = {
                    id: decoded.id || decoded._id,
                    email: decoded.email,
                    role: decoded.role,
                    name: decoded.name
                };
            }
        }
        catch (e) {
            // Ignore token decode errors
        }
    }
    context_1.requestContext.run({ user: user }, function () {
        done();
    });
});
// ── JSON body parser (MUST be registered BEFORE multipart) ───────────────────
// @fastify/multipart intercepts ALL POST/PUT body streams globally.
// Without this explicit parser, JSON bodies on non-upload routes are left
// undefined, causing "Cannot destructure property of request.body" errors.
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    try {
        done(null, body ? JSON.parse(body) : {});
    }
    catch (err) {
        err.statusCode = 400;
        done(err, undefined);
    }
});
// Enable compression for faster responses
fastify.register(compress_1.default, {
    global: false,
    encodings: ['gzip', 'deflate', 'br']
});
// Enable CORS
fastify.register(cors_1.default, {
    origin: true,
    credentials: true,
});
// Register JWT plugin
fastify.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || 'fallback-secret-for-development-only'
});
// Register Multipart for file uploads with optimized config
fastify.register(multipart_1.default, {
    limits: {
        fileSize: 2000 * 1024 * 1024, // 2GB
        files: 10 // Max files per request
    }
});
// Register Static file serving
fastify.register(static_1.default, {
    root: path_1.default.join(__dirname, '../uploads'),
    prefix: '/uploads/'
});
// Register all routes
fastify.register(routes_1.default, { prefix: '/api' });
exports.default = fastify;
