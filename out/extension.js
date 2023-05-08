"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const index_generator_1 = require("./index-generator");
const workspace_util_1 = require("./util/workspace-util");
const path_util_1 = require("./util/path-util");
// TODO: Update Readme and Republish Extension?
function activate(context) {
    const workspaceRoot = (0, workspace_util_1.getWorkspaceFolder)(vscode_1.workspace.workspaceFolders);
    const generator = new index_generator_1.IndexGenerator(workspaceRoot);
    // * Creates folder from path or name
    // Type: Command | Input: Absolute Path
    // Type: Command | Input: Component Name
    let fromPath = vscode_1.commands.registerCommand("create.fromPath", async (uri) => {
        const currentPath = await (0, path_util_1.getCurrentPathUri)(uri);
        generator.onFromPath(currentPath);
    });
    context.subscriptions.push(fromPath);
    // * Creates file from folder name
    // Type: Context | From: Folder
    let fromFolder = vscode_1.commands.registerCommand("create.fromFolder", async (uri) => {
        const folderPath = await (0, path_util_1.getCurrentPathUri)(uri);
        generator.onFromFolder(folderPath);
    });
    context.subscriptions.push(fromFolder);
    // * Creates folder from component file
    // Type: Context | From: File
    let fromFile = vscode_1.commands.registerCommand("create.fromFile", async (uri) => {
        const filePath = await (0, path_util_1.getCurrentPathUri)(uri);
        generator.onFromFile(filePath);
    });
    context.subscriptions.push(fromFile);
    // * Creates multiple component folders from array
    // Type: Context | From: Folder
    // Type: Command | Input: Absolute Path
    let fromMultiple = vscode_1.commands.registerCommand("create.fromMultiple", async (uri) => {
        const folderPath = await (0, path_util_1.getCurrentPathUri)(uri);
        generator.onFromMultiple(folderPath);
    });
    context.subscriptions.push(fromMultiple);
    // * Creates all single component files into component folders
    // Type: Context | From: Folder
    let fromSingleFiles = vscode_1.commands.registerCommand("create.fromSingleFiles", async (uri) => {
        const folderPath = await (0, path_util_1.getCurrentPathUri)(uri);
        generator.onFromSingleFiles(folderPath);
    });
    context.subscriptions.push(fromSingleFiles);
    context.subscriptions.push(generator);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map