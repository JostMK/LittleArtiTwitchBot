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
  if (!message.startsWith("!off")) return;

  if (!globalSettings["active"]) return;
  cooldown = true;

  client.say(channel, `!turning off`);
  console.log(`>> ${state.username} triggerd !offCmd`);

  globalSettings["active"] = false;

  // Reset cooldown
  setTimeout(() => {
    cooldown = false;
    console.log(">>!offCmd timeout reset");
  }, 1000);
}
