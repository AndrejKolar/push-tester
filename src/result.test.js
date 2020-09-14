const result = require("./result");

describe("check", () => {
  let spyLog, errorLog;
  beforeEach(() => {
    spyLog = jest.spyOn(console, "log").mockImplementation();
    errorLog = jest.spyOn(console, "error").mockImplementation();
  });
  afterEach(() => {
    spyLog.mockClear();
    errorLog.mockClear();
  });

  test("logs success message", () => {
    const results = [{ message: [{ error: null }] }];
    result.check(results);
    expect(spyLog).toHaveBeenCalledWith("Push message sent successfuly!");
  });

  test("logs error message", () => {
    const results = [{ message: [{ error: "some" }] }];
    result.check(results);
    expect(errorLog).toHaveBeenCalledWith("Error sending push message");
  });

  test("logs message at the end", () => {
    const results = [{ message: [{ error: null, test: "ok" }] }];

    result.check(results);

    expect(spyLog).toHaveBeenCalledWith("Push message sent successfuly!");
    expect(spyLog).toHaveBeenCalledWith({ error: null, test: "ok" });
  });
});
