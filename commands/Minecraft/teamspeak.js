const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Client } = require("discord.js");
const db = require('../../Models/mcdata')

module.exports = {
    name: 'teamspeak',
    description: 'Minecraft Server TeamSpeak.',
    permis: 'MANAGE_ROLES',
    botPerms: 'MANAGE_ROLES',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {string[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("teamspeak")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        if(!client.config.MINECRAFT.ENABLED.TEAMSPEAK) return;

        const data = await db.findOne({Guild: interaction.guild.id})
        if (!data) {
           
            return interaction.reply({
                content: 'No data found, set this using /set-mcdata',
                ephemeral: true
            })

        } else {
            await db.findOne({Guild: interaction.guild.id})
            const embedip = new MessageEmbed()
            .setColor(client.config.EMBEDCOLOR)
            .setTitle(`${client.config.SERVER_NAME}`)
            .setDescription(`Hey <@${interaction.user.id}>\n » Server IP: **${data.Ip}**\n » Store: **${data.Store}** \n » TeamSpeak: **${data.Teamspeak}**\n » Status: **${data.Status}**`)
            return interaction.reply({
                embeds: [embedip]
            })
        }
    }
}
