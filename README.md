# CruzHacks Mailing Microservice

![cruzhacks-mailing-service](https://github.com/CruzHacks/cruzhacks-mailing-microservice/workflows/cruzhacks-mailing-service/badge.svg)

This Firebase Function is responsible for the CruzHacks mailing list. This service uses the MailChimp REST API.

## Development

### Dependnecies
- Can be found inside `package.json` file. Installed using the following command: 
  - `yarn` or `yarn -i` or `yarn install` within the `/functions` directory

### Start

`yarn serve`

* Begin an emulator suite at `localhost:4000` with your function being served at `localhost:5000`. You can navigate the UI of the Emulator Suite to find the actual endpoint. 

### Test

This project uses [Jest](https://jestjs.io/). Run all tests via `yarn test`. 

### Environment Variables

Can be obtained by running `firebase functions:config:get > .runtimeconfig.json` within your `/functions` directory

## Request Schema

```shell
curl --request GET \
  --url http://localhost:5001/cruzhacks-4a899/us-central1/subscribe \
  --header 'authentication: API_KEY' \
  --header 'content-type: application/json' \
  --data '{
    "email": "TEST@ucsc.com"
  }'
```

## Response Schemas

### Successfully Added Email to Mailing List

```json
{
  "error": false,
  "status": 201,
  "message": "TEST@ucsc.edu added to the mailing list"
}
```

### User Already Exists 
```json
{
  "error": false,
  "status": 200,
  "message": "TEST@ucsc.edu is already subscribed"
}
```

### Missing or Invalid API Key

```json
{
  "error": true,
  "status": 401,
  "message": "Unable to authenticate request"
}
```

### Missing Email in Request 
```json 
{
  "error": true,
  "status": 400,
  "message": "Invalid or missing email in request body"
}
```

### MailChimp Error

```json
{
  "error": true,
  "status": 500,
  "message": "Mailchimp Error: ERROR MESSGE HERE."
}
```

## Technologies

- Firebase Functions
- NodeJS
- Jest
- Github Actions
- Prettier
- Eslint
