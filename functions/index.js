const functions = require("firebase-functions");

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

module.exports = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  // TODO: refactor tests with firebase changes

  const isAuthenticated = authenticateApiKey(functions, request);
  const requestEmail = parseEmailFromRequest(req);

  if (isAuthenticated === false) {
    response.status(401).send({
      error: true,
      status: 401,
      message: "Unable to authenticate request",
    });
  }

  if (requestEmail === null) {
    response.status(400).send({
      error: true,
      status: 400,
      message: "Invalid or missing email in request body",
    });
  }

  await addToMailingList(functions, requestEmail).catch(error => {
    response.status(500).send({
      error: true,
      status: 500,
      message: error.message,
    });
  });

  response.status(200).send({
    error: false,
    status: 200,
    message: `${requestEmail} added to the mailing list`,
  });
});
