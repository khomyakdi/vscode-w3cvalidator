import * as vscode from 'vscode';
import * as request from 'request';
const API_URL: string = "https://validator.w3.org/nu/?out=json";
export const validateHtml = function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage("Please open any editor window");
        return;
    }
    getValidationFromApi(getTextFromEditor(editor))
    .then( data => showValidation(data, editor))
    .catch(error => vscode.window.showInformationMessage('error: ' + error));
};
function getTextFromEditor (textEditor: any): string {
    let text =  textEditor.document.getText();
    const selection = textEditor.selection;
    if(selection.start.line !== selection.end.line ||  selection.start.character !== selection.end.character) {
        text = textEditor.document.getText(selection);
    }
   return text;
}
function getValidationFromApi (text: string): Promise<any> {
    return new Promise((resolve, reject) => {
        request.post( {
            headers: { 'Content-Type': 'text/html',
                'User-Agent': 'vscode'
            },
            url: API_URL,
            body: text
        },
        function(error, response, body) {
            
            if(response.statusCode === 200) {
                resolve(JSON.parse(body));
            }
            else {
                reject(error);
            }
        });
    });
}
function showValidation(validationResult: any, textEditor: any) {
    let pos = new vscode.Position(textEditor.selection.end.line + 1, 0);
    for (let message of validationResult.messages) {
        if (message.lastLine) {
            writeMessageWithPosition(message.lastLine, textEditor, pos);
        } else {
            writeMessage (message, textEditor, pos);
        }
       pos = pos.with(pos.line + 1, 0);
    }
}
function writeMessageWithPosition (message: any, editor: any,  pos: vscode.Position) {

}
function writeMessage (message: any, editor: any, pos: vscode.Position) {

}