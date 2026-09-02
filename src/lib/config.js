"use strict";
/**
 * Shared runtime configuration — read from environment variables.
 *
 * This is the single source of truth for API_URL / BASE_URL.
 * All controllers that build shareUrl, deeplinks, or absolute URLs
 * must import from here instead of duplicating the constant.
 *
 * Set API_URL in .env to your production server:
 *   API_URL=https://brajcinema.tv/api
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildShareUrl = exports.API_URL = void 0;
/** Base API URL — strips trailing slash for consistency */
exports.API_URL = (process.env.API_URL || 'https://brajcinema.tv/api').replace(/\/$/, '');
/**
 * Build a smart share / deep-link URL for a content item.
 * Points to the backend redirect endpoint which resolves to the app or store.
 *
 * Example output: https://brajcinema.tv/api/share/64abc123...
 */
var buildShareUrl = function (itemId) {
    return "".concat(exports.API_URL, "/share/").concat(itemId);
};
exports.buildShareUrl = buildShareUrl;
