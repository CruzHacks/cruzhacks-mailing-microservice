const { addToMailingList } = require("../mailing/mailchimp");
const testConfig = require("firebase-functions-test")();
testConfig.mockConfig({
  subscribe: {
    mailchimp_api_key: "testKEY",
    mailchimp_server: "us1",
    mailchimp_user_name: "username"
  }
});
jest.mock("../mailing/mailchimp");

const functions = {
  config: () => {
    return testConfig.mockConfig();
  }
};

describe("Mailchimp API Unit Tests", () => {
  const email = "hankturkey@ucsc.edu";
  describe("when user gets added to mailing list", () => {
    test("should return true when request suceeds", async () => {
      addToMailingList.mockImplementationOnce(() =>
        Promise.resolve({
          message: `Successfully added ${email} to the emailing list`,
          status: 201
        })
      );
      return expect(addToMailingList(functions, email)).resolves.toStrictEqual({
        message: `Successfully added ${email} to the emailing list`,
        status: 201
      });
    });
  });

  describe("when user already exists in mailing list", () => {
    test("should return true when request suceeds", async () => {
      addToMailingList.mockImplementationOnce(() =>
        Promise.resolve({
          message: `${email} already exists`,
          status: 200
        })
      );
      return expect(addToMailingList(functions, email)).resolves.toStrictEqual({
        message: `${email} already exists`,
        status: 200
      });
    });
  });

  describe("when there is a mailchimp error", () => {
    test("should return error message when request fails", () => {
      addToMailingList.mockImplementationOnce(() =>
        Promise.reject(new Error("Mailchimp Error: Something went wrong!"))
      );
      return expect(addToMailingList(functions, email)).rejects.toThrow(
        "Mailchimp Error: Something went wrong!"
      );
    });
  });
});
