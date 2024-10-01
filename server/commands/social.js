import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export const socialCommand = {
  name: "social",
  description: "Mostra i collegamenti ai social media di Wave DevLab",
  execute(interaction) {
    const socialEmbed = new EmbedBuilder()
      .setColor("#DAA520")
      .setTitle("📱 Social Media Wave DevLab")
      .setDescription(
        "Seguici sui nostri canali social per rimanere aggiornato sulle ultime novità e contenuti!"
      )
      .addFields(
        {
          name: "Instagram",
          value:
            "[Seguici su Instagram](https://www.instagram.com/wave.devlab/)",
          inline: true,
        },
        {
          name: "TikTok",
          value: "[Seguici su TikTok](https://www.tiktok.com/@wave.devlab)",
          inline: true,
        }
      )
      .setFooter({
        text: "Wave DevLab - Connettiti con noi!",
        iconURL:
          "https://i.postimg.cc/x89JF0vK/Progetto-senza-titolo-2024-09-10-T003117-165.png",
      })
      .setImage("https://i.postimg.cc/XvGP749w/Supporto-Clienti-3.png");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Instagram")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.instagram.com/wave.devlab/"),
      new ButtonBuilder()
        .setLabel("TikTok")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.tiktok.com/@wave.devlab")
    );

    interaction.reply({
      content: "@everyone",
      embeds: [socialEmbed],
      components: [row],
    });
  },
};
