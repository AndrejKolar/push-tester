const PushNotifications = require("node-pushnotifications");
const push = require("./push");

const mockSend = jest.fn();
jest.mock("node-pushnotifications", () => {
  return jest.fn().mockImplementation(() => ({
    send: mockSend,
  }));
});

describe("run", () => {
  afterEach(() => {
    PushNotifications.mockClear();
    mockSend.mockClear();
  });

  test("calls push with correct data for p8", () => {
    const config = {
      type: "p8",
      key: "key",
      teamId: "teamId",
      keyId: "keyId",
      production: false,
      pushToken: "token",
      bundleId: "bundleId",
      title: "title",
      body: "body",
      badge: 1,
      sound: "sound",
    };

    push.run(config);

    const settings = {
      apn: {
        production: false,
        token: { key: "key", keyId: "keyId", teamId: "teamId" },
      },
    };

    const token = ["token"];

    const data = {
      badge: 1,
      body: "body",
      sound: "sound",
      title: "title",
      topic: "bundleId",
    };

    expect(PushNotifications).toHaveBeenCalledWith(settings);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(token, data);
  });

  test("calls push with correct data for pem", () => {
    const config = {
      type: "pem",
      cert: "cert",
      key: "key",
      production: false,
      pushToken: "token",
      bundleId: "bundleId",
      title: "title",
      body: "body",
      badge: 1,
      sound: "sound",
    };

    push.run(config);

    const settings = {
      apn: {
        cert: "cert",
        key: "key",
        production: false,
      },
    };

    const token = ["token"];

    const data = {
      badge: 1,
      body: "body",
      sound: "sound",
      title: "title",
      topic: "bundleId",
    };

    expect(PushNotifications).toHaveBeenCalledWith(settings);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(token, data);
  });

  test("calls push with correct data for firebase", () => {
    const config = {
      type: "firebase",
      key: "key",
      pushToken: "token",
      bundleId: "bundleId",
      title: "title",
      body: "body",
      badge: 1,
      sound: "sound",
    };

    push.run(config);

    const settings = {
      gcm: {
        id: "key",
      },
    };

    const token = ["token"];

    const data = {
      badge: 1,
      body: "body",
      sound: "sound",
      title: "title",
      topic: "bundleId",
    };

    expect(PushNotifications).toHaveBeenCalledWith(settings);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(token, data);
  });
});
