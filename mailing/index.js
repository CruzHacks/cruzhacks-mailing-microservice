const { authenticateApiKey, parseEmailFromRequest } = require("./middleware");
const { addToMailingList } = require("./mailchimp");

module.exports = async function(context, req) {
  const isAuthenticated = authenticateApiKey(context, req);
  const requestEmail = parseEmailFromRequest(context, req);

  if (isAuthenticated === false) {
    context.res = {
      status: 401,
      body: {
        error: true,
        status: 401,
        message: "Unable to authenticate request",
      },
    };
    context.done();
  }

  if (requestEmail === null) {
    context.res = {
      status: 400,
      body: {
        error: true,
        status: 400,
        message: "Invalid of missing email in requets body",
      },
    };
    context.done();
  }

  await addToMailingList(context, requestEmail)
    .then(response => {
      if (response === true) {
        context.res = {
          status: 200,
          body: {
            error: false,
            status: 200,
            message: `${requestEmail} added to the mailing list`,
          },
        };
      } else {
        context.res = {
          status: 500,
          body: {
            error: true,
            status: 500,
            message: "An internal server error occured",
          },
        };
      }
    })
    .catch(error => {
      context.res = {
        status: 500,
        body: {
          error: true,
          status: 500,
          message: error.message,
        },
      };
    })
    .finally(() => {
      context.done();
    });
};
