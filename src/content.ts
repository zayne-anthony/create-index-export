export const returnIndexContent = (fileName: string): string => {
	const INDEX_CONTENT = `export { default } from './${fileName}'`;
	return INDEX_CONTENT;
};

export const returnComponentContent = (fileName: string): string => {
	const COMPONENT_CONTENT = `export default function ${fileName}() {
			return (
				<>${fileName}</>
			)
		}`;
	return COMPONENT_CONTENT;
};
