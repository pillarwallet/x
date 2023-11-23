// https://jestjs.io/docs/code-transformation
/* eslint-disable */
// noinspection NodeCoreCodingAssistance

const path = require('path');

module.exports = {
  process(sourceText, sourcePath) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`,
    };
  },
};
