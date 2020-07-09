require('dotenv').config();
const fs = require('fs');

const tmi = require('tmi.js');

//Handle exits
process.on('exit', (code) => {
  console.log(">> EXIT");
});
process.on('SIGINT', (code) => {
  console.log(">> FORCED EXIT");
  process.exit();
});

var globalSettings = {
  active: true,
  userBlacklist: loadBlacklist(),
};

function loadBlacklist() {
  let filePath = './data/blacklist.json';
  if (!fs.existsSync(filePath))
    return [];

  let jsonData = fs.readFileSync(filePath, 'utf8');
  if (jsonData == "") return [];

  return JSON.parse(jsonData);
}

//Bot setup
const opts = {
  identity: {
    username: process.env.ID_USERNAME,
    password: process.env.ID_OAUTHKEY
  },
  channels: [
    'artimus83'
  ]
};

let client;
function CreateClient() {
  client = new tmi.client(opts);

  client.on('message', onMessageHandler);
  client.on('connected', onConnectedHandler);
  client.on("reconnect", () => {
    console.log(">> RECONNECTING");
    client.disconnect();
    CreateClient();
  });
  client.on("disconnected", (reason) => {
    console.log(">> DISCONNECTED: " + reason);
  });

  client.connect();
}

CreateClient();

//load all commands
const fight = require('./cmds/fightCmd')
const off = require('./cmds/offCmd')
const on = require('./cmds/onCmd')
const stats = require('./cmds/statsCmd')

//init commands
stats.init();


function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}\n`);
}

function onMessageHandler(channel, context, msg, self) {
  if (self) {
    return;
  }

  //prepare message and log it
  const commandName = msg.trim();
  let username = context["username"];
  console.log(`${username}: ${commandName}`);

  //handle commands
  fight.handler(globalSettings, client, channel, context, msg);
  off.handler(globalSettings, client, channel, context, msg);
  on.handler(globalSettings, client, channel, context, msg);
  stats.handler(globalSettings, client, channel, context, msg);
}
