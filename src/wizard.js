const prompts = require("prompts");

// helpers

const showSave = (config) => {
  const { hasConfig } = config;
  return !hasConfig;
};
const showConfig = (config, prev) => {
  const { hasConfig } = config;

  if (hasConfig) {
    return false;
  }

  if (!prev) {
    return false;
  }

  return true;
};

// questions

const typeQuestions = [
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

const tokenQuestions = (config) => {
  return [
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
      initial: "./token.p8",
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
      initial: "Test message",
    },
    {
      type: "text",
      name: "body",
      message: "Enter message body:",
      initial: "Hello world!",
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

const firebaseQuestions = (config) => {
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

const pairQuestions = (config) => {
  return [
    {
      type: "text",
      name: "cert",
      message: "Enter your cert.pem path:",
      initial: "./cert.pem",
    },
    {
      type: "text",
      name: "key",
      message: "Enter your key.pem path:",
      initial: "./key.pem",
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
      initial: "Test message",
    },
    {
      type: "text",
      name: "body",
      message: "Enter message body:",
      initial: "Hello world!",
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

const questions = (config) => {
  const { type } = config;
  switch (type) {
    case "p8":
      return tokenQuestions(config);
    case "pem":
      return pairQuestions(config);
    case "firebase":
      return firebaseQuestions(config);
  }
};

// run

const type = async (config) => {
  prompts.override(config);

  const { type } = await prompts(typeQuestions);

  return { ...config, type };
};

const main = async (config) => {
  const { type } = config;

  prompts.override(config);
  const responses = await prompts(questions(config));

  return { ...responses, type };
};

exports.type = type;
exports.main = main;
