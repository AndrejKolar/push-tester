const fs = require("fs");

const save = async (data) => {
  const { save, config } = data;
  if (!save) {
    return;
  }

  const toSave = { ...data };
  delete toSave.save;
  delete toSave.config;
  delete toSave.hasConfig;

  const file = JSON.stringify(toSave, null, 2);
  fs.writeFileSync(config, file);
};

const read = (argv) => {
  if (!argv.config) {
    return null;
  }

  const rawdata = fs.readFileSync(argv.config);
  const data = JSON.parse(rawdata);
  return { ...data, hasConfig: true };
};

exports.save = save;
exports.read = read;
