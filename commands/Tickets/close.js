const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "close",
    description: "Close ticket.",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("close")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })
        
        if(client.config.TICKET.CLOSE_ONLY_SUPPORT) return interaction.reply("Only the Staff Team can close the tickets.");
        const topic = interaction.channel.topic;
        
        const userCheck = interaction.guild.members.cache.get(topic);

        if(!userCheck){
            const noTicket = new MessageEmbed()
            .setColor('RED')
            .setDescription(`${client.messages.TICKET.NO_TICKET}`.replace('<user>', `${interaction.user}`))
                
            return interaction.reply({ embeds: [noTicket], ephemeral: true})
        } 
        
        const deleting = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`${client.messages.TICKET.TICKET_DELETED}`.replace('<user>', `${interaction.user}`))

        interaction.reply({ embeds: [deleting]})

        setTimeout(() => {
            interaction.channel.delete()
        }, 5000)

    },
};