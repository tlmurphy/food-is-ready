'use strict';

const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const functions = require('firebase-functions');

exports.addMessage = functions.https.onRequest((req, res) => {
  console.log('Entering test function...');
  const app = new ActionsSdkApp({request: req, response: res});

  function mainIntent(app) {
    console.log('mainIntent');
    let inputPrompt = app.buildInputPrompt(false, 'Say something bitch.');
    app.ask(inputPrompt);
  }

  function rawInput(app) {
    console.log('rawInput');
    if (app.getRawInput() === 'bye') {
      app.tell('Fuck off...');
    } else {
      let inputPrompt = app.buildInputPrompt(false, 'You just said ' +
        app.getRawInput() + '. Say something else I dare ya.');
      app.ask(inputPrompt);
    }
  }

  let actionMap = new Map();
  actionMap.set(app.StandardIntents.MAIN, mainIntent);
  actionMap.set(app.StandardIntents.TEXT, rawInput);

  app.handleRequest(actionMap);
});
