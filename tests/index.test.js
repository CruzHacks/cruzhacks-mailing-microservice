const context = require("./defaultContext");
const httpFunction = require("../mailing/index");
const { addToMailingList } = require("../mailing/mailchimp");
const { authenticateApiKey, parseEmailFromRequest } = require("../mailing/middleware");

jest.mock("../mailing/middleware");
jest.mock("../mailing/mailchimp");

describe("unit tests for index.js driver", () => {
  describe("test api key auth", () => {
    test("should return 401 the user doesen't pass authentication", async () => {
      const request = {
        query: { authentication: "pass123" },
        headers: {},
      };

      authenticateApiKey.mockImplementationOnce(() => false);
      parseEmailFromRequest.mockImplementationOnce(() => "");
      addToMailingList.mockImplementationOnce(() => Promise.resolve());

      const response = await httpFunction(context, request);
      expect(response.status).toEqual(401);
    });
  });
});
