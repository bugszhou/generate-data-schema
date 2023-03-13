// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { join, parse } from "path";
import { readFileSync, writeFileSync } from "fs";
import transform, { setDefaultValue } from "./generateDataSchema";
import { upperFirst } from "lodash";

enum SupportFileExt {
  ".json" = 1,
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.data2schema",
    (info) => {
      const filePath = info.path || "";
      const fileObj = parse(filePath);

      if (!fileObj.ext || !SupportFileExt[fileObj.ext as any]) {
        vscode.window.showErrorMessage("目前只支持json文件");
        return;
      }

      const allConfig = vscode.workspace.getConfiguration(
        "generate-data-schema",
      );

      const defaultValue = allConfig.get("default");

      try {
        const data = JSON.parse(readFileSync(filePath, "utf-8") || "{}");
        setDefaultValue(defaultValue);
        const schema = transform(data);
        const fileName = fileObj.name;
        writeFileSync(
          join(fileObj.dir, `get${upperFirst(fileName)}Schema.ts`),
          `import { IDO } from "data-model-service";

export default function get${upperFirst(fileName)}Schema() {
  return ${JSON.stringify(schema, null, 4)};
}
						
export type I${upperFirst(fileName)}DO = IDO<ReturnType<typeof get${upperFirst(fileName)}Schema>>;`,
        );
        vscode.window.showInformationMessage("转换成功！");
      } catch (e) {
        console.log(e);
        vscode.window.showInformationMessage("转换失败！");
      }
    },
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
