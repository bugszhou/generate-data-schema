"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path_1 = require("path");
const fs_1 = require("fs");
const transform_1 = require("./transform");
const lodash_1 = require("lodash");
const isDisabled_1 = require("../../helps/isDisabled");
var SupportFileExt;
(function (SupportFileExt) {
    SupportFileExt[SupportFileExt[".json"] = 1] = ".json";
})(SupportFileExt || (SupportFileExt = {}));
function toSnakeCase() {
    return vscode.commands.registerCommand("generate-data-schema.toSnakeCase", async (info) => {
        const filePath = info.path || "";
        const fileObj = (0, path_1.parse)(filePath);
        if (!fileObj.ext || !SupportFileExt[fileObj.ext]) {
            vscode.window.showErrorMessage("目前只支持json文件");
            return;
        }
        const allConfig = vscode.workspace.getConfiguration("generate-data-schema");
        const defaultValue = allConfig.get("snakeCase");
        try {
            const data = JSON.parse((0, fs_1.readFileSync)(filePath, "utf-8") || "{}");
            (0, transform_1.setDefaultValue)(defaultValue);
            const schema = (0, transform_1.default)(data);
            const fileNames = fileObj.name?.split?.(".");
            const fileName = fileNames?.shift() ?? "";
            const targetPath = (0, path_1.join)(fileObj.dir, `get${(0, lodash_1.upperFirst)(fileName)}Schema${fileNames.length ? "." : ""}${fileNames.join(".")}.ts`);
            if ((0, fs_1.existsSync)(targetPath)) {
                const disabled = (0, isDisabled_1.default)((0, fs_1.readFileSync)(targetPath, "utf-8"));
                if (disabled) {
                    vscode.window.showInformationMessage("文件已存在且设置为不可覆盖", {
                        modal: true,
                    });
                    return;
                }
                const confirm = await vscode.window.showInformationMessage("文件已存在，是否要覆盖", {
                    modal: true,
                }, {
                    title: "覆盖",
                });
                if (confirm?.title !== "覆盖") {
                    return;
                }
            }
            (0, fs_1.writeFileSync)(targetPath, `import { IDO } from "data-model-service";

export default function get${(0, lodash_1.upperFirst)(fileName)}Schema() {
  return ${JSON.stringify(schema, null, 4)};
}
						
export type I${(0, lodash_1.upperFirst)(fileName)}DO = IDO<ReturnType<typeof get${(0, lodash_1.upperFirst)(fileName)}Schema>>;`);
            vscode.window.showInformationMessage("转换成功！");
        }
        catch (e) {
            console.log(e);
            vscode.window.showInformationMessage("转换失败！");
        }
    });
}
exports.default = toSnakeCase;
//# sourceMappingURL=index.js.map