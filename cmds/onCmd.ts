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
  if (!message.startsWith("!on")) return;

  if (globalSettings["active"]) return;
  cooldown = true;

  client.say(channel, `!turning on`);
  console.log(`>> ${state.username} triggerd !onCmd`);

  globalSettings["active"] = true;

  // Reset cooldown
  setTimeout(() => {
    cooldown = false;
    console.log(">>!onCmd timeout reset");
  }, 1000);
}
