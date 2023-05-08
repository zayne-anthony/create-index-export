import { commands, env, Uri } from "vscode";
import { basename } from "path";

export const getCurrentPathUri = async (uri: Uri) => {
	if (!uri) return;
	if (uri) return uri;

	let folder: string | Uri = uri;

	await commands.executeCommand("copyFilePath");
	folder = await env.clipboard.readText();
	return (folder = await Uri.file(folder));
};

export const returnFilePath = (folderPath: Uri, fileName: string): Uri => {
	return Uri.joinPath(folderPath, fileName);
};

export const returnNamesFromPath = (filePath: string) => {
	const [name, extension] = basename(filePath).split(".");
	const componentName = name.charAt(0).toUpperCase() + name.slice(1);

	return { name, componentName, extension };
};
