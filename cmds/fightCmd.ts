import type { ChatUserstate, Client } from "tmi.js";

let cooldown = false;
let triggerCount = 0;

export function handler(
  globalSettings: Object,
  client: Client,
  channel: string,
  state: ChatUserstate,
  message: string
) {
  if (globalSettings['userBlacklist'].includes(state['username'])) return;

  if (cooldown) return;
  if (!message.startsWith("!fight")) return;

  if (!globalSettings["active"]) return;

  triggerCount++;

  if (triggerCount == 2) {
    cooldown = true;
    triggerCount = 0;

    // Send "!Fight"
    const emojis = ['SMOrc','PogChamp','CurseLit','CoolCat','MrDestructoid', 'SSSsss','SwiftRage','KAPOW','SabaPing','PowerUpL PowerUpR',':D','BloodTrail'];
    client.say(channel, `!fight ${emojis[Math.floor(Math.random() * emojis.length)]}`);
    console.log(`>> ${state.username} triggerd !fightCmd`);

    // Reset cooldown
    setTimeout(() => {
      cooldown = false;
      console.log(">>!fightCmd timeout reset");
    }, 15000);
  } else {
    setTimeout(() => {
      triggerCount = 0;
    }, 5000);
  }
}
