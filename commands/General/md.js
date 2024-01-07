
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "md",
    description: "Send a Direct Message to a user.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'User to DM',
            type: 'USER',
            required: true
        },
        {
            name: 'message',
            description: 'Message to Send',
            type: 'STRING',
            required: true
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("md")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })
        
    if(!interaction.member.permissions.has("MANAGE_GUILD")) return  interaction.reply({ content: `${client.messages.NO_PERMSUSER}`, ephemeral: true });
    const mensaje = interaction.options.getString('message');
    const user = interaction.options.getMember("user")

const embedDM = new MessageEmbed()
.setColor(`${client.config.EMBEDCOLOR}`)
.setTitle("DM Received")
.setDescription(`${mensaje}

MD Sent by: <@${interaction.user.id}> | ${interaction.user.id}`)
const embed = new MessageEmbed()
.setColor(`${client.config.EMBEDCOLOR}`)
.setTitle('MD Successfully sent!')
.setDescription(`You successfully sent a DM to ${user}`)
 interaction.reply({ embeds : [embed], ephemeral: true })
 user.send({ embeds: [embedDM], ephemeral: true })
    },
};