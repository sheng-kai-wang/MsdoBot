#!/bin/bash

cd Rasa
sh build.sh
cd ..

cd OuterApi
sh build.sh
cd ..

cd MsdoBot
sh build.sh
cd ..