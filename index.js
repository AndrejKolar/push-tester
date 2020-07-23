#!/usr/bin/env node

const fs = require("fs");
const prompts = require("prompts");
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
const ApnsToken = require("./ApnsToken");
const ApnsPair = require("./ApnsPair");
const Firebase = require("./Firebase");

const questions = [
  {
    type: "select",
    name: "type",
    message: "Select push message type",
    choices: [
      {
        title: "iOS - Provider Authentication Token",
        description: ".p8 token",
        value: "p8",
      },
      {
        title: "iOS - Certificate/Key pair",
        description: ".pem cert/key",
        value: "pem",
      },
      {
        title: "iOS/Android - Firebase Cloud Messaging",
        description: "FCM/GCM API key",
        value: "firebase",
      },
    ],
  },
];

// Helpers

const readConfig = (argv) => {
  if (!argv.config) {
    return null;
  }

  const rawdata = fs.readFileSync(argv.config);
  const data = JSON.parse(rawdata);
  return data;
};

// Run

const run = async () => {
  const config = readConfig(argv);

  prompts.override(config);

  const { type } = await prompts(questions);

  switch (type) {
    case "p8":
      ApnsToken.run(config);
      break;
    case "pem":
      ApnsPair.run(config);
      break;
    case "firebase":
      Firebase.run(config);
      break;

    default:
      break;
  }
};

run();
