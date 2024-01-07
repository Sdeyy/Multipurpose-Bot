const { Client, CommandInteraction, MessageEmbed, Modal, TextInputComponent, MessageActionRow, Discord } = require("discord.js");

module.exports = {
    name: "embed",
    description: "Embed Command",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("embed")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

      if(!interaction.member.permissions.has("MANAGE_MESSAGES")) {
        return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true})
    }

    
      const modal = new Modal()
        .setTitle('Make your embed!')
        .setCustomId("embed")

        const title = new TextInputComponent()
        .setCustomId('embed-title')
        .setLabel("What's is the embed title?")
        .setStyle('SHORT')
        .setRequired(false);
        
        const description = new TextInputComponent()
        .setCustomId('embed-description')
        .setLabel("What's is the embed description?")
        .setPlaceholder('Embed Description.')
        .setStyle('PARAGRAPH')
        .setRequired(true);

        const color = new TextInputComponent()
        .setCustomId('embed-color')
        .setLabel("What's is the embed color?")
        .setPlaceholder('RED, GREEN, WHITE, ETC.')
        .setStyle('SHORT')
        .setRequired(true);

        const content = new TextInputComponent()
        .setCustomId('embed-content')
        .setLabel("What's is the embed content?")
        .setPlaceholder('MESSAGE CONTENT (ROLE OR SOME TEXT)')
        .setStyle('SHORT')
        .setRequired(true);

        const row1 = new MessageActionRow()
        .addComponents(title);

        const row2 = new MessageActionRow()
        .addComponents(description);

        const row3 = new MessageActionRow()
        .addComponents(color);

        const row4 = new MessageActionRow()
        .addComponents(content);

        modal.addComponents(row1, row2, row3, row4);

        await interaction.showModal(modal);
        
  

    },
};