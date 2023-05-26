import * as vscode from "vscode";
import { join, parse } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import transform, { setDefaultValue } from "./generateDataSchema";
import { upperFirst } from "lodash";
import isDisabled from "../../helps/isDisabled";

enum SupportFileExt {
  ".json" = 1,
}

export default function toCamelCase(command = "extension.data2schema") {
  return vscode.commands.registerCommand(command, async (info) => {
    const filePath = info.path || "";
    const fileObj = parse(filePath);

    if (!fileObj.ext || !SupportFileExt[fileObj.ext as any]) {
      vscode.window.showErrorMessage("目前只支持json文件");
      return;
    }

    const allConfig = vscode.workspace.getConfiguration("generate-data-schema");

    const defaultValue = allConfig.get("default");

    try {
      const data = JSON.parse(readFileSync(filePath, "utf-8") || "{}");

      setDefaultValue(defaultValue);
      const schema = transform(data);
      const fileNames = fileObj.name?.split?.(".");
      const fileName = fileNames?.shift() ?? "";

      const targetPath = join(
        fileObj.dir,
        `get${upperFirst(fileName)}Schema${
          fileNames.length ? "." : ""
        }${fileNames.join(".")}.ts`,
      );

      if (existsSync(targetPath)) {
        const disabled = isDisabled(readFileSync(targetPath, "utf-8"));
        if (disabled) {
          vscode.window.showInformationMessage("文件已存在且设置为不可覆盖", {
            modal: true,
          });
          return;
        }
        const confirm = await vscode.window.showInformationMessage(
          "文件已存在，是否要覆盖",
          {
            modal: true,
          },
          {
            title: "覆盖",
          },
        );

        if (confirm?.title !== "覆盖") {
          return;
        }
      }

      writeFileSync(
        targetPath,
        `import { IDO } from "data-model-service";

export default function get${upperFirst(fileName)}Schema() {
  return ${JSON.stringify(schema, null, 4)};
}
						
export type I${upperFirst(fileName)}DO = IDO<ReturnType<typeof get${upperFirst(
          fileName,
        )}Schema>>;`,
      );
      vscode.window.showInformationMessage("转换成功！");
    } catch (e) {
      console.log(e);
      vscode.window.showInformationMessage("转换失败！");
    }
  });
}
