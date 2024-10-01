import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  PermissionsBitField,
} from "discord.js";

// Sposta la funzione createTicketEmbed fuori dalla funzione setupTicketManager
export function createTicketEmbed() {
  const embed = new EmbedBuilder()
    .setColor("#DAA520")
    .setTitle("Supporto Clienti Wave")
    .setDescription(
      "Hai bisogno di assistenza? Apri un ticket e saremo felici di aiutarti."
    )
    .addFields(
      {
        name: "Come procedere",
        value: "Clicca sul pulsante qui sotto per aprire un nuovo ticket.",
      },
      {
        name: "Tempi di risposta",
        value: "Risponderemo entro 24 ore lavorative.",
      }
    )
    .setFooter({
      text: "Wave Support System",
    })
    .setTimestamp()
    .setImage("https://i.postimg.cc/K8H3QysH/Supporto-Clienti.png");

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("open_ticket_modal")
      .setLabel("Apri Ticket")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("🎫")
  );

  return { content: "@everyone", embeds: [embed], components: [row] };
}

export function setupTicketManager(io, client, activeChats) {
  return {
    createTicket: async (interaction) => {
      try {
        const modal = new ModalBuilder()
          .setCustomId("ticket_modal")
          .setTitle("Apri un nuovo ticket");

        const clientCodeInput = new TextInputBuilder()
          .setCustomId("clientCode")
          .setLabel("Codice Cliente (se disponibile)")
          .setStyle(TextInputStyle.Short)
          .setRequired(false);

        const descriptionInput = new TextInputBuilder()
          .setCustomId("description")
          .setLabel("Descrivi il tuo problema o la tua richiesta")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(clientCodeInput),
          new ActionRowBuilder().addComponents(descriptionInput)
        );

        await interaction.showModal(modal);
      } catch (error) {
        console.error("Errore nell'apertura del ticket:", error);
        await handleInteractionError(
          interaction,
          "Si è verificato un errore nell'apertura del ticket. Riprova più tardi."
        );
      }
    },

    handleTicketSubmit: async (interaction) => {
      try {
        await interaction.deferReply({ ephemeral: true });
        const clientCode = interaction.fields.getTextInputValue("clientCode");
        const description = interaction.fields.getTextInputValue("description");

        const channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          parent: process.env.TICKET_CATEGORY_ID,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: interaction.user.id,
              allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: process.env.STAFF_ROLE_ID,
              allow: [PermissionsBitField.Flags.ViewChannel],
            },
          ],
        });

        const staffRole = interaction.guild.roles.cache.find(
          (role) => role.name === "🔰・Wave Staff"
        );

        const ticketEmbed = new EmbedBuilder()
          .setColor("#DAA520")
          .setTitle("Nuovo Ticket")
          .setDescription(`Ticket aperto da ${interaction.user}`)
          .addFields(
            { name: "Codice Cliente", value: clientCode || "Non fornito" },
            { name: "Descrizione", value: description }
          )
          .setFooter({ text: "Wave Support System" })
          .setTimestamp();

        const closeButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("Chiudi Ticket")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("🔒")
        );

        await channel.send({
          content: staffRole ? `${staffRole}` : "Attenzione staff!",
          embeds: [ticketEmbed],
          components: [closeButton],
        });

        await interaction.editReply({
          content: `Ticket aperto con successo! Controlla il nuovo canale creato: ${channel}`,
          ephemeral: true,
        });
      } catch (error) {
        console.error("Errore nella gestione del ticket:", error);
        await handleInteractionError(
          interaction,
          "Si è verificato un errore nella creazione del ticket. Riprova più tardi."
        );
      }
    },

    closeTicket: async (interaction, chatId) => {
      try {
        await interaction.deferUpdate();
        // Invia un messaggio di chiusura al client
        io.to(chatId).emit("chatClosed", {
          message:
            "La chat è stata chiusa dallo staff. Grazie per aver utilizzato il nostro servizio di supporto.",
        });

        await interaction.editReply({
          content: "Il ticket è stato chiuso con successo.",
          components: [],
        });
        setTimeout(async () => {
          // Chiudi il canale Discord
          await interaction.channel.delete();
        }, 3000);
        // Rimuovi la chat attiva
        activeChats.delete(chatId);
      } catch (error) {
        console.error("Errore nella chiusura del ticket:", error);
        await handleInteractionError(
          interaction,
          "Si è verificato un errore nella chiusura del ticket."
        );
      }
    },

    handleButtonInteraction: async (interaction) => {
      const [action, chatId] = interaction.customId.split("_");

      try {
        switch (action) {
          case "close":
            await this.closeTicket(interaction, chatId);
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
    },
  };
}

async function handleInteractionError(interaction, errorMessage) {
  try {
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    }
  } catch (replyError) {
    console.error(
      "Errore nel tentativo di rispondere all'interazione:",
      replyError
    );
  }
}
