"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnComponentContent = exports.returnIndexContent = void 0;
const returnIndexContent = (fileName) => {
    const INDEX_CONTENT = `export { default } from './${fileName}'`;
    return INDEX_CONTENT;
};
exports.returnIndexContent = returnIndexContent;
const returnComponentContent = (fileName) => {
    const COMPONENT_CONTENT = `export default function ${fileName}() {
			return (
				<>${fileName}</>
			)
		}`;
    return COMPONENT_CONTENT;
};
exports.returnComponentContent = returnComponentContent;
//# sourceMappingURL=content.js.map