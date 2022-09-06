require('./licenseRelease');
const { createXMochaHooks } = require('./mochaHooks');

const mochaHooks = createXMochaHooks();

// The JSDOM implementation is too slow
// https://github.com/jsdom/jsdom/issues/3234
window.getComputedStyle = function getComputedStyleMock() {
  return {
    getPropertyValue: () => {
      return undefined;
    },
  };
};

module.exports = { mochaHooks };
