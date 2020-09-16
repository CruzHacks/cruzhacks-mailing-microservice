const axios = require("axios");

const mailchimpConfiguration = {
  userName: `${process.env.MAILCHIMP_USER}`,
  password: `${process.env.MAILCHIMP_SECRET}`,
  endpoint: `${process.env.MAILCHIMP_SUBSCRIBERS_ENDPOINT}`,
};

const requestConfiguration = {
  auth: {
    username: mailchimpConfiguration.userName,
    password: mailchimpConfiguration.password,
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
