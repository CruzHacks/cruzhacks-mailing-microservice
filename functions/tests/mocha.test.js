const chai = require("chai");
const { done } = require("fetch-mock");
const fetchMock = require("fetch-mock");
const firebaseConfig = require("firebase-functions-test")();
const subscribe = require("../index");

firebaseConfig.mockConfig({
  mailchimp_mail_id: "123456",
  mailchimp_server: "us9",
  react_app_api_key: "token",
  mailchimp_api_key: "mailchimp-token",
  mailchimp_user_name: "user",
});

describe("subscribe Testing Suite", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe("when providing Invalid API Key", done => {
    const request = {};
    const response = {
      status: status => {
        chai.assert.equal(status, 401);
        return res;
      },
      send: ({ error, status, message }) => {
        chai.assert.equal(error, true);
        done();
      },
    };

    it("returns a 401 error status", () => {
      subscribe.subscribe(request, response);
    });
  });
});
