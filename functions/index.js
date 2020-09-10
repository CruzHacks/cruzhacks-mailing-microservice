const functions = require("firebase-functions");

const { authenticateApiKey, parseEmailFromRequest } = require("./mailing/middleware");
const { addToMailingList } = require("./mailing/mailchimp");

exports.subscribe = functions.https.onRequest(async (request, response) => {
  // TODO: refactor tests with firebase changes

  const isAuthenticated = authenticateApiKey(functions, request);
  const requestEmail = parseEmailFromRequest(request);

  if (isAuthenticated === false) {
    response.status(401).send({
      error: true,
      status: 401,
      message: "Unable to authenticate request",
    });
  } else if (requestEmail === null) {
    response.status(400).send({
      error: true,
      status: 400,
      message: "Invalid or missing email in request body",
    });
  } else {
    await addToMailingList(functions, requestEmail).catch(error => {
      response.status(500).send({
        error: true,
        status: 500,
        message: error.message,
      });

      response.status(200).send({
        error: false,
        status: 200,
        message: `${requestEmail} added to the mailing list`,
      });
    });
  }
});
