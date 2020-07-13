#!/usr/bin/env node

const PushNotifications = require("node-pushnotifications");
const prompts = require("prompts");
const fs = require("fs");

// prompts.override({ keyId: "fool", teamId: "teamId" });

const questions = [
  {
    type: "text",
    name: "keyId",
    message: "Enter your keyId:",
  },
  {
    type: "text",
    name: "teamId",
    message: "Enter your teamId:",
  },
  {
    type: "text",
    name: "key",
    message: "Enter your p8 path:",
  },
  {
    type: "text",
    name: "bundleId",
    message: "Enter your bundle id:",
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
    message: "Enter your APNS token:",
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
  {
    type: "confirm",
    name: "save",
    message: "Save this configuration?",
    initial: true,
  },
];

(async () => {
  const response = await prompts(questions);
  const pushSettings = createPushSettings(response);
  const tokenArray = createTokenArray(response);
  const messageData = createMessageData(response);
  saveResponse(response);

  const push = new PushNotifications(pushSettings);

  try {
    const results = await push.send(tokenArray, messageData);
    checkResults(results);
  } catch (error) {
    console.error(error);
  }
  process.exit();
})();

const createPushSettings = ({ key, teamId, keyId, production }) => {
  return {
    apn: {
      token: {
        key,
        keyId,
        teamId,
      },
      production,
    },
  };
};

const createMessageData = ({ bundleId, title, body }) => {
  return {
    topic: bundleId,
    title,
    body,
  };
};

const createTokenArray = ({ pushToken }) => {
  return [pushToken];
};

const saveResponse = ({ save }) => {
  if (!save) {
    return;
  }

  delete response.save;

  let data = JSON.stringify(response, null, 2);
  fs.writeFileSync("config.p8.json", data);
};

const checkResults = (results) => {
  results.forEach((result) => {
    checkResult(result);
  });
};

const checkResult = (result) => {
  result.message.forEach((message) => {
    if (message.error === null) {
      console.log("Push message sent successfuly!");
    } else {
      console.error("Error sending push message");
    }
    console.error(message);
  });
};
