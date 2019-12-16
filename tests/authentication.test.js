// Test for API key authintication

const { authenticateApiKey } = require("../mailing/authentication");

describe("api key authentication middleware uit tests", () => {
  const contextMock = {};

  test("should pass with correct request header", () => {
    const requestHeadersMock = {
      headers: {
        accept: "*/*",
        host: "localhost:7071",
        "user-agent": "insomnia/7.0.3",
        authentication: "testKEY",
      },
      query: {},
    };
    process.env.API_KEY = "testKEY";
    expect(authenticateApiKey(contextMock, requestHeadersMock)).toBe(true);
  });

  test("should not pass with incorrect request header", () => {
    const requestHeadersMock = {
      headers: {
        accept: "*/*",
        host: "localhost:7071",
        "user-agent": "insomnia/7.0.3",
        authentication: "WRONG_KEY",
      },
      query: {},
    };
    process.env.API_KEY = "testKEY";
    expect(authenticateApiKey(contextMock, requestHeadersMock)).toBe(false);
  });
});
