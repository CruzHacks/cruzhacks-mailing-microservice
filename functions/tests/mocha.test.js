const chai = require("chai");
const fetchMock = require("fetch-mock");
const firebaseConfig = require("firebase-functions-test")();
const subscribe = require("../index");

firebaseConfig.mockConfig({
  mailchimp_mail_id: "123456",
  mailchimp_server: "us9",
  react_app_api_key: "token",
  mailchimp_api_key: "mailchimp-token",
  mailchimp_user_name: "user"
});

describe("subscribe Testing Suite", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe("when providing Invalid API Key", () => {
    it("returns a 401 error status", async function(done) {
      this.timeout(10000);
      const request = {};
      const response = {
        status: status => {
          chai.assert.equal(status, 401);
          return response;
        },
        send: ({ error, status, message }) => {
          chai.assert.equal(error, true);
          chai.assert.equal(status, 401);
          chai.assert.equal(message, "Unable to authenit");
          done();
        }
      };
      await subscribe.subscribe(request, response);
    });
  });
});
