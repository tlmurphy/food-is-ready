'use strict';

const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const functions = require('firebase-functions');

const config = functions.config().fir;
const accountSid = config.account_sid;
const authToken = config.auth_token;
const client = require('twilio')(accountSid, authToken);


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
      const to_addresses = config.to.split(',');
      to_addresses.forEach((to) => {
        client.messages.create({
            body: app.getRawInput(),
            to: config.to.split(','),  // Text this number
            from: config.from // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
      });
      app.ask(inputPrompt);
    }
  }

  let actionMap = new Map();
  actionMap.set(app.StandardIntents.MAIN, mainIntent);
  actionMap.set(app.StandardIntents.TEXT, rawInput);

  app.handleRequest(actionMap);
});
