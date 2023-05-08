"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileToPath = void 0;
const vscode_1 = require("vscode");
const util_1 = require("util");
const writeFileToPath = (folderPath, fileName, content) => {
    const folderPathUri = typeof folderPath === "string" ? vscode_1.Uri.file(folderPath) : folderPath;
    const filePath = vscode_1.Uri.joinPath(folderPathUri, fileName);
    vscode_1.workspace.fs.writeFile(filePath, new util_1.TextEncoder().encode(content || ""));
    return;
};
exports.writeFileToPath = writeFileToPath;
//# sourceMappingURL=create-util.js.map