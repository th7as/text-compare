# Text Compare

Compare/diff text from
* a selection in a file or
* the clipboard or
* the entire content of any text file

with
* a selection in a file or
* the clipboard or
* the entire content of any text file

![Screenshot](https://raw.githubusercontent.com/th7as/text-compare/master/images/demo.png)

## Commands

This extension contributes the following commands:

### Set the source for an upcoming compare
* `textCompare.setSourceFromSelection`: Sets the source for an upcoming compare from the text selection in the active editor.
    If there is no text selection in the active editor then the entire text of the editor is used.
* `textCompare.setSourceFromClipboard`: Sets the source for an upcoming compare from the text in the clipboard.
* `textCompare.setSourceFromFile`: Sets the source for an upcoming compare from the entire content of a selected text file.

### Compare the previously set source
* `textCompare.compareSourceWithSelection`: Compares the previously set source with the text selection in the active editor.
    If there is no text selection in the active editor then the entire text of the editor is used.
* `textCompare.compareSourceWithClipboard`: Compares the previously set source with the text in the clipboard.
* `textCompare.compareSourceWithFile`: Compares the previously set source with the entire content of a selected text file.

### Compare immediately
* `textCompare.compareClipboardWithSelection`: Immediately compares the text in the clipboard with the text selection in the active editor.
    If there is no text selection in the active editor then the entire text of the editor is used.

## Settings

This extension contributes the following setting:

* `textCompare.hideCommandsInEditorContextMenu`: If enabled then hides the Text Compare commands in the editor context menu.
