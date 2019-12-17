const { authenticateApiKey, parseEmailFromRequest } = require("./middleware");
const { addToMailingList } = require("./mailchimp");

module.exports = async function(context, req) {
  const isAuthenticated = authenticateApiKey(context, req);
  const requestEmail = parseEmailFromRequest(context, req);

  if (isAuthenticated === false) {
    return {
      status: 401,
      body: {
        error: true,
        status: 401,
        message: "Unable to authenticate request",
      },
    };
  }

  if (requestEmail === null) {
    return {
      status: 400,
      body: {
        error: true,
        status: 400,
        message: "Invalid of missing email in requets body",
      },
    };
  }

  return addToMailingList(context, requestEmail)
    .then(() => {
      return {
        status: 200,
        body: {
          error: false,
          status: 200,
          message: `${requestEmail} added to the mailing list`,
        },
      };
    })
    .catch(error => {
      return {
        status: 500,
        body: {
          error: true,
          status: 500,
          message: error.message,
        },
      };
    });
};
