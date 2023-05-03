"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentPathUri = void 0;
const vscode_1 = require("vscode");
const getCurrentPathUri = async (uri) => {
    let folder = uri;
    if (uri) {
        return uri;
    }
    await vscode_1.commands.executeCommand("copyFilePath");
    folder = await vscode_1.env.clipboard.readText();
    return (folder = await vscode_1.Uri.file(folder));
};
exports.getCurrentPathUri = getCurrentPathUri;
//# sourceMappingURL=uri-util.js.map