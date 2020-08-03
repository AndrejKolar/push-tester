const PushNotifications = require("node-pushnotifications");

// settings

const createSettingsToken = ({ key, teamId, keyId, production }) => {
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

const createSettingsPair = ({ cert, key, production }) => {
  return {
    apn: {
      cert,
      key,
      production,
    },
  };
};

const createSettingsFirebase = ({ key }) => {
  return {
    gcm: {
      id: key,
    },
  };
};

const createSettings = (config) => {
  const { type } = config;

  switch (type) {
    case "p8":
      return createSettingsToken(config);
    case "pem":
      return createSettingsPair(config);
    case "firebase":
      return createSettingsFirebase(config);
  }
};

// token

const createToken = ({ pushToken }) => {
  return [pushToken];
};

// data

const createData = ({ bundleId, title, body, badge, sound }) => {
  return {
    topic: bundleId,
    title,
    body,
    badge,
    sound,
  };
};

// run

const run = async (config) => {
  const settings = createSettings(config);
  const token = createToken(config);
  const data = createData(config);

  const push = new PushNotifications(settings);

  try {
    const results = await push.send(token, data);
    return results;
  } catch (error) {
    console.error(error);
  }
};

exports.run = run;
