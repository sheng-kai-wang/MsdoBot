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

| Method | Type      | Path                         | Description              |
| ------ | --------- | ---------------------------- | ------------------------ |
| GET    | none      | `/`                          | testing api, unused      |
| POST   | Rendering | `/rendering`                 | testing api, unused      |
| POST   | none      | `/fakeMsg`                   | testing api, unused      |
| POST   | General   | `/serviceDetail`             | testing api              |
| POST   | General   | `/serviceApiDetail`          | testing api              |
| POST   | Aggregate | `/aggregateServiceInfo`      | testing api              |
| POST   | Rendering | `/renderDetail`              | testing api, Game system |
| POST   | General   | `/errorLog`                  | testing api, Game system |
| POST   | Aggregate | `/logErrorAnalyze`           | testing api, Game system |
| POST   | General   | `/buildErrLog`               | testing api, Game system |
| POST   | General   | `/apiErrLog`                 | testing api, Game system |
| POST   | Aggregate | `/extractSpecificLog`        | testing api, Game system |
| POST   | Rendering | `/renderErrLog`              | testing api, Game system |
| POST   | General   | `/listError`                 | testing api, Game system |
| POST   | Aggregate | `/checkHighError`            | testing api, Game system |
| POST   | Aggregate | `/aggregateServiceInfoError` | testing api, Game system |
| POST   | Rendering | `/renderDetailError`         | testing api, Game system |
| POST   | General   | `/actuatorHealth`            | Actuator api             |
| POST   | General   | `/testActHealth`             | testing api, unused      |
| POST   | General   | `/actuatorEnv`               | Actuator api, incomplete |
| POST   | General   | `/actuatorInfo`              | Actuator api             |
| POST   | General   | `/swaggerApiList`            | Swagger api              |
| POST   | Rendering | `/renderServiceInfo`         |                          |
| POST   | General   | `/kmamizStruct`              | KMamiz api               |
| POST   | General   | `/kmamizMonitor`             | KMamiz api               |
| POST   | Aggregate | `/kmamizRiskAnalyze`         |                          |
| POST   | Rendering | `/renderKmamizService`       |                          |
| POST   | Rendering | `/renderRiskServiceInfo`     |                          |

---

## Description

### Testing Api

> this part of APIs are mostly only for testing purpose,
> APIs related to the system 'Game' also belong in this part

#### Get service detail<span id="get-service-detail-test"></span>

`GET /serviceDetail`

get service detail from testing system 'Game'

> Note: this api reads local file to operate and should not be used to query other system/service except for system 'Game'

#### Get service api detail<span id="get-service-api-detail-test"></span>

`POST /serviceApiDetail`

get service api detail from testing system 'Game'

> Note: this api reads local file to operate and should not be used to query other system/service except for system 'Game'

#### Aggregate service info<span id="aggregate-service-info-test"></span>

`POST /aggregateServiceInfo`

aggregate service detail and service api detail retrieved from testing system 'Game'

> Note: this api only works for system 'Game' and should not be used to query other system/service

#### Render service detail<span id="render-service-detail-test"></span>

`POST /renderDetail`

render service detail (general detail and api detail) in to discord message format

> Note: this api only works for system 'Game' and should not be used to query other system/service

#### Get service error log<span id="get-service-error-log-test"></span>

`POST /errorLog`

get service error log

> Note: this api reads local file to operate and should not be used to query other system/service except for system 'Game'

#### Analyze service error log<span id="aggregate-service-error-log-test"></span>

`POST /logErrorAnalyze`

analyze error log retrived from each service and find the time zone of error occurrence

> Note: this api only works for system 'Game' and should not be used to query other system/service

#### Get service build error log<span id="get-service-build-error-log-test"></span>

`POST /buildErrLog`

get service build error log

> Note: this api reads local file to operate and should not be used to query other system/service except for system 'Game'

#### Get service api error log<span id="get-service-api-error-log-test"></span>

`POST /apiErrLog`

get service api error log

> Note: this api reads local file to operate and should not be used to query other system/service except for system 'Game'

#### Extract specific log information<span id="extrect-specific-log-info-test"></span>

`POST /extractSpecificLog`

extract logs from specific time zone

> Note: this api only works for system 'Game' and should not be used to query other system/service

#### Render error log message<span id="render-error-log-message-test"></span>

`POST /renderErrLog`

render error log into discord message format

> Note: this api only works for system 'Game' and should not be used to query other system/service

#### Get service error count<span id="get-service-error-count-test"></span>

get service error count

> Note: this api reads local file to operate and should not be used to query other system/service except for system 'Game'

### MsdoBot Main Api
