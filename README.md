# CruzHacks Mailing Microservice

[![Build Status](https://dev.azure.com/kyleobrien0535/CruzHacks%202020%20Website/_apis/build/status/mailing_service/CruzHacks.cruzhacks-mailing-microservice.CI?branchName=master)](https://dev.azure.com/kyleobrien0535/CruzHacks%202020%20Website/_build/latest?definitionId=12&branchName=master)

This Azure Function is responsible for the CruzHacks mailing list. This service uses the MailChimp REST API.

## Development

### Dependnecies

- [Azure Function Cole Tools CLI](https://github.com/Azure/azure-functions-core-tools)
- Local NPM packages --> `npm install`

### Start

`func start`

or via Docker

`docker build -t cruzhacks-mailing-service .`
`docker run -p 7071:80 cruzhacks-mailing-service`

### Test

This project uses [Jest](https://jestjs.io/). Run all tests via `npm run test`. 

### Environment Variables

`API_KEY`
`MAILCHIMP_SECRET`
`MAILCHIMP_USER`
`MAILCHIMP_SUBSCRIBERS_ENDPOINT`

## Request Schema

```shell
curl --request POST \
  --url http://localhost:7071/api/mailing \
  --header 'authentication: API_KEY' \
  --header 'content-type: application/json' \
  --data '{
    "email": "TEST@ucsc.com"
}'
```

## Response Schemas

### Success

```json
{
  "error": false,
  "status": 200,
  "message": "TEST@ucsc.edu added to the mailing list"
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

### Internal or MailChimp Error

```json
{
  "error": true,
  "status": 500,
  "message": "Mailchimp Error: TEST@ucsc.edu is already a list member. Use PUT to insert or update list members."
}
```

## Technologies

- Azure Functions
- NodeJS
- Docker
- Jest
- Azure Pipelines
- Prettier
- Eslint
