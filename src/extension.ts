// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {validateHtml } from './validator/validator';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "vscode-w3cvalidator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
	let validator = vscode.commands.registerCommand('extension.validateHTML',validateHtml);
	context.subscriptions.push(validator);
	let testExtension = vscode.commands.registerCommand('extension.testExtension', () => {
		const editor:vscode.TextEditor = vscode.window.activeTextEditor;
		let lastLine: number = editor.document.lineCount;
		let lastColumn = editor.document.lineAt(lastLine-1).text.length;
		const pos = new vscode.Position(lastLine+1, lastColumn);
		console.log(lastLine);
		console.log(lastColumn+1);
		
		let outputString = "\n";
		 for(let i = 0; i < 10; i ++) {
			outputString += i.toString() + '\n';
		 }
		editor.edit((edBuilder: vscode.TextEditorEdit) => {
			edBuilder.insert(pos, outputString);
		});
	});
	context.subscriptions.push(testExtension);
}

// this method is called when your extension is deactivated
export function deactivate() {}
