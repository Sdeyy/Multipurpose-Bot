
const { Client, CommandInteraction, MessageEmbed, TextInputComponent, Modal, MessageActionRow } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "announce",
    description: "Create announcement.",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("announce")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) {
            return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true})
        }

            const modal = new Modal()
        .setTitle('Make announcement!')
        .setCustomId("announcement")

        const announce = new TextInputComponent()
        .setCustomId('announce-modal')
        .setLabel(`Announce`)
        .setStyle(`PARAGRAPH`)
        .setRequired(true)
        


        const row1 = new MessageActionRow()
        .addComponents(announce);

        modal.addComponents(row1);

        await interaction.showModal(modal);
    },
};