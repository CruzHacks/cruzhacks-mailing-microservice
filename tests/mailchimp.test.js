const mockAxios = require("axios");
const { addToMailingList } = require("../mailing/mailchimp");

describe("mailchimp unit tests", () => {
  const email = "hankturkey@ucsc.edu";

  test("should return true when request suceeds", () => {
    mockAxios.post.mockImplementationOnce(() => Promise.resolve({ data: {} }));
    const fakeContext = {
      log: jest.fn(),
    };
    return expect(addToMailingList(fakeContext, email)).resolves.toBe(true);
  });

  test("should return error message when request fails", () => {
    const fakeContext = {
      log: {
        error: jest.fn(),
      },
    };
    const errorResponse = {
      isAxiosError: true,
      response: {
        status: 401,
        data: {
          detail: "hankturkey@ucsc.edu is already a list member...",
        },
      },
    };
    const targetErrorMessage = "Mailchimp Error: hankturkey@ucsc.edu is already a list member...";

    mockAxios.post.mockImplementationOnce(() => Promise.reject(errorResponse));
    return expect(addToMailingList(fakeContext, email)).rejects.toThrow(targetErrorMessage);
  });
});
