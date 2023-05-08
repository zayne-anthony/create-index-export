import { commands, env, Uri } from "vscode";
import { basename } from "path";

export const getCurrentPathUri = async (uri: Uri) => {
	if (!uri) return;
	if (uri) return uri;

	let folder: Uri | string = uri;

	await commands.executeCommand("copyFilePath");
	folder = await env.clipboard.readText();
	return (folder = await Uri.file(folder));
};

export const returnFilePath = (
	folderPath: Uri | string,
	fileName: string
): Uri => {
	if (typeof folderPath === "string") {
		folderPath = Uri.file(folderPath);
	}
	return Uri.joinPath(folderPath, fileName);
};

export const returnNamesFromPath = (filePath: string) => {
	const fileBaseName = basename(filePath);
	const [name, extension] = fileBaseName.split(".");
	const componentName = name.charAt(0).toUpperCase() + name.slice(1);
	const componentPath = filePath.replace(fileBaseName, componentName);

	return { name, componentPath, componentName, extension };
};
