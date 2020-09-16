const context = require("./defaultContext");
const httpFunction = require("../index");

const { addToMailingList } = require("./mailing/mailchimp");
const { authenticateApiKey, parseEmailFromRequest } = require("./mailing/middleware");
const response = {
  status: jest.fn(() => {
    return response.send;
  }),
  send: jest.fn(),
};
const responseSpy = jest.spyOn(response, "status").mockImplementation(() => {});

jest.mock("../../mailing/middleware");
jest.mock("../../mailing/mailchimp");

describe("unit tests for index.js driver", () => {
  describe("test api key auth", () => {
    beforeEach(() => {
      responseSpy.mockClear();
    });
    test("should return 401 if the user doesen't pass authentication", async () => {
      const request = {};

      authenticateApiKey.mockImplementationOnce(() => false);
      parseEmailFromRequest.mockImplementationOnce(() => "");

      await httpFunction(request, response);
      expect(responseSpy).toHaveBeenCalledWith(new Error("mockProcessJob has rejected"));
    });

    test("should return 400 when the email is invalid", async () => {
      const request = {};
      authenticateApiKey.mockImplementationOnce(() => false);
      parseEmailFromRequest.mockImplementationOnce(() => null);

      const response = await httpFunction(context, request);
      expect(response.status).toEqual(401);
    });

    test("should return 500 when adding the target email to mailchimp fails", async () => {
      const request = {
        body: {
          email: "hankturkey@ucsc.edu",
        },
      };
      authenticateApiKey.mockImplementationOnce(() => true);
      parseEmailFromRequest.mockImplementationOnce(() => "hankturkey@ucsc.edu");
      addToMailingList.mockImplementationOnce(() => Promise.reject(new Error("fooooo")));

      const response = await httpFunction(context, request);
      expect(response.status).toEqual(500);
    });
  });
});
