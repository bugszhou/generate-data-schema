// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import toCamelCase from "./commands/toCamelCase";
import toSnakeCase from "./commands/toSnakeCase";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const camelCase = toCamelCase();
  const toCamelCaseCommand = toCamelCase("generate-data-schema.toCamelCase");
  const snakeCase = toSnakeCase();

  context.subscriptions.push(camelCase, toCamelCaseCommand, snakeCase);
}

// this method is called when your extension is deactivated
export function deactivate() {}
