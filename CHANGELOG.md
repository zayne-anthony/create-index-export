# Change Log

## 1.0.0 - Initial Release

- Create Index: Component
- Create Index: Multiple Components
- Create Index: From Folder
- Create Index: From File
- Create Index: From Component(s)

### 1.0.1 - Patch

- Fixed all commands defaulting to `Default Component Folder` setting

### 1.1.0 - Default Content Updates

- Added Typescript default content for `.ts`/`.tsx` file formats
- Added new `defaultContent` setting, to either include or leave out default content in component files
- Changed spaces in default content to `\n` (new lines) and `\t` (tabs) respectively

### 1.1.1 - Fixed all files using `.tsx` content

- Fixed a bug where all file types were using Typescript default content on creation
