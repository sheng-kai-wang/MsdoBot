# OuterApi

## Data Format

### General Capability

#### Request

```json
{
  "<property-name>": "<property-value>"
}
```

example:

```json
{
  "Api.serviceName": "Game"
}
```

#### Response

##### plainText

no restriction

##### json

must be a json string

### Aggregate/Rendering Capability

#### Request

```json
{
  "aggregate": {
    "<aggregate-property-name>": "<value>"
  },
  "specificAggregate": {
    "<specific-aggregate-data-name>": {
      "<service-name>": "<value>"
    }
  },
  "properties": {
    "<property-name>": {
      "<service-name>": "<value>"
    }
  },
  "accessLevel": "<capability-access-level>",
  "resultName": "<aggregate-result-data-name>"
}
```

#### Response

##### Aggregate Capability

```json
[["<serviceName.resultProperty>"], ["<result-property-value>"]]
```

Note that is `accessLevel` is `service` , add service name at the begining of result property name

For example:
`serviceName` is `TestService` , `resultProperty` is `score`

service access level:
`[['TestService.score'], ['100']]`

system access level: `[['score'], ['100']]`

##### Rendering Capability

```json
{
  "mainMessage": "<message-content>",
  "embedList": [
    {
      "title": "<message-title>",
      "titleLink": "<message-title-link>",
      "imageLink": "<message-image-link>",
      "description": "<embed object description>",
      "fieldList": [
        {
          "name": "<embed-field-name>",
          "value": "<embed-field-value>"
        }
      ]
    }
  ]
}
```

check [HERE](https://b1naryth1ef.github.io/disco/bot_tutorial/message_embeds.html), or [Official Docs](https://discord.com/developers/docs/intro) for more detail information

## Available API List

### Prefix

If using local docker network, use prefix `{docker-container-name}:{port-number}`, for example: `msdobot-outer-api:10001`

Otherwise, use prefix `{your-domain-or-ip}:{port-number}`, for example: `localhost:10001`

### API list

| Method | Type      | Path                         | Description                      |
| ------ | --------- | ---------------------------- | -------------------------------- |
| GET    | none      | `/`                          | testing api, unused              |
| POST   | Rendering | `/rendering`                 | testing api, unused              |
| POST   | none      | `/fakeMsg`                   | testing api, unused              |
| POST   | General   | `/serviceDetail`             | testing api                      |
| POST   | General   | `/serviceApiDetail`          | testing api                      |
| POST   | Aggregate | `/aggregateServiceInfo`      | testing api                      |
| POST   | Rendering | `/renderDetail`              | testing api                      |
| POST   | General   | `/errorLog`                  | testing api                      |
| POST   | Aggregate | `/logErrorAnalyze`           | testing api                      |
| POST   | General   | `/buildErrLog`               | testing api                      |
| POST   | General   | `/apiErrLog`                 | testing api                      |
| POST   | Aggregate | `/extractSpecificLog`        | testing api                      |
| POST   | Rendering | `/renderErrLog`              | testing api                      |
| POST   | General   | `/listError`                 | testing api                      |
| POST   | Aggregate | `/checkHighError`            | testing api                      |
| POST   | Aggregate | `/aggregateServiceInfoError` | testing api                      |
| POST   | Rendering | `/renderDetailError`         | testing api                      |
| POST   | General   | `/actuatorHealth`            | Actuator api                     |
| POST   | none      | `/testActHealth`             | Actuator api, unused             |
| POST   | none      | `/actuatorEnv`               | Actuator api, incomplete         |
| POST   | General   | `/actuatorInfo`              | Actuator api                     |
| POST   | General   | `/swaggerApiList`            | Swagger api                      |
| POST   | Rendering | `/renderServiceInfo`         | Render Service information       |
| POST   | General   | `/kmamizStruct`              | KMamiz api                       |
| POST   | General   | `/kmamizMonitor`             | KMamiz api                       |
| POST   | Aggregate | `/kmamizRiskAnalyze`         | Analyze service risk data        |
| POST   | Rendering | `/renderKmamizService`       | Render risky service information |
| POST   | Rendering | `/renderRiskServiceInfo`     | Render risky service detail      |

---

## Description

### Testing Api

> this part of APIs are mostly only for testing purpose,
> APIs related to the system 'Game' also belong in this part

#### Greetings<span id="greetings-test"></span>

`GET /`

Type: `none`

used to test if the api endpoint is alive

#### Fake rendering<span id="rendering-test"></span>

`POST /rendering`

Type: `none`

used to test if rendering data format can work

#### Get service detail<span id="get-service-detail-test"></span>

`POST /serviceDetail`

Type: `General`

get service detail from testing system 'Game'

> Note: this api reads local file to operate and should not be used to query other system/service except for system 'Game'

#### Get service api detail<span id="get-service-api-detail-test"></span>

`POST /serviceApiDetail`

Type: `General`

get service api detail from testing system 'Game'

> Note: this api reads local file to operate and should not be used to query other system/service except for system 'Game'

#### Aggregate service info<span id="aggregate-service-info-test"></span>

`POST /aggregateServiceInfo`

Type: `Aggregate`

aggregate service detail and service api detail retrieved from testing system 'Game'

> Note: this api only works for system 'Game' and should not be used to query other system/service

#### Render service detail<span id="render-service-detail-test"></span>

`POST /renderDetail`

Type: `Rendering`

render service detail (general detail and api detail) in to discord message format

> Note: this api only works for system 'Game' and should not be used to query other system/service

#### Get service error log<span id="get-service-error-log-test"></span>

`POST /errorLog`

Type: `General`

get service error log

> Note: this api reads local file to operate and should not be used to query other system/service except for system 'Game'

#### Analyze service error log<span id="aggregate-service-error-log-test"></span>

`POST /logErrorAnalyze`

Type: `Aggregate`

analyze error log retrived from each service and find the time zone of error occurrence

> Note: this api only works for system 'Game' and should not be used to query other system/service

#### Get service build error log<span id="get-service-build-error-log-test"></span>

`POST /buildErrLog`

Type: `General`

get service build error log

> Note: this api reads local file to operate and should not be used to query other system/service except for system 'Game'

#### Get service api error log<span id="get-service-api-error-log-test"></span>

`POST /apiErrLog`

Type: `General`

get service api error log

> Note: this api reads local file to operate and should not be used to query other system/service except for system 'Game'

#### Extract specific log information<span id="extrect-specific-log-info-test"></span>

`POST /extractSpecificLog`

Type: `Aggregate`

extract logs from specific time zone

> Note: this api only works for system 'Game' and should not be used to query other system/service

#### Render error log message<span id="render-error-log-message-test"></span>

`POST /renderErrLog`

Type: `Rendering`

render error log into discord message format

> Note: this api only works for system 'Game' and should not be used to query other system/service

#### Get service error count<span id="get-service-error-count-test"></span>

`POST /listError`

Type: `General`

get service error count

> Note: this api reads local file to operate and should not be used to query other system/service except for system 'Game'

#### Analyze service error<span id="analyze-service-error-test"></span>

`POST /checkHighError`

Type: `Aggregate`

analyze service error count to find which service has the highest error count

> Note: this api only works for system 'Game' and should not be used to query other system/service

#### Find highest error service detail<span id="find-highest-error-service-test"></span>

`POST /aggregateServiceInfoError`

Type: `Aggregate`

find service detail about the service which has highest error count

> Note: this api only works for system 'Game' and should not be used to query other system/service

#### Render error service detail<span id="render-error-service-detail-test"></span>

`POST /renderDetailError`

Type: `Rendering`

render service detail about the highest error service

> Note: this api only works for system 'Game' and should not be used to query other system/service

### MsdoBot Main Api

main outer api of MsdoBot

Auxiliary tools listed below are used in this API section: `Actuator`, `Swagger`, `KMamiz`

> Note: due to different service naming, several KMamiz related APIs use hardcoded mapping table to find the corresponding service, update this table if neccessary
>
> ```javascript
> var pdasNameMatcher = (info: string) => {
>   let PDASDict = {
>     UserService: "user-service.pdas (latest)",
>     BlockChainService: "blockchain-service.pdas (latest)",
>     ContractService: "contract-service.pdas (latest)",
>     CredentialService: "credential-service.pdas (latest)",
>     ExternalRequestService: "external-service.pdas (latest)",
>     SignatureVerificationService: "signature-service.pdas (latest)",
>     EmailService: "email-service.pdas (latest)",
>   };
>   return PDASDict[info];
> };
> ```

#### Get Actuator health status<span id="actuator-health"></span>

`POST /actuatorHealth`

Type: `General`

get health status from Actuator

#### Get Actuator health status (test version)<span id="actuator-health-test"></span>

`POST /testActHealth`

Type: `none`

check if actuator health method is working, this api is unused in MsdoBot

#### Get Actuator environment information (Incomplete)<span id="actuator-env"></span>

`POST /actuatorEnv`

Type: `none`

get environment information from Actuator, this api is incomplete and unused in MsdoBot
