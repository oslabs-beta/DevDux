// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TreeDataProvider } from "./treeDataProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.window.showOpenDialog({
		canSelectFolders: false,
		canSelectMany: false,
		canSelectFiles: true,
		openLabel: 'Open'
	}).then(fileUri => {
		if (fileUri && fileUri[0]) {
			const devDuxTreeDataProvider = new TreeDataProvider(fileUri[0].fsPath);
			vscode.window.registerTreeDataProvider('devdux-sidebar', devDuxTreeDataProvider);
			vscode.commands.registerCommand('devdux.refreshEntry', () => devDuxTreeDataProvider.refresh());
		}
	});


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "devdux" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('devdux.OpenRootFile', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from DevDux!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
 