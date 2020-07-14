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

const questions = [
  {
    type: "select",
    name: "type",
    message: "Type of push certificate:",
    choices: [
      {
        title: "Provider Authentication Token",
        description: ".p8 token",
        value: "p8",
      },
      {
        title: "Certificate/Key pair",
        description: ".pem cert/key pair",
        value: "pem",
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

    default:
      break;
  }
};

run();
