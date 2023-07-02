export const returnIndexContent = (fileName: string): string => {
	const INDEX_CONTENT = `export { default } from './${fileName}'`;
	return INDEX_CONTENT;
};

export const returnFileContent = (
	fileName: string,
	fileExtension: string
): string => {
	console.log(fileExtension);
	if (fileExtension === ".ts" || fileExtension === ".tsx") {
		return `import React from "react";\n\ntype ${fileName}Props = {}\n\nexport default function ${fileName}(props: ${fileName}Props) {\n\treturn (\n\t\t<></>\n\t)\n}`;
	}
	return `export default function ${fileName}() {\n\treturn (\n\t\t<></>\n\t)\n}`;
};
