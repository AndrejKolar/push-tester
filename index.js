#!/usr/bin/env node

const PushNotifications = require("node-pushnotifications");
const prompts = require("prompts");
const fs = require("fs");
const argv = require("yargs")
  .usage("Usage: npx push-tester [options]")
  .example("npx push-tester", "Run script")
  .example(
    "npx push-tester -c config.push.json",
    "Run script with params from a config file"
  )
  .alias("c", "config")
  .nargs("c", 1)
  .describe("c", "Load options from the config file")
  .help("h")
  .alias("h", "help")
  .alias("v", "version").argv;

// Helpers

const showSave = () => {
  return !argv.config;
};
const showConfig = (prev) => {
  if (argv.config) {
    return false;
  }

  if (!prev) {
    return false;
  }

  return true;
};

const checkArguments = (argv) => {
  if (argv.config) {
    const config = readConfig(argv.config);
    prompts.override(config);
  }
};

const readConfig = (config) => {
  const rawdata = fs.readFileSync(config);
  const data = JSON.parse(rawdata);
  return data;
};

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

const createMessageData = ({ bundleId, title, body, badge, sound }) => {
  return {
    topic: bundleId,
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
    type: "number",
    name: "badge",
    message: "Enter app badge:",
    initial: 1,
  },
  {
    type: "text",
    name: "sound",
    message: "Enter notification sound:",
    initial: "default",
  },
  {
    type: showSave() ? "confirm" : null,
    name: "save",
    message: "Save this configuration?",
    initial: true,
  },
  {
    type: (prev) => (showConfig(prev) ? "text" : null),
    name: "config",
    message: "Enter config filename:",
    initial: "config.push.json",
  },
];

// Run script

const run = async () => {
  checkArguments(argv);

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

run();
