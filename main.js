require('dotenv').config();

const tmi = require('tmi.js');
const process = require('process');
const fight = require('./handler/fight')

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

const client = new tmi.client(opts);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();

//Handle exits
process.on('exit', (code) => {
  console.log(">> EXIT");
});
process.on('SIGINT', (code) => {
  console.log(">> FORCED EXIT");
  process.exit();
});


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

  fight.handler(client, channel, context, msg);
}
