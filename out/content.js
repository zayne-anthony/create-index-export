"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnFileContent = exports.returnIndexContent = void 0;
const returnIndexContent = (fileName) => {
    const INDEX_CONTENT = `export { default } from './${fileName}'`;
    return INDEX_CONTENT;
};
exports.returnIndexContent = returnIndexContent;
const returnFileContent = (fileName, fileExtension) => {
    console.log(fileExtension);
    if (fileExtension === ".ts" || fileExtension === ".tsx") {
        return `import React from "react";\n\ntype ${fileName}Props = {}\n\nexport default function ${fileName}(props: ${fileName}Props) {\n\treturn (\n\t\t<></>\n\t)\n}`;
    }
    return `export default function ${fileName}() {\n\treturn (\n\t\t<></>\n\t)\n}`;
};
exports.returnFileContent = returnFileContent;
//# sourceMappingURL=content.js.map