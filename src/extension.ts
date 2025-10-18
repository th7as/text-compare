import { ExtensionContext, Uri, commands, env, window, workspace } from 'vscode';
import { ContentProvider, getContentUri } from './content-provider';

const contentProvider = new ContentProvider();

/**
 * Activates the Extension.
 *
 * @param context - Extension context
 */
export function activate(context: ExtensionContext): void {
    context.subscriptions.push(workspace.registerTextDocumentContentProvider(ContentProvider.scheme, contentProvider));

    context.subscriptions.push(
        commands.registerCommand('textCompare.setSourceFromSelection', () => {
            contentProvider.storage.source = getSelectedText();
            contentProvider.sourceOrigin = `Selection: ${getDocumentName()}`;
        })
    );

    context.subscriptions.push(
        commands.registerCommand('textCompare.setSourceFromClipboard', async () => {
            contentProvider.storage.source = await env.clipboard.readText();
            contentProvider.sourceOrigin = 'Clipboard';
        })
    );

    context.subscriptions.push(
        commands.registerCommand('textCompare.setSourceFromFile', async () => {
            const files = await window.showOpenDialog();
            if (files && files.length > 0) {
                await setSourceFromFile(files[0]);
            }
        })
    );

    context.subscriptions.push(
        commands.registerCommand('textCompare.setSourceFromExplorer', async (file: Uri) => {
            if (file) {
                await setSourceFromFile(file);
            }
        })
    );

    context.subscriptions.push(
        commands.registerCommand('textCompare.compareSourceWithSelection', async () => {
            contentProvider.storage.target = getSelectedText();
            await commands.executeCommand(
                'vscode.diff',
                getContentUri('source'),
                getContentUri('target'),
                `${contentProvider.sourceOrigin} ↔ Selection: ${getDocumentName()}`
            );
        })
    );

    context.subscriptions.push(
        commands.registerCommand('textCompare.compareSourceWithClipboard', async () => {
            contentProvider.storage.target = await env.clipboard.readText();
            await commands.executeCommand(
                'vscode.diff',
                getContentUri('source'),
                getContentUri('target'),
                `${contentProvider.sourceOrigin} ↔ Clipboard`
            );
        })
    );

    context.subscriptions.push(
        commands.registerCommand('textCompare.compareSourceWithFile', async () => {
            const files = await window.showOpenDialog();
            if (files && files.length > 0) {
                await compareSourceWithFile(files[0]);
            }
        })
    );

    context.subscriptions.push(
        commands.registerCommand('textCompare.compareSourceWithExplorer', async (file: Uri) => {
            if (file) {
                await compareSourceWithFile(file);
            }
        })
    );

    context.subscriptions.push(
        commands.registerCommand('textCompare.compareClipboardWithSelection', async () => {
            contentProvider.storage.clipboard = await env.clipboard.readText();
            contentProvider.storage.target = getSelectedText();
            await commands.executeCommand(
                'vscode.diff',
                getContentUri('clipboard'),
                getContentUri('target'),
                `Clipboard ↔ Selection: ${getDocumentName()}`
            );
        })
    );
}

/**
 * Gets the selected text in the active editor.
 *
 * @returns Selected text
 */
function getSelectedText(): string {
    const editor = window.activeTextEditor;
    return editor ? editor.document.getText(editor.selection.isEmpty ? undefined : editor.selection) : '';
}

/**
 * Gets the name of the document.
 *
 * @param uri - Uri of the requested document or undefined for the active document
 *
 * @returns Name of document
 */
function getDocumentName(uri?: Uri): string {
    const parts = uri ? uri.path.split('/') : window.activeTextEditor?.document.uri.path.split('/');
    return parts && parts.length > 0 ? parts[parts.length - 1] : '';
}

/**
 * Sets the specified file as the source for an upcoming compare.
 *
 * @param uri - Uri of the file
 */
async function setSourceFromFile(uri: Uri): Promise<void> {
    contentProvider.storage.source = (await workspace.fs.readFile(uri)).toString();
    contentProvider.sourceOrigin = `File: ${getDocumentName(uri)}`;
}

/**
 * Compares the specified file with the source.
 *
 * @param uri - Uri of the file
 */
async function compareSourceWithFile(uri: Uri): Promise<void> {
    contentProvider.storage.target = (await workspace.fs.readFile(uri)).toString();
    await commands.executeCommand(
        'vscode.diff',
        getContentUri('source'),
        getContentUri('target'),
        `${contentProvider.sourceOrigin} ↔ File: ${getDocumentName(uri)}`
    );
}
