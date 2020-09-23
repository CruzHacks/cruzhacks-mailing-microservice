const functions = require("firebase-functions");

const { authenticateApiKey, parseEmailFromRequest } = require("./mailing/middleware");
const { addToMailingList } = require("./mailing/mailchimp");

exports.subscribe = functions.https.onRequest(async (request, response) => {
  // TODO: refactor tests with firebase changes
  console.log("In here", request.method);
  response.set("Access-Control-Allow-Origin", "*");
  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "POST");
    response.set("Access-Control-Allow-Headers", "authentication, Content-Type");
    response.status(200).send('');
  } else {
    const isAuthenticated = authenticateApiKey(functions, request);
    const requestEmail = parseEmailFromRequest(request);
    console.log(isAuthenticated, requestEmail);

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
      await addToMailingList(functions, requestEmail).then((response) => (
        response.status(200).send({
          error: false,
          status: 200,
          message: `${requestEmail} added to the mailing list`,
        })
      )).catch(error => {
        response.status(500).send({
          error: true,
          status: 500,
          message: error.message,
        });
      });
    }
  }
});
