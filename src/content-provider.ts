import { TextDocumentContentProvider, Uri } from 'vscode';

/**
 * Storage for compare content.
 */
interface ContentStorage {
    source: string;
    target: string;
    clipboard: string;
}

/**
 * Provides the content for compare.
 */
export class ContentProvider implements TextDocumentContentProvider {
    static scheme = 'textcompare';

    storage: ContentStorage;
    sourceOrigin?: string;

    constructor() {
        this.storage = {
            source: '',
            target: '',
            clipboard: '',
        };
    }

    provideTextDocumentContent(uri: Uri): string {
        return this.storage[uri.path as keyof ContentStorage];
    }
}

/**
 * Gets the Uri for the requested type of content.
 *
 * @param type - type of content from ContentStorage
 *
 * @returns Uri
 */
export function getContentUri(type: keyof ContentStorage): Uri {
    const timeStamp = new Date().getTime();
    return Uri.parse(`${ContentProvider.scheme}:${type}?ts=${timeStamp}`);
}
