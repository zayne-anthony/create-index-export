"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceFolder = void 0;
const getWorkspaceFolder = (folders) => {
    if (!folders) {
        return "";
    }
    const folder = folders[0] || {};
    const uri = folder.uri;
    return uri.fsPath;
};
exports.getWorkspaceFolder = getWorkspaceFolder;
//# sourceMappingURL=workspace-util.js.map