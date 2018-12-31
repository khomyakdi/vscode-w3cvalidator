import * as vscode from 'vscode';
const URL: string = "https://validator.w3.org/nu/?out=json";
export const validateHtml = function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage("Please open any editor window");
        return;
    }
    console.log(getTextFromEditor(editor));
};
function getTextFromEditor (textEditor: any): string {
    let text =  textEditor.document.getText();
    const selection = textEditor.selection;
    if(selection.start.line !== selection.end.line ||  selection.start.character !== selection.end.character) {
        text = textEditor.document.getText(selection);
    }
   return text;
}