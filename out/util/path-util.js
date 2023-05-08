"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnNamesFromPath = exports.returnFilePath = exports.getCurrentPathUri = void 0;
const vscode_1 = require("vscode");
const path_1 = require("path");
const getCurrentPathUri = async (uri) => {
    if (!uri)
        return;
    if (uri)
        return uri;
    let folder = uri;
    await vscode_1.commands.executeCommand("copyFilePath");
    folder = await vscode_1.env.clipboard.readText();
    return (folder = await vscode_1.Uri.file(folder));
};
exports.getCurrentPathUri = getCurrentPathUri;
const returnFilePath = (folderPath, fileName) => {
    return vscode_1.Uri.joinPath(folderPath, fileName);
};
exports.returnFilePath = returnFilePath;
const returnNamesFromPath = (filePath) => {
    const [name, extension] = (0, path_1.basename)(filePath).split(".");
    const componentName = name.charAt(0).toUpperCase() + name.slice(1);
    return { name, componentName, extension };
};
exports.returnNamesFromPath = returnNamesFromPath;
//# sourceMappingURL=path-util.js.map