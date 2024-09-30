import { GatewayIntentBits} from "discord.js";

export function validateIntents(intents: any) {
  const validIntents = Object.keys(GatewayIntentBits).map(key => GatewayIntentBits[parseInt(key)]);
  intents.forEach((intent: { toString: () => string; }) => {
    if (!validIntents.includes(intent.toString())) {
      console.error(`Invalid intent detected: ${intent}. Please check your configuration.`);
      process.exit(1); 
    }
  });
}
