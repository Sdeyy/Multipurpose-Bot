const {CommandInteraction, MessageEmbed, Discord } = require("discord.js");
const db = require('../../Models/statisticsModel');
const ticketSchema = require("../../Models/ticketDB");

module.exports = {
    name: "statistics",
    description: "Guild statistics.",
    type: 'CHAT_INPUT',


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("statistics")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

     if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply('No perms')

     const guildData = await ticketSchema.findOne({guildID: interaction.guild.id,})

     if(!guildData) return interaction.reply({ content: 'No data', ephemeral: true})

     const data = await db.findOne({ guildID: interaction.guild.id })

     if(!data) {
         db.create({ guildID: interaction.guild.id })
     }


     const sEmbed = new MessageEmbed()
     .setColor(client.config.EMBEDCOLOR)
     .setTitle('Guild Statistics')
     .setDescription(`💡 **Suggestion Statistics**\n» Total Suggestions: ${data.totalSuggestions}\n» Total Accepted: ${data.totalAccepted}\n» Total Denied: ${data.totalDenied}\n\n🎫 **Ticket Statistics**\n» Total Tickets: ${guildData.ticketCounter}\n» Open Tickets: ${data.ticketsOpen}\n» Claimed Tickets: ${data.ticketsClaimed}`)

     

     interaction.reply({ embeds: [sEmbed]})

    },
};