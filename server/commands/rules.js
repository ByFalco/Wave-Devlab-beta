import { EmbedBuilder } from "discord.js";

export const rulesCommand = {
  name: "rules",
  description: "Mostra il regolamento del server",
  execute(message) {
    const rulesEmbed = new EmbedBuilder()
      .setColor("#DAA520")
      .setTitle("📜 Regole Generali Wave DevLab")
      .setDescription(
        "**Benvenuti nel server Discord ufficiale di Wave DevLab!**\n\n" +
          "*Dedicato al supporto clienti per il nostro servizio di creazione e sviluppo di siti web.*\n\n" +
          "Per garantire un'esperienza positiva a tutti i membri, vi preghiamo di seguire queste regole:"
      )
      .addFields(
        {
          name: "1️⃣ Rispetto reciproco",
          value:
            "```Trattate tutti i membri con cortesia e rispetto. Non sono tollerati insulti, molestie o comportamenti offensivi.```",
        },
        {
          name: "2️⃣ Linguaggio appropriato",
          value:
            "```Utilizzate un linguaggio professionale e adatto a tutti. Evitate parolacce, contenuti espliciti o inappropriati.```",
        },
        {
          name: "3️⃣ Canali dedicati",
          value:
            "```Utilizzate i canali appropriati per le vostre domande o discussioni.\nEsempio: #💬・supporto per problemi tecnici, #feedback per suggerimenti.```",
        },
        {
          name: "4️⃣ No spam",
          value:
            "```Evitate di inviare messaggi ripetitivi, pubblicità non autorizzate o contenuti non pertinenti.```",
        },
        {
          name: "5️⃣ Informazioni personali",
          value:
            "```Non condividete informazioni personali sensibili pubblicamente. Se necessario, utilizzate i messaggi privati con lo staff.```",
        },
        {
          name: "6️⃣ Risoluzione dei problemi",
          value:
            "```Prima di chiedere aiuto, controllate le FAQ e i canali di annunci per possibili soluzioni già fornite.```",
        },
        {
          name: "7️⃣ Pazienza",
          value:
            "```Il nostro team di supporto farà del suo meglio per rispondere tempestivamente, ma potrebbero esserci dei tempi di attesa durante i periodi di maggiore affluenza.```",
        },
        {
          name: "8️⃣ Segnalazioni",
          value:
            "```Se notate violazioni del regolamento, segnalatele allo staff utilizzando l'apposita funzione di Discord o contattando un moderatore.```",
        },
        {
          name: "9️⃣ Aggiornamenti e modifiche",
          value:
            "```Questo regolamento può essere soggetto a modifiche. Controllate regolarmente il canale #📣・annunci per eventuali aggiornamenti.```",
        },
        {
          name: "🔟 Conformità",
          value:
            "```L'utilizzo di questo server implica l'accettazione di queste regole. La violazione ripetuta può comportare avvertimenti o ban.```",
        }
      )
      .setFooter({
        text: "Grazie per la vostra collaborazione nel mantenere Wave un luogo accogliente e professionale per tutti i nostri clienti e utenti!",
        iconURL:
          "https://i.postimg.cc/x89JF0vK/Progetto-senza-titolo-2024-09-10-T003117-165.png", // Sostituisci con l'URL del tuo logo
      })
      .setImage("https://i.postimg.cc/m28MJF6h/Supporto-Clienti-2.png");

    message.channel.send({ content: "@everyone", embeds: [rulesEmbed] });
  },
};
