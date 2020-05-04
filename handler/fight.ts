import type { ChatUserstate, Client } from "tmi.js";
let cooldown = false;

export function handler(
  client: Client,
  channel: string,
  state: ChatUserstate,
  message: string
) {
  if (cooldown) return;
  if (!message.startsWith("!fight")) return;
  cooldown = true;

  // Send "!Fight"
  client.say(channel, `!fight ${Date.now()}`);
  console.log(`>> ${state.username} triggerd !fight`);

  // Reset cooldown
  setTimeout(() => {
    cooldown = false;
    console.log(">> timeout reset");
  }, 15000);
}
