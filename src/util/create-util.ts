import { Uri, workspace } from "vscode";
import { TextEncoder } from "util";

export const writeFileToPath = (
	folderPath: string | Uri,
	fileName: string,
	content?: string
) => {
	const folderPathUri =
		typeof folderPath === "string" ? Uri.file(folderPath) : folderPath;

	const filePath = Uri.joinPath(folderPathUri, fileName);

	workspace.fs.writeFile(filePath, new TextEncoder().encode(content || ""));
	return;
};
