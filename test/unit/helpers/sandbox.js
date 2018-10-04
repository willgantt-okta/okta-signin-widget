define(['okta'], function (Okta) {
  const $ = Okta.$;

  let sandbox = $('#sandbox');
  if (!sandbox.length) {
    sandbox = $('<div>').attr('id', 'sandbox').css({ height: '1', overflow: 'hidden' }).appendTo('body');
  }

  return sandbox;
});
