// const componentContent = `export default function ${componentName}() { return true }`;
// const componentEncode = new TextEncoder().encode(componentContent);
// const indexContent = `export { default } from './${componentName}${this.extension}'`;
// const indexEncode = new TextEncoder().encode(indexContent);

import { TextEncoder } from "util";

const returnEncoded = (content: string): Uint8Array => {
	return new TextEncoder().encode(content);
};

export const returnComponentContent = (name: string): Uint8Array => {
	const capitalName =
		name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

	const content = `export default function ${capitalName}() {
    return (
      <>${capitalName}</>
    )
  }`;

	return returnEncoded(content);
};

export const returnIndexContent = (
	name: string,
	extension: string
): Uint8Array => {
	const content = `export { default } from './${name}${extension}'`;
	return returnEncoded(content);
};
