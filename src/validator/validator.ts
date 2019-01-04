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
    // const selection = textEditor.selection;
    // if(selection.start.line !== selection.end.line ||  selection.start.character !== selection.end.character) {
    //     text = textEditor.document.getText(selection);
    // }
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
    const lastLine: number = textEditor.document.lineCount;
	const lastColumn = textEditor.document.lineAt(lastLine-1).text.length;
    const pos = new vscode.Position(lastLine+1, lastColumn);

    let validationString = '\n<!-- VALIDATION RESULT\n';
    for (let message of validationResult.messages) {
        validationString +=  writeMessage (message) + "\n";
    }
    if(validationResult.messages.length === 0) {
        validationString += "HTML is valid\n";
    } 
    validationString += '-->';
    
    textEditor.edit((edBuilder: vscode.TextEditorEdit) => {
        edBuilder.insert(pos, validationString);
    });
}
function writeMessage (message: any) {
    let position  = "";
    if(message.firstLine) {
        position += `first Line = ${message.firstLine}, `;
    }
    if(message.lastLine) {
        position += `last Line = ${message.lastLine}, `;
    }
    if(message.firstColumn) {
        position += `first Column = ${message.firstColumn}, `;
    }
    if(message.lastColumn) {
        position += `last Column = ${message.lastColumn}`;
    }
    return `${message.type}: ${position}, ${message.message};`;
}