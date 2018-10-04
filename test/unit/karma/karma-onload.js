/* eslint-env browser */

// Overriding the karma start method to execute the tests once the dom is ready
// Without this, the start method is triggered before the dom is loaded,
// which could result in failing tests
const karma = window.__karma__;

const originalStart = karma.start;
karma.start = function () {
  const args = arguments;
  document.addEventListener('DOMContentLoaded', () => {
    originalStart(...args);
  });
};
