#!/bin/bash

cd Rasa
docker-compose down
cd ..

cd MsdoBot
docker-compose down
cd ..