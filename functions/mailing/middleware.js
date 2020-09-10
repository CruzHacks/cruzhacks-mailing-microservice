const authenticateApiKey = (functions, requestObject) => {
  const { headers } = requestObject;
  const correctKey = process.env.API_KEY;

  if (correctKey === undefined) {
    functions.logger.error("ERROR: UNSET API KEY ENV VAR", { structuredData: true });
    return false;
  }

  return headers.authentication === correctKey;
};

const parseEmailFromRequest = (requestObject) => {
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (requestObject.body === undefined || !emailRegexp.test(requestObject.body.email)) {
    return null;
  }

  return requestObject.body.email;
};

module.exports = {
  authenticateApiKey,
  parseEmailFromRequest,
};
