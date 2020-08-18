const prompts = require("prompts");
const wizard = require("./wizard");

jest.mock("prompts");

describe("type", () => {
  beforeEach(() => {
    prompts.mockResolvedValue({ type: "test" });
  });
  afterEach(() => {
    prompts.mockClear();
  });

  test("calls prompts override with the config", async () => {
    const config = { foo: "bar" };
    await wizard.type(config);
    expect(prompts.override).toHaveBeenCalledWith(config);
  });

  test("calls prompts with type questions", async () => {
    const config = { foo: "bar" };
    const questions = [
      {
        choices: [
          {
            description: ".p8 token",
            title: "iOS - Provider Authentication Token",
            value: "p8",
          },
          {
            description: ".pem cert/key",
            title: "iOS - Certificate/Key pair",
            value: "pem",
          },
          {
            description: "FCM/GCM API key",
            title: "iOS/Android - Firebase Cloud Messaging",
            value: "firebase",
          },
        ],
        message: "Select push message type",
        name: "type",
        type: "select",
      },
    ];

    await wizard.type(config);
    expect(prompts).toHaveBeenCalledWith(questions);
  });

  test("returns the type from the response along with the config", async () => {
    const config = { foo: "bar" };
    const response = await wizard.type(config);
    expect(response).toEqual({ ...config, type: "test" });
  });
});

describe("main", () => {
  beforeEach(() => {
    prompts.mockResolvedValue({ foo: "bar" });
  });
  afterEach(() => {
    prompts.mockClear();
  });

  test("calls the prompts override with the config", async () => {
    const config = { foo: "bar" };
    await wizard.main(config);
    expect(prompts.override).toHaveBeenCalledWith(config);
  });

  test("prompts called with questions for p8", async () => {
    const config = { type: "p8" };
    const questions = [
      { message: "Enter your keyId:", name: "keyId", type: "text" },
      { message: "Enter your teamId:", name: "teamId", type: "text" },
      {
        initial: "./token.p8",
        message: "Enter your p8 path:",
        name: "key",
        type: "text",
      },
      { message: "Enter your bundle id:", name: "bundleId", type: "text" },
      {
        active: "production",
        inactive: "sandbox",
        initial: false,
        message: "Environment:",
        name: "production",
        type: "toggle",
      },
      { message: "Enter your APNS token:", name: "pushToken", type: "text" },
      {
        initial: "Test message",
        message: "Enter message title:",
        name: "title",
        type: "text",
      },
      {
        initial: "Hello world!",
        message: "Enter message body:",
        name: "body",
        type: "text",
      },
      {
        initial: 1,
        message: "Enter app badge:",
        name: "badge",
        type: "number",
      },
      {
        initial: "default",
        message: "Enter notification sound:",
        name: "sound",
        type: "text",
      },
      {
        initial: true,
        message: "Save this configuration?",
        name: "save",
        type: "confirm",
      },
      {
        initial: "config.push.json",
        message: "Enter config filename:",
        name: "config",
        type: expect.any(Function),
      },
    ];

    await wizard.main(config);
    expect(prompts).toHaveBeenCalledWith(questions);
  });
  test("prompts called with questions for firebase", async () => {
    const config = { type: "firebase" };
    const questions = [
      { message: "Enter your GCM/FCM API key:", name: "key", type: "text" },
      {
        message: "Enter your registration token:",
        name: "pushToken",
        type: "text",
      },
      {
        initial: "Test message",
        message: "Enter message title:",
        name: "title",
        type: "text",
      },
      {
        initial: "Hello world!",
        message: "Enter message body:",
        name: "body",
        type: "text",
      },
      {
        initial: true,
        message: "Save this configuration?",
        name: "save",
        type: "confirm",
      },
      {
        initial: "config.push.json",
        message: "Enter config filename:",
        name: "config",
        type: expect.any(Function),
      },
    ];

    await wizard.main(config);
    expect(prompts).toHaveBeenCalledWith(questions);
  });
  test("prompts called with questions for pem", async () => {
    const config = { type: "pem" };
    const questions = [
      {
        initial: "./cert.pem",
        message: "Enter your cert.pem path:",
        name: "cert",
        type: "text",
      },
      {
        initial: "./key.pem",
        message: "Enter your key.pem path:",
        name: "key",
        type: "text",
      },
      { message: "Enter your bundle id:", name: "bundleId", type: "text" },
      {
        active: "production",
        inactive: "sandbox",
        initial: false,
        message: "Environment:",
        name: "production",
        type: "toggle",
      },
      { message: "Enter your APNS token:", name: "pushToken", type: "text" },
      {
        initial: "Test message",
        message: "Enter message title:",
        name: "title",
        type: "text",
      },
      {
        initial: "Hello world!",
        message: "Enter message body:",
        name: "body",
        type: "text",
      },
      {
        initial: 1,
        message: "Enter app badge:",
        name: "badge",
        type: "number",
      },
      {
        initial: "default",
        message: "Enter notification sound:",
        name: "sound",
        type: "text",
      },
      {
        initial: true,
        message: "Save this configuration?",
        name: "save",
        type: "confirm",
      },
      {
        initial: "config.push.json",
        message: "Enter config filename:",
        name: "config",
        type: expect.any(Function),
      },
    ];

    await wizard.main(config);
    expect(prompts).toHaveBeenCalledWith(questions);
  });

  test("returns responses along with the type from the config", async () => {
    const config = { type: "test" };
    const response = await wizard.main(config);
    expect(response).toEqual({ ...config, foo: "bar" });
  });
});
