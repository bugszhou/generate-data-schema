"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDisabled(content) {
    if (content?.includes("@data2schema-disabled")) {
        return true;
    }
    return false;
}
exports.default = isDisabled;
//# sourceMappingURL=isDisabled.js.map