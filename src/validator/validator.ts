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
    .then( data => console.log(data))
    .catch(statusCode => console.log('error: '+statusCode));
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
        function(error,response, body) {
            
            if(response.statusCode === 200) {
                resolve(JSON.parse(body));
            }
            else {
                reject(response.statusCode);
            }
        });
    });
}
