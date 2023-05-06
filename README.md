# Create Index Export

This extension is to make components easier with a folder and index export. You can create the component folder by right clicking on a folder and selecting `Create Index: From Input Name` or `Create Index: From Folder Name`. `From Folder Name` will create the index and component file from the folder name. `From Input Name` will have a input box appear to name the component you are trying to create. There are also keybinds for this as long as you are hovering over the parent and/or component folder. Default for these are `Crtl+F1` and `Ctrl+F2`. There is a third command that you can call from the command pallete that takes an absolute path. You do **NOT** need to add the extension. For example, `./src/components/Datepicker`.

Ex:
-Datepicker (Parent Folder)
--Datepicker.jsx (Main Component File)
--index.jsx (Exports Datepicker.jsx)
--datepicker.css (CSS for Component)

Allowing the import to be as follows: `components/Datepicker`

## Features

- File extension changing (ts, tsx, js, jsx)
- Creating component based on folder name, input inside folder, or by absolute path
- Creating a CSS file with the rest of the component files

## Extension Settings

This extension contributes the following settings:

- `create.preserveAlreadyCreatedFiles`: Override already made files in folder. (Replaces content)
- `create.createCssFile`: Create a CSS file alongside index and component file.

## Release Notes

### 1.0.0

Initial release containing:

- File extension changing (ts, tsx, js, jsx)
- Creating component based on folder name, input inside folder, or by absolute path
- Creating a CSS file with the rest of the component files

### 1.1.0

- Added command to create component folder from single component file. (Right click file)
- Fixed camel-case files/folders getting uncamel-cased

#### Patch

- Changed description for "Perserve Already Created Files"
