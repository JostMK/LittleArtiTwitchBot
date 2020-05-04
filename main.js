require('dotenv').config();

const tmi = require('tmi.js');
const process = require('process');

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

let cooldown = false;

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
  if (self) { return; }

  //prepare message and log it
  const commandName = msg.trim();
  let username = context['username'];
  console.log(`${username}: ${commandName}`);


  //handle commands
  if (cooldown) { return; }
  if (commandName.slice(0,6) === '!fight') {
    handleCommand(FightCommand, channel, 15000);
  }
}

function handleCommand(command, channel, cooldownTime = 5000) {
  command(channel);

  cooldown = true;
  setTimeout(function () { cooldown = false; console.log(">> timeout reset"); }, cooldownTime);
}

function FightCommand(target) {
  client.say(target, `!fight c:`);
  console.log(`>> triggerd !fight`);
}