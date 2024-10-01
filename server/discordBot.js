import { Client, GatewayIntentBits, ChannelType } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export async function setupDiscordBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
    ],
  });

  try {
    await client.login(process.env.DISCORD_BOT_TOKEN);
    console.log("Bot Discord connesso con successo");

    client.on("ready", () => {
      console.log(`Bot connesso come ${client.user.tag}`);
      console.log(
        "Server disponibili:",
        client.guilds.cache.map((g) => g.name).join(", ")
      );
      console.log("ID del server:", client.guilds.cache.first()?.id);
      console.log(
        "Categorie disponibili:",
        client.guilds.cache
          .first()
          ?.channels.cache.filter((c) => c.type === ChannelType.GuildCategory)
          .map((c) => `${c.name}: ${c.id}`)
          .join(", ")
      );
    });

    return client;
  } catch (error) {
    console.error("Errore nella connessione del bot Discord:", error);
    throw error;
  }
}
