# Deployment

## Preparation

Apply a Discord Application from [Here](https://discord.com/developers/applications).

Go to Bot User page (accessible after enable Bot User function), enable everything except `OAUTH2 grant` and get a new bot token.

Now you can invite the bot into your own Discord server by using the invite link.

Invite link can be generated at the Application -> URL Generator page. Remember to enable following options when generating your link:

- Scopes:
  - `bot`
  - `applications.commands`
- Bot Permissions:
  - `Administrator`

## Build and Deploy

Our system is composed of four differenct parts:

- MsdoBot main system
- Rasa server
- RabbitMQ server
- Outer api endpoints

We provide two different way to bulid and deploy

- [Manual Version](#Manual-Version)
- [Docker Version](#Docker-version)

### Manual Version

#### Rasa server

> You need to have Rasa framework installed before doing this. Follow the installation document [here](https://rasa.com/docs/rasa/installation/).

Build a new Rasa module

```bash
rasa train --fixed-model-name msdobot-rasa-v1
```

Run Rasa action server

```bash
rasa run actions
```

Run Rasa server

```bash
rasa run --model models/msdobot-rasa-v1.tar.gz
```

If you altered any settings, you can run `rasa data validate` to validate your new settings and rebuild a new module by following previous steps.

#### RabbitMQ server

You can use your own RabbitMQ server or run

```bash
docker run -d --name msdobot-rabbitmq -e RABBITMQ_DEFAULT_USER=<rabbitmq-username> -e RABBITMQ_DEFAULT_PASS=<rabbitmq-password> -p "5672:5672" -p "15672:15672" rabbitmq:3-management
```

Replace `<rabbitmq-username>` and `<rabbitmq-password>` with your settings

#### Outer Api Endpoint

build and run endpoint

```bash
npm install
npm start
```

> Note: if you use this version, edit file name of [capability-v2.yml](./MsdoBot/src/resources/../main/resources/static/capability-v2.yml) to `capability.yml` and change original `capability.yml` filename to other name.

If you want to add new endpoints, new endpoints should support RESTful api and use specified data format. No further limitations.

#### MsdoBot main server

Edit following application.properties with your settings

```
# discord config
discord.bot.token=<discord bot token>
discord.server.id=<your discord server id>
discord.testChannel.id=<target-channel-id>

# rasa config
rasa.endpoint=<rasa-endpoint>

# rabbitmq config
discord.channel.rabbitmq=<rabbitmq-channel-id>
spring.rabbitmq.host=<rabbitmq-server-hostname>
spring.rabbitmq.port=<rabbitmq-server-port>
spring.rabbitmq.password=<rabbitmq-password>
spring.rabbitmq.username=<rabbitmq-username>
discord.rabbitmq.exchange=<rabbitmq-exahnge>
discord.rabbitmq.queue=<rabbitmq-queue>
```

`discord.bot.token`: Your Discord Application Bot User token

`discord.server.id`: Your Discord server ID

`discord.testChannel.id`: Discord Channel ID of the channel where you want to walk to MsdoBot

`rasa.endpoint`: Rasa endpoint, change `msdobot-rasa` to `localhost` if you use manual version deployment

`discord.channel.rabbitmq`: Discord Channel ID of the channel where you want MsdoBot to send real-time message

`spring.rabbitmq.host`: Your RabbitMQ server hostname

`spring.rabbitmq.port`: Your RabbitMQ server port number

`spring.rabbitmq.username`: Your RabbitMQ server username

`spring.rabbitmq.password`: Your RabbitMQ server password

`discord.rabbitmq.exchange`: RabbitMQ Exchange you want MsdoBot to use

`discord.rabbitmq.queue`: RabbitMQ Queue you want MsdoBot to use

Build MsdoBot Server

```bash
mvn clean install -Dmaven.test.skip=true
cp ./target/msdobot-0.0.1-SNAPSHOT.jar app.jar
```

Run MsdoBot Server

```bash
java -jar app.jar
```

If you use specific application properties profile, use flag `-Dspring.profiles.active=<your-profile>` to activate it.

```bash
java -Dspring.profiles.active=<your-profile> -jar app.jar
```

### Docker Version

Build

```bash
cd Rasa
sh build.sh
cd ..

cd MsdoBot
sh build.sh
cd ..
```

Run

```bash
cd Rasa
sh run.sh
cd ..

cd MsdoBot
sh run.sh
cd ..
```
