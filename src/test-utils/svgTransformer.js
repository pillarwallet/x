/* eslint-disable */
// https://jestjs.io/docs/code-transformation
// noinspection NodeCoreCodingAssistance

const path = require('path');
module.exports = {
  process(sourceText, sourcePath) {
    const pathMock = JSON.stringify(path.basename(sourcePath));
    return {
      code: `
        const React = require('react');
        const SvgMock = React.forwardRef(function SvgMock(props, ref) {
          return React.createElement('svg', Object.assign({}, props, {ref: ref}));
        });
        module.exports.ReactComponent = SvgMock;
        module.exports.default = ${pathMock};
      `,
    };
  },
};
