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

const addToMailingList = (functionContext, email) => {
  const requestBody = {
    email_address: email,
    status: "subscribed",
  };

  return axios
    .post(mailchimpConfiguration.endpoint, requestBody, requestConfiguration)
    .then(() => {
      return Promise.resolve(true);
    })
    .catch(error => {
      const errorMessage = error.isAxiosError === true ? "Axios Error!" : error.response.status;
      functionContext.log.error(error);
      return Promise.reject(new Error(`Mailchimp Error: ${errorMessage}`));
    });
};

module.exports = {
  addToMailingList,
};
