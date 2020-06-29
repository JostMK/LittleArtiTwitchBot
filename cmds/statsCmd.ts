import type { ChatUserstate, Client } from "tmi.js";
import fs = require('fs');

const filePath = 'data/stats.json';
const autoSaveInterval = 15;

let cooldown = false;
let stats: { [id: string]: number; } = {};

export function init() {
    LoadStats();

    process.on('exit', (code) => {
        SaveStats();
    });

    SheduleAutoSave();
}

export function handler(
    globalSettings: Object,
    client: Client,
    channel: string,
    state: ChatUserstate,
    message: string
) {
    if (globalSettings['userBlacklist'].includes(state['username'])) return;

    HandleNewMessage(state);

    if (cooldown) return;
    if (!message.startsWith("!stats")) return;
    cooldown = true;

    // Send stats
    let topFive = Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 5)

    let output = "/me Stats:";
    topFive.forEach(element => {
        output += ` -- ${element[0]}: ${element[1]} --`;
    });

    client.say(channel, output);

    console.log(`>> ${state.username} triggerd !statsCmd`);

    // Reset cooldown
    setTimeout(() => {
        cooldown = false;
        console.log(">>!statsCmd timeout reset");
    }, 15000);
}

function HandleNewMessage(state: ChatUserstate) {
    let username = state['username'];
    if (!stats[username])
        stats[username] = 1;
    else
        stats[username] = stats[username] + 1;
}

function SaveStats() {
    let jsonData = JSON.stringify(stats);
    console.log(">>Saving stats: \n\n" + jsonData + "\n");
    fs.writeFileSync(filePath, jsonData);
}

function LoadStats() {
    if (!fs.existsSync(filePath)) { return; }

    let jsonData = fs.readFileSync(filePath, 'utf8');
    if (jsonData == "") { return; }

    stats = JSON.parse(jsonData);
}

//auto Save
function SheduleAutoSave() {
    setTimeout(() => {
        AutoSave();
    }, autoSaveInterval*60*1000);
}

function AutoSave() {
    console.log(">>Autosaving");
    SaveStats();
    SheduleAutoSave();
}