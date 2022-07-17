# build action server image
sudo docker build . -f Dockerfile.action -t msdobot/action:v1

# build rasa server image
sudo docker build . -f Dockerfile.rasa -t msdobot/rasa:v1