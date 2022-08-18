#!/bin/bash

mvn clean install -Dmaven.test.skip=true
cp ./target/msdobot-0.0.1-SNAPSHOT.jar app.jar

docker build . -f Dockerfile.rabbitmq -t msdobot/rabbitmq:v1
docker build . -f Dockerfile.msdobot -t msdobot/msdobot:v1