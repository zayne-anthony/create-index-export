"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexGenerator = void 0;
const vscode_1 = require("vscode");
const content_1 = require("./content");
const path_util_1 = require("./util/path-util");
const create_util_1 = require("./util/create-util");
class IndexGenerator {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this.config = vscode_1.workspace.getConfiguration("create");
        this.defaultExtension = this.config.get("defaultFileExtension") || "jsx";
        this.defaultFolder = this.config.get("defaultComponentFolder") || "./src/components";
    }
    toAbsoluteUri(nameOrPath) {
        const workspaceUri = vscode_1.Uri.file(this.workspaceRoot);
        if (/\/|\\/.test(nameOrPath)) {
            return vscode_1.Uri.joinPath(workspaceUri, nameOrPath);
        }
        else {
            return vscode_1.Uri.joinPath(workspaceUri, this.defaultFolder, nameOrPath);
        }
    }
    onValidate(input) {
        if (!input) {
            return "Path or Name is required";
        }
        if (input.includes(" ")) {
            return "Spaces are not allowed";
        }
        return null;
    }
    async onPrompt(prompt) {
        const options = {
            ignoreFocusOut: true,
            prompt,
            validateInput: this.onValidate,
        };
        return await vscode_1.window.showInputBox(options);
    }
    async onCreate(folderUri, fileName, extension) {
        if (!folderUri)
            return;
        // Use default extension if one is not clarified
        extension = `.${extension || this.defaultExtension}`;
        // Check "Preserve" setting - Default "true"
        const PRESERVE_FILES = this.config.get("preserveAlreadyCreatedFiles");
        // Check "Create Css File" setting - Default "false"
        const CREATE_CSS_FILE = this.config.get("createCssFile");
        try {
            const INDEX_FILE = `index${extension}`;
            const INDEX_CONTENT = (0, content_1.returnIndexContent)(fileName);
            const COMPONENT_FILE = `${fileName}${extension}`;
            const COMPONENT_CONTENT = (0, content_1.returnComponentContent)(fileName);
            const CSS_FILE = `${fileName.toLowerCase()}.css`;
            if (PRESERVE_FILES) {
                // Checks if component file already exists
                try {
                    await vscode_1.workspace.fs.stat((0, path_util_1.returnFilePath)(folderUri, COMPONENT_FILE));
                }
                catch {
                    (0, create_util_1.writeFileToPath)(folderUri, COMPONENT_FILE, COMPONENT_CONTENT);
                }
                // Checks if index file already exists
                try {
                    await vscode_1.workspace.fs.stat((0, path_util_1.returnFilePath)(folderUri, INDEX_FILE));
                }
                catch {
                    (0, create_util_1.writeFileToPath)(folderUri, INDEX_FILE, INDEX_CONTENT);
                }
                // Checks if css file already exists
                if (CREATE_CSS_FILE) {
                    try {
                        await vscode_1.workspace.fs.stat((0, path_util_1.returnFilePath)(folderUri, CSS_FILE));
                    }
                    catch {
                        (0, create_util_1.writeFileToPath)(folderUri, CSS_FILE);
                    }
                }
            }
            else {
                (0, create_util_1.writeFileToPath)(folderUri, COMPONENT_FILE, COMPONENT_CONTENT);
                (0, create_util_1.writeFileToPath)(folderUri, INDEX_FILE, INDEX_CONTENT);
                if (CREATE_CSS_FILE)
                    (0, create_util_1.writeFileToPath)(folderUri, CSS_FILE);
            }
            vscode_1.window.showInformationMessage(`'${COMPONENT_FILE}' folder created`);
        }
        catch { }
    }
    async onFromPath(folderPath) {
        let nameOrPath;
        if (!folderPath) {
            nameOrPath = await this.onPrompt(`Absolute path or component name - Default Path: ${this.defaultFolder}, can change this in settings`);
        }
        else {
            nameOrPath = await this.onPrompt(`Component name - Default Extension: .${this.defaultExtension}`);
        }
        if (!nameOrPath)
            return;
        // Get input name, capitalized name, and extension from input
        const { componentName, extension } = (0, path_util_1.returnNamesFromPath)(nameOrPath);
        // Get absolute folder path uri
        const absoluteFolderUri = this.toAbsoluteUri(componentName);
        try {
            this.onCreate(absoluteFolderUri, componentName, extension);
        }
        catch (err) { }
    }
    async onFromFolder(folderPath) {
        if (!folderPath)
            return;
        // Get input name, capitalized name, and extension from input
        const { componentName, extension } = (0, path_util_1.returnNamesFromPath)(folderPath.fsPath);
        // Get absolute folder path uri
        const absoluteFolderUri = this.toAbsoluteUri(componentName);
        await vscode_1.workspace.fs.rename(folderPath, absoluteFolderUri);
        try {
            this.onCreate(absoluteFolderUri, componentName, extension);
        }
        catch (err) { }
    }
    async onFromFile(filePath) {
        if (!filePath)
            return;
        // Get input name, capitalized name, and extension from input
        const { componentName, extension } = (0, path_util_1.returnNamesFromPath)(filePath.fsPath);
        const nameWithExtension = `${componentName}.${extension || this.defaultExtension}`;
        // Get absolute folder path uri
        const absoluteFolderUri = this.toAbsoluteUri(componentName);
        // Uri path of target folder
        const targetUri = (0, path_util_1.returnFilePath)(absoluteFolderUri, nameWithExtension);
        await vscode_1.workspace.fs.copy(filePath, targetUri);
        vscode_1.workspace.fs.delete(filePath);
        try {
            this.onCreate(absoluteFolderUri, componentName, extension);
        }
        catch (err) { }
    }
    async onFromMultiple(folderPath) {
        if (!folderPath) {
            folderPath = await vscode_1.window.showInputBox({
                ignoreFocusOut: true,
                prompt: `Absolute Path or Blank for Default Path - '${this.defaultFolder}'`,
            });
        }
        const filesFromInput = await this.onPrompt(`Component names (Seperate with comma) - Ex: 'Button,Table,Input'`);
        if (!filesFromInput)
            return;
        const components = filesFromInput.split(",");
        components.forEach((component) => {
            // Get input name, capitalized name, and extension from input
            const { componentName, extension } = (0, path_util_1.returnNamesFromPath)(component);
            // Get absolute folder path uri
            const absoluteFolderUri = this.toAbsoluteUri(componentName);
            try {
                this.onCreate(absoluteFolderUri, componentName, extension);
            }
            catch (err) { }
        });
    }
    async onFromSingleFiles(folderPath) {
        if (!folderPath)
            return;
        const folderFiles = await vscode_1.workspace.fs.readDirectory(folderPath);
        // return folderFiles.forEach((file) => console.log(file));
        folderFiles.forEach(async (file) => {
            // Get input name, capitalized name, and extension from input
            const [fileName, fileType] = file;
            const { componentName, extension } = (0, path_util_1.returnNamesFromPath)(fileName);
            // Return if extension does not equal default extension
            // Return if folder
            if (fileType !== 1 || extension !== this.defaultExtension) {
                return;
            }
            // Get absolute folder path uri
            const absoluteFolderUri = this.toAbsoluteUri(componentName);
            // Get file path uri
            const absoluteFileUri = this.toAbsoluteUri(fileName);
            // Uri path of target folder
            const targetUri = (0, path_util_1.returnFilePath)(absoluteFolderUri, `${fileName}`);
            await vscode_1.workspace.fs.copy(absoluteFileUri, targetUri);
            vscode_1.workspace.fs.delete(absoluteFileUri);
            try {
                this.onCreate(absoluteFolderUri, componentName, extension);
            }
            catch (err) { }
        });
    }
    dispose() {
        console.log("disposing...");
    }
}
exports.IndexGenerator = IndexGenerator;
//# sourceMappingURL=index-generator.js.map