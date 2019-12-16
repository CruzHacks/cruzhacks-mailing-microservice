// Test for API key authintication

const { authenticateApiKey, parseEmailFromRequest } = require("../mailing/middleware");

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

describe("tests for parsing the email from the request body", () => {
  const contextMock = {};

  test("should return target email", () => {
    const request = {
      body: {
        email: "hanktheturkey@ucsc.edu",
      },
    };
    expect(parseEmailFromRequest(contextMock, request)).toBe("hanktheturkey@ucsc.edu");
  });

  test("should return target email with characters", () => {
    const request = {
      body: {
        email: "han-kth+eturkey@ucsc.edu",
      },
    };
    expect(parseEmailFromRequest(contextMock, request)).toBe("han-kth+eturkey@ucsc.edu");
  });

  test("should return null for missing email", () => {
    const request = {
      body: {},
    };
    expect(parseEmailFromRequest(contextMock, request)).toBe(null);
  });

  test("should return null for invalid email", () => {
    const request = {
      body: {
        email: "hankturkey.edu",
      },
    };
    expect(parseEmailFromRequest(contextMock, request)).toBe(null);
  });

  test("should return null for null email", () => {
    const request = {
      body: {
        email: null,
      },
    };
    expect(parseEmailFromRequest(contextMock, request)).toBe(null);
  });
});
