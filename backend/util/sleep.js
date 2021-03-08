"use strict";
exports.__esModule = true;
exports.sleep = void 0;
// zzz
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.sleep = sleep;
