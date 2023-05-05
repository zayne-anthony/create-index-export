"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const index_generator_1 = require("./index-generator");
const workspace_util_1 = require("./util/workspace-util");
const uri_util_1 = require("./util/uri-util");
// TODO: Be able to right click a file and create folder with index
function activate(context) {
    const workspaceRoot = (0, workspace_util_1.getWorkspaceFolder)(vscode_1.workspace.workspaceFolders);
    const generator = new index_generator_1.IndexGenerator(workspaceRoot);
    // * Creates files in folder from context menu
    let fromContextFolder = vscode_1.commands.registerCommand("create.fromContextFolder", async (uri) => {
        const folder = await (0, uri_util_1.getCurrentPathUri)(uri);
        generator.onExecute(folder, false);
    });
    context.subscriptions.push(fromContextFolder);
    // * Creates folder & files from context menu
    let fromContext = vscode_1.commands.registerCommand("create.fromContext", async (uri) => {
        const folder = await (0, uri_util_1.getCurrentPathUri)(uri);
        generator.onExecute(folder, true);
    });
    context.subscriptions.push(fromContext);
    // * Creates folder & files from absolute path
    let fromPath = vscode_1.commands.registerCommand("create.fromPath", () => {
        generator.onExecute();
    });
    context.subscriptions.push(fromPath);
    // * Creates folder from component file
    let fromFile = vscode_1.commands.registerCommand("create.fromFile", async (uri) => {
        const file = await (0, uri_util_1.getCurrentPathUri)(uri);
        generator.onMoveToFolder(file);
    });
    context.subscriptions.push(fromFile);
    context.subscriptions.push(generator);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map