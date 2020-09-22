const axios = require("axios");
const functions = require('firebase-functions');

const mailchimpConfiguration = {
  authKey: functions.config().subscribe.mailchimp_api_key,
  endpoint: functions.config().subscribe.mailchimp_subscription_endpoint,
};

const requestConfiguration = {
  user: {
    key: mailchimpConfiguration.authKey,
  },
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

const addToMailingList = (email) => {
  const requestBody = {
    email_address: email,
    status: "subscribed",
  };

  return axios
    .post(mailchimpConfiguration.endpoint, requestBody, requestConfiguration)
    .then((response) => {
      functions.logger.info(JSON.stringify(response.data, null, 2));
      return Promise.resolve(true);
    })
    .catch((error) => {
      functions.logger.error(error.response.data.detail);
      return Promise.reject(new Error(`Mailchimp Error: ${error.response.data.detail}`));
    });
};

module.exports = {
  addToMailingList,
};
