#!/usr/bin/env node

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

const wizard = require("./wizard");
const push = require("./push");
const config = require("./config");
const result = require("./result");

const run = async () => {
  try {
    let data = config.read(argv);
    data = await wizard.type(data);
    data = await wizard.main(data);

    const output = await push.run(data);

    config.save(data);
    result.check(output);
  } catch (error) {
    console.error(error);
  }

  process.exit();
};

run();
