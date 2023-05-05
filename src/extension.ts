import { commands, workspace, ExtensionContext } from "vscode";
import { IndexGenerator } from "./index-generator";
import { getWorkspaceFolder } from "./util/workspace-util";
import { getCurrentPathUri } from "./util/uri-util";

// TODO: Be able to right click a file and create folder with index

export function activate(context: ExtensionContext) {
	const workspaceRoot: string = getWorkspaceFolder(workspace.workspaceFolders);
	const generator = new IndexGenerator(workspaceRoot);

	// * Creates files in folder from context menu
	let fromContextFolder = commands.registerCommand(
		"create.fromContextFolder",
		async (uri) => {
			const folder = await getCurrentPathUri(uri);

			generator.onExecute(folder, false);
		}
	);

	context.subscriptions.push(fromContextFolder);

	// * Creates folder & files from context menu
	let fromContext = commands.registerCommand(
		"create.fromContext",
		async (uri) => {
			const folder = await getCurrentPathUri(uri);

			generator.onExecute(folder, true);
		}
	);

	context.subscriptions.push(fromContext);

	// * Creates folder & files from absolute path
	let fromPath = commands.registerCommand("create.fromPath", () => {
		generator.onExecute();
	});

	context.subscriptions.push(fromPath);

	// * Creates folder from component file
	let fromFile = commands.registerCommand("create.fromFile", async (uri) => {
		const file = await getCurrentPathUri(uri);

		generator.onMoveToFolder(file);
	});

	context.subscriptions.push(fromFile);

	context.subscriptions.push(generator);
}

export function deactivate() {}
