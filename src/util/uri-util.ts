import { commands, env, Uri } from "vscode";

export const getCurrentPathUri = async (uri: Uri) => {
	let folder: string | Uri = uri;

	if (uri) {
		return uri;
	}

	await commands.executeCommand("copyFilePath");
	folder = await env.clipboard.readText();
	return (folder = await Uri.file(folder));
};
