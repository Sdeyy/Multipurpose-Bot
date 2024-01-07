const { Client, CommandInteraction, MessageEmbed, MessageAttachment } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "qr",
    description: "Generate a QR Code.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "link",
            description: "Enter a link to generate the QR Code.",
            type: "STRING",
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

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("qr")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        const link = interaction.options.getString("link")
        const qrlink = `http://api.qrserver.com/v1/create-qr-code/?data=${link}&size=200x200`

        const embed = new MessageEmbed()
            .setTitle('✅ QR Code Generated')
            .setImage(qrlink)
            .setColor(`${client.config.EMBEDCOLOR}`)
            .setTimestamp()
        interaction.reply({ embeds: [embed], ephemeral: true});
    },
};