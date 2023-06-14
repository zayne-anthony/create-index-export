import { workspace, window, Uri } from "vscode";
import { returnFileContent, returnIndexContent } from "./content";
import { returnFilePath, returnNamesFromPath } from "./util/path-util";
import { writeFileToPath } from "./util/create-util";

export class IndexGenerator {
	private readonly config = workspace.getConfiguration("create");

	private readonly defaultExtension: string =
		this.config.get("defaultFileExtension") || "jsx";

	private readonly defaultFolder: string =
		this.config.get("defaultComponentFolder") || "./src/components";

	private readonly defaultContent: boolean =
		this.config.get("defaultContent") || true;

	constructor(private workspaceRoot: string) {}

	toAbsoluteUri(nameOrPath: string): Uri {
		const workspaceUri = Uri.file(this.workspaceRoot);

		nameOrPath = workspace.asRelativePath(nameOrPath);

		if (/\/|\\/.test(nameOrPath)) {
			return Uri.joinPath(workspaceUri, nameOrPath);
		} else {
			return Uri.joinPath(workspaceUri, this.defaultFolder, nameOrPath);
		}
	}

	onValidate(input: string): string | null {
		if (!input) {
			return "Path or Name is required";
		}

		if (input.includes(" ")) {
			return "Spaces are not allowed";
		}

		return null;
	}

	async onPrompt(prompt: string) {
		const options = {
			ignoreFocusOut: true,
			prompt,
			validateInput: this.onValidate,
		};

		return await window.showInputBox(options);
	}

	async onCreate(folderUri: Uri, fileName: string, extension?: string) {
		if (!folderUri) return;

		// Use default extension if one is not clarified
		extension = `.${extension || this.defaultExtension}`;

		// Check "Preserve" setting - Default "true"
		const PRESERVE_FILES = this.config.get("preserveAlreadyCreatedFiles");

		// Check "Create Css File" setting - Default "false"
		const CREATE_CSS_FILE = this.config.get("createCssFile");

		try {
			const INDEX_FILE = `index${extension}`;
			const INDEX_CONTENT = returnIndexContent(fileName);
			const COMPONENT_FILE = `${fileName}${extension}`;
			const COMPONENT_CONTENT = this.defaultContent
				? returnFileContent(fileName, extension)
				: "";
			const CSS_FILE = `${fileName.toLowerCase()}.css`;

			if (PRESERVE_FILES) {
				// Checks if component file already exists
				try {
					await workspace.fs.stat(returnFilePath(folderUri, COMPONENT_FILE));
				} catch {
					writeFileToPath(folderUri, COMPONENT_FILE, COMPONENT_CONTENT);
				}

				// Checks if index file already exists
				try {
					await workspace.fs.stat(returnFilePath(folderUri, INDEX_FILE));
				} catch {
					writeFileToPath(folderUri, INDEX_FILE, INDEX_CONTENT);
				}

				// Checks if css file already exists
				if (CREATE_CSS_FILE) {
					try {
						await workspace.fs.stat(returnFilePath(folderUri, CSS_FILE));
					} catch {
						writeFileToPath(folderUri, CSS_FILE);
					}
				}
			} else {
				writeFileToPath(folderUri, COMPONENT_FILE, COMPONENT_CONTENT);
				writeFileToPath(folderUri, INDEX_FILE, INDEX_CONTENT);
				if (CREATE_CSS_FILE) writeFileToPath(folderUri, CSS_FILE);
			}

			window.showInformationMessage(`'${COMPONENT_FILE}' folder created`);
		} catch {}
	}

	async onFromPath(folderPath?: Uri | undefined) {
		let nameOrPath: string | undefined;

		if (!folderPath) {
			nameOrPath = await this.onPrompt(
				`Absolute path or component name - Default Path: ${this.defaultFolder}`
			);
		} else {
			const input = await this.onPrompt(
				`Component name - Default Extension: .${this.defaultExtension}`
			);
			if (!input) return;

			nameOrPath = returnFilePath(folderPath, input).fsPath;
		}

		if (!nameOrPath) return;

		// Get input name, capitalized name, and extension from input
		const { componentPath, componentName, extension } =
			returnNamesFromPath(nameOrPath);

		// Get absolute folder path uri
		const absoluteFolderUri = this.toAbsoluteUri(componentPath);

		try {
			this.onCreate(absoluteFolderUri, componentName, extension);
		} catch (err) {}
	}

	async onFromFolder(folderPath?: Uri | undefined) {
		if (!folderPath) return;

		// Get input name, capitalized name, and extension from input
		const { componentPath, componentName, extension } = returnNamesFromPath(
			folderPath.fsPath
		);

		// Get absolute folder path uri
		const absoluteFolderUri = this.toAbsoluteUri(componentPath);

		await workspace.fs.rename(folderPath, absoluteFolderUri);

		try {
			this.onCreate(absoluteFolderUri, componentName, extension);
		} catch (err) {}
	}

	async onFromFile(filePath?: Uri | undefined) {
		if (!filePath) return;

		// Get input name, capitalized name, and extension from input
		const { componentPath, componentName, extension } = returnNamesFromPath(
			filePath.fsPath
		);

		const nameWithExtension = `${componentName}.${
			extension || this.defaultExtension
		}`;

		// Get absolute folder path uri
		const absoluteFolderUri = this.toAbsoluteUri(componentPath);

		// Uri path of target folder
		const targetUri = returnFilePath(absoluteFolderUri, nameWithExtension);

		await workspace.fs.copy(filePath, targetUri);
		workspace.fs.delete(filePath);

		try {
			this.onCreate(absoluteFolderUri, componentName, extension);
		} catch (err) {}
	}

	async onFromMultiple(folderPath?: Uri | undefined) {
		let nameOrPath: string;

		if (!folderPath) {
			nameOrPath =
				(await window.showInputBox({
					ignoreFocusOut: true,
					prompt: `Absolute Path or Blank for Default Path - '${this.defaultFolder}'`,
				})) || this.defaultFolder;
		} else {
			nameOrPath = folderPath.fsPath;
		}

		const filesFromInput = await this.onPrompt(
			`Component names (Seperate with comma) - Ex: 'Button,Table,Input'`
		);

		if (!filesFromInput) return;

		const components: Array<string> = filesFromInput.split(",");

		components.forEach((component) => {
			// Get input name, capitalized name, and extension from input
			const { componentName, extension } = returnNamesFromPath(component);

			const componentPath = returnFilePath(nameOrPath, componentName);

			// Get absolute folder path uri
			const absoluteFolderUri = this.toAbsoluteUri(componentPath.fsPath);

			try {
				this.onCreate(absoluteFolderUri, componentName, extension);
			} catch (err) {}
		});
	}

	async onFromSingleFiles(folderPath?: Uri | undefined) {
		if (!folderPath) return;

		const filesInFolder = await workspace.fs.readDirectory(folderPath);

		filesInFolder.forEach(async (file) => {
			// Get input name, capitalized name, and extension from input
			const [fileName, fileType] = file;
			const { componentName, extension } = returnNamesFromPath(fileName);

			// Return if extension does not equal default extension
			// Return if folder
			if (fileType !== 1 || extension !== this.defaultExtension) {
				return;
			}

			// Get absolute folder path uri
			const absoluteFolderUri = returnFilePath(folderPath, componentName);

			// Get file path uri
			const absoluteFileUri = returnFilePath(folderPath, fileName);

			// Uri path of target folder
			const targetUri = returnFilePath(absoluteFolderUri, `${fileName}`);

			await workspace.fs.copy(absoluteFileUri, targetUri);
			workspace.fs.delete(absoluteFileUri);

			try {
				this.onCreate(absoluteFolderUri, componentName, extension);
			} catch (err) {}
		});
	}

	dispose(): void {
		console.log("disposing...");
	}
}
