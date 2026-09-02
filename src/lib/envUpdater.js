"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnvFile = updateEnvFile;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var ENV_PATH = path_1.default.resolve(process.cwd(), '.env');
function updateEnvFile(updates) {
    try {
        var content = '';
        try {
            content = fs_1.default.readFileSync(ENV_PATH, 'utf-8');
        }
        catch (_a) {
            // .env doesn't exist yet — start fresh
        }
        var lines = content.split('\n');
        var _loop_1 = function (key, value) {
            var escaped = value.includes(' ') || value.includes('#') ? "\"".concat(value, "\"") : value;
            var idx = lines.findIndex(function (l) { return l.startsWith("".concat(key, "=")) || l.startsWith("# ".concat(key, "=")); });
            if (idx !== -1) {
                lines[idx] = "".concat(key, "=").concat(escaped);
            }
            else {
                lines.push("".concat(key, "=").concat(escaped));
            }
            // Also apply immediately to the running process
            process.env[key] = value;
        };
        for (var _i = 0, _b = Object.entries(updates); _i < _b.length; _i++) {
            var _c = _b[_i], key = _c[0], value = _c[1];
            _loop_1(key, value);
        }
        fs_1.default.writeFileSync(ENV_PATH, lines.join('\n'), 'utf-8');
    }
    catch (err) {
        console.error('Failed to update .env file:', err);
    }
}
