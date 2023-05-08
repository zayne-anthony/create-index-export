# Create Index Export

This extension is to make components folder with an index export easier. You can create a component by an already existing folder, creating the files inside the folder. Another way is using an absolute path or component name, which will use the `Default Folder` setting `'./src/components'`. This allows you to set a default file extension `js, jsx, ts, tsx` or can put your own when creating the component(s). Needing to create a folder based off a already made file? Well you can do that to. Got a whole folder needing that treatment? Got you covered, you can turn a whole folder of stray component files into folder with one command. This command though does use the default extension setting to look for the files that will be converted. There are quite a few ways covered in this extension to help you in creating component folders quicker.

Created Example:
-Datepicker (Parent Folder)\
--Datepicker.jsx (Main Component File)\
--index.jsx (Exports Datepicker.jsx)\
--datepicker.css (CSS for Component, if setting is on)\

Allowing the import to be as follows: `components/Datepicker`

## Features

- Create component folder from already made file or file(s)
- Create component folder from absolute path or name
- Create multiple components from one command
- Set a default extension or use one on the fly
- Set a default folder path towards your components or use an absolute path

### Commands/Actions

`Type: Context`: Can access this by right clicking on files/folders inside explorer view\n
`On: Folder` or `On: File`: What item needs to be right clicked for access to that command

- Create Index: Component
  - Creates component from either absolute path or name
  - `Type: Command | Input: Absolute Path or Component Name`
  - `Type: Context | On: Folder | Input: Component Name`
  - Ex: `./src/features` or `DatePicker`
- Create Index: From Folder
  - Creates component files inside an already exisitng folder
  - `Type: Context | On: Folder`
- Create Index: From File
  - Creates folder for component from already existing file
  - `Type: Context | On: File`
- Create Index: Multiple Components
  - Creates component(s) from string of component names. Can use absolute path `command` or create inside folder `context`
  - `Type: Context | On: Folder | Input: Component Names`,
  - `Type: Command | Input: Absolute Path | Input: Component Names`
  - Ex: `Button,Table,DatePicker`, each file can include a different extension
- Create Index: From Component(s)
  - Creates folder from all stray component files using the `Default File Extension` setting
  - `Type: Context | On: Folder`

## Extension Settings

This extension contributes the following settings:

- `create.defaultComponentFolder`: Default absolute path towards your components to quick create
  - Default: `'./src/components'`
- `create.preserveAlreadyCreatedFiles`: Override already made files in folder. (Replace content)
  - Default: `true`
- `create.createCssFile`: Create a CSS file alongside index and component file.
  - Default: `false`

## Release Notes

### 1.0.0

Initial release:

- Create Index: Component
- Create Index: Multiple Components
- Create Index: From Folder
- Create Index: From File
- Create Index: From Component(s)
