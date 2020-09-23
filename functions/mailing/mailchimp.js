const functions = require('firebase-functions');
const mailchimp = require("@mailchimp/mailchimp_marketing");

const mailchimpConfiguration = {
  authKey: functions.config().subscribe.mailchimp_api_key,
  server: functions.config().subscribe.mailchimp_server,
  user: functions.config().subscribe.mailchimp_user_name,
};

mailchimp.setConfig({
  apiKey: mailchimpConfiguration.authKey,
  server: mailchimpConfiguration.server
});

const requestConfiguration = {
  auth: {
    user: mailchimpConfiguration.user,
    password: mailchimpConfiguration.authKey,
  },
  header: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
};

async function addToMailingList(functions, email) {
  const response = await mailchimp.lists.addListMember("776764ba24", {
    email_address: email, 
    status: "subscribed"
  }).then((response) => {
    functions.logger.info(response.id);
    return Promise.resolve({
      message: `Successfully added ${email} to the emailing list`,
      status: 201,
    });
  }).catch((error) => {
    const res = error.response.body.title;
    if(res.includes("Member Exists")) {
      functions.logger.info(JSON.stringify(res, null, 2));
      return Promise.resolve({
        message: `${email} already exists`,
        status: 200,
      });
    } else {
      functions.logger.error(JSON.stringify(res, null, 2));
      return Promise.reject(new Error(`Mailchimp Error: ${res}`));
    }
  });
  return response;
}

module.exports = {
  addToMailingList,
};
