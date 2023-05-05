// TODO: Have command to turn all single files from components into index folder exports

import { workspace, window, Uri } from "vscode";
import { resolve, basename } from "path";
import { returnComponentContent, returnIndexContent } from "./content";
import { TextEncoder } from "util";

export class IndexGenerator {
	private readonly extension: string =
		workspace.getConfiguration("create").get("defaultFileExtension") || ".jsx";

	constructor(private workspaceRoot: string) {}

	toAbsolutePath(nameOrRelativePath: string): string {
		// if (/\/|\\/.test(nameOrRelativePath)) {
		return resolve(this.workspaceRoot, nameOrRelativePath);
		// }
	}

	onValidate(name: string): string | null {
		if (!name) {
			return "Name is required";
		}

		if (basename(name).includes(".") && name.length > 2) {
			return "Don't add the extention, can change extension in settings";
		}

		if (name.includes(" ")) {
			return "Spaces are not allowed";
		}

		return null;
	}

	async onPrompt(inputPath: boolean) {
		const options = {
			ignoreFocusOut: true,
			prompt: inputPath
				? `Absolute path: './src/components/ComponentName'`
				: `Name of component: 'Datepicker'`,
			validateInput: this.onValidate,
		};

		return await window.showInputBox(options);
	}

	async onCreate(absolutePath: string, componentName: string) {
		const directoryUri = Uri.file(absolutePath);

		const writeFileToPath = (fileName: string, content?: Uint8Array) => {
			const fullPath = Uri.joinPath(directoryUri, fileName);

			if (!content) {
				content = new TextEncoder().encode("");
			}

			workspace.fs.writeFile(fullPath, content);
		};

		const preserveFiles = workspace
			.getConfiguration("create")
			.get("preserveAlreadyCreatedFiles");

		const createCSSFile = workspace
			.getConfiguration("create")
			.get("createCssFile");

		try {
			const indexFileName = `index${this.extension}`;
			const indexContent = returnIndexContent(componentName, this.extension);
			const componentFileName = `${componentName}${this.extension}`;
			const componentContent = returnComponentContent(componentName);
			const cssFileName = `${componentName.toLowerCase()}.css`;

			if (preserveFiles) {
				// * Checks if component file already exists
				try {
					await workspace.fs.stat(
						Uri.joinPath(directoryUri, componentFileName)
					);
					window.showErrorMessage("Component file already exists");
				} catch {
					writeFileToPath(componentFileName, componentContent);
					window.showInformationMessage(
						`'${componentFileName}' successfully created`
					);
				}

				// * Checks if index file already exists
				try {
					await workspace.fs.stat(Uri.joinPath(directoryUri, indexFileName));
					window.showErrorMessage("Index file already exists");
				} catch {
					writeFileToPath(indexFileName, indexContent);
					window.showInformationMessage(
						`'${indexFileName}' successfully created`
					);
				}

				// * Checks if css file already exists
				if (createCSSFile) {
					try {
						await workspace.fs.stat(Uri.joinPath(directoryUri, cssFileName));
						window.showErrorMessage("CSS file already exists");
					} catch {
						writeFileToPath(cssFileName);
						window.showInformationMessage(
							`'${cssFileName}' successfully created`
						);
					}
				}
			} else {
				writeFileToPath(componentFileName, componentContent);
				writeFileToPath(indexFileName, indexContent);
				if (createCSSFile) {
					writeFileToPath(cssFileName);
				}

				window.showInformationMessage(
					`'${componentFileName}' successfully created`
				);
			}
		} catch {}
	}

	async onExecute(folderPath?: Uri, createFolder?: boolean) {
		let componentPath;

		if (folderPath && !createFolder) {
			componentPath = folderPath.fsPath;
		} else if (folderPath && createFolder) {
			const input = await this.onPrompt(false);
			componentPath = input ? `${folderPath.fsPath}/${input}` : null;
		} else {
			componentPath = await this.onPrompt(true);
		}

		if (!componentPath) {
			return;
		}

		const name = basename(componentPath);
		let componentName = name.charAt(0).toUpperCase() + name.slice(1);

		if (componentName.includes(".")) {
			componentName = componentName.split(".")[0];
		}

		const absolutePath = this.toAbsolutePath(
			componentPath.replace(name, componentName)
		);

		// * Rename folder to capitalize, if exists
		if (folderPath && !createFolder) {
			workspace.fs.rename(folderPath, Uri.file(absolutePath));
		}

		try {
			this.onCreate(absolutePath, componentName);
		} catch (err) {}
	}

	async onMoveToFolder(fileUri?: Uri) {
		if (!fileUri) {
			return;
		}

		let componentPath = fileUri.fsPath;

		const name = basename(componentPath);
		let componentName = name.charAt(0).toUpperCase() + name.slice(1);

		if (componentName.includes(".")) {
			componentName = componentName.split(".")[0];
		}

		const absolutePath = this.toAbsolutePath(
			componentPath.replace(name, componentName)
		);

		const targetUri = Uri.joinPath(
			Uri.file(absolutePath),
			`${componentName}${this.extension}`
		);

		await workspace.fs.copy(fileUri, targetUri);
		workspace.fs.delete(fileUri);

		try {
			this.onCreate(absolutePath, componentName);
		} catch (err) {}
	}

	dispose(): void {
		console.log("disposing...");
	}
}
