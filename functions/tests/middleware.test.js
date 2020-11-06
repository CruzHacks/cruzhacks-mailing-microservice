const {
  authenticateApiKey,
  parseEmailFromRequest
} = require("../mailing/middleware");

const testConfig = require("firebase-functions-test")();
testConfig.mockConfig({ subscribe: { react_app_api_key: "testKEY" } });

const functions = {
  config: () => {
    return { subscribe: { react_app_api_key: "testKEY" } };
  }
};

describe("Middleware Unit Tests", () => {
  describe("API Key Unit Tests", () => {
    test("should pass with correct request header", () => {
      const requestHeadersMock = {
        headers: {
          accept: "*/*",
          host: "localhost:7071",
          "user-agent": "insomnia/7.0.3",
          authentication: "testKEY"
        },
        query: {}
      };
      expect(authenticateApiKey(functions, requestHeadersMock)).toBe(true);
    });

    test("should not pass with incorrect request header", () => {
      const requestHeadersMock = {
        headers: {
          accept: "*/*",
          host: "localhost:7071",
          "user-agent": "insomnia/7.0.3",
          authentication: "WRONG_KEY"
        },
        query: {}
      };
      process.env.API_KEY = "testKEY";
      expect(authenticateApiKey(functions, requestHeadersMock)).toBe(false);
    });
  });

  describe("Email Request Parsing Unit Tests", () => {
    test("should return target email", () => {
      const request = {
        body: {
          email: "hanktheturkey@ucsc.edu"
        }
      };
      expect(parseEmailFromRequest(request)).toBe("hanktheturkey@ucsc.edu");
    });

    test("should return target email with symbols", () => {
      const request = {
        body: {
          email: "han-kth+eturkey@ucsc.edu"
        }
      };
      expect(parseEmailFromRequest(request)).toBe("han-kth+eturkey@ucsc.edu");
    });

    test("should return null for missing email", () => {
      const request = {
        body: {}
      };
      expect(parseEmailFromRequest(request)).toBe(null);
    });

    test("should return null for invalid email", () => {
      const request = {
        body: {
          email: "hankturkey.edu"
        }
      };
      expect(parseEmailFromRequest(request)).toBe(null);
    });

    test("should return null for null email", () => {
      const request = {
        body: {
          email: null
        }
      };
      expect(parseEmailFromRequest(request)).toBe(null);
    });
  });
});
