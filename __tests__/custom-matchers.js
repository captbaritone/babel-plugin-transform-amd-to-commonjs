const babel = require('babel-core');

const customMatchers = {
  toBeTransformedTo: () => {
    const transformAmdToCommonJS = (code) => {
      return babel.transform(code, { plugins: ['./index'] }).code;
    };

    const transformTrivial = (code) => {
      return babel.transform(code).code;
    };

    const removeBlankLines = (string) => {
      return string.split('\n').filter(line => !!line.trim().length).join('\n');
    };

    return {
      compare(actual, expected) {
        const transformed = transformAmdToCommonJS(actual);
        actual = removeBlankLines(transformTrivial(actual));
        expected = removeBlankLines(transformTrivial(expected));
        const result = {
          pass: removeBlankLines(transformed) === expected
        };
        if(result.pass) {
          result.message = `Expected\n\n${actual}\n\nnot to be transformed ` +
            `to\n\n${expected}\n\nbut instead they were the same.\n`;
        } else {
          result.message = `Expected\n\n${actual}\n\nto be transformed ` +
            `to\n\n${expected}\n\nbut instead got\n\n${transformed}\n`;
        }
        return result;
      }
    };
  }
};

module.exports = customMatchers;
