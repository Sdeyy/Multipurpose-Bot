
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "say",
    description: "Say a message.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'message',
            description: 'message',
            type: "STRING",
            required: "true"
        },

    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("say")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true});

        const anuncio = interaction.options.getString('message')

        const correct = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setDescription('Message was succesfully sent!')


        interaction.reply({ embeds: [correct], ephemeral: true})
        interaction.channel.send({ content: `${anuncio}`})
        


  


 

    },
};