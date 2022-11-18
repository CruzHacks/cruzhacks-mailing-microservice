const functions = require("firebase-functions");

const { authenticateApiKey, parseEmailFromRequest } = require("./mailing/middleware");
const { addToMailingList } = require("./mailing/mailchimp");
const allowedOrigins = functions.config().auth.cors;
console.log(allowedOrigins)
exports.subscribe = functions.https.onRequest(async (request, response) => {
  //const subdomain = request.headers.origin.split("//")[1].split(".")[0];
  //response.set("Access-Control-Allow-Origin", `https://${subdomain}.cruzhacks.com`);
  response.set("Access-Control-Allow-Origin", allowedOrigins);
  response.set("Vary", "Origin");
  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "POST");
    response.set("Access-Control-Allow-Headers", "authentication, Content-Type");
    response.status(200).send("");
  } else {
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
      await addToMailingList(functions, requestEmail)
        .then((res) => {
          if (res.status === 200) {
            return response.status(200).send({
              error: false,
              status: 200,
              message: `${requestEmail} is already subscribed`,
            });
          } else {
            return response.status(201).send({
              error: false,
              status: 201,
              message: `${requestEmail} added to the mailing list`,
            });
          }
        })
        .catch((error) => {
          response.status(500).send({
            error: true,
            status: 500,
            message: error.message,
          });
        });
    }
  }
});
