// creating an interface for the VS Code Extension window namespace so that
import { InputBoxOptions } from "vscode";

export interface VSCodeWindow {
	showErrorMessage(message: string): Thenable<string>;
	showInformationMessage(message: string): Thenable<string>;
	showInputBox(options?: InputBoxOptions): Thenable<string | undefined>;
}
