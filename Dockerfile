FROM mcr.microsoft.com/azure-functions/node:2.0

LABEL name="cruzhacks-mailing-service"
LABEL maintainer="CruzHacks 2020"
LABEL version="1.0.0"
LABEL repo="https://github.com/CruzHacks/cruzhacks-mailing-microservice"

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY . /home/site/wwwroot

EXPOSE 7071

RUN cd /home/site/wwwroot && \
    npm install --only=prod