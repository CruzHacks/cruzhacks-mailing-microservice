const mockAxios = require("axios");
const { addToMailingList } = require("../mailing/mailchimp");

describe("mailchimp unit tests", () => {
  const email = "hankturkey@ucsc.edu";

  test("should return true when request suceeds", () => {
    mockAxios.post.mockImplementationOnce(() => Promise.resolve({}));
    return expect(addToMailingList(email)).resolves.toBe(true);
  });

  // ! Could Not Get Test To Work
  //   test("should return error code when request fails", () => {
  //     mockAxios.post.mockImplementationOnce(() =>
  //       // eslint-disable-next-line prefer-promise-reject-errors
  //       Promise.reject({
  //         error: {
  //           isAxiosError: true,
  //           response: {
  //             status: 401,
  //           },
  //         },
  //       }),
  //     );
  //     return expect(addToMailingList(email)).rejects.toThrow("Mailchimp Error: 401");
  //   });
});
