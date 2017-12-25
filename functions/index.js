'use strict';

const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const functions = require('firebase-functions');

const config = functions.config().fir;
const accountSid = config.account_sid;
const authToken = config.auth_token;
const client = require('twilio')(accountSid, authToken);

exports.addMessage = functions.https.onRequest((req, res) => {
  const app = new ActionsSdkApp({request: req, response: res});

  function mainIntent(app) {
    console.log('Entering Main Intent');
    const to_addresses = config.to.split(',');
    to_addresses.forEach((to) => {
      client.messages.create({
          body: app.getRawInput(),
          to: to,  // Text this number
          from: config.from // From a valid Twilio number
      })
      .then((message) => console.log(message.sid));
    });
    app.tell('Messages sent :)');
  }

  let actionMap = new Map();
  actionMap.set(app.StandardIntents.MAIN, mainIntent);
  app.handleRequest(actionMap);
});
