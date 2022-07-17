import express from "express";
// import { handle } from 'express/lib/application';
import fs, { rmSync } from "fs";
import { METHODS } from "http";
import { resourceLimits } from "worker_threads";
import fetch from "node-fetch";
import { version } from "os";
import { resolveObjectURL } from "buffer";
import { resolveTxt } from "dns";
// import type { Request } from "node-fetch";
// const fetch = (...args) =>
// import("node-fetch").then(({ default: fetch }) => fetch(...args));
const app = express();
const PORT = 10001;

app.use(express.json());

// simple GET method
app.get("/", (req, res) => {
  // default get method
  console.log(`[/] GET called`);
  res.status(200).send({
    data: "welcome",
  });
});

/**
 * fake rendering endpoint
 * use this method to check received data content and format, which should be send from msdobot rendering function call
 */
app.post("/rendering", (req, res) => {
  console.log(`[/rendering] POST called`);
  // print received request body
  var body = req.body;
  console.log(`received request body:\n${body}`);
  // console.log(body)
  console.log("try to print some data of serviceA");
  console.log(body.specificAggregate["specific data set 1"].serviceA);
  // create discord template message json object
  // return result object, maybe use JSON.stringify()
  res.status(200).send("checked !!");
});

/**
 * fake rendering endpoint
 * try to create discord message template and return to msdobot after bot rendering function call
 */
app.post("/fakeMsg", (_, res) => {
  console.log(`[/fakeMsg] POST called`);
  console.log("[fakeMsg] create fake discord message template");
  var fieldList = [
    { name: "field 1", value: "field 1 content" },
    { name: "field 2", value: "field 2 content" },
  ];
  var embedObj = {
    title: "embed 1",
    titleLink: "embed 1 link",
    imageLink: "embed 1 img",
    description: "this is embed 1",
    fieldList: fieldList,
  };
  var embedObj2 = {
    title: "embed 2",
    titleLink: "embed 2 link",
    imageLink: "embed 2 img",
    description: "this is embed 2",
    fieldList: fieldList,
  };
  var msg = {
    mainMessage: "main message content",
    embedList: [embedObj, embedObj2],
  };
  res.status(200).send(JSON.stringify(msg));
});

/**
 * fake api (normal usage)
 * read local json file and return correspond service detail info
 */
app.post("/serviceDetail", (req, res) => {
  var target = req.body["Api.serviceName"];
  console.log("[/serviceDetail] POST called");
  console.log(req.body);
  console.log(`received service name is ${target}`);
  // async read local json file
  fs.readFile("info.json", "utf-8", function (err, content) {
    if (err) throw err;
    var info = JSON.parse(content);

    console.log(info);
    var data = info.info[target];
    console.log(data);
    res.status(200).send(data);
  });
});

/**
 * fake api (normal usage)
 * read local json file and return correspond service api detail info
 */
app.post("/serviceApiDetail", (req, res) => {
  var target = req.body["Api.serviceName"];
  console.log("[/serviceApiDetail] POST called");
  console.log(req.body);
  console.log(`received service name is ${target}`);
  // async read local json file
  fs.readFile("info.json", "utf-8", function (err, content) {
    if (err) throw err;
    var info = JSON.parse(content);

    console.log(info);
    var data = info.api[target];
    console.log(data);
    res.status(200).send(data);
  });
});

/**
 * fake api (aggregate)
 * aggregate service detail info and service api info
 * this method should know this is an service-level capability in the first place ?
 */
app.post("/aggregateServiceInfo", (req, res) => {
  console.log(`[/aggregateServiceInfo] POST called`);
  let body = req.body;
  console.log(body);
  let accessLevel = body.accessLevel;
  let resultName = body.resultName;
  let serviceDetail = body.properties.serviceDetail;
  let apiDetail = body.properties.apiDetail;
  let resultKey = [];
  let resultValue = [];
  let result = [];

  // anonymous function: create result aggregated detail
  var detail = (info: string, apis: object) => {
    let finalDetail = info + "\n";
    finalDetail += "Api list:\n";
    finalDetail += apis;
    return finalDetail;
  };

  // aggregate data, check all service data in service detail
  for (var service in serviceDetail) {
    if (serviceDetail.hasOwnProperty(service)) {
      let detailInfo = serviceDetail[service];
      let apiInfo = apiDetail[service];
      resultKey.push(service + "." + resultName);
      resultValue.push(detail(detailInfo, apiInfo));
    }
  }
  // construct result response data
  result.push(resultKey);
  result.push(resultValue);
  // response with result data
  console.log(`response:` + JSON.stringify(result));
  res.status(200).send(JSON.stringify(result));
});

/**
 * fake api (rendering)
 * rendering service detail info and service api info, this version should receive an aggregate report as request body
 * return discord message template json string
 */
app.post("/renderDetail", (req, res) => {
  console.log(`[/renderDetail] POST called`);
  let body = req.body;
  console.log(body);
  let aggregateData = body.aggregate;
  let specificAggregateData = body.specificAggregate;
  let properties = body.properties;
  let serviceDetails = specificAggregateData["serviceDetail"];
  let discordMsg: {
    mainMessage?: string;
    embedList?: {
      title: string;
    }[];
  } = {};

  discordMsg["mainMessage"] = "All Service Details:";
  let embedList = [];
  for (var service in serviceDetails) {
    if (serviceDetails.hasOwnProperty(service)) {
      let detail = serviceDetails[service];
      console.log(`detail:` + detail);
      let embed = {
        title: service,
        description: detail,
      };
      embedList.push(embed);
    }
  }
  discordMsg["embedList"] = embedList;
  console.log(`rendering result: \n` + JSON.stringify(discordMsg));
  res.status(200).send(JSON.stringify(discordMsg));
});

/**
 * fake api (normal)
 * get service error log
 */
app.post("/errorLog", (req, res) => {
  console.log("[/errorLog] POST called");
  console.log(req.body);
  let serviceName = req.body["Api.serviceName"];
  fs.readFile("error.json", "utf-8", function (err, content) {
    if (err) throw err;
    let fullErrLog = JSON.parse(content);
    console.log(fullErrLog);
    let serviceLog = fullErrLog.log[serviceName];
    console.log(`response: ` + serviceLog);
    res.status(200).send(serviceLog);
  });
});

/**
 * fake api (aggregate)
 * analyze service error log, get error time zone
 */
app.post("/logErrorAnalyze", (req, res) => {
  console.log("[/logErrorAnalyze] POST called");
  console.log(req.body);
  // let accessLevel = req.body.accessLevel
  let resultName = req.body.resultName;
  // let aggregateData = req.body.aggregate
  // let specificAggregateData = req.body.specificAggregate
  let properties = req.body.properties;
  // anonymous method: extract time zone from error log
  var findTime = (errLog) => {
    console.log("start to find error time zone");
    console.log(`errLog: ` + errLog);
    let logObj = JSON.parse(errLog);
    let start, end;
    let normal = true;
    let errorLogReg = /\[[a-z]+\] ([0-9]*)/;
    console.log(`start to loop all logs`);
    for (let logNum in logObj) {
      let log = logObj[logNum];
      console.log(`current log: ${log}`);
      if (log.startsWith("[up]")) {
        if (normal) {
          start = errorLogReg.exec(log)[1];
          console.log("start time is now set to " + start);
        } else {
          end = errorLogReg.exec(log)[1];
          console.log("end time is now set to " + end);
        }
      } else {
        normal = false;
      }
    }
    return start + "-" + end;
  };
  // aggregate data, check all service data in service detail
  let serviceLog = properties["serviceLog"];
  let resultKey = [];
  let resultValue = [];
  for (let service in serviceLog) {
    if (serviceLog.hasOwnProperty(service)) {
      let log = serviceLog[service];
      // analyze log to extract error time zone
      let zone = findTime(log);
      resultKey.push(service + "." + resultName);
      resultValue.push(zone);
    }
  }
  // construct reuslt aggregate report
  let result = [];
  result.push(resultKey);
  result.push(resultValue);
  console.log(`response: ` + result);
  res.status(200).send(JSON.stringify(result));
});

/**
 * fake api (normal)
 * get service build error
 */
app.post(`/buildErrLog`, (req, res) => {
  console.log(`[/buildErrLog] POST called`);
  console.log(req.body);
  let serviceName = req.body["Api.serviceName"];
  fs.readFile("error.json", "utf-8", function (err, content) {
    if (err) throw err;
    let buildErrLog = JSON.parse(content);
    // console.log(buildErrLog)
    let targetLog = buildErrLog.buildLog[serviceName];
    console.log("log of " + serviceName);
    console.log(targetLog);
    res.status(200).send(targetLog);
  });
});

/**
 * fake api (normal)
 * get service api error
 */
app.post(`/apiErrLog`, (req, res) => {
  console.log("[/apiErrLog] POST called");
  console.log(req.body);
  let serviceName = req.body["Api.serviceName"];
  fs.readFile("error.json", "utf-8", function (err, content) {
    if (err) throw err;
    let apiErrLog = JSON.parse(content);
    // console.log(apiErrLog)
    let targetLog = apiErrLog.apiLog[serviceName];
    console.log("api log of " + serviceName);
    console.log(targetLog);
    res.status(200).send(targetLog);
  });
});

/**
 * fake api (aggregate)
 * create error report (specific time zone), extract log from target time zone
 * system aggregate data: timeZone
 * properties: context-service error log
 */
app.post(`/extractSpecificLog`, (req, res) => {
  console.log(`[/extractSpecificLog] POST called`);
  console.log(req.body);
  let accessLevel = req.body.accessLevel;
  let resultName = req.body.resultName;
  let aggregateData = req.body.aggregate;
  let specificAggregateData = req.body.specificAggregate;
  let properties = req.body.properties;
  let timeZone = specificAggregateData["errorTimeZone"];
  // anonymous method: check if given log is in to error time zone
  var checkTimeZone = (log, zone) => {
    let startTime = zone.split("-")[0];
    let endTime = zone.split("-")[1];
    // console.log(`startTime: ${startTime}, endTime: ${endTime}, current log: ${log}`)
    // extract log time
    let time = "";
    if (log.includes("build")) {
      // console.log(`this is a build log`)
      // build log
      let reg = /\[([0-9]+)\].*/;
      time = reg.exec(log)[1];
    } else if (log.includes("status")) {
      // api log
      let reg = /\[\/[a-zA-Z]+\]\[([0-9]+)\] .*/;
      time = reg.exec(log)[1];
    }
    // console.log(`log time: ${time}`)
    if (time > startTime && time < endTime) {
      // console.log(`PASSED`)
      return true;
    }
    // console.log(`FAILED`)
    return false;
  };
  // aggregate data, extract target log
  let resultKey = [];
  let resultValue = [];
  let buildLog = properties["buildLog"];
  let apiLog = properties["apiLog"];
  let logResult = [];
  let apiResult = [];
  // loop all service build log
  for (let service in buildLog) {
    if (buildLog.hasOwnProperty(service)) {
      let serviceLog = JSON.parse(buildLog[service]);
      // loop each log message
      let errorLogs = [];
      for (let log in serviceLog) {
        if (checkTimeZone(serviceLog[log], timeZone[service])) {
          errorLogs.push(serviceLog[log]);
        }
      }
      let resultObj = {};
      resultObj[service] = errorLogs;
      logResult.push(resultObj);
    }
  }
  for (let service in apiLog) {
    if (apiLog.hasOwnProperty(service)) {
      let serviceLog = JSON.parse(apiLog[service]);
      let errorLogs = [];
      for (let log in serviceLog) {
        if (checkTimeZone(serviceLog[log], timeZone[service])) {
          errorLogs.push(serviceLog[log]);
        }
      }
      let resultObj = {};
      resultObj[service] = errorLogs;
      apiResult.push(resultObj);
    }
  }
  console.log(`logResult: ${JSON.stringify(logResult)}`);
  console.log(`apiResult: ${JSON.stringify(apiResult)}`);
  // create final report data
  for (let service in logResult) {
    let logPart = logResult[service];
    let apiPart = apiResult[service];
    for (let serviceName in logPart) {
      if (logPart.hasOwnProperty(serviceName)) {
        let value = logPart[serviceName].concat(apiPart[serviceName]);
        console.log(`value: ${JSON.stringify(value)}`);
        // resultValue = value
        resultValue.push(JSON.stringify(value));
        resultKey.push(serviceName + "." + resultName);
      }
    }
  }
  // return result report
  let result = [];
  result.push(resultKey);
  result.push(resultValue);
  console.log(`response: ${JSON.stringify(result)}`);
  res.status(200).send(JSON.stringify(result));
});

/**
 * fake api (rendering)
 * create specific time zone error report message
 */
app.post(`/renderErrLog`, (req, res) => {
  console.log(`[/renderErrLog] POST called`);
  console.log(req.body);
  let specificAggregateData = req.body.specificAggregate;
  let discordMsg = {};
  discordMsg["mainMessage"] = "Error log found:";
  let embedList = [];
  let errLog = specificAggregateData["errorLog"];
  for (let service in errLog) {
    if (errLog.hasOwnProperty(service)) {
      let embed = {};
      embed["title"] = service;
      embed["description"] = errLog[service];
      embedList.push(embed);
    }
  }
  console.log(embedList);
  discordMsg["embedList"] = embedList;
  console.log(`rendering result: \n` + JSON.stringify(discordMsg));
  res.status(200).send(JSON.stringify(discordMsg));
});

/**
 * fake api (normal)
 * get service error count
 */
app.post(`/listError`, (req, res) => {
  let target = req.body["Api.serviceName"];
  console.log("[/listError] POST called");
  console.log(req.body);
  console.log(`received service name is ${target}`);
  // async read local json file
  fs.readFile("error.json", "utf-8", function (err, content) {
    if (err) throw err;
    var info = JSON.parse(content);

    // console.log(info);
    var data = info.errorCount[target];
    console.log(`response: ` + data);
    res.status(200).send(`` + data);
  });
});

/**
 * fake api (aggregate)
 * get service error count, check highest one and return
 */
app.post(`/checkHighError`, (req, res) => {
  console.log(`[/checkHighError] POST called`);
  console.log(req.body);
  let accessLevel = req.body.accessLevel;
  let resultName = req.body.resultName;
  let aggregateData = req.body.aggregate;
  let specificAggregateData = req.body.specificAggregate;
  let properties = req.body.properties;
  let serviceErrorData = properties["serviceErrorCount"];
  // loop all service count, check highest error service
  let resultErrorService: string = "";
  let resultErrorCount: number = 0;

  console.log(`error data: ${JSON.stringify(serviceErrorData)}`);
  for (let serviceName in serviceErrorData) {
    console.log(`serviceName: ${serviceName}`);
    if (serviceErrorData.hasOwnProperty(serviceName)) {
      let errorCount: number = parseInt(serviceErrorData[serviceName]);
      console.log(
        `current: ${errorCount}, previous: ${resultErrorCount}, result: ${resultErrorService}`
      );
      if (errorCount > resultErrorCount) {
        resultErrorCount = errorCount;
        resultErrorService = serviceName;
      }
    }
  }
  // return result service name
  let resultKey = [];
  let resultValue = [];
  resultKey.push(resultName);
  resultValue.push(resultErrorService);
  let result = [];
  result.push(resultKey);
  result.push(resultValue);
  console.log(`response: ${JSON.stringify(result)}`);
  res.status(200).send(JSON.stringify(result));
});

/**
 * fake api (aggregate)
 * get error service name, check received service information and return the matched one
 */
app.post(`/aggregateServiceInfoError`, (req, res) => {
  console.log(`[/aggregateServiceInfoError] POST called`);
  console.log(req.body);
  let accessLevel = req.body.accessLevel;
  let resultName = req.body.resultName;
  let aggregateData = req.body.aggregate;
  let specificAggregateData = req.body.specificAggregate;
  let properties = req.body.properties;
  let serviceDetail = properties.serviceDetail;
  let apiDetail = properties.apiDetail;
  let errorService: string = aggregateData["errorService"];
  // find target service data
  let targetDetail: string;
  let targetApiDetail: string;
  // anonymous function: create result aggregated detail
  var detail = (info: string, apis: object) => {
    let finalDetail = info + "\n";
    finalDetail += "Api list:\n";
    finalDetail += apis;
    return finalDetail;
  };
  // aggregate data, check all service data in service detail
  for (var service in serviceDetail) {
    if (serviceDetail.hasOwnProperty(service)) {
      if (service === errorService) {
        let detailInfo = serviceDetail[service];
        let apiInfo = apiDetail[service];
        targetDetail = service + "." + resultName;
        targetApiDetail = detail(detailInfo, apiInfo);
      }
    }
  }
  let resultKey = [];
  resultKey.push(targetDetail);
  let resultValue = [];
  resultValue.push(targetApiDetail);
  let result = [];
  result.push(resultKey);
  result.push(resultValue);
  console.log(`response: ${JSON.stringify(result)}`);
  res.status(200).send(JSON.stringify(result));
});

/**
 * fake api (rendering)
 * rendering error service detail info and service api info, this version should receive an aggregate report as request body
 * return discord message template json string
 */
app.post("/renderDetailError", (req, res) => {
  console.log(`[/renderDetailError] POST called`);
  let body = req.body;
  console.log(body);
  let aggregateData = body.aggregate;
  let specificAggregateData = body.specificAggregate;
  let properties = body.properties;
  let serviceDetails = specificAggregateData["serviceDetail"];
  let discordMsg: {
    mainMessage?: string;
    embedList?: {
      title: string;
    }[];
  } = {};

  discordMsg["mainMessage"] = "Error Service Details:";
  let embedList = [];
  for (var service in serviceDetails) {
    if (serviceDetails.hasOwnProperty(service)) {
      let detail = serviceDetails[service];
      console.log(`detail:` + detail);
      if (detail === "") continue;
      let embed = {
        title: service,
        description: detail,
        // description: constructApiDetail(detail),
      };
      embedList.push(embed);
    }
  }
  discordMsg["embedList"] = embedList;
  console.log(`rendering result: \n` + JSON.stringify(discordMsg));
  res.status(200).send(JSON.stringify(discordMsg));
});

/**
 * normal capability
 * request actuator health endpoint
 */
app.post("/actuatorHealth", (req, res) => {
  console.log(`[/actuatorHealth] POST called`);
  let target = req.body["Api.serviceName"];
  console.log(req.body);
  let serviceEndpoint = req.body["Api.endpoint"];
  console.log(
    `received service name is ${target}, endpoint is ${serviceEndpoint}`
  );
  serviceEndpoint += "/health";
  fetch(serviceEndpoint)
    .then((res) => {
      let status = res.status;
      console.log(`>> response status is ${status}`);
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("request error");
      }
    })
    .then((data) => {
      console.log(`data = ${data}`);
      res.status(200).send(JSON.stringify(data));
    })
    .catch((err) => {
      console.log(`Error occurred`);
      type statusData = {
        status: string;
      };
      let errorData: statusData = {
        status: "unknown",
      };
      res.status(200).send(JSON.stringify(errorData));
    });
});

/**
 * testing method
 */
app.get("/testActHealth", (req, res) => {
  console.log("---");
  let target = "";
  console.log(`>> Actuactor testing method (health) triggered`);
  let endpoint = "http://140.121.196.23:10062/actuator/health";
  console.log(`>> target: 10062`);
  let result = "";
  fetch(endpoint)
    .then((res) => {
      let status = res.status;
      console.log(`>> response status is ${status}`);
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(status);
      }
    })
    .then((data) => {
      console.log(data);
      console.log(data.status);
      // res.status(200).send(`result data is '${data}'`);
      res.status(200).send("done");
    })
    .catch((err) => {
      console.log(err);
      res.status(200).send(`${err}, try again`);
    });
});

/**
 * request actuator env endpoint
 */
app.post("/actuatorEnv", (req, res) => {});

/**
 * requeset actuator info endpoint
 */
app.post("/actuatorInfo", (req, res) => {
  console.log(`[/actuatorInfo] POST called`);
  let target = req.body["Api.serviceName"];
  console.log(req.body);
  let serviceEndpoint = req.body["Api.endpoint"];
  console.log(
    `received service name is ${target}, endpoint is ${serviceEndpoint}`
  );
  serviceEndpoint += "/info";
  fetch(serviceEndpoint)
    .then((res) => {
      let status = res.status;
      console.log(`>> response status is ${status}`);
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("request error");
      }
    })
    .then((data) => {
      console.log(`data = ${data}`);
      res.status(200).send(JSON.stringify(data));
    })
    .catch((err) => {
      console.log(`Error occurred`);
      type versionData = {
        version: string;
      };
      let errorData: versionData = {
        version: "unknown",
      };
      res.status(200).send(JSON.stringify(errorData));
    });
});

/**
 * request swagger api list
 */
app.post("/swaggerApiList", (req, res) => {
  console.log(`[/swaggerApiList] POST called`);
  let target = req.body["Api.serviceName"];
  console.log(req.body);
  let serviceEndpoint = req.body["Api.endpoint"];
  console.log(
    `received service name is ${target}, endpoint is ${serviceEndpoint}`
  );
  // serviceEndpoint += "/v2/api-docs";
  fetch(serviceEndpoint)
    .then((res) => {
      let status = res.status;
      console.log(`>> response status is ${status}`);
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("request error");
      }
    })
    .then((data) => {
      console.log(`data = ${data}`);
      // gather api list
      let paths = data.paths;
      let result = ``;
      for (let apiName in paths) {
        if (paths.hasOwnProperty(apiName)) {
          result += apiName + `\n`;
        }
      }
      result = result.substring(0, result.length - 1);
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(`Error occurred`);
      res.status(200).send("");
    });
});

export type RenderMsg = {
  mainMessage?: string;
  embedList?: RenderMsgEmbed[];
};

export type RenderMsgEmbed = {
  title?: string;
  titleLink?: string;
  imageLink?: string;
  description?: string;
  fieldList?: MsgField[];
};

export type MsgField = {
  name: string;
  value: string;
};

/**
 * rendering capability
 * render actuator health, actuator info and swagger api list, kmamiz structure
 */
app.post("/renderServiceInfo", (req, res) => {
  console.log(`[/renderServiceInfo] POST called`);
  let body = req.body;
  console.log(body);
  let aggregateData = body.aggregate;
  let specificAggregateData = body.specificAggregate;
  let properties = body.properties;
  let apiList = properties["swaggerApiList"];
  let healthStatusList = properties["actuatorHealthStatus"];
  let versionInfoList = properties["actuatorVersionInfo"];
  let kmamizStructUrlList = properties["kmamizServiceStruct"];
  let discordMsg: RenderMsg = {};

  discordMsg.mainMessage = "All Service Info:";
  let embedList: RenderMsgEmbed[] = [];

  // loop all service properties with service name
  for (let name in versionInfoList) {
    if (versionInfoList.hasOwnProperty(name)) {
      let embed: RenderMsgEmbed = {};
      let fiedList: MsgField[] = [];
      embed.title = name;
      embed.titleLink = kmamizStructUrlList[name];
      embed.description = "Click title to check service structure.";
      let version: MsgField = {
        name: "Service version",
        value: versionInfoList[name],
      };
      let status: MsgField = {
        name: "Health Status",
        value: healthStatusList[name],
      };
      let api: MsgField = {
        name: "Api List",
        value: apiList[name],
      };
      fiedList.push(version);
      fiedList.push(status);
      fiedList.push(api);
      embed.fieldList = fiedList;
      embedList.push(embed);
    }
  }

  // combine final result
  discordMsg.embedList = embedList;
  console.log(`rendering result: \n` + JSON.stringify(discordMsg));
  res.status(200).send(JSON.stringify(discordMsg));
});

/**
 * normal capability
 * get kmamiz service structure
 */
app.post("/kmamizStruct", (req, res) => {
  console.log(`[/kmamizStruct] POST called`);
  let target = req.body["Api.serviceName"];
  console.log(req.body);
  let serviceEndpoint = req.body["Api.endpoint"];
  console.log(
    `received service name is ${target}, endpoint is ${serviceEndpoint}`
  );
  res.status(200).send(serviceEndpoint);
});

export type TLineChartData = {
  dates: number[];
  services: string[];
  metrics: [number, number, number, number, number][][];
};

export type TLineChartDataSpecific = {
  dates: number;
  service: string;
  metrics: [number, number, number, number, number];
};

var pdasNameMatcher = (info: string) => {
  let PDASDict = {
    UserService: "user-service.pdas (latest)",
    BlockChainService: "blockchain-service.pdas (latest)",
    ContractService: "contract-service.pdas (latest)",
    CredentialService: "credential-service.pdas (latest)",
    ExternalRequestService: "external-service.pdas (latest)",
    SignatureVerificationService: "signature-service.pdas (latest)",
  };
  return PDASDict[info];
};

/**
 * normal capability
 * get kmamiz service monitor data
 */
app.post("/kmamizMonitor", async (req, res) => {
  console.log(`[/kmamizMonitor] POST called`);
  const target = req.body["Api.serviceName"];
  console.log(req.body);
  const serviceEndpoint = `https://kmamiz-pdas-demo.stw.tw/api/v1/graph/line?notBefore=15768000000`;
  console.log(`received service name is ${target}`);
  const serviceName = pdasNameMatcher(target);
  console.log(`${target} found, convert to ${serviceName}`);

  const response = await fetch(serviceEndpoint);
  if (!response.ok) {
    return res.send(`failed, ${response.status} received`);
  }
  const data = (await response.json()) as TLineChartData;

  console.log(data);
  const serviceList = data.services;
  const serviceIndex = serviceList.indexOf(serviceName);
  const resultData: TLineChartDataSpecific = {
    service: target,
    dates: data.dates[data.dates.length - 1],
    metrics: data.metrics[data.metrics.length - 1][serviceIndex],
  };
  res.json(resultData);
});

interface Dict {
  [index: string]: string;
}

interface ServiceDict {
  [index: string]: Dict;
}

export type CrossContextParameter = {
  aggregate: Dict;
  specificAggregate: ServiceDict;
  properties: ServiceDict;
};

/**
 * aggregate capability
 * analyze kmamiz service risk
 */
app.post("/kmamizRiskAnalyze", async (req, res) => {
  console.log(`[/kmamizRiskAnalyze] POST called`);
  let body = req.body;
  console.log(body);
  const reqDict: CrossContextParameter = req.body;
  // const aggregateData = body.aggregate;
  // const specificAggregateData = body.specificAggregate;
  // const properties = body.properties;
  const monitorData = reqDict.properties["monitorData"];
  let risk = 0;
  let resultName = "";
  for (let serviceName in monitorData) {
    let detail: TLineChartDataSpecific = JSON.parse(monitorData[serviceName]);
    if (detail.metrics[4] > risk) {
      risk = detail.metrics[4];
      resultName = serviceName;
    }
  }
  let resultKey: string[] = [];
  resultKey.push(body.resultName);
  let resultValue: string[] = [];
  resultValue.push(resultName);
  let result: string[][] = [];
  result.push(resultKey);
  result.push(resultValue);
  console.log(`response: ${JSON.stringify(result)}`);
  res.json(result);
});

/**
 * rendering capability
 * render Kmamiz service monitor data
 */
app.post("/renderKmamizService", async (req, res) => {
  console.log(`[/renderKmamizService] POST called`);
  const body = req.body;
  console.log(body);
  const reqDict: CrossContextParameter = body;
  const targetServiceName = reqDict.aggregate["targetService"];
  const detail: TLineChartDataSpecific = JSON.parse(
    reqDict.properties.monitorData[targetServiceName]
  );
  let result: RenderMsg = {
    mainMessage: "Service Monitor Detail",
  };
  let embedList: RenderMsgEmbed[] = [];
  let embed: RenderMsgEmbed = {
    title: targetServiceName,
    description: new Date(detail.dates).toUTCString(),
  };
  let fieldList: MsgField[] = [];
  let req200: MsgField = {
    name: "request(200)",
    value: detail.metrics[0].toString(),
  };
  let req400: MsgField = {
    name: "request(400)",
    value: detail.metrics[1].toString(),
  };
  let req500: MsgField = {
    name: "request(500)",
    value: detail.metrics[2].toString(),
  };
  let variation: MsgField = {
    name: "Latency Variation",
    value: detail.metrics[3].toString(),
  };
  let risk: MsgField = {
    name: "risk",
    value: detail.metrics[4].toString(),
  };
  fieldList.push(req200, req400, req500, variation, risk);
  embed.fieldList = fieldList;
  embedList.push(embed);
  result.embedList = embedList;
  console.log(`response: ${result}`);
  res.json(result);
});

/**
 * rendering capability
 * render Kmamiz error service
 */
app.post("/renderRiskServiceInfo", (req, res) => {
  console.log(`[/renderRiskServiceInfo] POST called`);
  let body = req.body;
  console.log(body);
  let aggregateData = body.aggregate;
  const targetService = aggregateData["targetService"];
  let specificAggregateData = body.specificAggregate;
  let properties = body.properties;
  let apiList = properties["swaggerApiList"];
  let healthStatusList = properties["actuatorHealthStatus"];
  let versionInfoList = properties["actuatorVersionInfo"];
  let kmamizStructUrlList = properties["kmamizServiceStruct"];
  let discordMsg: RenderMsg = {};

  discordMsg.mainMessage = "Error Service Info:";
  let embedList: RenderMsgEmbed[] = [];

  // loop all service properties with service name
  for (let name in versionInfoList) {
    if (name !== targetService) {
      continue;
    }
    if (versionInfoList.hasOwnProperty(name)) {
      let embed: RenderMsgEmbed = {};
      let fiedList: MsgField[] = [];
      embed.title = name;
      embed.titleLink = kmamizStructUrlList[name];
      embed.description = "Click title to check service structure.";
      let version: MsgField = {
        name: "Service version",
        value: versionInfoList[name],
      };
      let status: MsgField = {
        name: "Health Status",
        value: healthStatusList[name],
      };
      let api: MsgField = {
        name: "Api List",
        value: apiList[name],
      };
      fiedList.push(version);
      fiedList.push(status);
      fiedList.push(api);
      embed.fieldList = fiedList;
      embedList.push(embed);
    }
  }
  // combine final result
  discordMsg.embedList = embedList;
  console.log(`rendering result: \n` + JSON.stringify(discordMsg));
  res.status(200).send(JSON.stringify(discordMsg));
});

app.listen(PORT, () =>
  console.log(`testing endpoint alive on http://localhost:${PORT}`)
);
