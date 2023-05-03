import { commands, workspace, ExtensionContext } from "vscode";
import { IndexGenerator } from "./index-generator";
import { getWorkspaceFolder } from "./util/workspace-util";
import { getCurrentPathUri } from "./util/uri-util";

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

	let fromPath = commands.registerCommand("create.fromPath", () => {
		generator.onExecute();
	});

	context.subscriptions.push(fromPath);

	context.subscriptions.push(generator);
}

export function deactivate() {}
