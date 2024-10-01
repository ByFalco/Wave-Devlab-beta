import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
} from "discord.js";
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import geoip from "geoip-lite";
import useragent from "useragent";
import { setupTicketManager, createTicketEmbed } from "./ticketManager.js";
import { rulesCommand } from "./commands/rules.js";
import { socialCommand } from "./commands/social.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.once("ready", () => {
  console.log(`Bot Discord connesso come ${client.user.tag}`);
  loadCommands(client);
});

client.login(process.env.DISCORD_BOT_TOKEN);

function generaStringaCasuale(lunghezza) {
  const caratteri =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let risultato = "";
  for (let i = 0; i < lunghezza; i++) {
    risultato += caratteri.charAt(Math.floor(Math.random() * caratteri.length));
  }
  return risultato;
}

const pendingChats = new Map();
const activeChats = new Map();

setInterval(() => {
  console.log("Chat attive:", Array.from(activeChats.keys()));
}, 60000); // Logga le chat attive ogni minuto

io.on("connection", (socket) => {
  console.log("Nuovo client connesso");

  socket.on("joinChat", ({ chatId }) => {
    socket.join(chatId);
    console.log(`Client joined chat: ${chatId}`);
    console.log("Stanze del socket:", socket.rooms);
    console.log("Chat attive:", Array.from(activeChats.keys()));
  });

  socket.on("startChat", async ({ name, email }) => {
    const chatId = generaStringaCasuale(24);
    try {
      const discordChannelId = await createDiscordChannel(chatId, name, email);
      activeChats.set(chatId, { name, email, messages: [], discordChannelId });
      socket.join(chatId);
      socket.emit("chatStarted", { chatId });
      console.log(`Chat iniziata: ${chatId}`);
    } catch (error) {
      console.error("Errore nell'avvio della chat:", error);
      socket.emit("chatError", {
        message: "Impossibile avviare la chat. Riprova più tardi.",
      });
    }
  });

  socket.on("sendMessage", ({ chatId, message, sender }) => {
    console.log(
      `Messaggio ricevuto da ${sender} per chat ${chatId}: ${message}`
    );
    const chat = activeChats.get(chatId);
    if (chat) {
      chat.messages.push({ sender, message, timestamp: new Date() });
      const channel = client.channels.cache.get(chat.discordChannelId);
      if (channel) {
        // Invia il messaggio al canale Discord
        channel.send(`${sender === "user" ? "Cliente" : "Agente"}: ${message}`);
      }

      // Emetti il messaggio al client con il tipo di mittente corretto
      if (sender === "user") {
        io.to(chatId).emit("newMessage", { sender: "user", message });
      } else if (sender === "agent") {
        io.to(chatId).emit("newMessage", { sender: "agent", message });
      } else {
        io.to(chatId).emit("newMessage", { sender: "system", message });
      }
    } else {
      console.error(`Chat ${chatId} non trovata`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnesso");
  });

  socket.on(
    "requestChat",
    async ({ clientId, name, email, description, userAgent }) => {
      const chatId = Date.now().toString();
      const ip = socket.handshake.address;
      const geo = geoip.lookup(ip);
      const ua = useragent.parse(userAgent);

      const userData = {
        clientId,
        name,
        email,
        description,
        ip,
        location: geo ? `${geo.city}, ${geo.country}` : "Sconosciuto",
        browser: `${ua.family} ${ua.major}.${ua.minor}`,
        os: `${ua.os.family} ${ua.os.major}.${ua.os.minor}`,
      };

      pendingChats.set(chatId, {
        ...userData,
        socketId: socket.id,
        messages: [],
      });
      socket.emit("chatPending", { chatId });

      const embed = new EmbedBuilder()
        .setTitle("Nuova richiesta di chat")
        .setColor(0x0099ff)
        .addFields(
          { name: "ID Cliente", value: userData.clientId || "Non fornito" },
          { name: "Nome", value: userData.name || "Non fornito" },
          { name: "Email", value: userData.email || "Non fornita" },
          { name: "Descrizione", value: userData.description || "Non fornita" },
          { name: "IP", value: userData.ip || "Non disponibile" },
          { name: "Posizione", value: userData.location || "Sconosciuta" },
          { name: "Browser", value: userData.browser || "Sconosciuto" },
          { name: "Sistema Operativo", value: userData.os || "Sconosciuto" }
        )
        .setTimestamp()
        .setFooter({ text: `Chat ID: ${chatId}` });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`accept_${chatId}`)
          .setLabel("Accetta")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`reject_${chatId}`)
          .setLabel("Rifiuta")
          .setStyle(ButtonStyle.Danger)
      );

      const channel = await client.channels.fetch(
        process.env.PENDING_CHATS_CHANNEL_ID
      );
      await channel.send({
        content: "<@&1211297757164347472>",
        embeds: [embed],
        components: [row],
      });

      setTimeout(() => {
        if (pendingChats.has(chatId)) {
          pendingChats.delete(chatId);
          socket.emit("chatExpired", { chatId });
        }
      }, 30 * 60 * 1000);
    }
  );
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignora i messaggi del bot

  const channelName = message.channel.name;
  if (!channelName.startsWith("chat-")) return; // Ignora i messaggi da canali non relativi alle chat

  const chatId = channelName.replace("chat-", "");

  if (activeChats.has(chatId)) {
    const chatData = activeChats.get(chatId);
    if (chatData.discordChannelId === message.channel.id) {
      console.log(
        `Messaggio da Discord per chat ${chatId}: ${message.content}`
      );
      io.to(chatId).emit("newMessage", {
        sender: "agent",
        message: message.content,
      });
      console.log("Evento newMessage emesso per il messaggio dell'agente");
    }
  } else {
    console.log(`Chat ${chatId} non trovata nelle chat attive`);
  }
});

async function closeChat(chatId, interaction) {
  try {
    await interaction.deferUpdate();
    const chat = activeChats.get(chatId);
    if (chat) {
      io.to(chatId).emit("chatClosed", {
        message:
          "La chat è stata chiusa dallo staff. Grazie per aver utilizzato il nostro servizio di supporto.",
      });

      activeChats.delete(chatId);

      try {
        const channel = await client.channels.fetch(chat.discordChannelId);
        if (channel && client.channels.cache.has(channel.id)) {
          await channel.delete();
          console.log(`Canale per la chat ${chatId} eliminato con successo.`);
        } else {
          console.log(
            `Il canale per la chat ${chatId} non esiste più o non è accessibile.`
          );
        }
      } catch (channelError) {
        if (channelError.code === 10003) {
          console.log(`Il canale per la chat ${chatId} è già stato eliminato.`);
        } else {
          console.error(
            `Errore nell'eliminazione del canale per la chat ${chatId}:`,
            channelError
          );
        }
      }

      await interaction.editReply({
        content: `Chat ${chatId} chiusa con successo.`,
        components: [],
      });
    } else {
      await interaction.followUp({
        content: "Questa chat non è più attiva o non esiste.",
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(`Errore nella chiusura della chat ${chatId}:`, error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "Si è verificato un errore nella chiusura della chat.",
        ephemeral: true,
      });
    } else {
      await interaction.followUp({
        content: "Si è verificato un errore nella chiusura della chat.",
        ephemeral: true,
      });
    }
  }
}

async function acceptChat(chatId, interaction) {
  const pendingChat = pendingChats.get(chatId);
  if (pendingChat) {
    try {
      await interaction.deferUpdate();
      const discordChannelId = await createDiscordChannel(chatId, pendingChat);
      activeChats.set(chatId, { ...pendingChat, discordChannelId });
      pendingChats.delete(chatId);
      io.to(pendingChat.socketId).emit("chatAccepted", { chatId });

      // Usa editReply invece di update
      await interaction.editReply({
        content: `Chat ${chatId} accettata e canale creato.`,
        components: [],
      });
    } catch (error) {
      console.error(`Errore nell'accettazione della chat ${chatId}:`, error);

      // Usa followUp invece di update se l'interazione è già stata gestita
      await interaction.followUp({
        content: "Si è verificato un errore nell'accettazione della chat.",
        ephemeral: true,
      });
    }
  } else {
    await interaction.followUp({
      content: "Questa richiesta di chat non è più valida.",
      ephemeral: true,
    });
  }
}

async function rejectChat(chatId, interaction) {
  try {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: "Elaborazione in corso...",
        components: [],
      });
    } else {
      await interaction.deferUpdate();
    }

    const chat = pendingChats.get(chatId);
    if (chat) {
      io.to(chatId).emit("chatClosed", {
        message:
          "Il Supporto Clienti è momentaneamente offline. Riprova più tardi.",
      });
      // Logica per rifiutare la chat
      pendingChats.delete(chatId);
      await interaction.editReply({
        content: `Chat ${chatId} rifiutata con successo.`,
        components: [],
      });
    } else {
      await interaction.editReply({
        content: "Questa chat non è più attiva o non esiste.",
        components: [],
      });
    }
  } catch (error) {
    console.error(`Errore nel rifiuto della chat ${chatId}:`, error);
    await handleInteractionError(
      interaction,
      "Si è verificato un errore nel rifiuto della chat."
    );
  }
}

async function handleInteractionError(interaction, errorMessage) {
  try {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: errorMessage, components: [] });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  } catch (replyError) {
    console.error(
      "Errore nel tentativo di rispondere all'interazione:",
      replyError
    );
  }
}

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isButton() && !interaction.isModalSubmit()) return;

    const [action, chatId] = interaction.customId.split("_");

    switch (action) {
      case "open":
        if (interaction.customId === "open_ticket_modal") {
          await ticketManager.createTicket(interaction);
        }
        break;
      case "close":
        if (chatId) {
          await ticketManager.closeTicket(interaction, chatId);
        }
        break;
      case "accept":
        if (chatId) {
          await acceptChat(chatId, interaction);
        }
        break;
      case "reject":
        if (chatId) {
          await rejectChat(chatId, interaction);
        }
        break;
      case "ticket":
        if (interaction.isModalSubmit()) {
          await ticketManager.handleTicketSubmit(interaction);
        }
        break;
      default:
        console.log(`Azione non riconosciuta: ${action}`);
        await interaction.reply({
          content: "Azione non valida.",
          ephemeral: true,
        });
    }
  } catch (error) {
    console.error("Errore nella gestione dell'interazione:", error);
    await handleInteractionError(
      interaction,
      "Si è verificato un errore durante l'elaborazione della richiesta."
    );
  }
});

async function createDiscordChannel(chatId, userData) {
  try {
    const guild = client.guilds.cache.first();
    if (!guild) {
      throw new Error("Nessun server Discord trovato");
    }

    const category = await guild.channels.fetch(process.env.TICKET_CATEGORY_ID);
    if (!category) {
      throw new Error("Categoria ticket non trovata");
    }

    const channel = await guild.channels.create({
      name: `chat-${chatId}`,
      type: ChannelType.GuildText,
      parent: category,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: process.env.STAFF_ROLE_ID,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });

    console.log(`Canale Discord creato: ${channel.name} con ID: ${channel.id}`);

    // Aggiorna activeChats con l'ID del canale Discord
    activeChats.set(chatId, { ...userData, discordChannelId: channel.id });
    console.log(
      "Chat attive dopo la creazione:",
      Array.from(activeChats.entries())
    );

    // Crea l'embed migliorato con le informazioni dell'utente
    const embed = new EmbedBuilder()
      .setTitle("📞 Nuova Chat di Supporto")
      .setColor(0x00ae86)
      .setDescription(
        `Un nuovo utente ha richiesto assistenza. ID Chat: ${chatId}`
      )
      .addFields(
        {
          name: "👤 Nome",
          value: userData.name || "Non fornito",
          inline: true,
        },
        {
          name: "📧 Email",
          value: userData.email || "Non fornita",
          inline: true,
        },
        {
          name: "🆔 ID Cliente",
          value: userData.clientId || "Non fornito",
          inline: true,
        },
        {
          name: "📝 Descrizione",
          value: userData.description || "Non fornita",
        },
        {
          name: "🌐 Browser",
          value: userData.browser || "Sconosciuto",
          inline: true,
        },
        {
          name: "💻 Sistema Operativo",
          value: userData.os || "Sconosciuto",
          inline: true,
        },
        {
          name: "🌍 Posizione",
          value: userData.location || "Sconosciuta",
          inline: true,
        },
        { name: "🔢 IP", value: userData.ip || "Non disponibile" }
      )
      .setTimestamp()
      .setFooter({ text: "Wave Support System" });

    // Crea il pulsante per chiudere la chat
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`close_${chatId}`)
        .setLabel("Chiudi Chat")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🔒")
    );

    // Invia l'embed e il pulsante nel canale Discord
    await channel.send({ embeds: [embed], components: [row] });

    return channel.id;
  } catch (error) {
    console.error("Errore nella creazione del canale Discord:", error);
    throw error;
  }
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

client.on("error", (error) => {
  console.error("Discord client error:", error);
});

const ticketManager = setupTicketManager(io, client, activeChats);

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "!setup") {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const setupEmbed = createTicketEmbed();
      await message.channel.send(setupEmbed);
      await message.delete();
    } else {
      await message.reply("Non hai i permessi per eseguire questo comando.");
    }
  }
});

function loadCommands(client) {
  client.commands = new Map();
  client.commands.set(rulesCommand.name, rulesCommand);
  client.commands.set(socialCommand.name, socialCommand);
}

client.on("messageCreate", (message) => {
  if (!message.content.startsWith("!") || message.author.bot) return;

  const args = message.content.slice(1).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(
      "Si è verificato un errore durante l'esecuzione del comando."
    );
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
