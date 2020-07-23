#!/usr/bin/env node

const PushNotifications = require("node-pushnotifications");
const prompts = require("prompts");
const fs = require("fs");

// Helpers

const showSave = (config) => {
  return !config;
};
const showConfig = (config, prev) => {
  if (config) {
    return false;
  }

  if (!prev) {
    return false;
  }

  return true;
};

const createPushSettings = ({ key }) => {
  return {
    gcm: {
      id: key,
    },
  };
};

const createMessageData = ({ title, body, badge, sound }) => {
  return {
    title,
    body,
    badge,
    sound,
  };
};

const createTokenArray = ({ pushToken }) => {
  return [pushToken];
};

const saveResponse = (response) => {
  const { save, config } = response;
  if (!save) {
    return;
  }

  const toSave = { ...response };
  delete toSave.save;
  delete toSave.config;
  toSave.type = "firebase";

  let data = JSON.stringify(toSave, null, 2);
  fs.writeFileSync(config, data);
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

const createQuestions = (config) => {
  return [
    {
      type: "text",
      name: "key",
      message: "Enter your GCM/FCM API key:",
    },
    {
      type: "text",
      name: "pushToken",
      message: "Enter your registration token:",
    },
    {
      type: "text",
      name: "title",
      message: "Enter message title:",
      initial: "Test message",
    },
    {
      type: "text",
      name: "body",
      message: "Enter message body:",
      initial: "Hello world!",
    },
    {
      type: showSave(config) ? "confirm" : null,
      name: "save",
      message: "Save this configuration?",
      initial: true,
    },
    {
      type: (prev) => (showConfig(config, prev) ? "text" : null),
      name: "config",
      message: "Enter config filename:",
      initial: "config.push.json",
    },
  ];
};

// Run

const run = async (config) => {
  prompts.override(config);

  const questions = createQuestions(config);

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
};

exports.run = run;
