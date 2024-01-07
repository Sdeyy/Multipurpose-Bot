
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "set-nickname",
    description: "Change your nick.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'User to change the nickname.',
            type: 'USER',
            required: true
        },
        {
            name: 'nick',
            description: 'New nick.',
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

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("nick")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })
        
        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true});

        const user = interaction.options.getMember('user');
        const nick = interaction.options.getString('nick');

        if(interaction.member.roles.highest.position < user.roles.highest.position) return interaction.reply({content: 'You cannot change nickname of someone with a role higher than you', ephemeral: true})  

        interaction.reply({
            content: `The ${user} nickname was successfully changed!`,
            ephemeral: true
        })

        user.setNickname(nick);


    },
};