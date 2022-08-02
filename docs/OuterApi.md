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

coming soon...

| Method | Type      | Path                         | Description              |
| ------ | --------- | ---------------------------- | ------------------------ |
| GET    | none      | `/`                          | testing api, unused      |
| POST   | Rendering | `/rendering`                 | testing api, unused      |
| POST   | none      | `/fakeMsg`                   | testing api, unused      |
| POST   | General   | `/serviceDetail`             | testing api, Game system |
| POST   | General   | `/serviceApiDetail`          | testing api, Game system |
| POST   | Aggregate | `/aggregateServiceInfo`      | testing api, Game system |
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

## Description
