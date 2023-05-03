"use strict";
// const componentContent = `export default function ${componentName}() { return true }`;
// const componentEncode = new TextEncoder().encode(componentContent);
// const indexContent = `export { default } from './${componentName}${this.extension}'`;
// const indexEncode = new TextEncoder().encode(indexContent);
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnIndexContent = exports.returnComponentContent = void 0;
const util_1 = require("util");
const returnEncoded = (content) => {
    return new util_1.TextEncoder().encode(content);
};
const returnComponentContent = (name) => {
    const capitalName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const content = `export default function ${capitalName}() {
    return (
      <>${capitalName}</>
    )
  }`;
    return returnEncoded(content);
};
exports.returnComponentContent = returnComponentContent;
const returnIndexContent = (name, extension) => {
    const content = `export { default } from './${name}${extension}'`;
    return returnEncoded(content);
};
exports.returnIndexContent = returnIndexContent;
//# sourceMappingURL=content.js.map