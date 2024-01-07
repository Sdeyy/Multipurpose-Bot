const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Discord } = require('discord.js')

module.exports = {
    name: "ping",
    description: "Ping bot.",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("ping")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

        const ping = new MessageEmbed()
        .setColor(`${client.config.EMBEDCOLOR}`)
        .setFooter(`Executed by: ${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
               .setTitle('Ping')
               .setDescription(`:ping_pong: ${Date.now() - interaction.createdTimestamp}ms`)
        interaction.reply({
          embeds:[ping]
        })
    },
};