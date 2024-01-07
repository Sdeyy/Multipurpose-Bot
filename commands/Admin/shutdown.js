const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "shutdown",
    description: "Stop the bot (the bot will not start automaticaly again)",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("shutdown")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })
        
        const embed = new MessageEmbed()
        .setTitle(client.embeds.Embeds.NO_PERMSUSER.TITLE)
        .setDescription(client.embeds.Embeds.NO_PERMSUSER.DESCRIPTION)
        .setColor(client.embeds.Embeds.NO_PERMSUSER.COLOR)

        if(interaction.user.id != client.config.OWNERID) return interaction.reply({ embeds: [embed], ephemeral: true});
        setTimeout(() => {
        interaction.reply({ content: "The bot will start rebooting in a few seconds.", ephemeral: true})
        console.log(`The bot has been restarted by ${interaction.user.id}`)
        client.destroy()
        process.exit()
        }, 2000)

        setTimeout(() => {
        client.login(client.config.TOKEN)
        console.log('Bot restarted successfully!')
            }, 6000)
    },
};