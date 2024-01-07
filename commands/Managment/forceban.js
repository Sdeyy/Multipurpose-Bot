const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js');
const passwordDB = require('../../Models/password.js');

module.exports = {
    name: "forceban",
    description: "Force ban",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'User to ban.',
            type: 'USER',
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

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("forceban")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        const checks = await passwordDB.findOne({ guildID: interaction.guild.id, access: interaction.user.id});

        if(!checks) return interaction.reply({ content: 'No access (/secret login)', ephemeral: true});

        const user = interaction.options.getMember("user");

        const success = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`The user ${user} was successfully force banned!\n\nReason: **${reason}**`)
        interaction.reply({embeds: [success]})
        
        user.ban();

        
    },
};