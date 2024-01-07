
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "promote",
    description: "Promote user.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'User you want to promote.',
            type: 'USER',
            required: true
        },
        {
            name: 'old-rank',
            description: 'Old role that the user had.',
            type: 'ROLE',
            required: true 
        },
        {
            name: 'new-rank',
            description: 'Rank to which you want to promote the user.', // Not required
            type: 'ROLE',
            required: true
        }
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("promote")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })
        
        const user = interaction.options.getMember('user');
        const oldRank = interaction.options.getRole('old-rank');
        const newRank = interaction.options.getRole('new-rank');

        if(!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true});

        const embed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`The user ${user} was promoted!\n${oldRank} ----> ${newRank}`)

        interaction.reply({
            embeds: [embed]
        })

    },
};