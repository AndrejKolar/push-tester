#!/usr/bin/env node

const PushNotifications = require("node-pushnotifications");
const prompts = require("prompts");

const questions = [
  {
    type: "text",
    name: "keyId",
    message: "Input your keyId:",
  },
  {
    type: "text",
    name: "teamId",
    message: "Input your teamId:",
  },
  {
    type: "text",
    name: "key",
    message: "Input your p8 path:",
  },
  {
    type: "text",
    name: "bundleId",
    message: "Input your bundle id:",
  },
  {
    type: "toggle",
    name: "production",
    message: "Environment:",
    initial: false,
    active: "production",
    inactive: "sandbox",
  },
  {
    type: "text",
    name: "pushToken",
    message: "Input your APNS token:",
  },
  {
    type: "text",
    name: "title",
    message: "Enter message title:",
  },
  {
    type: "text",
    name: "body",
    message: "Enter message body:",
  },
];

(async () => {
  const response = await prompts(questions);

  const {
    key,
    pushToken,
    teamId,
    keyId,
    bundleId,
    title,
    body,
    production,
  } = response;

  const settings = {
    apn: {
      token: {
        key,
        keyId,
        teamId,
      },
      production,
    },
  };
  const push = new PushNotifications(settings);

  const registrationIds = pushToken;

  const data = {
    topic: bundleId,
    title,
    body,
  };

  const results = await push.send(registrationIds, data);
  console.log(JSON.stringify(results, 0, 2));
  process.exit();
})();
