"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const toCamelCase_1 = require("./commands/toCamelCase");
const toSnakeCase_1 = require("./commands/toSnakeCase");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const camelCase = (0, toCamelCase_1.default)();
    const snakeCase = (0, toSnakeCase_1.default)();
    context.subscriptions.push(camelCase, snakeCase);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map