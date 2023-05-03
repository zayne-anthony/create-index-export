"use strict";
// TODO: Have command to turn all single files from components into index folder exports
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexGenerator = void 0;
const vscode_1 = require("vscode");
const path_1 = require("path");
const content_1 = require("./content");
const util_1 = require("util");
class IndexGenerator {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this.extension = vscode_1.workspace.getConfiguration("create").get("defaultFileExtension") || ".jsx";
    }
    toAbsolutePath(nameOrRelativePath) {
        // if (/\/|\\/.test(nameOrRelativePath)) {
        return (0, path_1.resolve)(this.workspaceRoot, nameOrRelativePath);
        // }
    }
    onValidate(name) {
        if (!name) {
            return "Name is required";
        }
        if ((0, path_1.basename)(name).includes(".") && name.length > 2) {
            return "Don't add the extention, can change extension in settings";
        }
        if (name.includes(" ")) {
            return "Spaces are not allowed";
        }
        return null;
    }
    async onPrompt(inputPath) {
        const options = {
            ignoreFocusOut: true,
            prompt: inputPath
                ? `Absolute path: './src/components/ComponentName'`
                : `Name of component: 'Datepicker'`,
            validateInput: this.onValidate,
        };
        return await vscode_1.window.showInputBox(options);
    }
    async onCreate(absolutePath, componentName) {
        const directoryUri = vscode_1.Uri.file(absolutePath);
        const writeFileToPath = (fileName, content) => {
            const fullPath = vscode_1.Uri.joinPath(directoryUri, fileName);
            if (!content) {
                content = new util_1.TextEncoder().encode("");
            }
            vscode_1.workspace.fs.writeFile(fullPath, content);
        };
        const preserveFiles = vscode_1.workspace
            .getConfiguration("create")
            .get("preserveAlreadyCreatedFiles");
        const createCSSFile = vscode_1.workspace
            .getConfiguration("create")
            .get("createCssFile");
        try {
            const indexFileName = `index${this.extension}`;
            const indexContent = (0, content_1.returnIndexContent)(componentName, this.extension);
            const componentFileName = `${componentName}${this.extension}`;
            const componentContent = (0, content_1.returnComponentContent)(componentName);
            const cssFileName = `${componentName.toLowerCase()}.css`;
            if (preserveFiles) {
                // * Checks if component file already exists
                try {
                    await vscode_1.workspace.fs.stat(vscode_1.Uri.joinPath(directoryUri, componentFileName));
                    vscode_1.window.showErrorMessage("Component file already exists");
                }
                catch {
                    writeFileToPath(componentFileName, componentContent);
                    vscode_1.window.showInformationMessage(`'${componentFileName}' successfully created`);
                }
                // * Checks if index file already exists
                try {
                    await vscode_1.workspace.fs.stat(vscode_1.Uri.joinPath(directoryUri, indexFileName));
                    vscode_1.window.showErrorMessage("Index file already exists");
                }
                catch {
                    writeFileToPath(indexFileName, indexContent);
                    vscode_1.window.showInformationMessage(`'${indexFileName}' successfully created`);
                }
                // * Checks if css file already exists
                if (createCSSFile) {
                    try {
                        await vscode_1.workspace.fs.stat(vscode_1.Uri.joinPath(directoryUri, cssFileName));
                        vscode_1.window.showErrorMessage("CSS file already exists");
                    }
                    catch {
                        writeFileToPath(cssFileName);
                        vscode_1.window.showInformationMessage(`'${cssFileName}' successfully created`);
                    }
                }
            }
            else {
                writeFileToPath(componentFileName, componentContent);
                writeFileToPath(indexFileName, indexContent);
                if (createCSSFile) {
                    writeFileToPath(cssFileName);
                }
                vscode_1.window.showInformationMessage(`'${componentFileName}' successfully created`);
            }
        }
        catch { }
    }
    async onExecute(folderPath, createFolder) {
        let componentPath;
        if (folderPath && !createFolder) {
            componentPath = folderPath.fsPath;
        }
        else if (folderPath && createFolder) {
            const input = await this.onPrompt(false);
            componentPath = input ? `${folderPath.fsPath}/${input}` : null;
        }
        else {
            componentPath = await this.onPrompt(true);
        }
        if (!componentPath) {
            return;
        }
        const name = (0, path_1.basename)(componentPath);
        const componentName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        const absolutePath = this.toAbsolutePath(componentPath.replace(name, componentName));
        // * Rename folder to capitalize, if exists
        if (folderPath && !createFolder) {
            vscode_1.workspace.fs.rename(folderPath, vscode_1.Uri.file(absolutePath));
        }
        try {
            this.onCreate(absolutePath, componentName);
        }
        catch (err) {
            // if (err instanceof DuckExistError) {
            //   this.window.showErrorMessage(`Duck: '${duckname}' already exists`);
            // } else {
            //   this.window.showErrorMessage(`Error: ${err.message}`);
            // }
        }
    }
    dispose() {
        console.log("disposing...");
    }
}
exports.IndexGenerator = IndexGenerator;
//# sourceMappingURL=index-generator.js.map