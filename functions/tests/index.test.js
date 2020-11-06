const { subscribe } = require("../index");
const { addToMailingList } = require("../mailing/mailchimp");
const { authenticateApiKey, parseEmailFromRequest } = require("../mailing/middleware");

jest.mock("../mailing/middleware");
jest.mock("../mailing/mailchimp");

const testConfig = require("firebase-functions-test")();
testConfig.mockConfig({
  subscribe: {
    mailchimp_api_key: "testKEY",
    mailchimp_server: "us1",
    mailchimp_user_name: "username",
  },
});

const response = {
  status: (status) => {
    response.statusCode = status;
    return response;
  },
  send: ({ error, status, message }) => {
    response.body = {
      error: error,
      status: status,
      message: message,
    };
    return response;
  },
  set: () => {},
};

describe("Main Function Test Suite", () => {
  beforeEach(() => {
    response.status().send({ undefined });
  });

  describe("when user does not pass authentication", () => {
    it("should return 401 and set appropriate body fields", async () => {
      const request = {
        headers: {
          origin: "http://www.cruzhacks.com",
        },
        method: "GET",
      };

      authenticateApiKey.mockImplementationOnce(() => false);
      parseEmailFromRequest.mockImplementationOnce(() => "");

      await subscribe(request, response);
      expect(response.statusCode).toEqual(401);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(401);
      expect(response.body.message).toBe("Unable to authenticate request");
    });
  });

  describe("when the email is invalid or missing", () => {
    test("should return 400 status code and set appropritate return fields", async () => {
      const request = {
        headers: {
          origin: "http://www.cruzhacks.com",
        },
        method: "GET",
      };
      authenticateApiKey.mockImplementationOnce(() => true);
      parseEmailFromRequest.mockImplementationOnce(() => null);

      await subscribe(request, response);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(400);
      expect(response.body.message).toBe("Invalid or missing email in request body");
    });
  });

  describe("when there is a Mailchimp error", () => {
    test("should return 500 and set appropriate return fields", async () => {
      const request = {
        headers: {
          origin: "http://www.cruzhacks.com",
        },
        method: "GET",
        body: {
          email: "hankturkey@ucsc.edu",
        },
      };
      authenticateApiKey.mockImplementationOnce(() => true);
      parseEmailFromRequest.mockImplementationOnce(() => "hankturkey@ucsc.edu");
      addToMailingList.mockImplementationOnce(() => Promise.reject(new Error("Mailchimp Error")));

      await subscribe(request, response);
      expect(response.statusCode).toEqual(500);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(500);
      expect(response.body.message).toBe("Mailchimp Error");
    });
  });

  describe("when user exists in mailchimp", () => {
    it("returns a 200 status code with its approprite fields", async () => {
      const request = {
        headers: {
          origin: "http://www.cruzhacks.com",
        },
        method: "GET",
        body: {
          email: "hankturkey@ucsc.edu",
        },
      };
      authenticateApiKey.mockImplementationOnce(() => true);
      parseEmailFromRequest.mockImplementationOnce(() => "hankturkey@ucsc.edu");
      addToMailingList.mockImplementationOnce(() =>
        Promise.resolve({
          message: "hankturkey@ucsc.edu already exists",
          status: 200,
        }),
      );
      await subscribe(request, response);

      expect(response.statusCode).toEqual(200);
      expect(response.body.error).toBeFalsy();
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe("hankturkey@ucsc.edu is already subscribed");
    });
  });

  describe("when user is added to mailchimp list", () => {
    it("returns a 201 status code with its approprite fields", async () => {
      const request = {
        headers: {
          origin: "http://www.cruzhacks.com",
        },
        method: "GET",
        body: {
          email: "hankturkey@ucsc.edu",
        },
      };
      authenticateApiKey.mockImplementationOnce(() => true);
      parseEmailFromRequest.mockImplementationOnce(() => "hankturkey@ucsc.edu");
      addToMailingList.mockImplementationOnce(() =>
        Promise.resolve({
          message: "Successfully added hankturkey@ucsc.edu to the emailing list",
          status: 201,
        }),
      );
      await subscribe(request, response);

      expect(response.statusCode).toEqual(201);
      expect(response.body.error).toBeFalsy();
      expect(response.body.status).toBe(201);
      expect(response.body.message).toBe("hankturkey@ucsc.edu added to the mailing list");
    });
  });
});
