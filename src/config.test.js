const fs = require("fs");
const config = require("./config");

jest.mock("fs");

describe("save", () => {
  afterEach(() => {
    fs.writeFileSync.mockClear();
  });

  test("calls save with right config", () => {
    const data = {
      save: true,
      config: "test",
    };
    config.save(data);

    expect(fs.writeFileSync).toHaveBeenCalled();
  });
  test("doesn't call save if `save` is false", () => {
    const data = {
      save: false,
      config: "test",
    };
    config.save(data);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
  test("doesn't include removed properties", () => {
    const data = {
      save: true,
      config: "test",
      hasConfig: true,
    };
    config.save(data);

    expect(fs.writeFileSync).toHaveBeenCalledWith("test", "{}");
  });
});

describe("read", () => {
  beforeEach(() => {
    let rawData = Buffer.from('{ "foo": "bar" }', "utf-8");
    fs.readFileSync.mockReturnValueOnce(rawData);
  });
  afterEach(() => {
    fs.readFileSync.mockClear();
  });

  test("calls read", () => {
    const argv = {
      config: "test",
    };

    config.read(argv);

    expect(fs.readFileSync).toHaveBeenCalled();
  });

  test("doesn't call save if `config` is not passed", () => {
    const argv = {};

    config.read(argv);

    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  test("returns `hasConfig` true", () => {
    const argv = {
      config: "test",
    };
    let res = config.read(argv);

    expect(res).toMatchObject({ hasConfig: true });
  });

  test("returns data from the config file", () => {
    const argv = {
      config: "test",
    };
    let res = config.read(argv);

    expect(res).toMatchObject({ hasConfig: true, foo: "bar" });
  });
});
