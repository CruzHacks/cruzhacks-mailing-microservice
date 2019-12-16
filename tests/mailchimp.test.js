const mockAxios = require("axios");
const { addToMailingList } = require("../mailing/mailchimp");

describe("mailchimp unit tests", () => {
  const email = "hankturkey@ucsc.edu";

  test("should return true when request suceeds", () => {
    mockAxios.post.mockImplementationOnce(() => Promise.resolve({}));

    return expect(addToMailingList(email)).resolves.toBe(true);
  });
  test("should return error code when request fails", () => {
    const badResponse = { response: { status: 401 } };
    mockAxios.post.mockImplementationOnce(() => Promise.reject(badResponse));
    return expect(addToMailingList(email)).rejects.toThrow("Mailchimp Error: 401");
  });
});
