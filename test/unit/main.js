// require('./vendor/jasmine-jquery');
// var Okta = require('okta');
// var $ = Okta.$;

// // Create a hidden sandbox
// $('<div>').attr('id', 'sandbox').css({height: 1, overflow: 'hidden'}).appendTo('body');

// function requireAll(requireContext) {
//   requireContext.keys().map(requireContext);
// }

// // Load all the specs
// requireAll(require.context('./spec', true, /.*/));


const karma = window.__karma__;
const testsContext = require.context('./spec', true, /.*_spec\.js$/);

testsContext.keys().forEach(key => {
  // Filtered List
  if (karma.config.test && !key.includes(karma.config.test)) {
    return;
  }
  testsContext(key);
});
