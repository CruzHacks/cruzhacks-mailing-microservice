const { subscribe } = require("../index");

const { addToMailingList } = require("../mailing/mailchimp");
const {
  authenticateApiKey,
  parseEmailFromRequest
} = require("../mailing/middleware");

const response = {
  status: status => {
    response.statusCode = status;
    return response;
  },
  send: ({ error, status, message }) => {
    response.body = {
      error: error,
      status: status,
      message: message
    };
    return response;
  }
};

jest.mock("../mailing/middleware");
jest.mock("../mailing/mailchimp");

describe("unit tests for index.js driver", () => {
  describe("test api key auth", () => {
    beforeEach(() => {
      response.status().send({ undefined });
    });
    test("should return 401 if the user does not pass authentication", async () => {
      const request = {};

      authenticateApiKey.mockImplementationOnce(() => false);
      parseEmailFromRequest.mockImplementationOnce(() => "");

      await subscribe(request, response);
      expect(response.statusCode).toEqual(401);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(401);
      expect(response.body.message).toBe("Unable to authenticate request");
    });

    test("should return 400 when the email is invalid", async () => {
      const request = {};
      authenticateApiKey.mockImplementationOnce(() => true);
      parseEmailFromRequest.mockImplementationOnce(() => null);

      await subscribe(request, response);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(400);
      expect(response.body.message).toBe(
        "Invalid or missing email in request body"
      );
    });

    test("should return 500 when adding the target email to mailchimp fails", async () => {
      const request = {
        body: {
          email: "hankturkey@ucsc.edu"
        }
      };
      authenticateApiKey.mockImplementationOnce(() => true);
      parseEmailFromRequest.mockImplementationOnce(() => "hankturkey@ucsc.edu");
      addToMailingList.mockImplementationOnce(() =>
        Promise.reject(new Error("Mailchimp Error"))
      );

      await subscribe(request, response);
      expect(response.statusCode).toEqual(500);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(500);
      expect(response.body.message).toBe("Mailchimp Error");
    });
  });
});
