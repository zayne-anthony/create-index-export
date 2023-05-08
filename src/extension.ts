import { commands, workspace, ExtensionContext } from "vscode";
import { IndexGenerator } from "./index-generator";
import { getWorkspaceFolder } from "./util/workspace-util";
import { getCurrentPathUri } from "./util/path-util";

export function activate(context: ExtensionContext) {
	const workspaceRoot: string = getWorkspaceFolder(workspace.workspaceFolders);
	const generator = new IndexGenerator(workspaceRoot);

	// * Creates folder from path or name
	// Type: Command | Input: Absolute Path
	// Type: Command | Input: Component Name
	let fromPath = commands.registerCommand("create.fromPath", async (uri) => {
		const currentPath = await getCurrentPathUri(uri);

		generator.onFromPath(currentPath);
	});

	context.subscriptions.push(fromPath);

	// * Creates file from folder name
	// Type: Context | On: Folder
	let fromFolder = commands.registerCommand(
		"create.fromFolder",
		async (uri) => {
			const folderPath = await getCurrentPathUri(uri);

			generator.onFromFolder(folderPath);
		}
	);

	context.subscriptions.push(fromFolder);

	// * Creates folder from component file
	// Type: Context | On: File
	let fromFile = commands.registerCommand("create.fromFile", async (uri) => {
		const filePath = await getCurrentPathUri(uri);

		generator.onFromFile(filePath);
	});

	context.subscriptions.push(fromFile);

	// * Creates multiple component folders from array
	// Type: Context | On: Folder | Input: Component Names
	// Type: Command | Input: Absolute Path | Input: Component Names
	let fromMultiple = commands.registerCommand(
		"create.fromMultiple",
		async (uri) => {
			const folderPath = await getCurrentPathUri(uri);

			generator.onFromMultiple(folderPath);
		}
	);

	context.subscriptions.push(fromMultiple);

	// * Creates all single component files into component folders
	// Type: Context | On: Folder
	let fromSingleFiles = commands.registerCommand(
		"create.fromSingleFiles",
		async (uri) => {
			const folderPath = await getCurrentPathUri(uri);

			generator.onFromSingleFiles(folderPath);
		}
	);

	context.subscriptions.push(fromSingleFiles);

	context.subscriptions.push(generator);
}

export function deactivate() {}
