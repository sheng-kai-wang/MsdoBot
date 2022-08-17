#!/bin/bash

mvn clean install -Dmaven.test.skip=true
cp ./target/msdobot-0.0.1-SNAPSHOT.jar app.jar

docker build Dockerfile.rabbitmq -t msdobot/rabbitmq:v1
docker build Dockerfile.msdobot -t msdobot/msdobot:v1