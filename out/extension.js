"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path_1 = require("path");
const fs_1 = require("fs");
const generateDataSchema_1 = require("./generateDataSchema");
const lodash_1 = require("lodash");
var SupportFileExt;
(function (SupportFileExt) {
    SupportFileExt[SupportFileExt[".json"] = 1] = ".json";
})(SupportFileExt || (SupportFileExt = {}));
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let disposable = vscode.commands.registerCommand("extension.data2schema", (info) => {
        const filePath = info.path || "";
        const fileObj = (0, path_1.parse)(filePath);
        if (!fileObj.ext || !SupportFileExt[fileObj.ext]) {
            vscode.window.showErrorMessage("目前只支持json文件");
            return;
        }
        const allConfig = vscode.workspace.getConfiguration("generate-data-schema");
        const defaultValue = allConfig.get("default");
        try {
            const data = JSON.parse((0, fs_1.readFileSync)(filePath, "utf-8") || "{}");
            (0, generateDataSchema_1.setDefaultValue)(defaultValue);
            const schema = (0, generateDataSchema_1.default)(data);
            const fileName = fileObj.name;
            (0, fs_1.writeFileSync)((0, path_1.join)(fileObj.dir, `${fileName}.ts`), `import { IDO } from "data-model-service";

export default function getSchema() {
return ${JSON.stringify(schema, null, 2)};
						}
						
export type I${(0, lodash_1.capitalize)(fileName)}DO = IDO<ReturnType<typeof getSchema>>;`);
            vscode.window.showInformationMessage("转换成功！");
        }
        catch (e) {
            console.log(e);
            vscode.window.showInformationMessage("转换失败！");
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map