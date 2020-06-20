import type { ChatUserstate, Client } from "tmi.js";

let cooldown = false;

export function handler(
  globalSettings: Object,
  client: Client,
  channel: string,
  state: ChatUserstate,
  message: string
) {
  if (cooldown) return;
  if (!message.startsWith("!fight")) return;

  if (!globalSettings["active"]) return;
  cooldown = true;

  // Send "!Fight"
  client.say(channel, `!fight ${Date.now()}`);
  console.log(`>> ${state.username} triggerd !fightCmd`);

  // Reset cooldown
  setTimeout(() => {
    cooldown = false;
    console.log(">>!fightCmd timeout reset");
  }, 15000);
}
